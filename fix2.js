const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<span style="font-size: 13px; color: var(--color-green); font-weight: 500;">Összes</span>', '<span id="worker-job-filter-display" style="font-size: 13px; color: var(--color-green); font-weight: 500;">Összes</span>');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed worker-job-filter-display');
