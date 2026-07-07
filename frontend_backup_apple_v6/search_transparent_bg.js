const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Occurrences of rgba(128,128,128,0.2) ---');
lines.forEach((line, idx) => {
    if (line.includes('rgba(128,128,128,0.2)')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
