const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const regex = /let filtered = localChats\.filter\(c => !c\.archived && c\.active !== false\);/;
const replacement = `
            let blockedItems = JSON.parse(localStorage.getItem('melogo_blocked_items') || '[]');
            let filtered = localChats.filter(c => !c.archived && c.active !== false && !blockedItems.includes(c.id));
`;
if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(path, code);
    console.log('Chat filter fixed');
} else {
    console.log('Chat filter not found');
}
