const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const jsFallback = `<head>\n    <script>if (/iPhone|iPod/.test(navigator.userAgent)) document.documentElement.style.setProperty('--safe-top', '55px'); else document.documentElement.style.setProperty('--safe-top', '0px');</script>`;

code = code.replace('<head>', jsFallback);
code = code.replace(/env\(safe-area-inset-top\)/g, 'max(env(safe-area-inset-top), var(--safe-top))');
code = code.replace(/env\(safe-area-inset-top, 40px\)/g, 'max(env(safe-area-inset-top), var(--safe-top))');

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
console.log('Injected fallback');
