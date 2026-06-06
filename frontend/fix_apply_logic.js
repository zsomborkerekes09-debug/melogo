const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The original logic tries to update two missing containers.
// We will replace the entire workerApplyToJob function up to its closing brace.

const oldBlockStart = "function workerApplyToJob() {";
const oldBlockEndMarker = "updateWorkerStatusUI();\n        }";

const startIndex = html.indexOf(oldBlockStart);
const endIndex = html.indexOf(oldBlockEndMarker, startIndex) + oldBlockEndMarker.length;

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    const newFunction = `function workerApplyToJob() {
            gameState.status = 'Keresés';
            gameState.applied = true; 
            
            const badge = document.getElementById('app-msg-badge');
            if (badge) { badge.innerText = '1'; badge.style.display = 'flex'; }

            const chatContainer = document.getElementById('messages-chat-list');
            if (chatContainer) {
                chatContainer.insertAdjacentHTML('afterbegin', \`
                    <div class="chat-item" onclick="currentRole === 'worker' ? openWorkerChatRoom() : openEmployerChatRoom()">
                        <div class="chat-avatar status-online" style="background: var(--color-green-go);">KB</div>
                        <div class="chat-content">
                            <div class="chat-header-row">
                                <span class="chat-user-name" style="display: flex; align-items: center; gap: 4px; font-weight: 700; color: var(--color-text-dark);">
                                    Kovács Bence
                                    <svg class="verified-badge-svg" style="width: 14px; height: 14px; fill: #007aff; display: inline-block;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                    <span style="font-size: 10px; font-weight: normal; color: var(--color-text-muted); margin-left: 2px;">(Jelentkező)</span>
                                </span>
                                <span class="chat-time">Most</span>
                            </div>
                            <div class="chat-header-row">
                                <span class="chat-job-tag" style="color: var(--color-blue-uber); font-weight: 600;">\${gameState.jobTitle}</span>
                                <div class="chat-unread-dot"></div>
                            </div>
                            <p class="chat-last-msg">Szia! Nagyon szívesen elvállalom a munkát holnap...</p>
                        </div>
                    </div>
                \`);
            }

            // Automatikus váltás a Megbízó nézetre és üzenetek megnyitása a könnyű teszteléshez
            setTimeout(() => {
                switchRole('employer');
                navigateApp(2); 
            }, 500);

            document.getElementById('worker-success-title').innerText = 'Sikeres jelentkezés!';
            document.getElementById('worker-success-desc').innerText = 'A Munkáltató értesítést kapott. Mutatjuk a nézetét...';
            const wSuccess = document.getElementById('worker-success');
            if (wSuccess) wSuccess.classList.add('active');

            updateWorkerStatusUI();
        }`;
    
    html = html.substring(0, startIndex) + newFunction + html.substring(endIndex);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Replaced workerApplyToJob successfully.");
} else {
    console.log("Could not find the function block to replace.");
}
