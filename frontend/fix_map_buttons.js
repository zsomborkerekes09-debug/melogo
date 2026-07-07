const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const css = `
<style id="fix-map-buttons-icons">
    /* Fix Leaflet zoom buttons (+ and -) so they are actually visible on the dark button */
    .leaflet-control-zoom a {
        color: #FFFFFF !important;
        text-shadow: none !important;
        font-weight: 600 !important;
    }
    
    /* Fix the GPS floating button icon if it exists */
    .map-floating-btn, .map-floating-btn svg {
        color: #FFFFFF !important;
        stroke: #FFFFFF !important;
    }
</style>
</head>
`;

content = content.replace(/<\/head>/, css.trim() + '\n</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed map button icons');
