const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Fix map filter buttons
    html = html.replace(/const btns = document\.querySelectorAll\('\.search-map-filter-btn'\);\s*btns\.forEach\(b => b\.style\.display\s*=\s*'none'\);/g, "const btns = document.querySelectorAll('.search-map-filter-btn');\n            btns.forEach(b => b.classList.remove('active'));");

    // Fix employer category selector
    html = html.replace(/document\.querySelectorAll\('\.category-grid \.cat-select-btn, \.emp-cat-card'\)\.forEach\(b => b\.style\.display\s*=\s*'none'\);/g, "document.querySelectorAll('.category-grid .cat-select-btn, .emp-cat-card').forEach(b => b.classList.remove('active'));");
    html = html.replace(/document\.querySelectorAll\('\.emp-cat-card'\)\.forEach\(c => c\.style\.display\s*=\s*'none'\);/g, "document.querySelectorAll('.emp-cat-card').forEach(c => c.classList.remove('active'));");

    // Fix sort pills
    html = html.replace(/document\.querySelectorAll\('\.sort-pill'\)\.forEach\(p => p\.style\.display\s*=\s*'none'\);/g, "document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));");

    // Fix map chips
    html = html.replace(/document\.querySelectorAll\('\.map-chip'\)\.forEach\(c => c\.style\.display\s*=\s*'none'\);/g, "document.querySelectorAll('.map-chip').forEach(c => c.classList.remove('active'));");

    fs.writeFileSync(file, html);
    console.log(`Successfully fixed hidden pill/card bugs in ${file}`);
});
