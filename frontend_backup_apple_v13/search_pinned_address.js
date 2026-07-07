const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for chat-pinned-address ---');
lines.forEach((line, idx) => {
    if (line.includes('chat-pinned-address')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
