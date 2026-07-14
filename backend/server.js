const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const Stripe = require('stripe');
const { GoogleGenAI } = require('@google/generative-ai');

const admin = require('firebase-admin');

// Firebase Admin Inicializálás (Push Értesítésekhez)
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin sikeresen inicializálva a környezeti változóból.');
  } else if (fs.existsSync('./serviceAccountKey.json')) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin sikeresen inicializálva helyi fájlból.');
  } else {
    console.log('Figyelem: Firebase Admin nincs inicializálva (hiányzó serviceAccountKey.json). Push értesítések nem fognak működni.');
  }
} catch (e) {
  console.error("Hiba a Firebase Admin inicializálása során:", e);
}


// Inicializálás
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Stripe inicializálás (csak ha a kulcs meg van adva)
let stripe;
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('töltsd_ki')) {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('Stripe sikeresen konfigurálva.');
} else {
  console.log('Figyelem: A Stripe kulcs nincs beállítva. A fizetési funkciók korlátozottak lesznek.');
}

// Multer beállítás a képek fogadásához (memóriába mentés az AI feldolgozáshoz)
const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Max 5MB

// ==========================================
// 1. STRIPE CONNECT FIZETÉSI VÉGPONTOK (Escrow)
// ==========================================

/**
 * 1.a Munkavállaló (Diák) onboarding link generálása.
 * Ezzel a linkkel tud a diák regisztrálni a Stripe rendszerébe, hogy megkapja a kiutalásokat.
 */
