const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Update the filter for Google Maps to keep colors (water) but desaturated, and keep roads dark
const newCss = `
<style id="super-dark-roads-and-black-dot">
    /* Force user dot to be black */
    .user-gps-dot {
        background: #1C1C1E !important;
        border: 2.5px solid rgba(0,0,0,0.3) !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.3) !important;
    }
    
    /* Keep water (blue) visible but keep map clean and roads crisp */
    .leaflet-layer {
        filter: saturate(0.5) contrast(1.1) brightness(1.05) !important;
        -webkit-filter: saturate(0.5) contrast(1.1) brightness(1.05) !important;
    }
</style>
`;
content = content.replace(/<style id="super-dark-roads-and-black-dot">[\s\S]*?<\/style>/, newCss.trim());

fs.writeFileSync(file, content, 'utf8');
console.log('Restored water colors and small roads');
