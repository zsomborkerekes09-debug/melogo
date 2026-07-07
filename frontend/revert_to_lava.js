const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Restore dark mode class
content = content.replace(/apple-premium-light-mode/g, 'apple-premium-dark-mode');

// Remove light mode styles
content = content.replace(/<style id="ultimate-light[^>]*>[\s\S]*?<\/style>/g, '');
content = content.replace(/<style id="light-orange-glow">[\s\S]*?<\/style>/g, '');
content = content.replace(/<style id="aggressive-light">[\s\S]*?<\/style>/g, '');

const lavaBase = '#0A0A0A';
const lavaSurface = 'rgba(255, 255, 255, 0.04)';
const lavaText = 'rgba(255, 255, 255, 0.9)';
const lavaTextMuted = 'rgba(255, 255, 255, 0.4)';
const lavaBorder = 'rgba(255, 87, 34, 0.15)';
const lavaAccent = '#FF5722'; // Lava Orange

// Update CSS variables for Volcanic Lava Dark Mode
const lavaStyle = `
<style id="lava-glow">
    :root, html, body, #app-container, .apple-premium-dark-mode {
        --color-bg: transparent !important;
        --color-surface: ${lavaSurface} !important;
        --color-text: ${lavaText} !important;
        --color-text-muted: ${lavaTextMuted} !important;
        --color-border: ${lavaBorder} !important;
        --color-green: ${lavaAccent} !important;
        background-color: #0A0A0A !important;
        color: ${lavaText} !important;
    }

    body, #app-container {
        background: radial-gradient(120% 50% at 50% 0%, #3D1200 0%, #0A0A0A 60%, #0A0A0A 100%) !important;
        background-color: #0A0A0A !important;
        background-attachment: fixed !important;
        min-height: 100vh;
    }
    
    * {
        color: inherit;
    }

    .brand-logo, .welcome-text, h2, p {
        color: ${lavaText} !important;
    }

    .header-midnight, #home-search-display, .search-bar, .gps-bar {
        background: transparent !important;
    }
    
    .job-card {
        background: rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 0.5px solid rgba(255, 87, 34, 0.2) !important;
    }
    
    .brand-logo span {
        color: #FF5722 !important;
        text-shadow: 0 0 12px rgba(255, 87, 34, 0.6) !important;
    }

    #home-search-display {
        color: ${lavaText} !important;
    }
    #home-search-display::placeholder {
        color: ${lavaTextMuted} !important;
    }

    .gps-location, .distance-pill-btn, .gps-location span, .distance-pill-btn span {
        color: ${lavaTextMuted} !important;
    }
    #gps-city-label, #distance-pill-text {
        color: ${lavaText} !important;
    }
    
    .job-title, .job-price {
        color: ${lavaText} !important;
    }
    
    .job-card-badges span {
        color: ${lavaTextMuted} !important;
    }

    .category-btn, div[onclick^="setDateFilter"] {
        color: ${lavaTextMuted} !important;
    }
    .category-btn.active, div[onclick^="setDateFilter"][style*="1px solid"] {
        color: ${lavaText} !important;
        border-bottom-color: ${lavaAccent} !important;
    }

    .bottom-nav {
        background: rgba(10, 10, 10, 0.8) !important;
        border-top: 1px solid rgba(255, 87, 34, 0.2) !important;
    }
    .nav-item {
        color: ${lavaTextMuted} !important;
    }
    .nav-item.active {
        color: ${lavaAccent} !important;
    }
    
    svg { stroke: currentColor; }
    .MuiSvgIcon-root { fill: none !important; }
</style>
</head>`;

if (content.includes('<style id="lava-glow">')) {
    content = content.replace(/<style id="lava-glow">[\s\S]*?<\/style>/, '');
}
content = content.replace(/<\/head>/, lavaStyle);

fs.writeFileSync(file, content, 'utf8');
console.log('Reverted to Volcanic Lava Dark Mode!');
