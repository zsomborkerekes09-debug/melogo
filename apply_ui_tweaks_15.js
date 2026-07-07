const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 15 - FIX SAVE BUTTON & REGISTRATION BUTTON VISIBILITY */

/* 1. Fix the blank white save button on the settings screen by applying the premium green pill style */
.settings-save-btn {
    background: linear-gradient(90deg, #CCFF00 0%, #32D74B 100%) !important;
    color: #000000 !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    border: none !important;
    border-radius: 50px !important;
    box-shadow: 0 8px 24px rgba(204, 255, 0, 0.3) !important;
}

/* 2. Fix the duplicate registration button issue caused by 'display: flex !important' overriding JS */
.login-btn[style*="display: none"], 
#app-auth-btn[style*="display: none"], 
.register-btn[style*="display: none"] {
    display: none !important;
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
        console.log(`Successfully applied batch 15 UI tweaks to ${file}`);
    }
});
