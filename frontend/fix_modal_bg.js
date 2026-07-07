const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the dark modal background #1C1C1E with a solid white #FFFFFF so the dark text is readable
content = content.replace(/#distance-sheet, #location-sheet \{\s*background:\s*#1C1C1E/g, '#distance-sheet, #location-sheet {\n        background: #FFFFFF');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed modal background to white');
