


        
        
        
        

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
                        // Update existing user
                        const finalPhoto = userDoc.data().photoURL || user.photoURL || '';
                        await updateDoc(userRef, { lastLogin: serverTimestamp(), photoURL: finalPhoto });
                        const data = userDoc.data();
                        if (data.name) userName = data.name;
                        role = data.defaultRole || data.role || 'worker';
                        
                        const userData = { bio: data.bio || '', skills: data.skills || [], photoURL: finalPhoto, reviews: data.reviews || [], address: data.address || '' };
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
                    if (idx !== -1) {
                        if (localChats[idx].messages) {
                            nc.messages = localChats[idx].messages; // PRESERVE MESSAGES!
                        }
                        localChats[idx] = nc;
                    } else {
                        localChats.unshift(nc);
                    }
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

            // Worker-side chats (where current user is the worker)
            const workerChatsQuery = query(collection(db, "chats"), where("workerUid", "==", uid));
            window.chatsUnsubscribe = onSnapshot(workerChatsQuery, (snapshot) => {
                let newChats = [];
                snapshot.forEach(d => { const c = d.data(); c.id = d.id; newChats.push(c); });
                mergeFirestoreChats(newChats, 'worker');
            }, err => console.error('[Firestore] Worker chats listener error:', err));

            // Employer-side chats (where current user is the employer)
            const employerChatsQuery = query(collection(db, "chats"), where("employerUid", "==", uid));
            window.chatsUnsubscribe2 = onSnapshot(employerChatsQuery, (snapshot) => {
                let newChats = [];
                snapshot.forEach(d => { const c = d.data(); c.id = d.id; newChats.push(c); });
                mergeFirestoreChats(newChats, 'employer');
            }, err => console.error('[Firestore] Employer chats listener error:', err));

            function sendChatLocationOld() {
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
        



        function compressImage(dataUrl, maxWidth, quality, callback) {
            const img = new Image();
            img.onload = function() {
                let w = img.width;
                let h = img.height;
                if (w > maxWidth) {
                    h = Math.round((maxWidth / w) * h);
                    w = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                callback(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        }


        async function deleteAccount() {
            if(confirm("Biztosan v�glegesen t�r�lni szeretn�d a fi�kodat? Ez a mqvelet nem visszavonható�!")) {
                if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                    try {
                        await window.firebaseAuth.currentUser.delete();
                        alert("Fi�k sikeresen t�r�lve.");
                        logoutApp();
                        window.location.reload();
                    } catch(e) {
                        console.error(e);
                        if (e.code === 'auth/requires-recent-login') {
                            alert("A fi�k t�rl�s�hez k�rj�k jelentkezz be �jra frissen!");
                            logoutApp();
                        } else {
                            alert("Hiba a fi�k t�rl�sekor.");
                        }
                    }
                }
            }
        }


        async function forgotPassword() {
            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value : '';
            if (!email || !email.includes('@')) {
                highlightInputError('login-email', 'A jelsz� vissza�ll�t�s�hoz add meg az email c�medet!');
                showLoginError('A jelsz� vissza�ll�t�s�hoz add meg az email c�medet!');
                return;
            }
            if (window.firebaseAuth) {
                try {
                    await window.firebaseAPI.sendPasswordResetEmail(window.firebaseAuth, email);
                    alert('Jelsz�-vissza�ll�t�si link elk�ldve a(z) ' + email + ' c�mre!');
                } catch(e) {
                    console.error(e);
                    showLoginError('Hiba t�rt�nt a lev�l k�ld�sekor. EllenQrizd a c�met!');
                }
            } else {
                alert('Firebase nincs inicializ�lva!');
            }
        }


        window.addEventListener('popstate', (e) => {
            const openModals = document.querySelectorAll('.bottom-sheet.active, .action-sheet.active, .settings-overlay.active, .action-overlay.active');
            if (openModals.length > 0) {
                if (typeof closeWorkerJobDetail === 'function') closeWorkerJobDetail();
                if (typeof closeEmployerAdDetailNew === 'function') closeEmployerAdDetailNew();
                if (typeof closeEmployerChatRoom === 'function') closeEmployerChatRoom();
                if (typeof closeWorkerChatRoom === 'function') closeWorkerChatRoom();
                if (typeof closeMsgActionSheet === 'function') closeMsgActionSheet();
                if (typeof closeProfileOverlay === 'function') closeProfileOverlay();
            }
        });
        function pushModalState() {
            history.pushState({ modal: true }, '');
        }


        function escapeHTML(str) {
            if (!str) return '';
            let s = str.replace(/[&<>'"]/g, tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
            // Restore safe location links if matched perfectly
            s = s.replace(/&lt;a href=&quot;(https:\/\/www\.google\.com\/maps\/dir\/\?api=1&amp;destination=[^&]+)&quot; target=&quot;_blank&quot; style=&quot;color:#2563EB; text-decoration:underline;&quot;&gt;=� Helysz�n megnyit�sa&lt;\/a&gt;/g, '<a href="$1" target="_blank" style="color:#2563EB; text-decoration:underline;">=� Helysz�n megnyit�sa</a>');
            return s;
        }


        function safeSetItem(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    console.warn('Local storage full, clearing non-essential caches');
                    localStorage.removeItem('melogo_local_chats');
                    localStorage.removeItem('melogo_worker_applications');
                    try { localStorage.setItem(key, value); } catch (e2) { console.error('Still full', e2); }
                }
            }
        }

        // Global getter to evaluate currentUser dynamically safely anywhere in JS
        Object.defineProperty(window, 'currentUser', {
            get: function() {
                if (typeof loadCurrentUser === 'function') {
                    return loadCurrentUser();
                }
                return null;
            },
            configurable: true
        });

        // A predefiniált munkatípusok és áraik kategóriánként
        const jobCatalog = {
            Kert: [
                { name: 'Fűnyírás', price: 12000 },
                { name: 'Gyomirtás, kapálás', price: 8000 },
                { name: 'Levelek gereblyézése', price: 6000 },
                { name: 'Sövény nyírása', price: 10000 },
                { name: 'Virágágyás gondozása', price: 7000 },
                { name: 'Terasz söprése', price: 4000 },
                { name: 'Hólapátolás', price: 5000 },
                { name: 'Kerti bútor összerakása', price: 7000 },
                { name: 'Öntözőrendszer felszerelése', price: 15000 },
                { name: 'Fák metszése', price: 12000 },
                { name: 'Komposztálás segítése', price: 6000 }
            ],
            Magántanár: [
                { name: 'Angol', price: 6000 },
                { name: 'Magyar', price: 6000 },
                { name: 'Matek', price: 6000 },
                { name: 'Kémia', price: 7000 },
                { name: 'Fizika', price: 7000 },
                { name: 'Biológia', price: 7000 },
                { name: 'Történelem', price: 6000 },
                { name: 'Földrajz', price: 6000 },
                { name: 'Német', price: 6000 },
                { name: 'Francia', price: 7000 },
                { name: 'Spanyol', price: 7000 },
                { name: 'Olasz', price: 7000 },
                { name: 'Informatika', price: 7000 },
                { name: 'Programozás', price: 8000 },
                { name: 'Zene/Hangszer', price: 7000 },
                { name: 'Rajz/Vizuális', price: 6000 }
            ],
            Takarítás: [
                { name: 'Lakástakarítás', price: 15000 },
                { name: 'Mély takarítás', price: 20000 },
                { name: 'Iroda/üzlethelyiség', price: 18000 },
                { name: 'Építés utáni', price: 25000 },
                { name: 'Fürdőszoba és konyha', price: 12000 },
                { name: 'Ablakok tisztítása', price: 8000 },
                { name: 'Lomtalanítás', price: 15000 },
                { name: 'Pince/garázs kitakarítása', price: 14000 }
            ],
            Bébiszitter: [
                { name: 'Bébiszitterkedés', price: 8000 },
                { name: 'Iskolából hazakísérés', price: 4000 },
                { name: 'Délutáni felügyelet', price: 6000 },
                { name: 'Hétvégi felügyelet', price: 10000 },
                { name: 'Játszótéri kísérés', price: 4000 },
                { name: 'Házi feladat segítés', price: 5000 }
            ],
            Festés: [
                { name: 'Kerítés festése', price: 25000 },
                { name: 'Kapu/pad/bútor festése', price: 15000 },
                { name: 'Falak festése', price: 35000 },
                { name: 'Foltok lefestése', price: 6000 },
                { name: 'Alapozó festés', price: 9000 },
                { name: 'Homlokzat festés', price: 45000 },
                { name: 'Kisebb javítások', price: 10000 }
            ],
            Költöztetés: [
                { name: 'Bútor cipelés', price: 15000 },
                { name: 'Dobozok pakolása', price: 8000 },
                { name: 'Furgon rakodás', price: 18000 },
                { name: 'Lépcsőn cipelés', price: 12000 },
                { name: 'Bútor szétszerelése', price: 10000 },
                { name: 'Csomagküldés segítése', price: 6000 }
            ],
            Kőműves: [
                { name: 'Anyagcipelés', price: 10000 },
                { name: 'Cementkeverés', price: 12000 },
                { name: 'Törmelék takarítás', price: 8000 },
                { name: 'Alapozó segítség', price: 9000 },
                { name: 'Burkolatrakás segítése', price: 14000 },
                { name: 'Állványozás segítése', price: 15000 }
            ],
            Asztalos: [
                { name: 'IKEA összeszerelés', price: 12000 },
                { name: 'Kerti bútor', price: 8000 },
                { name: 'Faipari segédmunka', price: 10000 },
                { name: 'Polcok felszerelése', price: 7000 },
                { name: 'Ajtópánt csere', price: 6000 }
            ],
            Állat: [
                { name: 'Kutyasétáltatás', price: 3000 },
                { name: 'Kisállat gondozás', price: 5000 },
                { name: 'Macska felügyelet', price: 4000 },
                { name: 'Állatorvoshoz kísérés', price: 6000 },
                { name: 'Akváriumgondozás', price: 7000 }
            ],
            Bevásárlás: [
                { name: 'Bevásárlás', price: 5000 },
                { name: 'Csomagok hordása', price: 4000 },
                { name: 'Ügyintézés', price: 6000 },
                { name: 'Gyógyszer kiváltás', price: 3000 },
                { name: 'Ebéd rendelés összegyűjtése', price: 4000 }
            ],
            Rendezvény: [
                { name: 'Felállítás', price: 14000 },
                { name: 'Kiszolgálás, tálalás', price: 10000 },
                { name: 'Lerendezés, takarítás', price: 12000 },
                { name: 'Beléptetés', price: 9000 },
                { name: 'Dekoráció', price: 11000 },
                { name: 'Hangosítás/tech segítség', price: 15000 }
            ],
            Mező: [
                { name: 'Gyümölcsszedés', price: 10000 },
                { name: 'Aratás, betakarítás', price: 11000 },
                { name: 'Mezei segédmunka', price: 9000 },
                { name: 'Zöldség válogatás', price: 8000 },
                { name: 'Öntözés', price: 7000 },
                { name: 'Állatok gondozása (tanyán)', price: 12000 }
            ],
            Autó: [
                { name: 'Autómosás (kézi)', price: 6000 },
                { name: 'Belső porszívózás', price: 5000 },
                { name: 'Kárpit tisztítás', price: 7000 },
                { name: 'Motortér tisztítás', price: 6000 }
            ]
        };


        
        // openChat (legacy 1-param stub removed — use openChat(name, jobTitle, ...) at line 8514)

        // Élő szimulációs adatbázis / State
        let gameState = {
            jobTitle: 'Fűnyírás',
            jobPrice: 12000,
            jobDesc: 'Közepes méretű kert teljes rendbetétele.',
            jobCounty: 'Somogy',
            jobCity: 'Kaposvár',
            jobStreet: 'Deseda u.',
            jobHouse: '12.',
            jobDistance: 0.4,
            status: 'Keresés', 
            applied: false,
            chatHistory: [
                { sender: 'worker', text: 'Szia! Nagyon szívesen elvállalom a fűnyírást holnap délután. Hozok saját fűnyírót is!', time: '14:00' }
            ]
        };

        let currentJobTitle = 'Fűnyírás';
        let currentJobPrice = '12 000 Ft';
        let currentJobLoc = '📍 Deseda u. 12.';

        let workerActiveCategory = 'all';

        // ==========================================
        // SESSION ÉS ROLE KEZELÉS
        // ==========================================
        let currentRole = 'worker';
        let loginSelectedRole = 'worker';
        Object.defineProperty(window, 'activeRole', {
            get() { return currentRole || localStorage.getItem('melogo_active_role') || 'worker'; },
            configurable: true
        });

        
        function getGreeting(name) {
            const hour = new Date().getHours();
            const date = new Date();
            
            // Holiday override
            if (date.getMonth() === 7 && date.getDate() === 20) {
                return `Boldog államalapítást, ${name}! 🇭🇺`;
            }
            
            const greetingPrefix = hour < 10 ? 'Jó reggelt' : (hour >= 19 ? 'Jó estét' : 'Szia');
            return name ? `${greetingPrefix}, ${name}!` : `${greetingPrefix}!`;
        }
        function updateGreetings() {
            const user = loadCurrentUser();
            const fullName = user ? user.name : 'Felhasználó';
            const greeting = getGreeting(fullName);
            document.querySelectorAll('.greeting-text').forEach(el => el.innerText = greeting);
            
            // Direct update welcome-text
            const welcomeText = document.querySelector('.welcome-text');
            if (welcomeText) {
                welcomeText.innerHTML = greeting;
            }
        }

        

        
        function updateAvatars() {
            document.querySelectorAll('.avatar-circle').forEach(el => {
                const name = el.getAttribute('data-name') || (currentUser ? currentUser.name : 'Teszt Felhasználó');
                el.style.background = getAvatarGradient(name);
                el.style.color = 'white';
                el.style.border = '3px solid white';
            });
        }

        window.onload = function() {
            let initialCatLabel = 'Minden feladat';
            document.getElementById('worker-job-filter-display').innerHTML = initialCatLabel + ' <svg style="margin-left:4px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
            // filterWorkerJobs is now handled by refreshJobList() in the new engine
            // Init date filter slider
            if (typeof renderDateFilter === 'function') renderDateFilter();

            if (localStorage.getItem('melogo_app_session')) {
                const screen = document.getElementById('app-login-screen');
                if (screen) screen.classList.add('hidden');
                
                const savedRole = localStorage.getItem('melogo_active_role');
                if (savedRole) {
                    switchRole(savedRole);
                    updateGreetings();
                    

        
        // Search clear X
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear-btn');
        if (searchInput && searchClear) {
            searchClear.style.transition = 'transform 0.2s';
            searchInput.addEventListener('input', () => {
                if (searchInput.value.length > 0) {
                    searchClear.style.display = 'block';
                    setTimeout(()=>searchClear.style.transform = 'scale(1)', 10);
                } else {
                    searchClear.style.transform = 'scale(0)';
                    setTimeout(()=>searchClear.style.display = 'none', 200);
                }
            });
        }

        // Distance magic (simulate walking closer)
        setInterval(() => {
            document.querySelectorAll('.job-distance-text').forEach(el => {
                let dist = parseFloat(el.innerText);
                if (dist > 0.1 && Math.random() > 0.8) {
                    dist -= 0.1;
                    el.innerText = dist.toFixed(1) + ' km';
                    el.style.color = 'var(--color-green)';
                    setTimeout(()=>el.style.color='var(--color-text)', 500);
                }
            });
        }, 5000);
 updateAvatars();
                } else {
                    switchRole('worker');
                    updateGreetings();
                }
            } else {
                switchRole('worker'); // default for login screen
                // Ensure all overlays and action sheets are closed on startup if not logged in
                if (typeof closeAllActionOverlays === 'function') {
                    closeAllActionOverlays();
                }
                document.querySelectorAll('.action-overlay, .settings-overlay').forEach(el => {
                    el.classList.remove('active', 'open');
                });
            }
        };

        function highlightInputError(id, msg) {
            const input = document.getElementById(id);
            if (!input) return;
            const group = input.closest('.floating-group');
            if (group) {
                group.classList.add('has-error');
                let errSlot = group.querySelector('.inline-err-msg');
                if (!errSlot) {
                    errSlot = document.createElement('div');
                    errSlot.className = 'inline-err-msg';
                    errSlot.style.cssText = 'color:#EF4444;font-size:11px;margin-top:4px;font-weight: 300;text-align:left;padding-left:4px;';
                    group.appendChild(errSlot);
                }
                if (msg) {
                    errSlot.innerText = msg;
                    errSlot.style.display = 'block';
                }
            }
        }

        function clearAllInputErrors() {
            document.querySelectorAll('.floating-group.has-error').forEach(group => {
                group.classList.remove('has-error');
                const errSlot = group.querySelector('.inline-err-msg');
                if (errSlot) errSlot.style.display = 'none';
            });
            const termsBox = document.getElementById('terms-checkbox');
            if (termsBox && !termsAccepted) {
                termsBox.style.borderColor = 'var(--color-border)';
            }
        }

        // Auto-clear inline error messages when user types
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('login-input')) {
                const group = e.target.closest('.floating-group');
                if (group) {
                    group.classList.remove('has-error');
                    const errSlot = group.querySelector('.inline-err-msg');
                    if (errSlot) errSlot.style.display = 'none';
                }
            }
        });

        let termsAccepted = false;
        function toggleTermsCheckbox() {
            termsAccepted = !termsAccepted;
            const checkbox = document.getElementById('terms-checkbox');
            if (!checkbox) return;
            const checkSvg = checkbox.querySelector('svg');
            const group = checkbox.closest('.floating-group');
            
            if (termsAccepted) {
                checkbox.style.borderColor = 'var(--color-green)';
                checkbox.style.background = 'var(--color-green)';
                if (checkSvg) checkSvg.style.display = 'block';
                if (group) group.classList.remove('has-error');
            } else {
                checkbox.style.borderColor = 'var(--color-border)';
                checkbox.style.background = '#fff';
                if (checkSvg) checkSvg.style.display = 'none';
            }
        }

        function togglePasswordVisibility(id, btn) {
            const input = document.getElementById(id);
            if (!input) return;
            const svg = btn.querySelector('svg');
            if (!svg) return;
            if (input.type === 'password') {
                input.type = 'text';
                svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
            } else {
                input.type = 'password';
                svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        }

        let regConfirmedAddress = null;
        function handleRegAddressInput(val) {
            const suggList = document.getElementById('reg-address-suggestions');
            if (!val || val.length < 2) {
                suggList.style.display = 'none';
                return;
            }
            suggList.innerHTML = '';
            
            const matches = MOCK_ADDRESSES.filter(a => a.toLowerCase().includes(val.toLowerCase()));
            if (matches.length > 0) {
                matches.forEach(m => {
                    const div = document.createElement('div');
                    div.style.cssText = 'padding:12px 16px; font-size:14px; font-weight: 300; color:var(--color-text); cursor:pointer; border-bottom:1px solid var(--color-border);';
                    div.innerText = m;
                    div.onclick = function() {
                        document.getElementById('app-address').value = m;
                        regConfirmedAddress = m;
                        suggList.style.display = 'none';
                        const grp = document.getElementById('register-employer-address-group');
                        if(grp) grp.classList.remove('has-error');
                    };
                    suggList.appendChild(div);
                });
                suggList.style.display = 'block';
            } else {
                suggList.style.display = 'none';
            }
        }

        function selectLoginRole(role) {
            loginSelectedRole = role;
            const pWorker = document.getElementById('role-pill-worker');
            const pEmployer = document.getElementById('role-pill-employer');
            if (!pWorker || !pEmployer) return;
            
            const addrGroup = document.getElementById('register-employer-address-group');
            if (role === 'worker') {
                pWorker.classList.add('active');
                pEmployer.classList.remove('active');
                if(addrGroup) addrGroup.style.display = 'none';
            } else {
                pEmployer.classList.add('active');
                pWorker.classList.remove('active');
                if(addrGroup) addrGroup.style.display = 'block';
            }
        }

        let isLoginMode = false;

        function toggleAuthMode() {
            if (isLoginMode) {
                switchToRegister();
            } else {
                switchToLogin();
            }
        }

        function switchToLogin() {
            isLoginMode = true;
            var rf = document.getElementById('register-fields');
            var lf = document.getElementById('login-fields');
            var sub = document.getElementById('login-mode-subtitle');
            var btn = document.getElementById('main-auth-btn');
            var sw = document.getElementById('auth-switch-text');
            var roleSel = document.getElementById('login-role-selector');
            
            if (rf) rf.style.display = 'none';
            if (lf) lf.style.display = 'flex';
            if (roleSel) roleSel.style.display = 'none';
            const addrGroup = document.getElementById('register-employer-address-group');
            if(addrGroup) addrGroup.style.display = 'none';
            if (sub) sub.innerText = 'Lépj be a fiókodba';
            if (btn) btn.innerText = 'Bejelentkezem';
            if (sw) sw.innerHTML = 'Nincs még fiókod? <span style="color:var(--color-text); font-weight: 400; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Regisztrálj</span>';
            
            clearAllInputErrors();
            clearLoginError();
        }

        function switchToRegister() {
            isLoginMode = false;
            var rf = document.getElementById('register-fields');
            var lf = document.getElementById('login-fields');
            var sub = document.getElementById('login-mode-subtitle');
            var btn = document.getElementById('main-auth-btn');
            var sw = document.getElementById('auth-switch-text');
            var roleSel = document.getElementById('login-role-selector');
            
            if (rf) rf.style.display = 'flex';
            if (lf) lf.style.display = 'none';
            if (roleSel) roleSel.style.display = 'flex';
            const addrGroup = document.getElementById('register-employer-address-group');
            if(addrGroup && loginSelectedRole === 'employer') addrGroup.style.display = 'block';
            if (sub) sub.innerText = 'Hozd létre a fiókodat';
            if (btn) btn.innerText = 'Regisztrálok & Bejelentkezem';
            if (sw) sw.innerHTML = 'Van már fiókod? <span style="color:var(--color-text); font-weight: 400; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Jelentkezz be</span>';
            
            clearAllInputErrors();
            clearLoginError();
        }

        function clearLoginError() {
            var err = document.getElementById('login-err');
            if (err) err.style.display = 'none';
        }

        function showLoginError(msg) {
            var err = document.getElementById('login-err');
            if (!err) return;
            err.innerText = msg;
            err.style.display = 'block';
            err.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function doEnterApp(name, email, role) {
            var session = { email: email, name: name, role: role, loginAt: Date.now() };
            localStorage.setItem('melogo_worker_session', JSON.stringify(Object.assign({}, session, {role:'worker'})));
            localStorage.setItem('melogo_employer_session', JSON.stringify(Object.assign({}, session, {role:'employer'})));
            localStorage.setItem('melogo_active_role', role);
            localStorage.setItem('melogo_app_session', 'true');
            localStorage.setItem('melogo_name', name);
            var screen = document.getElementById('app-login-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.35s ease';
                screen.style.opacity = '0';
                setTimeout(function() {
                    screen.classList.add('hidden');
                    screen.style.opacity = '';
                    if (typeof updateAllUserUI === 'function') updateAllUserUI();
                    if (typeof updateGreetings === 'function') updateGreetings();
                    if (typeof switchRole === 'function') switchRole(role);
                }, 350);
            }
        }

        async function loginWithGoogle() {
            if (!window.firebaseAPI || !window.firebaseAPI.signInWithPopup) {
                alert("A rendszer és a Google azonosítás még betöltés alatt áll. Kérjük, várj pár másodpercet és próbáld újra.");
                return;
            }
            
            const googleBtn = document.getElementById('google-login-btn');
            if (googleBtn) { googleBtn.disabled = true; googleBtn.style.opacity = '0.6'; }
            
            const provider = new window.firebaseAPI.GoogleAuthProvider();
            try {
                localStorage.setItem('melogo_pending_role', loginSelectedRole || 'worker');
                await window.firebaseAPI.signInWithPopup(window.firebaseAuth, provider);
                // onAuthStateChanged fogja kezelni a sikeres belépést
            } catch (error) {
                console.error("Google login error:", error);
                alert('Hiba a Google bejelentkezés során: ' + (error.message || error.code));
                if (googleBtn) { googleBtn.disabled = false; googleBtn.style.opacity = ''; }
            }
        }

        async function loginApp() {
            clearLoginError();
            clearAllInputErrors();
            var role = loginSelectedRole || 'worker';
            var btn = document.getElementById('main-auth-btn');
            
            if (isLoginMode) {
                // LOGIN flow
                var emailInput = document.getElementById('login-email');
                var pwInput = document.getElementById('login-pw');
                var email = (emailInput || {}).value || '';
                var pw = (pwInput || {}).value || '';
                
                let hasError = false;
                if (!email || !email.includes('@')) {
                    highlightInputError('login-email', 'Kérlek adj meg érvényes email címet!');
                    showLoginError('Kérlek adj meg érvényes email címet!');
                    hasError = true;
                }
                if (!pw) {
                    highlightInputError('login-pw', 'Add meg a jelszavad!');
                    if (!hasError) showLoginError('Add meg a jelszavad!');
                    hasError = true;
                }
                if (hasError) return;
                
                try {
                    btn.disabled = true;
                    btn.innerText = 'Bejelentkezés...';
                    
                    const userCredential = await window.firebaseAPI.signInWithEmailAndPassword(window.firebaseAuth, email, pw);
                    const user = userCredential.user;
                    
                    // Fetch user profile from Firestore
                    const userDoc = await window.firebaseAPI.getDoc(window.firebaseAPI.doc(window.firebaseDb, "users", user.uid));
                    let name = 'Felhasználó';
                    let bio = '';
                    let skills = [];
                    let photoURL = '';
                    let defaultRole = role;
                    
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        name = data.name || name;
                        bio = data.bio || '';
                        skills = data.skills || [];
                        photoURL = data.photoURL || '';
                        defaultRole = data.defaultRole || data.role || 'worker';
                    }
                    
                    // Save to user_data - completely overwrite from Firestore to prevent stale local cache inheritance!
                    const userData = {};
                    userData.bio = bio;
                    userData.skills = skills;
                    userData.photoURL = photoURL;
                    userData.reviews = userDoc.exists() ? (userDoc.data().reviews || []) : [];
                    userData.address = userDoc.exists() ? (userDoc.data().address || '') : '';
                    localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                    
                    doEnterApp(name, email, defaultRole);
                } catch (error) {
                    showLoginError('Hiba: Helytelen email vagy jelszó!');
                    highlightInputError('login-email', 'Helytelen email cím!');
                    highlightInputError('login-pw', 'Helytelen jelszó!');
                    btn.disabled = false;
                    btn.innerText = 'Bejelentkezem';
                }
            } else {
                // REGISTER flow
                var nameInput = document.getElementById('app-name');
                var emailInput = document.getElementById('app-email');
                var pwInput = document.getElementById('app-pw');
                var pw2Input = document.getElementById('app-pw2');
                
                var name = ((nameInput || {}).value || '').trim();
                var email = ((emailInput || {}).value || '').trim();
                var pw = ((pwInput || {}).value || '');
                var pw2 = ((pw2Input || {}).value || '');
                
                var zip = ((document.getElementById('reg-zip') || {}).value || '').trim();
                var city = ((document.getElementById('reg-city') || {}).value || '').trim();
                var street = ((document.getElementById('reg-street') || {}).value || '').trim();
                var county = ((document.getElementById('reg-county') || {}).value || '').trim();
                
                var addressArr = [];
                if(zip) addressArr.push(zip);
                if(city) addressArr.push(city);
                if(street) addressArr.push(street);
                var address = addressArr.join(' ') || 'Kaposvár';
                if(county && address !== 'Kaposvár') address += ' (' + county + ')';
                
                let hasError = false;
                if (!name || name.length < 2) {
                    highlightInputError('app-name', 'Kérlek add meg a teljes neved!');
                    showLoginError('Kérlek add meg a teljes neved!');
                    hasError = true;
                }
                if (!email || !email.includes('@')) {
                    highlightInputError('app-email', 'Kérlek adj meg érvényes email címet!');
                    if (!hasError) showLoginError('Kérlek adj meg érvényes email címet!');
                    hasError = true;
                }
                if (!pw || pw.length < 6) {
                    highlightInputError('app-pw', 'A jelszónak legalább 6 karakternek kell lennie!');
                    if (!hasError) showLoginError('A jelszónak legalább 6 karakternek kell lennie!');
                    hasError = true;
                }
                if (pw !== pw2) {
                    highlightInputError('app-pw2', 'A két jelszó nem egyezik meg!');
                    if (!hasError) showLoginError('A két jelszó nem egyezik meg!');
                    hasError = true;
                }
                if (zip && city && street) {
                    regConfirmedAddress = address;
                }
                if (role === 'employer' && !regConfirmedAddress) {
                    if (!zip) highlightInputError('reg-zip', 'Kötelező!');
                    if (!city) highlightInputError('reg-city', 'Kötelező!');
                    if (!street) highlightInputError('reg-street', 'Kötelező!');
                    if (!hasError) showLoginError('Megbízóként kötelező megadni a pontos lakcímedet!');
                    hasError = true;
                }
                if (!termsAccepted) {
                    const termsBox = document.getElementById('terms-checkbox');
                    if (termsBox) {
                        termsBox.style.borderColor = '#EF4444';
                        termsBox.closest('.floating-group').classList.add('has-error');
                    }
                    if (!hasError) showLoginError('Regisztráció előtt el kell fogadnod az ÁSZF-et!');
                    hasError = true;
                }
                if (hasError) return;
                
                try {
                    btn.disabled = true;
                    btn.innerText = 'Regisztráció...';
                    
                    const userCredential = await window.firebaseAPI.createUserWithEmailAndPassword(window.firebaseAuth, email, pw);
                    const user = userCredential.user;
                    
                    const userDataToSave = {
                        name: name,
                        email: email,
                        defaultRole: role,
                        createdAt: window.firebaseAPI.serverTimestamp()
                    };
                    if (regConfirmedAddress) {
                        userDataToSave.address = regConfirmedAddress;
                    } else if (typeof address !== 'undefined' && address) {
                        userDataToSave.address = address;
                    }
                    if (city) userDataToSave.addressCity = city;
                    if (street) userDataToSave.addressStreet = street;
                    if (county) userDataToSave.addressCounty = county;

                    // Save initial user profile to Firestore
                    await window.firebaseAPI.setDoc(window.firebaseAPI.doc(window.firebaseDb, "users", user.uid), userDataToSave);
                    
                    // Initialize a brand new, empty local profile to prevent stale local cache inheritance!
                    const userData = {
                        bio: '',
                        skills: [],
                        photoURL: '',
                        reviews: [],
                        address: (regConfirmedAddress) ? regConfirmedAddress : (typeof address !== 'undefined' ? address : ''),
                        addressCity: city || '',
                        addressStreet: street || '',
                        addressCounty: county || ''
                    };
                    localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                    localStorage.setItem('melogo_worker_applications', '[]');
                    localStorage.setItem('melogo_chats', '[]');
                    
                    doEnterApp(name, email, role);
                } catch (error) {
                    let errMsg = 'Sikertelen regisztráció!';
                    if (error.code === 'auth/email-already-in-use') {
                        errMsg = 'Ez az email cím már foglalt!';
                        highlightInputError('app-email', errMsg);
                    } else if (error.code === 'auth/invalid-email') {
                        errMsg = 'Érvénytelen email cím!';
                        highlightInputError('app-email', errMsg);
                    } else if (error.code === 'auth/weak-password') {
                        errMsg = 'A jelszó túl gyenge (legalább 6 karakter szükséges)!';
                        highlightInputError('app-pw', errMsg);
                    } else {
                        errMsg = error.message || errMsg;
                        highlightInputError('app-email', errMsg);
                    }
                    showLoginError('Hiba a regisztráció során: ' + errMsg);
                    btn.disabled = false;
                    btn.innerText = 'Regisztrálok & Bejelentkezem';
                }
            }
        }

        function loginAppFaceID() {
            var savedSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
            var name = savedSession.name || 'Demo Felhasználó';
            var email = savedSession.email || 'demo@melogo.hu';
            doEnterApp(name, email, loginSelectedRole || 'worker');
        }
        
        async function logoutApp() {
            try {
                if (window.firebaseAuth) {
                    await window.firebaseAPI.signOut(window.firebaseAuth);
                }
            } catch (e) { console.error("Firebase kijelentkezés sikertelen", e); }
            
            // Completely clear all MeloGo keys in local storage to prevent session leakage/stale ratings
            const keysToRemove = [
                'melogo_app_session',
                'melogo_active_role',
                'melogo_name',
                'melogo_worker_session',
                'melogo_employer_session',
                'melogo_user_data',
                'melogo_worker_applications',
                'melogo_chats',
                'melogo_employer_jobs',
                'melogo_sort'
            ];
            keysToRemove.forEach(k => localStorage.removeItem(k));
            
            location.reload();
        }

        function switchRole(role) {
    localStorage.setItem('melogo_active_role', role);

            currentRole = role;
            setTimeout(() => { if (typeof updateAllUserUI === 'function') updateAllUserUI(); }, 50);
            localStorage.setItem('melogo_active_role', role);
            
            // Haptic
            if (navigator.vibrate) navigator.vibrate(50);
            
            // Scroll reset
            const homeScreen = document.getElementById('home-screen-scroll-container');
            if (homeScreen) homeScreen.scrollTop = 0;

            // UI Toggle
            const btnWorker = document.getElementById('role-btn-worker');
            const btnEmployer = document.getElementById('role-btn-employer');
            if (btnWorker && btnEmployer) {
                btnWorker.classList.remove('active');
                btnEmployer.classList.remove('active');
                document.getElementById(`role-btn-${role}`).classList.add('active');
            }
            
            // Description & Animation update
            const desc = document.getElementById('role-description-text');
            const anim = document.getElementById('role-check-anim');
            if (desc) {
                desc.innerText = role === 'worker' ? 'Közeli munkákat keresel és vállalsz.' : 'Munkákat adsz fel és kezeled a jelentkezőket.';
            }
            if (anim) {
                anim.style.opacity = '1';
                anim.style.transform = 'scale(1)';
                setTimeout(() => {
                    anim.style.opacity = '0';
                    anim.style.transform = 'scale(0.5)';
                }, 1500);
            }

            const searchPill = document.getElementById('home-search-pill');
            const searchInput = document.getElementById('worker-search-input');
            const searchTabTitle = document.getElementById('search-tab-title');
            const mapToggleBtn = document.getElementById('search-toggle-map');
            
            if (role === 'worker') {
                document.getElementById('home-worker-view').style.display = 'flex';
                document.getElementById('home-employer-view').style.display = 'none';
                const sharedHeader = document.querySelector('.header-midnight');
                if (sharedHeader) sharedHeader.style.display = 'block';
                if (searchPill) searchPill.style.display = 'flex';
                
                // Reorder bottom nav tabs for WORKER role: 4 tabs (Főlap - Térkép - Üzenetek - Profil), no green plus button!
                const nav0 = document.getElementById('app-nav-0'); // Főlap
                const nav1 = document.getElementById('app-nav-1'); // Térkép
                const nav2 = document.getElementById('app-nav-2'); // Üzenetek
                const nav3 = document.getElementById('app-nav-3'); // Profil
                const floatPlus = document.getElementById('emp-floating-plus'); // ✚
                
                if (floatPlus) {
                    floatPlus.style.display = 'none'; // hide completely in worker mode
                }
                if (nav1) {
                    nav1.style.display = 'flex';
                    nav1.style.opacity = '1';
                    nav1.style.pointerEvents = 'auto';
                    nav1.style.order = '';
                }
                if (nav0) nav0.style.order = '';
                if (nav2) nav2.style.order = '';
                if (nav3) nav3.style.order = '';
                
            } else {
                document.getElementById('home-worker-view').style.display = 'none';
                document.getElementById('home-employer-view').style.display = 'flex';
                const sharedHeader = document.querySelector('.header-midnight');
                if (sharedHeader) sharedHeader.style.display = 'none';
                if (searchPill) searchPill.style.display = 'none';
                
                // Reorder bottom nav tabs for EMPLOYER role: 4 equal slots: Főlap (1) - ✚ (2) - Üzenetek (3) - Profil (4)
                const nav0 = document.getElementById('app-nav-0'); // Főlap
                const nav1 = document.getElementById('app-nav-1'); // Térkép
                const nav2 = document.getElementById('app-nav-2'); // Üzenetek
                const nav3 = document.getElementById('app-nav-3'); // Profil
                const floatPlus = document.getElementById('emp-floating-plus'); // ✚
                
                if (nav1) {
                    nav1.style.display = 'none'; // hide map completely in employer mode
                }
                if (nav0) nav0.style.order = '1';
                if (floatPlus) {
                    floatPlus.style.display = 'flex';
                    floatPlus.style.order = '2';
                }
                if (nav2) nav2.style.order = '3';
                if (nav3) nav3.style.order = '4';
                
                // If employer is currently on the map tab, navigate to home
                navigateApp(0);
            }

            // Setup/re-setup Firestore queries for the selected role
            if (typeof window.setupFirestoreListeners === 'function') {
                window.setupFirestoreListeners(role);
            }
        }
        
        function openEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.add('open');
            selectEmployerFormCat('Kert'); // load default options
            if (currentUser && currentUser.role === 'employer' && currentUser.address) {
                selectAddress(currentUser.address);
            }
            if (typeof empFormMap !== 'undefined' && empFormMap) {
                setTimeout(() => empFormMap.invalidateSize(), 200);
            }
        }
        function closeEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.remove('open');
            currentEditJobId = null;
            // Restore default form title and button labels
            const titleEl = document.querySelector('#employer-form-overlay .emp-form-title');
            if (titleEl) titleEl.innerText = "Új munka feladása";
            const submitEl = document.querySelector('#employer-form-overlay .emp-submit-btn');
            if (submitEl) {
                submitEl.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Hirdetés közzététele
                `;
            }
            // Clear inputs
            const detailsEl = document.getElementById('emp-details');
            if (detailsEl) detailsEl.value = '';
            const priceEl = document.getElementById('emp-price-input');
            if (priceEl) priceEl.value = '12000';
            const dtEl = document.getElementById('emp-datetime');
            if (dtEl) dtEl.value = '';
            resetAddressSearch();
        }

        // Dinamikusan feltölti a diák keresőoldali pontos munka szűrő legördülő menüjét
        function populateSearchJobDropdown() {
            const select = document.getElementById('worker-search-job-select');
            if (!select) return;
            select.innerHTML = '';

            const defaultOpt = document.createElement('option');
            defaultOpt.value = 'all';
            defaultOpt.innerText = '🔍 Válassz egy pontos feladatot...';
            select.appendChild(defaultOpt);

            const categoriesMap = {
                'Kert': 'Kertészet',
                'Magántanár': 'Magántanár',
                'Takarítás': 'Takarítás',
                'Bébiszitter': 'Bébiszitter / Gyerekfelügyelet',
                'Festés': 'Festés & Karbantartás',
                'Költöztetés': 'Költöztetés & Cipelés',
                'Kőműves': 'Kőműves segédmunka',
                'Asztalos': 'Asztalos / Összeszerelés',
                'Állat': 'Állat & Kisállat',
                'Bevásárlás': 'Bevásárlás & Futár',
                'Rendezvény': 'Rendezvény',
                'Mező': 'Mezőgazdaság',
                'Autó': 'Autó'
            };

            for (const category in jobCatalog) {
                const group = document.createElement('optgroup');
                group.label = categoriesMap[category] || category;
                jobCatalog[category].forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.name;
                    opt.innerText = item.name;
                    group.appendChild(opt);
                });
                select.appendChild(group);
            }
        }

        // EGYESÍTETT NAVIGÁCIÓ
        function navigateApp(index) {
            // Close swipe wrapper when navigating
            if (typeof activeSwipeWrapper !== 'undefined' && activeSwipeWrapper) {
                resetSwipeTransform(activeSwipeWrapper);
            }
            
            if (index === 3) {
                setTimeout(function() { if(typeof renderProfileReviews === 'function') renderProfileReviews(); updateAllUserUI(); if(typeof initDarkModeToggle === 'function') initDarkModeToggle(); }, 100);
            }
            const slider = document.getElementById('app-slider');
            if (slider) slider.style.transform = `translateX(-${index * 25}%)`;
            const navs = document.querySelectorAll('#phone-app .bottom-nav .nav-item');
            navs.forEach(nav => nav.classList.remove('active'));
            const activeNav = document.getElementById(`app-nav-${index}`);
            if (activeNav) activeNav.classList.add('active');

            if (index === 1) {
                setTimeout(() => {
                    if (leafletMap) {
                        leafletMap.invalidateSize();
                        renderMapPins();
                    } else {
                        initLeafletMap();
                    }
                }, 150);
            } else {
                const mapCard = document.getElementById('map-preview-card');
                if (mapCard) mapCard.classList.remove('visible');
            }
        }

        // Visszafelé kompatibilitási wrapperek a hibák elkerülésére
        function navigateWorker(index) {
            navigateApp(index);
        }
        // navigateEmployer stub removed — real implementation below (line 5634)

        // SZÖVEGES ÉS TÉRKÉPES KERESŐ TOGGLE VÁLTÓ
        function switchSearchTab(mode) {
            const mapBtn = document.getElementById('search-toggle-map');
            const listBtn = document.getElementById('search-toggle-list');
            const mapContent = document.getElementById('search-content-map');
            const listContent = document.getElementById('search-content-list');

            if (mode === 'map') {
                mapBtn.classList.add('active');
                mapBtn.style.backgroundColor = 'white';
                mapBtn.style.color = 'var(--color-midnight)';
                mapBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';

                listBtn.classList.remove('active');
                listBtn.style.background = 'none';
                listBtn.style.color = 'white';
                listBtn.style.boxShadow = 'none';

                mapContent.style.display = 'flex';
                listContent.style.display = 'none';
            } else {
                listBtn.classList.add('active');
                listBtn.style.backgroundColor = 'white';
                listBtn.style.color = 'var(--color-midnight)';
                listBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';

                mapBtn.classList.remove('active');
                mapBtn.style.background = 'none';
                mapBtn.style.color = 'white';
                mapBtn.style.boxShadow = 'none';

                mapContent.style.display = 'none';
                listContent.style.display = 'flex';
            }
        }

        // 2. HIRDETŐ NAVIGÁCIÓ
        function navigateEmployer(index) {
            document.getElementById('employer-slider').style.transform = `translateX(-${index * 33.333}%)`;
            const navs = document.querySelectorAll('#phone-employer .bottom-nav .nav-item');
            navs.forEach(nav => nav.classList.remove('active'));
            document.getElementById(`employer-nav-${index}`).classList.add('active');
        }

        // ================================================
        // CUSTOM BOTTOM SHEET JOB PICKER
        // ================================================
        let currentJobPickerMode = 'filter';
        let selectedExactJob = 'all';

        function openJobPicker(mode) {
            currentJobPickerMode = mode;
            jobPickerDrillCat = null; // always start at grid view
            document.getElementById('job-picker-backdrop').classList.add('open');
            document.getElementById('job-picker-sheet').classList.add('open');
            renderJobPickerList();
        }

        function closeJobPicker() {
            document.getElementById('job-picker-backdrop').classList.remove('open');
            document.getElementById('job-picker-sheet').classList.remove('open');
        }

        function selectJobPickerItem(value, label) {
            closeJobPicker();
            selectedExactJob = value;
            jobPickerDrillCat = null;

            if (currentJobPickerMode === 'filter') {
                document.getElementById('worker-job-filter-display').innerHTML = label + ' <svg style="margin-left:4px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
                filterWorkerByExactJob(value);
            } else {
                document.getElementById('worker-search-job-display').innerText = label;
                applyTextSearchTag(value === 'all' ? '' : value);
            }
        }

        // Category display names
        const CAT_DISPLAY_NAMES = {
            Kert: 'Kertészet',
            Magántanár: 'Magántanár',
            Takarítás: 'Takarítás',
            Bébiszitter: 'Bébiszitter',
            Festés: 'Festés',
            Költöztetés: 'Költöztetés',
            Kőműves: 'Kőműves',
            Asztalos: 'Asztalos',
            Állat: 'Állat',
            Bevásárlás: 'Bevásárlás',
            Rendezvény: 'Rendezvény',
            Mező: 'Mezőgazd.',
            Autó: 'Autó'
        };

        let jobPickerDrillCat = null; // null = grid view, string = subcategory view

        function renderJobPickerList() {
            const list = document.getElementById('job-picker-list');
            if (!list) return;

            if (jobPickerDrillCat === null) {
                // === GRID VIEW: fő kategóriák 3 oszlopban ===
                const cats = Object.keys(jobCatalog);
                let gridHTML = '';

                // "Minden feladat" teljes szélességű első sor
                const isAllSel = selectedExactJob === 'all';
                gridHTML += `
                    <div class="job-picker-item" onclick="selectJobPickerItem('all', 'Minden feladat')" style="border-bottom:1.5px solid rgba(0,0,0,0.1); margin-bottom:4px;">
                        <span style="font-weight: 500;">Minden feladat</span>
                        ${isAllSel ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                    </div>
                    <div class="jp-cat-grid">
                `;

                cats.forEach(cat => {
                    const label = CAT_DISPLAY_NAMES[cat] || cat;
                    gridHTML += `<div class="jp-cat-card" onclick="jpDrillInto('${cat}')">${label}</div>`;
                });

                gridHTML += `</div>`;
                list.innerHTML = gridHTML;

            } else {
                // === DRILL VIEW: alpontok listája ===
                const cat = jobPickerDrillCat;
                const catLabel = CAT_DISPLAY_NAMES[cat] || cat;
                const items = jobCatalog[cat] || [];

                let html = `
                    <div class="jp-back-btn" onclick="jpGoBack()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        ${catLabel}
                    </div>
                `;

                items.forEach(item => {
                    const isSel = selectedExactJob === item.name;
                    const safeName = item.name.replace(/'/g, '&#39;');
                    html += '<div class="job-picker-item" onclick="selectJobPickerItem(this.dataset.v,this.dataset.v)" data-v="' + safeName + '">' +
                            '<span>' + item.name + '</span>' +
                            (isSel ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
                            '</div>';
                });

                list.innerHTML = html;
            }
        }

        function jpDrillInto(cat) {
            jobPickerDrillCat = cat;
            renderJobPickerList();
            document.getElementById('job-picker-list').scrollTop = 0;
        }

        function jpGoBack() {
            jobPickerDrillCat = null;
            renderJobPickerList();
        }

        // Kategória szűrés a diák listájában
        
        // filterWorkerJobs is now handled by the new JS engine below
function filterWorkerByExactJob(jobName) {
            const cards = document.querySelectorAll('#worker-jobs-list .job-card');
            cards.forEach(card => {
                const badge = card.getAttribute('data-category');
                const titleElement = card.querySelector('.job-title');
                if (!titleElement) return;
                const title = titleElement.innerText.toLowerCase();
                
                // Első lépésben megnézzük, hogy a fő kategóriához tartozik-e
                const matchesCat = (workerActiveCategory === 'all' || 
                                     badge === workerActiveCategory);
                                     
                if (!matchesCat) {
                    card.style.display = 'none';
                    return;
                }
                
                if (jobName === 'all') {
                    card.style.display = 'flex';
                } else {
                    // Kinyerjük a legelső kulcsszót és az alapján szűrünk
                    const coreWord = jobName.split(' ')[0].toLowerCase().replace(',', '').replace('(', '');
                    if (title.includes(coreWord)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        }

        // sortWorkerJobs stub removed — real implementation with localStorage persist below

        // Kijelentkezés a diák profil oldalról
        function logoutWorker() { logoutApp();
            localStorage.removeItem('melogo_worker_session');
            const loginScreen = document.getElementById('worker-login-screen');
            if (loginScreen) {
                // Frissítjük a gomb szövegét visszajelentkezési módra
                const btn = document.getElementById('worker-login-btn');
                if (btn) btn.innerHTML = 'Bejelentkezés <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
                loginScreen.classList.remove('hidden');
                navigateWorker(0);
            }
        }

        // Bejelentkezési funkciók (localStorage session)
        function loginWorker() {
            const email = document.getElementById('worker-email').value;
            const pw = document.getElementById('worker-pw').value;
            if (!email) { alert('Kérlek add meg az email címed!'); return; }
            // Szimuláció: bármely jelszó elfogadott (valós appban API hívás lenne)
            const session = { email: email, name: email.split('@')[0], role: 'worker', loginAt: Date.now() };
            localStorage.setItem('melogo_worker_session', JSON.stringify(session));
            const screen = document.getElementById('worker-login-screen');
            if (screen) screen.classList.add('hidden');
        }

        function loginWorkerFaceID() {
            // Face ID szimuláció: azonnal belép
            const session = { email: 'user@melogo.hu', name: 'Teszt Felhasználó', role: 'worker', loginAt: Date.now(), faceId: true };
            localStorage.setItem('melogo_worker_session', JSON.stringify(session));
            const screen = document.getElementById('worker-login-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.3s ease';
                screen.style.opacity = '0';
                setTimeout(() => { screen.classList.add('hidden'); screen.style.opacity = ''; }, 300);
            }
        }

        function loginEmployer() {
            const email = document.getElementById('employer-email').value;
            if (!email) { alert('Kérlek add meg az email címed!'); return; }
            const session = { email: email, name: 'Szabó János', role: 'employer', loginAt: Date.now() };
            localStorage.setItem('melogo_employer_session', JSON.stringify(session));
            const screen = document.getElementById('employer-login-screen');
            if (screen) screen.classList.add('hidden');
        }

        function loginEmployerFaceID() {
            const session = { email: 'janos@melogo.hu', name: 'Szabó János', role: 'employer', loginAt: Date.now(), faceId: true };
            localStorage.setItem('melogo_employer_session', JSON.stringify(session));
            const screen = document.getElementById('employer-login-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.3s ease';
                screen.style.opacity = '0';
                setTimeout(() => { screen.classList.add('hidden'); screen.style.opacity = ''; }, 300);
            }
        }


        // GPS hatókör szűrés a csúszkával
        function updateWorkerRadiusFilter(val) {
            document.getElementById('worker-radius-display').innerText = val + ' km';
            
            const cards = document.querySelectorAll('#worker-jobs-list .job-card');
            cards.forEach(card => {
                const dist = parseFloat(card.getAttribute('data-distance')) || 0;
                if (dist <= val) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.opacity = '0.3';
                    card.style.pointerEvents = 'none';
                }
            });
        }

        // Térképes kereső kategória szűrő gombjai
        function changeSearchMapFilter(cat) {
            const btns = document.querySelectorAll('.search-map-filter-btn');
            btns.forEach(b => b.classList.remove('active'));
            document.getElementById(`map-filter-${cat}`).classList.add('active');

            const pinKert = document.getElementById('pin-job-kert');
            const pinAuto = document.getElementById('pin-job-auto');
            const pinCustom = document.getElementById('pin-job-custom');

            document.getElementById('map-preview-card').style.display = 'none';

            if (cat === 'all') {
                pinKert.style.display = 'flex';
                pinAuto.style.display = 'flex';
                if (gameState.status !== 'Keresés' || pinCustom.getAttribute('data-active') === 'true') {
                    pinCustom.style.display = 'flex';
                }
            } else if (cat === 'Kert') {
                pinKert.style.display = 'flex';
                pinAuto.style.display = 'none';
                pinCustom.style.display = 'none';
            } else if (cat === 'Autó') {
                pinKert.style.display = 'none';
                pinAuto.style.display = 'flex';
                pinCustom.style.display = 'none';
            }
        }

        // Térkép pinre kattintás
        function clickMapPin(category, title, price, loc) {
            currentJobTitle = title;
            currentJobPrice = price;
            currentJobLoc = loc;

            document.getElementById('map-prev-title').innerText = title;
            document.getElementById('map-prev-price').innerText = price;
            document.getElementById('map-prev-loc').innerText = loc;

            document.getElementById('map-preview-card').style.display = 'block';
        }

        // Hirdető form főkategória választó (🌳 Kert, 🎨 Festés, 🚗 Autó, 🏠 Ház belseje)
        function selectEmployerFormCat(cat) {
            // Support both old cat-select-btn and new emp-cat-card
            document.querySelectorAll('.category-grid .cat-select-btn, .emp-cat-card').forEach(b => b.classList.remove('active'));
            const el = document.getElementById(`emp-cat-${cat}`);
            if (el) el.classList.add('active');

            // Feltöltjük a dropdown listát a főkategória specifikus elemeivel
            populateJobDropdown(cat);
        }

        // Dinamikusan feltölti a Munkatípus legördülő menüt a 20 predefiniált munka alapján
        function populateJobDropdown(cat) {
            const select = document.getElementById('emp-job-select');
            if (!select) return;
            select.innerHTML = ''; // kiürítünk

            const items = (typeof jobCatalog !== 'undefined' && jobCatalog[cat]) ? jobCatalog[cat] : [];
            items.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.name;
                opt.innerText = item.name + '  —  ' + item.price.toLocaleString('hu-HU') + ' Ft';
                select.appendChild(opt);
            });

            // Frissítjük a kategória első elemének ajánlott árára a formot
            if (items.length > 0) {
                updatePredefinedJobPrice(items[0].name);
                updateEmpPriceDisplay(items[0].price);
                const inp = document.getElementById('emp-price-input');
                if (inp) inp.value = items[0].price;
            }

            // ÚJ: szintválasztó frissítése
            updateTutorLevelSelect();
        }


        // Kijelölt pontos munka árához igazítjuk az intelligens ajánlást
        function updatePredefinedJobPrice(jobName) {
            // Megkeressük a katalógusban az árat
            let price = 8000;
            for (const category in jobCatalog) {
                const match = jobCatalog[category].find(j => j.name === jobName);
                if (match) {
                    price = match.price;
                    break;
                }
            }

            // Átírjuk a zöld árajánlat kártyát és a beviteli mező alapértelmezését
            document.getElementById('emp-price-input').value = price;
            document.getElementById('emp-recommended-label').innerText = `Ajánlott: ${price.toLocaleString('hu-HU')} Ft`;
        }

        // ÚJ: Oktatási szintek lekérése tantárgy alapján
        function getLevelsForSubject(subject) {
            const defaultLevels = ['Alsó tagozat', 'Felső tagozat', 'Középszint', 'Emelt szint', 'Egyetemi szint'];
            const scienceLevels = ['Felső tagozat', 'Középszint', 'Emelt szint', 'Egyetemi szint'];
            const geogrRomanceLevels = ['Felső tagozat', 'Középszint', 'Emelt szint'];
            const romanceLevels = ['Alsó tagozat', 'Felső tagozat', 'Középszint', 'Emelt szint'];
            const artMusicLevels = ['Kezdő', 'Középhaladó', 'Haladó'];
            
            if (subject === 'Kémia' || subject === 'Fizika' || subject === 'Biológia' || subject === 'Történelem' || subject === 'Programozás') {
                return scienceLevels;
            }
            if (subject === 'Földrajz') {
                return geogrRomanceLevels;
            }
            if (subject === 'Spanyol' || subject === 'Olasz') {
                return romanceLevels;
            }
            if (subject === 'Zene/Hangszer' || subject === 'Rajz/Vizuális') {
                return artMusicLevels;
            }
            return defaultLevels;
        }

        // ÚJ: Tutoring szint választó frissítése
        function updateTutorLevelSelect() {
            const section = document.getElementById('emp-tutor-level-section');
            const select = document.getElementById('emp-tutor-level-select');
            if (!section || !select) return;
            
            if (empActiveCat === 'Magántanár') {
                section.style.display = 'block';
                const subject = document.getElementById('emp-job-select').value;
                const levels = getLevelsForSubject(subject);
                
                select.innerHTML = '';
                levels.forEach(lvl => {
                    const opt = document.createElement('option');
                    opt.value = lvl;
                    opt.innerText = lvl;
                    select.appendChild(opt);
                });
            } else {
                section.style.display = 'none';
            }
        }

        // SZÖVEGES KERESÉS INTEGRÁCIÓJA
        function performTextSearch() {
            const query = document.getElementById('text-search-input').value.toLowerCase();
            const jobs = document.querySelectorAll('#worker-jobs-list .job-card');
            
            jobs.forEach(job => {
                const titleElement = job.querySelector('.job-title');
                if (!titleElement) return;
                const title = titleElement.innerText.toLowerCase();
                const metaElement = job.querySelector('.job-meta');
                const meta = metaElement ? metaElement.innerText.toLowerCase() : '';
                if (title.includes(query) || meta.includes(query)) {
                    job.style.display = 'flex';
                } else {
                    job.style.display = 'none';
                }
            });
        }

        function applyTextSearchTag(tagText) {
            document.getElementById('text-search-input').value = tagText;
            performTextSearch();
            navigateWorker(0);
        }

        // =======================================================
        // INTERAKTÍV SZIMULÁCIÓS FOLYAMATOK
        // =======================================================

        // A. MUNKÁLTATÓ FELAD EGY MUNKÁT
        async function employerPublishJob() {
            closeEmployerFormOverlay();
            const specificJob = document.getElementById('emp-job-select').value;
            const details = document.getElementById('emp-details').value || 'Alkalmi munka precízen elvégezve.';
            const county = document.getElementById('emp-county').value || 'Somogy';
            const city = document.getElementById('emp-city').value || 'Kaposvár';
            const street = document.getElementById('emp-street').value || 'Fő utca';
            const house = document.getElementById('emp-house').value || '1';
            const price = parseInt(document.getElementById('emp-price-input').value) || 8000;

            let activeCat = empActiveCat;
            let finalJobTitle = specificJob;
            if (activeCat === 'Magántanár') {
                const lvl = document.getElementById('emp-tutor-level-select').value;
                if (lvl) {
                    finalJobTitle = `${specificJob} (${lvl})`;
                }
            }

            // Beállítjuk az állapotot
            gameState.jobTitle = finalJobTitle;
            gameState.jobPrice = price;
            gameState.jobCounty = county;
            gameState.jobCity = city;
            gameState.jobStreet = street;
            gameState.jobHouse = house;
            gameState.jobDesc = details;
            gameState.jobDistance = 4.2;
            gameState.status = 'Keresés';

            // Allowed duplicate posts for testing
            const exists = localEmployerJobs.some(j => j.title === finalJobTitle && j.price === price);
            if (true) {
                const jobId = 'job_' + Date.now();
                localEmployerJobs.unshift({
                    id: jobId,
                    title: finalJobTitle,
                    details: details,
                    location: `${county}, ${city}, ${street} ${house}.`,
                    price: price,
                    status: 'Keresés',
                    category: activeCat,
                    datetime: document.getElementById('emp-datetime')?.value || 'Holnap, 14:00'
                });
                saveEmployerJobs();
                renderEmployerHome();

                // MENTÉS FIRESTORE-BA: Létrehozás
                if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                    try {
                        const _posterSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
                        const _posterName = _posterSession.name || window.firebaseAuth.currentUser.displayName || window.firebaseAuth.currentUser.email.split('@')[0];
                        
                        let jobLat = 47.4979; // Default Budapest
                        let jobLon = 19.0402;
                        if (window.userCoords && window.userCoords.lat) {
                            jobLat = window.userCoords.lat;
                            jobLon = window.userCoords.lon;
                        }
                        const hash = typeof geofire !== 'undefined' ? geofire.geohashForLocation([jobLat, jobLon]) : null;

                        const newDocRef = await window.firebaseAPI.addDoc(window.firebaseAPI.collection(window.firebaseDb, "jobs"), {
                            title: finalJobTitle,
                            details: details,
                            desc: details,
                            location: `${county}, ${city}, ${street} ${house}.`,
                            price: price,
                            category: activeCat,
                            status: 'Keresés',
                            urgent: document.getElementById('emp-urgent-job')?.checked || false,
                            datetime: document.getElementById('emp-datetime')?.value || 'Holnap, 14:00',
                            lat: jobLat,
                            lon: jobLon,
                            geohash: hash,
                            ownerEmail: window.firebaseAuth.currentUser.email,
                            ownerUid: window.firebaseAuth.currentUser.uid,
                            ownerName: _posterName,
                            createdAt: window.firebaseAPI.serverTimestamp()
                        });
                        console.log("Job successfully added to Firestore:", newDocRef.id);
                        
                        // Update the local id to match firestore id
                        const locJob = localEmployerJobs.find(j => j.id === jobId);
                        if (locJob) {
                            locJob.id = newDocRef.id;
                            saveEmployerJobs();
                        }
                    } catch (e) {
                        console.error("Firestore job add error:", e);
                    }
                }
            }

            // 1. Frissítjük a HIRDETŐ főoldalát
            const priceEl = document.getElementById('employer-job-list-price');
            if (priceEl) priceEl.innerText = price.toLocaleString('hu-HU') + ' Ft';
            const statusEl = document.getElementById('employer-job-list-status');
            if (statusEl) {
                statusEl.innerText = 'Állapot: Keresés';
                statusEl.style.color = 'var(--color-blue-uber)';
            }

            // 2. FRISSÍTJÜK A DIÁK LISTÁJÁT (Dinamikus kártyagenerálás a 20 munka alapján!)
            const workerJobsList = document.getElementById('worker-jobs-list');
            
            let iconText = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/></svg>`;
            let catClass = 'cat-kert';
            if (activeCat === 'Festés') { 
                iconText = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.52 22 22 17.52 22 12C22 5.5 16.5 2 12 2C6.5 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1" fill="currentColor"/><circle cx="10.5" cy="16.5" r="1" fill="currentColor"/></svg>`; 
                catClass = 'cat-festes'; 
            }
            else if (activeCat === 'Autó') { 
                iconText = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.2-1.4.7L3 11c-.6.8-1 1.8-1 2.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M7 17h10"/></svg>`; 
                catClass = 'cat-auto'; 
            }
            else if (activeCat === 'Ház') { 
                iconText = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="12" width="6" height="5" rx="1"/></svg>`; 
                catClass = 'cat-hazbelso'; 
            }

            const newJobCard = document.createElement('div');
            newJobCard.className = 'job-card';
            newJobCard.setAttribute('data-category', activeCat === 'Ház' ? 'Ház belseje' : activeCat);
            newJobCard.setAttribute('data-distance', '4.2');
            newJobCard.id = 'job-custom-new';
            newJobCard.onclick = () => openWorkerJobDetail(specificJob, price.toLocaleString('hu-HU') + ' Ft', `${county}, ${city}`, `📍 ${street} ${house}.`, 4.2, details);
            newJobCard.innerHTML = `
                    <div class="job-card-header" style="margin-bottom:8px;">
                        <div style="flex:1;">
                            <div class="job-title">${specificJob}</div>
                            <div style="font-size:12px; color:var(--color-text-light); margin-top:2px;">${currentUser ? currentUser.name : "Diák"}</div>
                        </div>
                        <div class="job-price">${price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                    <div class="job-card-badges">
                        <span class="job-badge-cat">${activeCat}</span>
                    </div>
                    <div class="job-meta" style="margin-bottom:0;">
                        <div class="job-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span class="job-distance-text">4.2</span> km
                        </div>
                        <div class="job-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            5 perce adták fel
                        </div>
                        <div class="job-meta-item" style="color:var(--color-text-light); font-size:11px;">
                            📍 ${street} ${house}.
                        </div>
                    </div>
            `;
            workerJobsList.insertBefore(newJobCard, workerJobsList.firstChild);

            // 3. MEGJELENÍTJÜK AZ ÚJ PIN-T A TÉRKÉPEN
            const customPin = document.getElementById('pin-job-custom');
            customPin.style.display = 'flex';
            customPin.setAttribute('data-active', 'true');
            customPin.innerHTML = iconText;
            customPin.className = `search-pin ${catClass}`;
            customPin.onclick = () => clickMapPin(activeCat, specificJob, price.toLocaleString('hu-HU') + ' Ft', `📍 ${street} ${house}.`);

            document.getElementById('employer-success-title').innerText = 'Sikeres feladás! <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
            document.getElementById('employer-success-desc').innerText = `A(z) "${specificJob}" munka felkerült a diákok listájára és a GPS térképre!`;
            document.getElementById('employer-success').classList.add('active');
        }

        function closeEmployerSuccess() {
            document.getElementById('employer-success').classList.remove('active');
            navigateEmployer(0);
        }

        // B. DIÁK MEGNYITJA A RÉSZLETEKET
        function openWorkerJobDetail(title, price, loc, street, distance, customDesc) {
            // Update gameState details for the current active job context
            gameState.jobTitle = title || '';
            const numericPrice = parseInt(String(price).replace(/[^0-9]/g, '')) || 10000;
            gameState.jobPrice = numericPrice;
            gameState.jobDesc = customDesc || '';
            gameState.jobStreet = street || loc || '';
            gameState.jobHouse = '';
            gameState.jobDistance = distance || 0.4;
            
            // Check if already applied to this specific job
            const app = localWorkerApplications.find(a => a.title === title);
            if (app) {
                gameState.applied = true;
                if (app.status === 'Függőben') {
                    gameState.status = 'Keresés';
                } else if (app.status === 'Aktív') {
                    gameState.status = 'Fizetve';
                } else if (app.status === 'Értékelésre vár') {
                    gameState.status = 'Befejezve';
                } else if (app.status === 'Befejezett') {
                    gameState.status = 'Értékelve';
                } else {
                    gameState.status = app.status;
                }
            } else {
                gameState.applied = false;
                gameState.status = 'Keresés';
            }

            document.getElementById('worker-job-detail-title').innerText = title || gameState.jobTitle;
            document.getElementById('worker-job-detail-price').innerText = numericPrice.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('worker-job-detail-desc').innerText = customDesc || gameState.jobDesc;
            document.getElementById('worker-job-detail-loc').innerText = street || `${gameState.jobStreet} (${distance || gameState.jobDistance} km)`;
            
            // Ha a diák megnyitja a részleteket/csevegést, eltüntetjük a jelvényt
            const msgBadge = document.getElementById('worker-msg-badge');
            if (msgBadge) msgBadge.style.display = 'none';

            updateWorkerStatusUI();
            document.getElementById('worker-action-overlay').classList.add('active');
        }

        function closeWorkerJobDetail() {
            document.getElementById('worker-action-overlay').classList.remove('active');
        }

        function closeAllActionOverlays() {
            document.querySelectorAll('.action-overlay.active, .settings-overlay.active').forEach(el => {
                el.classList.remove('active');
            });
        }

        // ÚJ: DIÁK MEGNYITJA AZ ÜZENETEK MENÜBŐL A CSEVEGÉST
        function openWorkerChatRoom() {
            document.getElementById('worker-job-detail-title').innerText = gameState.jobTitle;
            document.getElementById('worker-job-detail-price').innerText = gameState.jobPrice.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('worker-job-detail-desc').innerText = gameState.jobDesc;
            document.getElementById('worker-job-detail-loc').innerText = `📍 ${gameState.jobStreet} ${gameState.jobHouse} (${gameState.jobDistance} km)`;

            // Ha megnyitja, eltüntetjük a jelvényt
            const msgBadge = document.getElementById('worker-msg-badge');
            if (msgBadge) msgBadge.style.display = 'none';

            updateWorkerStatusUI();
            document.getElementById('worker-action-overlay').classList.add('active');
        }

        // Csevegő buborékok kirajzolása a diák oldalán a hirdetés részleteinél
        function renderWorkerChatMessages() {
            const chatBox = document.getElementById('worker-chat-messages');
            if (!gameState.applied) {
                chatBox.style.display = 'none';
                return;
            }
            
            chatBox.style.display = 'flex';
            
            let html = `
                <div class="chat-date-separator" style="font-size: 12px; font-weight: 500; color: var(--color-text); text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">MA</div>
                <div class="chat-bubble outgoing">
                    Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?
                    <span class="chat-bubble-time">14:00</span>
                </div>
            `;
            
            const chatObj = localChats.find(c => c.jobTitle === gameState.jobTitle);
            if (chatObj && chatObj.messages) {
                chatObj.messages.forEach(m => {
                    if (m.type === 'system') return;
                    const isMine = (m.from === 'worker');
                    if (isMine) {
                        html += `
                            <div style="max-width:80%; padding:10px 14px; border-radius: 18px 18px 4px 18px; background:var(--color-navy); color:#fff; font-size:14px; align-self:flex-end; margin-top: 4px;">
                                ${m.text}
                                <div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">${m.time || ''}</div>
                            </div>
                        `;
                    } else {
                        html += `
                            <div style="max-width:80%; padding:10px 14px; border-radius: 18px 18px 18px 4px; background:#F3F4F6; color:var(--color-text); font-size:14px; align-self:flex-start; margin-top: 4px; border: 1px solid var(--color-border);">
                                ${m.text}
                                <div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:left;">${m.time || ''}</div>
                            </div>
                        `;
                    }
                });
            }
            
            if (gameState.status !== 'Keresés') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            ✨ A megbízó elfogadta a jelentkezést
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Fizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            📅 Kérlek, érkezz pontosan a megbeszélt időpontra!
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Befejezve' || gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            📸 Munka befejezve, ellenőrzésre vár
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Értékelve' || gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            ✅ Munka lezárva és értékelve
                        </span>
                    </div>
                `;
            }
            
            chatBox.innerHTML = html;
            
            // Görgetés a legalsó üzenethez
            setTimeout(() => {
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 50);
        }

        function sendWorkerChatMessageNew() {
            const input = document.getElementById('worker-chat-reply-input');
            const text = input.value.trim();
            if (!text) return;

            const now = new Date();
            const t = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

            // Persist to Firebase and localChats
            const chat = localChats.find(c => c.jobTitle === gameState.jobTitle);
            if (chat) {
                if (!chat.messages) chat.messages = [];
                const senderRole = 'worker';
                const senderId = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : senderRole;
                chat.messages.push({ from: senderRole, senderId: senderId, text: text, time: t });
                chat.lastMsg = text;
                chat.time = 'Most';
                chat.updatedAt = Date.now();

                if (chat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                    window.firebaseAPI.addDoc(
                        window.firebaseAPI.collection(window.firebaseDb, "chats", chat.id, "messages"),
                        { senderId: senderId, text: text, timestamp: window.firebaseAPI.serverTimestamp(), type: 'user' }
                    ).catch(e => console.error("Firestore message add error:", e));
                    
                    window.firebaseAPI.updateDoc(
                        window.firebaseAPI.doc(window.firebaseDb, "chats", chat.id),
                        { lastMsg: text, time: 'Most', updatedAt: window.firebaseAPI.serverTimestamp() }
                    ).catch(e => console.error("Firestore chat lastMsg update error:", e));
                }
                saveLocalChats();
                if (typeof renderChatList === 'function') renderChatList();
            }

            input.value = '';
            
            // Re-render to show the new message and maintain system bubbles
            renderWorkerChatMessages();
            const msgContainer = document.getElementById('worker-chat-messages');
            if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
        }

        function updateWorkerStatusUI() {
            const container = document.getElementById('worker-status-section');
            const chatBox = document.getElementById('worker-chat-messages');
            const chatInputBar = document.getElementById('worker-chat-input-bar');
            
            if (gameState.applied) {
                chatBox.style.display = 'flex';
                if (chatInputBar) chatInputBar.style.display = 'flex';
                renderWorkerChatMessages();
            } else {
                chatBox.style.display = 'none';
                if (chatInputBar) chatInputBar.style.display = 'none';
            }
            
            if (!gameState.applied) {
                container.innerHTML = `
                    <button id="action-apply-btn" class="emp-submit-btn" style="margin-top: 16px;" onclick="workerApplyToJob()">
                        Jelentkezés a munkára <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                `;
            } else if (gameState.status === 'Keresés') {
                container.innerHTML = `
                    <div style="background-color: #f8fafc; border:1px solid #e2e8f0; color: var(--color-text-muted); padding: 12px; border-radius: 8px; font-size: 11px; text-align:center; font-weight: 400;">
                        ⌛ Jelentkezés elküldve. Várakozás a Munkáltató válaszára és a letét zárolására...
                    </div>
                `;
            } else if (gameState.status === 'Fizetve') {
                container.innerHTML = `
                    <div style="background-color: #eff6ff; color: #1d4ed8; padding: 12px; border-radius: 8px; font-size: 11px; font-weight: 400; text-align:center;">
                        🔒 A megbízó elfogadta a jelentkezést. Megkezdheted a munkát!
                    </div>
                    <button class="btn" style="background-color: var(--color-green);" onclick="workerSubmitWorkPhoto()">
                        Kép feltöltése & AI Ellenőrzés 📸
                    </button>
                `;
            } else if (gameState.status === 'Befejezve') {
                container.innerHTML = `
                    <div style="background-color: #f0fdf4; color: #166534; padding: 12px; border-radius: 8px; font-size: 11px; font-weight: 400; text-align:center;">
                        ⌛ Fotó feltöltve! A Gemini AI hitelesítette. Várakozás a Munkáltató jóváhagyására.
                    </div>
                `;
            } else if (gameState.status === 'Értékelve' || gameState.status === 'Kifizetve') {
                container.innerHTML = `
                    <div style="background-color: #f0fdf4; color: #166534; padding: 16px; border-radius: 8px; font-size: 12px; font-weight: 500; text-align:center; ">
                        🎉 A munka lezárult és értékelve lett!
                    </div>
                `;
            }
        }

        // C. DIÁK JELENTKEZIK A MUNKÁRA
        async function workerApplyToJob() {
            gameState.status = 'Keresés';
            gameState.applied = true;

            const matchedJob = mockJobs.find(j => j.title === gameState.jobTitle);

            if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
                alert('K�rj�k jelentkezz be a jelentkez�shez!');
                gameState.applied = false;
                gameState.status = '';
                return;
            }
            if (!matchedJob || !matchedJob.ownerUid) {
                alert('Hiba: a munk�ltat� nem tal�lhat�.');
                gameState.applied = false;
                gameState.status = '';
                return;
            }

            const employerEmail = matchedJob.ownerEmail || 'ismeretlen@employer.hu';
            const employerId = matchedJob.ownerUid;
            const workerEmail = window.firebaseAuth.currentUser.email;
            const workerId = window.firebaseAuth.currentUser.uid;

            // Check for duplicate application
            try {
                if (window.firebaseAPI && window.firebaseDb) {
                    const appsRef = window.firebaseAPI.collection(window.firebaseDb, 'applications');
                    const q = window.firebaseAPI.query(appsRef, 
                        window.firebaseAPI.where('jobId', '==', matchedJob.id || ''),
                        window.firebaseAPI.where('workerUid', '==', workerId)
                    );
                    const snap = await window.firebaseAPI.getDocs(q);
                    if (!snap.empty) {
                        alert('M�r jelentkezt�l erre a munk�ra!');
                        gameState.applied = false;
                        gameState.status = '';
                        return;
                    }
                }
            } catch(e) { console.warn('Duplicate check error', e); }

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

            // Check if chat already exists
            let existingChatId = null;
            if (window.firebaseAPI && window.firebaseDb && jobId && workerId) {
                try {
                    const qChats = window.firebaseAPI.query(
                        window.firebaseAPI.collection(window.firebaseDb, "chats"),
                        window.firebaseAPI.where("jobId", "==", jobId),
                        window.firebaseAPI.where("workerId", "==", workerId)
                    );
                    const snapChats = await window.firebaseAPI.getDocs(qChats);
                    if (!snapChats.empty) existingChatId = snapChats.docs[0].id;
                } catch(e) { console.warn("Chat check error", e); }
            }

            let chatDocId = existingChatId || ('chat_' + Date.now());
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

            if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                try {
                    if (existingChatId) {
                        await window.firebaseAPI.updateDoc(
                            window.firebaseAPI.doc(window.firebaseDb, "chats", chatDocId),
                            { status: 'pending', lastMsg: chatData.lastMsg, time: 'Most', updatedAt: window.firebaseAPI.serverTimestamp() }
                        );
                    } else {
                        const chatRef = await window.firebaseAPI.addDoc(
                            window.firebaseAPI.collection(window.firebaseDb, "chats"),
                            { ...chatData, createdAt: window.firebaseAPI.serverTimestamp(), updatedAt: window.firebaseAPI.serverTimestamp(), workerLastRead: window.firebaseAPI.serverTimestamp(), employerLastRead: window.firebaseAPI.serverTimestamp() }
                        );
                        chatDocId = chatRef.id;
                    }
                    chatData.id = chatDocId;
                    chatData.isFirestore = true;

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
            renderChatList();

            // Új jelentkezés elmentése a követőrendszerbe
            const newApp = {
                id: 'app_' + Date.now(),
                title: gameState.jobTitle || 'Fűnyírás',
                price: gameState.jobPrice || 12000,
                status: 'Függőben',
                date: new Date().toLocaleDateString('hu-HU'),
                workerEmail: workerEmail,
                employerEmail: employerEmail,
                workerUid: workerId,
                employerUid: employerId,
                jobId: jobId,
                workerName: workerName,
                createdAt: Date.now()
            };
            localWorkerApplications.unshift(newApp);
            // Save to localStorage for offline access
            try { localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications)); } catch(e) {}
            // Write to Firestore directly (with proper UID fields matching security rules)
            if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                try {
                    await window.firebaseAPI.addDoc(
                        window.firebaseAPI.collection(window.firebaseDb, 'applications'),
                        { ...newApp, createdAt: window.firebaseAPI.serverTimestamp() }
                    );
                    console.log('[Apply] Application saved to Firestore');
                } catch(e) {
                    console.warn('[Apply] Firestore application save failed, kept locally:', e);
                }
            }
            renderWorkerApplications();

            // Removed client-side localEmployerJobs cache modification here to avoid G-1 bug
            // Job status is now tracked via Firestore applications or mock tracking securely

            // Stays in worker view as a real user would
            
            showGreenBanner('Sikeres jelentkezés!');
            updateWorkerStatusUI();
        }

        function closeWorkerSuccess() {
            document.getElementById('worker-success').classList.remove('active');
            closeWorkerJobDetail();
        }

        // D. HIRDETŐ MEGNYITJA A CHATET
        function openEmployerChatRoom() {
            const workerName = currentUser ? currentUser.name : "Diák";
            let imgHtml = `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" style="width: 30px; height: 30px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.3);" alt="Avatar">`;
            if (window.avatarCache && window.avatarCache[workerName]) {
                const photoURL = window.avatarCache[workerName];
                if (photoURL.startsWith('http') || photoURL.startsWith('data:')) {
                    imgHtml = `<img src="${photoURL}" style="width: 30px; height: 30px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.3);" alt="Avatar">`;
                } else {
                    imgHtml = `<div style="width:30px; height:30px; border-radius:50%; background:${getAvatarColor(workerName)}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight: 500; border:1px solid rgba(255,255,255,0.3);">${photoURL}</div>`;
                }
            }
            document.getElementById('employer-action-title').innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="openWorkerProfile('${workerName}')">
                    ${imgHtml}
                    <div style="text-align:left;">
                        <div style="font-size:14px; font-weight: 500; color:#fff; display:flex; align-items:center; gap:4px; line-height:1.2;">
                            ${workerName}
                            <svg class="verified-badge-svg" style="width: 13px; height: 13px; fill: #007aff; display: inline-block;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        </div>
                        <div style="font-size:10px; color:#A1A1AA; display:flex; align-items:center; gap:2px; margin-top:1px; line-height:1;">
                            <span>★ 4.9</span>
                            <span>· Megbízható</span>
                        </div>
                    </div>
                </div>
            `;

            // Dynamically update the Pinned Info Bar inside the Chat Overlay
            const pinnedTitle = document.getElementById('employer-chat-pinned-title');
            const pinnedPrice = document.getElementById('employer-chat-pinned-price');
            const pinnedDesc = document.getElementById('employer-chat-pinned-desc');
            if (pinnedTitle) pinnedTitle.innerText = gameState.jobTitle || 'Fűnyírás';
            if (pinnedPrice) pinnedPrice.innerText = (gameState.jobPrice || 12000).toLocaleString('hu-HU') + ' Ft';
            if (pinnedDesc) pinnedDesc.innerText = gameState.jobDesc || 'Alkalmi munka precízen elvégezve.';

            const subtitleEl = document.getElementById('employer-chat-job-subtitle');
            if (subtitleEl) subtitleEl.innerText = gameState.jobTitle || 'Fűnyírás';

            if (subtitleEl) subtitleEl.innerText = gameState.jobTitle || 'Fűnyírás';

            const chatMessages = document.getElementById('employer-chat-messages');
            
            let html = `
                <div class="chat-date-separator" style="font-size: 12px; font-weight: 500; color: var(--color-text); text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">MA</div>
                <div class="chat-bubble incoming">
                    Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?
                    <span class="chat-bubble-time">14:00</span>
                </div>
            `;

            if (gameState.status !== 'Keresés') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            ✨ Elfogadtad a jelentkezést
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Fizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            📅 Munkavállaló értesítve a kezdésről.
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Befejezve' || gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            📸 Munka befejezve, ellenőrzésre vár
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Értékelve' || gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: var(--color-surface); color: var(--color-text); padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 400; border: 1px solid #D1D5DB;">
                            ✅ Munka lezárva és értékelve
                        </span>
                    </div>
                `;
            }

            chatMessages.innerHTML = html;

            const closeBar = document.getElementById('employer-close-job-bar');
            if (closeBar && gameState.applied && gameState.status !== 'Kifizetve') {
                closeBar.style.display = 'block';
            } else if (closeBar) {
                closeBar.style.display = 'none';
            }

            updateEmployerActionFooter();
            document.getElementById('employer-action-overlay').classList.add('active');
            
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 50);
        }

        function closeEmployerJobDetail() {
            document.getElementById('employer-action-overlay').classList.remove('active');
        }

        function updateEmployerActionFooter() {
            const footer = document.getElementById('employer-action-footer');
            if (gameState.status === 'Keresés') {
                footer.innerHTML = `
                    <div style="background: var(--color-surface); border-radius: 16px; padding: 16px;  border: none; display: flex; flex-direction: column; gap: 12px;">
                        <button class="btn" style="height: 52px; border-radius: 16px; background: var(--color-text); color: #fff; border: none; font-weight: 500; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;  transition: transform 0.1s;" onclick="employerLockEscrow()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Munkadíj zárolása letétbe (${(gameState.jobPrice || 12000).toLocaleString('hu-HU')} Ft)
                        </button>
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center; opacity: 0.8;">
                            
                            <span style="font-size: 11px; color: var(--color-text); font-weight: 300;">
                                Biztonságos Stripe™ letétkezelés.
                            </span>
                        </div>
                    </div>
                `;
            } else if (gameState.status === 'Fizetve') {
                footer.innerHTML = `
                    <div style="background: #EFF6FF; border-radius: 16px; padding: 18px; border: none; display: flex; align-items: center; gap: 14px; ">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--color-text); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            <div style="font-size: 14px; font-weight: 500; color: #1E40AF;">Jelentkezés elfogadva</div>
                            <div style="font-size: 11px; color: var(--color-text); font-weight: 300;">A diák dolgozik. Várakozás a munka befejezésére...</div>
                        </div>
                    </div>
                `;
            } else if (gameState.status === 'Befejezve') {
                footer.innerHTML = `
                    <div style="background: var(--color-surface); border-radius: 16px; padding: 16px;  border: none; display: flex; flex-direction: column; gap: 12px;">
                        <button class="btn" style="height: 52px; border-radius: 16px; background: var(--color-text); color: #fff; border: none; font-weight: 500; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;  transition: transform 0.1s;" onclick="employerApproveAndRelease()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Munka jóváhagyása
                        </button>
                        <div style="display: flex; align-items: center; gap: 6px; justify-content: center; color: #166534; font-weight: 400; font-size: 11px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            Gemini AI: Munka elvégezve! Indítsd el a jóváhagyást.
                        </div>
                    </div>
                `;
            } else if (gameState.status === 'Értékelve' || gameState.status === 'Kifizetve') {
                footer.innerHTML = `
                    <div style="background: #F0FDF4; border-radius: 16px; padding: 18px; border: none; display: flex; align-items: center; gap: 14px; ">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--color-text); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            <div style="font-size: 14px; font-weight: 500; color: #166534;">Munka lezárva!</div>
                            <div style="font-size: 11px; color: #15803D; font-weight: 300;">Értékelve. Köszönjük!</div>
                        </div>
                    </div>
                `;
            }
        }

        // E. HIRDETŐ ZÁROLJA A LETÉTET
        function employerLockEscrow() {
            gameState.status = 'Fizetve';
            
            // Értesítési jelvény a diáknak, hogy zárolva van a díja és kezdhet dolgozni
            document.getElementById('worker-msg-badge').innerText = '1';
            document.getElementById('worker-msg-badge').style.display = 'flex';

            updateEmployerActionFooter();
            document.getElementById('employer-job-list-status').innerText = 'Állapot: Zárolva (Dolgozik)';
            document.getElementById('employer-job-list-status').style.color = 'var(--color-text)';

            document.getElementById('employer-success-title').innerText = 'Letét zárolva!';
            document.getElementById('employer-success-desc').innerText = 'A munkadíj megegyezés szerint. A diák értesítést kapott a munkakezdésről!';
            document.getElementById('employer-success').classList.add('active');

            updateWorkerStatusUI();
            
            if (document.getElementById('employer-action-overlay').classList.contains('active')) {
                openEmployerChatRoom();
            }
        }

        // F. DIÁK FELTÖLTI A FOTÓT & AI ELLENŐRZI
        function workerSubmitWorkPhoto() {
            gameState.status = 'Befejezve';
            
            // ÚJ: Értesítési jelvény a munkáltatónak, hogy a diák feltöltötte az elvégzett munka képét
            document.getElementById('employer-msg-badge').innerText = '1';
            document.getElementById('employer-msg-badge').style.display = 'flex';

            updateWorkerStatusUI();

            document.getElementById('worker-success-title').innerText = 'AI Képellenőrzés sikeres!';
            document.getElementById('worker-success-desc').innerText = `A Gemini 1.5 Flash AI megvizsgálta a fotót: "A(z) '${gameState.jobTitle}' munka elvégzésre került. A fotó hiteles." `;
            document.getElementById('worker-success').classList.add('active');

            if (document.getElementById('employer-action-overlay').classList.contains('active')) {
                openEmployerChatRoom();
            } else {
                updateEmployerActionFooter();
            }
        }

        // G. MUNKÁLTATÓ JÓVÁHAGYJA ÉS KIFIZETI A DIÁKOT
        function employerApproveAndRelease() {
            gameState.status = 'Kifizetve';
            
            // ÚJ: Értesítési jelvény a diáknak, hogy megérkezett a fizetése
            document.getElementById('worker-msg-badge').innerText = '1';
            document.getElementById('worker-msg-badge').style.display = 'flex';

            updateEmployerActionFooter();
            document.getElementById('employer-job-list-status').innerText = 'Állapot: Értékelve';
            document.getElementById('employer-job-list-status').style.color = 'var(--color-green)';

            document.getElementById('employer-success-title').innerText = 'Sikeres értékelés! ⭐';
            document.getElementById('employer-success-desc').innerText = 'A munka sikeresen lezárult. Köszönjük, hogy a MelóGo-t választottad a megbízáshoz!';
            document.getElementById('employer-success').classList.add('active');

            document.getElementById('worker-success-title').innerText = 'A munkát értékelték! ⭐';
            document.getElementById('worker-success-desc').innerText = `A Munkáltató jóváhagyta és értékelte a munkádat!`;
            document.getElementById('worker-success').classList.add('active');
            
            updateWorkerStatusUI();
            
            if (document.getElementById('employer-action-overlay').classList.contains('active')) {
                openEmployerChatRoom();
            }
        }

        // ================================================
        // SETTINGS SCREEN FUNCTIONS
        // ================================================
        const SKILL_CATEGORIES = {
            'Kertészet': ['Fűnyírás', 'Gyomirtás, kapálás', 'Levelek gereblyézése', 'Sövény nyírása', 'Virágágyás gondozása', 'Terasz söprése', 'Hólapátolás', 'Kerti bútor összerakása', 'Öntözőrendszer felszerelése', 'Fák metszése', 'Komposztálás segítése'],
            'Magántanár': ['Angol', 'Magyar', 'Matek', 'Kémia', 'Fizika', 'Biológia', 'Történelem', 'Földrajz', 'Német', 'Francia', 'Spanyol', 'Olasz', 'Informatika', 'Programozás', 'Zene/Hangszer', 'Rajz/Vizuális'],
            'Takarítás': ['Lakástakarítás', 'Mély takarítás', 'Iroda/üzlethelyiség', 'Építés utáni', 'Fürdőszoba és konyha', 'Ablakok tisztítása', 'Lomtalanítás', 'Pince/garázs kitakarítása'],
            'Bébiszitter / Gyerekfelügyelet': ['Bébiszitterkedés', 'Iskolából hazakísérés', 'Délutáni felügyelet', 'Hétvégi felügyelet', 'Játszótéri kísérés', 'Házi feladat segítés'],
            'Festés & Karbantartás': ['Kerítés festése', 'Kapu/pad/bútor festése', 'Falak festése', 'Foltok lefestése', 'Alapozó festés', 'Homlokzat festés', 'Kisebb javítások'],
            'Költöztetés & Cipelés': ['Bútor cipelés', 'Dobozok pakolása', 'Furgon rakodás', 'Lépcsőn cipelés', 'Bútor szétszerelése', 'Csomagküldés segítése'],
            'Kőműves segédmunka': ['Anyagcipelés', 'Cementkeverés', 'Törmelék takarítás', 'Alapozó segítség', 'Burkolatrakás segítése', 'Állványozás segítése'],
            'Asztalos / Összeszerelés': ['IKEA összeszerelés', 'Kerti bútor', 'Faipari segédmunka', 'Polcok felszerelése', 'Ajtópánt csere'],
            'Állat & Kisállat': ['Kutyasétáltatás', 'Kisállat gondozás', 'Macska felügyelet', 'Állatorvoshoz kísérés', 'Akváriumgondozás'],
            'Bevásárlás & Futár': ['Bevásárlás', 'Csomagok hordása', 'Ügyintézés', 'Gyógyszer kiváltás', 'Ebéd rendelés összegyűjtése'],
            'Rendezvény': ['Felállítás', 'Kiszolgálás, tálalás', 'Lerendezés, takarítás', 'Beléptetés', 'Dekoráció', 'Hangosítás/tech segítség'],
            'Mezőgazdaság': ['Gyümölcsszedés', 'Aratás, betakarítás', 'Mezei segédmunka', 'Zöldség válogatás', 'Öntözés', 'Állatok gondozása (tanyán)'],
            'Autó': ['Autómosás (kézi)', 'Belső porszívózás', 'Keréktárolás segítése', 'Autó megvárása']
        };

        let selectedSkills = new Set(['Kertészet', 'Autómosás', 'Takarítás']);

        
        function animateProfile() {
            // Count up
            const amountEl = document.getElementById('profile-earned-amount');
            if (amountEl) {
                let current = 0;
                const target = 32000;
                const interval = setInterval(() => {
                    current += 1000;
                    if (current >= target) { current = target; clearInterval(interval); }
                    amountEl.innerText = current.toLocaleString('hu-HU') + ' Ft';
                }, 15);
            }
            // Stagger stars
            const stars = document.querySelectorAll('.profile-star');
            stars.forEach((s, i) => {
                s.style.opacity = '0';
                s.style.transform = 'scale(0.5)';
                s.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                setTimeout(() => {
                    s.style.opacity = '1';
                    s.style.transform = 'scale(1)';
                }, 300 + (i * 80));
            });
        }

        function handleSettingsAddressInputNew(val) {
            const suggList = document.getElementById('settings-address-suggestions');
            if (!val || val.length < 2) {
                suggList.style.display = 'none';
                return;
            }
            suggList.innerHTML = '';
            
            const matches = (window.MOCK_ADDRESSES || []).filter(a => a.toLowerCase().includes(val.toLowerCase()));
            if (matches.length > 0) {
                matches.forEach(m => {
                    const div = document.createElement('div');
                    div.style.cssText = 'padding:12px 16px; font-size:14px; font-weight: 300; color:var(--color-text); cursor:pointer; border-bottom:1px solid var(--color-border);';
                    div.innerText = m;
                    div.onclick = async function() {
                        document.getElementById('settings-address-input').value = m;
                        suggList.style.display = 'none';
                        
                        // Save immediately
                        let userData = JSON.parse(localStorage.getItem('melogo_user_data')) || {};
                        userData.address = m;
                        localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                        
                        document.getElementById('settings-current-address-display').innerText = m;
                        
                        if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                            try {
                                const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", window.firebaseAuth.currentUser.uid);
                                await window.firebaseAPI.updateDoc(userRef, { address: m });
                            } catch(e) {
                                console.error("Error saving address", e);
                            }
                        }
                        
                        setTimeout(() => {
                            document.getElementById('settings-address-picker').style.display = 'none';
                        }, 200);
                    };
                    suggList.appendChild(div);
                });
                suggList.style.display = 'block';
            } else {
                suggList.style.display = 'none';
            }
        }

