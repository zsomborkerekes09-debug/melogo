const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/https:\/\/{s}\.basemaps\.cartocdn\.com\/rastertiles\/light_all\/{z}\/{x}\/{y}\{r\}\.png/g, 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
content = content.replace(/https:\/\/{s}\.basemaps\.cartocdn\.com\/light_all\/{z}\/{x}\/{y}\.png/g, 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced map tiles');
