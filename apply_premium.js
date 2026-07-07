const fs = require('fs');

// 1. Read index.html
let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

// --- HTML DOM INJECTIONS & REPLACEMENTS ---

// 14. Numeric keyboard for price
html = html.replace(/<input\s+type="text"\s+id="emp-price-input"/g, '<input type="text" inputmode="numeric" pattern="[0-9]*" id="emp-price-input"');

// 26. Floating button
if(!html.includes('map-floating-btn')) {
    // Already has map-floating-btn class? Let's check where it's used
}

// 10. Grab Handle thickness
html = html.replace(/width:\s*40px;\s*height:\s*4px;/g, 'width: 36px; height: 5px;'); // Apple standard
html = html.replace(/border-radius:\s*2px;/g, 'border-radius: 3px;');

// Let's inject a massive global <style> for the structural UI/UX rules
const premiumBaseCSS = `
<style id="apple-premium-base">
/* 4. Font antialiasing */
body, input, button, select, textarea {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* 9. Remove blue tap highlight */
* {
    -webkit-tap-highlight-color: transparent !important;
}

/* 12. Hide scrollbars globally */
::-webkit-scrollbar {
    display: none;
}
* {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

/* 5. Heading letter-spacing */
h1, h2, h3, .emp-form-title, .screen-title {
    letter-spacing: -0.02em !important;
}

/* 6. Label letter-spacing */
.emp-section-label, .uppercase-label {
    letter-spacing: 0.05em !important;
}

/* 8. Tap Scale */
.job-card, .emp-cat-card, .btn, button, .action-overlay > div, .apply-bottom-sheet > div {
    transition: transform 0.15s cubic-bezier(0.32, 0.72, 0, 1), background-color 0.2s;
}
.job-card:active, .emp-cat-card:active, .custom-sheet-option:active {
    transform: scale(0.98);
}

/* 2. & 19. Frosted Glass */
.search-bar-container, .top-nav, #search-overlay-input {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}
.bottom-nav {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(28, 28, 30, 0.75) !important; /* Apple tab bar */
    border-top: 0.5px solid rgba(255,255,255,0.1) !important;
}

/* 20. SVG Stroke Width (Normalize to 1.5) */
svg {
    stroke-width: 1.5;
}

/* 21. Tab Bar Active Jump */
.nav-item.active svg {
    transform: scale(1.1);
    transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}
.nav-item:not(.active) svg {
    transform: scale(1);
    transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

/* 23. Soft Shadows */
.job-card {
    box-shadow: 0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.1) !important;
}

/* 30. Safe Area Bottom */
.bottom-nav {
    padding-bottom: env(safe-area-inset-bottom);
}
.apply-bottom-sheet, .action-overlay, .confirm-sheet {
    padding-bottom: calc(24px + env(safe-area-inset-bottom)) !important;
}

/* 34. Smooth blur when keyboard active */
input:focus {
    /* Optional: custom focus style */
}
</style>
`;

