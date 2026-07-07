const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for delete/complete/close ---');
lines.forEach((line, idx) => {
    if (line.includes('delete') || line.includes('töröl') || line.includes('remove') || line.includes('closeJob') || line.includes('finishJob')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
