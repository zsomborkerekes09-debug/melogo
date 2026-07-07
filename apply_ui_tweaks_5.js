const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 5 - ELEGANT HEADER BACKGROUND */
.header-midnight {
    background: linear-gradient(180deg, #1C1C1E 0%, #0E0E10 100%) !important;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.4) !important;
    border-bottom-left-radius: 36px !important;
    border-bottom-right-radius: 36px !important;
    padding-bottom: 24px !important;
    padding-top: max(24px, env(safe-area-inset-top)) !important;
    position: relative !important;
    z-index: 10 !important;
}

/* Ensure the background stretches fully left and right if it was constrained */
#phone-app .header-midnight {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

/* Slight adjustment to search bar to match the new grey header */
.header-midnight .search-bar {
    background: rgba(255, 255, 255, 0.06) !important;
    border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
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
        console.log(`Successfully applied batch 5 UI tweaks to ${file}`);
    }
});
