const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const css = `
<style id="final-profile-fix">
    .role-switcher-container { 
        background: rgba(0,0,0,0.06) !important; 
        padding: 4px !important; 
        border-radius: 8px !important; 
        border: 1px solid rgba(0,0,0,0.1) !important; 
    }
    .role-switcher-container .role-btn { 
        border-radius: 6px !important; 
        background: transparent !important;
        color: #636366 !important;
    }
    .role-switcher-container .role-btn.active { 
        background: #FFFFFF !important; 
        color: #1C1C1E !important;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1) !important;
    }
</style>
`;

if (content.includes('<style id="final-profile-fix">')) {
    content = content.replace(/<style id="final-profile-fix">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, css + '</head>');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed profile CSS');
