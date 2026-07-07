const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const query = 'renderWorkerHome';
const matches = [...html.matchAll(new RegExp(query, 'g'))];

console.log(`=== Matches for '${query}': ${matches.length} ===`);
matches.forEach((m, idx) => {
    const start = m.index;
    const linesBefore = html.substring(0, start).split('\n');
    const lineNum = linesBefore.length;
    console.log(`Match ${idx + 1}: Line ${lineNum}`);
    // Print around the match
    console.log(html.substring(start - 100, start + 200));
    console.log('---');
});
