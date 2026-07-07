const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const lavaBase = '#0A0A0A';
const lavaSurface = 'rgba(255, 255, 255, 0.04)'; // Very subtle transparent surface so the gradient shows through
const lavaText = 'rgba(255, 255, 255, 0.9)';
const lavaTextMuted = 'rgba(255, 255, 255, 0.4)';
const lavaBorder = 'rgba(255, 87, 34, 0.15)'; // Subtle orange tint border
const lavaAccent = '#FF5722'; // Lava Orange

// Update CSS variables
content = content.replace(/--color-bg:\s*[^;]+;/g, `--color-bg: transparent !important;`);
content = content.replace(/--color-surface:\s*[^;]+;/g, `--color-surface: ${lavaSurface} !important;`);
content = content.replace(/--color-text:\s*[^;]+;/g, `--color-text: ${lavaText} !important;`);
content = content.replace(/--color-text-muted:\s*[^;]+;/g, `--color-text-muted: ${lavaTextMuted} !important;`);
content = content.replace(/--color-border:\s*[^;]+;/g, `--color-border: ${lavaBorder} !important;`);
content = content.replace(/--color-green:\s*[^;]+;/g, `--color-green: ${lavaAccent} !important;`);

// Inject the radial gradient top-glow into the head
const gradientStyle = `
<style id="lava-glow">
    body, #app-container {
        background: radial-gradient(120% 50% at 50% 0%, #3D1200 0%, #0A0A0A 60%, #0A0A0A 100%) !important;
        background-attachment: fixed !important;
        min-height: 100vh;
    }
    .header-midnight, #home-search-display, .search-bar, .gps-bar {
        background: transparent !important;
    }
    .job-card {
        background: rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 0.5px solid rgba(255, 87, 34, 0.2) !important;
    }
    .brand-logo span {
        color: #FF5722 !important;
        text-shadow: 0 0 12px rgba(255, 87, 34, 0.6) !important;
    }
</style>
</head>`;
content = content.replace(/<\/head>/, gradientStyle);

// Also replace inline #34D399 (Mint) from previous change to Lava Orange
content = content.replace(/#34D399/g, lavaAccent);

fs.writeFileSync(file, content, 'utf8');
console.log('Lava Glow applied!');
