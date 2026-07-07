const fs = require('fs');

let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

const polishCSS = `
<style id="final-ui-polish">
/* 1. Kőkemény, pengeéles tipográfia (Apple Standard) */
body, input, textarea, select, button {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
}

/* 2. Sima (Smooth) és könnyed animációk minden interaktív elemen */
button, .emp-cat-card, .filter-chip, .action-overlay, input, textarea {
    transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

/* 3. Gombok "könnyed" nyomás-effektusa (Mikro-interakciók) */
button:active, .emp-cat-card:active {
    transform: scale(0.96) !important;
}

/* 4. Éles és tiszta beviteli mezők (Inputs & Textareas) */
input[type="text"], input[type="number"], input[type="tel"], textarea {
    background: #1C1C1E !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #FFFFFF !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) inset !important;
}
input[type="text"]:focus, input[type="number"]:focus, input[type="tel"]:focus, textarea:focus {
    border: 1px solid #32D74B !important; /* Apple Zöld fókusz */
    background: #2C2C2E !important;
    box-shadow: 0 0 0 3px rgba(50, 215, 75, 0.15), 0 2px 8px rgba(0,0,0,0.2) inset !important;
    outline: none !important;
}

/* 5. Címkék és alcímek kontrasztja (Jól láthatóság) */
.form-label, label, .overlay-title {
    color: #FFFFFF !important;
    font-weight: 600 !important;
    letter-spacing: 0.3px !important;
}
.text-muted, .secondary-text {
    color: #8E8E93 !important; /* Tiszta Apple szürke */
    font-weight: 400 !important;
}

/* 6. Finom, éles keretek a kártyákon */
.emp-cat-card {
    border: 1px solid rgba(255,255,255,0.05) !important;
    background: #1C1C1E !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}
.emp-cat-card.active {
    border: 1px solid #32D74B !important;
    box-shadow: 0 0 15px rgba(50, 215, 75, 0.2) !important;
}

/* 7. Emojik tökéletes pozicionálása és méretezése */
.emp-cat-card svg, .emp-cat-card span.emoji {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)) !important;
}
</style>
`;

if (!html.includes('id="final-ui-polish"')) {
    html = html.replace('</head>', polishCSS + '\n</head>');
} else {
    html = html.replace(/<style id="final-ui-polish">[\s\S]*?<\/style>/, polishCSS);
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Final UI polish applied!');
