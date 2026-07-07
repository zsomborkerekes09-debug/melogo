const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/document\.getElementById\('settings-birthyear'\)\?\.value/g, "(document.getElementById('settings-birthyear') ? document.getElementById('settings-birthyear').value : '')");

fs.writeFileSync(path, code);
console.log("Remaining optional chaining removed!");
