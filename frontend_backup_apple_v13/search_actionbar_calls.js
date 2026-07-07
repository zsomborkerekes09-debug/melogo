const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- References to updateChatActionBar ---');
lines.forEach((line, idx) => {
    if (line.includes('updateChatActionBar')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
