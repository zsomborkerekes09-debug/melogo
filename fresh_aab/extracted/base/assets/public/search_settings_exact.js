const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search results ---');
lines.forEach((line, idx) => {
    if (line.includes('settings-address-container') || line.includes('settings-address-input') || line.includes('settings-address-suggestions') || line.includes('settings-address-picker')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
