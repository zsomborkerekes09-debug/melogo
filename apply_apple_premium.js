const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const applePremiumCSS = `
/* ==========================================
   100% APPLE PREMIUM ULTIMATE REDESIGN
   ========================================== */

/* A. FORMOK ÉS BEMENETI MEZŐK */
.auth-input, input:not([type="checkbox"]):not([type="radio"]), textarea, select {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    padding: 16px 20px !important;
    color: #FFFFFF !important;
    font-size: 16px !important; /* Prevents iOS zooming and looks premium */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}
.auth-input:focus, input:not([type="checkbox"]):not([type="radio"]):focus, textarea:focus, select:focus {
    background: rgba(255, 255, 255, 0.12) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05) !important;
    outline: none !important;
}
.auth-input::placeholder, input::placeholder, textarea::placeholder {
    color: rgba(255, 255, 255, 0.4) !important;
}
.password-toggle svg {
    stroke-width: 1.5px !important;
    stroke: rgba(255, 255, 255, 0.5) !important;
}

/* B. GOMBOK (PRIMARY & SECONDARY) */
[style*="background: #16C45A"], [style*="background-color: #16C45A"], .login-btn, .register-btn, .job-apply-btn, button.primary, .emp-submit-btn {
    background: linear-gradient(180deg, #32D74B 0%, #28A745 100%) !important;
    color: #000000 !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em !important;
    border-radius: 16px !important;
    height: 56px !important;
    border: none !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 14px rgba(50, 215, 75, 0.25) !important;
    transition: transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.15s !important;
}
[style*="background: #16C45A"]:active, [style*="background-color: #16C45A"]:active, .login-btn:active, .register-btn:active, .job-apply-btn:active, button.primary:active, .emp-submit-btn:active {
    transform: scale(0.97) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(50, 215, 75, 0.15) !important;
}
.emp-submit-btn:disabled, button:disabled {
    background: rgba(255, 255, 255, 0.1) !important;
    color: rgba(255, 255, 255, 0.3) !important;
    box-shadow: none !important;
}
.google-btn, button[onclick="loginAsGuest()"] {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #FFFFFF !important;
    border: 0.5px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 16px !important;
    font-weight: 500 !important;
    height: 56px !important;
}
.google-btn:active, button[onclick="loginAsGuest()"]:active {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: scale(0.97) !important;
}

/* C. TIPOGRÁFIA ÉS CÍMSOROK */
h1, h2, .auth-title, .home-header, [style*="font-size: 28px"], [style*="font-size: 24px"], [style*="font-size: 32px"] {
    font-size: 34px !important;
    font-weight: 700 !important;
    letter-spacing: -1px !important;
    line-height: 1.2 !important;
}
.brand-logo {
    font-weight: 700 !important;
    letter-spacing: -1px !important;
}
.brand-logo span {
    color: #32D74B !important;
}
.auth-subtitle, .welcome-text {
    font-size: 17px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    font-weight: 400 !important;
}
.terms-text, .auth-bottom-link, [style*="font-size: 11px"], [style*="font-size: 12px"] {
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    line-height: 1.4 !important;
}
.terms-text a, .auth-bottom-link a {
    color: #FFFFFF !important;
    font-weight: 500 !important;
    text-decoration: underline !important;
}

/* D. KÁRTYÁK ÉS KONTÉNEREK */
.emp-stat-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: none !important;
}
.emp-stat-card.active {
    background: rgba(255, 255, 255, 0.15) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}
.emp-stat-card.active .stat-value, .emp-stat-card.active .stat-label {
    color: #FFFFFF !important;
}
.job-card, .emp-ad-item {
    background: rgba(28, 28, 30, 0.6) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 20px !important;
    padding: 20px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
}
.empty-illustration {
    opacity: 0.1 !important;
    filter: grayscale(100%) !important;
}
#bottom-nav, .bottom-nav {
    border-top: 0.5px solid rgba(255, 255, 255, 0.1) !important;
}
.emp-floating-plus-circle {
    background: linear-gradient(180deg, #32D74B 0%, #28A745 100%) !important;
    box-shadow: 0 4px 12px rgba(50, 215, 75, 0.3) !important;
}

/* E. DÁTUM ÉS SZŰRŐVÁLASZTÓK */
.category-btn, .date-btn, div[onclick^="setDateFilter"], .emp-cat-card, .filter-chip, .search-map-filter-btn {
    background: rgba(255, 255, 255, 0.06) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 24px !important;
    min-height: 38px !important;
    color: rgba(255, 255, 255, 0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
.category-btn.active, .date-btn.active, div[onclick^="setDateFilter"][style*="0.15"], .emp-cat-card.active, .filter-chip.active, .search-map-filter-btn.active {
    background: #FFFFFF !important;
    color: #000000 !important;
    font-weight: 600 !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(255,255,255,0.2) !important;
}
.category-btn.active svg, .emp-cat-card.active svg {
    stroke: #000000 !important;
}
.search-bar, #search-overlay-input, .search-overlay-input-wrap {
    background: rgba(255, 255, 255, 0.12) !important;
    border: none !important;
    border-radius: 12px !important;
}
.search-bar svg {
    stroke: rgba(255, 255, 255, 0.5) !important;
}

/* Kártya Orange/Primary szegélyének eltávolítása (Glow fix) */
div[style*="border-color: var(--color-primary)"], div[style*="border: 1px solid var(--color-primary)"], div[style*="border: 2px solid var(--color-primary)"],
div[style*="border-color: #FFAA00"], div[style*="border: 1px solid #FFAA00"] {
    border-color: rgba(255, 255, 255, 0.2) !important;
    box-shadow: none !important;
}
div[style*="color: var(--color-primary)"], div[style*="color: #FFAA00"] {
    color: #FFFFFF !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1].replace(/\/\* ==========================================\s*100% APPLE PREMIUM ULTIMATE REDESIGN[\s\S]*?(?=\<\/style\>|$)/g, '');
        css = css.replace(/\s*$/, '');
        
        css += '\n' + applePremiumCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        
        fs.writeFileSync(file, html);
        console.log(`Successfully injected ultimate Apple redesign into ${file}`);
    } else {
        console.log(`apple-premium-dark-mode not found in ${file}`);
    }
});
