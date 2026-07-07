const fs = require('fs');
const lines = fs.readFileSync('temp_main.js', 'utf8').split('\n');
let depth = 0;
let lastZeroLine = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') depth++;
        if (line[j] === '}') depth--;
    }
    if (depth === 0) {
        lastZeroLine = i + 1;
    }
}
console.log('Last line where depth was 0: ' + lastZeroLine);
console.log('Line ' + (lastZeroLine + 1) + ': ' + lines[lastZeroLine]);
console.log('Line ' + (lastZeroLine + 2) + ': ' + lines[lastZeroLine + 1]);
