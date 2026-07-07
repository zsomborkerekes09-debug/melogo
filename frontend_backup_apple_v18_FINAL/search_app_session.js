const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for melogo_app_session ---');
lines.forEach((line, idx) => {
    if (line.includes('melogo_app_session')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
