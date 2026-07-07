const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for app-address ---');
lines.forEach((line, idx) => {
    if (line.includes('id="app-address"') || line.includes("id='app-address'")) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
