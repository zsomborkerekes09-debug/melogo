const fs = require('fs');

const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

const regex = /on[a-z]+="([^"]+)"/gi;
let match;
let hasError = false;
while ((match = regex.exec(html)) !== null) {
    let code = match[1];
    try {
        new Function(code);
    } catch (e) {
        console.error("Syntax Error in handler:", match[0]);
        console.error("Message:", e.message);
        hasError = true;
    }
}
if (!hasError) console.log("All inline handlers have valid syntax.");
