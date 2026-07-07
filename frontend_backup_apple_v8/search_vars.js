const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- References to regConfirmedAddress ---');
lines.forEach((line, idx) => {
    if (line.includes('regConfirmedAddress')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});

console.log('\n--- References to settingsConfirmedAddress ---');
lines.forEach((line, idx) => {
    if (line.includes('settingsConfirmedAddress')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
