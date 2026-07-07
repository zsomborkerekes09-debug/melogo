const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Google Login bug
content = content.replace(
    'alert("A rendszer és a Google azonosítás még betöltés alatt áll. Kérlek várj pár másodpercet és próbáld újra!");',
    'showPushNotification("Töltés...", "A Google bejelentkezés előkészítése folyamatban van. Próbáld újra egy pillanat múlva.", "#3b82f6"); setTimeout(() => { if(window.firebaseAuth && window.firebaseAPI) loginWithGoogle(); }, 1500);'
);

// 2. Map GPS timeout fix
content = content.replace(
    'timeout: 10000',
    'timeout: 30000' // Increase timeout
);

// 3. Add Medence takarítás to categories
content = content.replace(
    "'Kertészet', 'Fűnyírás', 'Gyomirtás', 'Hólapátolás', 'Növénygondozás'",
    "'Kertészet', 'Fűnyírás', 'Gyomirtás', 'Hólapátolás', 'Növénygondozás', 'Medence takarítás'"
);

content = content.replace(
    "'Takarítás', 'Bevásárlás'",
    "'Takarítás', 'Medence takarítás', 'Bevásárlás'"
);

// 4. Egyéb kategória (Egyéni munka)
content = content.replace(
    "'Rendezvény & Mezőgazdaság': ['Gondnokság', 'Animátor', 'Felszolgáló', 'Pultos', 'Mezőgazdasági Munka']",
    "'Rendezvény & Mezőgazdaság': ['Gondnokság', 'Animátor', 'Felszolgáló', 'Pultos', 'Mezőgazdasági Munka'],\n            'Egyéb / Egyéni': ['Egyéni munka megadása']"
);

// Inject logic for custom job
let customCategoryScript = `
        // Custom Category Injection
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
        };
`;

content = content.replace(
    '// Expose to global window object',
    customCategoryScript + '\n        // Expose to global window object'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Functional fixes applied cleanly!');
