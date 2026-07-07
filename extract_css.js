const fs = require('fs');
const code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/generate_dark_preview.js', 'utf8');

const regex = /<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/;
const match = code.match(regex);
if (match) {
    const css = match[1];
    const lines = css.split('\n');
    const startIdx = lines.findIndex(l => l.includes('Profile Screen Specific Overrides'));
    if (startIdx > -1) {
        console.log(lines.slice(startIdx).join('\n'));
    } else {
        console.log("Not found in generate_dark_preview.js");
    }
}
