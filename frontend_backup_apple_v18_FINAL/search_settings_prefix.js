const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Occurrences of settings- ---');
lines.forEach((line, idx) => {
    if (line.includes('settings-') && !line.includes('settings-address')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
