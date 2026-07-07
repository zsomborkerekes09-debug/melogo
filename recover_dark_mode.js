const fs = require('fs');

// Read the original uncorrupted CSS from the generator script
const code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/generate_dark_preview.js', 'utf8');
const match = code.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
if (!match) {
    console.log("Could not find the original CSS in generate_dark_preview.js");
    process.exit(1);
}

let originalCss = match[1];

// This is the perfect Profile Screen override that we figured out earlier
const perfectProfileOverrides = `
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
    display: flex !important;
    padding: 4px !important;
    border-radius: 16px !important;
}
.role-btn {
    color: var(--color-text-light) !important;
    background: transparent !important;
    flex: 1 !important;
    padding: 6px 12px !important;
    border-radius: 16px !important;
    border: none !important;
    font-size: 13px !important;
    font-weight: 300 !important;
    display: block !important;
    height: auto !important;
}
.role-btn.active {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #FFFFFF !important;
    font-weight: 500 !important;
    border-radius: 20px !important;
}
/* END Profile Screen Specific Overrides */
`;

// Replace the old, buggy Profile Screen Specific Overrides inside the original CSS with our new perfect block
originalCss = originalCss.replace(/\/\* Profile Screen Specific Overrides \*\/[\s\S]*?(?=\/\* Empty states)/, perfectProfileOverrides + "\n");

// Now we need to update index.html and preview_dark.html
const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace the entire corrupted apple-premium-dark-mode block with our fixed and restored block
    const fileMatch = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (fileMatch) {
        html = html.replace(fileMatch[0], `<style id="apple-premium-dark-mode">${originalCss}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully recovered and injected into ${file}`);
    } else {
        console.log(`apple-premium-dark-mode not found in ${file}`);
    }
});
