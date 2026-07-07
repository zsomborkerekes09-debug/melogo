const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 4 - BACKGROUND BRIGHTNESS */
body, .app-container, #phone-app {
    background-color: #0E0E10 !important; /* Slightly lighter than pure black */
}

/* Lighten job cards / ads */
.job-card, .emp-ad-item {
    background: rgba(45, 45, 48, 0.8) !important; /* Lighter grey for cards */
    border: 0.5px solid rgba(255, 255, 255, 0.15) !important;
}

/* Make sure the bottom capsule nav stands out against the lighter background */
#bottom-nav, .bottom-nav {
    background: rgba(35, 35, 38, 0.9) !important;
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
        console.log(`Successfully applied batch 4 UI tweaks to ${file}`);
    }
});
