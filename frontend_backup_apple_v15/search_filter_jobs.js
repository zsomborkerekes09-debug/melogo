const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Job Filtering & Listing Functions ---');
lines.forEach((line, idx) => {
    if (line.includes('function ') && (line.includes('refreshJobList') || line.includes('getFiltered') || line.includes('filter') || line.includes('Job'))) {
        if (idx > 5000) {
            console.log(`${idx + 1}: ${line.trim()}`);
        }
    }
});
