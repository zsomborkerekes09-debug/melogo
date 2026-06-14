const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- HTML Definition of settings address inputs ---');
lines.forEach((line, idx) => {
    if (line.includes('settings-address') && line.includes('<input')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
