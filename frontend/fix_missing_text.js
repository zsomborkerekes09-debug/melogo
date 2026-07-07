const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const missingTextCss = `
<style id="missing-text-fix">
    /* Fix missing text colors for map and messages */
    .map-category-btn { color: #1C1C1E !important; font-weight: 500 !important; }
    .map-category-btn.active { background: rgba(0,0,0,0.1) !important; color: #1C1C1E !important; }
    
    /* Force messages empty state text to be dark */
    div[style*="Jelentkezz egy munkára"] { color: #1C1C1E !important; opacity: 0.8 !important; font-weight: 400 !important; }
</style>
`;

if (content.includes('<style id="missing-text-fix">')) {
    content = content.replace(/<style id="missing-text-fix">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, missingTextCss + '</head>');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed missing text');
