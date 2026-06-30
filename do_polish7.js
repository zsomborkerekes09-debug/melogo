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

// 1. Bottom nav border
replaceRegex(/\.bottom-nav\s*\{[^}]+\}/, function(match) {
    return match.replace(/border: 1px solid #E5E7EB;/, 'border: 1px solid rgba(255, 255, 255, 0.12);')
                .replace(/background: rgba\(255, 255, 255, 0\.96\);/, 'background: rgba(0, 0, 0, 0.8);'); // Assuming dark mode background
});

// 2. nav-item inactive color & transition
replaceRegex(/\.nav-item\s*\{[^}]+\}/, function(match) {
    return match.replace(/color: var\(--color-text\);/, 'color: rgba(255, 255, 255, 0.4);');
});

// 3. nav-item active
replaceRegex(/\.nav-item\.active\s*\{[^}]+\}/, `.nav-item.active {\n    color: var(--color-green);\n}`);

// 4. nav-item active svg
replaceRegex(/\.nav-item\.active svg\s*\{[^}]+\}/, `.nav-item.active svg {\n    color: var(--color-green);\n    stroke: var(--color-green);\n    stroke-width: 2px;\n}`);

// 5. nav-icon size 24px
replaceRegex(/\.nav-icon\s*\{[^}]+\}/, `.nav-icon {\n    width: 24px;\n    height: 24px;\n    margin-bottom: 2px;\n    stroke: rgba(255, 255, 255, 0.4);\n    transition: stroke-width 0.2s ease, stroke 0.2s ease, color 0.2s ease;\n}`);

// 6. nav-label 10px / 500
replaceRegex(/\.nav-label\s*\{[^}]+\}/, `.nav-label {\n    font-size: 10px;\n    font-weight: 500;\n    transition: font-weight 0.2s ease, color 0.2s ease;\n}`);

// 7. nav-item active nav-label
replaceRegex(/\.nav-item\.active \.nav-label\s*\{[^}]+\}/, `.nav-item.active .nav-label {\n    font-weight: 500;\n    color: var(--color-green);\n}`);

fs.writeFileSync(file, content);
console.log('Script 7 completed.');
