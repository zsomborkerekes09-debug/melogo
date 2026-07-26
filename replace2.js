const fs = require('fs');
const file = 'c:\\Users\\zsomb\\Documents\\melogo_app\\scratch\\melogo\\frontend\\index.html';
let content = fs.readFileSync(file, 'utf-8');

const targetStr = `        window._chatUnsubscribe = null;
        function renderActiveChatMessages(chatId) {`;
const startIdx = content.indexOf(targetStr);

if (startIdx === -1) {
    console.error('Could not find start of renderActiveChatMessages');
    process.exit(1);
}

const endStr = `            }, err => console.error('[Firestore] Chat listener error:', err));
        }`;
const endIdx = content.indexOf(endStr, startIdx);

if (endIdx === -1) {
    console.error('Could not find end of renderActiveChatMessages');
    process.exit(1);
}

const blockToEnd = endIdx + endStr.length;

const newFunc = `        window._chatUnsubscribe = null;
        window._chatMsgsUnsubscribe = null;
        function renderActiveChatMessages(chatId) {
            if (!chatId || !window.firebaseAPI || !window.firebaseDb) return;
            if (window._chatUnsubscribe) { window._chatUnsubscribe(); window._chatUnsubscribe = null; }
            if (window._chatMsgsUnsubscribe) { window._chatMsgsUnsubscribe(); window._chatMsgsUnsubscribe = null; }
            
            const chatRef = window.firebaseAPI.doc(window.firebaseDb, "chats", chatId);
            window._chatUnsubscribe = window.firebaseAPI.onSnapshot(chatRef, async (snapshot) => {
                if (!snapshot.exists()) return;
                const chatData = snapshot.data();
                chatData.id = snapshot.id;
                if (window.selectedChatId !== chatId) return;
                
                await loadChatHeaderAndStatus(chatId, chatData);
                renderChatStatusPills(chatData);
                updateChatActionBarNew(chatData);
            }, err => console.error('[Firestore] Chat listener error:', err));

            const msgsRef = window.firebaseAPI.collection(window.firebaseDb, "chats", chatId, "messages");
            const msgsQuery = window.firebaseAPI.query(msgsRef, window.firebaseAPI.orderBy("timestamp", "asc"));
            window._chatMsgsUnsubscribe = window.firebaseAPI.onSnapshot(msgsQuery, (snapshot) => {
                let msgs = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    msgs.push(data);
                });
                
                const chat = localChats.find(c => c.id === chatId);
                if (chat) {
                    if (msgs.length > 0) {
                        chat.messages = msgs;
                        saveLocalChats();
                        
                        if (window.selectedChatId === chatId) {
                            const nameEl = document.getElementById('chat-detail-name');
                            const name = nameEl ? nameEl.innerText : '';
                            const jobTitleEl = document.getElementById('chat-pinned-job');
                            const jobTitle = jobTitleEl ? jobTitleEl.innerText : '';
                            
                            // Re-render bubbles and clear typing indicator safely
                            openChat(name, jobTitle, chat.lastMsg || '', chat.time || '', false, chatId);
                        }
                    }
                }
            }, err => console.error('[Firestore] Messages listener error:', err));
        }`;

content = content.substring(0, startIdx) + newFunc + content.substring(blockToEnd);
fs.writeFileSync(file, content);
console.log('Successfully replaced renderActiveChatMessages');
