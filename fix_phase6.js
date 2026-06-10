/**
 * Phase 6 – Firebase Backend Audit Fix Script
 * All fixes are applied via targeted string/regex replacements on frontend/index.html
 */
const fs = require('fs');
const filePath = 'frontend/index.html';
let html = fs.readFileSync(filePath, 'utf8');
let fixes = [];

function replace(search, replacement, label) {
    // Try as-is first, then CRLF version
    if (html.includes(search)) {
        html = html.split(search).join(replacement);
        fixes.push(`[OK] ${label}`);
    } else {
        const crlf = search.replace(/\n/g, '\r\n');
        if (html.includes(crlf)) {
            html = html.split(crlf).join(replacement.replace(/\n/g, '\r\n'));
            fixes.push(`[OK-CRLF] ${label}`);
        } else {
            fixes.push(`[MISS] ${label}`);
        }
    }
}

// =============================================================================
// FIX 1: setupFirestoreListeners – add docChanges() for delete handling,
//         switch to UID-based chats query, add workerChats + employerChats dual query
// =============================================================================
replace(
    `        window.setupFirestoreListeners = function(role) {
            if (!auth.currentUser) {
                console.log('[DEBUG] setupFirestoreListeners skipped: user not logged in.');
                return;
            }
            const user = auth.currentUser;
            const email = user.email || '';

            // Clean up existing listeners
            if (window.jobsUnsubscribe) { window.jobsUnsubscribe(); window.jobsUnsubscribe = null; }
            if (window.appsUnsubscribe) { window.appsUnsubscribe(); window.appsUnsubscribe = null; }
            if (window.chatsUnsubscribe) { window.chatsUnsubscribe(); window.chatsUnsubscribe = null; }

            console.log('[DEBUG] Setting up role-based Firestore listeners for:', role, 'User email:', email);

            // 1. Jobs listener:
            let jobsQuery;
            if (role === 'worker') {
                jobsQuery = query(collection(db, "jobs"), where("status", "==", "Keresés"));
            } else {
                jobsQuery = query(collection(db, "jobs"), where("ownerEmail", "==", email));
            }

            window.jobsUnsubscribe = onSnapshot(jobsQuery, (snapshot) => {
                let allJobs = [];
                snapshot.forEach(d => {
                    let jobData = d.data();
                    jobData.id = d.id;
                    allJobs.push(jobData);
                });
                console.log('[Firestore] Jobs snapshot received:', allJobs.length, 'jobs');
                
                if (!window.mockJobs) window.mockJobs = [];
                const userCoords = window.userCoords || { lat: 46.3593, lon: 17.7967 };
                
                function haversine(lat1, lon1, lat2, lon2) {
                    const R = 6371;
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
                    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
                }
                
                // Remove existing Firestore jobs from mockJobs if they are not in the current snapshot
                const activeJobIds = new Set(allJobs.map(j => j.id));
                window.mockJobs = window.mockJobs.filter(m => !m.isFirestore || activeJobIds.has(m.id));

                allJobs.forEach(fJob => {
                    if (!fJob.id || !fJob.title) return;
                    
                    let dist = null;
                    if (fJob.lat && fJob.lon) {
                        dist = haversine(userCoords.lat, userCoords.lon, fJob.lat, fJob.lon);
                    } else {
                        dist = Math.round(Math.random() * 4 * 10) / 10;
                    }
                    
                    const normalized = {
                        id: fJob.id,
                        title: fJob.title,
                        employer: fJob.ownerName || (fJob.ownerEmail ? fJob.ownerEmail.split('@')[0] : 'Megbízó'),
                        price: parseInt(fJob.price) || 10000,
                        distance: dist,
                        lat: fJob.lat || 46.36,
                        lon: fJob.lon || 17.79,
                        category: fJob.category || 'Kert',
                        location: fJob.location || 'Kaposvár',
                        time: fJob.datetime ? fJob.datetime.slice(0, 10) : new Date().toISOString().slice(0, 10),
                        urgent: fJob.urgent || false,
                        timeOffset: fJob.createdAt ? -(Number(fJob.createdAt)) : -Date.now(),
                        desc: fJob.details || fJob.desc || '',
                        toolsRequired: fJob.toolsRequired || 'employer',
                        status: fJob.status || 'Keresés',
                        isFirestore: true
                    };
                    
                    const existing = window.mockJobs.findIndex(m => m.id === fJob.id);
                    if (existing !== -1) {
                        window.mockJobs[existing] = normalized;
                    } else {
                        window.mockJobs.unshift(normalized);
                    }
                });

                mockJobs = window.mockJobs;
                
                if (role === 'employer') {
                    window.localEmployerJobs = allJobs.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
                    localStorage.setItem('melogo_employer_jobs', JSON.stringify(window.localEmployerJobs));
                }
                
                // Debounced UI Refresh
                if (!window._jobRefreshTimer) {
                    window._jobRefreshTimer = setTimeout(() => {
                        window._jobRefreshTimer = null;
                        if (typeof window.renderEmployerHome === 'function') window.renderEmployerHome();
                        if (typeof window.refreshJobList === 'function') window.refreshJobList(true);
                        if (typeof window.renderMapPins === 'function') window.renderMapPins();
                    }, 500);
                }
            });

            // 2. Applications listener:
            let appsQuery = query(
                collection(db, "applications"),
                where(role === 'worker' ? "workerEmail" : "employerEmail", "==", email)
            );

            window.appsUnsubscribe = onSnapshot(appsQuery, (snapshot) => {
                let apps = [];
                snapshot.forEach(d => {
                    apps.push(d.data());
                });
                localWorkerApplications = apps.sort((a,b) => b.createdAt - a.createdAt);
                localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications));
                
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                if (typeof renderWorkerApplications === 'function') renderWorkerApplications();
            });

            // 3. Chats listener:
            let chatsQuery = query(
                collection(db, "chats"),
                where(role === 'worker' ? "workerEmail" : "employerEmail", "==", email)
            );

            window.chatsUnsubscribe = onSnapshot(chatsQuery, (snapshot) => {
                let chats = [];
                snapshot.forEach(d => {
                    const chat = d.data();
                    chats.push(chat);
                });
                let existingMockChats = localChats.filter(c => !c.isFirestore);
                chats.forEach(c => c.isFirestore = true);
                localChats = [...chats, ...existingMockChats];
                localChats.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
                
                localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                if (typeof renderChatList === 'function') renderChatList();
                
                if (window.selectedChatId) {
                    const activeChat = localChats.find(c => c.id === window.selectedChatId);
                    if (activeChat && typeof openChat === 'function') {
                        const activeRole = localStorage.getItem('melogo_active_role') || 'worker';
                        const partnerName = (activeRole === 'worker') ? (activeChat.employerName || 'Megbízó') : (activeChat.workerName || activeChat.name || 'Diák');
                        openChat(partnerName, activeChat.jobTitle, activeChat.lastMsg, activeChat.time, false, activeChat.id);
                    }
                }
            });
        };`,
    `        window.setupFirestoreListeners = function(role) {
            if (!auth.currentUser) {
                console.log('[DEBUG] setupFirestoreListeners skipped: user not logged in.');
                return;
            }
            const user = auth.currentUser;
            const email = user.email || '';
            const uid = user.uid || '';

            // Clean up existing listeners
            if (window.jobsUnsubscribe) { window.jobsUnsubscribe(); window.jobsUnsubscribe = null; }
            if (window.appsUnsubscribe) { window.appsUnsubscribe(); window.appsUnsubscribe = null; }
            if (window.chatsUnsubscribe) { window.chatsUnsubscribe(); window.chatsUnsubscribe = null; }
            if (window.chatsUnsubscribe2) { window.chatsUnsubscribe2(); window.chatsUnsubscribe2 = null; }

            console.log('[DEBUG] Setting up role-based Firestore listeners for:', role, 'UID:', uid);

            // 1. Jobs listener – uses docChanges() for correct delete handling
            let jobsQuery;
            if (role === 'worker') {
                jobsQuery = query(collection(db, "jobs"), where("status", "==", "Keresés"));
            } else {
                jobsQuery = query(collection(db, "jobs"), where("ownerEmail", "==", email));
            }

            function haversineLocal(lat1, lon1, lat2, lon2) {
                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
                return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
            }

            function normalizeFirestoreJob(fJob) {
                const userCoords = window.userCoords || { lat: 46.3593, lon: 17.7967 };
                let dist = (fJob.lat && fJob.lon) ? haversineLocal(userCoords.lat, userCoords.lon, fJob.lat, fJob.lon) : Math.round(Math.random() * 4 * 10) / 10;
                return {
                    id: fJob.id,
                    title: fJob.title,
                    employer: fJob.ownerName || (fJob.ownerEmail ? fJob.ownerEmail.split('@')[0] : 'Megbízó'),
                    ownerEmail: fJob.ownerEmail || '',
                    ownerUid: fJob.ownerUid || '',
                    price: parseInt(fJob.price) || 10000,
                    distance: dist,
                    lat: fJob.lat || 46.36,
                    lon: fJob.lon || 17.79,
                    category: fJob.category || 'Kert',
                    location: fJob.location || 'Kaposvár',
                    time: fJob.datetime ? fJob.datetime.slice(0, 10) : new Date().toISOString().slice(0, 10),
                    urgent: fJob.urgent || false,
                    timeOffset: fJob.createdAt ? -(Number(fJob.createdAt)) : -Date.now(),
                    desc: fJob.details || fJob.desc || '',
                    toolsRequired: fJob.toolsRequired || 'employer',
                    status: fJob.status || 'Keresés',
                    isFirestore: true
                };
            }

            if (!window.mockJobs) window.mockJobs = [];

            window.jobsUnsubscribe = onSnapshot(jobsQuery, (snapshot) => {
                snapshot.docChanges().forEach(change => {
                    const fJob = { ...change.doc.data(), id: change.doc.id };
                    if (change.type === 'added' || change.type === 'modified') {
                        if (!fJob.title) return;
                        const normalized = normalizeFirestoreJob(fJob);
                        const existing = window.mockJobs.findIndex(m => m.id === fJob.id);
                        if (existing !== -1) {
                            window.mockJobs[existing] = normalized;
                        } else {
                            window.mockJobs.unshift(normalized);
                        }
                    } else if (change.type === 'removed') {
                        window.mockJobs = window.mockJobs.filter(m => m.id !== fJob.id);
                        console.log('[Firestore] Job removed from list:', fJob.id);
                    }
                });
                mockJobs = window.mockJobs;

                if (role === 'employer') {
                    // For employer, rebuild from scratch from snapshot
                    let allJobs = [];
                    snapshot.forEach(d => { const j = d.data(); j.id = d.id; allJobs.push(j); });
                    window.localEmployerJobs = allJobs.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
                    localStorage.setItem('melogo_employer_jobs', JSON.stringify(window.localEmployerJobs));
                }

                if (!window._jobRefreshTimer) {
                    window._jobRefreshTimer = setTimeout(() => {
                        window._jobRefreshTimer = null;
                        if (typeof window.renderEmployerHome === 'function') window.renderEmployerHome();
                        if (typeof window.refreshJobList === 'function') window.refreshJobList(true);
                        if (typeof window.renderMapPins === 'function') window.renderMapPins();
                    }, 300);
                }
            }, err => console.error('[Firestore] Jobs listener error:', err));

            // 2. Applications listener
            let appsQuery = query(
                collection(db, "applications"),
                where(role === 'worker' ? "workerEmail" : "employerEmail", "==", email)
            );
            window.appsUnsubscribe = onSnapshot(appsQuery, (snapshot) => {
                let apps = [];
                snapshot.forEach(d => { const a = d.data(); a.id = d.id; apps.push(a); });
                localWorkerApplications = apps.sort((a,b) => b.createdAt - a.createdAt);
                localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications));
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                if (typeof renderWorkerApplications === 'function') renderWorkerApplications();
            }, err => console.error('[Firestore] Apps listener error:', err));

            // 3. Chats listeners – UID-based dual query (worker OR employer)
            //    Firestore does not support OR across different fields, so we use TWO listeners
            function mergeFirestoreChats(newChats) {
                newChats.forEach(c => c.isFirestore = true);
                // Remove stale Firestore chats that are not in the new set
                const newIds = new Set(newChats.map(c => c.id));
                localChats = localChats.filter(c => !c.isFirestore || newIds.has(c.id));
                // Upsert
                newChats.forEach(nc => {
                    const idx = localChats.findIndex(c => c.id === nc.id);
                    if (idx !== -1) localChats[idx] = nc; else localChats.unshift(nc);
                });
                localChats.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
                localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                if (typeof renderChatList === 'function') renderChatList();
                // Re-sync active chat if open
                if (window.selectedChatId) {
                    const activeChat = localChats.find(c => c.id === window.selectedChatId);
                    if (activeChat && typeof renderActiveChatMessages === 'function') renderActiveChatMessages(activeChat.id);
                }
            }

            // Worker-side chats (where current user is the worker)
            const chatsAsWorkerQuery = query(collection(db, "chats"), where("workerId", "==", uid));
            window.chatsUnsubscribe = onSnapshot(chatsAsWorkerQuery, (snapshot) => {
                let chats = [];
                snapshot.forEach(d => { const c = d.data(); c.id = d.id; chats.push(c); });
                mergeFirestoreChats(chats);
            }, err => console.error('[Firestore] Chats(worker) listener error:', err));

            // Employer-side chats (where current user is the employer)
            const chatsAsEmployerQuery = query(collection(db, "chats"), where("employerId", "==", uid));
            window.chatsUnsubscribe2 = onSnapshot(chatsAsEmployerQuery, (snapshot) => {
                let chats = [];
                snapshot.forEach(d => { const c = d.data(); c.id = d.id; chats.push(c); });
                mergeFirestoreChats(chats);
            }, err => console.error('[Firestore] Chats(employer) listener error:', err));
        };`,
    'Fix 1: setupFirestoreListeners – docChanges, UID chats, dual listener'
);

