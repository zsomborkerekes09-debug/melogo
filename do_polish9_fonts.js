const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace font weights
// 300 -> 400
content = content.replace(/font-weight:\s*300/g, 'font-weight: 400');
// 700 -> 600
content = content.replace(/font-weight:\s*700/g, 'font-weight: 600');
// 800 -> 600
content = content.replace(/font-weight:\s*800/g, 'font-weight: 600');
// bold -> 600
content = content.replace(/font-weight:\s*bold/g, 'font-weight: 600');
// normal -> 400
content = content.replace(/font-weight:\s*normal/g, 'font-weight: 400');

fs.writeFileSync(file, content);
console.log('Script 9_fonts completed.');
