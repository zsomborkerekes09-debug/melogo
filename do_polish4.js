const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

function replaceRegex(regex, replacement) {
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        console.log("Success with: " + regex);
    } else {
        console.log("Failed to match: " + regex);
    }
}

// Category Pills
replaceRegex(/\.category-btn\s*\{[^}]+\}/, '.category-btn {\n    display: inline-flex;\n    align-items: center;\n    padding: 0 16px;\n    height: 34px;\n    background-color: transparent;\n    border: 1px solid rgba(255, 255, 255, 0.20);\n    border-radius: 20px;\n    color: var(--color-text);\n    font-size: 14px;\n    font-weight: 500;\n    cursor: pointer;\n    transition: all 0.15s ease-in-out;\n    flex-shrink: 0;\n    user-select: none;\n    box-sizing: border-box;\n}');
replaceRegex(/\.category-btn\.active\s*\{[^}]+\}/, '.category-btn.active {\n    background-color: var(--color-text) !important;\n    color: var(--color-surface) !important;\n    border-color: var(--color-text) !important;\n}');

// Sort Pills
replaceRegex(/\.sort-pill\s*\{[^}]+\}/, '.sort-pill {\n    display: inline-flex;\n    align-items: center;\n    padding: 0 16px;\n    height: 34px;\n    background-color: transparent;\n    border: 1px solid rgba(255, 255, 255, 0.20);\n    border-radius: 20px;\n    color: var(--color-text);\n    font-size: 14px;\n    font-weight: 500;\n    cursor: pointer;\n    transition: all 0.15s ease-in-out;\n    flex-shrink: 0;\n    user-select: none;\n    gap: 6px;\n    box-sizing: border-box;\n}');
replaceRegex(/\.sort-pill\.active\s*\{[^}]+\}/, '.sort-pill.active {\n    background-color: var(--color-text) !important;\n    color: var(--color-surface) !important;\n    border-color: var(--color-text) !important;\n}');
replaceRegex(/\.sort-pill\.active svg\s*\{[^}]+\}/, '.sort-pill.active svg { stroke: var(--color-surface); }');

// Remove "Állat" category btn from HTML
content = content.replace(/<div class="category-btn" onclick="filterWorkerJobs\('Állat'\)">Állat<\/div>/, '');

// Sort Pills Icons (Lightning bolt outline, ti-arrow-up)
content = content.replace(/Sürgős ⚡/, '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Sürgős');
content = content.replace(/Ár ↑/, 'Ár <i class="ti ti-arrow-up" style="font-size: 14px;"></i>');

// Fade gradient for categories row
// Find <div class="categories-row" ...> and wrap it or add mask-image.
// Actually, we can just add a CSS class or inline style.
content = content.replace(/<div class="categories-row" style="display:flex; gap:6px; overflow-x:auto; padding:0 16px 8px 16px; scrollbar-width:none; -ms-overflow-style:none;">/, 
'<div class="categories-row" style="display:flex; gap:6px; overflow-x:auto; padding:0 16px 8px 16px; scrollbar-width:none; -ms-overflow-style:none; mask-image: linear-gradient(to right, black 90%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);">');

fs.writeFileSync(file, content);
console.log('Script 4 completed.');
