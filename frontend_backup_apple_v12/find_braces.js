const fs = require('fs');
const code = fs.readFileSync('temp_main.js', 'utf8');
const lines = code.split('\n');
let depth = 0;
let lastFuncLine = 0;
let lastFuncName = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('function ')) {
        lastFuncLine = i + 1;
        lastFuncName = line.trim();
    }
    
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') depth++;
        if (line[j] === '}') depth--;
    }
    
    // If we reach the end of the file and depth > 0, the unclosed brace was likely inside the current function or a previous one that never closed
}

// Let's print the last few functions where depth was tracked.
// Actually, let's track the depth AT the start of each function.
depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('function ')) {
        if (depth > 0) {
            console.log('Function ' + line.trim() + ' starts at depth ' + depth + ' (Line ' + (i+1) + ')');
        }
    }
    
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') depth++;
        if (line[j] === '}') depth--;
    }
}
console.log('Final depth: ' + depth);
