const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const regex = /localStorage\.getItem\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
let match;
console.log("=== LocalStorage getItem calls ===");
while ((match = regex.exec(html)) !== null) {
    const start = match.index;
    const linesBefore = html.substring(0, start).split('\n');
    const lineNum = linesBefore.length;
    console.log(`Line ${lineNum}: ${match[0]}`);
    console.log(`  Context: ${html.substring(start - 40, start + 120).trim().replace(/\r?\n/g, ' ')}`);
    console.log('---');
}
