const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Occurrences of settings-address-container ---');
lines.forEach((line, idx) => {
    if (line.includes('settings-address-container')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
