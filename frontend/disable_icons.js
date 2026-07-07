const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Append s.t:all|s.e:l.i|p.v:off (hide all icons) to the existing apistyle
content = content.replace(/apistyle=s\.t:3\|p\.v:off,s\.t:5\|p\.v:off,s\.t:2\|p\.v:off/g, 'apistyle=s.t:3|p.v:off,s.t:5|p.v:off,s.t:2|p.v:off,s.t:all|s.e:l.i|p.v:off');

fs.writeFileSync(file, content, 'utf8');
console.log('Disabled all map icons');
