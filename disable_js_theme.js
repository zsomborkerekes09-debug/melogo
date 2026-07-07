const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// The simplest way to disable the JS theme override is to make applyDarkMode return immediately
content = content.replace(/function applyDarkMode\(enabled\)\s*\{\s*enabled = true;/g, 'function applyDarkMode(enabled) {\n            return; // Disabled by AI to force Light Mode via CSS :root\n            enabled = true;');
content = content.replace(/function applyDarkMode\(enabled\)\s*\{/g, 'function applyDarkMode(enabled) {\n            return; // Disabled by AI to force Light Mode via CSS :root\n');

// Wait, I should also make sure :root has the correct --color-green.
// I already set it to #10B981 in the CSS.

fs.writeFileSync(file, content, 'utf8');
console.log('Disabled JS theme overriding.');
