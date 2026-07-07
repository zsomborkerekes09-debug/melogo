const fs = require('fs');
const code = fs.readFileSync('temp_main.js', 'utf8');
const lines = code.split('\n');
let depth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let prevDepth = depth;
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') depth++;
        if (line[j] === '}') depth--;
    }
    if (depth > prevDepth && depth > 0 && !line.includes('function') && !line.includes('if ') && !line.includes('for ') && !line.includes('while ') && !line.includes('try ') && !line.includes('catch ')) {
        // console.log('Depth increased to ' + depth + ' at line ' + (i+1) + ': ' + line.trim());
    }
}

// Let's just print the exact lines where depth changes from 0 to 1, and 1 to 2.
depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let oldDepth = depth;
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') {
            if (depth === 0) console.log('Depth 0->1 at line ' + (i+1) + ': ' + line);
            if (depth === 1) console.log('Depth 1->2 at line ' + (i+1) + ': ' + line);
            depth++;
        }
        if (line[j] === '}') {
            depth--;
            if (depth === 1) console.log('Depth 2->1 at line ' + (i+1) + ': ' + line);
            if (depth === 0) console.log('Depth 1->0 at line ' + (i+1) + ': ' + line);
        }
    }
}
