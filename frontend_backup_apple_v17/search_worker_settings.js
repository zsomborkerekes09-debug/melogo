const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- worker-settings definition ---');
lines.forEach((line, idx) => {
    if (line.includes('id="worker-settings"') || line.includes("id='worker-settings'")) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