// =============================================================================
// FIX 2: Job post – add ownerName to Firestore document
// =============================================================================
replace(
    `                        const newDocRef = await window.firebaseAPI.addDoc(window.firebaseAPI.collection(window.firebaseDb, "jobs"), {
                            title: specificJob,
                            details: details,
                            desc: details,
                            location: \`\${county}, \${city}, \${street} \${house}.\`,
                            price: price,
                            category: activeCat,
                            status: 'Keresés',
                            urgent: document.getElementById('emp-urgent-job')?.checked || false,
                            datetime: document.getElementById('emp-datetime')?.value || 'Holnap, 14:00',
                            ownerEmail: window.firebaseAuth.currentUser.email,
                            ownerUid: window.firebaseAuth.currentUser.uid,
                            createdAt: window.firebaseAPI.serverTimestamp()
                        });`,
    `                        const _posterSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
                        const _posterName = _posterSession.name || window.firebaseAuth.currentUser.displayName || window.firebaseAuth.currentUser.email.split('@')[0];
                        const newDocRef = await window.firebaseAPI.addDoc(window.firebaseAPI.collection(window.firebaseDb, "jobs"), {
                            title: specificJob,
                            details: details,
                            desc: details,
                            location: \`\${county}, \${city}, \${street} \${house}.\`,
                            price: price,
                            category: activeCat,
                            status: 'Keresés',
                            urgent: document.getElementById('emp-urgent-job')?.checked || false,
                            datetime: document.getElementById('emp-datetime')?.value || 'Holnap, 14:00',
                            ownerEmail: window.firebaseAuth.currentUser.email,
                            ownerUid: window.firebaseAuth.currentUser.uid,
                            ownerName: _posterName,
                            createdAt: window.firebaseAPI.serverTimestamp()
                        });`,
    'Fix 2: Job post – add ownerName field'
);

