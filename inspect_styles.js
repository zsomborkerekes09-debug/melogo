const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

const regex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const css = match[2];
    if (css.includes('Fix ALL Inline White Backgrounds')) {
        console.log(`Found broken style block! Attrs: [${attrs}], length: ${css.length}`);
    }
}
