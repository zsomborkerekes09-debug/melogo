const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Medence takarítás to SKILL_CATEGORIES
content = content.replace(
    "'Pince/garázs kitakarítása']",
    "'Pince/garázs kitakarítása', 'Medence takarítás']"
);

// Add Medence takarítás to jobCatalog (under Takarítás)
content = content.replace(
    "{ name: 'Pince/garázs kitakarítása', price: 10000 }",
    "{ name: 'Pince/garázs kitakarítása', price: 10000 },\n                { name: 'Medence takarítás', price: 12000 }"
);

// 2. Add Egyéb / Egyéni category
content = content.replace(
    "'Kisebb fuvarok']\n        };",
    "'Kisebb fuvarok'],\n            'Egyéb / Egyéni': ['Egyéni munka megadása']\n        };"
);

content = content.replace(
    "{ name: 'Kisebb fuvarok', price: 7000 }",
    "{ name: 'Kisebb fuvarok', price: 7000 }\n            ],\n            'Egyéb / Egyéni': [\n                { name: 'Egyéni munka megadása', price: 8000 }\n            "
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
console.log('Categories applied safely!');
