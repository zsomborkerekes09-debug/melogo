const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 9 - GLASSMORPHISM ON LOGIN & REGISTER SCREENS */

/* 1. Glassy Input Fields (kis keretek) */
.auth-input-container, .floating-group input, .input-container, .login-input, .auth-input-field {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
    border-radius: 16px !important;
    color: #FFFFFF !important;
}

/* Input focus state */
.auth-input-container:focus-within, .floating-group input:focus, .login-input:focus, .auth-input-field:focus {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.05) !important;
}

/* 2. Glassy Bottom Buttons (Google, Apple, Csak körülnézek) */
#google-login-btn, #apple-login-btn, .google-btn, .apple-btn, button[onclick*="app-login-screen"], button[onclick*="loginAsGuest"] {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    color: #FFFFFF !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
    border-radius: 16px !important;
}

#google-login-btn:active, #apple-login-btn:active, .google-btn:active, .apple-btn:active, button[onclick*="app-login-screen"]:active {
    background: rgba(255, 255, 255, 0.08) !important;
    transform: scale(0.97) !important;
}

/* 3. Glassy Main Green Button (Elegant, not too much) */
.login-btn, .register-btn, button[onclick*="createAccount"], button[onclick*="loginUser"], button[onclick*="nextStep"] {
    background: linear-gradient(180deg, rgba(50, 215, 75, 0.2) 0%, rgba(40, 167, 69, 0.2) 100%) !important;
    border: 0.5px solid rgba(50, 215, 75, 0.5) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    color: #FFFFFF !important;
    text-shadow: 0 0 10px rgba(50, 215, 75, 0.5) !important;
    font-weight: 600 !important;
    box-shadow: 0 8px 24px rgba(50, 215, 75, 0.15), inset 0 1px 0 rgba(255,255,255,0.1) !important;
    border-radius: 16px !important;
}

.login-btn:active, .register-btn:active, button[onclick*="createAccount"]:active, button[onclick*="loginUser"]:active, button[onclick*="nextStep"]:active {
    background: linear-gradient(180deg, rgba(50, 215, 75, 0.3) 0%, rgba(40, 167, 69, 0.3) 100%) !important;
    transform: scale(0.97) !important;
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
        console.log(`Successfully applied batch 9 UI tweaks to ${file}`);
    }
});
