const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 8 - FIX JP CAT CARDS (JOB PICKER SHEET) */
.jp-cat-card {
    background: rgba(45, 45, 48, 0.8) !important;
    color: #FFFFFF !important;
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
    border-radius: 16px !important;
}
.jp-cat-card:active {
    background: #CCFF00 !important;
    color: #000000 !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(204, 255, 0, 0.3) !important;
    transform: scale(0.96) !important;
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
        console.log(`Successfully applied batch 8 UI tweaks to ${file}`);
    }
});
