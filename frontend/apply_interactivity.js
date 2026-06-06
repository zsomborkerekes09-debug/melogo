const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add data-category to Job Cards
html = html.replace('Fűnyírás a Desedánál</div>', 'Fűnyírás a Desedánál</div>');
// Let's replace the job cards to include data-category
html = html.replace('data-distance="2.5"', 'data-distance="2.5" data-category="Kert"');
html = html.replace('data-distance="3.1"', 'data-distance="3.1" data-category="Festés"');

// 2. Make Map Pins Clickable
// The map pins currently are div's. Let's add onclick.
html = html.replace(
    '<div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); cursor: pointer;" class="map-pin">',
    '<div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); cursor: pointer;" class="map-pin" onclick="document.getElementById(\'worker-action-overlay\').classList.add(\'active\')">'
);
html = html.replace(
    '<div style="position: absolute; top: 60%; left: 30%; transform: translate(-50%, -50%); cursor: pointer;" class="map-pin">',
    '<div style="position: absolute; top: 60%; left: 30%; transform: translate(-50%, -50%); cursor: pointer;" class="map-pin" onclick="document.getElementById(\'worker-action-overlay\').classList.add(\'active\')">'
);

// 3. Make Messages Clickable (Open Chat Detail)
// We need to add a Chat Detail Overlay HTML at the end of phone-app and a function to open it.
const chatDetailHTML = `
                <!-- Chat Detail Overlay -->
                <div class="settings-overlay" id="chat-detail-overlay">
                    <div class="settings-header" style="background-color: white; border-bottom: 1px solid var(--color-border); z-index: 10;">
                        <button class="settings-back-btn" onclick="document.getElementById('chat-detail-overlay').classList.remove('open')" style="color: var(--color-text-dark);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Vissza
                        </button>
                        <div class="settings-title" id="chat-detail-name">Tóth János</div>
                    </div>
                    <div class="chat-body" id="chat-detail-messages" style="flex:1; background:#F8F9FB; padding: 20px; overflow-y: auto;">
                        <div style="font-size: 11px; text-align: center; color: var(--color-text-muted); margin-bottom: 16px;">Ma 14:32</div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="background: white; padding: 12px 16px; border-radius: 18px; border-bottom-left-radius: 4px; align-self: flex-start; max-width: 80%; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-size: 14px; color: var(--color-text-dark);">
                                Szia! Vállalod a fűnyírást?
                            </div>
                        </div>
                    </div>
                    <div style="background: white; padding: 12px 20px; border-top: 1px solid var(--color-border); display: flex; gap: 10px; align-items: center; padding-bottom: 30px;">
                        <input type="text" id="chat-reply-input" placeholder="Üzenet írása..." style="flex: 1; background: #F3F4F6; border: none; padding: 10px 16px; border-radius: 20px; font-size: 14px; outline: none;">
                        <button onclick="sendChatMessage()" style="background: var(--color-green-go); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
`;

// Insert it before <!-- END OF PHONE APP --> or just before the closing </div> of phone-app
const phoneAppCloseIdx = html.lastIndexOf('</div>\n    </div>\n\n    <!-- TÁJÉKOZTATÓ SZEKCIÓ');
if (phoneAppCloseIdx !== -1) {
    html = html.substring(0, phoneAppCloseIdx) + chatDetailHTML + html.substring(phoneAppCloseIdx);
}

// Update the Messages list items to open Chat Detail
html = html.replace(/<div class="chat-row"/g, '<div class="chat-row" style="cursor: pointer;" onclick="openChat(\\\'Tóth János\\\')"');

// 4. Job Action Overlay: "Elvállalom" -> Close Action, Open Success
// The Elvállalom button is in #worker-action-footer
const applyBtnOld = `<button class="btn btn-primary" onclick="showWorkerToast('Jelentkezés elküldve!')">Elvállalom a munkát</button>`;
const applyBtnNew = `<button class="btn btn-primary" onclick="document.getElementById('worker-action-overlay').classList.remove('active'); document.getElementById('overlay-success').classList.add('active');">Elvállalom a munkát</button>`;
html = html.replace(applyBtnOld, applyBtnNew);

// 5. Success Overlay "Szuper!" -> Closes itself
const szuperOld = `<button class="btn" onclick="closeOverlay('success')">Szuper!</button>`;
const szuperNew = `<button class="btn" onclick="document.getElementById('overlay-success').classList.remove('active')">Szuper!</button>`;
html = html.replace(szuperOld, szuperNew);

// 6. Action Overlay Close Button -> Closes itself
const closeActionOld = `<button style="background:none; border:none; color:white; font-weight:700; cursor:pointer;" onclick="closeWorkerJobDetail()">Bezár</button>`;
const closeActionNew = `<button style="background:none; border:none; color:white; font-weight:700; cursor:pointer;" onclick="document.getElementById('worker-action-overlay').classList.remove('active')">Bezár</button>`;
html = html.replace(closeActionOld, closeActionNew);

// 7. Inject missing JS for Chat and Filter
const extraJS = `
        function openChat(name) {
            document.getElementById('chat-detail-name').innerText = name;
            document.getElementById('chat-detail-overlay').classList.add('open');
        }

        function sendChatMessage() {
            const input = document.getElementById('chat-reply-input');
            const text = input.value.trim();
            if (!text) return;
            
            const msgBox = document.createElement('div');
            msgBox.style.cssText = "background: var(--color-green-go); padding: 12px 16px; border-radius: 18px; border-bottom-right-radius: 4px; align-self: flex-end; max-width: 80%; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-size: 14px; color: white;";
            msgBox.innerText = text;
            
            const container = document.getElementById('chat-detail-messages').querySelector('div:last-child');
            container.appendChild(msgBox);
            input.value = '';
            
            const chatBody = document.getElementById('chat-detail-messages');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
`;
html = html.replace('// Élő szimulációs adatbázis / State', extraJS + '\n        // Élő szimulációs adatbázis / State');

// 8. Fix filterWorkerJobs function
// The existing filterWorkerJobs function uses card.getAttribute('data-category'). We added this earlier.
// Let's just make sure the pill styling updates.
const filterJSFix = `
        function filterWorkerJobs(cat) {
            // Update pills UI
            const btns = document.querySelectorAll('.category-btn');
            btns.forEach(btn => {
                if (btn.innerText.trim() === cat || (cat === 'all' && btn.innerText.trim() === 'Minden')) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = 'var(--color-navy)';
                    btn.style.color = '#fff';
                    btn.style.border = 'none';
                } else {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = '#fff';
                    btn.style.color = 'var(--color-text)';
                    btn.style.border = '1px solid var(--color-border)';
                }
            });

            // Filter cards
            const cards = document.querySelectorAll('#worker-jobs-list .job-card');
            cards.forEach(card => {
                const badge = card.getAttribute('data-category');
                if (cat === 'all' || cat === 'Minden' || cat === 'Összes' || badge === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
`;
// We will replace the original filterWorkerJobs(cat) function entirely.
// Find the original function bounds.
const filterStart = html.indexOf('function filterWorkerJobs(cat) {');
if (filterStart !== -1) {
    const nextFunction = html.indexOf('function filterWorkerByExactJob', filterStart);
    if (nextFunction !== -1) {
        html = html.substring(0, filterStart) + filterJSFix + html.substring(nextFunction);
    }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Interactivity applied successfully!');
