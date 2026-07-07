const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const mapRegex = /L\.map\s*\([\s\S]*?\)/gi;
let match;
console.log("=== Map initialization ===");
while ((match = mapRegex.exec(html)) !== null) {
    const start = match.index;
    const linesBefore = html.substring(0, start).split('\n');
    console.log(`Line ${linesBefore.length}: ${match[0]}`);
    // Print around the map call
    console.log(html.substring(start - 100, start + 300));
    console.log('---');
}
