const fs = require('fs');
const acorn = require('acorn');

const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

const regex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    let code = match[1];
    let isModule = match[0].includes('type="module"');
    try {
        acorn.parse(code, { ecmaVersion: 2022, sourceType: isModule ? 'module' : 'script' });
    } catch (e) {
        console.error("Syntax Error found!");
        console.error("Message:", e.message);
        
        // Print the lines around the error
        const lines = code.split('\n');
        const loc = e.loc;
        if (loc) {
            const startLine = Math.max(0, loc.line - 3);
            const endLine = Math.min(lines.length - 1, loc.line + 3);
            console.log(`Error around line ${loc.line}:`);
            for (let i = startLine; i <= endLine; i++) {
                if (i === loc.line - 1) {
                    console.log(`>> ${lines[i]}`);
                } else {
                    console.log(`   ${lines[i]}`);
                }
            }
        }
    }
}
