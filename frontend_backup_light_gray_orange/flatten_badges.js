const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Flatten Job Badges
content = content.replace(
    /\.job-badge-cat, \.job-badge-urgent \{\s*padding: 4px 10px !important;\s*border-radius: 50px !important;\s*font-size: 11px !important;\s*font-weight: 500 !important;\s*display: inline-flex !important;\s*align-items: center !important;\s*gap: 4px !important;\s*\}/g,
    `.job-badge-cat, .job-badge-urgent {
    padding: 0 !important;
    border-radius: 0 !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    background: transparent !important;
    color: var(--color-text-muted) !important;
    border: none !important;
}`
);

content = content.replace(
    /\.job-badge-cat \{\s*background: rgba\(255, 255, 255, 0\.1\) !important;\s*color: #FFFFFF !important;\s*\}/g,
    `.job-badge-cat {
    color: var(--color-text-muted) !important;
}`
);

content = content.replace(
    /\.job-badge-urgent \{\s*background: rgba\(239, 68, 68, 0\.15\) !important;\s*color: #EF4444 !important;\s*\}/g,
    `.job-badge-urgent {
    color: #EF4444 !important;
}`
);

content = content.replace(
    /\.job-meta-item \{\s*display: flex;\s*align-items: center;\s*gap: 6px;\s*color: var\(--color-text-muted\);\s*font-size: 12px;\s*\}/g,
    `.job-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 400 !important;
}`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Badges flattened');
