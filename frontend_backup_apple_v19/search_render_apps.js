const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Search for renderWorkerApplications ---');
lines.forEach((line, idx) => {
    if (line.includes('function renderWorkerApplications')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
