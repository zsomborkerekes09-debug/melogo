const fs = require('fs');
let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

// 1. Fix the tools button matching string (it uses var(--color-text) not 255)
html = html.replace(/\[style\*="255"\]/g, '[style*="var(--color-text)"]');

// 2. Add bulletproof CSS for the custom Action Sheet so it ACTUALLY OPENS
const bulletproofSheetCSS = `
<style id="bulletproof-sheet-fix">
/* Guarantee that the job picker sheet and overlay open when .open is added */
body #app-container #job-picker-overlay {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 100000 !important;
}
body #app-container #job-picker-overlay.open {
    opacity: 1 !important;
    pointer-events: auto !important;
    background: rgba(0,0,0,0.6) !important;
}

body #app-container #job-picker-sheet {
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease, visibility 0.3s ease;
    z-index: 100001 !important;
    background: #1C1C1E !important;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
body #app-container #job-picker-sheet.open {
    transform: translateY(0) !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
}

body #app-container #tutor-picker-overlay.open {
    opacity: 1 !important;
    pointer-events: auto !important;
    background: rgba(0,0,0,0.6) !important;
}
body #app-container #tutor-picker-sheet.open {
    transform: translateY(0) !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
}
</style>
`;

if (!html.includes('id="bulletproof-sheet-fix"')) {
    html = html.replace('</style>', '</style>\n' + bulletproofSheetCSS);
} else {
    html = html.replace(/<style id="bulletproof-sheet-fix">[\s\S]*?<\/style>/, bulletproofSheetCSS);
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Fixed CSS bugs for buttons and sheet!');
