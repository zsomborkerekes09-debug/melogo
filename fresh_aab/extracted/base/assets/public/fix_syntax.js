const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/--color-navy: var\(--color-text\);/, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text: var\(--color-text\);/, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light: var\(--color-text\);/, '--color-text-light: #4A5568;');
html = html.replace(/--color-border: var\(--color-text\);/, '--color-border: #E2E8F0;');

const leafletScriptRegex = /<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js">[\s\S]*?<\/script>/;
html = html.replace(leafletScriptRegex, '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');

const brokenFuncsRegex = /function sendChatLocation\(\) \{[\s\S]*?function sendWorkerChatLocation\(\) \{[\s\S]*?\}/g;
const fixedFuncs = "function sendChatLocation() { const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposv%C3%A1r'; const link = <a href=\"https://www.google.com/maps/dir/?api=1&destination=\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\">📍 Helyszín megnyitása</a>; const input = document.getElementById('chat-reply-input'); if (input) { input.value = link; sendChatMessageNew(true); } } function sendWorkerChatLocation() { const dest = 'Kaposvár'; const link = <a href=\"https://www.google.com/maps/dir/?api=1&destination=\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\">📍 Helyszín megnyitása</a>; const input = document.getElementById('worker-chat-reply-input'); if (input) { input.value = link; sendWorkerChatMessageNew(true); } }";

html = html.replace(brokenFuncsRegex, fixedFuncs);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html syntax and CSS variables.');
