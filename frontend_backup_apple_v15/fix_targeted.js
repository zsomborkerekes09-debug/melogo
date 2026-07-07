const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix CSS variables (replace exactly)
html = html.replace(/--color-navy: var\(--color-text\);/, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text: var\(--color-text\);/, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light: var\(--color-text\);/, '--color-text-light: #4A5568;');
html = html.replace(/--color-border: var\(--color-text\);/, '--color-border: #E2E8F0;');

// 2. Fix the syntax errors globally by searching for the broken HTML tags without quotes
// Specifically: <a href="https://www.google.com/maps/dir/?api=1&destination= + dest + " target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>
// Note: In 6add588, the Hungarian characters are perfectly encoded, so "📍 Helyszín megnyitása" is exact.

const brokenLinkRegex = /<a href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása<\/a>/g;

// Wait, the actual broken string in 6add588 is:
// const link = <a href="https://www.google.com/maps/dir/?api=1&destination=" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>;
// BUT wait, look at my grep output from earlier:
// <a href="https://www.google.com/maps/dir/?api=1&destination=" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>

// Let's replace the whole assignment line:
html = html.replace(/const link = <a href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása<\/a>;/g, 
    'const link = \\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=\\" target="_blank" style="color:#2563EB; text-decoration:underline;"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E;');

// Wait! Does it have + dest + or destination="?
// Earlier output showed: destination=" target="_blank" (Wait, where did + dest + go? In fix_batch1.js I replaced it with ${dest}, which evaluated to empty string in PS, so it became destination="!)
// And the first broken one inside leaflet.js has destination= + dest + ".

html = html.replace(/const link = <a href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination= \+ dest \+ " target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása<\/a>;/g, 
    'const link = \\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=\\" target="_blank" style="color:#2563EB; text-decoration:underline;"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E;');


fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed CSS and syntax.');
