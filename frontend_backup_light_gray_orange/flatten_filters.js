const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Flatten .category-btn and .sort-pill in CSS
content = content.replace(
    /\.filter-pill, \.employer-pill, \.category-btn, \.sort-pill, \.msg-filter-pill, \.map-chip \{\s*background-color: rgba\(255, 255, 255, 0\.05\) !important;\s*border: none !important;/g,
    `.filter-pill, .employer-pill, .category-btn, .sort-pill, .msg-filter-pill, .map-chip {
    background-color: transparent !important;
    border: none !important;
    padding: 4px 8px !important;`
);

content = content.replace(
    /\.category-btn, \.date-btn, div\[onclick\^="setDateFilter"\], \.emp-cat-card, \.filter-chip, \.search-map-filter-btn \{\s*background: rgba\(255, 255, 255, 0\.06\) !important;\s*border: 0\.5px solid rgba\(255, 255, 255, 0\.05\) !important;/g,
    `.category-btn, .date-btn, div[onclick^="setDateFilter"], .emp-cat-card, .filter-chip, .search-map-filter-btn {
    background: transparent !important;
    border: none !important;
    color: var(--color-text-muted) !important;`
);

content = content.replace(
    /\.category-btn\.active, \.date-btn\.active, div\[onclick\^="setDateFilter"\]\[style\*="0\.15"\], \.emp-cat-card\.active, \.filter-chip\.active, \.search-map-filter-btn\.active \{\s*background: rgba\(255, 255, 255, 0\.15\) !important;\s*color: #FFFFFF !important;/g,
    `.category-btn.active, .date-btn.active, div[onclick^="setDateFilter"][style*="0.15"], .emp-cat-card.active, .filter-chip.active, .search-map-filter-btn.active {
    background: transparent !important;
    color: var(--color-text) !important;
    border-bottom: 1px solid var(--color-text) !important;
    border-radius: 0 !important;`
);

// 2. Change initWorkerDates generation to be flat
const oldDateGen = "`\n                    <div onclick=\"setDateFilter('${isoDate}')\" style=\"min-width: 52px; height: 64px; border-radius: 6px; border: none; background: ${isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box;\">\n                        <span style=\"font-size: 11px; font-weight: 300; color: #FFFFFF; margin-bottom: 2px; opacity: ${isActive ? '1' : '0.6'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'};\">${dayName}</span>\n                        <span style=\"font-size: 16px; font-weight: 300; color: #FFFFFF; opacity: ${isActive ? '1' : '0.8'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'}; font-weight: ${isActive ? '500' : '400'};\">${num}</span>`";

const newDateGen = "`\n                    <div onclick=\"setDateFilter('${isoDate}')\" style=\"padding: 4px 8px; border: none; background: transparent; display: flex; align-items: baseline; gap: 4px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box; color: ${isActive ? 'var(--color-text)' : 'var(--color-text-muted)'}; border-bottom: ${isActive ? '1px solid var(--color-text)' : 'none'};\">\n                        <span style=\"font-size: 14px; font-weight: 500;\">${dayName}</span>\n                        <span style=\"font-size: 14px; font-weight: 400;\">${num}</span>\n                    </div>`";

content = content.replace(oldDateGen, newDateGen);

fs.writeFileSync(file, content, 'utf8');
console.log('Filters flattened successfully!');
