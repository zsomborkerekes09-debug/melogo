const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Regex to find the broken closing
// Look for </div>`; followed by <div style="display: flex; gap: 14px;
const regex = /<\/div>`\s*;\s*<div style="display: flex; gap: 14px; font-size: 28px; justify-content: center;" id="chat-stars-container">/g;
const newStr = '</div>\n                    <div style="display: flex; gap: 14px; font-size: 28px; justify-content: center;" id="chat-stars-container">';

let matches = content.match(regex);
console.log('Matches found:', matches ? matches.length : 0);

if (matches) {
    content = content.replace(regex, newStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Replaced successfully.');
} else {
    console.log('Not found.');
}