// =============================================================================
// FIX 3: workerApplyToJob – create real Firestore chat with workerId/employerId UIDs
// =============================================================================
replace(
    `        // C. DIÁK JELENTKEZIK A MUNKÁRA
        function workerApplyToJob() {
            gameState.status = 'Keresés';
            gameState.applied = true; 
            
            const badge = document.getElementById('app-msg-badge');
            if (badge) { badge.innerText = '1'; badge.style.display = 'flex'; }

            const matchedJob = mockJobs.find(j => j.title === gameState.jobTitle);
            const employerEmail = (matchedJob && matchedJob.ownerEmail) ? matchedJob.ownerEmail : 'employer@melogo.hu';
            const workerEmail = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'worker@melogo.hu';
            const currentUid = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : 'NO_UID';

            // Prevent applying to own job if ownerUid matches strictly
            if (matchedJob && matchedJob.ownerUid && currentUid !== 'NO_UID' && matchedJob.ownerUid === currentUid) {
                alert("Saját munkádra nem jelentkezhetsz!");
                gameState.applied = false;
                gameState.status = '';
                const btn = document.querySelector('.emp-submit-btn');
                if (btn) btn.disabled = false;
                return;
            }

            // REDESIGN: insert applying user to localChats
            const newChat = {
                id: 'chat_' + Date.now(),
                name: currentUser ? currentUser.name : "Diák",
                workerName: currentUser ? currentUser.name : "Diák",
                employerName: (matchedJob ? matchedJob.employer || matchedJob.ownerName : 'Megbízó'),
                jobTitle: gameState.jobTitle || 'Fűnyírás',
                lastMsg: 'Szia! Jelentkeztem a munkádra, szívesen elvállalom. Mikor és hogyan egyezünk meg a részletekről?',
                time: 'Most',
                isUnread: true,
                unreadCount: 1,
                isOnline: true,
                role: 'worker',
                active: true,
                archived: false,
                workerEmail: workerEmail,
                employerEmail: employerEmail,
                messages: [
                    { from: 'me', text: 'Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?', time: '14:00' }
                ]
            };
            
            // Unshift and save
            localChats.unshift(newChat);
            saveLocalChats();
            renderChatList();`,
    `        // C. DIÁK JELENTKEZIK A MUNKÁRA
        async function workerApplyToJob() {
            gameState.status = 'Keresés';
            gameState.applied = true; 
            
            const badge = document.getElementById('app-msg-badge');
            if (badge) { badge.innerText = '1'; badge.style.display = 'flex'; }

            const matchedJob = mockJobs.find(j => j.title === gameState.jobTitle);
            const employerEmail = (matchedJob && matchedJob.ownerEmail) ? matchedJob.ownerEmail : 'employer@melogo.hu';
            const employerId = (matchedJob && matchedJob.ownerUid) ? matchedJob.ownerUid : '';
            const workerEmail = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'worker@melogo.hu';
            const workerId = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : 'NO_UID';

            // Prevent applying to own job if ownerUid matches strictly
            if (matchedJob && matchedJob.ownerUid && workerId !== 'NO_UID' && matchedJob.ownerUid === workerId) {
                alert("Saját munkádra nem jelentkezhetsz!");
                gameState.applied = false;
                gameState.status = '';
                const btn = document.querySelector('.emp-submit-btn');
                if (btn) btn.disabled = false;
                return;
            }

            const _workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
            const workerName = _workerSession.name || (currentUser ? currentUser.name : 'Diák');
            const employerName = (matchedJob ? matchedJob.employer || matchedJob.ownerName : 'Megbízó');
            const jobTitle = gameState.jobTitle || 'Fűnyírás';
            const jobId = (matchedJob && matchedJob.id) ? matchedJob.id : '';

            // Create Firestore chat document with correct UID fields
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
                messages: []
            };

            // Save to Firestore if connected, otherwise just local
            if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                try {
                    const chatRef = await window.firebaseAPI.addDoc(
                        window.firebaseAPI.collection(window.firebaseDb, "chats"),
                        { ...chatData, createdAt: window.firebaseAPI.serverTimestamp() }
                    );
                    chatDocId = chatRef.id;
                    chatData.id = chatDocId;
                    chatData.isFirestore = true;
                    console.log('[Apply] Chat created in Firestore:', chatDocId);

                    // Save system message to subcollection
                    await window.firebaseAPI.addDoc(
                        window.firebaseAPI.collection(window.firebaseDb, "chats", chatDocId, "messages"),
                        {
                            senderId: 'system',
                            text: 'A munkás jelentkezett a munkára',
                            timestamp: window.firebaseAPI.serverTimestamp(),
                            type: 'system'
                        }
                    );
                } catch(e) {
                    console.error('[Apply] Firestore chat creation failed:', e);
                }
            }

            // Unshift and save locally
            localChats.unshift(chatData);
            saveLocalChats();
            renderChatList();`,
    'Fix 3: workerApplyToJob – real Firestore chat with UIDs and subcollection system message'
);

