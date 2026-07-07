const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /[^\x00-\x7F]/g;
const nonAsciiChars = html.match(regex);
const unique = [...new Set(nonAsciiChars)];
console.log('Unique non-ASCII characters:', unique.join(''));
