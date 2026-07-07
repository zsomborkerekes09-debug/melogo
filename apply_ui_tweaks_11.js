const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 11 - AUTH SCREEN FIXES (NO DOUBLE BORDERS, NO ARROWS) */

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

/* 3. Container fixes - ensure containers don't have double backgrounds */
.auth-input-container {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    margin-bottom: 16px !important; /* Move margin to container */
}

/* 4. Pill shaped glassy inputs - TARGET ONLY INPUTS */
input.auth-input-field, input.login-input, input[type="email"], input[type="password"], input[type="text"], input[type="tel"] {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-radius: 50px !important; /* Pill shape! */
    height: 56px !important;
    padding-left: 20px !important;
    color: #FFFFFF !important;
    font-size: 15px !important;
    margin-bottom: 0 !important; /* Margin handled by container */
    box-sizing: border-box !important;
    width: 100% !important;
}

/* Focus state */
input.auth-input-field:focus, input.login-input:focus, input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus, input[type="tel"]:focus {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 0.5px solid #CCFF00 !important; /* Neon green border on focus */
    box-shadow: 0 0 15px rgba(204, 255, 0, 0.15) !important;
}

/* 5. Main Submit Button (Neon Green Gradient, NO ARROWS) */
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
    padding: 0 !important;
}

/* Remove old arrow content */
.login-btn::after, .register-btn::after, button[onclick*="submitStep"]::after { content: none !important; display: none !important; }
.login-btn::before, .register-btn::before, button[onclick*="submitStep"]::before { content: none !important; display: none !important; }

/* 6. Apple / Google Buttons - pill shaped */
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

    // Remove batch 10 completely
    const matchOld10 = html.match(/\/\* UI TWEAKS BATCH 10 - AUTH SCREEN OVERHAUL \(IMAGE MATCH\) \*\/[\s\S]*?(?=\/\*|$)/);
    if (matchOld10) {
         html = html.replace(matchOld10[0], '');
    }

    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css += '\n' + tweaksCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully applied batch 11 UI tweaks to ${file}`);
    }
});
