const fs = require('fs');
const lines = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8').split('\n');
let start1 = -1, start2 = -1;
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('emp-price-input') && lines[i].includes('type="number"')) {
        start1 = i;
    }
    if (lines[i].includes('emp-gps-btn')) {
        start2 = i;
    }
}
console.log("Price input HTML:");
if (start1 !== -1) console.log(lines.slice(start1 - 5, start1 + 15).join('\n'));
console.log("\nGPS button HTML:");
if (start2 !== -1) console.log(lines.slice(start2 - 5, start2 + 5).join('\n'));
