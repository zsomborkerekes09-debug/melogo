const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const regex = /function\s+reportOrBlockUser\(\)\s*\{[\s\S]*?handleBlock\('Ismeretlen ok \(Nincs Swal\)'\);\n\s*\}/;

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

                alert("A tartalom jelentve lett a moderátoroknak, és azonnal elrejtettük a felületedről.");
                
                if (typeof closeChatRoom === 'function') closeChatRoom();
                const empOverlay = document.getElementById('employer-action-overlay');
                if (empOverlay) empOverlay.classList.remove('active');
                const workOverlay = document.getElementById('worker-action-overlay');
                if (workOverlay) workOverlay.classList.remove('active');
                
                // Close job detail sheets
                const workerJobDetail = document.getElementById('worker-job-detail');
                if (workerJobDetail) workerJobDetail.style.transform = 'translateY(100%)';
                
                if (typeof closeWorkerJobDetailNew === 'function') closeWorkerJobDetailNew();
                if (typeof closeEmployerAdDetailNew === 'function') closeEmployerAdDetailNew();

                if (typeof refreshJobList === 'function') refreshJobList();
                if (typeof renderChatList === 'function') renderChatList();
            };

            const isConfirmed = confirm('Biztosan jelented és letiltod ezt a tartalmat? Ezzel eltűnik a hírfolyamodból és a moderátorok értesítést kapnak.');
            if (isConfirmed) {
                let reason = prompt('Kérlek írd le röviden a jelentés okát (opcionális):', '');
                handleBlock(reason || 'Nem adott meg okot');
            }
        }`;

code = code.replace(regex, newFunc);
fs.writeFileSync(path, code);
console.log('Reporting & Blocking fix updated for native confirm');
