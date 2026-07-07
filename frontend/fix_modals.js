const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const cssOverrides = `
<style id="modal-color-fixes">
    /* 1. Make backdrops much darker (less transparent) */
    #distance-sheet-backdrop, #location-sheet-backdrop {
        background: rgba(0,0,0,0.85) !important;
    }

    /* 2. Fix the "Beállítás" button to be brand yellow instead of dark green */
    .distance-confirm-btn {
        background: #FFC107 !important;
        color: #000000 !important;
        border: none !important;
    }

    /* 3. Fix the "Mégse" button to be a neutral dark gray */
    button[onclick="closeLocationSheet()"].distance-confirm-btn {
        background: #2C2C2E !important;
        color: #FFFFFF !important;
    }

    /* 4. Fix the "GPS helyzet észlelése" button to be brand yellow */
    .location-gps-btn {
        background: #FFC107 !important;
        color: #000000 !important;
    }

    /* 5. Fix slider accent color to be yellow */
    input[type="range"] {
        accent-color: #FFC107 !important;
    }
</style>
</head>
`;

content = content.replace(/<\/head>/, cssOverrides.trim() + '\n</head>');

// Fix the slider JS linear gradient to use Yellow instead of whatever it was using
content = content.replace(/linear-gradient\(to right, var\(--color-text\) \$\{pct\}%, #FFFFFF \$\{pct\}%\)/g, 'linear-gradient(to right, #FFC107 ${pct}%, rgba(255,255,255,0.15) ${pct}%)');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied modal color fixes');
