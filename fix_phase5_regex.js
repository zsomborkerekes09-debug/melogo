const fs = require('fs');
const filePath = 'frontend/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Fix chat mock seeding 1 (the localChats.length === 0 part)
content = content.replace(/if\s*\(\s*localChats\.length\s*===\s*0\s*\)\s*\{[\s\S]*?localStorage\.setItem\('melogo_chats', JSON\.stringify\(localChats\)\);\s*\}/, '// Removed demo seed logic');

// Fix chat mock seeding 2 (the else part)
content = content.replace(/\} else \{\s*\/\/\s*Start fresh[\s\S]*?localStorage\.setItem\('melogo_chats', JSON\.stringify\(localChats\)\);\s*\}/, '} else {\n                    localChats = [];\n                }');

// Fix overlay appending
const initRegex = /\/\/\s*Init\s*document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/i;
const replaceInit = `// Init
        document.addEventListener('DOMContentLoaded', () => {
            const phoneApp = document.getElementById('phone-app');
            document.querySelectorAll('.action-overlay, .settings-overlay, .overlay-success, .confirm-sheet').forEach(el => {
                if (el.parentNode !== phoneApp) {
                    phoneApp.appendChild(el);
                }
            });`;
content = content.replace(initRegex, replaceInit);

fs.writeFileSync(filePath, content);
console.log('Regex replacements applied!');
