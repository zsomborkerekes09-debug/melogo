const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 2 */
/* 1. Fix double search bar */
#home-search-display, #search-overlay-input {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding-left: 0 !important;
}

/* 2. Fix bottom nav centering */
#bottom-nav, .bottom-nav {
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: 92% !important;
    max-width: 400px !important; /* Keep it nice on wider screens */
    margin: 0 auto !important;
}

/* 3. Fix Közeli munkák massive text */
h2[style*="font-size: 18px"], .search-section-label {
    font-size: 18px !important;
    font-weight: 600 !important;
    letter-spacing: 0 !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css += '\n' + tweaksCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully applied batch 2 UI tweaks to ${file}`);
    }
});
