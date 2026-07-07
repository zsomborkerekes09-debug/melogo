const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const originalFuncStart = `function reportOrBlockUser() {
            if (typeof Swal !== 'undefined') {`;
const originalFuncEnd = `closeChatRoom();
            }
        }`;

let mStart = code.indexOf('function reportOrBlockUser(');
let mEnd = code.indexOf('}', code.indexOf('}', code.indexOf('}', code.indexOf('}', mStart) + 1) + 1) + 1) + 1; 

// Let's just use regex replacement for the whole function to be safe.
const regex = /function\s+reportOrBlockUser\(\)\s*\{[\s\S]*?alert\("A felhasználót jelentettük[^}]+\}\s*\}/;

const newFunc = `function reportOrBlockUser() {
            let targetId = window.currentEmployerDetailJobId || window.currentEditJobId || (typeof gameState !== 'undefined' ? gameState.jobTitle : null) || 'ismeretlen';
            if (typeof currentChatRoomId !== 'undefined' && currentChatRoomId) targetId = currentChatRoomId;

            const handleBlock = (reason) => {
                let blocked = JSON.parse(localStorage.getItem('melogo_blocked_items') || '[]');
                if (!blocked.includes(targetId)) {
                    blocked.push(targetId);
                    localStorage.setItem('melogo_blocked_items', JSON.stringify(blocked));
                }
                
                // Write to Firestore reports if available
                if (window.firebaseAPI && window.firebaseAPI.collection) {
                    try {
                        const currentUserEmail = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'vendeg';
                        window.firebaseAPI.collection('reports').add({
                            targetId: targetId,
                            reason: reason,
                            reportedBy: currentUserEmail,
                            timestamp: window.firebaseAPI.serverTimestamp ? window.firebaseAPI.serverTimestamp() : new Date()
                        }).catch(e => console.log('Report save error:', e));
                    } catch(e) {}
                }

                if (typeof Swal !== 'undefined') {
                    Swal.fire('Jelentve!', 'A tartalom jelentve lett a moderátoroknak, és elrejtettük a felületéről.', 'success');
                } else {
                    alert("A tartalom jelentve lett a moderátoroknak, és elrejtettük.");
                }
                
                if (typeof closeChatRoom === 'function') closeChatRoom();
                const empOverlay = document.getElementById('employer-action-overlay');
                if (empOverlay) empOverlay.classList.remove('active');
                const workOverlay = document.getElementById('worker-action-overlay');
                if (workOverlay) workOverlay.classList.remove('active');
                if (typeof refreshJobList === 'function') refreshJobList();
                if (typeof renderChatList === 'function') renderChatList();
            };

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Jelentés vagy Tiltás',
                    text: 'Kérjük, válassza ki az okot. A tartalmat azonnal eltávolítjuk a hírfolyamából.',
                    input: 'select',
                    inputOptions: {
                        'spam': 'Spam vagy Csalás',
                        'inappropriate': 'Nem megfelelő tartalom',
                        'harassment': 'Zaklatás vagy Sértő viselkedés'
                    },
                    inputPlaceholder: 'Válasszon okot...',
                    showCancelButton: true,
                    confirmButtonText: 'Jelentés és Tiltás',
                    cancelButtonText: 'Mégse',
                    confirmButtonColor: '#EF4444'
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleBlock(result.value);
                    }
                });
            } else {
                handleBlock('Ismeretlen ok (Nincs Swal)');
            }
        }`;

code = code.replace(regex, newFunc);

// Now update getFilteredAndSortedJobs to filter blocked items
const filterRegex = /let jobs = mockJobs\.filter\(j => \{/;
const newFilterLogic = `
            let blockedItems = JSON.parse(localStorage.getItem('melogo_blocked_items') || '[]');
            let jobs = mockJobs.filter(j => {
                if (blockedItems.includes(String(j.id)) || blockedItems.includes(j.title)) return false;
`;
code = code.replace(filterRegex, newFilterLogic);

// Also filter chats
const chatFilterRegex = /const allChats = localChats\.filter/;
const newChatFilterLogic = `
            let blockedItems = JSON.parse(localStorage.getItem('melogo_blocked_items') || '[]');
            const allChats = localChats.filter(c => !blockedItems.includes(c.id)).filter`;
code = code.replace(chatFilterRegex, newChatFilterLogic);

fs.writeFileSync(path, code);
console.log('Reporting & Blocking fix applied');
