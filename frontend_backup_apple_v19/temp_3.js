
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
        
        // System-wide Firestore error wrapper added by Full System Sweep
        const wrapFb = (fn, name) => async (...args) => {
            try { return await fn(...args); } 
            catch (e) {
                console.error('[Firestore] ' + name + ' hiba:', e);
                if (typeof showRedBanner === 'function') showRedBanner('Hálózati hiba: ' + name + ' sikertelen.');
                throw e;
            }
        };
        window.firebaseAPI.addDoc = wrapFb(addDoc, 'addDoc');
        window.firebaseAPI.setDoc = wrapFb(setDoc, 'setDoc');
        window.firebaseAPI.updateDoc = wrapFb(updateDoc, 'updateDoc');
        window.firebaseAPI.deleteDoc = wrapFb(deleteDoc, 'deleteDoc');
        window.firebaseAPI.getDocs = wrapFb(getDocs, 'getDocs');
        window.firebaseAPI.getDoc = wrapFb(getDoc, 'getDoc');
        
        console.log("Firebase initialized successfully");
        
        // Handle redirect login
        // Listen for authentication state changes
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Firebase User is logged in:", user.email);
                let role = 'worker'; // Default to worker, removed pending role logic
                let userName = user.displayName || '';
                let name = userName;
                let address = '';
                let phone = '';
                
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
                            address: '',
                            phone: '',
                            termsAccepted: true,
                            gdprAccepted: true
                        };
                        await setDoc(userRef, newUserData);
                        localStorage.setItem('melogo_user_data', JSON.stringify({ bio: '', skills: [], photoURL: user.photoURL || '', reviews: [], address: '', phone: '' }));
                    } else {
                        // Update existing user
                        await updateDoc(userRef, { lastLogin: serverTimestamp(), photoURL: user.photoURL || userDoc.data().photoURL || '' });
                        const data = userDoc.data();
                        if (data.name) {
                            userName = data.name;
                            name = data.name;
                        } else {
                            name = '';
                        }
                        role = data.defaultRole || data.role || 'worker';
                        address = data.address || '';
                        phone = data.phone || '';
                        
                        const userData = { bio: data.bio || '', skills: data.skills || [], photoURL: data.photoURL || '', reviews: data.reviews || [], address: address, phone: phone };
                        localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                    }
                    localStorage.removeItem('melogo_pending_role');

                    localStorage.setItem('melogo_name', userName || 'Felhasználó');
                    localStorage.setItem('melogo_active_role', role);

                    // Sync sessions
                    const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
                    workerSession.name = userName || 'Felhasználó';
                    workerSession.email = user.email;
                    localStorage.setItem('melogo_worker_session', JSON.stringify(workerSession));
                    
                    const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
                    employerSession.name = userName || 'Felhasználó';
                    employerSession.email = user.email;
                    localStorage.setItem('melogo_employer_session', JSON.stringify(employerSession));

                } catch(e) { console.error("Error fetching/creating user doc", e); }
                
                // ROUTING: Check if registration steps are completed
                if (!name) {
                    if (typeof window.updateRegistrationStepUI === 'function') {
                        window.updateRegistrationStepUI(1);
                    }
                    return;
                }
                if (!phone) {
                    if (typeof window.updateRegistrationStepUI === 'function') {
                        window.updateRegistrationStepUI(2);
                    }
                    return;
                }
                if (!address) {
                    if (typeof window.updateRegistrationStepUI === 'function') {
                        window.updateRegistrationStepUI(3);
                    }
                    return;
                }
                
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
            } else {
                // Not logged in, ensure step 0 (email/password) is shown
                if (typeof window.updateRegistrationStepUI === 'function') {
                    window.updateRegistrationStepUI(0);
                }
            }
        });

        // Registration Step UI Updater
        window.updateRegistrationStepUI = function(step) {
            console.log('[AuthStep] Switching UI to step:', step);
            
            const rf = document.getElementById('register-fields');
            const lf = document.getElementById('login-fields');
            const btn = document.getElementById('main-auth-btn');
            const googleBtn = document.getElementById('google-login-btn');
            const appleBtn = document.getElementById('apple-login-btn');
            const sw = document.getElementById('auth-switch-text');
            const roleSel = document.getElementById('login-role-selector');
            const sub = document.getElementById('login-mode-subtitle');
            const divider = googleBtn ? googleBtn.previousElementSibling : null;
            
            const step1Div = document.getElementById('auth-step-1');
            const step2Div = document.getElementById('auth-step-2');
            const step3Div = document.getElementById('auth-step-3');
            
            if (step1Div) step1Div.style.display = 'none';
            if (step2Div) step2Div.style.display = 'none';
            if (step3Div) step3Div.style.display = 'none';
            
            if (step === 0) {
                if (sub) sub.style.display = 'block';
                if (isLoginMode) {
                    if (rf) rf.style.display = 'none';
                    if (lf) lf.style.display = 'flex';
                    if (roleSel) roleSel.style.display = 'none';
                    if (btn) { btn.style.display = 'block'; btn.innerText = 'Bejelentkezem'; }
                    if (sw) { sw.style.display = 'block'; sw.innerHTML = 'Nincs még fiókod? <span style="color:var(--color-text); font-weight: 400; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Regisztrálj</span>'; }
                } else {
                    if (rf) rf.style.display = 'flex';
                    if (lf) lf.style.display = 'none';
                    if (roleSel) roleSel.style.display = 'none'; // Role selector removed!
                    if (btn) { btn.style.display = 'block'; btn.innerText = 'Regisztrálok & Bejelentkezem'; }
                    if (sw) { sw.style.display = 'block'; sw.innerHTML = 'Van már fiókod? <span style="color:var(--color-text); font-weight: 400; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Jelentkezz be</span>'; }
                }
                if (googleBtn) googleBtn.style.display = 'flex';
                if (appleBtn) appleBtn.style.display = 'flex';
                if (divider) divider.style.display = 'flex';
                
            } else {
                if (rf) rf.style.display = 'none';
                if (lf) lf.style.display = 'none';
                if (btn) btn.style.display = 'none';
                if (googleBtn) googleBtn.style.display = 'none';
                if (appleBtn) appleBtn.style.display = 'none';
                if (sw) sw.style.display = 'none';
                if (roleSel) roleSel.style.display = 'none';
                if (sub) sub.style.display = 'none';
                if (divider) divider.style.display = 'none';
                
                if (step === 1 && step1Div) step1Div.style.display = 'flex';
                if (step === 2 && step2Div) step2Div.style.display = 'flex';
                if (step === 3 && step3Div) {
                    step3Div.style.display = 'flex';
                    if (typeof window.initGooglePlacesAutocomplete === 'function') {
                        window.initGooglePlacesAutocomplete();
                    }
                }
            }
            
            const screen = document.getElementById('app-login-screen');
            if (screen) screen.classList.remove('hidden');
        };

        let selectedAddress = null;
        let googleAutocomplete = null;
        
        window.initGooglePlacesAutocomplete = function() {
            const input = document.getElementById('reg-address-autocomplete');
            if (!input) return;
            if (googleAutocomplete) return;
            
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                console.warn("Google Maps Places API not ready. Retrying in 500ms...");
                setTimeout(window.initGooglePlacesAutocomplete, 500);
                return;
            }
            
            googleAutocomplete = new window.google.maps.places.Autocomplete(input, {
                componentRestrictions: { country: 'hu' },
                fields: ['address_components', 'formatted_address', 'geometry']
            });
            
            googleAutocomplete.addListener('place_changed', () => {
                const place = googleAutocomplete.getPlace();
                if (place && place.address_components) {
                    let zip = '';
                    let city = '';
                    let street = '';
                    let house = '';
                    let county = '';
                    
                    place.address_components.forEach(comp => {
                        const types = comp.types || [];
                        if (types.includes('postal_code')) {
                            zip = comp.long_name;
                        } else if (types.includes('locality')) {
                            city = comp.long_name;
                        } else if (types.includes('route')) {
                            street = comp.long_name;
                        } else if (types.includes('street_number')) {
                            house = comp.long_name;
                        } else if (types.includes('administrative_area_level_1')) {
                            county = comp.long_name;
                        }
                    });
                    
                    // Populate fields
                    const zipEl = document.getElementById('reg-address-zip');
                    const cityEl = document.getElementById('reg-address-city');
                    const streetEl = document.getElementById('reg-address-street');
                    const houseEl = document.getElementById('reg-address-house');
                    const countyEl = document.getElementById('reg-address-county');
                    
                    if (zipEl && zip) zipEl.value = zip;
                    if (cityEl && city) cityEl.value = city;
                    if (streetEl && street) streetEl.value = street;
                    if (houseEl && house) houseEl.value = house;
                    if (countyEl && county) countyEl.value = county;
                    
                    selectedAddress = place.formatted_address;
                    console.log("Selected address from autocomplete:", selectedAddress);
                } else {
                    selectedAddress = null;
                }
            });
        };

        window.submitStep1Name = async function() {
            const nameInput = document.getElementById('app-name');
            const nameVal = nameInput ? nameInput.value.trim() : '';
            
            if (!nameVal) {
                alert("Kérlek add meg a teljes neved!");
                return;
            }
            
            const user = window.firebaseAuth?.currentUser;
            if (!user) {
                alert("Nincs bejelentkezett felhasználó.");
                return;
            }
            
            const btn = document.getElementById('btn-step-1-next');
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Mentés...';
            }
            
            try {
                const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", user.uid);
                await window.firebaseAPI.setDoc(userRef, {
                    name: nameVal
                }, { merge: true });
                
                localStorage.setItem('melogo_name', nameVal);
                
                // Sync sessions
                const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
                workerSession.name = nameVal;
                localStorage.setItem('melogo_worker_session', JSON.stringify(workerSession));
                
                const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || '{}');
                employerSession.name = nameVal;
                localStorage.setItem('melogo_employer_session', JSON.stringify(employerSession));

                // Check next steps
                const userDoc = await window.firebaseAPI.getDoc(userRef);
                const data = userDoc.exists() ? userDoc.data() : {};
                if (!data.phone) {
                    window.updateRegistrationStepUI(2);
                } else if (!data.address) {
                    window.updateRegistrationStepUI(3);
                } else {
                    window.enterAppFromAuth();
                }
            } catch (e) {
                console.error("Step 1 error:", e);
                alert("Hiba történt a név mentése során.");
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = 'Tovább';
                }
            }
        };

        window.validateHungarianPhone = function(phoneStr) {
            let cleaned = phoneStr.replace(/[\s\-\(\)]/g, '');
            if (cleaned.startsWith('06') && cleaned.length === 11) {
                cleaned = '+36' + cleaned.substring(2);
            }
            const huPhoneRegex = /^\+36\d{9}$/;
            return huPhoneRegex.test(cleaned);
        };

        window.submitStep2Phone = async function() {
            const phoneInput = document.getElementById('reg-phone-input');
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            let cleanedPhone = phoneVal.replace(/[\s\-\(\)]/g, '');
            if (cleanedPhone.startsWith('06') && cleanedPhone.length === 11) {
                cleanedPhone = '+36' + cleanedPhone.substring(2);
            }
            
            if (!window.validateHungarianPhone(phoneVal)) {
                alert("Kérjük, érvényes magyar telefonszámot adj meg (pl. +36201234567 vagy 06201234567)!");
                return;
            }
            
            const user = window.firebaseAuth?.currentUser;
            if (!user) {
                alert("Nincs bejelentkezett felhasználó.");
                return;
            }
            
            const btn = document.getElementById('btn-step-2-next');
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Mentés...';
            }
            
            try {
                const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", user.uid);
                await window.firebaseAPI.setDoc(userRef, {
                    phone: cleanedPhone
                }, { merge: true });
                
                const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
                userData.phone = cleanedPhone;
                localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                
                const userDoc = await window.firebaseAPI.getDoc(userRef);
                const address = userDoc.exists() ? userDoc.data().address : '';
                if (!address) {
                    window.updateRegistrationStepUI(3);
                } else {
                    window.enterAppFromAuth();
                }
            } catch (e) {
                console.error("Step 2 error:", e);
                alert("Hiba történt a telefonszám mentése során.");
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = 'Tovább';
                }
            }
        };

        window.submitStep3Address = async function() {
            const zip = document.getElementById('reg-address-zip').value.trim();
            const city = document.getElementById('reg-address-city').value.trim();
            const street = document.getElementById('reg-address-street').value.trim();
            const house = document.getElementById('reg-address-house').value.trim();
            const county = document.getElementById('reg-address-county').value.trim();
            
            if (!zip || !city || !street) {
                alert("Kérlek, töltsd ki legalább az irányítószámot, várost és az utcát!");
                return;
            }
            
            // Build full address string
            let fullAddress = `${zip} ${city}, ${street}`;
            if (house) {
                fullAddress += ` ${house}`;
            }
            if (county) {
                fullAddress += `, ${county}`;
            }
            
            const user = window.firebaseAuth?.currentUser;
            if (!user) {
                alert("Nincs bejelentkezett felhasználó.");
                return;
            }
            
            const btn = document.getElementById('btn-step-3-next');
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Mentés...';
            }
            
            try {
                const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", user.uid);
                await window.firebaseAPI.setDoc(userRef, {
                    address: fullAddress
                }, { merge: true });
                
                const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
                userData.address = fullAddress;
                localStorage.setItem('melogo_user_data', JSON.stringify(userData));
                
                window.enterAppFromAuth();
            } catch (e) {
                console.error("Step 3 error:", e);
                alert("Hiba történt a cím mentése során.");
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = 'Tovább';
                }
            }
        };

        window.enterAppFromAuth = function() {
            localStorage.setItem('melogo_app_session', 'true');
            const screen = document.getElementById('app-login-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.35s ease';
                screen.style.opacity = '0';
                setTimeout(() => {
                    screen.classList.add('hidden');
                    screen.style.opacity = '';
                    
                    const activeRole = localStorage.getItem('melogo_active_role') || 'worker';
                    if (typeof updateAllUserUI === 'function') updateAllUserUI();
                    if (typeof updateGreetings === 'function') updateGreetings();
                    if (typeof switchRole === 'function') switchRole(activeRole);
                }, 350);
            }
        };

        async function syncWorkerProfileStatsToFirestore(uid, apps) {
            if (!window.firebaseAPI || !window.firebaseDb || !uid) return;
            try {
                const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", uid);
                const userSnap = await window.firebaseAPI.getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const completedApps = apps.filter(a => a.status === 'Befejezett' || a.status === 'Kifizetve' || a.status === 'Értékelve');
                    
                    if (!userData.reviews) userData.reviews = [];
                    
                    let reviewsChanged = false;
                    
                    completedApps.forEach(app => {
                        const hasReview = userData.reviews.some(r => r.job === app.title && r.date === app.date);
                        if (!hasReview) {
                            const stars = app.rating || 5;
                            userData.reviews.unshift({
                                name: app.employerName || 'Megbízó',
                                initials: app.employerName ? getInitials(app.employerName) : 'M',
                                stars: stars,
                                date: app.date || new Date().toLocaleDateString('hu-HU'),
                                text: 'Kiváló és megbízható munka! Köszönöm.',
                                job: app.title
                            });
                            reviewsChanged = true;
                        }
                    });
                    
                    const dynamicJobCount = completedApps.length;
                    let dynamicRating = 5.0;
                    if (userData.reviews.length > 0) {
                        const sum = userData.reviews.reduce((a, b) => a + b.stars, 0);
                        dynamicRating = sum / userData.reviews.length;
                    }
                    
                    const currentJobCount = userData.jobCount !== undefined ? userData.jobCount : -1;
                    const currentRating = userData.rating !== undefined ? userData.rating : -1;
                    const currentReviewCount = userData.reviewCount !== undefined ? userData.reviewCount : -1;
                    
                    if (reviewsChanged || dynamicJobCount !== currentJobCount || dynamicRating !== currentRating || userData.reviews.length !== currentReviewCount) {
                        await window.firebaseAPI.updateDoc(userRef, {
                            reviews: userData.reviews,
                            rating: dynamicRating,
                            reviewCount: userData.reviews.length,
                            jobCount: dynamicJobCount
                        });
                        console.log("[Sync] Worker profile stats synced to Firestore for UID:", uid);
                    }
                }
            } catch (e) {
                console.error("Error syncing worker profile stats to Firestore:", e);
            }
        }

        window.setupFirestoreListeners = function(role) {
            if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
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
            if (typeof localWorkerApplications !== 'undefined') localWorkerApplications = [];
            if (typeof localEmployerJobs !== 'undefined') localEmployerJobs = [];
            if (typeof localChats !== 'undefined') localChats = [];
            if (typeof updateAllUserUI === 'function') updateAllUserUI();

            // 1. Jobs listener – uses docChanges() for correct delete handling
            let jobsQuery;
            if (role === 'worker') {
                jobsQuery = query(collection(db, "jobs"), where("status", "in", ["Keresés", "accepted"]), orderBy("createdAt", "desc"), limit(100));
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
        
