
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, collection, addDoc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, doc, query, where, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
        
        console.log("Firebase initialized successfully");
        
        // Listen for authentication state changes
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Firebase User is logged in:", user.email);
                // Fetch profile
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        localStorage.setItem('melogo_name', data.name || 'Felhasználó');
                        if (data.defaultRole) {
                            localStorage.setItem('melogo_active_role', data.defaultRole);
                        }
                        
                        // Sync names into worker and employer sessions if they are missing
                        const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
                        workerSession.name = data.name || workerSession.name || 'Felhasználó';
                        workerSession.email = user.email;
                        localStorage.setItem('melogo_worker_session', JSON.stringify(workerSession));
                        
                        const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
                        employerSession.name = data.name || employerSession.name || 'Felhasználó';
                        employerSession.email = user.email;
                        localStorage.setItem('melogo_employer_session', JSON.stringify(employerSession));

                        // Store in user_data as well - completely overwrite from Firestore to prevent stale local cache inheritance!
                        const userData = {};
                        userData.bio = data.bio || '';
                        userData.skills = data.skills || [];
                        userData.photoURL = data.photoURL || '';
                        userData.reviews = data.reviews || [];
                        localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                    }
                } catch(e) { console.error("Error fetching user doc", e); }
                
                // Set legacy session flags so the rest of the app knows we're logged in
                localStorage.setItem('melogo_app_session', 'true');
                
                // Hide login screen if it's visible
                var screen = document.getElementById('app-login-screen');
                if (screen && !screen.classList.contains('hidden')) {
                    screen.classList.add('hidden');
                }
                
                // ALWAYS refresh UI with the correct fetched name/details on load or login
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                
                let role = localStorage.getItem('melogo_active_role') || 'worker';
                if (typeof switchRole === 'function') switchRole(role);
                
                // Setup Firestore listeners
                if (!window.jobsUnsubscribe) {
                    window.jobsUnsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
                        let allJobs = [];
                        snapshot.forEach(d => {
                            let jobData = d.data();
                            jobData.id = d.id; // use Firestore document ID as the canonical ID
                            allJobs.push(jobData);
                        });
                        console.log('[Firestore] Jobs snapshot received:', allJobs.length, 'jobs');
                        
                        // === INLINE MERGE: cannot call mergeFirestoreJobsIntoMock from module scope ===
                        // Ensure window.mockJobs exists (defined in the regular script below)
                        if (!window.mockJobs) window.mockJobs = [];
                        
                        const userCoords = window.userCoords || { lat: 46.3593, lon: 17.7967 };
                        
                        function haversine(lat1, lon1, lat2, lon2) {
                            const R = 6371;
                            const dLat = (lat2 - lat1) * Math.PI / 180;
                            const dLon = (lon2 - lon1) * Math.PI / 180;
                            const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
                            return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
                        }
                        
                        allJobs.forEach(fJob => {
                            if (!fJob.id || !fJob.title) return;
                            
                            let dist = null;
                            if (fJob.lat && fJob.lon) {
                                dist = haversine(userCoords.lat, userCoords.lon, fJob.lat, fJob.lon);
                            } else {
                                // No coordinates: assign small random so the job shows up
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
                                timeOffset: 0,
                                desc: fJob.details || fJob.desc || '',
                                toolsRequired: fJob.toolsRequired || 'employer',
                                isFirestore: true
                            };
                            
                            const existing = window.mockJobs.findIndex(m => m.id === fJob.id);
                            if (existing !== -1) {
                                window.mockJobs[existing] = normalized;
                            } else {
                                window.mockJobs.unshift(normalized);
                            }
                            console.log('[Firestore] Job merged:', normalized.title, '| dist:', normalized.distance, '| owner:', normalized.employer);
                        });
                        // ============================================================================
                        
                        // Update employer's own job list (only their jobs)
                        const myEmail = auth.currentUser ? auth.currentUser.email : null;
                        const myJobs = myEmail ? allJobs.filter(j => j.ownerEmail === myEmail) : [];
                        if (myJobs.length > 0) {
                            window.localEmployerJobs = myJobs.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
                            localStorage.setItem('melogo_employer_jobs', JSON.stringify(window.localEmployerJobs));
                        }
                        
                        // Refresh UI (functions live in regular script, accessible via window)
                        if (typeof window.renderEmployerHome === 'function') window.renderEmployerHome();
                        if (typeof window.refreshJobList === 'function') window.refreshJobList();
                        if (typeof window.renderMapPins === 'function') window.renderMapPins();
                    });
                }
                
                if (!window.appsUnsubscribe) {
                    window.appsUnsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
                        const currentUserEmail = auth.currentUser ? auth.currentUser.email : '';
                        let apps = [];
                        snapshot.forEach(d => {
                            const app = d.data();
                            if (app.workerEmail === currentUserEmail || app.employerEmail === currentUserEmail) {
                                apps.push(app);
                            }
                        });
                        localWorkerApplications = apps.sort((a,b) => b.createdAt - a.createdAt);
                        localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications));
                        
                        // Force redraw profile ratings, reviews, greetings, and name headers with fresh data
                        if (typeof updateAllUserUI === 'function') updateAllUserUI();
                        if (typeof updateGreetings === 'function') updateGreetings();
                        if (typeof renderWorkerApplications === 'function') renderWorkerApplications();
                    });
                }
                
                if (!window.chatsUnsubscribe) {
                    window.chatsUnsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
                        const currentUserEmail = auth.currentUser ? auth.currentUser.email : '';
                        let chats = [];
                        snapshot.forEach(d => {
                            const chat = d.data();
                            if (chat.workerEmail === currentUserEmail || chat.employerEmail === currentUserEmail) {
                                chats.push(chat);
                            }
                        });
                        localChats = chats.sort((a,b) => b.createdAt - a.createdAt);
                        localStorage.setItem('melogo_chats', JSON.stringify(localChats));
                        if (typeof renderChatList === 'function') renderChatList();
                        
                        // Real-time active chat room refresh
                        if (window.selectedChatId) {
                            const activeChat = localChats.find(c => c.id === window.selectedChatId);
                            if (activeChat && typeof openChat === 'function') {
                                openChat(activeChat.name, activeChat.jobTitle, activeChat.lastMsg, activeChat.time, false, activeChat.id);
                            }
                        }
                    });
                }
                
            } else {
                console.log("Firebase User is logged out");
                localStorage.removeItem('melogo_app_session');
                var screen = document.getElementById('app-login-screen');
                if (screen) {
                    screen.classList.remove('hidden');
                    screen.style.opacity = '1';
                }
                if (window.jobsUnsubscribe) { window.jobsUnsubscribe(); window.jobsUnsubscribe = null; }
                if (window.appsUnsubscribe) { window.appsUnsubscribe(); window.appsUnsubscribe = null; }
                if (window.chatsUnsubscribe) { window.chatsUnsubscribe(); window.chatsUnsubscribe = null; }
            }
        });

        // Global Helper for cloud sync
        window.saveToCloud = async function(collectionName, arrayData) {
            if (!auth.currentUser) return;
            try {
                for (let item of arrayData) {
                    if (!item.id) item.id = collectionName + '_' + Date.now() + Math.random().toString(36).substr(2, 5);
                    if (!item.createdAt) item.createdAt = Date.now();
                    await setDoc(doc(db, collectionName, item.id), item);
                }
            } catch(e) { console.error("Cloud sync error for " + collectionName, e); }
        }

    