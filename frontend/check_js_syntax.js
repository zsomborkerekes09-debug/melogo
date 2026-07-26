const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
const content = fs.readFileSync(file, 'utf8');

// Simple parser to extract script blocks with their approximate line numbers
const regex = /<script([\s\S]*?)>([\s\S]*?)<\/script>/g;
let m;
let index = 0;

while ((m = regex.exec(content)) !== null) {
    index++;
    const attribs = m[1];
    const js = m[2];
    
    // Calculate line number in original file
    const beforeText = content.substring(0, m.index);
    const startLine = beforeText.split('\n').length;
    
    // Skip external scripts
    if (attribs.includes('src=')) continue;
    
    try {
        new Function(js);
    } catch(e) {
        console.error(`❌ Script Block #${index} (starts at line ${startLine}) has JS Error:`);
        console.error(e.stack);
        
        // Let's print the line of code that failed if possible
        if (e.lineNumber || e.message) {
            console.error(`Message: ${e.message}`);
            // Let's parse exact syntax error location if Node can tell us
            try {
                const vm = require('vm');
                const script = new vm.Script(js, { filename: `script-${index}.js` });
            } catch(vmErr) {
                console.error('Detailed VM Error:\n', vmErr.stack);
            }
        }
    }
}
console.log('Syntax scan complete!');
