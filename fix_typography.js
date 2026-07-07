const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const typographyCSS = `
/* ==========================================
   ULTIMATE SHARP TYPOGRAPHY OVERRIDE
   ========================================== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
}

/* Reset all font weights to a sharper base (400 instead of blurry 300) */
body, div, span, p, a, input, button, textarea, select {
    font-weight: 400 !important;
    letter-spacing: -0.01em !important;
}

/* Medium Text for important UI elements */
strong, b, .font-semibold, .font-bold, .job-price, .celeb-amount,
.role-btn, .category-btn, .emp-cat-card, .filter-pill, .sort-pill, .map-chip,
.job-title, .profile-name, .stat-value, button, .nav-item span {
    font-weight: 500 !important;
}

/* Bold Text for Headers and Primary Actions */
.home-header, .header-midnight, h1, h2, h3, .msg-midnight-header, .login-btn, .register-btn, .job-apply-btn, .emp-submit-btn,
.push-banner-title, .toast-success {
    font-weight: 600 !important;
    letter-spacing: -0.02em !important;
}

/* Increase contrast for all muted/secondary text so it is SHARP and READABLE */
.job-meta, .job-meta-item, .chat-preview, .bio-text, .section-label, .stat-label, .profile-location, .welcome-text,
.empty-desc, .role-description-text, [style*="color: var(--color-text-muted)"], [style*="color: rgba(255,255,255,0.3)"] {
    color: rgba(255, 255, 255, 0.70) !important;
}

/* Specific fix for text variables to ensure sharp contrast */
:root {
    --color-text-muted: rgba(255, 255, 255, 0.70) !important;
    --color-text-light: rgba(255, 255, 255, 0.85) !important;
    --color-text: #FFFFFF !important;
}
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Make sure we have the apple-premium-dark-mode tag
    const match = html.match(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/);
    if (match) {
        // Remove previous typography overrides if we already ran this script once
        let css = match[1].replace(/\/\* ==========================================\s*ULTIMATE SHARP TYPOGRAPHY OVERRIDE[\s\S]*?(?=\<\/style\>|$)/g, '');
        css = css.replace(/\s*$/, '');
        
        css += '\n' + typographyCSS + '\n';
        html = html.replace(match[0], `<style id="apple-premium-dark-mode">${css}</style>`);
        
        // Ensure Inter font is linked in <head> just to be safe
        if (!html.includes('fonts.googleapis.com/css2?family=Inter')) {
            html = html.replace('<head>', '<head>\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">');
        }
        
        fs.writeFileSync(file, html);
        console.log(`Successfully injected sharp typography into ${file}`);
    } else {
        console.log(`apple-premium-dark-mode not found in ${file}`);
    }
});
