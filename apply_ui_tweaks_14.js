const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const tweaksCSS = `
/* UI TWEAKS BATCH 14 - FIX DOUBLE FOCUS BORDER */

/* Explicitly disable the old focus-within styles on the container to prevent double borders */
.auth-input-container:focus-within {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

/* Ensure only the inner input field gets the neon green focus border */
input.auth-input-field:focus, input.login-input:focus, input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus, input[type="tel"]:focus {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 0.5px solid #CCFF00 !important; /* Neon green border on focus */
    box-shadow: 0 0 15px rgba(204, 255, 0, 0.15) !important;
    outline: none !important;
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
        console.log(`Successfully applied batch 14 UI tweaks to ${file}`);
    }
});
