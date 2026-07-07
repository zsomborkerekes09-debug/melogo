const fs = require('fs');

let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

// 1. Remove the old muddy Hyper-Modern design if it exists
if (html.includes('<style id="hyper-modern-redesign">')) {
    html = html.replace(/<style id="hyper-modern-redesign">[\s\S]*?<\/style>/, '');
}

// Fix Textarea clipping ("levágja az első betű tetejét")
// We will add specific padding to the textarea via CSS.

// Clean Premium UI CSS
const cleanPremiumCSS = `
<style id="clean-premium-redesign">
/* ========================================================
   CLEAN & CRISP PREMIUM UI (iOS 15/16 Style Dark Mode)
   ======================================================== */

/* 1. Pure Black Background */
body, html, #app-container, .screen {
    background-color: #000000 !important;
    background-image: none !important;
    color: #FFFFFF !important;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
}

/* 2. Employer Form Overlay */
#employer-form-overlay {
    background: #000000 !important; /* Pure black */
}
.emp-form-header {
    background: #000000 !important;
    border-bottom: 0.5px solid rgba(255,255,255,0.15) !important;
}

/* 3. Category Selector (Letisztult, működő!) */
.emp-cat-card {
    background: #1C1C1E !important; /* Apple System Gray 6 Dark */
    border: none !important;
    border-radius: 14px !important;
    box-shadow: none !important;
    color: #8E8E93 !important;
    font-weight: 500 !important;
    transition: background 0.2s ease, color 0.2s ease !important;
    pointer-events: auto !important; /* Ensure clickable */
    position: relative;
    z-index: 10;
}
.emp-cat-card svg {
    stroke: #8E8E93 !important;
}
.emp-cat-card.active {
    background: #32D74B !important; /* Pure Apple Green */
    color: #000000 !important;
    border: none !important;
}
.emp-cat-card.active svg {
    stroke: #000000 !important;
    filter: none !important;
}

/* 4. "Mi biztosítjuk / Munkás hozza" Buttons (Működő!) */
#tools-btn-employer, #tools-btn-worker {
    background: #1C1C1E !important;
    border: none !important;
    border-radius: 12px !important;
    box-shadow: none !important;
    color: #8E8E93 !important;
    font-weight: 500 !important;
    padding: 16px 20px !important;
    transition: background 0.2s ease, color 0.2s ease !important;
    pointer-events: auto !important;
    position: relative;
    z-index: 10;
}
#tools-btn-employer[style*="FFFFFF"], #tools-btn-worker[style*="FFFFFF"],
#tools-btn-employer[style*="rgb(255, 255, 255)"], #tools-btn-worker[style*="rgb(255, 255, 255)"],
#tools-btn-employer.active, #tools-btn-worker.active {
    background: #32D74B !important;
    color: #000000 !important;
    border: none !important;
    box-shadow: none !important;
    transform: none !important;
}

/* 5. Urgent Switch (Tiszta Apple Replika) */
#urgent-track {
    background: #39393D !important;
    border: none !important;
    box-shadow: none !important;
    height: 31px !important;
    width: 51px !important;
    border-radius: 15.5px !important;
    transition: background 0.2s ease !important;
}
#urgent-thumb {
    width: 27px !important;
    height: 27px !important;
    background: #FFFFFF !important;
    box-shadow: 0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16), 0 3px 1px rgba(0,0,0,0.1) !important;
    border: none !important;
}
input[type="checkbox"]:checked ~ #urgent-track {
    background: #32D74B !important;
    border: none !important;
    box-shadow: none !important;
}

/* 6. Text Inputs & Textarea (Fixing the cutoff!) */
#emp-details, #emp-address, #emp-desc {
    background: #1C1C1E !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px !important;
    color: #FFFFFF !important;
    padding: 16px !important;
    font-size: 16px !important;
    line-height: 1.5 !important;
}
/* Ensure textarea doesn't clip the first line */
textarea#emp-desc {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
    overflow-y: auto !important;
}
#emp-details:focus, #emp-address:focus, #emp-desc:focus {
    border: 1px solid #32D74B !important;
    background: #1C1C1E !important;
    box-shadow: none !important;
    outline: none !important;
}

/* 7. Dropdown Display (Pontos Munka) */
#emp-job-display {
    background: #1C1C1E !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 16px !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    color: #FFFFFF !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}
#emp-job-display:hover {
    background: #2C2C2E !important;
}

/* 8. Submit Button */
.emp-submit-btn {
    background: #32D74B !important;
    border-radius: 14px !important;
    height: 56px !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #000000 !important;
    border: none !important;
    box-shadow: none !important;
    animation: none !important;
    transition: opacity 0.2s ease !important;
}
.emp-submit-btn:active {
    opacity: 0.7 !important;
}
.emp-submit-btn:disabled {
    background: #39393D !important;
    color: #8E8E93 !important;
}

/* Remove Emojis from "Mi biztosítjuk" buttons via JS below, but CSS overrides just in case */
#tools-btn-employer svg, #tools-btn-worker svg {
    display: none !important;
}

/* Ensure no pointer-events blocking */
.emp-form-body {
    pointer-events: auto !important;
}

/* Bottom Sheet */
.action-overlay {
    background: #1C1C1E !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-top: 0.5px solid rgba(255,255,255,0.15) !important;
}
.custom-sheet-option {
    padding: 16px 20px !important;
    font-size: 16px !important;
    font-weight: 400 !important;
    color: #FFFFFF !important;
    border-bottom: 0.5px solid rgba(255,255,255,0.1) !important;
}
.custom-sheet-option:hover {
    background: #2C2C2E !important;
    padding-left: 20px !important; /* Reset the stupid hover indent */
}

/* Price Input Fix */
#emp-price-input {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif !important;
    font-size: 40px !important;
    font-weight: 700 !important;
    text-shadow: none !important;
}

/* Global Cleanups */
* {
    transition-timing-function: ease !important;
}
.job-card, .role-card {
    background: #1C1C1E !important;
    backdrop-filter: none !important;
    border: none !important;
    box-shadow: none !important;
}
.bottom-nav {
    background: rgba(28, 28, 30, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: none !important;
    border-top: 0.5px solid rgba(255,255,255,0.15) !important;
    border-radius: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
}

</style>
`;

if (!html.includes('id="clean-premium-redesign"')) {
    html = html.replace('</style>', '</style>\n' + cleanPremiumCSS);
} else {
    html = html.replace(/<style id="clean-premium-redesign">[\s\S]*?<\/style>/, cleanPremiumCSS);
}

// REMOVE EMOJIS from HTML explicitly for tools buttons
html = html.replace(/📦 Mi biztosítjuk/g, 'Mi biztosítjuk');
html = html.replace(/🔧 Munkás hozza/g, 'Munkás hozza');

// REMOVE EMOJIS from getJobIcon completely!
html = html.replace(/function getJobIcon\(text\) \{[\s\S]*?return '✨';\n\}/, `function getJobIcon(text) { return ''; }`);
// Remove <span class="option-icon"></span> injection
html = html.replace(/<span class="option-icon">\\\$\{icon\}<\/span> /g, '');

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Clean Premium UI Applied!');
