const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const desktopCss = `
/* ===== DESKTOP WEB OPTIMIZATION ===== */
@media (min-width: 481px) {
    html {
        background-color: #0F172A !important;
    }
    body {
        max-width: 480px;
        margin: 0 auto;
        position: relative;
        box-shadow: 0 0 50px rgba(0,0,0,0.5);
        height: 100vh;
        overflow: hidden;
        /* Magic trick to contain position: fixed elements */
        transform: translateX(0);
        /* Ensure background matches mobile */
        background-color: var(--color-bg) !important;
    }
    /* Fix viewport-width elements */
    #apply-success-overlay {
        width: 100% !important;
    }
}
`;

if (!content.includes('/* ===== DESKTOP WEB OPTIMIZATION ===== */')) {
    content = content.replace(/<\/style>/, desktopCss + '\n</style>');
    fs.writeFileSync(file, content);
    console.log('Script 11_desktop completed.');
} else {
    console.log('Already added.');
}
