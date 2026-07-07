const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 10 - AUTH SCREEN OVERHAUL (IMAGE MATCH) */

/* 1. Background Gradient (Dark grey with neon green glow at top) */
#app-login-screen {
    background: radial-gradient(120% 100% at 50% 0%, rgba(204, 255, 0, 0.18) 0%, rgba(204, 255, 0, 0.05) 25%, #121214 70%, #0E0E10 100%) !important;
}

/* 2. Left align titles & subtitles */
#app-login-screen h2#login-mode-subtitle {
    text-align: left !important;
    font-size: 32px !important;
    font-weight: 700 !important;
    letter-spacing: -1px !important;
    margin-bottom: 8px !important;
}
#app-login-screen > div[style*="text-align:center"]:nth-child(2) {
    text-align: left !important;
}
#app-login-screen div[style*="font-size:18px"] {
    text-align: left !important;
    font-size: 28px !important;
    font-weight: 700 !important;
    letter-spacing: -0.5px !important;
}
#app-login-screen div[style*="font-size:13px"] {
    text-align: left !important;
    font-size: 15px !important;
    margin-top: 8px !important;
    margin-bottom: 32px !important;
    color: rgba(255,255,255,0.6) !important;
    line-height: 1.5 !important;
}

/* 3. Pill shaped glassy inputs */
.auth-input-container, .floating-group input, .input-container, .login-input, .auth-input-field {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-radius: 50px !important; /* Pill shape! */
    height: 56px !important;
    padding-left: 20px !important;
    color: #FFFFFF !important;
    font-size: 15px !important;
    margin-bottom: 16px !important;
}

/* Focus state */
.auth-input-container:focus-within, .floating-group input:focus, .login-input:focus, .auth-input-field:focus {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 0.5px solid #CCFF00 !important; /* Neon green border on focus */
    box-shadow: 0 0 15px rgba(204, 255, 0, 0.15) !important;
}

/* 4. Main Submit Button (Neon Green Gradient) */
.login-btn, .register-btn, button[onclick*="createAccount"], button[onclick*="loginUser"], button[onclick*="nextStep"], button[onclick*="submitStep"] {
    background: linear-gradient(90deg, #CCFF00 0%, #32D74B 100%) !important;
    border: none !important;
    border-radius: 50px !important; /* Pill shape! */
    height: 56px !important;
    color: #000000 !important; /* Black text on neon green */
    font-weight: 600 !important;
    font-size: 16px !important;
    position: relative !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    box-shadow: 0 8px 24px rgba(204, 255, 0, 0.3) !important;
    margin-top: 16px !important;
    text-transform: none !important;
}

/* Add the '>>' icon to the right of the button */
.login-btn::after, .register-btn::after, button[onclick*="submitStep"]::after {
    content: ">>";
    position: absolute !important;
    right: 24px !important;
    font-weight: 800 !important;
    font-size: 18px !important;
    letter-spacing: -2px !important;
    opacity: 0.4 !important;
}

/* Left circle arrow */
.login-btn::before, .register-btn::before, button[onclick*="submitStep"]::before {
    content: "→";
    position: absolute !important;
    left: 8px !important;
    width: 40px !important;
    height: 40px !important;
    background: rgba(255,255,255,0.3) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-weight: bold !important;
    font-size: 18px !important;
}

/* Adjust button text to not overlap with icons */
.login-btn, .register-btn, button[onclick*="submitStep"] {
    padding-left: 20px !important;
    padding-right: 20px !important;
}

/* 5. Apple / Google Buttons - make them pill shaped too */
#google-login-btn, #apple-login-btn, .google-btn, .apple-btn, button[onclick*="app-login-screen"], button[onclick*="loginAsGuest"] {
    border-radius: 50px !important;
    height: 56px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Remove old batch 9 tweaks to avoid conflicts with new design
    const matchOld = html.match(/\/\* UI TWEAKS BATCH 9 - GLASSMORPHISM ON LOGIN & REGISTER SCREENS \*\/[\s\S]*?(?=\/\*|$)/);
    if (matchOld) {
         html = html.replace(matchOld[0], '');
    }

    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css += '\n' + tweaksCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully applied batch 10 UI tweaks to ${file}`);
    }
});
