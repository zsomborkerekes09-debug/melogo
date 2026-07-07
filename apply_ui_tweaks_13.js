const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 13 - FINAL FIXES (DISABLED BUTTON TEXT SHADOW, SEARCH BAR) */

/* 1. Remove text-shadow from disabled auth button so it's completely grey */
.login-btn:disabled, .register-btn:disabled, button[onclick*="submitStep"]:disabled, button[onclick*="createAccount"]:disabled, button[onclick*="loginUser"]:disabled, button[onclick*="nextStep"]:disabled {
    text-shadow: none !important;
}

/* 2. Fix the Search Bar double-box overlap issue caused by global text input styling */
.search-bar input, .search-overlay-input-wrap input, #home-search-display, #worker-search-input, #text-search-input {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    height: 100% !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding-left: 12px !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css += '\n' + tweaksCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully applied batch 13 UI tweaks to ${file}`);
    }
});
