const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const brokenFunctionRegex = /function triggerPhotoAttach\(\) \{[\s\S]*?renderChatList\(\);\s*\}\s*\}\s*\}/;

const fixedFunction = `function triggerPhotoAttach() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    showPushNotification('Fotó feltöltve', 'A munka fotója el lett küldve a munkáltatónak!', '#22C55E');
                    const msgContainer = document.getElementById('chat-detail-messages');
                    const bubble = document.createElement('div');
                    bubble.style.cssText = \`
                        max-width:85%; padding:10px; border-radius: 18px 18px 4px 18px;
                        background:var(--color-navy); color:#fff; font-size:14px;
                        align-self:flex-end; 
                    \`;
                    const photoHtml = \`<img src="\${dataUrl}" style="width:100%; max-height:200px; object-fit:cover; border-radius:8px; display:block;"><div style="font-size:11px; margin-top:6px; opacity:0.7;">Munka fotója elküldve</div>\`;
                    bubble.innerHTML = photoHtml;
                    msgContainer.appendChild(bubble);
                    msgContainer.scrollTop = msgContainer.scrollHeight;

                    // Persist photo attachment inside localChats and trigger save/sync!
                    if (selectedChatId) {
                        const chat = localChats.find(c => c.id === selectedChatId);
                        if (chat) {
                            if (!chat.messages) chat.messages = [];
                            const senderRole = currentRole || localStorage.getItem('melogo_active_role') || 'worker';
                            chat.messages.push({ from: senderRole, text: photoHtml, time: 'Most' });
                            saveLocalChats();
                            renderChatList();
                        }
                    }
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }`;

html = html.replace(brokenFunctionRegex, fixedFunction);

// While we are at it, let's make sure the two broken a hrefs for sendChatLocation are fixed!
const brokenLinkRegex = /const link = <a href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination= \+ dest \+ " target="_blank" style="color:#2563EB; text-decoration:underline;">.*?<\/a>;/g;
const fixedLink = 'const link = `\\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\\x3E📍 Helyszín megnyitása\\x3C/a\\x3E`;';
html = html.replace(brokenLinkRegex, fixedLink);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed triggerPhotoAttach missing braces and sendChatLocation syntax errors!');
