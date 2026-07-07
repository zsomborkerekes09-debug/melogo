const fs = require('fs');

const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
const html = fs.readFileSync(file, 'utf8');
const start = html.indexOf('id="app-login-screen"');
console.log(html.substring(Math.max(0, start + 4500), start + 7000));
