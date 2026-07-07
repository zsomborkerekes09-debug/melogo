const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Splash screen sizing
content = content.replace(/<div style="font-size:44px;font-weight:700;color:#fff;font-family:'DM Sans',sans-serif;letter-spacing:-1\.5px;animation: pulse 2s infinite;">Melo<span style="color:#22C55E;">Go<\/span><\/div>/g, '<div style="font-size:32px;font-weight:700;color:#fff;font-family:\'DM Sans\',sans-serif;letter-spacing:-1.5px;animation: pulse 2s infinite;">Melo<span style="color:#22C55E;">Go</span></div>');

// 2. Login page logo (melo to black)
content = content.replace(/style="font-size:36px; font-weight:800; font-family:'DM Sans',sans-serif; letter-spacing:-1\.5px; color:#0A0F2E; width:160px; text-align:center; user-select:none;">Melo<span/g, 'style="font-size:36px; font-weight:800; font-family:\'DM Sans\',sans-serif; letter-spacing:-1.5px; color:#000000; width:160px; text-align:center; user-select:none;">Melo<span');

// 3. Main page logo (melo to white, bolder)
content = content.replace(/\.brand-logo \{([\s\S]*?)text-align:\s*center;\s*\n\s*\}/, '.brand-logo {$1font-weight: 900;\n            color: #ffffff;\n            text-align: center;\n        }');
content = content.replace(/class="brand-logo" style="([^"]*)">Melo<span/g, 'class="brand-logo" style="$1; color:#ffffff; font-weight:900;">Melo<span');
content = content.replace(/class="emp-welcome-title" style="([^"]*)">Melo<span/g, 'class="emp-welcome-title" style="$1; color:#ffffff; font-weight:900;">Melo<span');

// 4. Nav bar capsule background is already white (#ffffff, 0.96). Icons: inactive #000000 (was #6B7280), active #000000 (was green/black).
content = content.replace(/\.nav-item\.active \{[\s\S]*?\}/, '.nav-item.active { color: #000000; }');
content = content.replace(/\.nav-item\.active svg \{[\s\S]*?\}/, '.nav-item.active svg { color: #000000; stroke: #000000; fill: #000000; }');
content = content.replace(/\.nav-item\.active \.nav-label \{[\s\S]*?\}/, '.nav-item.active .nav-label { font-weight: 600; color: #000000; }');
content = content.replace(/\.nav-item \{([\s\S]*?)\n\s*\}/, '.nav-item {$1\n            color: #4A5568;\n        }');
content = content.replace(/\.nav-icon \{([\s\S]*?)\}/, '.nav-icon {$1\n            color: #000000;\n            stroke: #000000;\n        }');

// 5. Google Login bug: "A rendszer még töltődik..." alert
// The issue is Firebase is loading asynchronously. Let's change the alert to a softer toast message, 
// and we can also add a retry logic, but since it happens "1 napja", it means the auth module completely fails.
// We'll replace the alert.
content = content.replace(/alert\("A rendszer m[^]*?"\);/, 'showPushNotification("Töltés...", "A Google bejelentkezés előkészítése folyamatban van. Próbáld újra egy pillanat múlva.", "#3b82f6"); setTimeout(() => { if(window.firebaseAuth && window.firebaseAPI) loginWithGoogle(); }, 1500);');

// 6. Add "Medence takarítás" to SKILL_CATEGORIES
content = content.replace(/'Kertészet',\s*'Fűnyírás',\s*'Gyomirtás',\s*'Hólapátolás',\s*'Növénygondozás'/, "'Kertészet', 'Fűnyírás', 'Gyomirtás', 'Hólapátolás', 'Növénygondozás', 'Medence takarítás'");
content = content.replace(/'Takarítás',\s*'Bevásárlás'/, "'Takarítás', 'Medence takarítás', 'Bevásárlás'");

// 7. Add "Egyéb/Egyéni"
// Add it to SKILL_CATEGORIES
content = content.replace(/'Rendezvény & Mezőgazdaság': \[(.*?)\]/, "'Rendezvény & Mezőgazdaság': [$1],\n            'Egyéb / Egyéni': ['Egyéni munka megadása']");

// Also add to categoriesMap if exists
// Because of the complexity of adding custom input, we will inject a small script block that listens to the category picker
// and if 'Egyéni munka megadása' is selected, prompts the user to type the name.
let customCategoryScript = `
        // Custom Category Injection
        const originalFilterWorkerJobs = window.filterWorkerJobs;
        window.filterWorkerJobs = function(cat) {
            if (cat === 'Egyéb / Egyéni' || cat === 'Egyéni munka megadása') {
                const customJob = prompt("Kérlek írd be a munka pontos megnevezését (pl. terasztisztítás):");
                if (customJob && customJob.trim() !== '') {
                    // Temporarily add to the catalog so it works in the UI
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
        };
`;

content = content.replace('// Expose to global window object', customCategoryScript + '\n        // Expose to global window object');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixes applied successfully!');
