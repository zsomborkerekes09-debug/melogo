const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const cssOverrides = `
<style id="modal-solid-and-lava">
    /* 1. Make the modal sheets themselves completely solid (not transparent) */
    #distance-sheet, #location-sheet {
        background: #1C1C1E !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
    }

    /* 2. Change buttons and slider to Lava Orange (#FF5722) instead of Amber Yellow (#FFC107) */
    .distance-confirm-btn {
        background: #FF5722 !important;
        color: #FFFFFF !important;
    }
    
    /* Keep "Mégse" button dark gray */
    button[onclick="closeLocationSheet()"].distance-confirm-btn {
        background: #2C2C2E !important;
        color: #FFFFFF !important;
    }

    .location-gps-btn {
        background: #FF5722 !important;
        color: #FFFFFF !important;
    }

    #distance-slider, input[type="range"] {
        accent-color: #FF5722 !important;
    }
</style>
</head>
`;

content = content.replace(/<\/head>/, cssOverrides.trim() + '\n</head>');

// Ensure any inline JS gradient uses Lava Orange if it's still running
content = content.replace(/#FFC107/g, '#FF5722');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied solid modal background and lava orange');
