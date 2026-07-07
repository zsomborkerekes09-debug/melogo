const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix CSS variables
html = html.replace(/--color-navy: var\(--color-text\);/g, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text: var\(--color-text\);/g, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light: var\(--color-text\);/g, '--color-text-light: #4A5568;');
html = html.replace(/--color-border: var\(--color-text\);/g, '--color-border: #E2E8F0;');

// 2. Clean Leaflet script tag (using string replacement since it's exact or just a simple regex)
const leafletRegex = /<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js">[\s\S]*?<\/script>/;
html = html.replace(leafletRegex, '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');

// 3. Fix the syntax errors globally
const fixed_code = `function sendChatLocation() {
    const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposv%C3%A1r';
    const link = \`<a href="https://www.google.com/maps/dir/?api=1&destination=\${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>\`;
    const input = document.getElementById('chat-reply-input');
    if (input) {
        input.value = link;
        sendChatMessageNew(true);
    }
}
function sendWorkerChatLocation() {
    const dest = 'Kaposvár';
    const link = \`<a href="https://www.google.com/maps/dir/?api=1&destination=\${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>\`;
    const input = document.getElementById('worker-chat-reply-input');
    if (input) {
        input.value = link;
        sendWorkerChatMessageNew(true);
    }
}`;

html = html.replace(/function sendChatLocation\(\)\s*\{[\s\S]*?function sendWorkerChatLocation\(\)\s*\{[\s\S]*?\}\s*\n*\s*\}/g, fixed_code);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed everything cleanly.');
