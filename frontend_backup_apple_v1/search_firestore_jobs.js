const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Firestore Jobs Query ---');
lines.forEach((line, idx) => {
    if (line.includes('collection') && line.includes('jobs')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
