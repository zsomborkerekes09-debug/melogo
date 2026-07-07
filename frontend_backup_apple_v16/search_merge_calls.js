const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- References to mergeFirestoreJobsIntoMock ---');
lines.forEach((line, idx) => {
    if (line.includes('mergeFirestoreJobsIntoMock')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
