const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the overly broad button text color rule
content = content.replace(/#distance-sheet button, #location-sheet button \{\s*color: #FFFFFF !important;\s*\}/, `
    /* Exceptions ONLY for primary/secondary action buttons to have white text */
    .distance-confirm-btn, .location-gps-btn {
        color: #FFFFFF !important;
    }
    /* Explicitly force city select buttons to have black text */
    #location-sheet .city-select-item, #location-sheet .city-select-item span {
        color: #111111 !important;
    }
`);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed overly broad button text color');