if (!html.includes('id="apple-premium-base"')) {
    html = html.replace('</head>', premiumBaseCSS + '\n</head>');
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', html);


// 2. Read generate_dark_preview.js
let genJS = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/generate_dark_preview.js', 'utf8');

// We need to inject the massive Apple Premium Dark Theme rules.
const premiumDarkCSS = `
/* ==========================================
   APPLE PREMIUM DARK THEME OVERRIDES
   ========================================== */
/* 1. Sync Categories and Dates */
.category-btn, .date-btn, div[onclick^="setDateFilter"], .emp-cat-card, .filter-chip {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #FFFFFF !important;
    border: none !important;
    transition: background 0.2s cubic-bezier(0.32, 0.72, 0, 1), transform 0.15s !important;
}
.category-btn:hover, .date-btn:hover, div[onclick^="setDateFilter"]:hover, .emp-cat-card:hover {
    background: rgba(255, 255, 255, 0.12) !important;
}
.category-btn.active, .date-btn.active, div[onclick^="setDateFilter"][style*="0.15"], div[onclick^="setDateFilter"][style*="white"], .emp-cat-card.active, .filter-chip.active {
    background: rgba(255, 255, 255, 0.25) !important; /* Apple Segmented Control Selected */
    color: #FFFFFF !important;
    font-weight: 600 !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
}
/* Ensure JavaScript inline active checks are overridden by !important */
div[onclick^="setDateFilter"] { background: rgba(255, 255, 255, 0.08) !important; color: #FFFFFF !important; }
div[onclick^="setDateFilter"].active-date { background: rgba(255, 255, 255, 0.25) !important; color: #FFFFFF !important; font-weight: 600 !important; }

/* 2. Search Bar */
.search-bar, #search-overlay-input, .search-overlay-input-wrap {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-radius: 14px !important;
    border: none !important;
}
.search-bar:focus-within, #search-overlay-input:focus {
    background-color: rgba(255, 255, 255, 0.12) !important;
}

/* 7. Animations */
* {
    /* Force new bezier curve on transitions */
    transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1) !important;
}

/* 11. Menu item dividers */
.custom-sheet-option {
    border-bottom: 0.5px solid rgba(255,255,255,0.08) !important;
}
.custom-sheet-option:last-child {
    border-bottom: none !important;
}

/* 16. Primary Buttons Glow */
[style*="background: #16C45A"], [style*="background-color: #16C45A"], .login-btn, .register-btn, .job-apply-btn, button.primary, .emp-submit-btn {
    background: linear-gradient(180deg, #32D74B 0%, #28A745 100%) !important;
    color: #000000 !important;
    font-weight: 600 !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 14px rgba(50, 215, 75, 0.3) !important;
    border: none !important;
}
.emp-submit-btn:disabled {
    background: rgba(255,255,255,0.1) !important;
    box-shadow: none !important;
    color: rgba(255,255,255,0.3) !important;
}

/* 17. Apple Toggle */
#urgent-track {
    background: rgba(255,255,255,0.15) !important;
}
input[type="checkbox"]:checked ~ #urgent-track {
    background: #32D74B !important;
}

/* 18. Slider Thumb */
input[type="range"]::-webkit-slider-thumb {
    background: #FFFFFF !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
    border: 0.5px solid rgba(0,0,0,0.1) !important;
}
input[type="range"] {
    background: rgba(255,255,255,0.15) !important;
    /* Track active part handled by JS or CSS custom */
}

/* 22. Badge Apple Red */
.message-badge, .nav-badge, [id*="unread"] {
    background-color: #FF3B30 !important;
    color: #FFFFFF !important;
    border: 2px solid #111111 !important;
    font-weight: 700 !important;
}

/* 26. Map Floating Button */
.map-floating-btn, #emp-gps-btn {
    background: rgba(28, 28, 30, 0.85) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 0.5px solid rgba(255,255,255,0.15) !important;
    color: #32D74B !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
}

/* 27. Avatar gradients */
.default-avatar, #profile-avatar-circle {
    background: linear-gradient(135deg, #8E8E93 0%, #636366 100%) !important;
    color: #FFF !important;
    border: none !important;
}

/* 35. Chat Bubbles */
.chat-bubble-sent {
    background-color: #0A84FF !important;
    color: #FFF !important;
    border-bottom-right-radius: 4px !important; /* Apple tail effect */
}
.chat-bubble-received {
    background-color: #2C2C2E !important;
    color: #FFF !important;
    border-bottom-left-radius: 4px !important;
}

/* Fix missing Safe Area */
.chat-input-area {
    padding-bottom: calc(16px + env(safe-area-inset-bottom)) !important;
}

/* Extra premium touch */
.job-card {
    background: #1C1C1E !important;
    border: 0.5px solid rgba(255,255,255,0.05) !important;
}
`;

// Insert the premiumDarkCSS into the template string before the closing </style>
if (!genJS.includes('APPLE PREMIUM DARK THEME OVERRIDES')) {
    genJS = genJS.replace('</style>', premiumDarkCSS + '\n</style>');
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/generate_dark_preview.js', genJS);
console.log('Script written!');
