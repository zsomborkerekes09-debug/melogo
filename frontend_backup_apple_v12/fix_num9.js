const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const brokenRegex = /function sendChatLocation\(\) \{[\s\S]*?function sendWorkerChatLocation\(\) \{[\s\S]*?\}/g;

const fixedStr = "function sendChatLocation() { const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposvár'; const link = <a href=\"https://www.google.com/maps/dir/?api=1&destination=\\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\">📍 Helyszín megnyitása</a>; const input = document.getElementById('chat-reply-input'); if (input) { input.value = link; sendChatMessageNew(true); } } function sendWorkerChatLocation() { const dest = 'Kaposvár'; const link = <a href=\"https://www.google.com/maps/dir/?api=1&destination=\\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\">📍 Helyszín megnyitása</a>; const input = document.getElementById('worker-chat-reply-input'); if (input) { input.value = link; sendWorkerChatMessageNew(true); } }";

html = html.replace(brokenRegex, fixedStr.replace(/Kaposvár/g, 'Kaposvár'));

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed number 9 syntax error.');
