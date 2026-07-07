const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const css = `
<style id="super-dark-roads-and-black-dot">
    /* Force user dot to be black */
    .user-gps-dot {
        background: #1C1C1E !important;
        border: 2.5px solid rgba(0,0,0,0.2) !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.2) !important;
    }
    
    /* Force map roads to be extremely dark and crisp */
    .leaflet-layer {
        filter: invert(100%) hue-rotate(180deg) contrast(3.0) brightness(0.9) grayscale(100%) !important;
        -webkit-filter: invert(100%) hue-rotate(180deg) contrast(3.0) brightness(0.9) grayscale(100%) !important;
    }
</style>
</head>
`;

if(content.includes('<style id="super-dark-roads-and-black-dot">')) {
    content = content.replace(/<style id="super-dark-roads-and-black-dot">[\s\S]*?<\/style>\s*<\/head>/, css);
} else {
    content = content.replace(/<\/head>/, css);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Applied black dot and super dark roads');
