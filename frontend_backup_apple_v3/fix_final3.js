const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix CSS variables
html = html.replace(/--color-navy: var\(--color-text\);/, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text: var\(--color-text\);/, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light: var\(--color-text\);/, '--color-text-light: #4A5568;');
html = html.replace(/--color-border: var\(--color-text\);/, '--color-border: #E2E8F0;');

// 2. Fix the syntax error blocks
const brokenRegex = /function sendChatLocation\(\) \{[\s\S]*?function sendWorkerChatLocation\(\) \{[\s\S]*?\}/g;

const bt = String.fromCharCode(96); // backtick
const dol = String.fromCharCode(36); // dollar

const fixedFuncs = 
"function sendChatLocation() {\n" +
"    const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposvár';\n" +
"    const link = " + bt + "<a href=\"https://www.google.com/maps/dir/?api=1&destination=" + dol + "{dest}\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\">📍 Helyszín megnyitása</a>" + bt + ";\n" +
"    const input = document.getElementById('chat-reply-input');\n" +
"    if (input) {\n" +
"        input.value = link;\n" +
"        sendChatMessageNew(true);\n" +
"    }\n" +
"}\n" +
"function sendWorkerChatLocation() {\n" +
"    const dest = 'Kaposvár';\n" +
"    const link = " + bt + "<a href=\"https://www.google.com/maps/dir/?api=1&destination=" + dol + "{dest}\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\">📍 Helyszín megnyitása</a>" + bt + ";\n" +
"    const input = document.getElementById('worker-chat-reply-input');\n" +
"    if (input) {\n" +
"        input.value = link;\n" +
"        sendWorkerChatMessageNew(true);\n" +
"    }\n" +
"}";

html = html.replace(brokenRegex, fixedFuncs);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed syntax error with double quotes.');
