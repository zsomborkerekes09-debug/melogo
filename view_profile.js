const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const start = html.indexOf('id="app-profile"');
console.log(html.substring(Math.max(0, start - 50), start + 1500));
