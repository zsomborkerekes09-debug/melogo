const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
let open = (html.match(/<div\b[^>]*>/gi) || []).length;
let close = (html.match(/<\/div>/gi) || []).length;
console.log('Open divs: ' + open);
console.log('Close divs: ' + close);
console.log('Difference: ' + (open - close));
