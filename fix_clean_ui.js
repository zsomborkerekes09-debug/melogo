const fs = require('fs');

let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

// 1. Remove the old Apple Premium Dark Mode toggle button that is covering the UI
html = html.replace(/<button[^>]*id="dark-mode-toggle"[^>]*>[\s\S]*?<\/button>/gi, '');

// 2. Remove any other stray toggle buttons like "✨ HIPERMODERN NEON"
html = html.replace(/<button[^>]*id="hyper-modern-toggle"[^>]*>[\s\S]*?<\/button>/gi, '');

// 3. Update the Clean Premium CSS with hyper-specific selectors to override the junk
const specificCSS = `
<style id="clean-premium-redesign-v2">
/* HYPER SPECIFIC OVERRIDES */
body #app-container #employer-form-overlay .emp-cat-card {
    background: #1C1C1E !important;
    color: #8E8E93 !important;
    border: none !important;
}
body #app-container #employer-form-overlay .emp-cat-card svg {
    stroke: #8E8E93 !important;
}
body #app-container #employer-form-overlay .emp-cat-card.active {
    background: #32D74B !important; 
    color: #000000 !important;
    border: none !important;
}
body #app-container #employer-form-overlay .emp-cat-card.active svg {
    stroke: #000000 !important;
}

body #app-container #employer-form-overlay #tools-btn-employer,
body #app-container #employer-form-overlay #tools-btn-worker {
    background: #1C1C1E !important;
    color: #8E8E93 !important;
    border: none !important;
}
body #app-container #employer-form-overlay #tools-btn-employer.active,
body #app-container #employer-form-overlay #tools-btn-worker.active,
body #app-container #employer-form-overlay #tools-btn-employer[style*="255"],
body #app-container #employer-form-overlay #tools-btn-worker[style*="255"] {
    background: #32D74B !important;
    color: #000000 !important;
    border: none !important;
}
</style>
`;

if (!html.includes('id="clean-premium-redesign-v2"')) {
    html = html.replace('</style>', '</style>\n' + specificCSS);
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Fixed specificity and removed old toggles!');
