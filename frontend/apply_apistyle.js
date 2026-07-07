const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// The regex matches the existing Google Maps tile URL. We replace it with the stylized one.
content = content.replace(/mt1\.google\.com\/vt\/lyrs=m(&x=\{x\}&y=\{y\}&z=\{z\})?/g, 'mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&apistyle=s.t:3|p.v:off,s.t:5|p.v:off,s.t:2|p.v:off');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied Google Maps apistyle');
