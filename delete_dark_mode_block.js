const fs = require('fs');
let file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');
const startTag = '<style id="apple-premium-dark-mode">';
const startIdx = content.indexOf(startTag);
if (startIdx !== -1) {
    const endIdx = content.indexOf('</style>', startIdx);
    if (endIdx !== -1) {
        content = content.substring(0, startIdx) + content.substring(endIdx + 8);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Successfully deleted the entire apple-premium-dark-mode block!');
    } else {
        console.log('Found start tag but not end tag!');
    }
} else {
    console.log('Start tag not found.');
}
