const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const target = `// Custom Category Injection
        var originalFilterWorkerJobs = window.filterWorkerJobs;
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

let m1 = code.indexOf(target);
if (m1 !== -1) {
    let m2 = code.indexOf(target, m1 + target.length);
    if (m2 !== -1) {
        code = code.substring(0, m2) + code.substring(m2 + target.length);
        fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
        console.log("Successfully removed duplicate block!");
    } else {
        console.log("Only one block found, no duplicates.");
    }
} else {
    console.log("Block not found at all.");
}