// =============================================================================
// FIX 4: sendChatMessageNew – use Firestore subcollection addDoc, fix double-save
// =============================================================================
replace(
    `            // Persist sent message inside localChats and trigger save/sync!
            if (selectedChatId) {
                const chat = localChats.find(c => c.id === selectedChatId);
                if (chat) {
                    if (!chat.messages) chat.messages = [];
                    const senderRole = currentRole || localStorage.getItem('melogo_active_role') || 'worker';
                    chat.messages.push({ from: senderRole, text: text, time: t });
                    chat.lastMsg = text;
                    chat.time = 'Most';
                    
                    // Update Firestore directly if it is a Firestore chat
                    if (chat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                        try {
                            const chatRef = window.firebaseAPI.doc(window.firebaseDb, "chats", chat.id);
                            window.firebaseAPI.updateDoc(chatRef, {
                                messages: chat.messages,
                                lastMsg: chat.lastMsg,
                                time: chat.time
                            });
                            saveLocalChats();
                            renderChatList();
                        } catch(e) {
                            console.error("Firestore chat update error:", e);
                        }
                    } else {
                        saveLocalChats();
                        renderChatList();
                    }
                    
                    saveLocalChats();
                    renderChatList();
                }
            }
        }`,
    `            // Persist sent message inside localChats and trigger save/sync!
            if (selectedChatId) {
                const chat = localChats.find(c => c.id === selectedChatId);
                if (chat) {
                    if (!chat.messages) chat.messages = [];
                    const senderRole = currentRole || localStorage.getItem('melogo_active_role') || 'worker';
                    const senderId = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : senderRole;
                    chat.messages.push({ from: senderRole, senderId: senderId, text: text, time: t });
                    chat.lastMsg = text;
                    chat.time = 'Most';

                    if (chat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                        // Write to subcollection for real-time sync
                        window.firebaseAPI.addDoc(
                            window.firebaseAPI.collection(window.firebaseDb, "chats", chat.id, "messages"),
                            { senderId: senderId, text: text, timestamp: window.firebaseAPI.serverTimestamp(), type: 'user' }
                        ).catch(e => console.error("Firestore message add error:", e));
                        // Update lastMsg on parent doc
                        window.firebaseAPI.updateDoc(
                            window.firebaseAPI.doc(window.firebaseDb, "chats", chat.id),
                            { lastMsg: text, time: 'Most' }
                        ).catch(e => console.error("Firestore chat lastMsg update error:", e));
                    }
                    saveLocalChats();
                    renderChatList();
                }
            }
        }`,
    'Fix 4: sendChatMessageNew – subcollection addDoc, remove double save'
);

