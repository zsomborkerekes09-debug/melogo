const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Switch to Google Maps
content = content.replace(/a\.basemaps\.cartocdn\.com\/rastertiles\/voyager/g, 'mt1.google.com/vt/lyrs=m');
// Notice: Google maps uses a different coordinate format ?x={x}&y={y}&z={z} but wait, Leaflet supports it via URL template
// Actually Leaflet's standard is {z}/{x}/{y}. Google uses `mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`
// So we need to rewrite the entire setUrl if it was an exact match.
// Let's just find the L.tileLayer line and replace it entirely!
content = content.replace(/L\.tileLayer\('https:\/\/[^']+',/g, "L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',");

// Update the filter for Google Maps to be black and white (grayscale) with low brightness and high contrast
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
        filter: grayscale(100%) contrast(1.3) brightness(1.2) !important;
        -webkit-filter: grayscale(100%) contrast(1.3) brightness(1.2) !important;
    }
</style>
`;
content = content.replace(/<style id="super-dark-roads-and-black-dot">[\s\S]*?<\/style>/, newCss.trim());

fs.writeFileSync(file, content, 'utf8');
console.log('Applied google maps with grayscale');
