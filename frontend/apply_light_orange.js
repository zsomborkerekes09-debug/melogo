const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const lightBase = '#F2F2F7'; // Apple light gray
const lightSurface = 'rgba(255, 255, 255, 0.7)';
const lightText = '#1D1D1F';
const lightTextMuted = '#86868B';
const lightBorder = 'rgba(0, 0, 0, 0.08)';
const accentOrange = '#FF5722';
const neonGreen = '#c0fc2a';

// Update CSS variables for LIGHT MODE
content = content.replace(/--color-bg:\s*[^;]+;/g, `--color-bg: transparent !important;`);
content = content.replace(/--color-surface:\s*[^;]+;/g, `--color-surface: ${lightSurface} !important;`);
content = content.replace(/--color-text:\s*[^;]+;/g, `--color-text: ${lightText} !important;`);
content = content.replace(/--color-text-muted:\s*[^;]+;/g, `--color-text-muted: ${lightTextMuted} !important;`);
content = content.replace(/--color-border:\s*[^;]+;/g, `--color-border: ${lightBorder} !important;`);
content = content.replace(/--color-green:\s*[^;]+;/g, `--color-green: ${accentOrange} !important;`);

// Replace the injected style block (id="lava-glow")
const newGradientStyle = `
<style id="light-orange-glow">
    body, #app-container {
        background: radial-gradient(150% 60% at 50% 0%, rgba(255, 87, 34, 0.18) 0%, rgba(255, 140, 0, 0.05) 40%, #F2F2F7 100%) !important;
        background-color: #F2F2F7 !important;
        background-attachment: fixed !important;
        min-height: 100vh;
    }
    .header-midnight, #home-search-display, .search-bar, .gps-bar {
        background: transparent !important;
    }
    .job-card {
        background: rgba(255, 255, 255, 0.5) !important;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.08) !important;
    }
    .brand-logo span {
        color: ${neonGreen} !important;
        text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25) !important; /* Drop shadow so the neon green is readable on light bg */
    }
</style>
</head>`;

// Replace old style if it exists, otherwise just inject
if (content.includes('<style id="lava-glow">')) {
    content = content.replace(/<style id="lava-glow">[\s\S]*?<\/style>\s*<\/head>/, newGradientStyle);
} else {
    content = content.replace(/<\/head>/, newGradientStyle);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Light Orange Glow applied!');