app.post('/api/payments/create-worker-account', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe nincs konfigurálva.' });
    const { email } = req.body;

    // Express típusú számlát hozunk létre a diáknak
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Generálunk egy linket, ahol a diák megadhatja a személyiét és bankszámláját biztonságosan
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://melogo.hu/reauth', // Újrairányítás ha lejárt a link
      return_url: 'https://melogo.hu/stripe-success', // Visszatérés ha sikeres a regisztráció
      type: 'account_onboarding',
    });

    res.json({ accountId: account.id, url: accountLink.url });
  } catch (error) {
    console.error('Stripe Account hiba:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 1.b Fizetés letétbe helyezése (Escrow).
 * Amikor a munkáltató kiválasztja a diákot, ez a végpont zárolja az összeget.
 * A PaymentIntent 'capture_method: manual' beállítással jön létre, így a pénz zárolt marad.
 */
app.post('/api/payments/hold-funds', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe nincs konfigurálva.' });
    const { amount, customerId } = req.body; // összeg HUF-ban (pl. 10000)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // A Stripe fillérben/fillérnek megfelelő egységben számol (HUF * 100)
      currency: 'huf',
      payment_method_types: ['card'],
      capture_method: 'manual', // Kulcsfontosságú: Letétbe helyezi, nem vonja le azonnal!
      description: 'MelóGo alkalmi munka letét',
    });

    res.json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Letéti fizetés hiba:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 1.c Pénz felszabadítása (Kifizetés).
 * A munka elvégzése és ellenőrzése után a zárolt pénzt felszabadítjuk, levonjuk az 5%-ot,
 * és a maradékot elutaljuk a munkavállaló Stripe Connect számlájára.
 */
app.post('/api/payments/release-funds', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe nincs konfigurálva.' });
    const { paymentIntentId, workerAccountId } = req.body;

    // 1. Első lépésként véglegesítjük a fizetést (Capture)
    const capturedIntent = await stripe.paymentIntents.capture(paymentIntentId);

    // Kiszámítjuk a levonásokat
    const totalAmount = capturedIntent.amount; // fillérben
    const feePercent = parseInt(process.env.PLATFORM_FEE_PERCENT || '5');
    const applicationFee = Math.round(totalAmount * (feePercent / 100)); // 5% platform jutalék fillérben
    const transferAmount = totalAmount - applicationFee; // 95% a diáknak

    // 2. Második lépésként átutaljuk a 95%-ot a diák Connect számlájára
    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: 'huf',
      destination: workerAccountId,
      transfer_group: paymentIntentId,
    });

    res.json({
      status: 'success',
      totalReleased: totalAmount / 100,
      workerReceived: transferAmount / 100,
      platformFee: applicationFee / 100,
      transferId: transfer.id,
    });
  } catch (error) {
    console.error('Kifizetési hiba:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. GEMINI AI KÉPELLENŐRZÉS VÉGPONT
// ==========================================

/**
 * 2.a Munka fotójának AI ellenőrzése.
 * A diák feltölt egy fotót, a szerver elküldi a Gemini 1.5 Flash Vision AI-nak,
 * ami eldönti, hogy a fotó megfelel-e a munka leírásának.
 */
app.post('/api/verify/job-photo', upload.single('photo'), async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nincs kép feltöltve!' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('töltsd_ki')) {
      // Ha nincs beállítva az AI kulcs, visszatérünk egy szimulált sikerrel
      console.log('Figyelem: Gemini API kulcs nincs beállítva. Szimulált jóváhagyás küldése.');
      return res.json({
        approved: true,
        confidenceScore: 95,
        reason: 'Szimulált jóváhagyás (API kulcs hiánya miatt).',
      });
    }

    // Google AI Studio (Gemini) inicializálása
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Átalakítjuk a feltöltött buffer képet a Gemini formátumára
    const imagePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    // A precíz prompt a biztonságos elemzéshez
    const prompt = `
      Elemzőként fogsz dolgozni egy alkalmi munkákat közvetítő alkalmazásban (MelóGo).
      A feladatod, hogy ellenőrizd az elvégzett munkáról készült képet.
      
      A munka címe: "${jobTitle}"
      A munka leírása: "${jobDescription}"
      
      Vizsgáld meg a mellékelt képet és válaszolj a következőkre szigorúan az alábbi JSON formátumban:
      {
        "approved": true/false (true ha a kép valóban a leírt elvégzett munkát ábrázolja, false ha gyanús, nem odaillő kép, fekete kép, vagy internetes stock fotó),
        "confidenceScore": 0-100 (egy százalékos pontosság, mennyire vagy biztos a döntésedben),
        "reason": "Egy rövid, 1-2 mondatos magyar nyelvű indoklás a döntésedről."
      }
      Soha ne válaszolj más szöveggel, csakis a fenti érvényes JSON formátumban!
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();

    // Kiszedjük a JSON-t a válaszból (ha az AI esetleg ```json ``` blokkba tette volna)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiDecision = JSON.parse(text);

    res.json(aiDecision);
  } catch (error) {
    console.error('Gemini AI hiba:', error);
    res.status(500).json({ error: 'Hiba történt az AI elemzés során: ' + error.message });
  }
});


// ==========================================
// 3. PUSH ÉRTESÍTÉSEK (Firebase Cloud Messaging)
// ==========================================

/**
 * 3.a Push értesítés küldése egy konkrét felhasználónak a Push Token (FCM token) alapján.
 */
app.post('/api/notifications/send', async (req, res) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({ error: 'Firebase Admin nincs inicializálva a szerveren.' });
    }

    const { targetToken, title, body, data } = req.body;

    if (!targetToken) {
      return res.status(400).json({ error: 'Nincs megadva céleszköz token (targetToken)!' });
    }

    const message = {
      notification: {
        title: title || 'Új értesítés a MelóGo-ban',
        body: body || 'Kattints ide a részletekért.',
      },
      data: data || {},
      token: targetToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Sikeresen elküldött push értesítés:', response);
    
    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error('Hiba az értesítés küldése közben:', error);
    res.status(500).json({ error: 'Hiba az értesítés küldése során: ' + error.message });
  }
});

// Alap státusz végpont
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    appName: 'MelóGo API Server',
    feePercent: process.env.PLATFORM_FEE_PERCENT || '5%',
    stripeActive: !!stripe,
    aiActive: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('töltsd_ki'),
  });
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`MelóGo Backend Szerver elindult!`);
  console.log(`Port: http://localhost:${PORT}`);
  console.log(`Állapot ellenőrzése: http://localhost:${PORT}/api/status`);
  console.log(`========================================\n`);
});
