const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const extraCSS = `
<style id="extra-refinements-css">
    /* Extra overrides for Minden feladat and Messages */
    #worker-job-filter-display { 
        background: rgba(255,255,255,0.7) !important; 
        color: #1C1C1E !important; 
        border: 1px solid rgba(0,0,0,0.1) !important; 
        border-radius: 8px !important; 
    }
    
    /* Messages header background fix */
    .msg-list-header {
        background: transparent !important; 
    }
    div[style*="background: var(--color-bg)"] {
        background: transparent !important;
    }
    
    /* Ensure the Map fills cleanly and isn't dark */
    #map-worker-view {
        background: #E5E5EA !important;
    }
    
    /* Ensure Profile screen text is completely dark */
    .profile-section * {
        color: #1C1C1E !important;
    }
    .profile-skill-chip {
        border-color: rgba(0,0,0,0.2) !important;
        color: #1C1C1E !important;
    }
</style>
`;

if (content.includes('<style id="extra-refinements-css">')) {
    content = content.replace(/<style id="extra-refinements-css">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, extraCSS + '</head>');

// Hardcode remove the dark green top from index.html if it's there
content = content.replace(/background: var\(--color-bg\); padding: 24px 20px/g, 'background: transparent; padding: 24px 20px');

fs.writeFileSync(file, content, 'utf8');
console.log('Extra UI Refinements applied successfully!');
