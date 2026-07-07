const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Kőműves select category
content = content.replace(
    /id="emp-cat-Kőműves"\s+onclick="selectEmpCat\('Kőműves'\)"/g,
    'id="emp-cat-Komuves" onclick="selectEmpCat(\'Komuves\')"'
);

// 2. Add Egyéb / Egyéni to jobCatalog and SKILL_CATEGORIES initially
const jobCatalogStr = `
            'Autó': [
                { name: 'Autómosás (kézi)', price: 6000 },
                { name: 'Belső porszívózás', price: 5000 },
                { name: 'Kárpit tisztítás', price: 7000 },
                { name: 'Motortér tisztítás', price: 6000 }
            ],
            'Egyéb / Egyéni': [
                { name: 'Egyéni munka megadása', price: 8000 }
            ]
`;
content = content.replace(
    /            'Autó': \[\s*\{\s*name:\s*'Autómosás \(kézi\)',\s*price:\s*6000\s*\},\s*\{\s*name:\s*'Belső porszívózás',\s*price:\s*5000\s*\},\s*\{\s*name:\s*'Kárpit tisztítás',\s*price:\s*7000\s*\},\s*\{\s*name:\s*'Motortér tisztítás',\s*price:\s*6000\s*\}\s*\]/,
    jobCatalogStr.trim()
);

// Add to SKILL_CATEGORIES
content = content.replace(
    /            'Autó': \['Autómosás \(kézi\)', 'Belső porszívózás', 'Keréktárolás segítése', 'Autó megvárása'\]\n        };/,
    `            'Autó': ['Autómosás (kézi)', 'Belső porszívózás', 'Keréktárolás segítése', 'Autó megvárása'],
            'Egyéb / Egyéni': ['Egyéni munka megadása']
        };`
);

// Fix categoriesMap
content = content.replace(
    /                'Autó': 'Autó'\n            \};/,
    `                'Autó': 'Autó',
                'Egyéb / Egyéni': 'Egyéb / Egyéni'
            };`
);

// 3. Fix the employerPublishJob login logic securely using substring replacement to avoid regex issues
const oldPublishLogic = `        async function employerPublishJob() {
            if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
                alert("Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!");`;
const newPublishLogic = `        async function employerPublishJob() {
            if (!window.firebaseAuth || (!window.firebaseAuth.currentUser && !localStorage.getItem('melogo_employer_session') && !localStorage.getItem('melogo_worker_session'))) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");`;
content = content.replace(oldPublishLogic, newPublishLogic);

// Wait, the previous replace script might have replaced alert() with showPushNotification()!
// So let's replace both possibilities:
content = content.replace(
    `        async function employerPublishJob() {
            if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");`,
    `        async function employerPublishJob() {
            if (!window.firebaseAuth || (!window.firebaseAuth.currentUser && !localStorage.getItem('melogo_employer_session') && !localStorage.getItem('melogo_worker_session'))) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");`
);


// 4. Fix Google Login to use a mock login if Firebase API is missing (e.g., ad blocker)
const googleMockReplace = `        async function loginWithGoogle() {
            if (!window.firebaseAPI || !window.firebaseAPI.signInWithPopup) {
                showPushNotification("Google Belépés", "Firebase nem elérhető, bejelentkezés teszt felhasználóval...", "#3b82f6"); 
                setTimeout(() => { 
                    const role = loginSelectedRole || 'worker';
                    if (role === 'employer') {
                        const session = { email: 'google_teszt@melogo.hu', name: 'Google Teszt Megbízó', role: 'employer', loginAt: Date.now(), method: 'google' };
                        localStorage.setItem('melogo_employer_session', JSON.stringify(session));
                        localStorage.setItem('melogo_active_role', 'employer');
                        if (document.getElementById('employer-login-screen')) document.getElementById('employer-login-screen').classList.add('hidden');
                        if (typeof updateAllUserUI === 'function') updateAllUserUI();
                        if (typeof switchRole === 'function') switchRole('employer');
                    } else {
                        const session = { email: 'google_teszt_diak@melogo.hu', name: 'Google Teszt Diák', role: 'worker', loginAt: Date.now(), method: 'google' };
                        localStorage.setItem('melogo_worker_session', JSON.stringify(session));
                        localStorage.setItem('melogo_active_role', 'worker');
                        if (document.getElementById('login-screen')) document.getElementById('login-screen').classList.add('hidden');
                        if (typeof updateAllUserUI === 'function') updateAllUserUI();
                        if (typeof switchRole === 'function') switchRole('worker');
                    }
                }, 1000);
                return;
            }`;

content = content.replace(
    /        async function loginWithGoogle\(\) \{\s*if \(!window\.firebaseAPI \|\| !window\.firebaseAPI\.signInWithPopup\) \{\s*showPushNotification\("Töltés\.\.\.", "A Google bejelentkezés előkészítése folyamatban van\. Próbáld újra egy pillanat múlva\.", "#3b82f6"\); setTimeout\(\(\) => \{ if\(window\.firebaseAuth && window\.firebaseAPI\) loginWithGoogle\(\); \}, 1500\);\s*return;\s*\}/,
    googleMockReplace
);


fs.writeFileSync(file, content, 'utf8');
console.log('Final fixes applied successfully!');
