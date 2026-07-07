const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace voyager with dark_all
content = content.replace(/a\.basemaps\.cartocdn\.com\/rastertiles\/voyager/g, 'a.basemaps.cartocdn.com/dark_all');

// Apply the invert filter to the map layers to make it white with dark roads
const css = `
<style id="map-invert-fix">
    .leaflet-layer {
        filter: invert(100%) hue-rotate(180deg) contrast(1.2) !important;
        -webkit-filter: invert(100%) hue-rotate(180deg) contrast(1.2) !important;
    }
</style>
`;
content = content.replace(/<\/head>/, css + '</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied dark_all inverted theme');
