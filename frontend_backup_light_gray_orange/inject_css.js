const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const styleFix = `
<style>
    .search-bar { background: transparent !important; border: none !important; box-shadow: none !important; }
    .job-card { background: transparent !important; border-radius: 0 !important; border-top: none !important; border-left: none !important; border-right: none !important; border-bottom: 0.5px solid var(--color-border) !important; padding: 16px 0 !important; margin: 0 16px !important; box-shadow: none !important; min-height: auto !important; }
    #home-search-display { background: transparent !important; font-size: 26px !important; color: var(--color-text) !important; padding: 0 !important; font-weight: 600 !important; }
</style>
</head>`;

content = content.replace(/<\/head>/, styleFix);
fs.writeFileSync(file, content, 'utf8');
console.log('Injected ultimate Notion overrides');
