const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Strip the dark mode class
content = content.replace(/apple-premium-dark-mode/g, 'apple-premium-light-mode');

// Create the ultimate light mode + orange glow block
const ultimateLightCSS = `
<style id="ultimate-light">
    html, body, #app-container, .apple-premium-light-mode {
        background: radial-gradient(150% 60% at 50% 0%, rgba(255, 87, 34, 0.15) 0%, rgba(255, 140, 0, 0.05) 40%, #F5F5F7 100%) !important;
        background-color: #F5F5F7 !important;
        background-attachment: fixed !important;
        color: #111111 !important;
        --color-bg: #F5F5F7 !important;
        --color-surface: rgba(255, 255, 255, 0.7) !important;
        --color-text: #111111 !important;
        --color-text-muted: #666666 !important;
        --color-border: rgba(0, 0, 0, 0.1) !important;
        --color-green: #FF5722 !important;
    }

    * {
        color: inherit;
    }

    .brand-logo, .welcome-text, h2, span, div, p {
        color: #111111 !important;
    }
    
    .brand-logo span {
        color: #c0fc2a !important; /* Neon Go */
        text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4) !important;
    }

    #home-search-display {
        color: #111111 !important;
        background: transparent !important;
    }
    #home-search-display::placeholder {
        color: #666666 !important;
    }

    .gps-location, .distance-pill-btn, .gps-location span, .distance-pill-btn span {
        color: #666666 !important;
    }
    #gps-city-label, #distance-pill-text {
        color: #111111 !important;
    }

    .job-card {
        background: rgba(255, 255, 255, 0.6) !important;
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1) !important;
    }
    
    .job-title, .job-price {
        color: #111111 !important;
    }
    
    .job-card-badges span {
        color: #666666 !important;
    }

    .category-btn, div[onclick^="setDateFilter"] {
        color: #666666 !important;
    }
    .category-btn.active, div[onclick^="setDateFilter"][style*="1px solid"] {
        color: #111111 !important;
        border-bottom-color: #111111 !important;
    }

    .bottom-nav {
        background: rgba(255, 255, 255, 0.8) !important;
        border-top: 0.5px solid rgba(0, 0, 0, 0.1) !important;
    }
    .nav-item {
        color: #666666 !important;
    }
    .nav-item.active {
        color: #FF5722 !important;
    }
</style>
</head>`;

if (content.includes('<style id="ultimate-light">')) {
    content = content.replace(/<style id="ultimate-light">[\s\S]*?<\/style>/, '');
}
content = content.replace(/<\/head>/, ultimateLightCSS);

fs.writeFileSync(file, content, 'utf8');
console.log('Ultimate Light Mode applied!');
