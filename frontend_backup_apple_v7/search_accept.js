const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Acceptance functions ---');
lines.forEach((line, idx) => {
    if (line.includes('function ') && (line.includes('Accept') || line.includes('accept') || line.includes('Elfogad') || line.includes('elfogad'))) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
