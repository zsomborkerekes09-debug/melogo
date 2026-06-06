const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
let depth = 0;
for(let i=0; i<lines.length; i++) {
    const l = lines[i];
    const opens = (l.match(/<div\\b[^>]*>/gi) || []).length;
    const closes = (l.match(/<\\/div>/gi) || []).length;
    depth += opens;
    depth -= closes;
    if(l.includes('class="bottom-nav"') || l.includes('SCREEN 3: PROFIL') || l.includes('Diák Chat') || l.includes('id="phone-app"') || l.includes('class="screens-container"') || l.includes('id="app-slider"')) {
        console.log(i + ' (Depth: ' + depth + '): ' + l);
    }
}
