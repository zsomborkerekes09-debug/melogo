const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for chat action buttons ---');
lines.forEach((line, idx) => {
    if (line.includes('chat-detail-overlay') || line.includes('accept') || line.includes('Elfogad') || line.includes('button') && line.includes('chat')) {
        if (idx > 4000 && idx < 5000) {
            console.log(`${idx + 1}: ${line.trim()}`);
        }
    }
});
