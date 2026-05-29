const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the literal \n with a real newline
html = html.replace(/\\n\s*\/\* OVERLAYS CSS RESTORED \*\//, '\n        /* OVERLAYS CSS RESTORED */');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed literal backslash n');
