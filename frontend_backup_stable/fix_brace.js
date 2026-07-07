const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("handleBlock(reason || 'Nem adott meg okot');")) {
        // Next line should be } (8515)
        // Next next should be } (8516)
        // Next next next should be } (8517)
        // Let's check lines[i+1] and lines[i+2] and lines[i+3]
        if (lines[i+1].includes('}') && lines[i+2].includes('}') && lines[i+3].includes('}')) {
            console.log("Found duplicate } at line " + (i+3));
            lines.splice(i+3, 1); // remove the extra }
            fs.writeFileSync(path, lines.join('\n'));
            console.log("Fixed!");
            break;
        }
    }
}
