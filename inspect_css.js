const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');
const start = html.indexOf('id="ultimate-bulletproof-fix"');
console.log(html.substring(start, start + 800));
