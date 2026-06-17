
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, OAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, collection, addDoc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, doc, query, where, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDNysWD3J01zAyuFMCYq0BJAavhy206eMs",
            authDomain: "melogo-app.firebaseapp.com",
            projectId: "melogo-app",
            storageBucket: "melogo-app.firebasestorage.app",
            messagingSenderId: "54031234",
            appId: "1:54031234:web:0a4c799b7a585291a9559b"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Expose to global window object so the existing script can use them
        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        
        window.firebaseAPI = {
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signOut,
            onAuthStateChanged,
            GoogleAuthProvider,
            OAuthProvider,
            signInWithPopup,
            sendPasswordResetEmail,
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
        window._fsOnSnapshot = onSnapshot;
        
        console.log("Firebase initialized successfully");
        
        // Handle redirect login
        // Listen for authentication state changes
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Firebase User is logged in:", user.email);
                let role = localStorage.getItem('melogo_pending_role') || 'worker';
                let userName = user.displayName || user.email.split('@')[0] || 'Felhasználó';
                
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);
                    if (!userDoc.exists()) {
                        // Create the document for new users
                        const newUserData = {
                            name: userName,
                            email: user.email,
                            defaultRole: role,
                            role: role,
                            photoURL: user.photoURL || '',
                            createdAt: serverTimestamp(),
                            bio: '',
                            skills: [],
                            location: ''
                        };
                        await setDoc(userRef, newUserData);
                        localStorage.setItem('melogo_user_data', JSON.stringify({ bio: '', skills: [], photoURL: user.photoURL || '', reviews: [] }));
                    } else {
                        // Update existing user
                        await updateDoc(userRef, { lastLogin: serverTimestamp(), photoURL: user.photoURL || userDoc.data().photoURL || '' });
                        const data = userDoc.data();
                        if (data.name) userName = data.name;
                        role = data.defaultRole || data.role || 'worker';
                        
                        const userData = { bio: data.bio || '', skills: data.skills || [], photoURL: data.photoURL || '', reviews: data.reviews || [], address: data.address || '' };
                        localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                    }
                    localStorage.removeItem('melogo_pending_role');

                    localStorage.setItem('melogo_name', userName);
                    localStorage.setItem('melogo_active_role', role);

                    // Sync sessions
                    const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
                    workerSession.name = userName;
                    workerSession.email = user.email;
                    localStorage.setItem('melogo_worker_session', JSON.stringify(workerSession));
                    
                    const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
                    employerSession.name = userName;
                    employerSession.email = user.email;
                    localStorage.setItem('melogo_employer_session', JSON.stringify(employerSession));

                } catch(e) { console.error("Error fetching/creating user doc", e); }
                
                localStorage.setItem('melogo_app_session', 'true');
                var screen = document.getElementById('app-login-screen');
                if (screen && !screen.classList.contains('hidden')) {
                    screen.style.transition = 'opacity 0.35s ease';
                    screen.style.opacity = '0';
                    setTimeout(() => {
                        screen.classList.add('hidden');
                        screen.style.opacity = '';
                    }, 350);
                }
                
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                if (typeof switchRole === 'function') switchRole(role);
            }
        });
        window.setupFirestoreListeners = function(role) {
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

            // Clear jobs cache to prevent state leakage between roles
            window.mockJobs = [];
            if (typeof window.updateMockJobsReference === 'function') {
                window.updateMockJobsReference(window.mockJobs);
            }

            // 1. Jobs listener – uses docChanges() for correct delete handling
            let jobsQuery;
            if (role === 'worker') {
                jobsQuery = query(collection(db, "jobs"), where("status", "in", ["Keresés", "accepted"]), limit(100));
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
                const userCoords = window.userCoords || { lat: 47.4979, lon: 19.0402 };
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

            if (!window.mockJobs) {
                window.mockJobs = [];
                if (typeof window.updateMockJobsReference === 'function') {
                    window.updateMockJobsReference(window.mockJobs);
                }
            }

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
                        if (typeof window.updateMockJobsReference === 'function') {
                            window.updateMockJobsReference(window.mockJobs);
                        }
                        console.log('[Firestore] Job removed from list:', fJob.id);
                    }
                });
                if (typeof window.updateMockJobsReference === 'function') {
                    window.updateMockJobsReference(window.mockJobs);
                }

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
                where(role === 'worker' ? "workerUid" : "employerUid", "==", uid)
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
            function mergeFirestoreChats(newChats, roleType) {
                newChats.forEach(c => { 
                    c.isFirestore = true; 
                    c.roleType = roleType; 
                    
                    if (c.updatedAt) {
                        const updatedTime = typeof c.updatedAt.toMillis === 'function' ? c.updatedAt.toMillis() : (c.updatedAt.seconds ? c.updatedAt.seconds * 1000 : c.updatedAt);
                        const roleField = roleType === 'worker' ? 'workerLastRead' : 'employerLastRead';
                        const lastReadObj = c[roleField];
                        if (!lastReadObj) {
                            c.isUnread = true;
                            c.unreadCount = 1;
                        } else {
                            const readTime = typeof lastReadObj.toMillis === 'function' ? lastReadObj.toMillis() : (lastReadObj.seconds ? lastReadObj.seconds * 1000 : lastReadObj);
                            c.isUnread = (updatedTime > readTime + 1000);
                            c.unreadCount = c.isUnread ? 1 : 0;
                        }
                    }
                });
                // Remove stale Firestore chats that are not in the new set for THIS roleType
                const newIds = new Set(newChats.map(c => c.id));
                localChats = localChats.filter(c => !c.isFirestore || c.roleType !== roleType || newIds.has(c.id));
                // Upsert
                newChats.forEach(nc => {
                    const idx = localChats.findIndex(c => c.id === nc.id);
                    if (idx !== -1) localChats[idx] = nc; else localChats.unshift(nc);
                });
                localChats.sort((a,b) => {
                    const timeA = a.updatedAt || a.createdAt || 0;
                    const timeB = b.updatedAt || b.createdAt || 0;
                    return timeB - timeA;
                });
                localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                if (typeof renderChatList === 'function') renderChatList();
                // Re-sync active chat if open
                if (window.selectedChatId) {
                    const activeChat = localChats.find(c => c.id === window.selectedChatId);
                    if (activeChat && typeof renderActiveChatMessages === 'function') renderActiveChatMessages(activeChat.id);
                }
            }

            // Worker-side chats (where current user is the worker)            function sendChatLocationOld() {
            const sendLoc = (lat, lng, fallbackStr) => {
                const dest = (lat && lng) ? `${lat},${lng}` : fallbackStr;
                const link = `\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\x3E📍 Helyszín megnyitása\x3C/a\x3E`;
                const input = document.getElementById('chat-reply-input');
                if (input) {
                    input.value = link;
                    sendChatMessageNew(true);
                }
            };
            const fallback = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposv%C3%A1r';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => sendLoc(pos.coords.latitude, pos.coords.longitude, fallback), err => sendLoc(null, null, fallback), { timeout: 10000 });
            } else {
                sendLoc(null, null, fallback);
            }
        }
        function sendWorkerChatLocationOld() {
            const sendLoc = (lat, lng, fallbackStr) => {
                const dest = (lat && lng) ? `${lat},${lng}` : fallbackStr;
                const link = `\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\x3E📍 Helyszín megnyitása\x3C/a\x3E`;
                const input = document.getElementById('worker-chat-reply-input');
                if (input) {
                    input.value = link;
                    sendWorkerChatMessageNew(true);
                }
            };
            const fallback = 'Kaposv%C3%A1r';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => sendLoc(pos.coords.latitude, pos.coords.longitude, fallback), err => sendLoc(null, null, fallback), { timeout: 10000 });
            } else {
                sendLoc(null, null, fallback);
            }
        }f Firestore collections

            function sendChatLocationOld() {
            const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposv�r') : 'Kaposv%C3%A1r';
            const link = `\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\x3E📍 Helyszín megnyitása\x3C/a\x3E`;
            const input = document.getElementById('chat-reply-input');
            if (input) {
                input.value = link;
                sendChatMessageNew(true);
            }
        }
        function sendWorkerChatLocationOld() {
            const dest = 'Kaposv%C3%A1r';
            const link = `\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\x3E📍 Helyszín megnyitása\x3C/a\x3E`;
            const input = document.getElementById('worker-chat-reply-input');
            if (input) {
                input.value = link;
                sendWorkerChatMessageNew(true);
            }
        }
        
        // --- Forgot Password Modal ---
        function showForgotPasswordModal() {
            document.getElementById('forgot-pw-modal').style.display = 'flex';
        }
        async function loginWithApple() {
            if (!window.firebaseAuth || !window.firebaseAPI || !window.firebaseAPI.signInWithPopup) {
                alert("Apple bejelentkezés jelenleg nem elérhető.");
                return;
            }
            try {
                const provider = new window.firebaseAPI.OAuthProvider('apple.com');
                const btn = document.getElementById('apple-login-btn');
                if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; }
                
                localStorage.setItem('melogo_pending_role', loginSelectedRole || 'worker');
                await window.firebaseAPI.signInWithPopup(window.firebaseAuth, provider);
                // onAuthStateChanged fogja kezelni a sikeres belépést
            } catch (error) {
                console.error("Apple login error:", error);
                alert("Hiba történt az Apple bejelentkezés során: " + error.message);
                const btn = document.getElementById('apple-login-btn');
                if (btn) { btn.disabled = false; btn.style.opacity = ''; }
            }
        }
        function closeForgotPasswordModal() {
            document.getElementById('forgot-pw-modal').style.display = 'none';
        }
        async function submitForgotPassword() {
            const email = document.getElementById('forgot-pw-email').value;
            if (!email || !email.includes('@')) {
                alert('Kérlek adj meg egy érvényes email címet!');
                return;
            }
            if (window.firebaseAuth && window.firebaseAPI) {
                try {
                    await window.firebaseAPI.sendPasswordResetEmail(window.firebaseAuth, email);
                    alert('Jelszó visszaállító link elküldve! Ellenőrizd a beérkező leveleidet (és a Spam mappát is).');
                    closeForgotPasswordModal();
                } catch (error) {
                    console.error("Forgot password error:", error);
                    alert('Hiba történt: ' + error.message);
                }
            } else {
                alert('Jelszó emlékeztető elküldve (Demó mód).');
                closeForgotPasswordModal();
            }
        }
        window.showForgotPasswordModal = showForgotPasswordModal;
        window.loginWithApple = loginWithApple;
        window.closeForgotPasswordModal = closeForgotPasswordModal;
        window.submitForgotPassword = submitForgotPassword;
        
