const fs = require('fs');
const content = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/temp_10.js', 'utf8');

let backticks = 0;
let lastBacktickLine = -1;
let openCount = 0;
let inString = false;
let stringChar = '';

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    for (let j = 0; j < l.length; j++) {
        const c = l[j];
        if (c === '\\') { j++; continue; } // skip escaped chars
        if (c === '`') {
            if (openCount === 0) {
                openCount++;
                lastBacktickLine = i + 1;
            } else {
                openCount--;
                if (openCount === 0) lastBacktickLine = -1;
            }
        }
    }
}
console.log('Currently open backtick since line in temp_10:', lastBacktickLine);

// Since temp_10.js starts around line 6835 in index.html (let's check the exact line).
// We can just count backticks in the whole index.html JS section.
