const fs = require('fs');
const path = require('path');

const oldPath = 'C:\\Users\\zsomb\\.gemini\\antigravity\\scratch\\index_old.html';
if (fs.existsSync(oldPath)) {
    const html = fs.readFileSync(oldPath, 'utf8');
    const matches = [...html.matchAll(/renderWorkerHome/g)];
    console.log(`Found ${matches.length} occurrences in index_old.html`);
    matches.forEach((m, idx) => {
        const start = m.index;
        console.log(`Occurrence ${idx+1}:`);
        console.log(html.substring(start - 100, start + 300));
        console.log('---');
    });
} else {
    console.log("index_old.html does not exist at " + oldPath);
}
