const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for employer-mini-modal ---');
lines.forEach((line, idx) => {
    if (line.includes('employer-mini-modal') || line.includes('mini-emp')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
