const fs = require('fs');
const p = 'frontend/index.html';
let c = fs.readFileSync(p, 'utf8');
c = c.split('"Segoe UI"').join("'Segoe UI'");
fs.writeFileSync(p, c);
console.log('Fixed Segoe UI quotes');
