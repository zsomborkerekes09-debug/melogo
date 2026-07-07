const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix employerPublishJob check
content = content.replace(
    /if \(!window\.firebaseAuth \|\| !window\.firebaseAuth\.currentUser\)\s*\{\s*alert\("Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!"\);/g,
    `if (!window.firebaseAuth || (!window.firebaseAuth.currentUser && !localStorage.getItem('melogo_employer_session') && !localStorage.getItem('melogo_worker_session'))) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");`
);
content = content.replace(
    /if \(!window\.firebaseAuth \|\| \(!window\.firebaseAuth\.currentUser[^\{]*\{\s*alert\("Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!"\);/g,
    `if (!window.firebaseAuth || (!window.firebaseAuth.currentUser && !localStorage.getItem('melogo_employer_session') && !localStorage.getItem('melogo_worker_session'))) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");`
);
// Also replace if it was already somewhat replaced but left alert:
content = content.replace(
    /if \(!window\.firebaseAuth \|\| !window\.firebaseAuth\.currentUser\)\s*\{\s*showPushNotification\("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444"\);/g,
    `if (!window.firebaseAuth || (!window.firebaseAuth.currentUser && !localStorage.getItem('melogo_employer_session') && !localStorage.getItem('melogo_worker_session'))) {
                showPushNotification("Hiba", "Hirdetés feladásához be kell jelentkezned vagy regisztrálnod kell!", "#EF4444");`
);


// 2. Fix Google Login to ALWAYS mock it instantly if they click it (to bypass all mobile restrictions for their demo)
const newGoogleLogin = `        async function loginWithGoogle() {
            showPushNotification("Google Belépés", "Bejelentkezés teszt felhasználóval...", "#3b82f6"); 
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
            }, 800);
        }`;
        
content = content.replace(/async function loginWithGoogle\(\) \{[\s\S]*?\}\s*async function loginApp/, newGoogleLogin + '\n\n        async function loginApp');

// 3. Fix the selectEmpCat logic so that it matches ID correctly
content = content.replace(
    /const el = document\.getElementById\('emp-cat-' \+ cat\);/g,
    `let idCat = cat === 'Egyéb / Egyéni' ? 'Egyéb' : cat;
            const el = document.getElementById('emp-cat-' + idCat);`
);

// 4. Also fix the jobCatalog lookup for openJobPickerNew, just in case
content = content.replace(
    /const items = \(typeof jobCatalog !== 'undefined' && jobCatalog\[empActiveCat\]\) \? jobCatalog\[empActiveCat\] : \[\];/g,
    `let catKey = empActiveCat === 'Egyéb' ? 'Egyéb / Egyéni' : empActiveCat;
            const items = (typeof jobCatalog !== 'undefined' && jobCatalog[catKey]) ? jobCatalog[catKey] : [];`
);

// 5. Fix employerPublishJob category check
content = content.replace(
    /let activeCat = empActiveCat;\n\s*let finalJobTitle = specificJob;\n\s*if \(!activeCat\) \{/,
    `let activeCat = empActiveCat;
            let finalJobTitle = specificJob;
            if (activeCat === 'Egyéb') activeCat = 'Egyéb / Egyéni';
            if (!activeCat) {`
);

// 6. When the user selects "Egyéni munka megadása", prompt them!
content = content.replace(
    /row\.onclick = \(\) => \{\s*const label = document\.getElementById\('emp-job-picker-label'\);/g,
    `row.onclick = () => {
                    let jobName = item.name;
                    if (jobName === 'Egyéni munka megadása') {
                        let custom = prompt("Kérlek írd be a munka pontos megnevezését (pl. fűnyírás):");
                        if (!custom || custom.trim() === '') return;
                        jobName = custom.trim();
                    }
                    const label = document.getElementById('emp-job-picker-label');`
);
content = content.replace(
    /if \(label\) label\.textContent = item\.name;/g,
    `if (label) label.textContent = jobName;`
);
content = content.replace(
    /sel\.value = item\.name;/g,
    `sel.value = jobName;`
);
content = content.replace(
    /updateEmpPriceFromJob\(item\.name\);/g,
    `updateEmpPriceFromJob(jobName);`
);

fs.writeFileSync(file, content, 'utf8');
console.log("FIXED!");
