const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 6 - MESSAGES SCREEN HEADER */
.msg-midnight-header {
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

/* Ensure the logo inside uses the neon green! */
.msg-midnight-header .brand-logo span {
    color: #CCFF00 !important;
    text-shadow: 0 0 10px rgba(204, 255, 0, 0.4) !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // 1. Add CSS
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css += '\n' + tweaksCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
    }

    // 2. Change empty state text
    html = html.replace(/Még csend van itt/g, "Nincs még üzeneted");
    
    // Also make sure the empty state is more elegant
    html = html.replace(/<svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="#D1D5DB"/g, '<svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="rgba(255,255,255,0.2)"');
    html = html.replace(/Jelentkezz egy munkára és automatikusan<br>megnyílik a chat./g, "Jelentkezz egy munkára és a beszélgetések<br>itt fognak megjelenni.");

    fs.writeFileSync(file, html);
    console.log(`Successfully applied batch 6 UI tweaks to ${file}`);
});
