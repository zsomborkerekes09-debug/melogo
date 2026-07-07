const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const ultimateLightCSS = `
<style id="ultimate-light-v2">
    html, body, #app-container, .apple-premium-light-mode {
        background: radial-gradient(150% 60% at 50% 0%, rgba(255, 87, 34, 0.35) 0%, rgba(255, 140, 0, 0.15) 40%, #E8E8ED 100%) !important;
        background-color: #E8E8ED !important; /* Kicsit sötétebb szürke háttér */
        background-attachment: fixed !important;
        color: #111111 !important;
        --color-bg: #E8E8ED !important;
        --color-surface: rgba(255, 255, 255, 0.5) !important;
        --color-text: #111111 !important;
        --color-text-muted: #555555 !important;
        --color-border: rgba(255, 87, 34, 0.4) !important; /* Narancs szegély */
        --color-green: #FF5722 !important;
    }

    * {
        color: inherit;
    }

    .brand-logo, .welcome-text, h2, p {
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
        color: #555555 !important;
    }

    .gps-location, .distance-pill-btn, .gps-location span, .distance-pill-btn span {
        color: #555555 !important;
    }
    #gps-city-label, #distance-pill-text {
        color: #111111 !important;
    }

    .job-card {
        background: rgba(255, 255, 255, 0.4) !important;
        border-bottom: 1.5px solid rgba(255, 87, 34, 0.4) !important; /* Dobozok széle narancs */
    }
    
    .job-title {
        color: #111111 !important;
    }
    
    /* Számok és árak narancs színnel */
    .job-price {
        color: #FF5722 !important;
        font-weight: 600 !important;
    }
    
    /* Dátumok számai narancs színnel */
    #date-filter-row span:nth-child(2) {
        color: #FF5722 !important;
        font-weight: 600 !important;
    }
    #date-filter-row span:nth-child(1) {
        color: #555555 !important;
    }
    
    .job-card-badges span {
        color: #555555 !important;
    }

    .category-btn {
        color: #555555 !important;
    }
    .category-btn.active, div[onclick^="setDateFilter"][style*="1px solid"] {
        color: #111111 !important;
        border-bottom-color: #FF5722 !important; /* Aktív szűrő alja narancs */
    }

    .bottom-nav {
        background: rgba(255, 255, 255, 0.8) !important;
        border-top: 1px solid rgba(255, 87, 34, 0.2) !important;
    }
    .nav-item {
        color: #555555 !important;
    }
    .nav-item.active {
        color: #FF5722 !important;
    }
</style>
</head>`;

if (content.includes('<style id="ultimate-light">')) {
    content = content.replace(/<style id="ultimate-light">[\s\S]*?<\/style>/, '');
}
if (content.includes('<style id="ultimate-light-v2">')) {
    content = content.replace(/<style id="ultimate-light-v2">[\s\S]*?<\/style>/, '');
}
content = content.replace(/<\/head>/, ultimateLightCSS);

fs.writeFileSync(file, content, 'utf8');
console.log('Ultimate Light Mode V2 applied!');
