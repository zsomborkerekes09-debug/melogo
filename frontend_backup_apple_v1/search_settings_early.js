const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Occurrences of settings address elements in HTML ---');
lines.forEach((line, idx) => {
    if (idx < 7000 && (line.includes('settings-address') || line.includes('settings-current-address-display') || line.includes('settings-address-picker'))) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
