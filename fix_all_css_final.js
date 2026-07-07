const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const newProfileAndRoleCSS = `
/* ==========================================
   PERFECT PROFILE & ROLE SWITCHER OVERRIDES
   ========================================== */
/* Fix the Profile Hero background so it blends with the black body */
#app-profile-screen > div:first-child {
    background-color: transparent !important; 
}
/* Fix the Avatar circle */
#profile-avatar-circle {
    background: linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%) !important;
    border: 2px solid var(--color-border) !important;
    color: #FFFFFF !important;
}
/* Fix all the generated white cards in Profile to be Dark Grey */
#app-profile-screen div[style*="background-color: white"],
#app-profile-screen div[style*="background: white"] {
    background-color: var(--color-surface) !important;
    background: var(--color-surface) !important;
    border: none !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
}
/* Dividers inside cards */
#app-profile-screen div[style*="height: 0.5px"][style*="background-color: var(--color-bg)"] {
    background-color: var(--color-border) !important;
}
/* The edit badges */
#app-profile-screen div[style*="bottom: 0; right: 0;"] {
    background-color: var(--color-surface) !important;
    border-color: var(--color-bg) !important;
    color: var(--color-text) !important;
}
/* Logout button */
#app-profile-screen button[style*="background-color: white"] {
    background-color: var(--color-surface) !important;
    border-color: var(--color-border) !important;
    color: #EF4444 !important;
}

/* ==========================================
   PERFECT ROLE SWITCHER
   ========================================== */
.role-switcher-container {
    background-color: #000000 !important;
    border: 0.5px solid var(--color-border) !important;
    display: flex !important;
    padding: 4px !important;
    border-radius: 20px !important;
    min-height: 40px !important; /* Force a minimum height so it doesn't collapse */
}
.role-btn {
    color: var(--color-text-light) !important;
    background: transparent !important;
    flex: 1 !important;
    padding: 8px 16px !important;
    border-radius: 16px !important;
    border: none !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    height: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
}
.role-btn.active {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #FFFFFF !important;
    font-weight: 500 !important;
    border-radius: 16px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Make sure we have the apple-premium-dark-mode tag
    if (!html.includes('<style id="apple-premium-dark-mode">')) return;

    // 1. Remove the buggy old role switcher CSS so it doesn't conflict
    html = html.replace(/\.role-switcher-container\s*{[^}]*}/g, '');
    html = html.replace(/\.role-btn\s*{[^}]*}/g, '');
    html = html.replace(/\.role-btn\.active\s*{[^}]*}/g, '');

    // 2. Remove any existing "Profile Screen Specific Overrides" (both forms)
    html = html.replace(/\/\* Profile Screen Specific Overrides[\s\S]*?(?=\/\* Empty states)/g, '');
    html = html.replace(/\/\* ==========================================\s*PERFECT PROFILE & ROLE SWITCHER OVERRIDES[\s\S]*?(?=\<\/style\>)/g, '');

    // 3. Inject our perfect CSS at the very end of apple-premium-dark-mode
    html = html.replace(/(<\/style>)([\s\S]*?id="apple-premium-dark-mode")/, '$1$2'); // no
    
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        css = css.replace(/\s*$/, '');
        css += '\n' + newProfileAndRoleCSS + '\n';
        
        // Also ensure bottom nav is there! If not, add it.
        if (!css.includes('#bottom-nav')) {
            css += `
/* ==========================================
   BOTTOM NAVIGATION
   ========================================== */
#bottom-nav, .bottom-nav {
    background-color: rgba(28, 28, 30, 0.85) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border-top: 0.5px solid rgba(255, 255, 255, 0.1) !important;
}
.nav-item.active { background: transparent !important; color: #FFFFFF !important; }
.nav-item:not(.active) { color: #8E8E93 !important; }
.nav-item.active::before { display: none !important; }
.nav-item.active svg { stroke: #FFFFFF !important; }
.nav-item:not(.active) svg { stroke: #8E8E93 !important; }
`;
        }

        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        fs.writeFileSync(file, html);
        console.log(`Successfully injected into ${file}`);
    }
});
