const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetFunctionStart = "async function workerApplyToJob() {";
const startIdx = content.indexOf(targetFunctionStart);
if (startIdx === -1) {
    console.log("Could not find workerApplyToJob");
    process.exit(1);
}

// Find the end of the function (rough matching via known next function or signature)
const nextFuncIdx = content.indexOf("function updateApplyBtnState() {", startIdx);
if (nextFuncIdx === -1) {
    console.log("Could not find end of workerApplyToJob");
    process.exit(1);
}

// The replacement text:
const replacement = \sync function workerApplyToJob() {
            gameState.status = 'Keresés';
            gameState.applied = true; 
            
            const badge = document.getElementById('app-msg-badge');
            if (badge) { badge.innerText = '1'; badge.style.display = 'flex'; }

            const matchedJob = mockJobs.find(j => j.title === gameState.jobTitle);
            
            // STRICT AUTHENTICATION GUARDS (BUG-003)
            if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
                alert("Kérjük, jelentkezz be újra a jelentkezéshez!");
                return;
            }
            if (!matchedJob || !matchedJob.ownerUid) {
                alert("Hiba történt a munka lekérdezésekor.");
                return;
            }
            
            const employerEmail = matchedJob.ownerEmail || 'ismeretlen@employer.hu';
            const employerId = matchedJob.ownerUid;
            const workerEmail = window.firebaseAuth.currentUser.email;
            const workerId = window.firebaseAuth.currentUser.uid;

            // Prevent applying to own job
            if (employerId === workerId) {
                alert("Saját munkádra nem jelentkezhetsz!");
                gameState.applied = false;
                gameState.status = '';
                const btn = document.querySelector('.emp-submit-btn');
                if (btn) btn.disabled = false;
                return;
            }
            
            const _workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
            const workerName = _workerSession.name || (currentUser ? currentUser.name : 'Diák');
            const employerName = matchedJob.employer || matchedJob.ownerName || 'Megbízó';
            const jobTitle = gameState.jobTitle || 'Fűnyírás';
            const jobId = matchedJob.id;

            // DUPLICATE APPLICATION GUARD (BUG-002)
            if (window.firebaseDb && window.firebaseAPI) {
                try {
                    const chatsRef = window.firebaseAPI.collection(window.firebaseDb, "chats");
                    const q = window.firebaseAPI.query(chatsRef, 
                        window.firebaseAPI.where("jobId", "==", jobId),
                        window.firebaseAPI.where("workerId", "==", workerId)
                    );
                    const snap = await window.firebaseAPI.getDocs(q);
                    if (!snap.empty) {
                        console.log("Már jelentkeztél erre a munkára, chat létezik.");
                        // Nincs szükség új chatre
                        return;
                    }
                } catch(e) {
                    console.error("Duplicate check failed", e);
                }
            }

            // Create Firestore chat document
            let chatDocId = 'chat_' + Date.now();
            const chatData = {
                id: chatDocId,
                jobId: jobId,
                workerId: workerId,
                employerId: employerId,
                workerEmail: workerEmail,
                employerEmail: employerEmail,
                workerName: workerName,
                employerName: employerName,
                jobTitle: jobTitle,
                lastMsg: 'A munkás jelentkezett a munkára',
                time: 'Most',
                isUnread: true,
                unreadCount: 1,
                isOnline: true,
                role: 'worker',
                active: true,
                archived: false,
                status: 'pending',
                createdAt: Date.now(),
                timestamp: window.firebaseAPI ? window.firebaseAPI.serverTimestamp() : Date.now()
            };

            const appData = {
                id: chatDocId,
                jobId: jobId,
                workerUid: workerId,
                employerUid: employerId,
                workerName: workerName,
                employerName: employerName,
                jobTitle: jobTitle,
                status: 'pending',
                price: matchedJob.price || 0,
                createdAt: window.firebaseAPI ? window.firebaseAPI.serverTimestamp() : Date.now()
            };

            if (window.firebaseDb && window.firebaseAPI) {
                try {
                    const chatRef = await window.firebaseAPI.addDoc(
                        window.firebaseAPI.collection(window.firebaseDb, "chats"),
                        chatData
                    );
                    // Update chat with real doc id
                    await window.firebaseAPI.updateDoc(chatRef, { id: chatRef.id });
                    chatData.id = chatRef.id;

                    await window.firebaseAPI.addDoc(
                        window.firebaseAPI.collection(window.firebaseDb, "applications"),
                        appData
                    );
                } catch(e) {
                    console.error("Firestore jelentkezés hiba:", e);
                }
            }

            // Fallback UI updates
            const existingChats = JSON.parse(localStorage.getItem('melogo_local_chats') || '[]');
            existingChats.unshift(chatData);
            localStorage.setItem('melogo_local_chats', JSON.stringify(existingChats));

            const existingApps = JSON.parse(localStorage.getItem('melogo_worker_applications') || '[]');
            existingApps.unshift(appData);
            localStorage.setItem('melogo_worker_applications', JSON.stringify(existingApps));

            if (typeof renderWorkerChats === 'function') renderWorkerChats();
            if (typeof updateApplyBtnState === 'function') updateApplyBtnState();
        }

        \;

// Replace from targetFunctionStart up to (but not including) nextFuncIdx
content = content.substring(0, startIdx) + replacement + content.substring(nextFuncIdx);
fs.writeFileSync('index.html', content, 'utf8');
console.log("Successfully replaced workerApplyToJob");
