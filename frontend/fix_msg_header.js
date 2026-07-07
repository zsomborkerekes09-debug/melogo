const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const extraCSS = `
<style id="msg-header-fix">
    .msg-midnight-header { background: transparent !important; }
    .msg-midnight-header .brand-logo { color: #1C1C1E !important; }
    /* Re-apply the neon Go here just in case */
    .msg-midnight-header .brand-logo span { color: #c0fc2a !important; text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5) !important; }
    
    /* Fix "Olvasatlan" unread pill background */
    .msg-filter-pill.inactive { background: rgba(0,0,0,0.05) !important; color: #1C1C1E !important; }
    #msg-filter-unread { background: transparent !important; }
</style>
`;

content = content.replace(/<\/head>/, extraCSS + '</head>');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed msg header!');
