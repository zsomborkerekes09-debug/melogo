const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Occurrences of app-address ---');
lines.forEach((line, idx) => {
    if (line.includes('app-address')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
