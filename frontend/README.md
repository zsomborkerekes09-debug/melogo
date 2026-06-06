# MeloGo - Diák és Munkaadó Piactér Prototípus

Ez a **MeloGo** mobilalkalmazás interaktív frontend prototípusa, amely egyetlen, teljesen önálló HTML fájlban (`index.html`) valósítja meg a teljes alkalmazást. Modern, letisztult dizájnnal, zökkenőmentes animációkkal és valósághű szimulátor kerettel rendelkezik.

## 🚀 Élő Demó & Tesztelés (Vercel)

Az alkalmazást nagyon egyszerűen élesítheted Vercel-en, így a saját telefonodon is tesztelheted:
1. Menj a [vercel.com](https://vercel.com) oldalra, és jelentkezz be a GitHub fiókoddal.
2. Kattints az **"Add New..."** -> **"Project"** gombra.
3. Importáld ezt a `melogo` adattárat (repository).
4. Kattints a **"Deploy"** gombra!
5. Pár másodpercen belül kapsz egy nyilvános HTTPS linket (pl. `melogo.vercel.app`), amit megnyithatsz a telefonodon!

---

## 📱 Hogyan érdemes tesztelni?

1. **Telefonon böngészőből**: Nyisd meg a Vercel által adott linket a saját okostelefonodon.
2. **Kezdőképernyőhöz adás (PWA élmény)**: Mobilon a böngésző menüjében válaszd a *"Hozzáadás a kezdőképernyőhöz"* (Add to Home Screen) opciót. Így egy saját MeloGo ikont kapsz a telefonodra, és megnyitva teljes képernyőn fut majd, mint egy valódi app, böngészősáv nélkül!
3. **Számítógépen**: Nyisd meg a Chrome vagy Edge böngészőben, nyomj egy `F12`-t (vagy jobb klikk -> *Vizsgálat*), és kapcsold be a mobilnézetet (Device Toolbar) az asztali nézet mellett.

---

## 🛠️ Későbbi mobilalkalmazássá alakítás (Android & iOS)

Mivel az alkalmazás szabványos webes technológiákkal (HTML5, CSS3, Vanilla JS) készült és teljesen önálló, a későbbiekben **nagyon egyszerűen valódi mobilalkalmazást (született Android `.apk` és iOS `.ipa` fájlt) tudsz belőle építeni!**

Ehhez a modern ipari sztenderdet, a **Capacitor**-t érdemes használni:
- A Capacitor egy könnyűsúlyú natív wrapper (az Ionic csapata fejleszti).
- Nem kell újraírnod a kódot Flutterben vagy React Native-ben! Ez a pontos kód fog futni a natív alkalmazás belsejében egy nagy teljesítményű WebView-ban.
- Hozzáférést biztosít a natív funkciókhoz (Kamera, Push értesítések, GPS helymeghatározás, Face ID / biometrikus azonosítás) egyszerű JavaScript hívásokon keresztül.

---

## ✨ Főbb funkciók a prototípusban

- **Kétoldalú szerepkör**: Egyetlen kattintással válthatsz a *Munkás* (Diák) és a *Munkaadó* nézet között a profil lapon!
- **20 előre definiált munkatípus**: Intelligens kategória-választó és egyedi ajánlott árazás.
- **Interaktív Csevegő**: Automatikus jelentkezési üzenetküldés és letisztult chat felület.
- **Precíziós szimuláció**: Az összes felugró ablak és részletes nézet a telefon kijelzőjén belül nyílik meg, tökéletesen leképezve egy natív mobil app működését.
