const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the apistyle to hide ALL icons everywhere, and hide landscape
content = content.replace(/apistyle=[^"']+/g, 'apistyle=s.e:l.i|p.v:off,s.t:2|p.v:off');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied aggressive apistyle');
