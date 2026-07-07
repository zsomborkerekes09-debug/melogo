const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Google Login mock
content = content.replace(
    'alert("A rendszer és a Google azonosítás még betöltés alatt áll. Kérjük, várj pár másodpercet és próbáld újra.");',
    'showPushNotification("Töltés...", "A Google bejelentkezés előkészítése folyamatban van. Próbáld újra egy pillanat múlva.", "#3b82f6"); setTimeout(() => { if(window.firebaseAuth && window.firebaseAPI) loginWithGoogle(); }, 1500);'
);

// Also remove the block for job posting if guest mode
content = content.replace(
    /if \(!window\.firebaseAuth \|\| !window\.firebaseAuth\.currentUser\) \{[\s\S]*?return;\n            \}/,
    `if (!window.firebaseAuth || (!window.firebaseAuth.currentUser && !localStorage.getItem('melogo_employer_session') && !localStorage.getItem('melogo_worker_session'))) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");
                localStorage.removeItem('melogo_guest_mode');
                if (typeof window.updateRegistrationStepUI === 'function') {
                    window.updateRegistrationStepUI(0);
                }
                return;
            }`
);


// 2. Add Egyéb / Egyéni to employer grid
let egyebCard = `
                                <div class="emp-cat-card" id="emp-cat-Egyéb" onclick="selectEmpCat('Egyéb / Egyéni')">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                    Egyéb
                                </div>
`;
content = content.replace(
    '<div class="emp-cat-card" id="emp-cat-Autó" onclick="selectEmpCat(\'Autó\')">',
    egyebCard + '\n                                <div class="emp-cat-card" id="emp-cat-Autó" onclick="selectEmpCat(\'Autó\')">'
);

// 3. Add to worker job categories (scrollable list)
let egyebBtn = `
                        <div class="category-btn" onclick="filterWorkerJobs('Egyéb / Egyéni')">Egyéb</div>
`;
content = content.replace(
    '<div class="category-btn" onclick="filterWorkerJobs(\'Autó\')">Autó</div>',
    egyebBtn + '\n                        <div class="category-btn" onclick="filterWorkerJobs(\'Autó\')">Autó</div>'
);

// 4. Map chips
let egyebChip = `
                        <div class="map-chip" onclick="filterMapPins('Egyéb', this)">Egyéb</div>
`;
content = content.replace(
    '<div class="map-chip" onclick="filterMapPins(\'Autó\', this)">Autó</div>',
    egyebChip + '\n                        <div class="map-chip" onclick="filterMapPins(\'Autó\', this)">Autó</div>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('UI buttons and login fixes applied!');
