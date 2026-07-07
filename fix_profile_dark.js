const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Remove all duplicate copies of the apple-premium-dark-mode style tag, keeping only the last one
    const regex = /<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/g;
    const matches = [...html.matchAll(regex)];
    
    if (matches.length > 0) {
        // Remove ALL of them
        html = html.replace(/<style id="apple-premium-dark-mode">([\s\S]*?)<\/style>/g, '');
        
        // Take the last one and clean it
        let lastCss = matches[matches.length - 1][1];
        
        // Remove the toxic rules
        lastCss = lastCss.replace(/\/\* Fix ALL Inline White Backgrounds[^*]*\*\/[\s\S]*?}/g, '');
        lastCss = lastCss.replace(/div\[style\*="background-color: white"[^{]*{[\s\S]*?}/g, '');
        
        lastCss = lastCss.replace(/\/\* Profile Screen Specific Overrides[^*]*\*\/[\s\S]*?(?=\/\*)/g, '');
        
        lastCss = lastCss.replace(/\.profile-avatar\s*{[\s\S]*?}/g, '');
        lastCss = lastCss.replace(/#profile-avatar-circle\s*{[\s\S]*?}/g, '');
        lastCss = lastCss.replace(/\.default-avatar,\s*#profile-avatar-circle\s*{[\s\S]*?}/g, '');
        
        // Re-inject the cleaned CSS once
        html = html.replace('</head>', `<style id="apple-premium-dark-mode">\n${lastCss}\n</style>\n</head>`);
    }

    fs.writeFileSync(file, html);
    console.log(`Cleaned duplicates and toxic CSS in ${file}`);
});
