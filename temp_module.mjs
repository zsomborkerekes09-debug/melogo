
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
            OAuthProvider,
            signInWithPopup,
            signInWithRedirect,
            getRedirectResult,
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

                        const userData = { bio: data.bio || '', skills: data.skills || [], photoURL: data.photoURL || '', reviews: data.reviews || [] };
                        localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                    }
                } catch(e) { console.error("Error fetching user doc", e); }
                
                localStorage.setItem('melogo_app_session', 'true');
                var screen = document.getElementById('app-login-screen');
                if (screen && !screen.classList.contains('hidden')) screen.classList.add('hidden');
                
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                
                let role = localStorage.getItem('melogo_active_role') || 'worker';
                if (typeof switchRole === 'function') switchRole(role);
        window.setupFirestoreListeners = function(role) {
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
        };

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

    