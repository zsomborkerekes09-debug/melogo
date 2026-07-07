const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix CSS variables
html = html.replace(/--color-navy: var\(--color-text\);/g, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text: var\(--color-text\);/g, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light: var\(--color-text\);/g, '--color-text-light: #4A5568;');
html = html.replace(/--color-border: var\(--color-text\);/g, '--color-border: #E2E8F0;');

// 2. Clean Leaflet script tag
html = html.replace(/<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js">[\s\S]*?<\/script>/, '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');

// 3. Fix the syntax error lines exactly!
// We find any unquoted <a href=...> assignment and replace it with a properly backticked and encoded one.
// We match: const link = <a href="https://www.google.com/maps/dir/?api=1&destination= + dest + " target="_blank" style="color:#2563EB; text-decoration:underline;">.*?</a>;
// Notice that the broken string literally contains ` + dest + ` as text!

const brokenLinkRegex = /const link = <a href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination= \+ dest \+ " target="_blank" style="color:#2563EB; text-decoration:underline;">.*?<\/a>;/g;

const fixedLink = 'const link = `\\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E`;';

html = html.replace(brokenLinkRegex, fixedLink);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed using exact line replacement.');
