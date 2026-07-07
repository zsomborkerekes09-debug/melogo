const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const finalPolishCSS = `
<style id="final-polish-css">
    /* 1. Days Hover/Active state to match categories perfectly */
    div[onclick^="setDateFilter"]:hover, 
    div[onclick^="setDateFilter"].active-date, 
    div[onclick^="setDateFilter"][style*="0.15"], 
    div[onclick^="setDateFilter"][style*="rgba(255, 255, 255, 0.15)"] {
        background-color: rgba(0, 0, 0, 0.06) !important;
        color: #1C1C1E !important;
        border-radius: 8px !important;
        border: none !important;
    }
    /* Fixed padding for days so they aren't huge */
    div[onclick^="setDateFilter"] {
        height: auto !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        background-color: transparent !important;
    }
    /* Ensure the day number doesn't inherit opacity issues */
    div[onclick^="setDateFilter"] span {
        opacity: 1 !important;
    }

    /* 2. Tutor Subcategories */
    .tutor-chip:hover, 
    .tutor-chip.active {
        background-color: rgba(0, 0, 0, 0.06) !important;
        color: #1C1C1E !important;
        border-radius: 8px !important;
        border: none !important;
    }
    .tutor-chip {
        color: #636366 !important;
    }
    
    /* 3. Search Bar Overlay Green background fix */
    /* Target any dark green overlay elements like search */
    #search-overlay {
        background-color: #E5E5EA !important; /* Light theme background */
    }
    #search-overlay-input {
        background-color: #FFFFFF !important;
        color: #1C1C1E !important;
        border: 1px solid rgba(0,0,0,0.2) !important;
    }
    /* Fix header of search overlay if it was dark green */
    div[style*="background: #1A241F"], div[style*="background-color: #1A241F"] {
        background-color: #1C1C1E !important;
    }
    
    /* 5. Messages Unread Pill Cut-off */
    .msg-filter-pill {
        box-sizing: border-box !important;
        height: 32px !important;
        display: inline-flex !important;
        align-items: center !important;
        border: 1px solid rgba(0,0,0,0.2) !important;
        padding: 0 14px !important;
    }

    /* 6. Profile Picture Placeholder (Default green to dark gray) */
    .profile-img, .profile-avatar, .user-avatar, #app-profile-screen div[style*="border-radius: 50%"] {
        background-color: #1C1C1E !important;
    }
    
    /* 7. Profile Stats Colors (0 and — to orange) */
    #app-profile-screen .stat-value {
        color: #FF5722 !important;
    }
</style>
`;

if (content.includes('<style id="final-polish-css">')) {
    content = content.replace(/<style id="final-polish-css">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, finalPolishCSS + '</head>');

// 4. Map Theme: Restore CartoDB clean light map (removing noisy OSM)
content = content.replace(/https:\/\/{s}\.tile\.openstreetmap\.org\/{z}\/{x}\/{y}\.png/g, 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied final UI polish!');
