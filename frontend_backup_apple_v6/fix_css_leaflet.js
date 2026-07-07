const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix CSS variables
html = html.replace(/--color-navy:\s*var\(--color-text\);/g, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text:\s*var\(--color-text\);/g, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light:\s*var\(--color-text\);/g, '--color-text-light: #4A5568;');
html = html.replace(/--color-border:\s*var\(--color-text\);/g, '--color-border: #E2E8F0;');

// Clean Leaflet script tag
html = html.replace(/<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js">[\s\S]*?<\/script>/g, '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed CSS and Leaflet script');
