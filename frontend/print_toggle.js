const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

let start = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("role-btn-worker")) {
        start = i;
        break;
    }
}

if (start !== -1) {
    for (let i = Math.max(0, start - 5); i <= Math.min(lines.length - 1, start + 5); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
} else {
    console.log("role-btn-worker nem található!");
}
