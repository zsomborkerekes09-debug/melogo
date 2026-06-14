const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for profile-applications-section ---');
lines.forEach((line, idx) => {
    if (line.includes('profile-applications-section')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
