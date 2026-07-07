const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 3 - FONT OPTIMIZATION & NEON GREEN LOGO */

/* 1. Neon Green Logo */
.brand-logo span, .logo span {
    color: #CCFF00 !important; /* Bright neon lime green */
    text-shadow: 0 0 10px rgba(204, 255, 0, 0.4) !important; /* Slight neon glow */
}

/* 2. Absolute Font Optimization (Max 1 font family: Inter) */
* {
    font-family: 'Inter', sans-serif !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: geometricPrecision !important; /* Sharpest possible rendering */
}

/* Ensure headings aren't overly bulky on Windows */
h1, h2, h3, .home-header, .auth-title {
    font-weight: 600 !important;
    letter-spacing: -0.5px !important;
}

/* Ensure body text is sharp and readable */
body, div, span, p, a, input, button, textarea, select {
    letter-spacing: 0 !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Ensure we are only adding this once
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        // Remove previous logo color rule if it exists in my injection to prevent conflict
        css = css.replace(/\.brand-logo span\s*\{[\s\S]*?\}/g, '');
        
        css += '\n' + tweaksCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully applied batch 3 UI tweaks to ${file}`);
    }
});
