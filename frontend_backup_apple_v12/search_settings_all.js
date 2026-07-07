const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- EVERY OCCURRENCE OF settings-address ---');
lines.forEach((line, idx) => {
    if (line.includes('settings-address')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
