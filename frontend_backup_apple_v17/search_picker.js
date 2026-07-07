const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for settings-address-picker & display ---');
lines.forEach((line, idx) => {
    if (line.includes('settings-address-picker') || line.includes('settings-current-address-display') || line.includes('settings-address-input')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
