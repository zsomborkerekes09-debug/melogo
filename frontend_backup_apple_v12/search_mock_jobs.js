const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- mockJobs initialization ---');
lines.forEach((line, idx) => {
    if (line.includes('mockJobs = [') || line.includes('var mockJobs =') || line.includes('let mockJobs =')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
