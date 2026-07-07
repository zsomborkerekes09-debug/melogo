const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

const regex = /<script.*?>([\s\S]*?)<\/script>/g;
let match;
while ((match = regex.exec(html)) !== null) {
    const snippet = match[1].substring(0, 200);
    if (snippet.includes('\\n') || snippet.includes('APPLE PREMIUM')) {
        console.log("Found suspicious script:", snippet);
    }
}
console.log('Script check done.');
