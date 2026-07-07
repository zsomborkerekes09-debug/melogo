const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 7 - FIX WHITE CARDS AND SLIDER BUTTON */

/* Fix radius slider confirmation button */
.distance-confirm-btn {
    background: linear-gradient(180deg, #32D74B 0%, #28A745 100%) !important;
    color: #000000 !important;
    font-weight: 600 !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 14px rgba(50, 215, 75, 0.25) !important;
    border-radius: 16px !important;
    height: 56px !important;
    font-size: 16px !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Fix stark white category cards in bottom sheets */
.emp-cat-card {
    background: rgba(45, 45, 48, 0.8) !important;
    color: #FFFFFF !important;
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
    border-radius: 16px !important;
}
.emp-cat-card svg {
    stroke: #FFFFFF !important;
}

/* Ensure active category cards use the neon green style */
.emp-cat-card.active {
    background: #CCFF00 !important;
    color: #000000 !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(204, 255, 0, 0.3) !important;
}
.emp-cat-card.active svg {
    stroke: #000000 !important;
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
        console.log(`Successfully applied batch 7 UI tweaks to ${file}`);
    }
});