// =============================================================================
// FIX 5: openChat – attach Firestore messages subcollection onSnapshot listener
// =============================================================================
replace(
    `        function openChat(name, jobTitle, lastMsg, time, isUnread, chatId) {
            selectedChatId = chatId;
            window.selectedChatId = chatId;
            document.getElementById('chat-detail-name').innerText = name || 'Ismeretlen';
            document.getElementById('chat-detail-job').innerText = jobTitle || '';`,
    `        // Active chat messages listener (Firestore subcollection)
        window._chatMsgsUnsubscribe = null;
        function renderActiveChatMessages(chatId) {
            if (!chatId || !window.firebaseAPI || !window.firebaseDb) return;
            // Unsubscribe from previous listener
            if (window._chatMsgsUnsubscribe) { window._chatMsgsUnsubscribe(); window._chatMsgsUnsubscribe = null; }
            const msgsQuery = window.firebaseAPI.query(
                window.firebaseAPI.collection(window.firebaseDb, 'chats', chatId, 'messages'),
                window.firebaseAPI.orderBy('timestamp', 'asc')
            );
            window._chatMsgsUnsubscribe = window.firebaseAPI.onSnapshot(msgsQuery, (snapshot) => {
                const msgContainer = document.getElementById('chat-detail-messages');
                if (!msgContainer) return;
                // Only re-render if this is still the selected chat
                if (window.selectedChatId !== chatId) return;
                msgContainer.innerHTML = '';
                const curUid = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : null;
                snapshot.forEach(d => {
                    const msg = d.data();
                    if (msg.type === 'system') {
                        const pill = document.createElement('div');
                        pill.style.cssText = 'background:#f3f4f6;color:#6b7280;padding:6px 14px;border-radius:99px;font-size:11px;font-weight:600;text-align:center;margin:8px auto;max-width:80%;display:block;';
                        pill.innerText = msg.text;
                        msgContainer.appendChild(pill);
                    } else {
                        const isMine = curUid ? (msg.senderId === curUid) : false;
                        const bubble = document.createElement('div');
                        const now = msg.timestamp ? new Date(msg.timestamp.toDate ? msg.timestamp.toDate() : msg.timestamp) : new Date();
                        const t = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
                        bubble.style.cssText = isMine
                            ? 'max-width:80%;padding:10px 14px;border-radius:18px 18px 4px 18px;background:#000;color:#fff;font-size:14px;align-self:flex-end;'
                            : 'max-width:80%;padding:10px 14px;border-radius:18px 18px 18px 4px;background:#f3f4f6;color:#000;font-size:14px;align-self:flex-start;';
                        bubble.innerHTML = msg.text + \`<div style="font-size:10px;opacity:0.5;margin-top:4px;text-align:\${isMine?'right':'left'}">\${t}</div>\`;
                        msgContainer.appendChild(bubble);
                    }
                });
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, err => console.error('[Firestore] Messages listener error:', err));
        }

        function openChat(name, jobTitle, lastMsg, time, isUnread, chatId) {
            selectedChatId = chatId;
            window.selectedChatId = chatId;
            document.getElementById('chat-detail-name').innerText = name || 'Ismeretlen';
            document.getElementById('chat-detail-job').innerText = jobTitle || '';`,
    'Fix 5: openChat – inject renderActiveChatMessages with Firestore subcollection onSnapshot'
);

