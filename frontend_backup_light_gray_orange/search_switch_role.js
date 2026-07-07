const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Occurrences of switchRole ---');
lines.forEach((line, idx) => {
    if (line.includes('switchRole')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