let settingsConfirmedAddress = null;
        function handleSettingsAddressInput(val) {
            settingsConfirmedAddress = val; // Set immediately to allow custom typing!
            const suggList = document.getElementById('settings-address-suggestions');
            if (!val || val.length < 2) {
                suggList.style.display = 'none';
                return;
            }
            suggList.innerHTML = '';
            
            const matches = (window.MOCK_ADDRESSES || []).filter(a => a.toLowerCase().includes(val.toLowerCase()));
            if (matches.length > 0) {
                matches.forEach(m => {
                    const div = document.createElement('div');
                    div.style.cssText = 'padding:12px 16px; font-size:14px; font-weight: 300; color:var(--color-text); cursor:pointer; border-bottom:1px solid var(--color-border);';
                    div.innerText = m;
                    div.onclick = function() {
                        document.getElementById('settings-address').value = m;
                        settingsConfirmedAddress = m;
                        suggList.style.display = 'none';
                    };
                    suggList.appendChild(div);
                });
                suggList.style.display = 'block';
            } else {
                suggList.style.display = 'none';
            }
        }

        async function openSettings() {
            const overlay = document.getElementById('worker-settings');
            overlay.classList.add('open');
            renderSkillSelector();
            
            // Load Bio from user data
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const bioField = document.getElementById('settings-bio');
            const addrDisplay = document.getElementById('settings-current-address-display');
            if (addrDisplay) {
                addrDisplay.innerText = userData.address || 'Nincs megadva';
            }
            if (bioField && userData.bio) {
                bioField.value = userData.bio;
            }

            const addrContainer = document.getElementById('settings-address-container');
            if (activeRole === 'employer') {
                if (addrContainer) addrContainer.style.display = 'block';
                if (userData.address) {
                    settingsConfirmedAddress = userData.address;
                    const parts = userData.address.split(',');
                    if (parts.length >= 2) {
                        const zipCity = parts[0].trim().split(' ');
                        if (document.getElementById('set-zip')) document.getElementById('set-zip').value = zipCity[0] || '';
                        if (document.getElementById('set-city')) document.getElementById('set-city').value = zipCity.slice(1).join(' ') || '';
                        
                        const streetHouseApt = parts[1].trim().split(' ');
                        const houseApt = streetHouseApt.pop();
                        if (document.getElementById('set-street')) document.getElementById('set-street').value = streetHouseApt.join(' ') || '';
                        if (document.getElementById('set-house')) document.getElementById('set-house').value = houseApt || '';
                    } else {
                        if (document.getElementById('set-city')) document.getElementById('set-city').value = userData.address;
                    }
                }
            } else {
                if (addrContainer) addrContainer.style.display = 'none';
            }

            // Sync from Firestore if possible
            if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                try {
                    const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", window.firebaseAuth.currentUser.uid);
                    const userSnap = await window.firebaseAPI.getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        let updated = false;
                        if (data.bio && bioField) {
                            bioField.value = data.bio;
                            userData.bio = data.bio;
                            updated = true;
                        }
                        if (data.address && addrField && activeRole === 'employer') {
                            addrField.value = data.address;
                            settingsConfirmedAddress = data.address;
                            userData.address = data.address;
                            updated = true;
                        }
                        if (updated) {
                            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                        }
                    }
                } catch(e) {
                    console.error("Firestore settings load error:", e);
                }
            }
            
            updateCharCounter();
        }

        function closeSettings() {
            document.getElementById('worker-settings').classList.remove('open');
        }

        function getUniqueSkillCount() {
            const unique = new Set();
            selectedSkills.forEach(skill => {
                if (skill.includes(' (')) {
                    unique.add(skill.split(' (')[0]);
                } else {
                    unique.add(skill);
                }
            });
            return unique.size;
        }

        function renderSkillSelector() {
            const grid = document.getElementById('skill-selector');
            if (!grid) return;
            
            let html = '';
            for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
                const isTutor = category === 'Magántanár';
                html += `
                    <div class="skill-category-block">
                        <div class="skill-category-title">${category}</div>
                        <div class="skill-category-tags">
                            ${skills.map(skill => {
                                const isSelected = isTutor 
                                    ? Array.from(selectedSkills).some(s => s.startsWith(skill + ' ('))
                                    : selectedSkills.has(skill);
                                const clickHandler = isTutor 
                                    ? `toggleTutorSubject('${skill}', this)` 
                                    : `toggleSkill('${skill}', this)`;
                                return `
                                    <button type="button" class="skill-tag ${isSelected ? 'selected' : ''}"
                                        onclick="${clickHandler}">
                                        ${skill}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
            grid.innerHTML = html;
        }

        function toggleSkill(skill, el) {
            const warningEl = document.getElementById('skills-warning-msg');
            if (selectedSkills.has(skill)) {
                selectedSkills.delete(skill);
                el.classList.remove('selected');
                if (warningEl) warningEl.style.display = 'none';
            } else {
                if (getUniqueSkillCount() >= 6) {
                    if (warningEl) warningEl.style.display = 'block';
                    el.style.animation = 'shake 0.3s ease';
                    setTimeout(() => el.style.animation = '', 300);
                    return;
                }
                selectedSkills.add(skill);
                el.classList.add('selected');
                if (warningEl) warningEl.style.display = 'none';
            }
        }

        function toggleTutorSubject(subject, el) {
            const levels = getLevelsForSubject(subject);
            
            const backdropId = 'tutor-level-backdrop';
            const modalId = 'tutor-level-modal';
            
            document.getElementById(backdropId)?.remove();
            document.getElementById(modalId)?.remove();
            
            const backdrop = document.createElement('div');
            backdrop.id = backdropId;
            backdrop.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9000;';
            
            const modal = document.createElement('div');
            modal.id = modalId;
            modal.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background: var(--color-surface);border-top-left-radius:24px;border-top-right-radius:24px;z-index:9001;padding:24px;box-sizing:border-box;max-height:75%;display:flex;flex-direction:column;';
            
            const selectedLevels = [];
            selectedSkills.forEach(skill => {
                if (skill.startsWith(subject + ' (')) {
                    const parts = skill.split(' (');
                    if (parts.length > 1) {
                        const lvl = parts[1].replace(')', '');
                        selectedLevels.push(lvl);
                    }
                }
            });
            
            let html = `
                <div style="width:36px;height:4px;background: var(--color-surface);border-radius:2px;margin:0 auto 16px;flex-shrink:0;"></div>
                <div style="font-size:18px;font-weight: 500;color:var(--color-text);margin-bottom:8px;flex-shrink:0;">${subject} szintek</div>
                <div style="font-size:13px;color:var(--color-text-muted);margin-bottom:20px;flex-shrink:0;">Válaszd ki, melyik szinten tudsz oktatni (többet is jelölhetsz):</div>
                <div style="overflow-y:auto;flex-grow:1;margin-bottom:20px;display:flex;flex-direction:column;gap:12px;" id="tutor-levels-list">
            `;
            
            levels.forEach(lvl => {
                const isChecked = selectedLevels.includes(lvl);
                html += `
                    <label style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;border:1.5px solid var(--color-border);background:rgba(128,128,128,0.05);cursor:pointer;margin:0;">
                        <span style="font-size:14px;font-weight: 400;color:var(--color-text);">${lvl}</span>
                        <input type="checkbox" class="tutor-level-checkbox" value="${lvl}" ${isChecked ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--color-text);cursor:pointer;">
                    </label>
                `;
            });
            
            html += `
                </div>
                <div style="display:flex;gap:12px;flex-shrink:0;">
                    <button type="button" id="tutor-cancel-btn" style="flex:1;height:48px;border-radius:12px;border:1.5px solid var(--color-border);background:none;color:var(--color-text);font-weight: 400;font-size:14px;cursor:pointer;">Mégse</button>
                    <button type="button" id="tutor-save-btn" style="flex:1;height:48px;border-radius:12px;border:none;background:var(--color-text);color:var(--color-bg);font-weight: 500;font-size:14px;cursor:pointer;">Mentés</button>
                </div>
            `;
            
            modal.innerHTML = html;
            
            backdrop.onclick = () => { backdrop.remove(); modal.remove(); };
            
            const phoneApp = document.getElementById('phone-app');
            if (phoneApp) {
                phoneApp.appendChild(backdrop);
                phoneApp.appendChild(modal);
            }
            
            document.getElementById('tutor-cancel-btn').onclick = () => { backdrop.remove(); modal.remove(); };
            document.getElementById('tutor-save-btn').onclick = () => {
                const checked = [];
                modal.querySelectorAll('.tutor-level-checkbox').forEach(cb => {
                    if (cb.checked) checked.push(cb.value);
                });
                
                const hasExisting = Array.from(selectedSkills).some(s => s.startsWith(subject + ' ('));
                
                if (checked.length > 0 && !hasExisting && getUniqueSkillCount() >= 6) {
                    const warningEl = document.getElementById('skills-warning-msg');
                    if (warningEl) warningEl.style.display = 'block';
                    backdrop.remove();
                    modal.remove();
                    return;
                }
                
                // Remove existing
                selectedSkills.forEach(skill => {
                    if (skill.startsWith(subject + ' (')) {
                        selectedSkills.delete(skill);
                    }
                });
                
                // Add new ones
                checked.forEach(lvl => {
                    selectedSkills.add(`${subject} (${lvl})`);
                });
                
                if (checked.length > 0) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
                
                backdrop.remove();
                modal.remove();
            };
        }

        function updateCharCounter() {
            const bio = document.getElementById('settings-bio');
            const counter = document.getElementById('bio-char-counter');
            if (bio && counter) {
                const len = bio.value.length;
                counter.textContent = `${len} / 300`;
                counter.style.color = len > 270 ? '#DC2626' : 'var(--color-text)';
            }
        }

        // ================================================
        // PROFILKÉP KIVÁLASZTÁS ÉS CROPPER FUNKCIÓK
        // ================================================
        function openAvatarPicker() {
            const backdrop = document.getElementById('avatar-picker-backdrop');
            const sheet = document.getElementById('avatar-picker-sheet');
            if (backdrop && sheet) {
                backdrop.classList.add('open', 'active');
                sheet.classList.add('open', 'active');
            }
        }

        function closeAvatarPicker() {
            const backdrop = document.getElementById('avatar-picker-backdrop');
            const sheet = document.getElementById('avatar-picker-sheet');
            if (backdrop && sheet) {
                backdrop.classList.remove('open', 'active');
                sheet.classList.remove('open', 'active');
            }
        }

        function triggerCameraPicker() {
            closeAvatarPicker();
            const picker = document.getElementById('avatar-camera-picker');
            if (picker) picker.click();
        }

        function triggerGalleryPicker() {
            closeAvatarPicker();
            const picker = document.getElementById('avatar-gallery-picker');
            if (picker) picker.click();
        }

        function handleAvatarFileSelected(event, source) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                showCropOverlay(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // Reset input values
            event.target.value = '';
        }

        function showCropOverlay(imgSrc) {
            const overlay = document.getElementById('avatar-crop-overlay');
            const img = document.getElementById('crop-preview-image');
            const slider = document.getElementById('crop-zoom-slider');
            const zoomVal = document.getElementById('zoom-value');
            
            if (!overlay || !img) return;
            
            img.src = imgSrc;
            overlay.style.display = 'flex';
            
            // Reset crop state
            cropState.currentX = 0;
            cropState.currentY = 0;
            cropState.scale = 1.0;
            if (slider) slider.value = '100';
            if (zoomVal) zoomVal.innerText = '100%';
            
            img.onload = function() {
                const naturalW = img.naturalWidth;
                const naturalH = img.naturalHeight;
                
                if (naturalW > naturalH) {
                    img.height = 260;
                    img.width = (naturalW / naturalH) * 260;
                } else {
                    img.width = 260;
                    img.height = (naturalH / naturalW) * 260;
                }
                updateCropTransform();
            };
            
            initCropDrag();
        }

        function cancelCrop() {
            const overlay = document.getElementById('avatar-crop-overlay');
            if (overlay) overlay.style.display = 'none';
        }

        async function confirmCrop() {
            const img = document.getElementById('crop-preview-image');
            if (!img || !img.src) return;
            
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            const displayedW = img.width || 260;
            const displayedH = img.height || 260;
            
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.clip();
            
            const multiplier = 200 / 260;
            
            const destW = displayedW * cropState.scale * multiplier;
            const destH = displayedH * cropState.scale * multiplier;
            
            const destX = 100 + (cropState.currentX * multiplier) - (destW / 2);
            const destY = 100 + (cropState.currentY * multiplier) - (destH / 2);
            
            ctx.drawImage(img, destX, destY, destW, destH);
            
            const croppedBase64 = canvas.toDataURL('image/jpeg', 0.60);
            
            await saveProfilePhoto(croppedBase64);
            cancelCrop();
        }

        let cropState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            scale: 1.0
        };

        function initCropDrag() {
            const img = document.getElementById('crop-preview-image');
            const slider = document.getElementById('crop-zoom-slider');
            const zoomVal = document.getElementById('zoom-value');
            
            if (!img || !slider) return;
            
            slider.oninput = function() {
                cropState.scale = this.value / 100;
                if (zoomVal) zoomVal.innerText = this.value + '%';
                updateCropTransform();
            };
            
            const startDrag = (e) => {
                cropState.isDragging = true;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                cropState.startX = clientX - cropState.currentX;
                cropState.startY = clientY - cropState.currentY;
                e.preventDefault();
            };
            
            const moveDrag = (e) => {
                if (!cropState.isDragging) return;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                cropState.currentX = clientX - cropState.startX;
                cropState.currentY = clientY - cropState.startY;
                updateCropTransform();
            };
            
            const endDrag = () => {
                cropState.isDragging = false;
            };
            
            img.onmousedown = startDrag;
            img.ontouchstart = startDrag;
            
            window.onmousemove = moveDrag;
            window.ontouchmove = moveDrag;
            
            window.onmouseup = endDrag;
            window.ontouchend = endDrag;
        }

        function updateCropTransform() {
            const img = document.getElementById('crop-preview-image');
            if (img) {
                img.style.transform = `translate(${cropState.currentX}px, ${cropState.currentY}px) scale(${cropState.scale})`;
            }
        }

        async function saveProfilePhoto(photoDataURL) {
            let finalPhotoURL = photoDataURL;
            
            // Upload to Firebase Storage if available and it's a data URL (not an already uploaded HTTP URL)
            if (photoDataURL.startsWith('data:image') && window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseApp) {
                try {
                    const storage = window.firebaseAPI.getStorage(window.firebaseApp);
                    const storageRef = window.firebaseAPI.ref(storage, `profile_photos/${window.firebaseAuth.currentUser.uid}.jpg`);
                    
                    // Show a toast or loading state could be added here
                    console.log("Uploading photo to Firebase Storage...");
                    
                    await window.firebaseAPI.uploadString(storageRef, photoDataURL, 'data_url');
                    finalPhotoURL = await window.firebaseAPI.getDownloadURL(storageRef);
                    
                    console.log("Photo uploaded successfully. URL:", finalPhotoURL);
                } catch (e) {
                    console.error("Firebase Storage photo upload FAILED:", e);
                    showToast('Hiba a profilkép feltöltésekor a felhőbe.');
                    // Fallback to Base64
                }
            }

            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            userData.photoURL = finalPhotoURL;
            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
            
            updateAllAvatarDisplays(finalPhotoURL);
            
            if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                try {
                    const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", window.firebaseAuth.currentUser.uid);
                    await window.firebaseAPI.updateDoc(userRef, {
                        photoURL: finalPhotoURL
                    });
                    console.log('[saveProfilePhoto] Firestore photo URL saved successfully.');
                } catch(e) {
                    console.error('[saveProfilePhoto] Firestore photo update FAILED:', e.message);
                    showToast('⚠️ A profilkép helyben mentve, de felhő szinkronizáció sikertelen!');
                }
            }
            
            // Force redraw on profile screen
            if (typeof updateAllUserUI === 'function') {
                updateAllUserUI();
            }
        }

        function updateAllAvatarDisplays(photoURL) {
            const user = loadCurrentUser();
            const initials = user ? user.initials : 'KB';
            const url = photoURL || (user ? user.photoURL : '');
            
            // 1. Profile screen avatar
            const profileAvatar = document.getElementById('profile-avatar-circle');
            if (profileAvatar) {
                if (url) {
                    profileAvatar.style.backgroundImage = `url(${url})`;
                    profileAvatar.style.backgroundSize = 'cover';
                    profileAvatar.style.backgroundPosition = 'center';
                    const initialsEl = profileAvatar.querySelector('.user-initials-display');
                    if (initialsEl) initialsEl.style.display = 'none';
                } else {
                    profileAvatar.style.backgroundImage = 'none';
                    const initialsEl = profileAvatar.querySelector('.user-initials-display');
                    if (initialsEl) {
                        initialsEl.innerText = initials;
                        initialsEl.style.display = 'block';
                    }
                }
            }
            
            // 2. Worker profile overlay (employer view)
            const wpAvatar = document.getElementById('wp-avatar');
            const wpFallback = document.getElementById('wp-avatar-fallback');
            if (wpAvatar && wpFallback) {
                if (url) {
                    wpAvatar.src = url;
                    wpAvatar.style.display = 'block';
                    wpFallback.style.display = 'none';
                } else {
                    wpAvatar.style.display = 'none';
                    wpFallback.innerText = initials;
                    wpFallback.style.display = 'flex';
                }
            }
        }

        async function saveSettings() {
            const nameVal = document.getElementById('settings-name')?.value || '';
            const bioVal = document.getElementById('settings-bio')?.value || '';
            const skillsArr = Array.from(selectedSkills);
            
            // Save to local storage
            localStorage.setItem('melogo_name', nameVal);
            
            const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
            workerSession.name = nameVal;
            localStorage.setItem('melogo_worker_session', JSON.stringify(workerSession));
            
            const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
            employerSession.name = nameVal;
            localStorage.setItem('melogo_employer_session', JSON.stringify(employerSession));
            
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            userData.bio = bioVal;
            userData.skills = skillsArr;
            
            const firestoreUpdateData = {
                name: nameVal,
                bio: bioVal,
                skills: skillsArr
            };
            
            if (activeRole === 'employer') {
                const zip = (document.getElementById('set-zip') || {}).value?.trim() || '';
                const county = (document.getElementById('set-county') || {}).value?.trim() || '';
                const city = (document.getElementById('set-city') || {}).value?.trim() || '';
                const street = (document.getElementById('set-street') || {}).value?.trim() || '';
                const house = (document.getElementById('set-house') || {}).value?.trim() || '';
                const apt = (document.getElementById('set-apartment') || {}).value?.trim() || '';
                
                if (!zip || !county || !city || !street || !house) {
                    const err = document.getElementById('err-set-structured');
                    if (err) err.classList.add('show');
                    return;
                }
                const err = document.getElementById('err-set-structured');
                if (err) err.classList.remove('show');
                
                let generatedAddress = `${zip} ${city}, ${street} ${house}.`;
                if (apt) generatedAddress += ` ${apt}`;
                
                settingsConfirmedAddress = generatedAddress;
                userData.address = generatedAddress;
                userData.addressCity = city;
                userData.addressStreet = street;
                userData.addressCounty = county;

                firestoreUpdateData.address = generatedAddress;
                firestoreUpdateData.addressCity = city;
                firestoreUpdateData.addressStreet = street;
                firestoreUpdateData.addressCounty = county;
            }
            
            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
            
            // Save to Firestore if available
            if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                try {
                    const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", window.firebaseAuth.currentUser.uid);
                    await window.firebaseAPI.updateDoc(userRef, firestoreUpdateData);
                } catch(e) {
                    console.error("Firestore user profile save error:", e);
                }
            }
            
            // Re-render user UI to refresh profile views
            updateAllUserUI();
            
            showToast('Profil sikeresen mentve!');
            setTimeout(closeSettings, 500);
        }

        function showToast(message) {
            const toast = document.getElementById('settings-toast');
            if (toast) {
                toast.childNodes[toast.childNodes.length - 1].textContent = ' ' + message;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
        }

        // ================================================
        // LOGOUT CONFIRMATION SHEET
        // ================================================
        function openLogoutConfirm() {
            document.getElementById('logout-backdrop').classList.add('open');
            document.getElementById('logout-sheet').classList.add('open');
        }

        function closeLogoutConfirm() {
            document.getElementById('logout-backdrop').classList.remove('open');
            document.getElementById('logout-sheet').classList.remove('open');
        }

        // ================================================
        // SORT PERSISTENCE (localStorage)
        // ================================================
        function sortWorkerJobsOld(mode) {
            // Persist preference
            try { localStorage.setItem('melogo_sort', mode); } catch(e) {}
            // Update active button
            ['dist', 'price', 'new', 'urg'].forEach(id => {
                const el = document.getElementById('sort-' + id);
                if (el) el.classList.remove('active');
            });
            const map = { distance: 'dist', price: 'price', newest: 'new', urgent: 'urg' };
            const btn = document.getElementById('sort-' + map[mode]);
            if (btn) btn.classList.add('active');
            // Sort jobs list
            const jobsList = document.getElementById('worker-jobs-list');
            if (!jobsList) return;
            const cards = Array.from(jobsList.querySelectorAll('.job-card'));
            cards.sort((a, b) => {
                if (mode === 'distance') return parseFloat(a.dataset.distance || 0) - parseFloat(b.dataset.distance || 0);
                if (mode === 'price') return parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0);
                if (mode === 'newest') return parseInt(a.dataset.time || 0) - parseInt(b.dataset.time || 0);
                if (mode === 'urgent') return parseInt(b.dataset.urgent || 0) - parseInt(a.dataset.urgent || 0);
                return 0;
            });
            cards.forEach(c => jobsList.appendChild(c));
        }


        // Local alias for backward compatibility with all existing code
        if (!window.mockJobs) {
            window.mockJobs = [];
        }
        let mockJobs = window.mockJobs;
        window.updateMockJobsReference = function(newJobs) {
            mockJobs = newJobs;
            console.log('[DEBUG] Local mockJobs reference updated, count:', mockJobs.length);
        };

        // recalculateJobDistances stub (no rounding) removed — real implementation with gameState.gpsActive check below

        function updateJobCardsDistances() {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;
            const cards = list.querySelectorAll('.job-card');
            cards.forEach(card => {
                const jobId = card.getAttribute('data-id');
                const job = mockJobs.find(j => String(j.id) === String(jobId));
                if (job && userCoords && job.lat && job.lon) {
                    const dist = Math.round(calculateHaversine(userCoords.lat, userCoords.lon, job.lat, job.lon) * 10) / 10;
                    job.distance = dist;
                    card.setAttribute('data-distance', dist);
                    const distEl = card.querySelector('.job-distance-text');
                    if (distEl) distEl.innerText = dist + ' km';
                }
            });
        }

        function mergeFirestoreJobsIntoMock(firestoreJobs) {
            console.log('[mergeFirestoreJobsIntoMock] Processing', firestoreJobs.length, 'Firestore jobs');
            firestoreJobs.forEach(fJob => {
                if (!fJob.id || !fJob.title) {
                    console.warn('[mergeFirestoreJobsIntoMock] Skipping job without id or title:', fJob);
                    return;
                }
                
                // Calculate distance if coords available, otherwise null (null passes the filter)
                let dist = null;
                if (userCoords && fJob.lat && fJob.lon) {
                    dist = Math.round(calculateHaversine(userCoords.lat, userCoords.lon, fJob.lat, fJob.lon) * 10) / 10;
                } else if (fJob.lat && fJob.lon && userCoords) {
                    dist = Math.round(calculateHaversine(userCoords.lat, userCoords.lon, fJob.lat, fJob.lon) * 10) / 10;
                }
                // If no coords at all, assign a random plausible distance so sorting works
                if (dist === null) dist = Math.round(Math.random() * 5 * 10) / 10;

                const normalized = {
                    id: fJob.id,
                    title: fJob.title,
                    employer: fJob.ownerName || (fJob.ownerEmail ? fJob.ownerEmail.split('@')[0] : 'Megbízó'),
                    price: parseInt(fJob.price) || 10000,
                    distance: dist,
                    lat: fJob.lat || (46.36 + (Math.random() - 0.5) * 0.05),
                    lon: fJob.lon || (17.79 + (Math.random() - 0.5) * 0.05),
                    category: fJob.category || 'Kert',
                    location: fJob.location || 'Kaposvár',
                    time: fJob.datetime ? fJob.datetime.slice(0, 10) : new Date().toISOString().slice(0, 10),
                    urgent: fJob.urgent || false,
                    timeOffset: fJob.createdAt ? -(Number(fJob.createdAt)) : -Date.now(),
                    desc: fJob.details || fJob.desc || '',
                    toolsRequired: fJob.toolsRequired || 'employer',
                    isFirestore: true
                };
                
                const existing = mockJobs.findIndex(m => m.id === fJob.id);
                if (existing !== -1) {
                    mockJobs[existing] = normalized;
                } else {
                    mockJobs.unshift(normalized);
                }
                console.log('[mergeFirestoreJobsIntoMock] Added/updated job:', normalized.title, '| distance:', normalized.distance);
            });
            recalculateJobDistances();
            refreshJobList();
            if (typeof renderMapPins === 'function') renderMapPins();
        }



        // Current state
        let activeDateFilter = null;
        let activeCategoryFilter = 'Összes';
        let activeRadius = parseInt(localStorage.getItem('melogo_radius') || '10');
        let activeSortMode = 'newest';
        let currentMapCategory = 'all';
        let selectedMapJob = null;
        var userCoords = { lat: 47.4979, lon: 19.0402 }; // Central Kaposvár coordinates

        function calculateHaversine(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        function recalculateJobDistances() {
            mockJobs.forEach(job => {
                if (gameState.gpsActive && userCoords && job.lat && job.lon) {
                    const d = calculateHaversine(userCoords.lat, userCoords.lon, job.lat, job.lon);
                    job.distance = Math.round(d * 10) / 10;
                } else {
                    job.distance = null;
                }
            });
        }

        // Map pin positions (relative % coordinates)
        const jobMapPositions = {
            1: { top: 55, left: 48 },
            2: { top: 42, left: 62 },
            3: { top: 65, left: 30 },
            4: { top: 38, left: 20 },
            5: { top: 70, left: 72 },
            6: { top: 48, left: 55 },
            7: { top: 60, left: 22 },
            8: { top: 30, left: 45 },
        };

        const catColors = {
            'Kert': { bg: '#16a34a', class: 'cat-kert' },
            'Magántanár': { bg: '#3b82f6', class: 'cat-tanar' },
            'Takarítás': { bg: '#0d9488', class: 'cat-takaritas' },
            'Bébiszitter': { bg: '#f97316', class: 'cat-bebiszitter' },
            'Festés': { bg: '#7c3aed', class: 'cat-festes' },
            'Költöztetés': { bg: '#0891b2', class: 'cat-koltoztetes' },
            'Kőműves': { bg: '#b45309', class: 'cat-komuves' },
            'Asztalos': { bg: '#92400e', class: 'cat-asztalos' },
            'Állat': { bg: '#f43f5e', class: 'cat-allat' },
            'Bevásárlás': { bg: '#6366f1', class: 'cat-bevasarlas' },
            'Rendezvény': { bg: '#db2777', class: 'cat-rendezv' },
            'Mező': { bg: '#65a30d', class: 'cat-mezo' },
            'Autó': { bg: 'var(--color-text)', class: 'cat-auto' }
        };

        // ===================================================================
        // RENDER JOB CARDS
        // ===================================================================
        function renderSkeletonJobs(containerId, count) {
            const list = document.getElementById(containerId);
            if (!list) return;
            let html = '';
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="job-card shimmer" style="min-height: 96px; margin-bottom: 16px; border-radius: 16px; border: 1px solid var(--color-text); background: var(--color-surface); overflow: hidden; position: relative;">
                        <div style="padding: 24px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                                <div style="width: 60%; height: 20px; background: var(--color-surface); border-radius: 6px;"></div>
                                <div style="width: 25%; height: 20px; background: var(--color-surface); border-radius: 6px;"></div>
                            </div>
                            <div style="width: 40%; height: 16px; background: var(--color-surface); border-radius: 6px;"></div>
                        </div>
                    </div>
                `;
            }
            list.innerHTML = html;
        }

        function getRelativeTime(timeStr) {
            if (!timeStr) return "N/A";
            const d = new Date(timeStr);
            if (isNaN(d.getTime())) return timeStr;
            const now = new Date();
            const diffTime = d.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return "Ma";
            if (diffDays === 1) return "Holnap";
            if (diffDays === -1) return "Tegnap";
            if (diffDays > 1) return diffDays + " nap múlva";
            return Math.abs(diffDays) + " napja";
        }
        function renderJobCards(jobs) {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;

            // Skip re-render if nothing actually changed (prevents Firestore-triggered visual flash)
            const newFingerprint = (jobs || []).map(j => j.id + ':' + j.price).join(',');
            if (list._lastFingerprint === newFingerprint && list.children.length > 0) return;

            // Check if some jobs were deleted compared to the current DOM elements
            const newIds = new Set((jobs || []).map(j => String(j.id)));
            const cardsInDom = Array.from(list.children).filter(el => el.classList.contains('job-card'));
            const deletedCards = cardsInDom.filter(card => {
                const cardId = card.getAttribute('data-id');
                return cardId && !newIds.has(String(cardId));
            });

            list._latestJobs = jobs; // store latest jobs for timeout to use

            if (deletedCards.length > 0 && !list._animatingDeletion) {
                list._animatingDeletion = true;
                deletedCards.forEach(card => {
                    card.classList.add('animate-card-fade-out');
                });
                if (list._deletionTimeout) clearTimeout(list._deletionTimeout);
                list._deletionTimeout = setTimeout(() => {
                    list._animatingDeletion = false;
                    list._lastFingerprint = newFingerprint;
                    executeRenderJobCards(list._latestJobs);
                }, 350);
                return;
            } else if (list._animatingDeletion) {
                // If currently animating, just wait for the timeout to render list._latestJobs
                return;
            }

            list._lastFingerprint = newFingerprint;
            executeRenderJobCards(jobs);
        }

        function executeRenderJobCards(jobs) {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;
            
            // Save scroll position before re-render to prevent scroll jump
            const scrollParent = list.closest('.screen') || list.parentElement;
            const savedScroll = scrollParent ? scrollParent.scrollTop : 0;
            
            list.innerHTML = '';

            if (!jobs || jobs.length === 0) {
                list.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" style="margin-bottom: 12px;">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <h3 style="font-size: 16px; font-weight: 400; color: var(--color-text); margin-bottom: 8px;">Nincs találat</h3>
                        <p style="font-size: 13px; color: var(--color-text); max-width: 260px; margin: 0 auto;">Jelenleg nincs a keresésnek megfelelő munka. Próbálkozz más kategóriával vagy várostal!</p>
                    </div>
                `;
                return;
            }

            jobs.forEach(job => {
                try {
                    const catInfo = catColors[job.category] || { bg: 'var(--color-text)', class: '' };
                    const card = document.createElement('div');
                    card.className = 'job-card';
                    card.setAttribute('data-category', job.category);
                    card.setAttribute('data-distance', job.distance);
                    card.setAttribute('data-price', job.price);
                    card.setAttribute('data-time', job.timeOffset);
                    card.setAttribute('data-urgent', job.urgent ? '1' : '0');
                    card.setAttribute('data-id', job.id);
                    card.style.cursor = 'pointer';
                    card.onclick = () => openJobDetailById(job.id);

                    card.innerHTML = `
                        <div class="job-card-header" style="margin-bottom:8px;">
                            <div style="flex:1;">
                                <div class="job-title">${job.title || 'Névtelen munka'}</div>
                                <div style="font-size:12px; color:var(--color-text-light); margin-top:2px;">${job.employer || 'Ismeretlen'}</div>
                            </div>
                            <div class="job-price">${(Number(job.price) || 0).toLocaleString('hu-HU')} Ft</div>
                        </div>
                        <div class="job-card-badges">
                            <span class="job-badge-cat">${job.category || 'Egyéb'}</span>
                            ${job.urgent ? '<span class="job-badge-urgent"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Sürgős</span>' : ''}
                        </div>
                        <div class="job-meta" style="margin-bottom:0;">
                            <div class="job-meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span class="job-distance-text">${job.distance !== null && job.distance !== undefined ? job.distance + ' km' : '? km'}</span>
                            </div>
                            <div class="job-meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                ${getRelativeTime(job.time)}
                            </div>
                            <div class="job-meta-item" style="color:var(--color-text-light); font-size:11px;">
                                📍 ${job.location && typeof job.location === 'string' ? job.location.split(',').slice(-1)[0].trim() : 'Ismeretlen'}
                            </div>
                        </div>
                    `;
                    list.appendChild(card);
                } catch (err) {
                    console.error('Failed to render job:', job, err);
                    if (job.isFirestore) alert('HIBA A MEGJELENÍTÉSBEN: ' + err.message);
                }
            });

            if (jobs.length === 0) {
                list.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--color-text-light);"><div style="font-size:32px; margin-bottom:12px;">🔍</div><div style="font-size:14px;">Úgy néz ki, ma mindenki pihen 😴 — próbálj nagyobb hatókört!</div></div>';
            }
            
            // Restore scroll position to prevent jump caused by Firestore live updates
            if (scrollParent && savedScroll > 0) {
                requestAnimationFrame(() => { scrollParent.scrollTop = savedScroll; });
            }
        }

        function getFilteredAndSortedJobs() {
            // Ensure activeRadius is a valid number, fallback to 100 if broken
            if (isNaN(activeRadius)) activeRadius = 100;
            
            const currentWorkerName = window.currentUser ? window.currentUser.name : '';

            // Allow jobs with null/undefined distance, OR if they are within radius. 
            // DEBUG: Bypass distance filter completely for Firestore jobs to guarantee visibility.
            let jobs = mockJobs.filter(j => {
                const s = j.status || 'Keresés';
                if (s !== 'Keresés' && s !== 'Kereses') {
                    // Show accepted jobs ONLY to the worker who was actually accepted
                    if (s === 'accepted') {
                        const hasActiveApp = localWorkerApplications.some(a => a.jobId === j.id && a.status === 'Aktív');
                        if (hasActiveApp) return true;
                    }
                    return false;
                }
                return j.isFirestore || j.distance === null || j.distance === undefined || j.distance <= activeRadius;
            });

            if (activeCategoryFilter !== 'Összes' && activeCategoryFilter !== 'all') {
                jobs = jobs.filter(j => j.category === activeCategoryFilter);
            }

            if (activeCategoryFilter === 'Magántanár') {
                // Tárgy szűrő
                if (activeTutorSubject && activeTutorSubject !== 'Minden') {
                    jobs = jobs.filter(j => j.subcategory === activeTutorSubject ||
                        (j.title && j.title.toLowerCase().startsWith(activeTutorSubject.toLowerCase())));
                }
                // Szint szűrő
                if (activeTutorLevel) {
                    jobs = jobs.filter(j => j.title && j.title.includes('(' + activeTutorLevel + ')'));
                }
            }

            // Date filter
            if (activeDateFilter) {
                jobs = jobs.filter(j => j.time && j.time.startsWith(activeDateFilter));
            }

            if (activeSortMode === 'newest') {
                jobs.sort((a, b) => a.timeOffset - b.timeOffset);
                return jobs;
            }
            if (activeSortMode === 'date') {
                jobs.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
                return jobs;
            }

            // Sürgős jobs always on top for other modes
            const urgentJobs = jobs.filter(j => j.urgent);
            const normalJobs = jobs.filter(j => !j.urgent);

            if (activeSortMode === 'distance') {
                urgentJobs.sort((a, b) => a.distance - b.distance);
                normalJobs.sort((a, b) => a.distance - b.distance);
            } else if (activeSortMode === 'price') {
                urgentJobs.sort((a, b) => b.price - a.price);
                normalJobs.sort((a, b) => b.price - a.price);
            } else if (activeSortMode === 'urgent') {
                return [...urgentJobs, ...normalJobs];
            }

            return [...urgentJobs, ...normalJobs];
        }

        function refreshJobList(silent = false) {
            if (silent) {
                renderJobCards(getFilteredAndSortedJobs());
            } else {
                renderSkeletonJobs('worker-jobs-list', 3);
                setTimeout(() => {
                    renderJobCards(getFilteredAndSortedJobs());
                }, 300);
            }
        }

        // ===================================================================
        // NEW FILTER/SORT FUNCTIONS
        // ===================================================================
        let activeSubcategoryFilter = 'Minden'; // legacy compat
        let activeTutorSubject = 'Minden';
        let activeTutorLevel = null;

        const TUTOR_SUBJECTS = ['Angol','Magyar','Matek','Kémia','Fizika','Biológia','Történelem','Földrajz','Német','Francia','Spanyol','Olasz','Informatika','Programozás','Zene/Hangszer','Rajz/Vizuális'];
        const TUTOR_LEVELS_DEFAULT = ['Alsó tagozat','Felső tagozat','Középszint','Emelt szint','Egyetemi szint'];
        const TUTOR_LEVELS_ART = ['Kezdő','Középhaladó','Haladó'];

        function getLevelsForSubjectFilter(subject) {
            if (subject === 'Zene/Hangszer' || subject === 'Rajz/Vizuális') return TUTOR_LEVELS_ART;
            return TUTOR_LEVELS_DEFAULT;
        }

        function filterWorkerJobs(cat) {
            activeCategoryFilter = cat;
            if (cat !== 'Magántanár') {
                activeTutorSubject = 'Minden';
                activeTutorLevel = null;
            }
            // Update chip active state — text match only, no icon stripping needed
            document.querySelectorAll('.category-btn').forEach(btn => {
                const label = btn.textContent.trim();
                const isMinden = (cat === 'Összes' || cat === 'all') && label === 'Minden';
                const isMatch = label === cat || isMinden;
                btn.classList.toggle('active', isMatch);
            });

            const subjRow = document.getElementById('tutor-subject-row');
            const lvlRow = document.getElementById('tutor-level-row');
            if (cat === 'Magántanár') {
                populateTutorSubjectRow();
                if (subjRow) subjRow.style.display = 'flex';
                // level row stays hidden until subject is picked
                if (lvlRow) lvlRow.style.display = 'none';
            } else {
                if (subjRow) subjRow.style.display = 'none';
                if (lvlRow) lvlRow.style.display = 'none';
            }

            refreshJobList();
        }

        function populateTutorSubjectRow() {
            const row = document.getElementById('tutor-subject-row');
            if (!row) return;
            row.innerHTML = TUTOR_SUBJECTS.map(sub => {
                const active = sub === activeTutorSubject;
                return `<div class="tutor-chip${active ? ' active' : ''}" onclick="filterTutorSubject('${sub.replace(/'/g,"\\'")}')">` + sub + `</div>`;
            }).join('');
        }

        function populateTutorLevelRow(subject) {
            const row = document.getElementById('tutor-level-row');
            if (!row) return;
            const levels = getLevelsForSubjectFilter(subject);
            row.innerHTML = levels.map(lvl => {
                const active = lvl === activeTutorLevel;
                return `<div class="tutor-chip${active ? ' active' : ''}" onclick="filterTutorLevel('${lvl.replace(/'/g,"\\'")}')">` + lvl + `</div>`;
            }).join('');
            row.style.display = 'flex';
        }

        function filterTutorSubject(subject) {
            activeTutorSubject = subject;
            activeTutorLevel = null;
            populateTutorSubjectRow();
            populateTutorLevelRow(subject);
            refreshJobList();
        }

        function filterTutorLevel(lvl) {
            activeTutorLevel = (activeTutorLevel === lvl) ? null : lvl; // toggle
            populateTutorLevelRow(activeTutorSubject);
            refreshJobList();
        }

        // Legacy subcategory filter compat
        function filterWorkerSubcategory(subCat) {
            filterTutorSubject(subCat);
        }
        function updateSubcategoryButtons() {}
        function populateWorkerSubcategoryRow() { populateTutorSubjectRow(); }

        function setDateFilter(dateStr) {
            activeDateFilter = (activeDateFilter === dateStr) ? null : dateStr;
            renderDateFilter();
            refreshJobList();
        }

        function renderDateFilter() {
            const container = document.getElementById('date-filter-row');
            if (!container) return;
            
            const today = new Date();
            let html = '';
            
            for (let i = 0; i < 14; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                const isoDate = d.toISOString().slice(0, 10);
                
                const days = ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'];
                const dayName = (i === 0) ? 'Ma' : (i === 1) ? 'Holnap' : days[d.getDay()];
                const num = d.getDate();
                
                const isActive = (activeDateFilter === isoDate);
                
                html += `
                    <div onclick="setDateFilter('${isoDate}')" style="min-width: 52px; padding: 6px 0; border-radius: 12px; border: 1.5px solid ${isActive ? 'var(--color-text)' : 'var(--color-text)'}; background: ${isActive ? 'var(--color-text)' : '#fff'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0;">
                        <span style="font-size: 11px; font-weight: 500; color: ${isActive ? '#fff' : 'var(--color-text)'}; margin-bottom: 2px;">${dayName}</span>
                        <span style="font-size: 16px; font-weight: 600; color: ${isActive ? '#fff' : 'var(--color-text)'};">${num}</span>
                    </div>
                `;
            }
            
            container.innerHTML = html;
            container.style.display = 'flex';
        }

        let ptrStartY = 0;
        let ptrActive = false;
        const ptrThreshold = 60;
        
        function initPullToRefresh() {
            const homeScreen = document.getElementById('app-home-screen');
            const ptr = document.getElementById('pull-to-refresh');
            const ptrSpinner = document.getElementById('ptr-spinner');
            
            if (!homeScreen || !ptr) return;
            
            homeScreen.addEventListener('touchstart', (e) => {
                const activeTab = currentRole === 'worker' ? document.getElementById('home-worker-view') : document.getElementById('home-employer-view');
                if (!activeTab) return;
                
                // Only allow pull-to-refresh if the user is EXACTLY at the top of the page
                if (homeScreen.scrollTop <= 0) {
                    ptrStartY = e.touches[0].pageY;
                    ptrActive = true;
                    ptr.style.transition = 'none';
                    activeTab.style.transition = 'none';
                    if (ptrSpinner) {
                        ptrSpinner.style.animation = 'none';
                        ptrSpinner.style.transform = 'rotate(0deg)';
                    }
                } else {
                    ptrActive = false;
                }
            }, { passive: true });
            
            homeScreen.addEventListener('touchmove', (e) => {
                if (!ptrActive) return;
                
                const activeTab = currentRole === 'worker' ? document.getElementById('home-worker-view') : document.getElementById('home-employer-view');
                if (!activeTab) return;
                
                const currentY = e.touches[0].pageY;
                const diff = currentY - ptrStartY;
                
                // Only act if pulling down AND we are still at the top
                if (diff > 0 && homeScreen.scrollTop <= 0) {
                    if (e.cancelable) e.preventDefault();
                    
                    // Apply drag resistance
                    const y = Math.min(diff * 0.4, 60);
                    ptr.style.transform = `translateY(${y}px)`;
                    ptr.style.opacity = Math.min(y / ptrThreshold, 1);
                    
                    activeTab.style.transform = `translateY(${y}px)`;
                    
                    if (ptrSpinner) {
                        ptrSpinner.style.transform = `rotate(${y * 3}deg)`;
                    }
                } else {
                    // Reset if scrolled up
                    ptrActive = false;
                    ptr.style.transform = 'translateY(0)';
                    activeTab.style.transform = 'translateY(0)';
                    ptr.style.opacity = '0';
                }
            }, { passive: false });
            
            homeScreen.addEventListener('touchend', () => {
                if (!ptrActive) return;
                ptrActive = false;
                
                const activeTab = currentRole === 'worker' ? document.getElementById('home-worker-view') : document.getElementById('home-employer-view');
                if (!activeTab) return;
                
                const transformVal = ptr.style.transform;
                const match = transformVal.match(/translateY\((\d+\.?\d*)px\)/);
                const currentY = match ? parseFloat(match[1]) : 0;
                
                ptr.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                activeTab.style.transition = 'transform 0.3s ease';
                
                if (currentY >= ptrThreshold) {
                    // Trigger refresh loading state
                    ptr.style.transform = `translateY(${ptrThreshold}px)`;
                    activeTab.style.transform = `translateY(${ptrThreshold}px)`;
                    if (ptrSpinner) {
                        ptrSpinner.style.animation = 'spin 1s linear infinite';
                    }
                    
                    // Simulate loading / Trigger recalculation
                    setTimeout(() => {
                        // Refresh data
                        if (currentRole === 'worker') {
                            if (typeof initGPS === 'function') initGPS();
                            if (typeof refreshJobList === 'function') refreshJobList(true);
                        } else {
                            if (typeof renderEmployerHome === 'function') renderEmployerHome();
                        }
                        
                        // Slide back
                        ptr.style.transform = 'translateY(0)';
                        activeTab.style.transform = 'translateY(0)';
                        ptr.style.opacity = '0';
                        
                    }, 1200);
                } else {
                    // Slide back without action
                    ptr.style.transform = 'translateY(0)';
                    activeTab.style.transform = 'translateY(0)';
                    ptr.style.opacity = '0';
                }
            });
        }
        
        function sortWorkerJobs(mode) {
            activeSortMode = mode;
            document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
            const map = { distance: 'sort-dist', price: 'sort-price', newest: 'sort-new', urgent: 'sort-urg', date: 'sort-date' };
            const el = document.getElementById(map[mode]);
            if (el) el.classList.add('active');
            refreshJobList();
        }

        // ===================================================================
        // JOB DETAIL
        // ===================================================================
        
        function submitApplication(btn) {
            if (btn.disabled) return;
            btn.disabled = true;
            btn.style.opacity = '0.7';
            document.getElementById('apply-text').textContent = 'Feldolgozás...';
            document.getElementById('apply-spinner').style.display = 'block';
            
            setTimeout(() => {
                closeJobDetail();
                showToast('Jelentkezés elküldve!');
                // Reset button for next time
                btn.disabled = false;
                btn.style.opacity = '1';
                document.getElementById('apply-text').textContent = 'Jelentkezem a munkára';
                document.getElementById('apply-spinner').style.display = 'none';
            }, 1500);
        }

        function openJobDetailById(jobId) {
            const allJobs = window.mockJobs && window.mockJobs.length ? window.mockJobs : mockJobs;
            const job = allJobs.find(j => String(j.id) === String(jobId));
            if (!job) return;
            
            // Update gameState details for the current active job context
            gameState.jobTitle = job.title || '';
            gameState.jobPrice = job.price || 10000;
            gameState.jobDesc = job.desc || '';
            gameState.jobStreet = job.location || '';
            gameState.jobHouse = '';
            gameState.jobDistance = job.distance || 0.4;
            
            // Check if already applied to this specific job
            const app = localWorkerApplications.find(a => a.title === job.title);
            if (app) {
                gameState.applied = true;
                if (app.status === 'Függőben') {
                    gameState.status = 'Keresés';
                } else if (app.status === 'Aktív') {
                    gameState.status = 'Fizetve';
                } else if (app.status === 'Értékelésre vár') {
                    gameState.status = 'Befejezve';
                } else if (app.status === 'Befejezett') {
                    gameState.status = 'Kifizetve';
                } else {
                    gameState.status = app.status;
                }
            } else {
                gameState.applied = false;
                gameState.status = 'Keresés';
            }

            document.getElementById('worker-job-detail-title').innerText = job.title;
            document.getElementById('worker-job-detail-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('worker-job-detail-desc').innerText = job.desc;
            
            let locText = '📍 ' + job.location + ' (' + job.distance + ' km)';
            if (job.urgent) {
                locText += ' • 🚨 Sürgős!';
            }
            if (job.toolsRequired === 'worker') {
                locText += ' • 🔧 Munkás hozza';
            } else {
                locText += ' • 📦 Megbízó biztosítja';
            }
            document.getElementById('worker-job-detail-loc').innerText = locText;
            
            updateWorkerStatusUI();
            document.getElementById('worker-action-overlay').classList.add('active');
        }

        function openJobDetailFromMap() {
            if (selectedMapJob) openJobDetailById(selectedMapJob.id);
        }

        // ===================================================================
        // SEARCH OVERLAY
        // ===================================================================
        function openSearchOverlay() {
            document.getElementById('search-overlay').classList.add('open');
            onSearchInput(''); // Pre-populate with all jobs
            setTimeout(() => {
                const inp = document.getElementById('search-overlay-input');
                if (inp) { inp.value = ''; inp.focus(); }
            }, 300);
            onSearchInput('');
        }

        function closeSearchOverlay() {
            document.getElementById('search-overlay').classList.remove('open');
        }

        function onSearchInput(query) {
            const q = (query || '').toLowerCase().trim();
            const resultList = document.getElementById('search-results-list');
            if (!resultList) return;
            if (typeof mockJobs === 'undefined') { resultList.innerHTML = '<div class="search-empty">Betöltés...</div>'; return; }

            let filtered = mockJobs;
            if (q) {
                filtered = mockJobs.filter(j =>
                    j.title.toLowerCase().includes(q) ||
                    j.category.toLowerCase().includes(q) ||
                    j.location.toLowerCase().includes(q) ||
                    j.employer.toLowerCase().includes(q)
                );
            }

            if (filtered.length === 0) {
                resultList.innerHTML = '<div class="search-empty">Nem található ilyen munka. Próbálj más kulcsszót!</div>';
                return;
            }

            const label = q ? 'Találatok' : 'Összes közeli munka';
            resultList.innerHTML = '<div class="search-section-label">' + label + '</div>' + filtered.map(job => {
                const catInfo = catColors[job.category] || { bg: 'var(--color-text)' };
                return `
                    <div class="search-result-item" onclick="selectSearchResult(${job.id})">
                        <div class="search-result-icon" style="background:${catInfo.bg}20;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${catInfo.bg}" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div class="search-result-info">
                            <div class="search-result-title">${job.title}</div>
                            <div class="search-result-sub"><span class="job-distance-text">${job.distance}</span> km · ${job.employer} · ${job.category}</div>
                        </div>
                        <div class="search-result-price">${job.price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                `;
            }).join('');
        }

        function selectSearchResult(jobId) {
            closeSearchOverlay();
            setTimeout(() => openJobDetailById(jobId), 350);
        }

        // ===================================================================
        // DISTANCE SHEET
        // ===================================================================
        function openDistanceSheet() {
            const slider = document.getElementById('distance-slider');
            if (slider) slider.value = activeRadius;
            document.getElementById('distance-display-km').innerText = activeRadius;
            updateSliderTrack();
            document.getElementById('distance-sheet-backdrop').classList.add('open');
            document.getElementById('distance-sheet').classList.add('open');
        }

        function closeDistanceSheet() {
            document.getElementById('distance-sheet-backdrop').classList.remove('open');
            document.getElementById('distance-sheet').classList.remove('open');
        }

        function onDistanceSliderChange(val) {
            document.getElementById('distance-display-km').innerText = val;
            updateSliderTrack();
        }

        function updateSliderTrack() {
            const slider = document.getElementById('distance-slider');
            if (!slider) return;
            const pct = ((slider.value - 1) / (50 - 1)) * 100;
            slider.style.background = `linear-gradient(to right, var(--color-text) ${pct}%, #FFFFFF ${pct}%)`;
        }

        function confirmDistance() {
            const val = parseInt(document.getElementById('distance-slider').value);
            activeRadius = val;
            localStorage.setItem('melogo_radius', val);
            document.getElementById('distance-pill-text').innerText = val + ' km';
            closeDistanceSheet();
            refreshJobList();
            renderMapPins();
            showPushNotification('🗺️ Hatótáv frissítve', val + ' km körzetben keresünk munkákat!', 'var(--color-text)');
        }

        // ===================================================================
        // LEAFLET INTERACTIVE MAP
        // ===================================================================
        let leafletMap = null;
        let mapMarkers = [];
        let gpsMarker = null;

        function initLeafletMap() {
            const mapEl = document.getElementById('map-leaflet-container');
            if (!mapEl) return;
            
            leafletMap = L.map('map-leaflet-container', {
                zoomControl: false,
                tap: true,
                attributionControl: false
            }).setView([46.3593, 17.7967], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 18,
                minZoom: 10
            }).addTo(leafletMap);

            L.control.zoom({
                position: 'bottomright'
            }).addTo(leafletMap);

            leafletMap.on('click', () => {
                const mapCard = document.getElementById('map-preview-card');
                if (mapCard) mapCard.classList.remove('visible');
            });

            setTimeout(() => {
                leafletMap.invalidateSize();
            }, 100);
        }

        function renderMapPins() {
            if (!leafletMap) {
                initLeafletMap();
            }
            if (!leafletMap) return;

            mapMarkers.forEach(m => leafletMap.removeLayer(m));
            mapMarkers = [];

            if (gpsMarker) {
                leafletMap.removeLayer(gpsMarker);
                gpsMarker = null;
            }
            if (gameState.gpsActive && userCoords) {
                const gpsIcon = L.divIcon({
                    className: 'leaflet-gps-pin',
                    html: `<div class="user-gps-dot" style="width: 16px; height: 16px; background: var(--color-text); border: 2.5px solid #fff; border-radius: 50%;  animation: gps-pulse 2s infinite;"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                gpsMarker = L.marker([userCoords.lat, userCoords.lon], { icon: gpsIcon }).addTo(leafletMap);
            }

            const currentWorkerName = window.currentUser ? window.currentUser.name : '';
            const visibleJobs = mockJobs.filter(j => {
                const s = j.status || 'Keresés';
                if (s !== 'Keresés' && s !== 'Kereses') {
                    if (s === 'accepted') {
                        const hasActiveApp = localWorkerApplications.some(a => a.jobId === j.id && a.status === 'Aktív');
                        if (!hasActiveApp) return false;
                    } else {
                        return false;
                    }
                }
                const matchesDistance = (j.distance === null || j.distance <= activeRadius);
                const matchesCategory = (currentMapCategory === 'all' || j.category === currentMapCategory);
                return matchesDistance && matchesCategory;
            });

            visibleJobs.forEach(job => {
                if (!job.lat || !job.lon) return;

                const priceIcon = L.divIcon({
                    className: 'leaflet-custom-pin',
                    html: `<div class="map-pin-label" style="background:var(--color-text); color:white; padding:8px 12px; border-radius: 16px; font-weight: 500; font-size:12px; border:2px solid white;  cursor:pointer; pointer-events:auto; text-align:center; white-space:nowrap;">${job.price.toLocaleString('hu-HU')} Ft</div>`,
                    iconSize: [80, 36],
                    iconAnchor: [40, 18]
                });

                const marker = L.marker([job.lat, job.lon], { icon: priceIcon })
                    .addTo(leafletMap)
                    .on('click', () => {
                        onMapPinClick(job.id);
                    });

                mapMarkers.push(marker);
            });
        }

        function filterMapPins(cat, chipEl) {
            currentMapCategory = cat;
            document.querySelectorAll('.map-chip').forEach(c => c.classList.remove('active'));
            if (chipEl) chipEl.classList.add('active');

            renderMapPins();
            document.getElementById('map-preview-card').classList.remove('visible');
        }

        function onMapPinClick(jobId) {
            const job = mockJobs.find(j => String(j.id) === String(jobId));
            if (!job) return;

            const content = document.getElementById('map-preview-card-content');
            if (!content) return;

            content.innerHTML = `
                <div class="job-card-header" style="margin-bottom:8px;">
                    <div style="flex:1;">
                        <div class="job-title" style="font-size: 16px; font-weight: 500;">${job.title || 'Névtelen munka'}</div>
                        <div style="font-size:12px; color:var(--color-text-light); margin-top:2px;">${job.employer || 'Ismeretlen'}</div>
                    </div>
                    <div class="job-price" style="font-size: 18px;">${(Number(job.price) || 0).toLocaleString('hu-HU')} Ft</div>
                </div>
                <div class="job-card-badges" style="margin-bottom: 12px; display: flex; gap: 6px;">
                    <span class="job-badge-cat" style="background:var(--color-text); color:#fff; font-size:10px; padding:4px 8px; border-radius:12px;">${job.category || 'Egyéb'}</span>
                    ${job.urgent ? '<span class="job-badge-urgent" style="border: 1px solid var(--color-text); color: var(--color-text); font-size:10px; padding:4px 8px; border-radius:12px;">Sürgős</span>' : ''}
                </div>
                <div class="job-meta" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px;">
                    <div class="job-meta-item" style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--color-text);">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${job.distance !== null && job.distance !== undefined ? job.distance + ' km' : '? km'}</span>
                    </div>
                    <div class="job-meta-item" style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--color-text);">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>${getRelativeTime(job.time)}</span>
                    </div>
                    <div class="job-meta-item" style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--color-text);">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>
                        <span>${job.location && typeof job.location === 'string' ? job.location : 'Ismeretlen'}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    <button class="job-apply-btn" onclick="openJobDetailById('${job.id}')" style="flex: 1; height: 48px; background: var(--color-surface); color: var(--color-text); border: 1.5px solid var(--color-text); border-radius: 16px; font-size: 14px; font-weight: 500; cursor: pointer;">Részletek</button>
                    <button class="job-apply-btn" onclick="openJobDetailById('${job.id}'); setTimeout(() => document.getElementById('action-apply-btn').click(), 300);" style="flex: 1.5; height: 48px; background: var(--color-text); color: #FFFFFF; border: none; border-radius: 16px; font-size: 14px; font-weight: 500; cursor: pointer;">Jelentkezés →</button>
                </div>
            `;

            document.getElementById('map-preview-card').classList.add('visible');
        }

        // ===================================================================
        // GPS & LOCATION
        // ===================================================================
        function initGPS() {
            if (!navigator.geolocation) {
                setGPSStatus(false, 'GPS nem elérhető');
                return;
            }
            if (window.gpsWatchId) {
                navigator.geolocation.clearWatch(window.gpsWatchId);
            }
            window.gpsWatchId = navigator.geolocation.watchPosition(
                async (pos) => {
                    userCoords = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    };
                    if (!gameState.gpsActive) {
                        setGPSStatus(true, 'GPS Aktív');
                    } else {
                        recalculateJobDistances();
                        if (typeof updateJobCardsDistances === 'function') {
                            updateJobCardsDistances();
                        }
                        if (typeof renderMapPins === 'function') {
                            renderMapPins();
                        }
                    }
                },
                (err) => {
                    userCoords = null;
                    setGPSStatus(false, 'GPS letiltva');
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }

        function setGPSStatus(active, cityName) {
            if (gameState.gpsActive === active) return;
            gameState.gpsActive = active;
            const dot = document.getElementById('gps-dot');
            const label = document.getElementById('gps-city-label');
            const locText = document.getElementById('gps-location-text');
            if (!dot || !label) return;

            if (active) {
                dot.className = 'gps-dot';
                label.innerText = cityName;
                locText.className = 'gps-location';
            } else {
                dot.className = 'gps-dot off';
                label.innerText = cityName;
                locText.className = 'gps-location unknown';
                userCoords = null;
            }

            recalculateJobDistances();
            refreshJobList();
            renderMapPins();
        }

        function openLocationSheet() {
            document.getElementById('location-sheet-backdrop').classList.add('open');
            document.getElementById('location-sheet').classList.add('open');
        }

        function closeLocationSheet() {
            document.getElementById('location-sheet-backdrop').classList.remove('open');
            document.getElementById('location-sheet').classList.remove('open');
        }

        function selectManualCity(cityName, lat, lon) {
            // Stop watching GPS
            if (window.gpsWatchId) {
                navigator.geolocation.clearWatch(window.gpsWatchId);
                window.gpsWatchId = null;
            }
            
            userCoords = { lat: lat, lon: lon };
            setManualLocationStatus(cityName);
            closeLocationSheet();
            recalculateJobDistances();
            if (typeof updateJobCardsDistances === 'function') {
                updateJobCardsDistances();
            }
            if (typeof renderMapPins === 'function') {
                renderMapPins();
            }
            refreshJobList();
            showPushNotification('📍 Helyszín módosítva', 'Új helyszín: ' + cityName, 'var(--color-text)');
        }

        function setManualLocationStatus(cityName) {
            gameState.gpsActive = true;
            const dot = document.getElementById('gps-dot');
            const label = document.getElementById('gps-city-label');
            const locText = document.getElementById('gps-location-text');
            if (!dot || !label) return;

            dot.className = 'gps-dot manual';
            label.innerText = cityName + ' (Kézi)';
            locText.className = 'gps-location';
        }

        function useGpsFromLocationSheet() {
            closeLocationSheet();
            initGPS();
            showPushNotification('🛰️ GPS bekapcsolva', 'Keresünk GPS jel alapján...', 'var(--color-text)');
        }

        function searchManualCity() {
            const input = document.getElementById('manual-city-input');
            const btn = document.getElementById('manual-city-search-btn');
            const sugg = document.getElementById('manual-city-suggestions');
            const err = document.getElementById('manual-city-error');
            if (!input || !btn) return;
            
            const q = input.value.trim();
            if (q.length < 2) {
                if (err) {
                    err.innerText = "Kérlek írj be legalább 2 karaktert!";
                    err.style.display = "block";
                }
                return;
            }
            
            if (err) err.style.display = "none";
            if (sugg) sugg.style.display = "none";
            
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-small" style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;"></span>';
            
            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`, {
                headers: { 'Accept-Language': 'hu' }
            })
            .then(res => res.json())
            .then(data => {
                btn.disabled = false;
                btn.innerText = "Keresés";
                
                if (!data || data.length === 0) {
                    if (err) {
                        err.innerText = "Nem található ilyen cím vagy település.";
                        err.style.display = "block";
                    }
                    return;
                }
                
                // Automatically confirm and select the top match immediately
                const topResult = data[0];
                const displayName = topResult.display_name.split(',')[0].trim();
                selectManualCity(displayName, parseFloat(topResult.lat), parseFloat(topResult.lon));
            })
            .catch(e => {
                console.error("Geocoding error", e);
                btn.disabled = false;
                btn.innerText = "Keresés";
                if (err) {
                    err.innerText = "Hálózati hiba a keresés során.";
                    err.style.display = "block";
                }
            });
        }



        // ===================================================================
        // WORKER PROFILE OVERLAY FOR EMPLOYER
        // ===================================================================
        async function openWorkerProfile(workerName, workerUid) {
            const currentUser = loadCurrentUser();
            const currentUserName = currentUser ? currentUser.name : "Diák";
            const name = workerName || currentUserName;
            
            document.getElementById('wp-name').innerText = name;
            
            // Default mockup fallback values
            let completedJobs = 14;
            let rating = 4.9;
            let bio = "Üdv! A Kaposvári Egyetem diákja vagyok. Szívesen vállalok fűnyírást és autómosást hétvégenként. Megbízható és pontos vagyok.";
            let skills = ['Kertészet', 'Autómosás', 'Takarítás'];
            let trustBadge = "Megbízható Diák";
            let avatar = null;
            
            // Try to fetch real profile data from Firestore
            if (window.firebaseAPI && window.firebaseDb) {
                try {
                    let userDoc = null;
                    if (workerUid) {
                        const snap = await window.firebaseAPI.getDoc(window.firebaseAPI.doc(window.firebaseDb, "users", workerUid));
                        if (snap.exists()) userDoc = snap;
                    }
                    if (!userDoc) {
                        const q = window.firebaseAPI.query(
                            window.firebaseAPI.collection(window.firebaseDb, "users"), 
                            window.firebaseAPI.where("name", "==", name)
                        );
                        const querySnapshot = await window.firebaseAPI.getDocs(q);
                        if (!querySnapshot.empty) userDoc = querySnapshot.docs[0];
                    }
                    
                    if (userDoc) {
                        const data = userDoc.data();
                        
                        bio = data.bio || bio;
                        skills = data.skills || skills;
                        avatar = data.photoURL || avatar;
                        
                        completedJobs = data.jobCount !== undefined ? data.jobCount : completedJobs;
                        rating = data.rating !== undefined ? data.rating : rating;
                        
                        if (completedJobs >= 15 && rating >= 4.7) trustBadge = "Prémium Diák";
                        else if (completedJobs >= 8 && rating >= 4.3) trustBadge = "Tapasztalt Diák";
                        else if (completedJobs >= 3 && rating >= 4.0) trustBadge = "Megbízható Diák";
                        else trustBadge = "Kezdő Diák";
                    }
                } catch(e) {
                    console.error("Error fetching worker profile from Firestore:", e);
                }
            }
            
            // Also override with local active user details if looking up oneself
            if (name === currentUserName) {
                completedJobs = currentUser.jobCount !== undefined ? currentUser.jobCount : completedJobs;
                rating = currentUser.rating !== undefined ? currentUser.rating : rating;
                bio = currentUser.bio || bio;
                skills = currentUser.skills || skills;
                avatar = currentUser.photoURL || avatar;
                
                if (completedJobs >= 15 && rating >= 4.7) trustBadge = "Prémium Diák";
                else if (completedJobs >= 8 && rating >= 4.3) trustBadge = "Tapasztalt Diák";
                else if (completedJobs >= 3 && rating >= 4.0) trustBadge = "Megbízható Diák";
                else trustBadge = "Kezdő Diák";
            }
            
            // Render on overlay
            document.getElementById('wp-completed-count').innerText = completedJobs;
            document.getElementById('wp-stars').innerText = rating.toFixed(1);
            document.getElementById('wp-bio').innerText = '"' + bio + '"';
            document.getElementById('wp-trust-badge').innerText = trustBadge;
            
            // Avatar display with initials fallback if Base64 photo is not available
            const avatarImg = document.getElementById('wp-avatar');
            const wpFallback = document.getElementById('wp-avatar-fallback');
            
            if (avatarImg && wpFallback) {
                let finalAvatar = avatar;
                if (!finalAvatar && window.avatarCache && window.avatarCache[name]) {
                    finalAvatar = window.avatarCache[name];
                }

                if (finalAvatar && (finalAvatar.startsWith('data:image') || finalAvatar.startsWith('http'))) {
                    avatarImg.src = finalAvatar;
                    avatarImg.style.display = 'block';
                    wpFallback.style.display = 'none';
                } else {
                    avatarImg.style.display = 'none';
                    wpFallback.style.display = 'flex';
                    wpFallback.innerText = finalAvatar ? finalAvatar : getInitials(name);
                    wpFallback.style.backgroundColor = getAvatarColor(name);
                }
            } else if (avatarImg) {
                if (avatar) avatarImg.src = avatar;
            }
            
            // Render Skills
            const wpSkills = document.getElementById('wp-skills');
            if (wpSkills) {
                wpSkills.innerHTML = skills.map(s => `
                    <span class="profile-skill-chip" style="background: var(--color-surface); border:0.5px solid var(--color-border); padding: 6px 12px; border-radius: 16px; font-size:11px; font-weight: 400; display:inline-flex; align-items:center; gap:6px;">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M3 12h1M20 12h1M12 3v1M12 20v1"/></svg>
                        ${s}
                    </span>
                `).join('');
            }
            
            // Render Reviews (last 5)
            const reviewsContainer = document.getElementById('wp-reviews-container');
            if (reviewsContainer) {
                let reviews = [];
                if (name === currentUserName && currentUser.reviews && currentUser.reviews.length > 0) {
                    reviews = currentUser.reviews.slice(0, 5);
                } else {
                    reviews = [
                        { name: 'Nagy Gábor (Megbízó)', stars: 5, date: '2026. máj. 24.', text: 'Nagyon pontosan érkezett, és a megbeszéltek szerint hihetetlenül precíz munkát végzett! Csak ajánlani tudom.' },
                        { name: 'Kiss Mária (Megbízó)', stars: 5, date: '2026. máj. 18.', text: 'Nagyon barátságos diák, gyorsan és hatékonyan dolgozott. Köszönöm a segítséget!' },
                        { name: 'Molnár István (Megbízó)', stars: 4, date: '2026. máj. 10.', text: 'Elégedett vagyok a munkájával, kicsit késett az egyeztetett időpontról, de pótolta a kiesett időt.' },
                        { name: 'Szabó Éva (Megbízó)', stars: 5, date: '2026. ápr. 28.', text: 'Kiváló kommunikáció és professzionális teljesítés. Minden a megbeszéltek szerint zajlott.' },
                        { name: 'Kovács Edit (Megbízó)', stars: 5, date: '2026. ápr. 15.', text: 'Szuperül és gyorsan elvégezte a feladatot. Biztosan fogom még hívni!' }
                    ];
                }
                
                reviewsContainer.innerHTML = reviews.map((r, i) => {
                    const activeStars = '⭐'.repeat(r.stars || r.rating || 5);
                    const reviewerName = r.name || r.reviewer || 'Megbízó';
                    const reviewDate = r.date || new Date().toLocaleDateString('hu-HU');
                    const reviewText = r.text || 'Kiváló és megbízható munka! Köszönöm.';
                    const isLast = i === reviews.length - 1;
                    const borderStyle = isLast ? '' : 'border-bottom: 1px solid var(--color-border); padding-bottom: 14px; margin-bottom: 14px;';
                    return `
                        <div style="${borderStyle}">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                                <div style="font-size: 13px; font-weight: 500; color: var(--color-text);">${reviewerName}</div>
                                <div style="font-size: 11px; color: var(--color-text);">${reviewDate}</div>
                            </div>
                            <div style="font-size: 12px; margin-bottom: 6px;">${activeStars}</div>
                            <div style="font-size: 13px; color: var(--color-text); line-height:1.5;">${reviewText}</div>
                        </div>
                    `;
                }).join('');
            }
            
            document.getElementById('worker-profile-overlay').classList.add('open');
        }

        // ===================================================================
        // CHAT
        // ===================================================================
        let currentChatMessages = [];

        // Active chat messages listener (Firestore subcollection)
        window._chatMsgsUnsubscribe = null;
        window._chatMsgIds = new Set();
        function renderActiveChatMessages(chatId) {
            if (!chatId || !window.firebaseAPI || !window.firebaseDb) return;
            // Unsubscribe from previous listener
            if (window._chatMsgsUnsubscribe) { window._chatMsgsUnsubscribe(); window._chatMsgsUnsubscribe = null; }
            const msgsQuery = window.firebaseAPI.query(
                window.firebaseAPI.collection(window.firebaseDb, 'chats', chatId, 'messages'),
                window.firebaseAPI.orderBy('timestamp', 'asc')
            );
            window._chatMsgIds.clear();
            window._chatMsgsUnsubscribe = window.firebaseAPI.onSnapshot(msgsQuery, (snapshot) => {
                const msgContainer = document.getElementById('chat-detail-messages');
                if (!msgContainer) return;
                // Only re-render if this is still the selected chat
                if (window.selectedChatId !== chatId) return;
                
                const curUid = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : null;
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const msgId = change.doc.id;
                        if (window._chatMsgIds.has(msgId)) return;
                        window._chatMsgIds.add(msgId);
                        
                        const msg = change.doc.data();
                        if (msg.type === 'system') {
                            const pill = document.createElement('div');
                            pill.style.cssText = 'background:#f3f4f6;color:#6b7280;padding:6px 14px;border-radius:99px;font-size:11px;font-weight: 400;text-align:center;margin:8px auto;max-width:80%;display:block;';
                            pill.innerText = msg.text;
                            msgContainer.appendChild(pill);
                        } else {
                            const isMine = curUid ? (msg.senderId === curUid) : false;
                            const bubble = document.createElement('div');
                            const now = msg.timestamp ? new Date(msg.timestamp.toDate ? msg.timestamp.toDate() : msg.timestamp) : new Date();
                            const t = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
                            bubble.style.cssText = isMine
                                ? 'max-width:80%;padding:10px 14px;border-radius:18px 18px 4px 18px;background:var(--color-text);color:#fff;font-size:14px;align-self:flex-end;'
                                : 'max-width:80%;padding:10px 14px;border-radius:18px 18px 18px 4px;background:#f3f4f6;color:var(--color-text);font-size:14px;align-self:flex-start;';
                            bubble.innerHTML = escapeHTML(msg.text) + `<div style="font-size:10px;opacity:0.5;margin-top:4px;text-align:${isMine?'right':'left'}">${t}</div>`;
                            msgContainer.appendChild(bubble);
                        }
                    }
                });
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, err => console.error('[Firestore] Messages listener error:', err));
        }
        
        window.closeChatRoom = function() {
            document.getElementById('chat-detail-overlay').classList.remove('open');
            document.getElementById('chat-detail-overlay').style.transform = 'translateX(100%)';
            window.selectedChatId = null;
            selectedChatId = null;
            if (window._chatMsgsUnsubscribe) {
                window._chatMsgsUnsubscribe();
                window._chatMsgsUnsubscribe = null;
            }
        };

        function openChat(name, jobTitle, lastMsg, time, isUnread, chatId) {
            selectedChatId = chatId;
            window.selectedChatId = chatId;
            document.getElementById('chat-detail-name').innerText = name || 'Ismeretlen';
            document.getElementById('chat-detail-job').innerText = jobTitle || '';
            
            const avatarImg = document.getElementById('chat-detail-avatar');
            const avatarFallback = document.getElementById('chat-detail-avatar-fallback');
            if (avatarImg && avatarFallback && window.avatarCache && window.avatarCache[name]) {
                const photoURL = window.avatarCache[name];
                if (photoURL && typeof photoURL === 'string' && (photoURL.startsWith('http') || photoURL.startsWith('data:'))) {
                    avatarImg.src = photoURL;
                    avatarImg.style.display = 'block';
                    avatarFallback.style.display = 'none';
                } else {
                    avatarImg.style.display = 'none';
                    avatarFallback.style.display = 'block';
                    avatarFallback.innerText = photoURL;
                    document.getElementById('chat-detail-avatar-container').style.backgroundColor = getAvatarColor(name);
                }
            } else if (avatarImg && avatarFallback) {
                avatarImg.style.display = 'none';
                avatarFallback.style.display = 'block';
                avatarFallback.innerText = (name || 'I').substring(0,2).toUpperCase();
                document.getElementById('chat-detail-avatar-container').style.backgroundColor = getAvatarColor(name || 'Ismeretlen');
            }
            
            // Populate chat pinned summary info bar dynamically
            let matchedJob = localEmployerJobs.find(j => j.title === jobTitle);
            let jobTimeStr = '';
            
            if (matchedJob) {
                jobTimeStr = matchedJob.datetime || matchedJob.time || '';
            } else {
                // Check mockJobs
                const mock = mockJobs.find(j => j.title === jobTitle);
                if (mock) {
                    matchedJob = {
                        location: mock.location,
                        price: mock.price,
                        title: mock.title,
                        time: mock.time
                    };
                    jobTimeStr = mock.time || '';
                } else {
                    // Check localWorkerApplications
                    const app = localWorkerApplications.find(a => a.title === jobTitle);
                    if (app) {
                        jobTimeStr = app.date || app.datetime || '';
                    }
                }
            }
            
            // Format if it is YYYY-MM-DDTHH:MM
            if (jobTimeStr && jobTimeStr.includes('T')) {
                try {
                    const parts = jobTimeStr.split('T');
                    const dateParts = parts[0].split('-');
                    const timeParts = parts[1].split(':');
                    
                    const year = dateParts[0];
                    const month = parseInt(dateParts[1]);
                    const day = dateParts[2];
                    const hour = timeParts[0];
                    const minute = timeParts[1];
                    
                    const monthNames = ['jan.', 'feb.', 'már.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'];
                    const monthName = monthNames[month - 1] || '';
                    
                    jobTimeStr = `${year}. ${monthName} ${day}. ${hour}:${minute}`;
                } catch(e) {
                    // fall back to raw if error
                }
            }
            
            const datetimeEl = document.getElementById('chat-detail-datetime');
            if (datetimeEl) {
                datetimeEl.innerText = jobTimeStr ? jobTimeStr : 'Nincs megadva időpont';
                datetimeEl.style.display = jobTimeStr ? 'block' : 'none';
            }
            
            const pinnedAddr = document.getElementById('chat-pinned-address');
            const pinnedPrice = document.getElementById('chat-pinned-price');
            const pinnedJob = document.getElementById('chat-pinned-job');
            
            if (pinnedAddr) pinnedAddr.innerText = (matchedJob && matchedJob.location) ? matchedJob.location : 'Kaposvár';
            if (pinnedPrice) pinnedPrice.innerText = (matchedJob && matchedJob.price !== undefined) ? (matchedJob.price.toLocaleString('hu-HU') + ' Ft') : '12 000 Ft';
            if (pinnedJob) pinnedJob.innerText = jobTitle || 'Munka';

            const msgContainer = document.getElementById('chat-detail-messages');

            // Build simulated conversation dynamically based on job status or load persisted messages
            let msgs = [];
            const chat = localChats.find(c => c.id === chatId);
            
            if (chat && chat.messages && !chat.isFirestore) {
                msgs = [...chat.messages]; // Use copy to avoid side-effects
            } else if (!chat || !chat.isFirestore) {
                const isEmployer = (currentRole === 'employer');
                if (jobTitle === gameState.jobTitle && gameState.applied) {
                    msgs = [
                        { from: isEmployer ? 'other' : 'me', text: 'Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?', time: '14:00' }
                    ];
                } else {
                    msgs = [
                        { from: isEmployer ? 'me' : 'other', text: 'Szia! Elvállalnád a munkát?', time: '10:00' },
                        { from: isEmployer ? 'other' : 'me', text: 'Szia! Igen, szívesen! Mikor kell?', time: '10:05' },
                        { from: isEmployer ? 'me' : 'other', text: lastMsg || 'Mikor tudnál jönni holnap?', time: time || '10:42' },
                    ];
                }
                if (chat) {
                    chat.messages = msgs;
                    saveLocalChats();
                }
            }

            if (jobTitle === gameState.jobTitle && gameState.applied) {
                const isEmployer = (currentRole === 'employer');
                const acceptText = isEmployer ? '✨ Elfogadtad a jelentkezést' : '✨ A megbízó elfogadta a jelentkezést';
                
                if (gameState.status !== 'Keresés') {
                    if (!msgs.some(m => m.from === 'system' && m.text === acceptText)) {
                        msgs.push({ from: 'system', text: acceptText });
                    }
                }
                
                if (gameState.status === 'Befejezve' || gameState.status === 'Kifizetve' || gameState.status === 'Értékelve') {
                    const compText = isEmployer ? '📸 A diák késznek jelölte a munkát' : '📸 Késznek jelölted a munkát';
                    if (!msgs.some(m => m.from === 'system' && m.text === compText)) {
                        msgs.push({ from: 'system', text: compText });
                    }
                }
                if (gameState.status === 'Értékelve' || gameState.status === 'Kifizetve') {
                    const starsValue = (localWorkerApplications.find(a => a.title === jobTitle) || {}).rating || 5;
                    const payText = `✅ Munka lezárva és értékelve<br><span style="font-size: 16px;">${starsHtml(starsValue)}</span>`;
                    if (!msgs.some(m => m.from === 'system' && m.text.includes('Sikeres kifizetés'))) {
                        msgs.push({ from: 'system', text: payText });
                    }
                }
            }

            msgContainer.innerHTML = '<div style="font-size: 12px; font-weight: 500; color: #9CA3AF; text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">MA</div>';

            msgs.forEach(msg => {
                const bubble = document.createElement('div');
                if (msg.from === 'system') {
                    bubble.style.cssText = 'background: #F8F9FB; border: 1px solid #D1D5DB; color: #080C1E; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 400; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
                    bubble.innerHTML = escapeHTML(msg.text);
                } else {
                    let isMe = false;
                    if (msg.from === 'me') {
                        isMe = true;
                    } else if (msg.from === 'other') {
                        isMe = false;
                    } else {
                        isMe = (msg.from === currentRole);
                    }
                    bubble.style.cssText = `
                        max-width:80%; padding:10px 14px; border-radius:${isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
                        background:${isMe ? 'var(--color-navy)' : '#fff'};
                        color:${isMe ? '#fff' : 'var(--color-navy)'};
                        font-size:14px; align-self:${isMe ? 'flex-end' : 'flex-start'};
                        
                    `;
                    bubble.innerHTML = escapeHTML(msg.text) + (msg.time ? `<div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">${msg.time}</div>` : '');
                }
                msgContainer.appendChild(bubble);
            });

            msgContainer.scrollTop = msgContainer.scrollHeight;
            document.getElementById('chat-detail-overlay').classList.add('open');
            document.getElementById('chat-detail-overlay').style.transform = 'translateX(0)';
            updateChatActionBar(jobTitle);

            const input = document.getElementById('chat-reply-input');
            if (input) {
                input.value = '';
                handleChatInput(input);
            }

            // Start real-time Firestore messages subcollection listener
            const _activatedChat = localChats.find(c => c.id === chatId);
            if (_activatedChat && _activatedChat.isFirestore && typeof renderActiveChatMessages === 'function') {
                renderActiveChatMessages(chatId);
            }
        }

        function handleChatInput(el) {
            // Auto resize textarea up to 120px
            el.style.height = '36px'; // reset
            const scrollHeight = el.scrollHeight;
            el.style.height = Math.min(120, Math.max(36, scrollHeight)) + 'px';

            // Enable/disable send button dynamically
            const btn = document.getElementById('chat-send-btn');
            if (btn) {
                const text = el.value.trim();
                if (text.length > 0) {
                    btn.style.background = 'var(--color-green)';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.disabled = false;
                } else {
                    btn.style.background = '#E5E7EB';
                    btn.style.color = '#9CA3AF';
                    btn.style.cursor = 'not-allowed';
                    btn.disabled = true;
                }
            }
        }

        function showTypingIndicator(partnerName, durationMs) {
            const indicator = document.getElementById('chat-typing-indicator');
            const nameEl = document.getElementById('chat-typing-name');
            const msgContainer = document.getElementById('chat-detail-messages');
            if (indicator && nameEl && msgContainer) {
                nameEl.innerText = partnerName;
                indicator.style.display = 'flex';
                // Remove and re-append so it's always at the bottom of the container
                msgContainer.appendChild(indicator);
                msgContainer.scrollTop = msgContainer.scrollHeight;

                if (window._typingTimer) clearTimeout(window._typingTimer);
                window._typingTimer = setTimeout(() => {
                    indicator.style.display = 'none';
                    window._typingTimer = null;
                }, durationMs || 3000);
            }
        }

        function sendChatMessageNew() {
            const input = document.getElementById('chat-reply-input');
            const text = input.value.trim();
            if (!text) return;

            const msgContainer = document.getElementById('chat-detail-messages');
            // Only append manual bubble if NOT firestore (otherwise onSnapshot handles it)
            if (!selectedChatId || !localChats.find(c => c.id === selectedChatId)?.isFirestore) {
                const bubble = document.createElement('div');
                const now = new Date();
                const t = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

                bubble.style.cssText = `
                    max-width:80%; padding:10px 14px; border-radius: 18px 18px 4px 18px;
                    background:var(--color-navy); color:#fff; font-size:14px;
                    align-self:flex-end; 
                `;
                bubble.innerHTML = text + `<div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">${t}</div>`;
                msgContainer.appendChild(bubble);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }

            // Reset input and its height/send button state
            input.value = '';
            handleChatInput(input);

            // Persist sent message inside localChats and trigger save/sync!
            if (selectedChatId) {
                const chat = localChats.find(c => c.id === selectedChatId);
                if (chat) {
                    if (!chat.messages) chat.messages = [];
                    const senderRole = currentRole || localStorage.getItem('melogo_active_role') || 'worker';
                    const senderId = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : senderRole;
                    chat.messages.push({ from: senderRole, senderId: senderId, text: text, time: t });
                    chat.lastMsg = text;
                    chat.time = 'Most';
                    chat.updatedAt = Date.now();

                    if (chat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                        // Write to subcollection for real-time sync
                        window.firebaseAPI.addDoc(
                            window.firebaseAPI.collection(window.firebaseDb, "chats", chat.id, "messages"),
                            { senderId: senderId, text: text, timestamp: window.firebaseAPI.serverTimestamp(), type: 'user' }
                        ).catch(e => console.error("Firestore message add error:", e));
                        window.firebaseAPI.updateDoc(
                            window.firebaseAPI.doc(window.firebaseDb, "chats", chat.id),
                            { lastMsg: text, time: 'Most', updatedAt: window.firebaseAPI.serverTimestamp() }
                        ).catch(e => console.error("Firestore chat lastMsg update error:", e));
                    }
                    saveLocalChats();
                    renderChatList();
                }
            }
        }

        function triggerPhotoAttach() {
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
                    bubble.style.cssText = `
                        max-width:85%; padding:10px; border-radius: 18px 18px 4px 18px;
                        background:var(--color-navy); color:#fff; font-size:14px;
                        align-self:flex-end; 
                    `;
                    const photoHtml = `<img src="${dataUrl}" style="width:100%; max-height:200px; object-fit:cover; border-radius:8px; display:block;"><div style="font-size:11px; margin-top:6px; opacity:0.7;">Munka fotója elküldve</div>`;
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
        }
        function showPushNotification(title, msg, color) {
            const banner = document.getElementById('push-banner');
            const icon = document.getElementById('push-banner-icon');
            document.getElementById('push-banner-title').innerText = title;
            document.getElementById('push-banner-msg').innerText = msg;
            if (icon && color) icon.style.background = color;
            banner.classList.add('show');
            setTimeout(() => banner.classList.remove('show'), 4000);
        }

        // ===================================================================
        // INIT ON LOAD
        // ===================================================================
        const _oldOnLoad = window.onload;
        window.onload = function() {
            if (_oldOnLoad) _oldOnLoad();

            // Init distance pill
            document.getElementById('distance-pill-text').innerText = activeRadius + ' km';

            // Init slider track
            const slider = document.getElementById('distance-slider');
            if (slider) {
                slider.value = activeRadius;
                updateSliderTrack();
            }

            // Init GPS
            initGPS();

            // Render jobs
            refreshJobList();

            // Render map pins
            renderMapPins();

            // Show welcome push notification after 2.5 seconds
            setTimeout(() => {
                const activeJobsCount = (typeof getFilteredAndSortedJobs === 'function') ? getFilteredAndSortedJobs().length : mockJobs.length;
                showPushNotification('🏠 Üdv a MeloGo-ban!', activeJobsCount + ' munka a közeledben · ' + activeRadius + ' km körzetben', 'var(--color-text)');
            }, 2500);
        };




        // ================================================================
        // AUTO-SAVE SYSTEM
        // ================================================================
        const autoSaveTimers = {};
        const autoSaveIndicators = {};

        function initAutoSave() {
            // Find all inputs, textareas, selects that have an ID
            const formEls = document.querySelectorAll('input[id], textarea[id], select[id]');
            formEls.forEach(el => {
                // Restore saved value
                const saved = localStorage.getItem('as_' + el.id);
                if (saved !== null && el.type !== 'submit' && el.type !== 'button') {
                    if (el.type === 'checkbox') {
                        el.checked = saved === 'true';
                    } else {
                        el.value = saved;
                    }
                }
                // Listen for changes
                el.addEventListener('input', () => {
                    clearTimeout(autoSaveTimers[el.id]);
                    autoSaveTimers[el.id] = setTimeout(() => {
                        localStorage.setItem('as_' + el.id, el.value);
                        showAutoSaveIndicator(el);
                    }, 500);
                });
            });
            console.log('[AutoSave] Initialized on', formEls.length, 'elements');
        }

        function showAutoSaveIndicator(triggerEl) {
            // Show "Mentve" in the nearest settings-overlay parent or form overlay
            let container = triggerEl.closest('.settings-overlay, .action-overlay, #employer-form-overlay');
            if (!container) return;
            let indicator = container.querySelector('.autosave-indicator');
            if (!indicator) return;
            indicator.classList.add('show');
            clearTimeout(indicator._hideTimer);
            indicator._hideTimer = setTimeout(() => indicator.classList.remove('show'), 1500);
        }

        // ================================================================
        // NEW APPLY BUTTON HANDLER
        // ================================================================
        function openApplySheet() {
            const btn = document.getElementById('worker-apply-btn');
            if (!btn || btn.classList.contains('loading') || btn.classList.contains('confirmed') || btn.classList.contains('applied')) return;
            document.getElementById('worker-apply-message').value = '';
            document.getElementById('worker-apply-sheet-backdrop').classList.add('open');
            document.getElementById('worker-apply-sheet').classList.add('open');
        }

        function closeApplySheet() {
            document.getElementById('worker-apply-sheet-backdrop').classList.remove('open');
            document.getElementById('worker-apply-sheet').classList.remove('open');
        }

        function submitWorkerApplyFromSheet() {
            closeApplySheet();
            
            const btn = document.getElementById('worker-apply-btn');
            if (!btn) return;

            // Loading state
            btn.classList.add('loading');
            btn.innerHTML = '<div class="btn-spinner"></div> Küldés...';

            setTimeout(() => {
                // Call original apply function
                workerApplyToJob();

                // Confirmed state
                btn.classList.remove('loading');
                btn.classList.add('confirmed');
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Jelentkezve ✓';

                // Push notification
                const _applyUser = loadCurrentUser(); 
                showPushNotification('📩 ' + (_applyUser ? _applyUser.name : 'Valaki') + ' jelentkezett', 'A munkádra: ' + (gameState.jobTitle || 'Fűnyírás'), 'var(--color-text)');
            }, 1000);
        }

        function updateApplyBtnState() {
            const btn = document.getElementById('worker-apply-btn');
            if (!btn) return;
            if (gameState.applied) {
                btn.classList.add('applied');
                btn.classList.remove('loading', 'confirmed');
                if (gameState.status === 'Keresés') {
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Jelentkezve ✓';
                } else if (gameState.status === 'Fizetve') {
                    btn.innerHTML = '📅 Indulás a munkára!';
                }
            }
        }

        // ================================================================
        // EMPLOYER FORM — NEW FUNCTIONS
        // ================================================================
        let empActiveCat = 'Kert';
        let activeToolsRequired = 'employer';

        function selectToolsRequired(type) {
            activeToolsRequired = type;
            const btnEmp = document.getElementById('tools-btn-employer');
            const btnWork = document.getElementById('tools-btn-worker');
            if (!btnEmp || !btnWork) return;
            
            if (type === 'employer') {
                btnEmp.style.background = 'var(--color-text)';
                btnEmp.style.color = '#fff';
                btnEmp.style.border = '2px solid var(--color-text)';
                
                btnWork.style.background = '#FFFFFF';
                btnWork.style.color = 'var(--color-text)';
                btnWork.style.border = '2px solid #FFFFFF';
            } else {
                btnWork.style.background = 'var(--color-text)';
                btnWork.style.color = '#fff';
                btnWork.style.border = '2px solid var(--color-text)';
                
                btnEmp.style.background = '#FFFFFF';
                btnEmp.style.color = 'var(--color-text)';
                btnEmp.style.border = '2px solid #FFFFFF';
            }
        }

        function toggleUrgentJob(isChecked) {
            const track = document.getElementById('urgent-track');
            const thumb = document.getElementById('urgent-thumb');
            if (track && thumb) {
                if (isChecked) {
                    track.style.background = '#F59E0B'; // Amber
                    thumb.style.transform = 'translateX(22px)';
                } else {
                    track.style.background = '#FFFFFF'; // Gray
                    thumb.style.transform = 'translateX(0)';
                }
            }
        }
        function selectEmpCat(cat) {
            empActiveCat = cat;
            // Also call original function for compatibility
            selectEmployerFormCat(cat);
            
            document.querySelectorAll('.emp-cat-card').forEach(c => c.classList.remove('active'));
            const el = document.getElementById('emp-cat-' + cat);
            if (el) el.classList.add('active');
            
            // Update picker label to first item of this category
            if (typeof jobCatalog !== 'undefined' && jobCatalog[cat]) {
                const firstItem = jobCatalog[cat][0];
                const label = document.getElementById('emp-job-picker-label');
                if (label) label.textContent = firstItem.name;
                updateEmpPriceFromJob(firstItem.name);
            }
        }

        function openJobPickerNew() {
            // Open a bottom sheet with the job options for the selected category
            const items = (typeof jobCatalog !== 'undefined' && jobCatalog[empActiveCat]) ? jobCatalog[empActiveCat] : [];
            const sheetId = 'emp-job-picker-sheet';
            
            // Remove old sheet if exists
            const oldSheet = document.getElementById(sheetId);
            if (oldSheet) oldSheet.remove();
            
            const backdrop = document.createElement('div');
            backdrop.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:8000;';
            backdrop.onclick = () => { backdrop.remove(); sheet.remove(); };
            
            const sheet = document.createElement('div');
            sheet.id = sheetId;
            sheet.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background: var(--color-surface);border-top-left-radius:24px;border-top-right-radius:24px;z-index:8001;padding:20px;max-height:70%;overflow-y:auto;';
            sheet.innerHTML = '<div style="width:36px;height:4px;background: var(--color-surface);border-radius:2px;margin:0 auto 16px;"></div><div style="font-size:16px;font-weight: 500;color: var(--color-text);margin-bottom:16px;">' + empActiveCat + ' munkák</div>';
            
            items.forEach(item => {
                const row = document.createElement('div');
                row.style.cssText = 'padding:14px 0;/* removed */display:flex;justify-content:space-between;align-items:center;cursor:pointer;';
                row.innerHTML = '<span style="font-size:14px;color: var(--color-text);font-weight: 300;">' + item.name + '</span><span style="font-size:13px;color: var(--color-text);font-weight: 400;">' + item.price.toLocaleString('hu-HU') + ' Ft</span>';
                row.onclick = () => {
                    const label = document.getElementById('emp-job-picker-label');
                    if (label) label.textContent = item.name;
                    // Update hidden select
                    const sel = document.getElementById('emp-job-select');
                    if (sel) {
                        sel.value = item.name;
                    }
                    updateEmpPriceFromJob(item.name);
                    backdrop.remove();
                    sheet.remove();
                };
                sheet.appendChild(row);
            });
            
            const phoneApp = document.getElementById('phone-app');
            if (phoneApp) { phoneApp.appendChild(backdrop); phoneApp.appendChild(sheet); }
        }

        function updateEmpDescCounter(el) {
            const counter = document.getElementById('emp-desc-counter');
            if (counter) counter.textContent = el.value.length + ' / 300';
        }

        function updateEmpPriceDisplay(val) {
            const n = parseInt(val) || 0;
            const display = document.getElementById('emp-price-display');
            if (display) display.textContent = n.toLocaleString('hu-HU');
        }

        function onEmpJobSelectChange(val) {
            // Update the label span for compatibility
            const lbl = document.getElementById('emp-job-picker-label');
            if (lbl) lbl.textContent = val;
            // Update price
            updatePredefinedJobPrice(val);
            updateEmpPriceFromJob(val);
            // ÚJ: szintválasztó frissítése
            updateTutorLevelSelect();
        }

        function updateEmpPriceFromJob(jobName) {
            if (typeof jobCatalog === 'undefined') return;
            let price = 12000;
            for (const cat in jobCatalog) {
                const match = jobCatalog[cat].find(j => j.name === jobName);
                if (match) { price = match.price; break; }
            }
            const inp = document.getElementById('emp-price-input');
            const lbl = document.getElementById('emp-recommended-label');
            if (inp) inp.value = price;
            if (lbl) lbl.textContent = 'Ajánlott piaci ár: ' + price.toLocaleString('hu-HU') + ' Ft';
            updateEmpPriceDisplay(price);
        }

        function focusEmpPrice() {
            const inp = document.getElementById('emp-price-input');
            if (inp) inp.focus();
        }

        function adjustEmpPrice(delta) {
            const inp = document.getElementById('emp-price-input');
            if (!inp) return;
            const cur = parseInt(inp.value) || 0;
            inp.value = Math.max(1000, cur + delta);
            updateEmpPriceDisplay(inp.value);
        }



        
        const MOCK_ADDRESSES = [
            "Fő utca 14., Kaposvár",
            "Ady Endre utca 21., Kaposvár",
            "Zárda utca 5., Kaposvár",
            "Kossuth Lajos tér 1., Kaposvár",
            "Berzsenyi Dániel utca 10., Kaposvár"
        ];
        let confirmedAddress = null;
        let confirmedLat = null;
        let confirmedLon = null;

        let addressDebounceTimer = null;
        async function handleAddressInput(val) {
            const suggList = document.getElementById('emp-address-suggestions');
            if (!val || val.trim().length < 3) {
                suggList.style.display = 'none';
                return;
            }
            if (addressDebounceTimer) clearTimeout(addressDebounceTimer);
            suggList.innerHTML = '<div style="padding:12px; color:var(--color-text); text-align:center;"><div class="spinner-small" style="display:inline-block;width:14px;height:14px;border:2px solid var(--color-text);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div> Keresés...</div>';
            suggList.style.display = 'block';
            
            addressDebounceTimer = setTimeout(async () => {
                try {
                    const term = val.trim();
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&addressdetails=1&countrycodes=hu&limit=5`);
                    const matches = await res.json();
                    
                    if (!matches || matches.length === 0) {
                        suggList.innerHTML = '<div style="padding:12px; color:var(--color-text); text-align:center; font-size:14px;">Nincs találat</div>';
                        return;
                    }
                    
                    suggList.innerHTML = matches.map(m => {
                        const jsonStr = JSON.stringify({
                            display_name: m.display_name,
                            lat: m.lat,
                            lon: m.lon,
                            address: m.address
                        }).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                        
                        return `
                        <div style="padding:12px 16px; border-bottom: 1px solid var(--color-border); font-size:14px; color: var(--color-text); cursor:pointer; display:flex; align-items:center; gap:8px;" onclick="selectNominatimAddress('${jsonStr}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.display_name}</span>
                        </div>
                    `}).join('');
                } catch (e) {
                    suggList.innerHTML = '<div style="padding:12px; color:var(--color-text); text-align:center; font-size:14px;">Hiba a keresés során</div>';
                }
            }, 500);
        }

        let empFormMap = null;
        let empFormMarker = null;
        function updateMapPreview(lat, lon) {
            if (!lat || !lon) return;
            const container = document.getElementById('emp-form-map-preview');
            if (!container) return;
            if (!empFormMap) {
                empFormMap = L.map('emp-form-map-preview', {
                    zoomControl: false,
                    attributionControl: false
                }).setView([lat, lon], 14);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19
                }).addTo(empFormMap);
                empFormMarker = L.marker([lat, lon]).addTo(empFormMap);
            } else {
                empFormMap.setView([lat, lon], 14);
                empFormMarker.setLatLng([lat, lon]);
                setTimeout(() => {
                    if (empFormMap) empFormMap.invalidateSize();
                }, 100);
            }
        }

        function selectNominatimAddress(jsonStr) {
            try {
                const data = JSON.parse(jsonStr.replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
                confirmedAddress = data.display_name;
                confirmedLat = parseFloat(data.lat);
                confirmedLon = parseFloat(data.lon);
                
                const err = document.getElementById('err-loc-structured');
                if (err) err.classList.remove('show');

                const addr = data.address || {};
                
                if (document.getElementById('emp-zip')) document.getElementById('emp-zip').value = addr.postcode || '';
                if (document.getElementById('emp-county')) document.getElementById('emp-county').value = addr.county || addr.state || '';
                if (document.getElementById('emp-city')) document.getElementById('emp-city').value = addr.city || addr.town || addr.village || addr.municipality || '';
                if (document.getElementById('emp-street')) document.getElementById('emp-street').value = addr.road || addr.pedestrian || '';
                if (document.getElementById('emp-house')) document.getElementById('emp-house').value = addr.house_number || '';

                if (document.getElementById('emp-loc-input')) document.getElementById('emp-loc-input').value = data.display_name;
                
                document.getElementById('emp-address-suggestions').style.display = 'none';
                
                updateMapPreview(confirmedLat, confirmedLon);
            } catch (e) {
                console.error("Address parsing error", e);
            }
        }

        // Maintain compatibility for older logic
        function selectAddress(address, lat = null, lon = null) {
            if (document.getElementById('emp-loc-input')) document.getElementById('emp-loc-input').value = address;
            document.getElementById('emp-address-suggestions').style.display = 'none';
        }

        function resetAddressSearch() {
            confirmedAddress = null;
            document.getElementById('emp-loc-locked-state').style.display = 'none';
            document.getElementById('emp-loc-search-state').style.display = 'block';
            
            if (document.getElementById('emp-zip')) document.getElementById('emp-zip').value = '';
            if (document.getElementById('emp-county')) document.getElementById('emp-county').value = '';
            if (document.getElementById('emp-city')) document.getElementById('emp-city').value = '';
            if (document.getElementById('emp-street')) document.getElementById('emp-street').value = '';
            if (document.getElementById('emp-house')) document.getElementById('emp-house').value = '';
            if (document.getElementById('emp-apartment')) document.getElementById('emp-apartment').value = '';
            
            const errLocStructured = document.getElementById('err-loc-structured');
            if (errLocStructured) errLocStructured.classList.remove('show');

            document.getElementById('emp-address-suggestions').style.display = 'none';
            document.getElementById('emp-city').value = '';
            document.getElementById('emp-street').value = '';
        }

        function autoFillGPS() {
            const btn = document.getElementById('emp-gps-btn');
            const txt = document.getElementById('emp-gps-text');
            if(!btn) return;
            txt.innerText = 'Keresés...';
            btn.style.background = 'rgba(209, 213, 219, 0.5)';
            btn.style.color = 'var(--color-text)';
            
            if (!navigator.geolocation) {
                alert("A böngésződ nem támogatja a helymeghatározást.");
                resetGPSBtn(txt, btn);
                return;
            }

            navigator.geolocation.getCurrentPosition(async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                try {
                    // Use Nominatim API for reverse geocoding
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`, {
                        headers: {
                            'Accept-Language': 'hu'
                        }
                    });
                    const data = await response.json();
                    
                    let addressString = "Ismeretlen hely";
                    if (data && data.address) {
                        const a = data.address;
                        const city = a.city || a.town || a.village || "Kaposvár";
                        const street = a.road || "Ismeretlen utca";
                        const hnr = a.house_number || "";
                        addressString = `${street} ${hnr}, ${city}`.replace(/ ,/, ',');
                    }
                    
                    selectAddress(addressString, lat, lon);
                    
                    txt.innerText = 'Helyzet megadva';
                    btn.style.background = 'rgba(34, 197, 94, 0.1)';
                    btn.style.color = 'var(--color-green)';
                } catch(e) {
                    console.error("Geocoding failed:", e);
                    alert("Nem sikerült lekérni a címet a koordinátákból.");
                    resetGPSBtn(txt, btn);
                }
            }, (err) => {
                console.error("GPS error:", err);
                alert("A helymeghatározás sikertelen (engedély megtagadva vagy hiba történt).");
                resetGPSBtn(txt, btn);
            });
        }
        
        function resetGPSBtn(txt, btn) {
            txt.innerText = 'Jelenlegi helyzet';
            btn.style.background = 'rgba(34, 197, 94, 0.1)';
            btn.style.color = 'var(--color-green)';
        }

        // Init datetime field with today + 1 hour
        function initEmpDatetime() {
            const dt = document.getElementById('emp-datetime');
            if (!dt) return;
            const saved = localStorage.getItem('as_emp-datetime');
            if (saved) { dt.value = saved; return; }
            const now = new Date();
            now.setHours(now.getHours() + 1, 0, 0, 0);
            const pad = n => String(n).padStart(2, '0');
            dt.value = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':00';
        }

        // ================================================================
        // OVERRIDE window.onload TO ADD NEW INITS
        // ================================================================
        const _prevOnLoad2 = window.onload;
        window.onload = function() {
            if (_prevOnLoad2) _prevOnLoad2();
            
            // Init auto-save
            initAutoSave();
            
            // Init datetime
            initEmpDatetime();

            // Init employer form category
            if (typeof selectEmployerFormCat === 'function') {
                selectEmployerFormCat('Kert');
            }

            // Init emp price display
            const empPrice = document.getElementById('emp-price-input');
            if (empPrice) updateEmpPriceDisplay(empPrice.value);
        };


    


        // ===================================================================
        // REDESIGN PHASE 2: EMPLOYER FULL SCREEN AD DETAIL SCREEN
        // ===================================================================
        let currentEmployerDetailJobId = null;
        let currentEditJobId = null;

        function openEmployerAdDetailNew(jobId) {
            currentEmployerDetailJobId = jobId;
            let job = localEmployerJobs.find(j => j.id === jobId);
            
            // If not found in employer jobs, check mockJobs
            if (!job) {
                const mock = mockJobs.find(j => j.id === parseInt(jobId));
                if (mock) {
                    job = {
                        id: mock.id,
                        title: mock.title,
                        details: mock.desc,
                        location: mock.location,
                        price: mock.price,
                        category: mock.category,
                        status: mock.urgent ? 'Aktív' : 'Keresés',
                        datetime: mock.time || 'Ma, 14:00'
                    };
                }
            }
            
            if (!job) return;

            // Fill header values
            document.getElementById('ad-detail-header-title').innerText = job.title;
            const statusEl = document.getElementById('ad-detail-header-status');
            if (statusEl) {
                let dispStatus = job.status;
                if (job.status === 'accepted' || job.status === 'Aktív') dispStatus = 'Aktív';
                statusEl.innerText = dispStatus;
                statusEl.className = 'emp-ad-pill ' + ((job.status === 'Aktív' || job.status === 'accepted') ? 'active' : job.status === 'Befejezett' ? 'completed' : 'seeking');
            }

            // Fill details card values
            document.getElementById('ad-detail-address').innerText = job.location;
            document.getElementById('ad-detail-datetime').innerText = job.datetime;
            document.getElementById('ad-detail-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('ad-detail-desc').innerText = job.details;

            // Fill applicants list card values
            const appContainer = document.getElementById('ad-detail-applicants-container');
            if (appContainer) {
                const jobApps = localWorkerApplications.filter(a => a.jobId === job.id);
                const pendingApps = jobApps.filter(a => a.status === 'Függőben');
                const acceptedApp = jobApps.find(a => a.status === 'Aktív' || a.status === 'Befejezett' || a.status === 'Értékelésre vár' || a.status === 'Kifizetve');

                if (acceptedApp) {
                    const workerDisplayName = acceptedApp.workerName || acceptedApp.workerEmail || 'Diák';
                    let imgHtml = `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; " alt="Avatar">`;
                    if (window.avatarCache && window.avatarCache[workerDisplayName]) {
                        const photoURL = window.avatarCache[workerDisplayName];
                        if (photoURL.startsWith('http') || photoURL.startsWith('data:')) {
                            imgHtml = `<img src="${photoURL}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; " alt="Avatar">`;
                        } else {
                            imgHtml = `<div style="width:36px; height:36px; border-radius:50%; background:${getAvatarColor(workerDisplayName)}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight: 500; border:1.5px solid #fff; ">${photoURL}</div>`;
                        }
                    }
                    appContainer.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: #F0FDF4; padding: 12px; border-radius: 16px; border: 1px solid #DCFCE7;">
                            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="openWorkerProfile('${workerDisplayName}')">
                                ${imgHtml}
                                <div>
                                    <div style="font-size: 14px; font-weight: 400; color: var(--color-text); display: flex; align-items: center; gap: 4px;">
                                        ${workerDisplayName}
                                        <svg style="width: 13px; height: 13px; fill: #007aff;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                    </div>
                                    <div style="font-size: 11px; color: #166534; font-weight: 400; margin-top: 1px; display:flex; align-items:center; gap:4px;">
                                        <span>★ 4.9</span>
                                        <span>· Kiválasztott munkás</span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="openEmployerChatRoomFromAd(null)" style="background: var(--color-text); color: #fff; border: none; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 400; cursor: pointer;">Csevegés</button>
                        </div>
                    `;
                } else if (pendingApps.length > 0) {
                    let appsHtml = '';
                    pendingApps.forEach(app => {
                        const workerDisplayName = app.workerName || app.workerEmail || 'Diák';
                        let imgHtml = `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; " alt="Avatar">`;
                        if (window.avatarCache && window.avatarCache[workerDisplayName]) {
                            const photoURL = window.avatarCache[workerDisplayName];
                            if (photoURL.startsWith('http') || photoURL.startsWith('data:')) {
                                imgHtml = `<img src="${photoURL}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; " alt="Avatar">`;
                            } else {
                                imgHtml = `<div style="width:36px; height:36px; border-radius:50%; background:${getAvatarColor(workerDisplayName)}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight: 500; border:1.5px solid #fff; ">${photoURL}</div>`;
                            }
                        }
                        
                        // Find the chat for this application
                        const matchedChat = localChats.find(c => c.jobId === app.jobId && (c.workerId === app.workerUid || c.workerEmail === app.workerEmail));
                        const chatIdArg = matchedChat ? `'${matchedChat.id}'` : 'null';

                        appsHtml += `
                            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-surface); padding: 12px; border-radius: 16px; border: 1px solid var(--color-text); margin-bottom: 8px;">
                                <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="openWorkerProfile('${workerDisplayName}')">
                                    ${imgHtml}
                                    <div>
                                        <div style="font-size: 14px; font-weight: 400; color: var(--color-text); display: flex; align-items: center; gap: 4px;">
                                            ${workerDisplayName}
                                            <svg style="width: 13px; height: 13px; fill: #007aff;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                        </div>
                                        <div style="font-size: 11px; color: var(--color-text); display: flex; align-items: center; gap: 4px; margin-top: 1px;">
                                            <span>★ 4.9</span>
                                            <span style="background: #EFF6FF; color: #1D4ED8; padding: 1px 6px; border-radius: 10px; font-weight: 400; font-size: 9px;">Megbízható</span>
                                        </div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="acceptWorkerApplication('${app.id}')" style="background: var(--color-green); color: #fff; border: none; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 400; cursor: pointer; transition: transform 0.1s ease;">Elfogad</button>
                                    <button onclick="openEmployerChatRoomFromAd(${chatIdArg})" style="background: var(--color-text); color: #fff; border: none; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 400; cursor: pointer; transition: transform 0.1s ease;">Chat</button>
                                </div>
                            </div>
                        `;
                    });
                    appContainer.innerHTML = appsHtml;
                } else {
                    appContainer.innerHTML = `<div style="text-align: center; color: var(--color-text); padding: 12px 0; font-size: 13px; font-style: italic;">Még senki nem jelentkezett</div>`;
                }
            }

            // Close collapsible insurance default
            const insContent = document.getElementById('ad-detail-insurance-content');
            const insChevron = document.getElementById('ad-insurance-chevron');
            if (insContent) insContent.style.display = 'none';
            if (insChevron) insChevron.style.transform = 'rotate(0deg)';

            // Open Full Screen Ad detail
            document.getElementById('employer-ad-detail-screen').classList.add('open');
        }

        function closeEmployerAdDetailNew() {
            document.getElementById('employer-ad-detail-screen').classList.remove('open');
        }

        function toggleAdDetailInsurance() {
            const el = document.getElementById('ad-detail-insurance-content');
            const chevron = document.getElementById('ad-insurance-chevron');
            if (!el) return;
            if (el.style.display === 'none') {
                el.style.display = 'block';
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            } else {
                el.style.display = 'none';
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            }
        }

        function handleChatAvatarClick() {
            const chat = localChats.find(c => c.id === window.selectedChatId);
            if (!chat) return;
            const role = currentRole || loginSelectedRole || localStorage.getItem('melogo_active_role') || 'worker';
            if (role === 'employer') {
                const name = chat.workerName || chat.name || 'Diák';
                if (typeof openWorkerProfile === 'function') openWorkerProfile(name, chat.workerId);
            } else {
                const name = chat.employerName || 'Megbízó';
                openEmployerMiniModal(name, chat.employerId);
            }
        }
        
        function handleListAvatarClick(chatId) {
            const chat = localChats.find(c => c.id === chatId);
            if (!chat) return;
            const role = currentRole || loginSelectedRole || localStorage.getItem('melogo_active_role') || 'worker';
            if (role === 'employer') {
                const name = chat.workerName || chat.name || 'Diák';
                if (typeof openWorkerProfile === 'function') openWorkerProfile(name, chat.workerId);
            } else {
                const name = chat.employerName || 'Megbízó';
                openEmployerMiniModal(name, chat.employerId);
            }
        }

        function openEmployerMiniModal(name, uid) {
            const job = mockJobs.find(j => j.employer === name || j.ownerName === name);
            let locationText = "Kaposvár";
            if (job && job.location) {
                const parts = job.location.split(',');
                locationText = parts[0].trim() + (parts[1] ? ', ' + parts[1].trim().split(' ')[0] : '');
            }
            
            document.getElementById('mini-emp-avatar').innerText = getInitials(name);
            document.getElementById('mini-emp-name').innerText = name;
            document.getElementById('mini-emp-location').innerText = locationText;
            
            document.getElementById('mini-emp-view-btn').onclick = () => {
                closeEmployerMiniModal();
                if (typeof openEmployerProfile === 'function') openEmployerProfile(name, uid);
            };
            
            const modal = document.getElementById('employer-mini-modal');
            const backdrop = document.getElementById('employer-mini-modal-backdrop');
            backdrop.classList.add('open');
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }
        
        function closeEmployerMiniModal() {
            const modal = document.getElementById('employer-mini-modal');
            const backdrop = document.getElementById('employer-mini-modal-backdrop');
            backdrop.classList.remove('open');
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        }
        
        async function openEmployerProfile(name, uid) {
            // Find a job associated with this employer to extract general location details
            const job = mockJobs.find(j => j.employer === name || j.ownerName === name);
            let locationText = "Kaposvár";
            if (job && job.location) {
                // Keep it general (city and district - not full home address)
                const parts = job.location.split(',');
                if (parts.length >= 2) {
                    locationText = parts[0].trim() + (parts[1] ? ', ' + parts[1].trim().split(' ')[0] : '');
                } else {
                    locationText = job.location;
                }
            }

            document.getElementById('ep-name').innerText = name || 'Megbízó';
            document.getElementById('ep-location').innerText = locationText;
            
            // Set initials/avatar fallback
            const avatarImg = document.getElementById('ep-avatar');
            const avatarFallback = document.getElementById('ep-avatar-fallback');
            if (window.avatarCache && window.avatarCache[name]) {
                avatarImg.src = window.avatarCache[name];
                avatarImg.style.display = 'block';
                avatarFallback.style.display = 'none';
            } else {
                avatarImg.style.display = 'none';
                avatarFallback.style.display = 'flex';
                avatarFallback.innerText = (name || 'Megbízó').substring(0, 2).toUpperCase();
                avatarFallback.style.backgroundColor = getAvatarColor(name || 'Megbízó');
            }

            let stars = "5.0";
            let revCount = "6 értékelés";
            let bio = "Megbízható házigazda. Rendszeresen keresek segítséget kerti munkákhoz és egyéb ház körüli teendőkhöz.";
            
            // Try to fetch real profile data from Firestore
            if (window.firebaseAPI && window.firebaseDb) {
                try {
                    let userDoc = null;
                    if (uid) {
                        const snap = await window.firebaseAPI.getDoc(window.firebaseAPI.doc(window.firebaseDb, "users", uid));
                        if (snap.exists()) userDoc = snap;
                    }
                    if (!userDoc) {
                        const q = window.firebaseAPI.query(
                            window.firebaseAPI.collection(window.firebaseDb, "users"), 
                            window.firebaseAPI.where("name", "==", name)
                        );
                        const querySnapshot = await window.firebaseAPI.getDocs(q);
                        if (!querySnapshot.empty) userDoc = querySnapshot.docs[0];
                    }
                    
                    if (userDoc) {
                        const data = userDoc.data();
                        bio = data.bio || bio;
                        stars = data.rating !== undefined ? parseFloat(data.rating).toFixed(1) : stars;
                        if (data.photoURL) {
                            avatarImg.src = data.photoURL;
                            avatarImg.style.display = 'block';
                            avatarFallback.style.display = 'none';
                        }
                    }
                } catch(e) { console.warn("Employer profile fetch error:", e); }
            } else {
                const n = (name || '').toLowerCase();
                if (n.includes("béla") || n.includes("kovács")) {
                    stars = "4.9";
                    revCount = "8 értékelés";
                    bio = "Rendszerető kaposvári lakos vagyok, kerti munkákban és pakolásban szoktam alkalmi segítséget kérni.";
                } else if (n.includes("zsolt") || n.includes("nagy")) {
                    stars = "4.8";
                    revCount = "4 értékelés";
                    bio = "Autókozmetikai és kisebb javítási munkákhoz keresek megbízható diákokat Kaposváron.";
                } else if (n.includes("erzsébet") || n.includes("tóth") || n.includes("erzsi")) {
                    stars = "5.0";
                    revCount = "12 értékelés";
                    bio = "Takarításban és kerti növények gondozásában kérnék segítséget. A pontosság és udvariasság számomra nagyon fontos.";
                }
            }

            const epStars = document.getElementById('ep-stars');
            if (epStars) epStars.innerText = stars;
            const epReviewsCount = document.getElementById('ep-reviews-count');
            if (epReviewsCount) epReviewsCount.innerText = revCount;
            document.getElementById('ep-bio').innerText = `"${bio}"`;

            // Open the overlay
            document.getElementById('employer-profile-overlay').classList.add('open');
        }

        function openAdDetailFromChat() {
            if (loginSelectedRole === 'employer') {
                const jobTitle = document.getElementById('chat-detail-job').innerText;
                const jobObj = window.localEmployerJobs && window.localEmployerJobs.find(j => j.title === jobTitle);
                if (jobObj && typeof openEmployerFormOverlay === 'function') {
                    openEmployerFormOverlay(jobObj.id);
                } else {
                    alert('A munka részleteinek megtekintéséhez kérjük lépj a Kezdőlapra.');
                }
                return;
            }
            const jobTitle = document.getElementById('chat-detail-job').innerText;
            // Find job id by title
            let job = localEmployerJobs.find(j => j.title === jobTitle);
            let jobId = job ? job.id : 'job_demo_1';
            
            // Close chat overlay first to push details overlay nicely
            document.getElementById('chat-detail-overlay').classList.remove('open');
            setTimeout(() => {
                openEmployerAdDetailNew(jobId);
            }, 350);
        }

        function showChatJobOnMap() {
            const jobTitle = document.getElementById('chat-detail-job').innerText;
            const job = mockJobs.find(j => j.title === jobTitle) || (window.localEmployerJobs && window.localEmployerJobs.find(j => j.title === jobTitle));
            
            if (!job) {
                alert('A munka adatai nem találhatóak.');
                return;
            }
            
            // Close chat details
            const overlay = document.getElementById('chat-detail-overlay');
            if (overlay) overlay.classList.remove('open');
            
            // If currently employer, switch to worker
            if (currentRole !== 'worker') {
                if (typeof switchRole === 'function') switchRole('worker');
            }
            
            // Go to map screen
            if (typeof navigateApp === 'function') {
                navigateApp(1);
            }
            
            // Wait for map to initialize/resize, then center and show pin detail card
            setTimeout(() => {
                if (window.leafletMap && job.lat && job.lon) {
                    window.leafletMap.setView([job.lat, job.lon], 15);
                    if (typeof onMapPinClick === 'function') {
                        onMapPinClick(job.id);
                    }
                }
            }, 300);
        }

        let currentMapCoords = { lat: 47.4979, lon: 19.0402 };

        function getCoordinatesForAddress(address) {
            const ADDRESS_COORDS = {
                "Kaposvár, Rózsa u. 9.": { lat: 46.3687, lon: 17.7912 },
                "Kaposvár, Fő utca 14.": { lat: 46.3591, lon: 17.7895 },
                "Kaposvár, Petőfi tér 2.": { lat: 46.3632, lon: 17.7944 },
                "Kaposvár, Dózsa Gy. u. 44.": { lat: 46.3544, lon: 17.8012 },
                "Kaposvár, Füredi utca 18.": { lat: 46.3710, lon: 17.7820 }
            };
            if (ADDRESS_COORDS[address]) {
                return ADDRESS_COORDS[address];
            }
            if (!address || address === 'Kaposvár') {
                return { lat: 47.4979, lon: 19.0402 };
            }
            // Deterministic random close to Kaposvár center
            let hash = 0;
            for (let i = 0; i < address.length; i++) {
                hash = ((hash << 5) - hash) + address.charCodeAt(i);
                hash |= 0; 
            }
            const rand1 = (Math.abs(hash) % 1000) / 100000;
            const rand2 = (Math.abs(hash * 31) % 1000) / 100000;
            const sign1 = (hash % 2 === 0) ? 1 : -1;
            const sign2 = ((hash * 3) % 2 === 0) ? 1 : -1;
            return {
                lat: 46.3593 + (rand1 * sign1),
                lon: 17.7967 + (rand2 * sign2)
            };
        }

        function handleAddressClick() {
            const jobTitle = document.getElementById('chat-detail-job').innerText;
            const pinnedAddr = document.getElementById('chat-pinned-address').innerText;
            
            let coords = getCoordinatesForAddress(pinnedAddr);
            
            const job = mockJobs.find(j => j.title === jobTitle) || (window.localEmployerJobs && window.localEmployerJobs.find(j => j.title === jobTitle));
            if (job && job.lat && job.lon) {
                coords = { lat: job.lat, lon: job.lon };
            } else {
                const app = localWorkerApplications.find(a => a.title === jobTitle);
                if (app && app.lat && app.lon) {
                    coords = { lat: app.lat, lon: app.lon };
                }
            }

            currentMapCoords.lat = coords.lat;
            currentMapCoords.lon = coords.lon;
            currentMapCoords.address = pinnedAddr;

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                document.getElementById('maps-action-sheet-backdrop').style.display = 'block';
                const sheet = document.getElementById('maps-action-sheet');
                sheet.style.display = 'flex';
                setTimeout(() => sheet.classList.add('active'), 10);
            } else {
                // Android/Desktop: always open Google Maps directly
                openExternalMap('google');
            }
        }

        function closeMapsActionSheet() {
            document.getElementById('maps-action-sheet-backdrop').style.display = 'none';
            const sheet = document.getElementById('maps-action-sheet');
            sheet.classList.remove('active');
            setTimeout(() => sheet.style.display = 'none', 400);
        }

        function openExternalMap(type) {
            closeMapsActionSheet();
            const lat = currentMapCoords.lat;
            const lon = currentMapCoords.lon;
            const addr = currentMapCoords.address;
            const dest = addr && addr !== 'Kaposvár' ? encodeURIComponent(addr) : `${lat},${lon}`;
            if (type === 'google') {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
            } else if (type === 'apple') {
                window.open(`maps://maps.apple.com/?daddr=${dest}`, '_blank');
            }
        }

        async function deleteEmployerAdFromDetail() {
            if (confirm('Biztosan törölni szeretnéd ezt a hirdetést?')) {
                const jobId = currentEmployerDetailJobId;
                const card = document.getElementById('emp-ad-card-' + jobId);
                if (card) {
                    card.classList.add('animate-card-fade-out');
                }
                closeEmployerAdDetailNew();

                setTimeout(async () => {
                    const index = localEmployerJobs.findIndex(j => j.id === jobId);
                    if (index !== -1) {
                        const deletedJobTitle = localEmployerJobs[index].title;
                        localEmployerJobs.splice(index, 1);
                        saveEmployerJobs();
                        renderEmployerHome();
                        
                        // MENTÉS FIRESTORE-BA: Törlés
                        if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                            try {
                                const jobRef = window.firebaseAPI.doc(window.firebaseDb, "jobs", jobId);
                                await window.firebaseAPI.deleteDoc(jobRef);
                                
                                // Cascade delete applications
                                const appsQuery = window.firebaseAPI.query(window.firebaseAPI.collection(window.firebaseDb, "applications"), window.firebaseAPI.where("jobId", "==", jobId));
                                const appsSnap = await window.firebaseAPI.getDocs(appsQuery);
                                appsSnap.forEach(async (docSnap) => {
                                    await window.firebaseAPI.deleteDoc(docSnap.ref);
                                });
                                
                                // Cascade delete chats
                                const chatsQuery = window.firebaseAPI.query(window.firebaseAPI.collection(window.firebaseDb, "chats"), window.firebaseAPI.where("jobId", "==", jobId));
                                const chatsSnap = await window.firebaseAPI.getDocs(chatsQuery);
                                chatsSnap.forEach(async (docSnap) => {
                                    await window.firebaseAPI.deleteDoc(docSnap.ref);
                                });

                                // Audit read-back
                                const checkSnap = await window.firebaseAPI.getDoc(jobRef);
                                if (!checkSnap.exists()) {
                                    console.log("Job successfully deleted from Firestore:", jobId);
                                } else {
                                    console.error("CRITICAL ERROR: Job still exists after delete!", jobId);
                                }
                            } catch (e) {
                                console.error("Firestore job delete error:", e);
                            }
                        }
                        
                        // Also delete corresponding chat if exists
                        const chatIndex = localChats.findIndex(c => c.jobTitle === deletedJobTitle);
                        if (chatIndex !== -1) {
                            localChats.splice(chatIndex, 1);
                            saveLocalChats();
                            renderChatList();
                        }
                        
                        // Reset game state
                        if (gameState.jobTitle === deletedJobTitle) {
                            gameState.applied = false;
                            gameState.status = 'Keresés';
                        }
                    }
                    showGreenBanner('Hirdetés sikeresen törölve.');
                }, 350);
            }
        }

        function openEmployerChatRoomFromAd(chatId) {
            closeEmployerAdDetailNew();
            setTimeout(() => {
                if (chatId) {
                    openChatRoom(chatId);
                } else {
                    window.selectedChatId = null;
                    if (window._chatMsgsUnsubscribe) {
                        window._chatMsgsUnsubscribe();
                        window._chatMsgsUnsubscribe = null;
                    }
                    openEmployerChatRoom();
                }
                navigateApp(2); // navigate to messages tab
            }, 300);
        }

        async function acceptWorkerApplication(appId) {
            const app = localWorkerApplications.find(a => a.id === appId);
            if (!app) return;
            
            // Find corresponding chat
            const chat = localChats.find(c => c.jobId === app.jobId && (c.workerId === app.workerUid || c.workerEmail === app.workerEmail));
            if (chat) {
                selectedChatId = chat.id;
                window.selectedChatId = chat.id;
            }
            
            await employerAcceptWorker(app.title);
            closeEmployerAdDetailNew();
            renderEmployerHome();
        }

        // Overwrite clickEmployerAdCard to open our redesigned details overlay
        function clickEmployerAdCard(jobId) {
            openEmployerAdDetailNew(jobId);
        }

        // ===================================================================
        // REDESIGN: MESSAGES SYSTEM, SWIPE & LONG PRESS
        // ===================================================================
        var localChats = [];
        
        let currentMsgFilter = 'all';
        let longPressTimer = null;
        let selectedChatId = null;
        let activeSwipeWrapper = null;
        let swipeStartX = 0;
        let swipeCurrentX = 0;
        let isSwiping = false;

        // Load local chats from localStorage if exist
        function initLocalChats() {
            try {
                const saved = localStorage.getItem('melogo_local_chats');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Filter out old demo placeholders injected by earlier code versions
                    localChats = parsed.filter(c => !String(c.id).startsWith('chat_demo_'));
                    localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                } else {
                    // No saved chats – start with empty list; Firebase will populate
                    localChats = [];
                }
            } catch(e) {
                console.warn('[Chats] localStorage error:', e);
                localChats = [];
            }
            renderSkeletonChats('messages-chat-list', 3);
            setTimeout(() => {
                renderChatList();
            }, 300);
        }

        function saveLocalChats() {
            try {
                localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                // Note: Chats are persisted to Firestore individually via addDoc when created.
                // Do NOT batch-upload via saveToCloud to avoid overwriting Firestore-side updates.
            } catch(e) {
                console.warn('[Chats] failed to save:', e);
            }
        }

        function renderSkeletonChats(containerId, count) {
            const list = document.getElementById(containerId);
            if (!list) return;
            let html = '';
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="shimmer" style="display:flex; align-items:center; padding:16px 20px; border-bottom:1px solid var(--color-border, #E5E7EB); background:var(--color-surface, #fff); gap:14px;">
                        <div style="width:48px; height: 52px; border-radius:50%; background:var(--color-shimmer, #E5E7EB); flex-shrink:0;"></div>
                        <div style="flex:1;">
                            <div style="width:40%; height:16px; background:var(--color-shimmer, #E5E7EB); border-radius:6px; margin-bottom:8px;"></div>
                            <div style="width:70%; height:14px; background:var(--color-shimmer, #E5E7EB); border-radius:6px;"></div>
                        </div>
                    </div>
                `;
            }
            list.innerHTML = html;
        }

        function renderChatList() {
            if (!window.avatarCache) window.avatarCache = {};
            const list = document.getElementById('messages-chat-list');
            if (!list) return;
            list.innerHTML = '';

            let filtered = localChats.filter(c => !c.archived && c.active !== false);
            
            // Sort by most recent activity
            filtered.sort((a, b) => {
                const getMillis = (time) => {
                    if (!time) return 0;
                    if (typeof time === 'number') return time;
                    if (time.toMillis && typeof time.toMillis === 'function') return time.toMillis();
                    if (time.seconds) return time.seconds * 1000;
                    return 0;
                };
                const timeA = Math.max(getMillis(a.updatedAt), getMillis(a.createdAt));
                const timeB = Math.max(getMillis(b.updatedAt), getMillis(b.createdAt));
                return timeB - timeA;
            });
            
            // Unread badge logic
            let totalUnread = filtered.reduce((acc, c) => acc + (c.isUnread ? 1 : 0), 0);
            const msgBadge = document.getElementById('app-msg-badge');
            if (msgBadge) {
                if (totalUnread > 0) {
                    msgBadge.innerText = totalUnread;
                    msgBadge.style.display = 'flex';
                } else {
                    msgBadge.style.display = 'none';
                }
            }

            if (currentMsgFilter === 'unread') {
                filtered = filtered.filter(c => c.isUnread);
            }

            if (filtered.length === 0) {
                list.innerHTML = `
                    <div id="messages-empty-state" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 32px;text-align:center; flex:1;">
                        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <div style="font-size:16px;font-weight: 300;color: var(--color-text);margin-bottom:8px;">Még nincs üzeneted</div>
                        <div style="font-size:13px;color: var(--color-text);line-height:1.6; max-width: 240px; margin: 0 auto;">Jelentkezz egy munkára és automatikusan megnyílik a chat a megbízóval.</div>
                    </div>
                `;
                return;
            }

            filtered.forEach(chat => {
                const partnerName = (currentRole === 'worker') ? (chat.employerName || 'Megbízó') : (chat.workerName || chat.name || 'Diák');
                const initials = getInitials(partnerName);
                const avatarBg = getAvatarGradient(partnerName);
                const isUnreadClass = chat.isUnread ? 'unread' : '';
                
                const item = document.createElement('div');
                item.className = `chat-item-wrapper ${isUnreadClass}`;
                item.id = `item_${chat.id}`;
                item.setAttribute('data-id', chat.id);
                
                item.innerHTML = `
                    <!-- Main Content -->
                    <div class="chat-item-content" 
                         onclick="openChatRoom('${chat.id}')"
                         oncontextmenu="event.preventDefault(); openMsgActionSheet('${chat.id}');">
                        
                        <div class="chat-item-avatar-container" onclick="event.stopPropagation(); handleListAvatarClick('${chat.id}')">
                            <div class="chat-item-avatar" style="background:${avatarBg};">${initials}</div>
                            ${chat.isOnline ? '<div class="chat-item-online"></div>' : ''}
                        </div>
                        
                        <div class="chat-item-middle">
                            <div class="chat-item-first-line">
                                <span class="chat-item-name">${partnerName}</span>
                                <span class="chat-item-job">(${chat.jobTitle})</span>
                            </div>
                            <div class="chat-item-preview">${chat.lastMsg}</div>
                        </div>
                        
                        <div class="chat-item-right">
                            <span class="chat-item-time">${chat.time}</span>
                            ${chat.isUnread && chat.unreadCount > 0 ? `<span class="chat-item-badge">${chat.unreadCount}</span>` : ''}
                        </div>
                        
                        <div class="chat-item-separator"></div>
                    </div>
                `;
                list.appendChild(item);
            });
        }

        function filterChats(filter) {
            currentMsgFilter = filter;
            const btnAll = document.getElementById('msg-filter-all');
            const btnUnread = document.getElementById('msg-filter-unread');
            
            if (filter === 'all') {
                btnAll.className = 'msg-filter-pill active';
                btnUnread.className = 'msg-filter-pill inactive';
            } else {
                btnAll.className = 'msg-filter-pill inactive';
                btnUnread.className = 'msg-filter-pill active';
            }
            renderChatList();
        }

        // Long Press & Gesture handlers


        // Action Sheet Actions
        function openMsgActionSheet(chatId) {
            selectedChatId = chatId;
            // Vibrate feedback
            if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
            
            const sheet = document.getElementById('msg-action-sheet');
            const backdrop = document.getElementById('msg-action-sheet-backdrop');
            
            sheet.style.display = 'block';
            backdrop.style.display = 'block';
            
            // Force reflow
            sheet.offsetHeight;
            
            backdrop.classList.add('active');
            sheet.classList.add('active');
        }

        function closeMsgActionSheet() {
            const sheet = document.getElementById('msg-action-sheet');
            const backdrop = document.getElementById('msg-action-sheet-backdrop');
            
            backdrop.classList.remove('active');
            sheet.classList.remove('active');
            
            setTimeout(() => {
                if (!sheet.classList.contains('active')) {
                    sheet.style.display = 'none';
                    backdrop.style.display = 'none';
                }
            }, 250);
        }

        function archiveSelectedChat() {
            closeMsgActionSheet();
            const index = localChats.findIndex(c => c.id === selectedChatId);
            if (index !== -1) {
                localChats[index].archived = true;
                saveLocalChats();
                renderChatList();
                showGreenBanner('Beszélgetés archiválva.');
            }
        }

        function deleteSelectedChat() {
            closeMsgActionSheet();
            deleteChatDirect(selectedChatId);
        }

        function deleteChatDirect(chatId) {
            const index = localChats.findIndex(c => c.id === chatId);
            if (index !== -1) {
                localChats.splice(index, 1);
                saveLocalChats();
                renderChatList();
                showGreenBanner('Beszélgetés törölve.');
            }
        }

        function startNewMessage() {
            // Simulated start a new chat
            const names = ['Pál Zoltán', 'Varga Mária', 'Kerekes Lajos', 'Sipos Gábor'];
            const jobs = ['Kerti munka', 'Kerítés lemosása', 'Autó takarítás', 'Belső takarítás'];
            const randName = names[Math.floor(Math.random() * names.length)];
            const randJob = jobs[Math.floor(Math.random() * jobs.length)];
            
            // Add new chat
            const newChat = {
                id: 'chat_' + Date.now(),
                name: randName,
                workerName: randName,
                employerName: (currentUser ? currentUser.name : 'Megbízó'),
                jobTitle: randJob,
                lastMsg: 'Szia! Szeretnék érdeklődni a feladott munka iránt.',
                time: 'Most',
                isUnread: true,
                unreadCount: 1,
                isOnline: true,
                role: 'worker',
                active: true,
                archived: false
            };
            
            localChats.unshift(newChat);
            saveLocalChats();
            renderChatList();
            showGreenBanner('Új beszélgetés indult: ' + randName);
        }

        function openChatRoom(chatId) {
            const index = localChats.findIndex(c => c.id === chatId);
            if (index !== -1) {
                // Set as read locally
                localChats[index].isUnread = false;
                localChats[index].unreadCount = 0;
                saveLocalChats();
                
                // Sync to Firestore
                const chat = localChats[index];
                if (window.firebaseAPI && window.firebaseDb && chat.isFirestore) {
                    const updateField = currentRole === 'worker' ? 'workerLastRead' : 'employerLastRead';
                    window.firebaseAPI.updateDoc(
                        window.firebaseAPI.doc(window.firebaseDb, "chats", chatId),
                        { [updateField]: window.firebaseAPI.serverTimestamp() }
                    ).catch(e => console.warn('lastRead sync error', e));
                }

                renderChatList();
                
                const partnerName = (currentRole === 'worker') ? (chat.employerName || 'Megbízó') : (chat.workerName || chat.name || 'Diák');
                openChat(partnerName, chat.jobTitle, chat.lastMsg, chat.time, false, chat.id);
            }
        }

        // ===================================================================
        // NEW: WORKER ACCEPT, COMPLETE & RATING LIFE CYCLE IN CHAT
        // ===================================================================
        function updateChatActionBar(jobTitle) {
            const bar = document.getElementById('chat-action-bar');
            if (!bar) return;

            const chat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (!chat) {
                bar.style.display = 'none';
                return;
            }

            const isEmployer = (currentRole === 'employer');

            // Find the correct application matching this chat's worker
            const app = localWorkerApplications.find(a => 
                a.title === jobTitle && 
                (a.workerUid === chat.workerId || a.workerEmail === chat.workerEmail)
            );
            if (!app) {
                bar.style.display = 'none';
                return;
            }

            if (app.status === 'Függőben' && isEmployer) {
                // Case A: Employer's view, job is Pending (Függőben)
                bar.style.display = 'flex';
                bar.style.backgroundColor = '#EFF6FF';
                bar.style.borderTop = '1px solid #DBEAFE';
                bar.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; color: #1E40AF; flex: 1;">
                        <span style="font-size: 16px;">📩</span>
                        <div style="font-size: 12px; font-weight: 400; line-height: 1.3;">
                            ${chat.workerName || "Diák"} jelentkezett a munkára.
                        </div>
                    </div>
                    <button class="btn" style="height: 32px; font-size: 11px; padding: 0 14px; border-radius: 8px; background-color: #1D4ED8; color: #fff; font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; " onclick="employerAcceptWorker('${jobTitle}', event)">
                        Elfogadás
                    </button>
                `;
            } else if (app.status === 'Aktív' && !isEmployer) {
                // Case B: Worker's view, job is Active (Aktív)
                bar.style.display = 'flex';
                bar.style.backgroundColor = '#F0FDF4';
                bar.style.borderTop = '1px solid #DCFCE7';
                bar.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; color: #15803D; flex: 1;">
                        <span style="font-size: 16px; animation: pulse 1.5s infinite;">⚡</span>
                        <div style="font-size: 12px; font-weight: 400; line-height: 1.3;">
                            A munka aktív! Végeztél a feladattal?
                        </div>
                    </div>
                    <button class="btn" style="height: 32px; font-size: 11px; padding: 0 14px; border-radius: 8px; background-color: #16A34A; color: #fff; font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; " onclick="workerFinishJob('${jobTitle}')">
                        Végeztem a munkával
                    </button>
                `;
            } else if (app.status === 'Értékelésre vár' && isEmployer) {
                // Case C: Employer's view, Bence reported completion (Értékelésre vár)
                bar.style.display = 'flex';
                bar.style.backgroundColor = '#FFFBEB';
                bar.style.borderTop = '1px solid #FEF3C7';
                bar.style.flexDirection = 'column';
                bar.style.alignItems = 'center';
                bar.style.gap = '8px';
                bar.style.width = '100%';
                
                bar.innerHTML = `
                    <div style="font-size: 12px; font-weight: 500; color: #92400E; text-align: center;">
                        A diák befejezte a munkát! Értékeld a teljesítményét:
                    </div>
                    <div style="display: flex; gap: 14px; font-size: 28px; justify-content: center;" id="chat-stars-container">
                        <span style="cursor: pointer; transition: transform 0.1s;" onclick="employerRateWorkerFromChat('${jobTitle}', 1)" onmouseover="highlightChatStars(1)" onmouseout="resetChatStars()">⭐</span>
                        <span style="cursor: pointer; transition: transform 0.1s;" onclick="employerRateWorkerFromChat('${jobTitle}', 2)" onmouseover="highlightChatStars(2)" onmouseout="resetChatStars()">⭐</span>
                        <span style="cursor: pointer; transition: transform 0.1s;" onclick="employerRateWorkerFromChat('${jobTitle}', 3)" onmouseover="highlightChatStars(3)" onmouseout="resetChatStars()">⭐</span>
                        <span style="cursor: pointer; transition: transform 0.1s;" onclick="employerRateWorkerFromChat('${jobTitle}', 4)" onmouseover="highlightChatStars(4)" onmouseout="resetChatStars()">⭐</span>
                        <span style="cursor: pointer; transition: transform 0.1s;" onclick="employerRateWorkerFromChat('${jobTitle}', 5)" onmouseover="highlightChatStars(5)" onmouseout="resetChatStars()">⭐</span>
                    </div>
                `;
            } else {
                bar.style.display = 'none';
            }
        }

        function highlightChatStars(n) {
            const spans = document.querySelectorAll('#chat-stars-container span');
            spans.forEach((span, idx) => {
                if (idx < n) {
                    span.style.opacity = '1';
                    span.style.transform = 'scale(1.25)';
                } else {
                    span.style.opacity = '0.3';
                    span.style.transform = 'scale(1)';
                }
            });
        }

        function resetChatStars() {
            const spans = document.querySelectorAll('#chat-stars-container span');
            spans.forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'scale(1)';
            });
        }

        async function employerAcceptWorker(jobTitle, event) {
            if (event && event.currentTarget) {
                const btn = event.currentTarget;
                if (btn.disabled) return;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-small" style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite; margin-right: 4px;"></span>...';
            }
            
            const chat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (!chat) return;

            // 1. Update application status
            const appIndex = localWorkerApplications.findIndex(a => 
                a.title === jobTitle && 
                (a.workerUid === chat.workerId || a.workerEmail === chat.workerEmail)
            );
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Aktív';
                saveWorkerApplications();

                // Persist status to Firestore
                if (window.firebaseAPI && window.firebaseDb) {
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    window.firebaseAPI.updateDoc(appRef, { status: 'Aktív' })
                        .then(() => console.log('[Accept] Application status updated to Aktív in Firestore'))
                        .catch(e => console.error('[Accept] Firestore application status update failed:', e));
                }
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
                    { status: 'active', lastMsg: 'A megbízó elfogadta a munkást', updatedAt: window.firebaseAPI.serverTimestamp() }
                ).catch(e => console.error('[Accept] Chat status update failed:', e));
            } else {
                // Local fallback
                const msgContainer = document.getElementById('chat-detail-messages');
                if (msgContainer) {
                    const bubble = document.createElement('div');
                    bubble.style.cssText = 'background:#f3f4f6;color:#6b7280;padding:6px 14px;border-radius:99px;font-size:11px;font-weight: 400;text-align:center;margin:8px auto;max-width:80%;display:block;';
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
        }

        function workerFinishJob(jobTitle) {
            const chat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (!chat) return;

            // 1. Update application status
            const appIndex = localWorkerApplications.findIndex(a => 
                a.title === jobTitle && 
                (a.workerUid === chat.workerId || a.workerEmail === chat.workerEmail)
            );
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Értékelésre vár';
                saveWorkerApplications();

                // Persist status to Firestore
                if (window.firebaseAPI && window.firebaseDb) {
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    window.firebaseAPI.updateDoc(appRef, { status: 'Értékelésre vár' })
                        .then(() => console.log('[Finish] Application status updated to Értékelésre vár in Firestore'))
                        .catch(e => console.error('[Finish] Firestore application status update failed:', e));
                }
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
                    { status: 'pending_confirmation', lastMsg: 'A munkás késznek jelölte a munkát', updatedAt: window.firebaseAPI.serverTimestamp() }
                ).catch(e => console.error('[Finish] Chat status update failed:', e));
            } else {
                const msgContainer = document.getElementById('chat-detail-messages');
                if (msgContainer) {
                    const bubble = document.createElement('div');
                    bubble.style.cssText = 'background:#f3f4f6;color:#6b7280;padding:6px 14px;border-radius:99px;font-size:11px;font-weight: 400;text-align:center;margin:8px auto;max-width:80%;display:block;';
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
        }

        function employerRateWorkerFromChat(jobTitle, stars) {
            const chat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (!chat) return;

            // 1. Update application status & rating
            const appIndex = localWorkerApplications.findIndex(a => 
                a.title === jobTitle && 
                (a.workerUid === chat.workerId || a.workerEmail === chat.workerEmail)
            );
            if (appIndex !== -1) {
                localWorkerApplications[appIndex].status = 'Befejezett';
                localWorkerApplications[appIndex].rating = stars;
                saveWorkerApplications();

                // Persist status to Firestore
                if (window.firebaseAPI && window.firebaseDb) {
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    window.firebaseAPI.updateDoc(appRef, { status: 'Befejezett', rating: stars })
                        .then(() => console.log('[Complete] Application status updated to Befejezett in Firestore'))
                        .catch(e => console.error('[Complete] Firestore application status update failed:', e));
                }
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
                    { status: 'completed', lastMsg: 'A munka sikeresen befejezve', updatedAt: window.firebaseAPI.serverTimestamp() }
                ).catch(e => console.error('[Complete] Chat status update failed:', e));
            }

            gameState.status = 'Kifizetve';

            // 3. Append system message in the chat
            const msgContainer = document.getElementById('chat-detail-messages');
            if (msgContainer) {
                const bubble = document.createElement('div');
                bubble.style.cssText = 'background: var(--color-surface); border: 1px solid #D1D5DB; color: var(--color-text); padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 400; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
                bubble.innerHTML = `A munkáltató lezárta a munkát és értékelte a teljesítményt: <br><span style="font-size: 16px;">${starsHtml(stars)}</span>`;
                msgContainer.appendChild(bubble);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }

            showGreenBanner(`Értékelés leadva: ${stars} csillag!`);

            // 4. Update UI
            updateChatActionBar(jobTitle);
            renderWorkerApplications();
            renderEmployerHome();
            updateAllUserUI();
        }

        // ===================================================================
        // REDESIGN: EMPLOYER HOME SCREEN & DYNAMIC ADS LIST
        // ===================================================================
        // localEmployerJobs is populated from Firestore in real time via the jobs listener
        var localEmployerJobs = [];

        function initEmployerJobs() {
            try {
                const saved = localStorage.getItem('melogo_employer_jobs');
                if (saved) {
                    localEmployerJobs = JSON.parse(saved);
                } else {
                    localStorage.setItem('melogo_employer_jobs', JSON.stringify(localEmployerJobs));
                }
            } catch(e) {
                console.warn('[Employer] localStorage error:', e);
            }
            renderSkeletonEmployerJobs('employer-active-jobs-list', 2);
            setTimeout(() => {
                renderEmployerHome();
            }, 300);
        }

        function saveEmployerJobs() {
            try {
                localStorage.setItem('melogo_employer_jobs', JSON.stringify(localEmployerJobs));
            } catch(e) {
                console.warn('[Employer] failed to save:', e);
            }
        }
        
        function saveWorkerApplications() {
            try {
                localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications));
            } catch(e) {
                console.warn('[Worker] failed to save applications:', e);
            }
        }

        function renderSkeletonEmployerJobs(containerId, count) {
            const list = document.getElementById(containerId);
            if (!list) return;
            let html = '';
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="emp-ad-card shimmer" style="border: 1px solid var(--color-text); background: var(--color-surface)">
                        <div class="emp-ad-icon-circle" style="background: var(--color-surface); border:none;"></div>
                        <div class="emp-ad-middle">
                            <div style="width:60%; height:14px; background: var(--color-surface); border-radius:4px; margin-bottom:6px;"></div>
                            <div style="width:40%; height:10px; background: var(--color-surface); border-radius:4px;"></div>
                        </div>
                        <div class="emp-ad-right">
                            <div style="width:48px; height:20px; background: var(--color-surface); border-radius: 16px;"></div>
                        </div>
                    </div>
                `;
            }
            list.innerHTML = html;
        }

        function renderEmployerHome() {
            const list = document.getElementById('employer-active-jobs-list');
            const countLabel = document.getElementById('emp-active-count');
            if (!list) return;

            const currentUserUid = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : 'NO_UID';
            const myJobs = localEmployerJobs.filter(j => j.ownerUid === currentUserUid);

            // Calculate dynamic status counts for dashboard
            let countSeeking = 0;
            let countApplicants = 0;
            let countActive = 0;
            let countCompleted = 0;

            myJobs.forEach(job => {
                if (job.status === 'Befejezett') {
                    countCompleted++;
                } else if (job.status === 'Aktív' || job.status === 'accepted') {
                    countActive++;
                } else if (job.status === 'Keresés') {
                    const hasPendingApps = localWorkerApplications.some(a => a.jobId === job.id && a.status === 'Függőben');
                    if (hasPendingApps) {
                        countApplicants++;
                    } else {
                        countSeeking++;
                    }
                }
            });

            // Update summary cards
            const seekingEl = document.getElementById('stat-count-seeking');
            const applicantsEl = document.getElementById('stat-count-applicants');
            const activeEl = document.getElementById('stat-count-active');
            const completedEl = document.getElementById('stat-count-completed');

            if (seekingEl) seekingEl.innerText = countSeeking;
            if (applicantsEl) applicantsEl.innerText = countApplicants;
            if (activeEl) activeEl.innerText = countActive;
            if (completedEl) completedEl.innerText = countCompleted;

            // Count total active ads
            const activeCount = myJobs.filter(j => j.status !== 'Befejezett').length;
            if (countLabel) {
                countLabel.innerText = `${activeCount} aktív`;
            }

            if (myJobs.length === 0) {
                list.innerHTML = `
                    <div class="emp-empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" stroke-width="1.5" style="margin-bottom:8px;">
                            <path d="M12 22v-4M17 22v-4M7 22v-4M2 18h20V4H2v14z"/>
                        </svg>
                        <h3 style="font-size: 13px; font-weight: 400; color: var(--color-text); margin-bottom: 4px;">Még nincs aktív hirdetésed</h3>
                        <p style="font-size: 11px; color: var(--color-text-light); max-width: 260px;">Keresel valakit a ház körüli munkákra? Adj fel egy hirdetést!</p>
                    </div>
                `;
                return;
            }

            let html = '';
            myJobs.forEach(job => {
                let statusClass = 'seeking';
                let statusText = 'Keresés';
                let cardClass = 'status-seeking';

                if (job.status === 'Befejezett') {
                    statusClass = 'completed';
                    statusText = 'Befejezve';
                    cardClass = 'status-completed';
                } else if (job.status === 'Aktív' || job.status === 'accepted') {
                    statusClass = 'active';
                    statusText = 'Folyamatban';
                    cardClass = 'status-active';
                } else if (job.status === 'Keresés') {
                    const jobApps = localWorkerApplications.filter(a => a.jobId === job.id && a.status === 'Függőben');
                    if (jobApps.length > 0) {
                        statusClass = 'applicants';
                        statusText = `${jobApps.length} jelentkező`;
                        cardClass = 'status-applicants';
                    } else {
                        statusClass = 'seeking';
                        statusText = 'Keresés';
                        cardClass = 'status-seeking';
                    }
                }

                let iconSvg = '';
                if (job.category === 'Kert') {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/></svg>`;
                } else if (job.category === 'Festés') {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.52 22 22 17.52 22 12C22 5.5 16.5 2 12 2C6.5 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1" fill="currentColor"/></svg>`;
                } else if (job.category === 'Autó') {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.2-1.4.7L3 11c-.6.8-1 1.8-1 2.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>`;
                } else {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="12" width="6" height="5" rx="1"/></svg>`;
                }

                html += `
                    <div class="emp-ad-card ${cardClass}" id="emp-ad-card-${job.id}" onclick="clickEmployerAdCard('${job.id}')">
                        <div class="emp-ad-icon-circle">
                            ${iconSvg}
                        </div>
                        <div class="emp-ad-middle">
                            <div class="emp-ad-title">${job.title}</div>
                            <div class="emp-ad-meta">${job.location.split(',').slice(-1)[0].trim()} · ${job.datetime}</div>
                        </div>
                        <div class="emp-ad-right">
                            <span class="emp-ad-pill ${statusClass}">${statusText}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>
                    </div>
                `;
            });
            list.innerHTML = html;
        }

        // openEditEmployerJob implementation to prefill post form for editing
        function openEditEmployerJob(jobId) {
            currentEditJobId = jobId;
            let job = localEmployerJobs.find(j => j.id === jobId);
            
            // Try in mockJobs if not in localEmployerJobs
            if (!job) {
                const mock = mockJobs.find(j => j.id === parseInt(jobId));
                if (mock) {
                    job = {
                        id: mock.id,
                        title: mock.title,
                        details: mock.desc,
                        location: mock.location,
                        price: mock.price,
                        category: mock.category,
                        status: 'Keresés',
                        datetime: mock.time || 'Ma, 14:00'
                    };
                }
            }

            if (!job) return;

            // Open overlay form
            document.getElementById('employer-form-overlay').classList.add('open');

            // Change header title and submit button label
            const titleEl = document.querySelector('#employer-form-overlay .emp-form-title');
            if (titleEl) titleEl.innerText = "Hirdetés szerkesztése";
            const submitEl = document.querySelector('#employer-form-overlay .emp-submit-btn');
            if (submitEl) {
                submitEl.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Módosítások mentése
                `;
            }

            // Prefill Category (this automatically triggers dropdown load)
            selectEmpCat(job.category);

            // Prefill specific job dropdown
            const selectEl = document.getElementById('emp-job-select');
            if (selectEl) {
                selectEl.value = job.title;
            }

            // Prefill Description
            const detailsEl = document.getElementById('emp-details');
            if (detailsEl) {
                detailsEl.value = job.details;
                updateEmpDescCounter(detailsEl);
            }

            // Prefill Location (using the locked state logic)
            selectAddress(job.location);

            // Prefill Price
            const priceEl = document.getElementById('emp-price-input');
            if (priceEl) {
                priceEl.value = job.price;
                updateEmpPriceDisplay(job.price);
            }

            // Prefill Datetime
            const datetimeEl = document.getElementById('emp-datetime');
            if (datetimeEl) {
                datetimeEl.value = job.datetime;
            }
        }

        // Overwrite employerPublishJob to push or update the localEmployerJobs database
        async function employerPublishJobNew(btnEvent) {
            // Validate fields
            let valid = true;
            const details = document.getElementById('emp-details');
            const submitBtn = document.querySelector('.emp-submit-btn');
            
            if (submitBtn) {
                if (submitBtn.disabled) return;
                submitBtn.disabled = true;
                submitBtn._originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-small" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;"></span> Feldolgozás...';
            }
            
            // Hide all errors first
            document.querySelectorAll('.emp-field-error').forEach(e => e.classList.remove('show'));

            if (!details || details.value.length < 10) {
                valid = false;
                const err = document.getElementById('err-desc');
                if (err) err.classList.add('show');
                if (details) details.classList.add('error');
                setTimeout(() => { if (details) details.classList.remove('error'); }, 2000);
            }

            // Magántanár: szint megadása kötelező
            if (empActiveCat === 'Magántanár') {
                const lvlSel = document.getElementById('emp-tutor-level-select');
                if (!lvlSel || !lvlSel.value) {
                    valid = false;
                    const errLvl = document.getElementById('err-tutor-level');
                    if (errLvl) errLvl.classList.add('show');
                }
            }

                    const zipVal = (document.getElementById('emp-zip') ? document.getElementById('emp-zip').value.trim() : '');
        const countyVal = (document.getElementById('emp-county') ? document.getElementById('emp-county').value.trim() : '');
        const cityVal = (document.getElementById('emp-city') ? document.getElementById('emp-city').value.trim() : '');
        const streetVal = (document.getElementById('emp-street') ? document.getElementById('emp-street').value.trim() : '');
        const houseVal = (document.getElementById('emp-house') ? document.getElementById('emp-house').value.trim() : '');
        const aptVal = document.getElementById('emp-apartment') ? document.getElementById('emp-apartment').value.trim() : '';
        
        if (!zipVal || !countyVal || !cityVal || !streetVal || !houseVal) {
            valid = false;
            const err = document.getElementById('err-loc-structured');
            if (err) { err.innerText = 'Kérjük tölts ki minden kötelező címadatot!'; err.classList.add('show'); }
            ['emp-zip', 'emp-county', 'emp-city', 'emp-street', 'emp-house'].forEach(id => {
                const el = document.getElementById(id);
                if(el && !el.value.trim()) {
                    el.style.border = '1px solid #EF4444';
                    setTimeout(() => el.style.border = '1px solid var(--color-border)', 2500);
                }
            });
        }

        let generatedAddress = `${zipVal} ${cityVal}, ${streetVal} ${houseVal}.`;
        if (aptVal) generatedAddress += ` ${aptVal}`;
        let finalConfirmedAddress = generatedAddress;
        window.confirmedAddress = finalConfirmedAddress;

        if (!valid) {
                const firstErr = document.querySelector('.emp-field-error.show');
                if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn._originalText || 'Hirdetés közzététele';
                }
                return;
            }

            const specificJob = document.getElementById('emp-job-select').value;
            const desc = details.value || 'Alkalmi munka precízen elvégezve.';
            const county = document.getElementById('emp-county').value || 'Somogy';
            const city = document.getElementById('emp-city').value || 'Kaposvár';
            const street = document.getElementById('emp-street').value || 'Fő utca';
            const house = document.getElementById('emp-house').value || '1';
            const price = parseInt(document.getElementById('emp-price-input').value) || 12000;
            const dt = document.getElementById('emp-datetime').value || 'Holnap, 14:00';

            if (currentEditJobId) {
                // Editing existing job
                let jobIndex = localEmployerJobs.findIndex(j => j.id === currentEditJobId);
                if (jobIndex !== -1) {
                    localEmployerJobs[jobIndex].title = specificJob;
                    localEmployerJobs[jobIndex].details = desc;
                    localEmployerJobs[jobIndex].location = confirmedAddress;
                    localEmployerJobs[jobIndex].price = price;
                    localEmployerJobs[jobIndex].category = empActiveCat;
                    localEmployerJobs[jobIndex].datetime = dt;
                    localEmployerJobs[jobIndex].urgent = document.getElementById('emp-urgent-toggle') ? document.getElementById('emp-urgent-toggle').checked : false;
                    localEmployerJobs[jobIndex].toolsRequired = activeToolsRequired;
                    localEmployerJobs[jobIndex].lat = confirmedLat || 46.3667;
                    localEmployerJobs[jobIndex].lon = confirmedLon || 17.7833;
                    localEmployerJobs[jobIndex].zip = zipVal;
                    localEmployerJobs[jobIndex].county = countyVal;
                    localEmployerJobs[jobIndex].city = cityVal;
                    localEmployerJobs[jobIndex].street = streetVal;
                    localEmployerJobs[jobIndex].house = houseVal;
                    localEmployerJobs[jobIndex].apartment = aptVal;
                    
                    // Frissítés Firestore-ban is
                    if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                        try {
                            const jobRef = window.firebaseAPI.doc(window.firebaseDb, "jobs", currentEditJobId);
                            await window.firebaseAPI.updateDoc(jobRef, localEmployerJobs[jobIndex]);
                            
                            // Audit read-back
                            const checkSnap = await window.firebaseAPI.getDoc(jobRef);
                            if (checkSnap.exists()) {
                                console.log("Job successfully updated in Firestore:", currentEditJobId);
                            } else {
                                console.error("CRITICAL ERROR: Job not found after update!", currentEditJobId);
                            }
                        } catch(e) {
                            console.error("Firestore job update error:", e);
                        }
                    }
                }
                saveEmployerJobs();
                
                // Show success animation
                const anim = document.getElementById('emp-success-anim');
                if (anim) {
                    anim.classList.add('show');
                    setTimeout(() => {
                        anim.classList.remove('show');
                        closeEmployerFormOverlay();
                        renderEmployerHome();
                        renderMapPins(); // sync map pins
                        // Update detail screen with new values!
                        openEmployerAdDetailNew(currentEditJobId);
                        showPushNotification('Hirdetés módosítva!', 'A változtatások sikeresen elmentve!', 'var(--color-text)');
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitBtn._originalText || 'Hirdetés közzététele'; }
                    }, 1800);
                }
            } else {
                // Add new job
                const newJob = {
                    id: 'job_' + Date.now(),
                    title: specificJob,
                    details: desc,
                    location: confirmedAddress,
                    price: price,
                    status: 'Keresés',
                    category: empActiveCat,
                    datetime: dt,
                    ownerEmail: (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'employer@melogo.hu',
                    ownerUid: (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : 'NO_UID',
                    createdAt: Date.now(),
                    urgent: document.getElementById('emp-urgent-toggle') ? document.getElementById('emp-urgent-toggle').checked : false,
                    toolsRequired: activeToolsRequired,
                    lat: confirmedLat || 46.3667,
                    lon: confirmedLon || 17.7833,
                    zip: zipVal,
                    county: countyVal,
                    city: cityVal,
                    street: streetVal,
                    house: houseVal,
                    apartment: aptVal
                };

                localEmployerJobs.unshift(newJob);
                saveEmployerJobs();
                
                // MENTÉS FIRESTORE-BA: Kritikus bug javítása!
                if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                    try {
                        const jobRef = window.firebaseAPI.doc(window.firebaseDb, "jobs", newJob.id);
                        await window.firebaseAPI.setDoc(jobRef, newJob);
                        
                        // Audit read-back
                        const checkSnap = await window.firebaseAPI.getDoc(jobRef);
                        if (checkSnap.exists()) {
                            console.log("Job successfully written to Firestore:", newJob.id);
                        } else {
                            console.error("CRITICAL ERROR: Job not found after write!", newJob.id);
                        }
                    } catch(e) {
                        console.error("Firestore job save error:", e);
                    }
                }

                // Set gameState for compatibility with legacy UI functions (e.g. Map)
                gameState.jobTitle = specificJob;
                gameState.jobPrice = price;
                gameState.jobCounty = county;
                gameState.jobCity = city;
                gameState.jobStreet = street;
                gameState.jobHouse = house;
                gameState.jobDesc = desc;
                gameState.jobDistance = 4.2;
                gameState.status = 'Keresés';
                // Show success animation
                const anim = document.getElementById('emp-success-anim');
                if (anim) {
                    anim.classList.add('show');
                    setTimeout(() => {
                        anim.classList.remove('show');
                        closeEmployerFormOverlay();
                        renderEmployerHome();
                        renderMapPins(); // sync map pins
                        showPushNotification('Hirdetés közzétéve!', 'A munkások már látják a munkádat!', 'var(--color-text)');
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitBtn._originalText || 'Hirdetés közzététele'; }
                    }, 1800);
                }
            }
        }

        // ==========================================
        // ONBOARDING
        // ==========================================
        let currentOnboardingSlide = 0;

        function initOnboarding() {
            const seen = localStorage.getItem('melogo_onboarding_done');
            const screen = document.getElementById('onboarding-screen');
            const splash = document.getElementById('splash-screen');
            
            if (!screen) return;
            
            // Premium Splash Screen auto fadeout after 0.8 seconds!
            setTimeout(() => {
                if (splash) {
                    splash.style.opacity = '0';
                    splash.style.pointerEvents = 'none';
                    setTimeout(() => {
                        splash.style.display = 'none';
                    }, 500);
                }
            }, 800);

            if (seen) {
                screen.style.display = 'none';
                screen.style.pointerEvents = 'none';
            } else {
                screen.style.display = 'flex';
                screen.style.pointerEvents = 'auto';
                currentOnboardingSlide = 0;
                const slides = document.getElementById('onboarding-slides');
                if (slides) slides.style.transform = 'translateX(0%)';
                const btn = document.getElementById('ob-next-btn');
                if (btn) btn.innerText = 'Tovább';
                const dots = document.querySelectorAll('.ob-dot');
                dots.forEach(function(d, i) { d.classList.toggle('ob-dot-active', i === 0); });
            }
        }

        function onboardingNext() {
            currentOnboardingSlide++;
            if (currentOnboardingSlide >= 3) {
                skipOnboarding();
                return;
            }
            const slides = document.getElementById('onboarding-slides');
            slides.style.transform = 'translateX(-' + (currentOnboardingSlide * 33.333) + '%)';
            
            const dots = document.querySelectorAll('.ob-dot');
            dots.forEach((d, i) => {
                d.classList.toggle('ob-dot-active', i === currentOnboardingSlide);
            });
            
            const btn = document.getElementById('ob-next-btn');
            if (currentOnboardingSlide === 2) {
                btn.innerText = 'Kezdjük el';
                btn.style.background = 'var(--color-text)';
            }
        }

        function skipOnboarding() {
            localStorage.setItem('melogo_onboarding_done', 'true');
            const screen = document.getElementById('onboarding-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.4s ease';
                screen.style.opacity = '0';
                screen.style.pointerEvents = 'none';
                setTimeout(function() { screen.style.display = 'none'; screen.style.opacity = ''; screen.style.pointerEvents = ''; }, 450);
            }
        }

        // ==========================================
        // USER RENDSZER & TRUST SZINTEK
        // ==========================================
        function loadCurrentUser() {
            const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || 'null');
            const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || 'null');
            const activeRole = localStorage.getItem('melogo_active_role') || 'worker';
            
            const session = activeRole === 'employer' ? employerSession : workerSession;
            if (!session) return null;
            
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            
            // Sync completed applications with user rating and reviews
            let appsList = [];
            try {
                const savedApps = localStorage.getItem('melogo_worker_applications');
                appsList = savedApps ? JSON.parse(savedApps) : [];
            } catch(e) {
                console.warn('[loadCurrentUser] Error parsing applications:', e);
            }
            
            const completedApps = appsList.filter(a => a.status === 'Befejezett' || a.status === 'Kifizetve');
            if (!userData.reviews) userData.reviews = [];
            
            completedApps.forEach(app => {
                const hasReview = userData.reviews.some(r => r.job === app.title);
                if (!hasReview) {
                    const stars = app.rating || 5;
                    userData.reviews.unshift({
                        name: 'Megbízó (Munkaadó)',
                        initials: 'M',
                        stars: stars,
                        date: app.date || new Date().toLocaleDateString('hu-HU'),
                        text: 'Kiváló és megbízható munka! Köszönöm.',
                        job: app.title
                    });
                }
            });
            
            const dynamicJobCount = completedApps.length;
            let dynamicRating = 5.0;
            if (userData.reviews.length > 0) {
                const sum = userData.reviews.reduce((a, b) => a + b.stars, 0);
                dynamicRating = sum / userData.reviews.length;
            }
            
            userData.jobCount = dynamicJobCount;
            userData.rating = dynamicRating;
            userData.reviewCount = userData.reviews.length;
            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
            let resolvedName = localStorage.getItem('melogo_name') || session.name || 'Felhasználó';
            if (resolvedName.includes('@')) {
                resolvedName = resolvedName.split('@')[0];
            }
            
            return {
                name: resolvedName,
                email: session.email || '',
                role: session.role || activeRole,
                jobCount: dynamicJobCount,
                rating: dynamicRating,
                reviewCount: userData.reviewCount || 0,
                reviews: userData.reviews || [],
                location: userData.location || 'Magyarország',
                address: userData.address || '',
                trustLevel: calcTrustLevel(dynamicJobCount, dynamicRating),
                initials: getInitials(session.name || 'Felhasználó'),
                darkMode: localStorage.getItem('melogo_dark_mode') === 'true',
                bio: userData.bio || 'Üdv! A Kaposvári Egyetem diákja vagyok. Szívesen vállalok fűnyírást és autómosást hétvégenként. Megbízható és pontos vagyok.',
                skills: userData.skills || ['Kertészet', 'Autómosás', 'Takarítás'],
                photoURL: userData.photoURL || ''
            };
        }

        function getInitials(name) {
            if (!name) return '?';
            if (name === 'Megbízó') return 'MB';
            const parts = name.trim().split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        }

        function calcTrustLevel(jobCount, rating) {
            if (jobCount >= 15 && rating >= 4.7) return { level: 4, name: 'Prémium', bg: '#EEF2FF', color: 'var(--color-text)' };
            if (jobCount >= 8 && rating >= 4.3) return { level: 3, name: 'Tapasztalt', bg: '#FFFBEB', color: '#B45309' };
            if (jobCount >= 3 && rating >= 4.0) return { level: 2, name: 'Megbízható', bg: '#EFF6FF', color: '#1D4ED8' };
            return { level: 1, name: 'Kezdő', bg: '#FFFFFF', color: 'var(--color-text)' };
        }

        function renderTrustBadge(trust, size) {
            const sz = size === 'sm' ? 'font-size:11px;padding:3px 8px;' : 'font-size:12px;padding:4px 10px;';
            return '<span style="' + sz + 'background:' + trust.bg + ';color:' + trust.color + ';border-radius: 16px;font-weight: 400;display:inline-block;">' + trust.name + '</span>';
        }

        function updateAllUserUI() {
            const user = loadCurrentUser();
            if (!user) return;
            
            // Update all name elements
            document.querySelectorAll('.user-name-display').forEach(el => { el.innerText = user.name; });
            document.querySelectorAll('.user-first-name-display').forEach(el => { el.innerText = user.name; });
            document.querySelectorAll('.user-initials-display').forEach(el => { el.innerText = user.initials; });
            document.querySelectorAll('.user-location-display').forEach(el => { el.innerText = user.location; });
            document.querySelectorAll('.user-job-count').forEach(el => { el.innerText = user.jobCount; });
            document.querySelectorAll('.user-rating-display').forEach(el => { el.innerText = user.rating.toFixed(1); });
            document.querySelectorAll('.user-trust-badge').forEach(el => { el.innerHTML = renderTrustBadge(user.trustLevel); });
            
            const avatarBg = getAvatarGradient(user.name);
            document.querySelectorAll('.user-avatar-bg').forEach(el => { el.style.background = avatarBg; });
            
            const profileHeroRating = document.getElementById('profile-hero-rating');
            if (profileHeroRating) {
                profileHeroRating.style.display = (activeRole === 'employer') ? 'none' : 'flex';
            }

            // Update bio and skills displays on profile screen
            const bioDisplay = document.getElementById('profile-bio-display');
            if (bioDisplay) {
                bioDisplay.textContent = user.bio ? '\u201c' + user.bio + '\u201d' : '"Nincs bemutatkozás megadva."';
            }
            
            const skillsDisplay = document.getElementById('profile-skills-display');
            if (skillsDisplay && user.skills) {
                skillsDisplay.innerHTML = user.skills.map(s => `
                    <span class="profile-skill-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M3 12h1M20 12h1M12 3v1M12 20v1"/></svg>
                        ${s}
                    </span>
                `).join('');
                
                // Keep the selectedSkills Set in sync
                selectedSkills = new Set(user.skills);
            }

            // Sync bio field in settings overlay
            const settingsBioInput = document.getElementById('settings-bio');
            if (settingsBioInput) {
                settingsBioInput.value = user.bio || '';
            }

            // Sync name field in settings overlay
            const settingsNameInput = document.getElementById('settings-name');
            if (settingsNameInput) {
                settingsNameInput.value = user.name || '';
            }

            // Update avatar displays
            if (typeof updateAllAvatarDisplays === 'function') {
                updateAllAvatarDisplays(user.photoURL);
            }

            // Frissítsük a Jelentkezéseim listát a profil lapon
            if (typeof renderWorkerApplications === 'function') renderWorkerApplications();

            // Frissítsük a véleményeket a profil lapon
            if (typeof renderProfileReviews === 'function') renderProfileReviews();
            
            // Szerep szerint jelenítsük meg vagy rejtsük el a Jelentkezéseim szekciót
            const appSection = document.getElementById('profile-applications-section');
            if (appSection) {
                appSection.style.display = currentRole === 'worker' ? 'block' : 'none';
            }
        }

        function getAvatarGradient(name) {
            const colors = [
                'var(--color-text)',
                '#7c3aed',
                '#059669',
                '#b45309',
                '#1d4ed8'
            ];
            let h = 0;
            for (let i = 0; i < (name||'').length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFF;
            return colors[h % colors.length];
        }

        function getAvatarColor(name) {
            return getAvatarGradient(name);
        }

        // ==========================================
        // RATING SYSTEM
        // ==========================================
        let currentRating = 0;
        let ratingFor = 'worker'; // or 'employer'

        function openRatingScreen(forRole) {
            ratingFor = forRole;
            currentRating = 0;
            const overlay = document.getElementById('rating-overlay');
            if (!overlay) return;
            
            document.querySelectorAll('.rating-star').forEach((s, i) => {
                s.style.fill = 'none';
                s.style.color = '#D1D5DB';
                setTimeout(() => {
                    s.style.transform = 'scale(1)';
                    s.parentElement.style.transform = 'translateY(0)';
                }, i * 80);
            });
            document.getElementById('rating-text').value = '';
            overlay.classList.add('active');
        }

        function setRatingStar(n) {
            currentRating = n;
            document.querySelectorAll('.rating-star-btn').forEach((btn, i) => {
                const star = btn.querySelector('.rating-star');
                if (i < n) {
                    star.style.fill = 'var(--color-text)';
                    star.style.color = 'var(--color-text)';
                    btn.style.transform = 'scale(1.15)';
                } else {
                    star.style.fill = 'none';
                    star.style.color = '#D1D5DB';
                    btn.style.transform = 'scale(1)';
                }
            });
        }

        function submitRating() {
            if (currentRating === 0) {
                document.getElementById('rating-error').style.display = 'block';
                return;
            }
            document.getElementById('rating-error').style.display = 'none';
            
            const text = document.getElementById('rating-text').value.trim();
            const user = loadCurrentUser();
            
            // Save rating to userData
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const newReview = {
                name: 'Értékelő felhasználó',
                initials: 'ÉF',
                stars: currentRating,
                date: new Date().toLocaleDateString('hu-HU'),
                text: text || '',
                job: gameState.jobTitle || 'Munka'
            };
            if (!userData.reviews) userData.reviews = [];
            userData.reviews.unshift(newReview);
            
            const allRatings = userData.reviews.map(r => r.stars);
            userData.rating = (allRatings.reduce((a,b) => a+b, 0) / allRatings.length);
            userData.reviewCount = userData.reviews.length;
            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
            
            // Close rating and show success
            const overlay = document.getElementById('rating-overlay');
            if (overlay) overlay.classList.remove('active');
            
            showGreenBanner('Értékelés elküldve! Köszönjük.');
            updateAllUserUI();
        }

        function showGreenBanner(text) {
            let banner = document.getElementById('green-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'green-banner';
                banner.style.cssText = 'position: absolute;top:-80px;left:50%;transform:translateX(-50%);background:rgba(0, 0, 0,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:14px 24px;border-radius:100px;font-weight: 400;font-size:14px;z-index:9999;transition:top 0.4s cubic-bezier(0.175,0.885,0.32,1.275);white-space:nowrap;display:flex;align-items:center;gap:8px;';
                document.body.appendChild(banner);
            }
            banner.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${text}</span>`;
            banner.style.top = '60px';
            setTimeout(() => { banner.style.top = '-60px'; }, 3000);
        }

        // ==========================================
        // DARK MODE
        // ==========================================
        function applyDarkMode(enabled) {
            const root = document.documentElement;
            if (enabled) {
                root.style.setProperty('--color-bg', '#000000');
                root.style.setProperty('--color-surface', '#1E293B');
                root.style.setProperty('--color-card', '#1E293B');
                root.style.setProperty('--color-border', '#334155');
                root.style.setProperty('--color-text-dark', '#FFFFFF');
                root.style.setProperty('--color-text', '#F8FAFC');
                root.style.setProperty('--color-text-muted', '#94A3B8');
                document.body.style.background = '#000000';
                document.body.style.color = '#F8FAFC';
                
                // Chat variables
                root.style.setProperty('--color-chat-bg', '#000000');
                root.style.setProperty('--color-chat-bubble-in', '#1E293B');
                root.style.setProperty('--color-chat-bubble-out', '#c0fc2a');
                root.style.setProperty('--color-chat-text-in', '#FFFFFF');
                root.style.setProperty('--color-chat-text-out', '#000000');
                root.style.setProperty('--color-chat-border-in', '#334155');
            } else {
                root.style.setProperty('--color-bg', '#F8F9FB');
                root.style.setProperty('--color-surface', '#FFFFFF');
                root.style.setProperty('--color-card', '#FFFFFF');
                root.style.setProperty('--color-border', '#E2E8F0');
                root.style.setProperty('--color-text-dark', '#000000');
                root.style.setProperty('--color-text', '#000000');
                root.style.setProperty('--color-text-muted', '#64748B');
                document.body.style.background = '';
                document.body.style.color = '';
                
                // Chat variables
                root.style.setProperty('--color-chat-bg', '#F3F4F6');
                root.style.setProperty('--color-chat-bubble-in', '#FFFFFF');
                root.style.setProperty('--color-chat-bubble-out', '#000000');
                root.style.setProperty('--color-chat-text-in', '#000000');
                root.style.setProperty('--color-chat-text-out', '#FFFFFF');
                root.style.setProperty('--color-chat-border-in', '#E2E8F0');
            }
        }

        function toggleDarkMode() {
            const isDark = localStorage.getItem('melogo_dark_mode') === 'true';
            const newVal = !isDark;
            localStorage.setItem('melogo_dark_mode', String(newVal));
            applyDarkMode(newVal);
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = newVal;
        }

        function initDarkMode() {
            const isDark = localStorage.getItem('melogo_dark_mode') === 'true';
            applyDarkMode(isDark);
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = isDark;
        }

        // ==========================================
        // EMPTY STATES
        // ==========================================
        function showWorkerEmptyState() {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;
            list.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px;text-align:center;">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" style="margin-bottom:24px;">
                        <circle cx="44" cy="44" r="26"/>
                        <line x1="62" y1="62" x2="80" y2="80"/>
                        <path d="M34 44 L44 30 M44 44 L56 44" opacity="0.5"/>
                        <circle cx="75" cy="25" r="15" stroke="#FFFFFF"/>
                        <line x1="70" y1="20" x2="80" y2="30" opacity="0.4"/>
                        <line x1="80" y1="20" x2="70" y2="30" opacity="0.4"/>
                    </svg>
                    <div style="font-size:17px;font-weight: 500;color: var(--color-text);margin-bottom:8px;">Nincs közeli munka</div>
                    <div style="font-size:14px;color: var(--color-text);line-height:1.6;margin-bottom:24px;">Próbálj nagyobb hatókört beállítani,<br>vagy nézz vissza hamarosan.</div>
                    <button onclick="openRadiusSlider()" style="background:var(--color-text);color:#fff;border:none;padding:12px 24px;border-radius: 16px;font-weight: 400;font-size:14px;cursor:pointer;">Hatókör növelése</button>
                </div>
            `;
        }

        function showMessagesEmptyState() {
            const list = document.getElementById('messages-chat-list');
            if (!list || list.children.length > 0) return;
            const hasItems = Array.from(list.children).some(c => !c.id || !c.id.includes('empty'));
            if (hasItems) return;
            list.innerHTML = `
                <div id="messages-empty-state" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 32px;text-align:center;">
                    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" style="margin-bottom:20px;">
                        <path d="M20 30 L80 30 L80 65 L55 65 L40 80 L40 65 L20 65 Z" rx="8"/>
                        <line x1="35" y1="45" x2="65" y2="45" opacity="0.5"/>
                        <line x1="35" y1="55" x2="55" y2="55" opacity="0.5"/>
                    </svg>
                    <div style="font-size:17px;font-weight: 500;color: var(--color-text);margin-bottom:8px;">Még csend van itt</div>
                    <div style="font-size:14px;color: var(--color-text);line-height:1.6;">Jelentkezz egy munkára és automatikusan<br>megnyílik a chat.</div>
                </div>
            `;
        }

        // ==========================================
        // MUNKA LEZÁRÁSA FLOW
        // ==========================================
        function openCloseJobSheet() {
            document.getElementById('close-job-backdrop').style.display = 'block';
            document.getElementById('close-job-sheet').style.bottom = '0px';
        }

        function closeCloseJobSheet() {
            document.getElementById('close-job-backdrop').style.display = 'none';
            document.getElementById('close-job-sheet').style.bottom = '-300px';
        }

        function confirmCloseJob(event) {
            if (event && event.currentTarget) {
                const btn = event.currentTarget;
                if (btn.disabled) return;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-small" style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite; margin-right: 4px;"></span>...';
            }
            closeCloseJobSheet();
            
            const chat = selectedChatId ? localChats.find(c => c.id === selectedChatId) : null;
            if (chat) {
                const jobTitle = chat.jobTitle;
                
                // 1. Update application status to Befejezett
                const appIndex = localWorkerApplications.findIndex(a => 
                    a.title === jobTitle && 
                    (a.workerUid === chat.workerId || a.workerEmail === chat.workerEmail)
                );
                if (appIndex !== -1) {
                    localWorkerApplications[appIndex].status = 'Befejezett';
                    saveWorkerApplications();
                    
                    if (window.firebaseAPI && window.firebaseDb) {
                        const appDocId = localWorkerApplications[appIndex].id;
                        const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                        window.firebaseAPI.updateDoc(appRef, { status: 'Befejezett' })
                            .catch(e => console.error("Firestore app update error:", e));
                    }
                }
                
                // 2. Update job status to completed
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
                    ).catch(e => console.error("Firestore job update error:", e));
                }
                
                // 3. Update chat status to completed
                if (chat.isFirestore && window.firebaseAPI && window.firebaseDb) {
                    window.firebaseAPI.updateDoc(
                        window.firebaseAPI.doc(window.firebaseDb, "chats", chat.id),
                        { status: 'completed', lastMsg: 'A munka sikeresen lezárva', updatedAt: window.firebaseAPI.serverTimestamp() }
                    ).catch(e => console.error("Firestore chat update error:", e));
                }
            }
            
            gameState.status = 'Kifizetve';
            
            // Close employer overlay
            const empOverlay = document.getElementById('employer-action-overlay');
            if (empOverlay) empOverlay.classList.remove('active');
            
            showGreenBanner('Munka lezárva! Köszönjük.');
            
            setTimeout(() => {
                openRatingScreen('worker');
                if (event && event.currentTarget) {
                    event.currentTarget.disabled = false;
                    event.currentTarget.innerHTML = 'Befejezés és Értékelés';
                }
            }, 800);
        }

        
        function starsHtml(n) {
            const num = Math.max(0, Math.min(5, n));
            const filledStr = '<span style="color: var(--color-text);">★</span>'.repeat(num);
            const emptyStr = '<span style="color: var(--color-text);">★</span>'.repeat(5 - num);
            return filledStr + emptyStr;
        }

        function renderProfileReviews() {
            const container = document.getElementById('profile-reviews-section');
            if (!container) return;
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const reviews = userData.reviews || [];
            if (reviews.length === 0) {
                container.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;padding:32px;text-align:center;"><svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D1D5DB\" stroke-width=\"1.5\" style=\"margin-bottom:12px;\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg><div style=\"font-size:15px;font-weight: 400;color: var(--color-text);margin-bottom:6px;\">Még nincs véleményed</div><div style=\"font-size:13px;color: var(--color-text);\">Végezz el munkákat hogy értékeléseket kapj.</div></div>';
                return;
            }
            const last5 = reviews.slice(0, 5);
            container.innerHTML = last5.map(function(r) {
                return '<div style="background: var(--color-surface);border: 1px solid var(--color-text);border-radius: 16px;padding:14px 16px;margin-bottom:10px;">' +
                    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
                    '<div style="width:36px;height:36px;border-radius:50%;background-color: var(--color-text);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight: 500;color:#fff;flex-shrink:0;">' + (r.initials || '?') + '</div>' +
                    '<div style="flex:1;"><div style="font-size:13px;font-weight: 500;color: var(--color-text);">' + r.name + '</div><div style="font-size:11px;color: var(--color-text);">' + r.date + '</div></div>' +
                    '<div style="color:#FBBF24;font-size:14px;">' + starsHtml(r.stars) + '</div>' +
                    '</div>' +
                    (r.text ? '<div style="font-size:13px;color: var(--color-text);line-height:1.5;">' + r.text + '</div>' : '') +
                    (r.job ? '<div style="font-size:11px;color: var(--color-text);margin-top:6px;font-style:italic;">' + r.job + '</div>' : '') +
                    '</div>';
            }).join('');
        }

        function openAllReviews() {
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const reviews = userData.reviews || [];
            const overlay = document.getElementById('all-reviews-overlay');
            if (!overlay) return;
            const list = document.getElementById('all-reviews-list');
            if (list) {
                if (reviews.length === 0) {
                    list.innerHTML = '<div style="text-align:center;padding:40px;color: var(--color-text);">Még nincs egyetlen véleményed sem.</div>';
                } else {
                    list.innerHTML = reviews.map(function(r) {
                        return '<div style="background: var(--color-surface);border: 1px solid var(--color-text);border-radius: 16px;padding:14px 16px;margin-bottom:10px;">' +
                            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
                            '<div style="width:36px;height:36px;border-radius:50%;background-color: var(--color-text);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight: 500;color:#fff;flex-shrink:0;">' + (r.initials || '?') + '</div>' +
                            '<div style="flex:1;"><div style="font-size:13px;font-weight: 500;color: var(--color-text);">' + r.name + '</div><div style="font-size:11px;color: var(--color-text);">' + r.date + '</div></div>' +
                            '<div style="color:#FBBF24;font-size:14px;">' + starsHtml(r.stars) + '</div>' +
                            '</div>' +
                            (r.text ? '<div style="font-size:13px;color: var(--color-text);line-height:1.5;">' + r.text + '</div>' : '') +
                            '</div>';
                    }).join('');
                }
            }
            overlay.classList.add('active');
        }

        // Dark mode toggle visual sync (called after DOM ready)
        function initDarkModeToggle() {
            const track = document.getElementById('dark-toggle-track');
            const thumb = document.getElementById('dark-toggle-thumb');
            const toggle = document.getElementById('dark-mode-toggle');
            const isDark = localStorage.getItem('melogo_dark_mode') === 'true';
            if (toggle) toggle.checked = isDark;
            if (isDark && track && thumb) {
                track.style.background = 'var(--color-text)';
                thumb.style.transform = 'translateX(20px)';
            }
            if (toggle) {
                toggle.addEventListener('change', function() {
                    const t = document.getElementById('dark-toggle-track');
                    const th = document.getElementById('dark-toggle-thumb');
                    if (this.checked) {
                        if (t) t.style.background = 'var(--color-text)';
                        if (th) th.style.transform = 'translateX(20px)';
                    } else {
                        if (t) t.style.background = '#FFFFFF';
                        if (th) th.style.transform = 'translateX(0)';
                    }
                });
            }
        }

        // ===================================================================
        // NEW: PREMIUM INTERACTIVE PROFILE & APPLICATIONS LOGIC
        // ===================================================================
        var localWorkerApplications = [];

        function initWorkerApplications() {
            try {
                const saved = localStorage.getItem('melogo_worker_applications');
                if (saved) {
                    localWorkerApplications = JSON.parse(saved);
                } else {
                    localWorkerApplications = [];
                }
                
                // Applications are synced from Firestore; no local demo injection needed.
            } catch(e) {
                console.warn('[Apps] init error:', e);
            }
            renderWorkerApplications();
        }

        function renderWorkerApplications() {
            const list = document.getElementById('profile-applications-list');
            if (!list) return;
            
            if (localWorkerApplications.length === 0) {
                list.innerHTML = `
                    <div style="background: white; border-radius: 16px; border: 1px solid var(--color-text); padding: 20px; text-align: center; box-sizing: border-box;">
                        <div style="font-size: 24px; margin-bottom: 8px;">💼</div>
                        <div style="font-size: 13px; font-weight: 400; color: var(--color-text);">Nincs még aktív jelentkezésed</div>
                        <div style="font-size: 11px; color: var(--color-text); margin-top: 4px; line-height: 1.3;">Keress egy neked tetsző munkát a Főlapon, és jelentkezz rá!</div>
                    </div>
                `;
                return;
            }

            list.innerHTML = localWorkerApplications.map(function(app) {
                let statusClass = 'seeking';
                let statusText = 'Függőben';
                if (app.status === 'Aktív') {
                    statusClass = 'active';
                    statusText = 'Aktív';
                } else if (app.status === 'Értékelésre vár') {
                    statusClass = 'seeking';
                    statusText = 'Értékelésre vár';
                } else if (app.status === 'Befejezett' || app.status === 'Kifizetve') {
                    statusClass = 'completed';
                    const starsVal = app.rating ? app.rating : 5;
                    statusText = 'Befejezett <span style="margin-left:4px;">' + starsHtml(starsVal) + '</span>';
                }
                
                return `
                    <div style="background: white; border-radius: 16px; border: 1px solid var(--color-text); padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; gap: 8px;">
                        <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1;">
                            <span style="font-size: 14px; font-weight: 500; color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${app.title}</span>
                            <span style="font-size: 11px; color: var(--color-text);">${app.date} · <span style="font-weight: 400; color: var(--color-text);">${app.price.toLocaleString('hu-HU')} Ft</span></span>
                        </div>
                        <span class="emp-ad-pill ${statusClass}" style="font-size: 11px; padding: 4px 10px; border-radius: 16px; flex-shrink: 0;">
                            ${statusText}
                        </span>
                    </div>
                `;
            }).join('');
        }

        // ÉRTESÍTÉSEK
        function openNotificationsOverlay() {
            const list = document.getElementById('notifications-list-container');
            if (list) {
                // List of high-fidelity notifications based on actual user milestones
                const notifications = [
                    { title: '📅 Időpont közeleg', msg: 'A munkaidő közeledik. Kérlek, érkezz pontosan a megbeszélt időpontra!', time: 'Most', color: 'var(--color-text)', isNew: true },
                    { title: '📩 Jelentkezés elküldve', msg: 'Sikeresen jelentkeztél a(z) ' + (gameState.jobTitle || 'Fűnyírás') + ' feladatra.', time: '10 perce', color: 'var(--color-text)', isNew: false },
                    { title: '✨ Jelentkezés elfogadva', msg: 'A megbízó elfogadta a jelentkezésedet.', time: 'Tegnap', color: 'var(--color-text)', isNew: false },
                    { title: '⭐ Megbízható státusz', msg: 'Gratulálunk! Profilod elnyerte a Megbízható Diák jelvényt a kiváló visszajelzések alapján.', time: 'máj. 22.', color: '#16a34a', isNew: false },
                    { title: '🎉 Üdv a MeloGo-ban!', msg: 'Fiókod sikeresen aktiválva. Kezdj el böngészni a diákmunkák között!', time: 'máj. 20.', color: 'var(--color-text)', isNew: false }
                ];
                
                // If not applied yet, remove the active application alert
                if (!gameState.applied) {
                    notifications.splice(0, 2);
                }

                list.innerHTML = notifications.map(function(n) {
                    return `
                        <div style="background: white; border-radius: 16px; border: 1px solid var(--color-text); padding: 14px 16px; margin-bottom: 10px; position: relative; box-sizing: border-box;">
                            ${n.isNew ? '<div style="position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background-color: #EF4444; border-radius: 50%;"></div>' : ''}
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <div style="width: 8px; height: 8px; background: ${n.color}; border-radius: 50%;"></div>
                                <span style="font-weight: 500; color: var(--color-text); font-size: 13px;">${n.title}</span>
                                <span style="font-size: 10px; color: var(--color-text); margin-left: auto;">${n.time}</span>
                            </div>
                            <div style="font-size: 12px; color: var(--color-text); line-height: 1.4;">${n.msg}</div>
                        </div>
                    `;
                }).join('');
            }
            document.getElementById('notifications-overlay').classList.add('open');
        }

        // EARNINGS HISTORY
        function openEarningsSheet() {
            const list = document.getElementById('earnings-history-list');
            if (list) {
                const earnings = [
                    { title: 'Fűnyírás Kaposvár', amount: '12 000 Ft', date: 'Befejezve: 2026. máj. 22.', status: 'Kifizetve' },
                    { title: 'Kerítésfestés', amount: '24 000 Ft', date: 'Befejezve: 2026. máj. 18.', status: 'Kifizetve' },
                    { title: 'Autómosás és takarítás', amount: '8 000 Ft', date: 'Befejezve: 2026. máj. 14.', status: 'Kifizetve' }
                ];
                
                list.innerHTML = earnings.map(function(e) {
                    return `
                        <div style="background: var(--color-surface); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--color-text); box-sizing: border-box;">
                            <div style="min-width: 0; flex: 1;">
                                <div style="font-size: 13px; font-weight: 500; color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.title}</div>
                                <div style="font-size: 10px; color: var(--color-text); margin-top: 2px;">${e.date}</div>
                            </div>
                            <div style="text-align: right; flex-shrink: 0; margin-left: 8px;">
                                <div style="font-size: 13px; font-weight: 500; color: var(--color-text);">+${e.amount}</div>
                                <span style="font-size: 9px; color: var(--color-text); background: #F0FDF4; padding: 2px 6px; border-radius: 8px; font-weight: 400; display: inline-block; margin-top: 2px;">${e.status}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            
            document.getElementById('earnings-backdrop').classList.add('active');
            document.getElementById('earnings-sheet').classList.add('active');
        }

        function closeEarningsSheet() {
            document.getElementById('earnings-backdrop').classList.remove('active');
            document.getElementById('earnings-sheet').classList.remove('active');
        }

        // LAST JOB REVIEW
        function openLastJobSheet() {
            document.getElementById('last-job-backdrop').classList.add('active');
            document.getElementById('last-job-sheet').classList.add('active');
        }

        function closeLastJobSheet() {
            document.getElementById('last-job-backdrop').classList.remove('active');
            document.getElementById('last-job-sheet').classList.remove('active');
        }

        
        // AUTO-INIT: runs after all functions are defined
        (function() {
            function _safeInit() {

                try { if(typeof initLocalChats==='function') initLocalChats(); } catch(e) { console.warn('initLocalChats:', e); }
                try { if(typeof initEmployerJobs==='function') initEmployerJobs(); } catch(e) { console.warn('initEmployerJobs:', e); }
                try { if(typeof initWorkerApplications==='function') initWorkerApplications(); } catch(e) { console.warn('initWorkerApplications:', e); }

                try { if(typeof refreshJobList==='function') refreshJobList(); } catch(e) { console.warn('refreshJobList:', e); }

                try { if(typeof initOnboarding==='function') initOnboarding(); } catch(e) { console.warn('initOnboarding:', e); }
                try { if(typeof initDarkMode==='function') initDarkMode(); } catch(e) { console.warn('initDarkMode:', e); }
                try { if(typeof updateAllUserUI==='function') updateAllUserUI(); } catch(e) { console.warn('updateAllUserUI:', e); }
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', _safeInit);
            } else {
                _safeInit();
            }
        })();

        // PREMIUM FEATURE: Intelligent Button Disabling (Real-time Validation)
        setInterval(() => {
            // 1. Auth Form
            const authBtn = document.getElementById('main-auth-btn');
            if (authBtn) {
                if (typeof isLoginMode !== 'undefined' && isLoginMode) {
                    const email = (document.getElementById('login-email') || {}).value || '';
                    const pw = (document.getElementById('login-pw') || {}).value || '';
                    authBtn.disabled = !(email.includes('@') && pw.length > 0);
                } else {
                    const name = (document.getElementById('app-name') || {}).value || '';
                    const email = (document.getElementById('app-email') || {}).value || '';
                    const pw = (document.getElementById('app-pw') || {}).value || '';
                    const pw2 = (document.getElementById('app-pw2') || {}).value || '';
                    authBtn.disabled = !(name.trim().length >= 2 && email.includes('@') && pw.length >= 6 && pw === pw2);
                }
            }

            // 2. Employer Form
            const empOverlay = document.getElementById('employer-form-overlay');
            if (empOverlay && empOverlay.classList.contains('active')) {
                const empBtn = document.querySelector('#employer-form-overlay .emp-submit-btn');
                if (empBtn) {
                    const cat = document.querySelector('.emp-cat-card.active');
                    const job = (document.getElementById('emp-job-select') || {}).value || '';
                    const desc = (document.getElementById('emp-details') || {}).value || '';
                    const city = (document.getElementById('emp-city') || {}).value || '';
                    empBtn.disabled = !(cat && job && desc.length >= 10 && city);
                }
            }
        }, 300);

        // Expose UI functions to window so the Firebase module script can call them
        window.refreshJobList = refreshJobList;
        window.renderEmployerHome = renderEmployerHome;
        window.renderMapPins = renderMapPins;

        // Pull to refresh logic removed
        // window.renderWorkerHome = renderWorkerHome;

                function sendChatLocation() {
            const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposv�r') : 'Kaposv%C3%A1r';
            const link = `\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\x3E📍 Helyszín megnyitása\x3C/a\x3E`;
            const input = document.getElementById('chat-reply-input');
            if (input) {
                input.value = link;
                sendChatMessageNew(true);
            }
        }
        function sendWorkerChatLocation() {
            const dest = 'Kaposv%C3%A1r';
            const link = `\x3Ca href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" style="color:#2563EB; text-decoration:underline;"\x3E📍 Helyszín megnyitása\x3C/a\x3E`;
            const input = document.getElementById('worker-chat-reply-input');
            if (input) {
                input.value = link;
                sendWorkerChatMessageNew(true);
            }
        }

        // --- GLOBAL SWIPE-TO-GO-BACK ---
        let globalSwipeStartX = 0;
        let globalSwipeStartY = 0;
        document.addEventListener('touchstart', e => {
            globalSwipeStartX = e.changedTouches[0].screenX;
            globalSwipeStartY = e.changedTouches[0].screenY;
        }, {passive: true});
        
        document.addEventListener('touchend', e => {
            let swipeEndX = e.changedTouches[0].screenX;
            let swipeEndY = e.changedTouches[0].screenY;
            
            // Only trigger if starting near the left edge (< 40px)
            if (globalSwipeStartX > 40) return;
            
            let dx = swipeEndX - globalSwipeStartX;
            let dy = Math.abs(swipeEndY - globalSwipeStartY);
            
            if (dx > 70 && dy < 50) { // Horizontal right swipe
                if (document.getElementById('worker-job-detail-new') && document.getElementById('worker-job-detail-new').classList.contains('open')) {
                    closeWorkerJobDetailNew();
                } else if (document.getElementById('employer-job-detail-new') && document.getElementById('employer-job-detail-new').classList.contains('open')) {
                    closeEmployerAdDetailNew();
                } else if (document.getElementById('worker-chat-room') && document.getElementById('worker-chat-room').style.transform === 'translateX(0%)') {
                    closeWorkerChatRoom();
                } else if (document.getElementById('employer-chat-room') && document.getElementById('employer-chat-room').style.transform === 'translateX(0%)') {
                    closeEmployerChatRoom();
                } else if (document.getElementById('worker-profile-modal') && document.getElementById('worker-profile-modal').style.display === 'flex') {
                    closeWorkerProfile();
                } else if (document.getElementById('employer-profile-modal') && document.getElementById('employer-profile-modal').style.display === 'flex') {
                    closeEmployerProfile();
                }
            }
        }, {passive: true});
