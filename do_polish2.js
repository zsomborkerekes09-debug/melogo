const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

function replaceRegex(regex, replacement) {
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        console.log("Success with: " + regex);
    } else {
        console.log("Failed to match: " + regex);
    }
}

// 1. Header margin tweaks
replaceRegex(/\.gps-bar\s*\{[^}]+\}/, '.gps-bar {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-top: 12px;\n}');

// 2. Search Bar
replaceRegex(/\.search-bar\s*\{[^}]+\}/, '.search-bar {\n    background-color: rgba(255,255,255,0.05);\n    border: 1px solid rgba(255,255,255,0.15);\n    border-radius: 20px;\n    height: 48px;\n    gap: 12px;\n    box-sizing: border-box;\n}');
replaceRegex(/\.search-bar input::placeholder\s*\{[^}]+\}/, '.search-bar input::placeholder { color: rgba(255,255,255,0.4); }');

// We also need the search icon size and opacity. Let's see what it's called.
fs.writeFileSync(file, content);
console.log('Script 2 completed.');
