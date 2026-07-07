const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const cssOverrides = `
/* Profile Screen Specific Overrides */
#app-profile-screen > div:first-child {
    background-color: transparent !important;
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
    color: #EF4444 !important;
}
.role-switcher-container {
    background-color: #000000 !important;
    border: 0.5px solid var(--color-border) !important;
}
.role-btn {
    color: var(--color-text-light) !important;
    background: transparent !important;
}
.role-btn.active {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #FFFFFF !important;
    font-weight: 500 !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Strip out the existing Profile Screen Specific Overrides block if it exists
    html = html.replace(/\/\* Profile Screen Specific Overrides \*\/[\s\S]*?(?=<\/style>)/g, '');

    // Insert the new perfect block right before </style> in apple-premium-dark-mode
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        const newStyle = `<style id="apple-premium-dark-mode">${match[1].replace(/\s*$/, '')}\n${cssOverrides}\n</style>`;
        html = html.replace(match[0], newStyle);
        fs.writeFileSync(file, html);
        console.log(`Updated Profile CSS in ${file}`);
    } else {
        console.log(`apple-premium-dark-mode not found in ${file}`);
    }
});
