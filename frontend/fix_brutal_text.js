const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const brutalOverrideCSS = `
<style id="brutal-light-text-override">
    /* Brutal override for all job card texts to ensure they are NOT white */
    .job-card * {
        color: #1C1C1E !important;
    }
    .job-card .job-price {
        color: #FF5722 !important;
    }
    .job-card .job-card-badges span {
        color: #636366 !important;
    }
    .job-card svg {
        stroke: #636366 !important;
        fill: none !important;
    }
    .employer-name {
        color: #1C1C1E !important;
    }
    /* Fix for active state pins */
    .filter-pill, .employer-pill, .sort-pill, .msg-filter-pill { color: #636366 !important; border-bottom: 1px solid transparent !important; }
    .filter-pill.active, .employer-pill.active { color: #FF5722 !important; border-bottom: 1px solid #FF5722 !important; }
</style>
</head>`;

if (content.includes('<style id="brutal-light-text-override">')) {
    content = content.replace(/<style id="brutal-light-text-override">[\s\S]*?<\/style>/, '');
}
content = content.replace(/<\/head>/, brutalOverrideCSS);

fs.writeFileSync(file, content, 'utf8');
console.log('Brutal text override applied!');
