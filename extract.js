const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let scripts = '';
let match;
while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].trim() !== '') {
        scripts += match[1] + '\n';
    }
}
fs.writeFileSync('extracted.js', scripts);
console.log('JS extracted successfully to extracted.js');