// =============================================================================
// FIX 6: openChat – call renderActiveChatMessages after loading local msgs
// We need to find a reliable anchor after the chat-detail-messages is filled
// =============================================================================
replace(
    `            updateChatActionBar(jobTitle);
        }`,
    `            updateChatActionBar(jobTitle);
            // Start real-time messages listener for Firestore chats
            const _openedChat = localChats.find(c => c.id === chatId);
            if (_openedChat && _openedChat.isFirestore) {
                renderActiveChatMessages(chatId);
            }
        }`,
    'Fix 6: openChat – trigger Firestore messages listener'
);

// =============================================================================
// FIX 7: employerAcceptWorker – update job status in Firestore to "accepted"
// =============================================================================
replace(
    `        function employerAcceptWorker(jobTitle, event) {
            if (event && event.currentTarget) {
                const btn = event.currentTarget;
                if (btn.disabled) return;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-small" style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite; margin-right: 4px;"></span>...';
            }
            // 1. Update application status
            const appIndex = localWorkerApplications.findIndex(a => a.title === jobTitle);
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Aktív';
                saveWorkerApplications();
            }

            // 2. Update job status
            const jobIndex = localEmployerJobs.findIndex(j => j.title === jobTitle);
            if (jobIndex !== -1) {
                localEmployerJobs[jobIndex].status = 'Aktív';
                saveEmployerJobs();
            }

            gameState.applied = true;
            gameState.status = 'Fizetve';

            // 3. Append system message in the chat
            const msgContainer = document.getElementById('chat-detail-messages');
            if (msgContainer) {
                const bubble = document.createElement('div');
                bubble.style.cssText = 'background: #FFFFFF; border: 1px solid #D1D5DB; color: #000000; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
                bubble.innerText = 'A munkáltató elfogadta a jelentkezést! A munka aktívvá vált.';
                msgContainer.appendChild(bubble);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }

            showGreenBanner('Jelentkezés elfogadva! A diák értesítést kapott.');
            
            // 4. Update UI
            updateChatActionBar(jobTitle);
            renderWorkerApplications();
            renderEmployerHome();
            updateAllUserUI();
        }`,
    `        async function employerAcceptWorker(jobTitle, event) {
            if (event && event.currentTarget) {
                const btn = event.currentTarget;
                if (btn.disabled) return;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-small" style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite; margin-right: 4px;"></span>...';
            }
            // 1. Update application status
            const appIndex = localWorkerApplications.findIndex(a => a.title === jobTitle);
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Aktív';
                saveWorkerApplications();
            }

            // 2. Update job status locally and in Firestore
            const jobIndex = localEmployerJobs.findIndex(j => j.title === jobTitle);
            if (jobIndex !== -1) {
                localEmployerJobs[jobIndex].status = 'accepted';
                saveEmployerJobs();
            }
            // Also update the Firestore job document so workers' screens update instantly
            const acceptedMockJob = window.mockJobs ? window.mockJobs.find(j => j.title === jobTitle && j.isFirestore) : null;
            if (acceptedMockJob && acceptedMockJob.id && window.firebaseAPI && window.firebaseDb) {
                window.firebaseAPI.updateDoc(
                    window.firebaseAPI.doc(window.firebaseDb, "jobs", acceptedMockJob.id),
                    { status: 'accepted' }
                ).then(() => console.log('[Accept] Job status updated to accepted in Firestore'))
                .catch(e => console.error('[Accept] Firestore job status update failed:', e));
            }

            gameState.applied = true;
            gameState.status = 'Fizetve';

            // 3. Save system message to Firestore messages subcollection
            const _acceptChat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (_acceptChat && _acceptChat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                window.firebaseAPI.addDoc(
                    window.firebaseAPI.collection(window.firebaseDb, "chats", _acceptChat.id, "messages"),
                    { senderId: 'system', text: 'A megbízó elfogadta a munkást', timestamp: window.firebaseAPI.serverTimestamp(), type: 'system' }
                ).catch(e => console.error('[Accept] System message write failed:', e));
                window.firebaseAPI.updateDoc(
                    window.firebaseAPI.doc(window.firebaseDb, "chats", _acceptChat.id),
                    { status: 'active', lastMsg: 'A megbízó elfogadta a munkást' }
                ).catch(e => console.error('[Accept] Chat status update failed:', e));
            } else {
                // Local fallback
                const msgContainer = document.getElementById('chat-detail-messages');
                if (msgContainer) {
                    const bubble = document.createElement('div');
                    bubble.style.cssText = 'background:#f3f4f6;color:#6b7280;padding:6px 14px;border-radius:99px;font-size:11px;font-weight:600;text-align:center;margin:8px auto;max-width:80%;display:block;';
                    bubble.innerText = 'A megbízó elfogadta a munkást';
                    msgContainer.appendChild(bubble);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }
            }

            showGreenBanner('Jelentkezés elfogadva! A diák értesítést kapott.');
            updateChatActionBar(jobTitle);
            renderWorkerApplications();
            renderEmployerHome();
            updateAllUserUI();
        }`,
    'Fix 7: employerAcceptWorker – Firestore job status "accepted", system msg to subcollection'
);

