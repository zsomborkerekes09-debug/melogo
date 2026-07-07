const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

// 1. Inject CSS for overlays
const cssInject = `
        /* iOS Notch Global Fixes for Overlays and Absolute Elements */
        .settings-overlay, .emp-form-overlay, .chat-overlay, .action-overlay, #app-login-screen, #onboarding-screen, #splash-screen {
            padding-top: env(safe-area-inset-top) !important;
            box-sizing: border-box;
        }
`;
code = code.replace('.phone-container {', cssInject + '\n        .phone-container {');

// 2. Fix banner.style.top
code = code.replace("banner.style.top = '60px';", "banner.style.top = 'calc(env(safe-area-inset-top, 0px) + 20px)';");

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
console.log("CSS injected!");
