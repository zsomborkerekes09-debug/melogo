const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- References to currentRole ---');
lines.forEach((line, idx) => {
    if (line.includes('currentRole')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});

console.log('\n--- References to activeRole ---');
lines.forEach((line, idx) => {
    if (line.includes('activeRole')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
