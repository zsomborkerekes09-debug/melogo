const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const regex = /<script.*?>([\s\S]*?)<\/script>/gi;
let match;
let hasError = false;
while ((match = regex.exec(html)) !== null) {
    const code = match[1];
    try {
        new Function(code);
    } catch (e) {
        console.error("Syntax Error in script block:", e.message);
        console.error("Code snippet:", code.substring(0, 100) + '...');
        hasError = true;
    }
}
if (!hasError) console.log("All inline scripts have valid syntax.");
