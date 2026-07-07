const fs = require('fs');

// Copy original index.html
fs.copyFileSync(
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
);

let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

// --- 1. HTML & JS MANIPULATIONS ---
if (!code.includes('color-scheme')) {
    code = code.replace('<head>', '<head>\n    <meta name="color-scheme" content="dark">');
}

// Remove the "Körülnézek regisztráció nélkül" button safely by hiding it
code = code.replace(/<button[^>]*onclick="loginAsGuest\(\)"[^>]*>.*?Körülnézek.*?<\/button>/gis, '<button style="display:none;">Removed</button>');

// Fix date pills JS styling specifically for Apple Premium Look
code = code.replace(/background: \$\{isActive \? 'rgba\(255,255,255,0\.15\)' : '#1D1D1F'\}/g, "background: ${isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}");
code = code.replace(/background: \$\{isActive \? '#FFFFFF' : 'rgba\\(255,255,255,0\\.08\\)'\}/g, "background: ${isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}");
code = code.replace(/border: 0\.5px solid \$\{isActive \? 'rgba\(255,255,255,0\.15\)' : '#333336'\}/g, "border: none");
code = code.replace(/color: #FFFFFF; margin-bottom: 2px; opacity: \$\{isActive \? '1' : '0\.6'\}/g, "color: #FFFFFF; margin-bottom: 2px; opacity: ${isActive ? '1' : '0.6'}; font-weight: ${isActive ? '500' : '400'}");
code = code.replace(/color: \$\{isActive \? '#000000' : '#FFFFFF'\}; margin-bottom: 2px; opacity: \$\{isActive \? '1' : '0\.6'\}; font-weight: \$\{isActive \? '600' : '300'\}/g, "color: #FFFFFF; margin-bottom: 2px; opacity: ${isActive ? '1' : '0.6'}; font-weight: ${isActive ? '500' : '400'}");
code = code.replace(/color: #FFFFFF; opacity: \$\{isActive \? '1' : '0\.8'\}/g, "color: #FFFFFF; opacity: ${isActive ? '1' : '0.8'}; font-weight: ${isActive ? '500' : '400'}");
code = code.replace(/color: \$\{isActive \? '#000000' : '#FFFFFF'\}; opacity: \$\{isActive \? '1' : '0\.8'\}; font-weight: \$\{isActive \? '600' : '300'\}/g, "color: #FFFFFF; opacity: ${isActive ? '1' : '0.8'}; font-weight: ${isActive ? '500' : '400'}");

// Remove broken date pills JS styling - handled entirely in CSS now

// --- 2. MAP TILES FIX ---
// Replace Carto Light with Carto Dark automatically
code = code.replace(
    /basemaps\.cartocdn\.com\/rastertiles\/light_all/g,
    'basemaps.cartocdn.com/rastertiles/dark_all'
);
code = code.replace(/tile\.openstreetmap\.org/g, 'basemaps.cartocdn.com/dark_all');
code = code.replace(/https:\/\/\{s\}\.tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/g, 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png');
code = code.replace(/light_all/g, 'dark_all');

// --- 3. INJECT THE NEW STRICT DARK CSS ---
const strictDarkCSS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style id="apple-premium-dark-mode">

/* Root variables reset - Apple iOS 15 Settings/WWDC inspired */
:root {
    --color-chat-bg: var(--color-bg) !important;
    --color-chat-bubble-in: #1C1C1E !important;
    --color-chat-bubble-out: #30D158 !important;
    --color-chat-text-in: #FFFFFF !important;
    --color-chat-text-out: #FFFFFF !important;
    --color-chat-border-in: #333336 !important;
    --color-bg: #000000 !important;
    --color-surface: #1C1C1E !important;
    --color-text: #FFFFFF !important;
    --color-text-light: rgba(235,235,245,0.6) !important;
    --color-border: rgba(84,84,88,0.35) !important;
    --color-text-muted: rgba(235,235,245,0.30) !important;
    --color-green: #AAFF00 !important; /* Keep brand accent */
    --color-navy: #000000 !important;
    --color-chat-bg: #000000 !important;
    --color-chat-bubble-in: #1C1C1E !important;
    --color-chat-bubble-out: #0066CC !important; /* Apple iMessage blue */
    --color-chat-text-in: #FFFFFF !important;
    --color-chat-text-out: #FFFFFF !important;
}

/* Backgrounds for Screens ONLY (fixes the map overlap issue) */
/* We DO NOT target .screen generally to avoid messing with map visibility logic */
body, html, #app-container, #app-home-screen, #app-messages-screen, #app-profile-screen, #app-login-screen { 
    background-color: var(--color-bg) !important; 
    color: var(--color-text) !important; 
    font-family: 'Inter', sans-serif !important;
}

/* Hide scrollbars safely */
::-webkit-scrollbar { display: none !important; }

/* Global Typography & Interactions */
button, .job-card, .filter-pill, .nav-item, .msg-filter-pill, .employer-pill, .category-btn, .sort-pill {
    font-family: 'Inter', sans-serif !important;
    transition: transform 120ms ease-in-out, background-color 150ms ease-in-out !important;
    box-shadow: none !important;
}
button:active, .job-card:active, .filter-pill:active, .msg-filter-pill:active {
    transform: scale(0.97) !important;
}

/* ==========================================
   HEADERS
   ========================================== */
.home-header, .header-midnight, .msg-midnight-header, .msg-filter-row, .profile-midnight-header, .profile-header {
    background-color: var(--color-bg) !important;
    border: none !important;
    box-shadow: none !important;
}
.brand-logo { color: var(--color-text) !important; }
.brand-logo span { color: var(--color-green) !important; }

/* ==========================================
   HOME SCREEN SPECIFICS
   ========================================== */
.welcome-text { color: var(--color-text-light) !important; font-size: 13px !important; font-weight: 400 !important; }
.user-first-name-display { color: var(--color-text-light) !important; }

/* Search Bar & Overlays */
.search-bar, #search-overlay-input, .search-overlay-input-wrap {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border: none !important;
}
.search-bar input { background: transparent !important; color: var(--color-text) !important; }

/* Add hover state for date pills */
div[onclick^="setDateFilter"]:hover { background: rgba(255, 255, 255, 0.08) !important; }
div[onclick^="setDateFilter"]:active { background: rgba(255, 255, 255, 0.12) !important; }
.search-bar input::placeholder { color: var(--color-text-muted) !important; }

.gps-location { color: var(--color-text-light) !important; }
.gps-dot { background-color: var(--color-green) !important; }
.distance-pill-btn { background-color: #1C1C1E !important; border: 1px solid var(--color-border) !important; color: var(--color-text) !important; }

#worker-job-filter-display { background-color: #1C1C1E !important; border: 1px solid var(--color-border) !important; color: rgba(255,255,255,0.70) !important; }

/* Date Selector explicitly styled via JS regex above. Override specific spans if needed */
div[onclick^="setDateFilter"] span:first-child { font-size: 10px !important; }
div[onclick^="setDateFilter"] span:last-child { font-size: 18px !important; font-weight: 600 !important;}

/* ==========================================
   CARDS (Apple iOS 15 Style)
   ========================================== */
.job-card, .emp-ad-item {
    background-color: var(--color-surface) !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: none !important;
}
.job-card:active { background-color: #2C2C2E !important; }
.job-title { color: var(--color-text) !important; }
.job-price { color: var(--color-green) !important; }
.job-meta, .job-meta-item, .job-card [class*="address"], .job-card [class*="distance"] { color: var(--color-text-light) !important; }
.urgent-badge, [class*="urgent"] { background-color: rgba(170,255,0,0.12) !important; border: 1px solid rgba(170,255,0,0.30) !important; color: var(--color-green) !important; }

/* ==========================================
   PILLS (Overview / iOS / macOS style)
   ========================================== */
.filter-pill, .employer-pill, .category-btn, .sort-pill, .msg-filter-pill, .map-chip {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border: none !important;
    color: rgba(255, 255, 255, 0.7) !important;
    font-weight: 400 !important;
}
.filter-pill.active, .filter-pill.selected, .employer-pill.active, .employer-pill.selected, .category-btn.active, .sort-pill.active, .msg-filter-pill.active, .map-chip.active {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #FFFFFF !important;
    border: none !important;
    font-weight: 500 !important;
}
.sort-pill svg, .category-btn svg { stroke: rgba(255, 255, 255, 0.7) !important; fill: none !important; }
.sort-pill.active svg, .category-btn.active svg { stroke: #FFFFFF !important; }

/* ==========================================
   SPLASH SCREEN
   ========================================== */
#splash-screen { background-color: #000000 !important; }
#splash-screen .brand-logo { color: #FFFFFF !important; }
#splash-screen .brand-logo span { color: var(--color-green) !important; }

/* ==========================================
   SEARCH OVERLAY (Fixing white header block)
   ========================================== */
#search-overlay { background-color: var(--color-bg) !important; }
.search-overlay-header { background-color: var(--color-bg) !important; }
.search-overlay-input-wrap { background-color: var(--color-surface) !important; }

/* ==========================================
   BOTTOM NAVIGATION
   ========================================== */
#bottom-nav, .bottom-nav {
    background-color: rgba(28, 28, 30, 0.85) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important;
}
.nav-item.active {
    background: transparent !important;
    color: #FFFFFF !important;
}
.nav-item:not(.active) {
    color: #8E8E93 !important; /* System Gray for inactive */
}
.nav-item.active::before {
    display: none !important; /* Remove the inner pill border */
}
.nav-item.active svg {
    stroke: #FFFFFF !important;
}
.nav-item:not(.active) svg {
    stroke: #8E8E93 !important;
}

/* ==========================================
   TOASTS (Top Notifications)
   ========================================== */
.toast-success, .toast {
    background-color: #1C1C1E !important; /* System Gray 6 Dark */
    color: #FFFFFF !important;
    border: 0.5px solid rgba(255,255,255,0.15) !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}
#push-banner {
    background-color: #1C1C1E !important; /* System Gray 6 Dark */
    border: 0.5px solid rgba(255,255,255,0.15) !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.6) !important;
}
.push-banner-title { color: #FFFFFF !important; }
.push-banner-msg { color: #8E8E93 !important; }
.push-banner-close { color: #8E8E93 !important; }
.msg-badge, [id*="badge"] { background-color: var(--color-green) !important; color: #000000 !important; }

/* ==========================================
   MESSAGES SCREEN
   ========================================== */
.chat-item-wrapper { background-color: transparent !important; border-bottom: 0.5px solid var(--color-border) !important; }
.chat-avatar-circle { background-color: #1C1C1E !important; color: var(--color-text) !important; }
.chat-name { color: var(--color-text) !important; }
.chat-job-title { color: var(--color-text-light) !important; }
.chat-preview { color: var(--color-text-muted) !important; }
.chat-time { color: rgba(255,255,255,0.25) !important; }
.unread-dot { background-color: var(--color-green) !important; }

/* ==========================================
   PROFILE SCREEN
   ========================================== */
.profile-avatar { background-color: #1C1C1E !important; border: none !important; }
.profile-name { color: var(--color-text) !important; }
.profile-location { color: var(--color-text-light) !important; }
.stats-card { background-color: var(--color-surface) !important; border: none !important; }
.stat-value { color: var(--color-text) !important; }
.stat-label { color: var(--color-text-light) !important; }
.section-label { color: var(--color-text-muted) !important; }
.role-switcher-container { background-color: #1C1C1E !important; border: 0.5px solid var(--color-border) !important; }
.role-btn { color: var(--color-text-muted) !important; background: transparent !important; }
.role-btn.active { background-color: rgba(255, 255, 255, 0.15) !important; color: #FFFFFF !important;    font-weight: 500 !important;
}

/* APPLE CRISP TYPOGRAPHY - ULTRA THIN PREMIUM */
* {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
}

body, input, button, select, textarea, div, span, p, a, .nav-item, .job-title, .job-card, .profile-name, .stat-value, .filter-pill, .sort-pill, .employer-pill, .category-btn {
    font-weight: 300 !important;
    letter-spacing: -0.015em !important;
}

strong, b, .font-semibold, .font-bold, .job-price, .celeb-amount {
    font-weight: 500 !important;
}

.section-card { background-color: var(--color-surface) !important; border: none !important; }
.bio-text { color: rgba(255,255,255,0.70) !important; }

/* Override active states that were left white */
.job-card:active { background-color: rgba(255, 255, 255, 0.15) !important; }
.emp-ad-pill.seeking { background-color: rgba(255, 255, 255, 0.15) !important; color: #FFFFFF !important; font-weight: 500 !important; }
.emp-ad-card.status-seeking { border-left: 3.5px solid #FFFFFF !important; }

/* EMPLOYER SCREEN FIXES */
.emp-cat-card.active { background-color: rgba(255,255,255,0.15) !important; border: 0.5px solid rgba(255,255,255,0.3) !important; color: #FFFFFF !important; }
#tools-btn-employer[style*="var(--color-text)"], #tools-btn-worker[style*="var(--color-text)"] { background-color: rgba(255,255,255,0.15) !important; border: 0.5px solid rgba(255,255,255,0.3) !important; color: #FFFFFF !important; }
#tools-btn-employer[style*="FFFFFF"], #tools-btn-worker[style*="FFFFFF"], #tools-btn-employer[style*="rgb(255, 255, 255)"], #tools-btn-worker[style*="rgb(255, 255, 255)"] { background-color: var(--color-surface) !important; border: 0.5px solid var(--color-border) !important; color: var(--color-text) !important; }

/* PUSH BANNER (TOP NOTIFICATION) FIX */
#push-banner { background-color: #2C2C2E !important; border: 0.5px solid rgba(255,255,255,0.2) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
.push-banner-title { color: #FFFFFF !important; }
.push-banner-msg { color: rgba(255,255,255,0.7) !important; }
.push-banner-icon { background: rgba(255,255,255,0.1) !important; border: 0.5px solid rgba(255,255,255,0.2) !important; color: #FFFFFF !important; }

/* ==========================================
   APPLE PREMIUM UI OVERHAUL (THE ULTIMATE FIX)
   ========================================== */
/* 1. Floating Plus Button (FAB) */
.emp-floating-plus-circle { background: linear-gradient(135deg, #32D74B 0%, #28A745 100%) !important; box-shadow: 0 6px 16px rgba(50, 215, 75, 0.4) !important; border: none !important; }
.emp-floating-plus-circle svg { stroke: #FFFFFF !important; }
.emp-floating-plus-wrapper { background: transparent !important; border: none !important; }

/* 2. Employer Home Header & Modal Header */
.emp-home-header, .emp-form-header { background: rgba(28, 28, 30, 0.7) !important; backdrop-filter: blur(35px) saturate(200%) !important; -webkit-backdrop-filter: blur(35px) saturate(200%) !important; border-bottom: 0.5px solid rgba(255, 255, 255, 0.1) !important; border-radius: 0 !important; }

/* 3. Category Cards & Small Buttons */
.emp-cat-card { background: rgba(255, 255, 255, 0.05) !important; border: none !important; border-radius: 14px !important; box-shadow: none !important; color: rgba(255, 255, 255, 0.7) !important; }
.emp-cat-card.active { background: rgba(255, 255, 255, 0.15) !important; border: none !important; color: #FFFFFF !important; }
.emp-cat-card svg { stroke: rgba(255, 255, 255, 0.7) !important; opacity: 0.9 !important; }
.emp-cat-card.active svg { stroke: #FFFFFF !important; }
.emp-ad-icon-circle { border: none !important; background: rgba(255, 255, 255, 0.1) !important; }

/* 4. Inputs and Textareas */
input, textarea { background: rgba(255, 255, 255, 0.05) !important; border: none !important; color: #FFFFFF !important; border-radius: 12px !important; }
input:focus, textarea:focus { background: rgba(255, 255, 255, 0.15) !important; box-shadow: none !important; border-color: transparent !important; }

/* Dropdowns & Bottom Sheets Refinements */
.bottom-sheet, .apply-bottom-sheet, .confirm-sheet, #distance-sheet, .action-overlay, .settings-overlay, .overlay-success { background: #1C1C1E !important; }
.overlay-backdrop, .apply-sheet-backdrop { background: rgba(0, 0, 0, 0.6) !important; }
select { background: rgba(255, 255, 255, 0.05) !important; border: none !important; color: #FFFFFF !important; border-radius: 12px !important; transition: background 0.2s cubic-bezier(0.32, 0.72, 0, 1); }
select:focus, select:active { background: rgba(255, 255, 255, 0.08) !important; outline: none !important; }

/* 5. Bottom Navigation Bar */
#bottom-nav, .bottom-nav { background-color: rgba(20, 20, 22, 0.8) !important; backdrop-filter: blur(30px) saturate(200%) !important; -webkit-backdrop-filter: blur(30px) saturate(200%) !important; border-top: 0.5px solid rgba(255, 255, 255, 0.1) !important; border-left: none !important; border-right: none !important; border-bottom: none !important; box-shadow: none !important; }

/* 6. Stats Cards & Category Pills */
.emp-stat-card, div[style*="border: 1px solid var(--color-border)"] { border: none !important; background: rgba(255, 255, 255, 0.05) !important; }
div[onclick^="setDateFilter"] { border: none !important; background: rgba(255, 255, 255, 0.05) !important; }
div[onclick^="setDateFilter"] span { color: rgba(255, 255, 255, 0.7) !important; font-weight: 400 !important; }
div[onclick^="setDateFilter"][style*="0.15)"] { background: rgba(255, 255, 255, 0.15) !important; }
div[onclick^="setDateFilter"][style*="0.15)"] span { color: #FFFFFF !important; font-weight: 500 !important; }

/* 7. Modal Specific Overrides (GPS, Price, Submit) */
#emp-gps-btn { border: none !important; background: rgba(50, 215, 75, 0.1) !important; color: #32D74B !important; font-weight: 600 !important; }
#emp-price-input { background: transparent !important; border: none !important; font-size: 44px !important; font-weight: 700 !important; color: #fff !important; }
.emp-submit-btn { background: linear-gradient(135deg, #32D74B 0%, #28A745 100%) !important; color: #FFFFFF !important; font-weight: 600 !important; border: none !important; box-shadow: 0 4px 14px rgba(50, 215, 75, 0.4) !important; }
.emp-submit-btn:disabled { background: rgba(255, 255, 255, 0.1) !important; color: rgba(255, 255, 255, 0.4) !important; box-shadow: none !important; }
button[onclick^="adjustEmpPrice"] { background: rgba(255, 255, 255, 0.12) !important; color: #FFFFFF !important; font-weight: 500 !important; }

/* Profile Screen Specific Overrides (Fixing Inline Styles) */
#app-profile-screen > div:first-child {
    background-color: var(--color-bg) !important; /* Fix hero area inverted color */
}
#profile-avatar-circle {
    background-color: var(--color-surface) !important;
    border: 2px solid var(--color-bg) !important;
    color: var(--color-text) !important;
}
/* Fix ALL Inline White Backgrounds (Cards generated by JS) */
div[style*="background-color: white"],
div[style*="background: white"] {
    background-color: var(--color-surface) !important;
    background: var(--color-surface) !important;
    border: none !important;
}
/* Fix Dividers inside cards */
div[style*="height: 0.5px"][style*="background-color: var(--color-bg)"] {
    background-color: var(--color-border) !important;
}
/* The little badges/edit icon in hero area */
#app-profile-screen div[style*="bottom: 0; right: 0;"] {
    background-color: var(--color-surface) !important;
    border-color: var(--color-bg) !important;
    color: var(--color-text) !important;
}

/* Empty states refinement (Apple style) */
svg[stroke="#D1D5DB"] {
    stroke: rgba(255,255,255,0.15) !important; /* Very subtle empty state icon */
}
[id*="empty"] div {
    color: var(--color-text-light) !important; /* Subtitle color */
}
[id*="empty"] div:first-of-type {
    color: var(--color-text) !important; /* Title color */
}

/* ==========================================
   MAP SCREEN
   ========================================== */
.leaflet-layer, .leaflet-control-zoom-in, .leaflet-control-zoom-out, .leaflet-control-attribution {
    filter: brightness(115%) contrast(95%); /* Slightly brighten the dark_all tiles so roads are clearly visible */
}
.leaflet-control-zoom a { background-color: #1C1C1E !important; color: var(--color-text) !important; border: 1px solid var(--color-border) !important; }
.map-pin-label { background-color: var(--color-green) !important; border: 2px solid #000000 !important; color: #000000 !important; }
.user-gps-dot { background-color: #FFFFFF !important; border: 3px solid rgba(255,255,255,0.3) !important; box-shadow: 0 0 12px rgba(255,255,255,0.8) !important; }
.map-floating-btn { background-color: var(--color-surface) !important; border: 1px solid var(--color-border) !important; color: var(--color-text) !important; }
.leaflet-popup-content-wrapper, .leaflet-popup-tip { background-color: #1C1C1E !important; color: #FFFFFF !important; border: 1px solid rgba(84,84,88,0.35) !important; }
.leaflet-popup-content { color: #FFFFFF !important; }

/* ==========================================
   LOGIN SCREEN
   ========================================== */
.auth-input { background-color: #1C1C1E !important; border: none !important; color: var(--color-text) !important; }
.auth-input:focus { background-color: #2C2C2E !important; }
.auth-input::placeholder { color: var(--color-text-muted) !important; }
input[type="checkbox"] { border: 1px solid rgba(255,255,255,0.20) !important; }
input[type="checkbox"]:checked { background-color: var(--color-green) !important; border-color: var(--color-green) !important; }
.auth-bottom-link { color: rgba(255,255,255,0.60) !important; }
.role-card { background-color: var(--color-surface) !important; border: none !important; }
.role-card.selected { border: 1.5px solid var(--color-green) !important; background-color: rgba(170,255,0,0.06) !important; }

/* Buttons */
[style*="background: #16C45A"], [style*="background-color: #16C45A"], .login-btn, .register-btn, .job-apply-btn, button.primary {
    background-color: var(--color-green) !important;
    color: #000000 !important;
    height: 56px !important;
    border-radius: 14px !important;
    font-weight: 700 !important;
    border: none !important;
}
.google-btn { background-color: #1C1C1E !important; border: none !important; color: var(--color-text) !important; }
.apple-btn { background-color: #FFFFFF !important; color: #000000 !important; border: none !important; }
.apple-btn svg { fill: #000000 !important; }

/* Empty state */
.empty-illustration { opacity: 0.15 !important; }
.empty-title { color: var(--color-text) !important; }
.empty-desc { color: var(--color-text-muted) !important; }
.empty-state a { color: var(--color-text-muted) !important; }


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

</style>
<div style="position:fixed;bottom:110px;right:16px;background:#FFFFFF;color:#000000;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;z-index:99999;box-shadow:0 4px 16px rgba(255,255,255,0.2);">
✦ APPLE PREMIUM SÖTÉT MÓD
</div>
`;

const metas = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
`;
code = code.replace('<meta charset="UTF-8">', metas + '\\n    <meta charset="UTF-8">');

code = code.replace('</head>', strictDarkCSS + '</head>');

// GLOBAL APPLE DARK MODE BORDER FIXES
code = code.replace(/#E5E7EB/gi, 'var(--color-border)');
// Make all 1px solid borders 0.5px for the filigran Apple look
code = code.replace(/1px solid var\(--color-border\)/g, '0.5px solid var(--color-border)');
// Also catch inline 1px solid #fff or #ffffff
code = code.replace(/1px solid #fff/gi, '0.5px solid rgba(255,255,255,0.15)');
code = code.replace(/1px solid #FFFFFF/gi, '0.5px solid rgba(255,255,255,0.15)');

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', code);

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', code);
console.log('✅ CLEAN APPLE-LEVEL DARK THEME GENERATED!');
