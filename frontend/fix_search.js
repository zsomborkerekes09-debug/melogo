const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const fix = `
<style id="super-final-polish">
    /* Search overlay fix */
    .search-overlay-input-wrap { 
        background: #E5E5EA !important; 
    } 
    #search-overlay-input { 
        background: #FFFFFF !important; 
        border: 1px solid rgba(0,0,0,0.1) !important; 
        color: #1C1C1E !important; 
    } 
    .search-overlay-input-wrap svg { 
        stroke: #1C1C1E !important; 
    }
    
    /* Ensure profile stats are orange */
    #app-profile-screen .stat-value {
        color: #FF5722 !important;
    }
</style>
</head>`;

content = content.replace(/<\/head>/, fix);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed search wrapper class');