// =============================================================================
// FIX 8: workerFinishJob – update Firestore job status
// =============================================================================
replace(
    `        function workerFinishJob(jobTitle) {
            // 1. Update application status
            const appIndex = localWorkerApplications.findIndex(a => a.title === jobTitle);
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Értékelésre vár';
                saveWorkerApplications();
            }

            // 2. Update job status
            const jobIndex = localEmployerJobs.findIndex(j => j.title === jobTitle);
            if (jobIndex !== -1) {
                localEmployerJobs[jobIndex].status = 'Befejezett';
                saveEmployerJobs();
            }

            gameState.status = 'Befejezve';

            // 3. Append system message in the chat
            const msgContainer = document.getElementById('chat-detail-messages');
            if (msgContainer) {
                const bubble = document.createElement('div');
                bubble.style.cssText = 'background: #FFFFFF; border: 1px solid #D1D5DB; color: #000000; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
                bubble.innerText = '\${currentUser ? currentUser.name : "Diák"} befejezte a munkát. Várakozás a jóváhagyásra és értékelésre.';
                msgContainer.appendChild(bubble);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }

            showGreenBanner('Jelentés elküldve! A munkáltató értesítést kapott.');

            // 4. Update UI
            updateChatActionBar(jobTitle);
            renderWorkerApplications();
            renderEmployerHome();
            updateAllUserUI();
        }`,
    `        function workerFinishJob(jobTitle) {
            // 1. Update application status
            const appIndex = localWorkerApplications.findIndex(a => a.title === jobTitle);
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Értékelésre vár';
                saveWorkerApplications();
            }

            // 2. Update job status locally + Firestore
            const jobIndex = localEmployerJobs.findIndex(j => j.title === jobTitle);
            if (jobIndex !== -1) {
                localEmployerJobs[jobIndex].status = 'pending_confirmation';
                saveEmployerJobs();
            }
            const finishedMockJob = window.mockJobs ? window.mockJobs.find(j => j.title === jobTitle && j.isFirestore) : null;
            if (finishedMockJob && finishedMockJob.id && window.firebaseAPI && window.firebaseDb) {
                window.firebaseAPI.updateDoc(
                    window.firebaseAPI.doc(window.firebaseDb, "jobs", finishedMockJob.id),
                    { status: 'pending_confirmation' }
                ).catch(e => console.error('[Finish] Firestore job status update failed:', e));
            }

            gameState.status = 'Befejezve';

            // 3. System message to subcollection
            const _finishChat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            const _wName = currentUser ? currentUser.name : 'A munkás';
            if (_finishChat && _finishChat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                window.firebaseAPI.addDoc(
                    window.firebaseAPI.collection(window.firebaseDb, "chats", _finishChat.id, "messages"),
                    { senderId: 'system', text: 'A munkás késznek jelölte a munkát', timestamp: window.firebaseAPI.serverTimestamp(), type: 'system' }
                ).catch(e => console.error('[Finish] System message write failed:', e));
                window.firebaseAPI.updateDoc(
                    window.firebaseAPI.doc(window.firebaseDb, "chats", _finishChat.id),
                    { status: 'pending_confirmation', lastMsg: 'A munkás késznek jelölte a munkát' }
                ).catch(e => console.error('[Finish] Chat status update failed:', e));
            } else {
                const msgContainer = document.getElementById('chat-detail-messages');
                if (msgContainer) {
                    const bubble = document.createElement('div');
                    bubble.style.cssText = 'background:#f3f4f6;color:#6b7280;padding:6px 14px;border-radius:99px;font-size:11px;font-weight:600;text-align:center;margin:8px auto;max-width:80%;display:block;';
                    bubble.innerText = 'A munkás késznek jelölte a munkát';
                    msgContainer.appendChild(bubble);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }
            }

            showGreenBanner('Jelentés elküldve! A munkáltató értesítést kapott.');
            updateChatActionBar(jobTitle);
            renderWorkerApplications();
            renderEmployerHome();
            updateAllUserUI();
        }`,
    'Fix 8: workerFinishJob – Firestore status "pending_confirmation" + system msg subcollection'
);

