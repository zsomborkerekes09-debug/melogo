const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// 1. Confetti
content = content.replace("showGreenBanner('Sikeres jelentkezés!');\n            if (typeof triggerSuccessAnimation === 'function')", 
"showGreenBanner('Sikeres jelentkezés!');\n            if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });\n            if (typeof triggerSuccessAnimation === 'function')");

// 2. Hide message inputs
content = content.replace(/<div id="chat-input-bar" [\s\S]*?<\/button>\s*<\/div>/, '<div id="chat-input-bar" style="display:none !important;"></div>');
content = content.replace(/<div id="worker-chat-input-bar" [\s\S]*?<\/button>\s*<\/div>/, '<div id="worker-chat-input-bar" style="display:none !important;"></div>');

// 3. Add Phone to Chat header
content = content.replace('<div id="chat-detail-job" style="font-size: 12px; font-weight: 400; color: var(--color-text);">Fűnyírás</div>',
'<div id="chat-detail-job" style="font-size: 12px; font-weight: 400; color: var(--color-text);">Fűnyírás</div>\n                                <div id="chat-detail-phone" style="font-size: 11px; font-weight: 500; color: var(--color-text); margin-top: 1px;"></div>');

content = content.replace("document.getElementById('chat-detail-job').innerText = jobTitle;",
"document.getElementById('chat-detail-job').innerText = jobTitle;\n            document.getElementById('chat-detail-phone').innerText = 'Email: ' + (app.workerEmail || 'Nincs');");

content = content.replace("document.getElementById('chat-pinned-address').innerText = jobLoc;",
"document.getElementById('chat-pinned-address').innerText = jobLoc; document.getElementById('chat-detail-phone').innerText = 'Email: ' + (chatData ? chatData.employerEmail : 'Nincs');");

fs.writeFileSync('index.html', content, 'utf-8');
