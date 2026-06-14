const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');
let path = [];
for(let i=0; i<lines.length; i++) {
    const l = lines[i];
    if(l.includes('id="worker-settings"')) {
        console.log("Worker settings path:", path.filter(Boolean));
        break;
    }
    const openTags = (l.match(/<div/g) || []).length;
    const closeTags = (l.match(/<\/div/g) || []).length;
    
    if (openTags > closeTags) {
        let idMatch = l.match(/id="([^"]+)"/);
        path.push(idMatch ? idMatch[1] : 'div');
    } else if (closeTags > openTags) {
        path.pop();
    }
}
