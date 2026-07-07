const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Make the user GPS dot explicitly black instead of white/var(--color-text)
content = content.replace(/background: var\(--color-text\); border: 2\.5px solid #fff;/g, 'background: #000000; border: 2.5px solid rgba(0,0,0,0.2); box-shadow: 0 0 10px rgba(0,0,0,0.3);');

// 2. Make the map roads even darker by increasing contrast
content = content.replace(/contrast\(1\.2\)/g, 'contrast(2.0) brightness(0.95)');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed dot and made roads darker');
