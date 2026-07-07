const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // 1. Fix H1/H2 override making "Közeli munkák" huge
    html = html.replace(/h1, h2, \.auth-title, \.home-header,/g, ".auth-title, .home-header,");

    // 2. Fix the active state color for ALL pills, dates, categories (dark grey instead of solid white)
    html = html.replace(/\.category-btn\.active, \.date-btn\.active, div\[onclick\^="setDateFilter"\]\[style\*="0\.15"\], \.emp-cat-card\.active, \.filter-chip\.active, \.search-map-filter-btn\.active \{[\s\S]*?box-shadow: 0 2px 8px rgba\(255,255,255,0\.2\) !important;\s*\}/g, `.category-btn.active, .date-btn.active, div[onclick^="setDateFilter"][style*="0.15"], .emp-cat-card.active, .filter-chip.active, .search-map-filter-btn.active {
    background: rgba(255, 255, 255, 0.15) !important;
    color: #FFFFFF !important;
    font-weight: 600 !important;
    border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}`);

    // Ensure strokes in active SVGs remain white, not black
    html = html.replace(/\.category-btn\.active svg, \.emp-cat-card\.active svg \{[\s\S]*?\}/g, `.category-btn.active svg, .emp-cat-card.active svg {
    stroke: #FFFFFF !important;
}`);

    // Fix the "white on white" date text specifically if there's any stray rule, but the above fixes the background to dark grey so the white text will be visible anyway!

    // 3. Fix the double search bar (make the inner input transparent)
    // First, let's remove #search-overlay-input from the main search-bar background rule if it exists, or just add a transparent override.
    const searchBarFix = `
.search-bar input, .search-overlay-input-wrap input {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding-left: 0 !important;
}
.search-bar { padding-left: 16px !important; }
`;
    // 4. Capsule bottom nav
    const capsuleNavCSS = `
#bottom-nav, .bottom-nav {
    width: 92% !important;
    left: 4% !important;
    bottom: 24px !important;
    border-radius: 34px !important;
    backdrop-filter: blur(25px) !important;
    -webkit-backdrop-filter: blur(25px) !important;
    background: rgba(28, 28, 30, 0.85) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    border-top: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    padding-bottom: 0 !important;
    height: 64px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 8px !important;
}
.nav-item {
    height: 100% !important;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
    border-radius: 20px !important;
}
/* Also fix safe-area for the app container since the nav is floating */
.app-container {
    padding-bottom: 100px !important;
}
`;
    
    // Inject the fixes into the stylesheet
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css += '\n' + searchBarFix + '\n' + capsuleNavCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully applied user tweaks to ${file}`);
    }
});
