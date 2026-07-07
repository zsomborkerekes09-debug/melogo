const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const regex = /mockJobs/g;
let match;
console.log("=== Occurrences of 'mockJobs' ===");
while ((match = regex.exec(html)) !== null) {
    const start = match.index;
    const excerpt = html.substring(start - 40, start + 80).trim().replace(/\r?\n/g, ' ');
    // Check if this looks like a declaration
    if (excerpt.includes('let ') || excerpt.includes('var ') || excerpt.includes('const ') || excerpt.includes('window.mockJobs')) {
        const linesBefore = html.substring(0, start).split('\n');
        console.log(`Line ${linesBefore.length}: ${excerpt}`);
    }
}
