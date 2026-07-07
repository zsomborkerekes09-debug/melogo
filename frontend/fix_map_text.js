const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const mapTextCSS = `
<style id="map-text-fix">
    /* Map buttons text color fix for light map */
    .map-category-btn { color: #1C1C1E !important; }
    .map-category-btn.active { background: rgba(0,0,0,0.1) !important; color: #1C1C1E !important; }
</style>
`;

if (content.includes('<style id="map-text-fix">')) {
    content = content.replace(/<style id="map-text-fix">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, mapTextCSS + '</head>');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed map text');