// =============================================================================
// FIX 9: employerRateWorkerFromChat – update Firestore job status to "completed"
// =============================================================================
replace(
    `        function employerRateWorkerFromChat(jobTitle, stars) {
            // 1. Update application status & rating
            const appIndex = localWorkerApplications.findIndex(a => a.title === jobTitle);
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Befejezett';
                localWorkerApplications[appIndex].rating = stars;
                saveWorkerApplications();
            }

            // 2. Update job status
            const jobIndex = localEmployerJobs.findIndex(j => j.title === jobTitle);
            if (jobIndex !== -1) {
                localEmployerJobs[jobIndex].status = 'Befejezett';
                saveEmployerJobs();
            }

            gameState.status = 'Kifizetve';`,
    `        function employerRateWorkerFromChat(jobTitle, stars) {
            // 1. Update application status & rating
            const appIndex = localWorkerApplications.findIndex(a => a.title === jobTitle);
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Befejezett';
                localWorkerApplications[appIndex].rating = stars;
                saveWorkerApplications();
            }

            // 2. Update job status locally + Firestore
            const jobIndex = localEmployerJobs.findIndex(j => j.title === jobTitle);
            if (jobIndex !== -1) {
                localEmployerJobs[jobIndex].status = 'completed';
                saveEmployerJobs();
            }
            const completedMockJob = window.mockJobs ? window.mockJobs.find(j => j.title === jobTitle && j.isFirestore) : null;
            if (completedMockJob && completedMockJob.id && window.firebaseAPI && window.firebaseDb) {
                window.firebaseAPI.updateDoc(
                    window.firebaseAPI.doc(window.firebaseDb, "jobs", completedMockJob.id),
                    { status: 'completed' }
                ).catch(e => console.error('[Complete] Firestore job status update failed:', e));
            }

            // Write system message to subcollection
            const _completeChat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (_completeChat && _completeChat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                window.firebaseAPI.addDoc(
                    window.firebaseAPI.collection(window.firebaseDb, "chats", _completeChat.id, "messages"),
                    { senderId: 'system', text: 'A munka sikeresen befejezve', timestamp: window.firebaseAPI.serverTimestamp(), type: 'system' }
                ).catch(e => console.error('[Complete] System message write failed:', e));
                window.firebaseAPI.updateDoc(
                    window.firebaseAPI.doc(window.firebaseDb, "chats", _completeChat.id),
                    { status: 'completed', lastMsg: 'A munka sikeresen befejezve' }
                ).catch(e => console.error('[Complete] Chat status update failed:', e));
            }

            gameState.status = 'Kifizetve';`,
    'Fix 9: employerRateWorkerFromChat – Firestore "completed" + system msg subcollection'
);

// =============================================================================
// FIX 10: Expose Firestore query/orderBy/onSnapshot on firebaseAPI for renderActiveChatMessages
// =============================================================================
replace(
    `        window.firebaseAPI = {
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signOut,
            onAuthStateChanged,
            GoogleAuthProvider,
            signInWithPopup,
            collection,
            addDoc,
            setDoc,
            updateDoc,
            deleteDoc,
            getDocs,
            getDoc,
            doc,
            query,
            where,
            orderBy,
            onSnapshot,
            serverTimestamp,
            getStorage,
            ref,
            uploadString,
            getDownloadURL
        };`,
    `        window.firebaseAPI = {
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signOut,
            onAuthStateChanged,
            GoogleAuthProvider,
            signInWithPopup,
            collection,
            addDoc,
            setDoc,
            updateDoc,
            deleteDoc,
            getDocs,
            getDoc,
            doc,
            query,
            where,
            orderBy,
            onSnapshot,
            serverTimestamp,
            getStorage,
            ref,
            uploadString,
            getDownloadURL
        };
        // Also expose query/orderBy/onSnapshot globally for non-module scripts
        window._fsQuery = query;
        window._fsOrderBy = orderBy;
        window._fsOnSnapshot = onSnapshot;`,
    'Fix 10: Expose query/orderBy/onSnapshot to global scope for non-module use'
);

// Write and report
fs.writeFileSync(filePath, html);
console.log('\n=== PHASE 6 FIX RESULTS ===');
fixes.forEach(f => console.log(f));
const misses = fixes.filter(f => f.startsWith('[MISS]'));
console.log(`\nTotal: ${fixes.length} fixes | OK: ${fixes.length - misses.length} | MISS: ${misses.length}`);
