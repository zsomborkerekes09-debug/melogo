const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const lines = html.split('\n');

// Find all script tags
let pos = 0;
const scriptRegex = /<script([\s\S]*?)>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    scriptIdx++;
    const attribs = match[1];
    const code = match[2];
    const startIndex = match.index + match[0].indexOf(code);
    
    // Calculate line number
    const precedingText = html.substring(0, startIndex);
    const lineNum = precedingText.split('\n').length;
    
    // Skip external scripts
    if (attribs.includes('src=')) {
        console.log(`Script ${scriptIdx}: External (src="${attribs.match(/src="([^"]+)"/)?.[1] || ''}") at line ${lineNum}`);
        continue;
    }
    
    console.log(`Script ${scriptIdx}: Inline at line ${lineNum}, size=${code.length} chars`);
    
    try {
        new vm.Script(code, { filename: `script_${scriptIdx}.js`, lineOffset: lineNum - 1 });
        console.log(`  -> Valid syntax`);
    } catch (e) {
        console.error(`  -> SYNTAX ERROR in Script ${scriptIdx} starting at line ${lineNum}:`);
        console.error(`     Message: ${e.message}`);
        console.error(`     Stack: ${e.stack}`);
        // Let's print surrounding lines of code
        const startLine = Math.max(0, lineNum - 5);
        const endLine = Math.min(lines.length, lineNum + 20);
        console.log(`--- Surrounding Code around error line ---`);
        for (let i = startLine; i < endLine; i++) {
            console.log(`${i+1}: ${lines[i]}`);
        }
    }
}
