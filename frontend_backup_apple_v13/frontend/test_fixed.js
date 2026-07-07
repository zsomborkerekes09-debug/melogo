const fs = require('fs');
let html = fs.readFileSync('index_fixed.html', 'utf8');

let index = html.indexOf('Milyen munk');
console.log('Characters around "Milyen munk":');
let snippet = html.substring(index, index + 25);
for(let i = 0; i < snippet.length; i++) {
    console.log(snippet[i] + ' -> ' + snippet.charCodeAt(i));
}
