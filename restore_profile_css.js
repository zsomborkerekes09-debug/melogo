const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const cssOverrides = `
/* Profile Screen Specific Overrides */
#app-profile-screen > div:first-child {
    background-color: var(--color-surface) !important;
}
#profile-avatar-circle {
    background: linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%) !important;
    border: 2px solid var(--color-border) !important;
    color: #FFFFFF !important;
}
#app-profile-screen div[style*="background-color: white"] {
    background-color: var(--color-surface) !important;
    border-color: var(--color-border) !important;
}
#app-profile-screen button[style*="background-color: white"] {
    background-color: var(--color-surface) !important;
    border-color: var(--color-border) !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Remove any existing Profile Screen Overrides to avoid duplication
    html = html.replace(/\/\* Profile Screen Specific Overrides \*\/[\s\S]*?(?=<\/style>)/g, '');

    // Append the overrides to the end of apple-premium-dark-mode style block
    html = html.replace(/(<\/style>)([\s\S]*?id="apple-premium-dark-mode")/, '$1$2'); // wait, find the exact style block end
    // It's safer to just replace </style> where id="apple-premium-dark-mode" is.
    // Let's find the content of apple-premium-dark-mode
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        const newStyle = `<style id="apple-premium-dark-mode">${match[1]}\n${cssOverrides}\n</style>`;
        html = html.replace(match[0], newStyle);
        fs.writeFileSync(file, html);
        console.log(`Injected CSS overrides into ${file}`);
    } else {
        console.log(`Could not find apple-premium-dark-mode in ${file}`);
    }
});
