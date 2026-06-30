window.setupFirestoreListeners = function(role) {
            if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
                if (!window.isGuest) {
                    console.log('[DEBUG] setupFirestoreListeners skipped: user not logged in.');
                    return;
                }
            }
            const user = window.firebaseAuth && window.firebaseAuth.currentUser ? window.firebaseAuth.currentUser : null;
            const email = user ? user.email || '' : '';
            const uid = user ? user.uid || '' : '';

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
            if (typeof localWorkerApplications !== 'undefined') localWorkerApplications = [];
            if (typeof localEmployerJobs !== 'undefined') localEmployerJobs = [];
            if (typeof localChats !== 'undefined') localChats = [];
            if (typeof updateAllUserUI === 'function') updateAllUserUI();

            // 1. Jobs listener – uses docChanges() for correct delete handling
            if (window.workerJobsListeners) {
                window.workerJobsListeners.forEach(u => u());
            }
            window.workerJobsListeners = [];
            
            // Employer listener is single
            let jobsQuery = null;
            if (role === 'employer') {
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
                let dist = (fJob.lat && fJob.lon) ? haversineLocal(userCoords.lat, userCoords.lon, fJob.lat, fJob.lon) : null;
                return {
                    id: fJob.id,
                    title: fJob.title,
                    employer: fJob.ownerName || 'Megbízó',
                    ownerEmail: fJob.ownerEmail || '',
                    ownerUid: fJob.ownerUid || '',
                    price: parseInt(fJob.price) || 10000,
                    distance: dist,
                    lat: fJob.lat || 46.36,
                    lon: fJob.lon || 17.79,
                    category: fJob.category || 'Kert',
                    location: fJob.location || 'Kaposvár',
                    time: fJob.datetime ? fJob.datetime : new Date().toISOString().slice(0, 16),
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
            }

            function processJobChange(change, snapshot) {
                const fJob = { ...change.doc.data(), id: change.doc.id };
                if (change.type === 'added' || change.type === 'modified') {
                    if (!fJob.title) return;
                    if (role === 'worker' && fJob.status !== 'Keresés' && fJob.status !== 'accepted') return; // Filter locally for workers
                    
                    const normalized = normalizeFirestoreJob(fJob);
                    
                    // Asynchronously fetch real employer name to avoid displaying email prefixes or stale names
                    if (fJob.ownerUid && typeof fetchUserDetails === 'function') {
                        fetchUserDetails(fJob.ownerUid).then(userData => {
                            if (userData && userData.name && userData.name !== normalized.employer) {
                                const existingIdx = window.mockJobs.findIndex(m => m.id === fJob.id);
                                if (existingIdx !== -1) {
                                    window.mockJobs[existingIdx].employer = userData.name;
                                    if (typeof window.renderEmployerHome === 'function') window.renderEmployerHome();
                                    if (typeof window.refreshJobList === 'function') window.refreshJobList(true);
                                }
                            }
                        }).catch(e => console.warn('Could not fetch employer name for job', e));
                    }
                    
                    const existing = window.mockJobs.findIndex(m => m.id === fJob.id);
                    if (existing !== -1) {
                        window.mockJobs[existing] = normalized;
                    } else {
                        window.mockJobs.unshift(normalized);
                    }
                } else if (change.type === 'removed') {
                    window.mockJobs = window.mockJobs.filter(m => m.id !== fJob.id);
                }
                
                if (typeof window.updateMockJobsReference === 'function') {
                    window.updateMockJobsReference(window.mockJobs);
                }

                if (role === 'employer' && snapshot) {
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
            }

            if (role === 'worker') {
                // Skálázható Geohash alapú query a diákoknak
                const userCoords = window.userCoords || { lat: 47.4979, lon: 19.0402 };
                const radiusInM = (window.activeRadius || window.currentFilterRadius || 10) * 1000;
                
                let bounds = [];
                try {
                    if (window.geofireCommon) {
                        bounds = window.geofireCommon.geohashQueryBounds([userCoords.lat, userCoords.lon], radiusInM);
                    }
                } catch(e) { console.error('Geofire error', e); }

                window.mockJobs = []; // clear memory
                
                // Fallback query for jobs without geohash (older jobs) or if geofire failed
                const fallbackQuery = query(collection(db, "jobs"), where("status", "in", ["Keresés", "accepted"]), limit(50));
                const fallbackUnsub = onSnapshot(fallbackQuery, (snapshot) => {
                    snapshot.docChanges().forEach(change => processJobChange(change, null));
                }, err => console.error('[Firestore] Fallback listener error:', err));
                window.workerJobsListeners.push(fallbackUnsub);

                bounds.forEach((b) => {
                    const q = query(
                        collection(db, "jobs"), 
                        where("geohash", ">=", b[0]), 
                        where("geohash", "<=", b[1])
                    );
                    const unsub = onSnapshot(q, (snapshot) => {
                        snapshot.docChanges().forEach(change => processJobChange(change, null));
                    }, err => console.error('[Firestore] Geohash listener error:', err));
                    window.workerJobsListeners.push(unsub);
                });
            } else if (jobsQuery) {
                // Sima query a munkáltatónak
                const unsub = onSnapshot(jobsQuery, (snapshot) => {
                    snapshot.docChanges().forEach(change => processJobChange(change, snapshot));
                }, err => console.error('[Firestore] Employer jobs listener error:', err));
                window.workerJobsListeners.push(unsub);
            }

            // 2. Applications listener
            let appsQuery = query(
                collection(db, "applications"),
                where(role === 'worker' ? "workerUid" : "employerUid", "==", uid),
                limit(100)
            );
            window.appsUnsubscribe = onSnapshot(appsQuery, (snapshot) => {
                let apps = [];
                snapshot.forEach(d => { const a = d.data(); a.id = d.id; apps.push(a); });
                localWorkerApplications = apps.sort((a,b) => b.createdAt - a.createdAt);
                localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications));
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                if (typeof renderWorkerApplications === 'function') renderWorkerApplications();
                if (role === 'worker') {
                    syncWorkerProfileStatsToFirestore(uid, apps);
                }
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
                    const idx = localChats.findIndex(c => 
                        c.id === nc.id || 
                        (!c.isFirestore && String(c.jobId) === String(nc.jobId) && c.workerEmail === nc.workerEmail)
                    );
                    if (idx !== -1) {
                        const oldId = localChats[idx].id;
                        localChats[idx] = nc;
                        if (window.selectedChatId === oldId) {
                            window.selectedChatId = nc.id;
                        }
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
            const chatsQuery1 = query(
                collection(db, "chats"),
                where("workerId", "==", uid),
                limit(100)
            );
            window.chatsUnsubscribe = onSnapshot(chatsQuery1, (snapshot) => {
                let chats = [];
                snapshot.forEach(d => { const c = d.data(); c.id = d.id; chats.push(c); });
                mergeFirestoreChats(chats, 'worker');
            }, err => console.error('[Firestore] Worker chats listener error:', err));

            // Employer-side chats (where current user is the employer)
            const chatsQuery2 = query(
                collection(db, "chats"),
                where("employerId", "==", uid),
                limit(100)
            );
            window.chatsUnsubscribe2 = onSnapshot(chatsQuery2, (snapshot) => {
                let chats = [];
                snapshot.forEach(d => { const c = d.data(); c.id = d.id; chats.push(c); });
                mergeFirestoreChats(chats, 'employer');
            }, err => console.error('[Firestore] Employer chats listener error:', err));
        };
        // --- Forgot Password Modal ---
        function showForgotPasswordModal() {
            document.getElementById('forgot-pw-modal').style.display = 'flex';
        }
        async function loginWithApple() {
            if (!window.firebaseAuth || !window.firebaseAPI || !window.firebaseAPI.signInWithPopup) {
                alert("Apple bejelentkezés jelenleg nem elérhető.");
                return;
            }
            if (!isLoginMode && !termsAccepted) {
                const termsBox = document.getElementById('terms-checkbox');
                if (termsBox) {
                    termsBox.style.borderColor = '#EF4444';
                }
                showLoginError('Regisztráció előtt el kell fogadnod az ÁSZF-et!');
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
            setTimeout(() => {
                document.getElementById('forgot-pw-form').style.display = 'flex';
                document.getElementById('forgot-pw-success').style.display = 'none';
                document.getElementById('forgot-pw-email').value = '';
            }, 300);
        }
        async function submitForgotPassword() {
            const email = document.getElementById('forgot-pw-email').value;
            if (!email || !email.includes('@')) {
                alert('Kérlek adj meg egy érvényes email címet!');
                return;
            }
            
            const btn = document.getElementById('forgot-pw-submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span style="opacity:0.7">Küldés...</span>';
            btn.disabled = true;

            try {
                if (window.firebaseAuth && window.firebaseAPI) {
                    await window.firebaseAPI.sendPasswordResetEmail(window.firebaseAuth, email);
                }
                
                // Show success state
                document.getElementById('forgot-pw-form').style.display = 'none';
                document.getElementById('forgot-pw-success').style.display = 'flex';
                
            } catch (error) {
                console.error("Forgot password error:", error);
                alert('Hiba történt: ' + error.message);
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
        
        function showConfirmModal(title, text, confirmText, onConfirm) {
            const modal = document.getElementById('melogo-confirm-modal');
            document.getElementById('melogo-confirm-title').innerText = title;
            document.getElementById('melogo-confirm-text').innerText = text;
            document.getElementById('melogo-confirm-ok').innerText = confirmText;
            
            document.getElementById('melogo-confirm-cancel').onclick = function() {
                modal.style.display = 'none';
            };
            document.getElementById('melogo-confirm-ok').onclick = function() {
                modal.style.display = 'none';
                if (onConfirm) onConfirm();
            };
            modal.style.display = 'flex';
        }
        
        function showSuccessModal(title, text) {
            document.getElementById('melogo-success-title').innerText = title;
            document.getElementById('melogo-success-text').innerText = text;
            const modal = document.getElementById('melogo-success-modal');
            modal.style.display = 'flex';
        }

                window.showForgotPasswordModal = showForgotPasswordModal;
        window.loginWithApple = loginWithApple;
        window.closeForgotPasswordModal = closeForgotPasswordModal;
        window.submitForgotPassword = submitForgotPassword;
        window.showConfirmModal = showConfirmModal;
        window.showSuccessModal = showSuccessModal;

        // ===================================================================
        // ADMINISTRATOR, CONSENT LOGGING, AND GEOCODING HELPERS
        // ===================================================================
        function isAdministrator(email) {
            if (!email) return false;
            const admins = ['info@melo-go.com', 'zsomborkerekes09@gmail.com', 'admin@melogo.hu', 'melo-go-admin@melogo.hu'];
            return admins.includes(email.toLowerCase());
        }

        async function logConsentAndAuth(uid, email, actionType) {
            let clientIp = 'Unknown';
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                if (data && data.ip) {
                    clientIp = data.ip;
                }
            } catch (e) {
                console.warn('[ConsentLog] Failed to fetch client IP:', e);
            }

            try {
                const logRef = doc(collection(db, 'auth_consent_logs'));
                await setDoc(logRef, {
                    uid: uid,
                    email: email,
                    action: actionType, // 'registration' or 'login'
                    ipAddress: clientIp,
                    userAgent: navigator.userAgent,
                    timestamp: serverTimestamp(),
                    termsVersion: '1.1',
                    gdprAccepted: true,
                    termsAccepted: true
                });
                console.log(`[ConsentLog] Logged ${actionType} for ${email} from ${clientIp}`);
            } catch (err) {
                console.error('[ConsentLog] Error logging auth/consent:', err);
            }
        }

        async function geocodeAndCenterMap(address) {
            if (!address) return;
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'MeloGo-App/1.1 (info@melo-go.com)'
                    }
                });
                const data = await response.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    
                    window.userCoords = { lat: lat, lon: lon };
                    userCoords = window.userCoords;
                    
                    if (window.leafletMap) {
                        window.leafletMap.setView([lat, lon], 12);
                    }
                    console.log(`[Geocode] Centered map on user address: ${address} (${lat}, ${lon})`);
                }
            } catch (err) {
                console.warn("[Geocode] Geocoding user address failed:", err);
            }
        }

        async function downloadConsentLogsCSV() {
            if (!window.firebaseAPI || !window.firebaseDb) {
                alert("Hiba: Firebase nem érhető el.");
                return;
            }
            try {
                const q = query(
                    collection(db, "auth_consent_logs"),
                    orderBy("timestamp", "desc")
                );
                
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    alert("Nincsenek elérhető jogi naplók a rendszerben.");
                    return;
                }

                let csvLines = ["ID,Email,UID,Action,IP Address,User Agent,Timestamp,Terms Version,GDPR Accepted,Terms Accepted"];

                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    const email = data.email || '';
                    const uid = data.uid || '';
                    const action = data.action || '';
                    const ipAddress = data.ipAddress || '';
                    
                    let userAgent = data.userAgent || '';
                    userAgent = userAgent.replace(/"/g, '""');
                    
                    let timestampStr = '';
                    if (data.timestamp) {
                        const dateObj = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
                        timestampStr = dateObj.toISOString();
                    }
                    
                    const termsVersion = data.termsVersion || '1.1';
                    const gdprAccepted = data.gdprAccepted !== undefined ? data.gdprAccepted : true;
                    const termsAccepted = data.termsAccepted !== undefined ? data.termsAccepted : true;

                    const row = `"${id}","${email}","${uid}","${action}","${ipAddress}","${userAgent}","${timestampStr}","${termsVersion}",${gdprAccepted},${termsAccepted}`;
                    csvLines.push(row);
                });

                const csvString = csvLines.join("\r\n");
                const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `melo-go_auth_consent_logs_${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Error downloading consent logs:", err);
                alert("Hiba történt a jogi naplók lekérése közben: " + err.message);
            }
        }

        