const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace light_all with voyager
content = content.replace(/a\.basemaps\.cartocdn\.com\/light_all/g, 'a.basemaps.cartocdn.com/rastertiles/voyager');

fs.writeFileSync(file, content, 'utf8');
console.log('Switched to Voyager theme');
