const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const cssOverrides = `
<style id="force-modal-text-colors">
    /* Force all text inside the newly white modals to be dark */
    #distance-sheet, #location-sheet,
    #distance-sheet .distance-sheet-title, 
    #location-sheet .distance-sheet-title,
    #distance-sheet .distance-value-display span {
        color: #111111 !important;
    }

    /* Force secondary text (like '1 km', '50 km', 'Csak a kiválasztott...') to be dark gray instead of white */
    #distance-sheet div[style*="color"], #location-sheet div[style*="color"] {
        color: #666666 !important;
    }
    
    /* Exceptions for buttons inside the modals to keep them white text on lava background */
    #distance-sheet button, #location-sheet button {
        color: #FFFFFF !important;
    }
</style>
</head>
`;

content = content.replace(/<\/head>/, cssOverrides.trim() + '\n</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed modal text colors');
