const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// Fix .settings-overlay so it acts as a flex container and doesn't scroll the header
html = html.replace(/\.settings-overlay\s*\{([\s\S]*?)overflow-y:\s*auto\s*!important;/g, '.settings-overlay {$1display: flex !important;\nflex-direction: column !important;\n/* overflow-y removed */');

fs.writeFileSync('frontend/index.html', html);
console.log('Fixed overlay flex layout');
