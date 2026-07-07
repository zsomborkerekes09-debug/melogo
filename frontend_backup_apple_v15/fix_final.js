const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const brokenRegex = /function sendChatLocation\(\) \{[\s\S]*?function sendWorkerChatLocation\(\) \{[\s\S]*?\}/g;

const codeLines = [
    "function sendChatLocation() {",
    "    const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposvár';",
    "    const link = '\\x3Ca href=\"https://www.google.com/maps/dir/?api=1&destination=' + dest + '\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E';",
    "    const input = document.getElementById('chat-reply-input');",
    "    if (input) {",
    "        input.value = link;",
    "        sendChatMessageNew(true);",
    "    }",
    "}",
    "function sendWorkerChatLocation() {",
    "    const dest = 'Kaposvár';",
    "    const link = '\\x3Ca href=\"https://www.google.com/maps/dir/?api=1&destination=' + dest + '\" target=\"_blank\" style=\"color:#2563EB; text-decoration:underline;\"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E';",
    "    const input = document.getElementById('worker-chat-reply-input');",
    "    if (input) {",
    "        input.value = link;",
    "        sendWorkerChatMessageNew(true);",
    "    }",
    "}"
];

html = html.replace(brokenRegex, codeLines.join('\n'));

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed syntax error with String concat!');
