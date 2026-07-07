const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const cssOverrides = `
<style id="force-slider-yellow">
    /* Force slider to use native styling with yellow accent color */
    #distance-slider, input[type="range"] {
        appearance: auto !important;
        -webkit-appearance: auto !important;
        accent-color: #FFC107 !important;
        background: transparent !important;
    }
    
    /* Ensure no green thumbs remain */
    #distance-slider::-webkit-slider-thumb {
        background: #FFFFFF !important;
    }
</style>
</head>
`;

content = content.replace(/<\/head>/, cssOverrides.trim() + '\n</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed slider appearance');
