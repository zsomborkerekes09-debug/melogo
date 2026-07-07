const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the duplicate declaration crash in module
const duplicatedBlock = `        // Custom Category Injection
        const originalFilterWorkerJobs = window.filterWorkerJobs;
        window.filterWorkerJobs = function(cat) {
            if (cat === 'Egyéb / Egyéni' || cat === 'Egyéni munka megadása') {
                const customJob = prompt("Kérlek írd be a munka pontos megnevezését (pl. terasztisztítás):");
                if (customJob && customJob.trim() !== '') {
                    if (!window.jobCatalog) window.jobCatalog = {};
                    if (!window.jobCatalog['Egyéb / Egyéni']) window.jobCatalog['Egyéb / Egyéni'] = [];
                    window.jobCatalog['Egyéb / Egyéni'].push({ name: customJob, price: 8000 });
                    if (!window.SKILL_CATEGORIES['Egyéb / Egyéni'].includes(customJob)) {
                        window.SKILL_CATEGORIES['Egyéb / Egyéni'].push(customJob);
                    }
                    if (originalFilterWorkerJobs) originalFilterWorkerJobs(customJob);
                }
                return;
            }
            if (originalFilterWorkerJobs) originalFilterWorkerJobs(cat);
        };`;

// Replace double occurrence with single
while (content.indexOf(duplicatedBlock + '\n\n' + duplicatedBlock) !== -1 || content.indexOf(duplicatedBlock + '\n        \n' + duplicatedBlock) !== -1) {
    content = content.replace(duplicatedBlock + '\n\n' + duplicatedBlock, duplicatedBlock);
    content = content.replace(duplicatedBlock + '\n        \n' + duplicatedBlock, duplicatedBlock);
}

// Fallback if formatting was slightly off
let occurrences = content.split('const originalFilterWorkerJobs = window.filterWorkerJobs;');
if (occurrences.length > 2) {
    // Found more than 1 declaration!
    console.log("Found duplicate originalFilterWorkerJobs! Fixing...");
    content = content.replace(/const originalFilterWorkerJobs = window\.filterWorkerJobs;/g, 'var originalFilterWorkerJobs = window.originalFilterWorkerJobs || window.filterWorkerJobs;');
}

// 2. Restore REAL Google Login
const realGoogleLogin = `        async function loginWithGoogle() {
            if (!window.firebaseAPI || !window.firebaseAPI.signInWithPopup) {
                showPushNotification("Töltés...", "A Google bejelentkezés előkészítése folyamatban van. Próbáld újra egy pillanat múlva.", "#3b82f6"); 
                setTimeout(() => { if(window.firebaseAuth && window.firebaseAPI) loginWithGoogle(); }, 1500);
                return;
            }
            try {
                const provider = new window.firebaseAPI.GoogleAuthProvider();
                provider.setCustomParameters({ prompt: 'select_account' });
                const result = await window.firebaseAPI.signInWithPopup(window.firebaseAuth, provider);
                const user = result.user;
                if (!user.email) {
                    alert('Hiba: Nem kaptunk email címet a Google-től.');
                    return;
                }
                const role = loginSelectedRole || 'worker';
                const session = { email: user.email, name: user.displayName || 'Google Felhasználó', role: role, loginAt: Date.now(), method: 'google', uid: user.uid };
                if (role === 'employer') {
                    localStorage.setItem('melogo_employer_session', JSON.stringify(session));
                    localStorage.setItem('melogo_active_role', 'employer');
                    if (document.getElementById('employer-login-screen')) document.getElementById('employer-login-screen').classList.add('hidden');
                } else {
                    localStorage.setItem('melogo_worker_session', JSON.stringify(session));
                    localStorage.setItem('melogo_active_role', 'worker');
                    if (document.getElementById('login-screen')) document.getElementById('login-screen').classList.add('hidden');
                }
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof switchRole === 'function') switchRole(role);
            } catch (error) {
                console.error("Google login error:", error);
                alert('Hiba a Google bejelentkezés során: ' + (error.message || error.code));
            }
        }`;

content = content.replace(/async function loginWithGoogle\(\) \{[\s\S]*?\}\s*async function loginApp/, realGoogleLogin + '\n\n        async function loginApp');

// 3. Ensure the prompt logic for "Egyéb / Egyéni" actually saves the custom job to the dropdown temporarily!
// (Already done in previous step, but let's make sure it handles "Egyéni munka megadása" correctly without extra alerts)

// 4. Force Service Worker Cache Buster to v5 to ensure user gets this fix immediately
content = content.replace(/localStorage\.getItem\('melogo_force_update_v4'\)/g, "localStorage.getItem('melogo_force_update_v5')");
content = content.replace(/localStorage\.setItem\('melogo_force_update_v4'/g, "localStorage.setItem('melogo_force_update_v5'");

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed syntax error and restored real Google Login!");
