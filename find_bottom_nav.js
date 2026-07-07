const fs = require('fs');
const lines = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8').split('\n');
let start = -1;
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('bottom-nav') && lines[i].includes('<div')) {
        start = i;
        break;
    }
}
if (start !== -1) {
    console.log(lines.slice(start, start + 30).join('\n'));
} else {
    console.log("Not found.");
}
