const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const cssOverrides = `
<style id="force-modal-button-text">
    /* Force city names in buttons to be readable */
    #location-sheet .city-select-item {
        color: #111111 !important;
    }
    
    /* Ensure secondary text in distance modal is readable */
    #distance-sheet span {
        color: #111111 !important;
    }
</style>
</head>
`;

content = content.replace(/<\/head>/, cssOverrides.trim() + '\n</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed button text colors');
