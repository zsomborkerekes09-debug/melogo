const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Switch back to voyager base map
content = content.replace(/a\.basemaps\.cartocdn\.com\/dark_all/g, 'a.basemaps.cartocdn.com/rastertiles/voyager');

// Update the filter for Voyager
const newCss = `
<style id="super-dark-roads-and-black-dot">
    /* Force user dot to be black */
    .user-gps-dot {
        background: #1C1C1E !important;
        border: 2.5px solid rgba(0,0,0,0.3) !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.3) !important;
    }
    
    /* Force map roads to be extremely dark and crisp */
    .leaflet-layer {
        filter: grayscale(100%) contrast(2.0) brightness(1.1) !important;
        -webkit-filter: grayscale(100%) contrast(2.0) brightness(1.1) !important;
    }
</style>
`;
content = content.replace(/<style id="super-dark-roads-and-black-dot">[\s\S]*?<\/style>/, newCss.trim());

fs.writeFileSync(file, content, 'utf8');
console.log('Applied voyager with high contrast grayscale');
