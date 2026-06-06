const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
let o = 0;
let lines = html.split('\n');
let c = 0;
for(let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let opens = (line.match(/<div\b[^>]*>/gi)||[]).length;
    let closes = (line.match(/<\/div>/gi)||[]).length;
    o += opens - closes;
    if (o < 0) {
        console.log('Line ' + (i+1) + ': o=' + o + ' -> ' + line.trim());
        c++;
        if(c > 5) break;
    }
}
