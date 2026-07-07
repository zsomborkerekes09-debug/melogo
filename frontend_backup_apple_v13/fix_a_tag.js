const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const brokenRegex = /const link = <a href="https:\/\/www\.google\.com\/maps[\s\S]*?<\/a>;/g;
const fixedAssignment = 'const link = \\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=\\" target="_blank" style="color:#2563EB; text-decoration:underline;"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E;';

html = html.replace(brokenRegex, fixedAssignment);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed syntax by regex matching the a tag!');
