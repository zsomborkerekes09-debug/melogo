const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 12 - TITLE COMPACTNESS AND DISABLED BUTTON STATE */

/* 1. Make the title compact and thinner */
#app-login-screen h2#login-mode-subtitle {
    font-size: 24px !important;
    font-weight: 300 !important; /* Thinner */
    letter-spacing: 0px !important;
}

/* 2. Make the disabled main button completely grey */
.login-btn:disabled, .register-btn:disabled, button[onclick*="submitStep"]:disabled, button[onclick*="createAccount"]:disabled, button[onclick*="loginUser"]:disabled, button[onclick*="nextStep"]:disabled {
    background: #2A2A2C !important; /* Completely dark grey */
    color: #666666 !important; /* Grey text */
    box-shadow: none !important;
    transform: none !important;
    opacity: 1 !important;
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
        console.log(`Successfully applied batch 12 UI tweaks to ${file}`);
    }
});
