
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
                { name: 'Levelek gereblyézése, összeszedése', price: 6000 },
                { name: 'Sövény nyírása, vágása', price: 10000 },
                { name: 'Virágágyás gondozása, ültetés', price: 7000 },
                { name: 'Terasz, járda söprése, takarítása', price: 4000 },
                { name: 'Hólapátolás télen', price: 5000 },
                { name: 'Kerti bútor összerakása, mozgatása', price: 7000 }
            ],
            Festés: [
                { name: 'Kerítés festése', price: 25000 },
                { name: 'Kapu, pad, kerti bútor festése', price: 15000 },
                { name: 'Falak festése (sima, egy szín)', price: 35000 },
                { name: 'Feliratok, foltok lefestése', price: 6000 }
            ],
            Autó: [
                { name: 'Autómosás (kézi, kültéren)', price: 6000 },
                { name: 'Autó belsőjének porszívózása, takarítása', price: 5000 }
            ],
            Ház: [
                { name: 'Ablakok tisztítása', price: 8000 },
                { name: 'Takarítás, porszívózás, felmosás', price: 12000 },
                { name: 'Lomtalanítás segítése, nehéz dolgok cipelése', price: 15000 },
                { name: 'Bútorok összeszereléSe (IKEA jellegű)', price: 10000 },
                { name: 'Bevásárlás, csomagok hordása', price: 5000 },
                { name: 'Kutya sétáltatása, állat gondozása', price: 3000 }
            ],
            Asztalos: [
                { name: 'Bútor összeszereléSe (segítség)', price: 9000 },
                { name: 'IKEA PAX, Billy szekrény összeszereléSe', price: 12000 },
                { name: 'Kerti bútor, pad összerakása', price: 8000 },
                { name: 'Faipari segédmunka, anyagcipelés', price: 7000 }
            ],
            Kőműves: [
                { name: 'Anyagcipelés, tégla/súlyos anyag hordása', price: 10000 },
                { name: 'Cementkeverés, beton előkészítés', price: 12000 },
                { name: 'Helyszín takarítás, törmelék eltakarítása', price: 8000 },
                { name: 'Alapozó segítség, alapozó festés', price: 9000 }
            ],
            Költöztetés: [
                { name: 'Bútor, nehéz dolgok cipelése', price: 15000 },
                { name: 'Dobozok pakolása, csomagolás', price: 8000 },
                { name: 'Furgon/kisteherautó rakodás, kirakodás', price: 18000 },
                { name: 'Lépcsőn cipelés, emelési segítség', price: 12000 }
            ],
            Takarítás: [
                { name: 'Mély takarítás (lakás)', price: 20000 },
                { name: 'Iroda/üzlethelyiség takarítás', price: 18000 },
                { name: 'Építés utáni takarítás', price: 25000 },
                { name: 'Fürdőszoba és konyha mély tisztítás', price: 12000 }
            ],
            Rendezvény: [
                { name: 'Rendezvény felállítás, bútorok mozgatása', price: 14000 },
                { name: 'Kiszolgálás, tálalás (büffé/buli)', price: 10000 },
                { name: 'Rendezvény utáni lerendezés, takarítás', price: 12000 },
                { name: 'Beléptetés, ügyfélfogadás, irányítás', price: 9000 }
            ],
            Mező: [
                { name: 'Gyümölcsszedés, szőlőszüret', price: 10000 },
                { name: 'Aratás, bogyószüret, betakarítás', price: 11000 },
                { name: 'Mezői segédmunka (gyümölcsös, kertészet)', price: 9000 },
                { name: 'Zöldség szedés, válogatás, csomagolás', price: 8000 }
            ]
        };


        
        function openChat(name) {
            document.getElementById('chat-detail-name').innerText = name;
            document.getElementById('chat-detail-overlay').classList.add('open');
        }

        function sendChatMessage() {
            const input = document.getElementById('chat-reply-input');
            const text = input.value.trim();
            if (!text) return;
            
            const msgBox = document.createElement('div');
            msgBox.style.cssText = "background: var(--color-green-go); padding: 12px 16px; border-radius: 16px; border-bottom-right-radius: 4px; align-self: flex-end; max-width: 80%; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-size: 14px; color: white;";
            msgBox.innerText = text;
            
            const container = document.getElementById('chat-detail-messages').querySelector('div:last-child');
            container.appendChild(msgBox);
            input.value = '';
            
            const chatBody = document.getElementById('chat-detail-messages');
            chatBody.scrollTop = chatBody.scrollHeight;
        }

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

        
        function getAvatarGradient(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            const c1 = Math.abs((hash * 123) % 360);
            const c2 = Math.abs((hash * 321) % 360);
            return `hsl(${c1}, 70%, 45%)`;
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
            document.getElementById('worker-job-filter-display').innerText = initialCatLabel;
            // filterWorkerJobs is now handled by refreshJobList() in the new engine

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
                    setTimeout(()=>el.style.color='#9CA3AF', 500);
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
                    errSlot.style.cssText = 'color:#EF4444;font-size:11px;margin-top:4px;font-weight:500;text-align:left;padding-left:4px;';
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

        function selectLoginRole(role) {
            loginSelectedRole = role;
            const pWorker = document.getElementById('role-pill-worker');
            const pEmployer = document.getElementById('role-pill-employer');
            if (!pWorker || !pEmployer) return;
            
            if (role === 'worker') {
                pWorker.classList.add('active');
                pEmployer.classList.remove('active');
            } else {
                pEmployer.classList.add('active');
                pWorker.classList.remove('active');
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
            
            if (rf) rf.style.display = 'none';
            if (lf) lf.style.display = 'flex';
            if (sub) sub.innerText = 'Lépj be a fiókodba';
            if (btn) btn.innerText = 'Bejelentkezem';
            if (sw) sw.innerHTML = 'Nincs még fiókod? <span style="color:#0A0F2E; font-weight:600; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Regisztrálj</span>';
            
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
            
            if (rf) rf.style.display = 'flex';
            if (lf) lf.style.display = 'none';
            if (sub) sub.innerText = 'Hozd létre a fiókodat';
            if (btn) btn.innerText = 'Regisztrálok & Bejelentkezem';
            if (sw) sw.innerHTML = 'Van már fiókod? <span style="color:#0A0F2E; font-weight:600; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Jelentkezz be</span>';
            
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
            if (window.firebaseAuth && window.firebaseAPI && window.firebaseAPI.signInWithPopup) {
                const provider = new window.firebaseAPI.GoogleAuthProvider();
                try {
                    const result = await window.firebaseAPI.signInWithPopup(window.firebaseAuth, provider);
                    const user = result.user;
                    console.log("Sikeres Google bejelentkezés:", user.email);
                    
                    var role = loginSelectedRole || 'worker';
                    
                    // Létrehozzuk a usert Firestore-ban ha új (vagy frissítjük az utolsó belépést)
                    if (window.firebaseDb) {
                        try {
                            const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", user.uid);
                            const userSnap = await window.firebaseAPI.getDoc(userRef);
                            
                            if (!userSnap.exists()) {
                                await window.firebaseAPI.setDoc(userRef, {
                                    email: user.email,
                                    firstName: user.displayName ? user.displayName.split(' ')[0] : 'Új',
                                    lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : 'Felhasználó',
                                    role: role,
                                    createdAt: window.firebaseAPI.serverTimestamp(),
                                    bio: '',
                                    skills: [],
                                    location: 'Kaposvár'
                                });
                            } else {
                                await window.firebaseAPI.updateDoc(userRef, {
                                    lastLogin: window.firebaseAPI.serverTimestamp()
                                });
                                // Ha van eltárolt role-ja, inkább azt használjuk
                                const data = userSnap.data();
                                if (data.role) role = data.role;
                            }
                        } catch (e) {
                            console.error("Hiba a felhasználó mentésekor:", e);
                        }
                    }

                    completeLogin(role);
                    showPushNotification('Sikeres belépés!', 'Üdvözlünk újra a MeloGo-ban!', '#22C55E');
                } catch (error) {
                    console.error("Google login error:", error);
                    alert("Hiba a Google bejelentkezés során: " + error.message);
                }
            } else {
                alert("A rendszer még töltődik, kérjük próbáld újra pár másodperc múlva.");
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
                        defaultRole = data.defaultRole || role;
                    }
                    
                    // Save to user_data - completely overwrite from Firestore to prevent stale local cache inheritance!
                    const userData = {};
                    userData.bio = bio;
                    userData.skills = skills;
                    userData.photoURL = photoURL;
                    userData.reviews = userDoc.exists() ? (userDoc.data().reviews || []) : [];
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
                    
                    // Save initial user profile to Firestore
                    await window.firebaseAPI.setDoc(window.firebaseAPI.doc(window.firebaseDb, "users", user.uid), {
                        name: name,
                        email: email,
                        defaultRole: role,
                        createdAt: window.firebaseAPI.serverTimestamp()
                    });
                    
                    // Initialize a brand new, empty local profile to prevent stale local cache inheritance!
                    const userData = {
                        bio: '',
                        skills: [],
                        photoURL: '',
                        reviews: []
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
        }
        
        function openEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.add('open');
            selectEmployerFormCat('Kert'); // load default options
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
                'Kert': '🌳 Kertészet',
                'Festés': '🎨 Festés & Karbantartás',
                'Autó': '🚗 Autó',
                'Ház': '🏠 Ház belseje'
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
        function navigateEmployer(index) {
            navigateApp(index);
        }

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
            
            if (currentJobPickerMode === 'filter') {
                document.getElementById('worker-job-filter-display').innerText = label;
                filterWorkerByExactJob(value);
            } else {
                document.getElementById('worker-search-job-display').innerText = label;
                applyTextSearchTag(value === 'all' ? '' : value);
            }
        }

        function renderJobPickerList() {
            const list = document.getElementById('job-picker-list');
            if (!list) return;

            let html = '';
            
            let defaultLabel = 'Minden feladat';
            if (currentJobPickerMode === 'filter' && workerActiveCategory !== 'all') {
                if (workerActiveCategory === 'Kert') defaultLabel = 'Minden kertészeti feladat';
                else if (workerActiveCategory === 'Festés') defaultLabel = 'Minden festés & karbantartás';
                else if (workerActiveCategory === 'Autó') defaultLabel = 'Minden autós feladat';
                else if (workerActiveCategory === 'Ház belseje') defaultLabel = 'Minden ház belső feladat';
            }
            if (currentJobPickerMode === 'search') {
                defaultLabel = 'Minden feladat mutatása';
            }

            const isAllSelected = selectedExactJob === 'all';
            html += `
                <div class="job-picker-item" onclick="selectJobPickerItem('all', '${defaultLabel}')">
                    <span>${defaultLabel}</span>
                    ${isAllSelected ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                </div>
            `;

            const categoriesMap = {
                'Kert': 'Kertészet',
                'Festés': 'Festés & Karbantartás',
                'Autó': 'Autó',
                'Ház': 'Ház belseje'
            };

            const catsToRender = (currentJobPickerMode === 'filter' && workerActiveCategory !== 'all') 
                ? [(workerActiveCategory === 'Ház belseje' ? 'Ház' : workerActiveCategory)]
                : Object.keys(jobCatalog);

            catsToRender.forEach(cat => {
                if (currentJobPickerMode === 'search' || workerActiveCategory === 'all') {
                    html += `<div class="job-picker-header">${categoriesMap[cat] || cat}</div>`;
                }
                
                jobCatalog[cat].forEach(item => {
                    const isSelected = selectedExactJob === item.name;
                    html += `
                        <div class="job-picker-item" onclick="selectJobPickerItem('${item.name}', '${item.name}')">
                            <span>${item.name}</span>
                            ${isSelected ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                        </div>
                    `;
                });
            });

            list.innerHTML = html;
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
                                     badge === workerActiveCategory || 
                                     (workerActiveCategory === 'Ház belseje' && badge === 'Ház belseje'));
                                     
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

        // Rendezés funkció a munka listán (távolság, ár, legfrissebb, sürgős)
        function sortWorkerJobs(mode) {
            // Frissítjük az aktív sort gombot
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            const btnMap = { distance: 'sort-dist', price: 'sort-price', newest: 'sort-new', urgent: 'sort-urg' };
            const activeBtn = document.getElementById(btnMap[mode]);
            if (activeBtn) activeBtn.classList.add('active');

            const list = document.getElementById('worker-jobs-list');
            const cards = Array.from(list.querySelectorAll('.job-card'));

            cards.sort((a, b) => {
                if (mode === 'distance') {
                    return parseFloat(a.dataset.distance || 99) - parseFloat(b.dataset.distance || 99);
                } else if (mode === 'price') {
                    return parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0);
                } else if (mode === 'newest') {
                    return parseFloat(a.dataset.time || 99) - parseFloat(b.dataset.time || 99);
                } else if (mode === 'urgent') {
                    return parseInt(b.dataset.urgent || 0) - parseInt(a.dataset.urgent || 0);
                }
                return 0;
            });

            // Újra hozzáfűzzük rendezett sorrendben
            cards.forEach(card => list.appendChild(card));
        }

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

            // Kategória ikon és stílus kiválasztása a főkategória szerint
            let activeCat = 'Kert';
            const catBtns = document.querySelectorAll('.category-grid .cat-select-btn');
            catBtns.forEach(btn => {
                if (btn.classList.contains('active')) {
                    activeCat = btn.id.replace('emp-cat-', '');
                }
            });

            // Beállítjuk az állapotot
            gameState.jobTitle = specificJob;
            gameState.jobPrice = price;
            gameState.jobCounty = county;
            gameState.jobCity = city;
            gameState.jobStreet = street;
            gameState.jobHouse = house;
            gameState.jobDesc = details;
            gameState.jobDistance = 4.2;
            gameState.status = 'Keresés';

            // Allowed duplicate posts for testing
            const exists = localEmployerJobs.some(j => j.title === specificJob && j.price === price);
            if (true) {
                const jobId = 'job_' + Date.now();
                localEmployerJobs.unshift({
                    id: jobId,
                    title: specificJob,
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
                        const newDocRef = await window.firebaseAPI.addDoc(window.firebaseAPI.collection(window.firebaseDb, "jobs"), {
                            title: specificJob,
                            details: details,
                            desc: details,
                            location: `${county}, ${city}, ${street} ${house}.`,
                            price: price,
                            category: activeCat,
                            status: 'Keresés',
                            urgent: document.getElementById('emp-urgent-job')?.checked || false,
                            datetime: document.getElementById('emp-datetime')?.value || 'Holnap, 14:00',
                            ownerEmail: window.firebaseAuth.currentUser.email,
                            ownerUid: window.firebaseAuth.currentUser.uid,
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
            document.getElementById('worker-job-detail-title').innerText = title || gameState.jobTitle;
            document.getElementById('worker-job-detail-price').innerText = price || (gameState.jobPrice.toLocaleString('hu-HU') + ' Ft');
            document.getElementById('worker-job-detail-desc').innerText = customDesc || gameState.jobDesc;
            document.getElementById('worker-job-detail-loc').innerText = street || `${gameState.jobStreet} ${gameState.jobHouse} (${distance || gameState.jobDistance} km)`;
            
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
                <div class="chat-date-separator" style="font-size: 12px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">MA</div>
                <div class="chat-bubble outgoing">
                    Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?
                    <span class="chat-bubble-time">14:00</span>
                </div>
            `;
            
            if (gameState.status !== 'Keresés') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            ✨ A megbízó elfogadta a jelentkezést
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Fizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            📅 Kérlek, érkezz pontosan a megbeszélt időpontra!
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Befejezve' || gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            📸 Munka befejezve, ellenőrzésre vár
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            ✅ Sikeres kifizetés és értékelés
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

        function updateWorkerStatusUI() {
            const container = document.getElementById('worker-status-section');
            const chatBox = document.getElementById('worker-chat-messages');
            
            if (gameState.applied) {
                chatBox.style.display = 'flex';
                renderWorkerChatMessages();
            } else {
                chatBox.style.display = 'none';
            }
            
            if (!gameState.applied) {
                container.innerHTML = `
                    <button class="emp-submit-btn" style="margin-top: 16px;" onclick="workerApplyToJob()">
                        Jelentkezés a munkára <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                `;
            } else if (gameState.status === 'Keresés') {
                container.innerHTML = `
                    <div style="background-color: #f8fafc; border:1px solid #e2e8f0; color: var(--color-text-muted); padding: 12px; border-radius: 8px; font-size: 11px; text-align:center; font-weight:600;">
                        ⌛ Jelentkezés elküldve. Várakozás a Munkáltató válaszára és a letét zárolására...
                    </div>
                `;
            } else if (gameState.status === 'Fizetve') {
                container.innerHTML = `
                    <div style="background-color: #eff6ff; color: #1d4ed8; padding: 12px; border-radius: 8px; font-size: 11px; font-weight:600; text-align:center;">
                        🔒 A munkadíj biztonságosan zárolva van letétben. Megkezdheted a munkát!
                    </div>
                    <button class="btn" style="background-color: var(--color-green-go);" onclick="workerSubmitWorkPhoto()">
                        Kép feltöltése & AI Ellenőrzés 📸
                    </button>
                `;
            } else if (gameState.status === 'Befejezve') {
                container.innerHTML = `
                    <div style="background-color: #f0fdf4; color: #166534; padding: 12px; border-radius: 8px; font-size: 11px; font-weight:600; text-align:center;">
                        ⌛ Fotó feltöltve! A Gemini AI hitelesítette. Várakozás a Munkáltatói kifizetésre.
                    </div>
                `;
            } else if (gameState.status === 'Kifizetve') {
                container.innerHTML = `
                    <div style="background-color: #f0fdf4; color: #166534; padding: 16px; border-radius: 8px; font-size: 12px; font-weight:700; text-align:center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                        🎉 Kifizetve! +${(gameState.jobPrice * 0.95).toLocaleString('hu-HU')} Ft megérkezett a MeloGo egyenlegedre!
                    </div>
                `;
            }
        }

        // C. DIÁK JELENTKEZIK A MUNKÁRA
        function workerApplyToJob() {
            gameState.status = 'Keresés';
            gameState.applied = true; 
            
            const badge = document.getElementById('app-msg-badge');
            if (badge) { badge.innerText = '1'; badge.style.display = 'flex'; }

            const matchedJob = localEmployerJobs.find(j => j.title === gameState.jobTitle);
            const employerEmail = (matchedJob && matchedJob.ownerEmail) ? matchedJob.ownerEmail : 'employer@melogo.hu';
            const workerEmail = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'worker@melogo.hu';

            // REDESIGN: insert applying user to localChats
            const newChat = {
                id: 'chat_' + Date.now(),
                name: currentUser ? currentUser.name : "Diák",
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
                createdAt: Date.now()
            };
            localWorkerApplications.unshift(newApp);
            saveWorkerApplications();
            renderWorkerApplications();

            // Keep matched job status as 'Keresés' until employer accepts
            const matchedAdIndex = localEmployerJobs.findIndex(j => j.title === gameState.jobTitle);
            if (matchedAdIndex !== -1) {
                localEmployerJobs[matchedAdIndex].status = 'Keresés';
                saveEmployerJobs();
                renderEmployerHome();
            }

            // Automatikus váltás a Megbízó nézetre és üzenetek megnyitása a könnyű teszteléshez
            setTimeout(() => {
                switchRole('employer');
                navigateApp(2); 
            }, 500);

            document.getElementById('worker-success-title').innerText = 'Sikeres jelentkezés!';
            document.getElementById('worker-success-desc').innerText = 'A Munkáltató értesítést kapott. Mutatjuk a nézetét...';
            const wSuccess = document.getElementById('worker-success');
            if (wSuccess) wSuccess.classList.add('active');

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
                    imgHtml = `<div style="width:30px; height:30px; border-radius:50%; background:${getAvatarColor(workerName)}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; border:1px solid rgba(255,255,255,0.3);">${photoURL}</div>`;
                }
            }
            document.getElementById('employer-action-title').innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="openWorkerProfile('${workerName}')">
                    ${imgHtml}
                    <div style="text-align:left;">
                        <div style="font-size:14px; font-weight:700; color:#fff; display:flex; align-items:center; gap:4px; line-height:1.2;">
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

            // Töröljük a hirdető értesítési jelvényét, mert megnyitotta
            const msgBadge = document.getElementById('app-msg-badge');
            if (msgBadge) msgBadge.style.display = 'none';

            const chatMessages = document.getElementById('employer-chat-messages');
            
            let html = `
                <div class="chat-date-separator" style="font-size: 12px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">MA</div>
                <div class="chat-bubble incoming">
                    Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?
                    <span class="chat-bubble-time">14:00</span>
                </div>
            `;

            if (gameState.status !== 'Keresés') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            ✨ Elfogadtad a jelentkezést
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Fizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            📅 Munkavállaló értesítve a kezdésről.
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Befejezve' || gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            📸 Munka befejezve, ellenőrzésre vár
                        </span>
                    </div>
                `;
            }
            if (gameState.status === 'Kifizetve') {
                html += `
                    <div style="text-align:center; margin: 16px 0;">
                        <span style="display:inline-block; background: #F8F9FB; color: #080C1E; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; border: 1px solid #D1D5DB;">
                            ✅ Sikeres kifizetés és értékelés
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
                    <div style="background: #fff; border-radius: 16px; padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; display: flex; flex-direction: column; gap: 12px;">
                        <button class="btn" style="height: 52px; border-radius: 16px; background: #080C1E; color: #fff; border: none; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(10, 15, 46, 0.25); transition: transform 0.1s;" onclick="employerLockEscrow()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Munkadíj zárolása letétbe (${(gameState.jobPrice || 12000).toLocaleString('hu-HU')} Ft)
                        </button>
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center; opacity: 0.8;">
                            
                            <span style="font-size: 11px; color: #6B7280; font-weight: 500;">
                                Biztonságos Stripe™ letétkezelés.
                            </span>
                        </div>
                    </div>
                `;
            } else if (gameState.status === 'Fizetve') {
                footer.innerHTML = `
                    <div style="background: #EFF6FF; border-radius: 16px; padding: 18px; border: none; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.08);">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #3B82F6; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            <div style="font-size: 14px; font-weight: 700; color: #1E40AF;">Fedezet biztonságban lefoglalva</div>
                            <div style="font-size: 11px; color: #3B82F6; font-weight: 500;">A diák dolgozik. Várakozás a munka befejezésére...</div>
                        </div>
                    </div>
                `;
            } else if (gameState.status === 'Befejezve') {
                footer.innerHTML = `
                    <div style="background: #fff; border-radius: 16px; padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; display: flex; flex-direction: column; gap: 12px;">
                        <button class="btn" style="height: 52px; border-radius: 16px; background: #22C55E; color: #fff; border: none; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25); transition: transform 0.1s;" onclick="employerApproveAndRelease()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Munka jóváhagyása és kifizetés
                        </button>
                        <div style="display: flex; align-items: center; gap: 6px; justify-content: center; color: #166534; font-weight: 600; font-size: 11px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            Gemini AI: Munka elvégezve! Indítsd el a kifizetést.
                        </div>
                    </div>
                `;
            } else if (gameState.status === 'Kifizetve') {
                footer.innerHTML = `
                    <div style="background: #F0FDF4; border-radius: 16px; padding: 18px; border: none; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08);">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #22C55E; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            <div style="font-size: 14px; font-weight: 700; color: #166534;">Tranzakció sikeresen teljesítve!</div>
                            <div style="font-size: 11px; color: #15803D; font-weight: 500;">A munkadíj kifizetve. Köszönjük!</div>
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
            document.getElementById('employer-job-list-status').style.color = '#3b82f6';

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
            document.getElementById('worker-success-desc').innerText = `A Gemini 1.5 Flash AI megvizsgálta a fotót: "A(z) '${gameState.jobTitle}' munka elvégzésre került. A fotó hiteles." Várakozás kifizetésre.`;
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
            document.getElementById('employer-job-list-status').innerText = 'Állapot: Kifizetve';
            document.getElementById('employer-job-list-status').style.color = 'var(--color-green-go)';

            document.getElementById('employer-success-title').innerText = 'Sikeres kifizetés! 💸';
            document.getElementById('employer-success-desc').innerText = 'A diák megkapta a pénzét. Köszönjük, hogy a MelóGo-t választottad a biztonságos megbízáshoz!';
            document.getElementById('employer-success').classList.add('active');

            document.getElementById('worker-success-title').innerText = 'A munkadíjad megérkezett! 💰';
            document.getElementById('worker-success-desc').innerText = `A Munkáltató jóváhagyta a munkát! ${(gameState.jobPrice * 0.95).toLocaleString('hu-HU')} Ft átutalásra került a MeloGo bankszámládra.`;
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
            'Kertészet': ['Kertészet', 'Fűnyírás', 'Gyomirtás', 'Hólapátolás', 'Növénygondozás'],
            'Festés & Karbantartás': ['Festés', 'Kisebb javítások', 'Szerelés', 'Alapozó festés'],
            'Autóápolás': ['Autómosás', 'Porszívózás', 'Autókozmetika', 'Kerékcsere'],
            'Házimunka & Segítség': ['Takarítás', 'Bevásárlás', 'Kutyasétáltatás', 'Ablaktisztítás', 'Mosogatás', 'Vasalás'],
            'Asztalos & Kőműves': ['Bútor összeszereléS', 'Asztalos segítő', 'Kőműves segítő', 'Anyagcipelés', 'Cementkeverés'],
            'Költöztetés & Szállítás': ['Költöztetés', 'Rakodás', 'Cipelés', 'Csomagolás'],
            'Rendezvény & Mezőgazdaság': ['Rendezvény segítő', 'Kiszolgálás', 'Gyümölcsszedés', 'Mezei munka', 'Szüret']
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

        async function openSettings() {
            const overlay = document.getElementById('worker-settings');
            overlay.classList.add('open');
            renderSkillSelector();
            
            // Load Bio from user data
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const bioField = document.getElementById('settings-bio');
            if (bioField && userData.bio) {
                bioField.value = userData.bio;
            }

            // Sync from Firestore if possible
            if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                try {
                    const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", window.firebaseAuth.currentUser.uid);
                    const userSnap = await window.firebaseAPI.getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        if (data.bio && bioField) {
                            bioField.value = data.bio;
                            userData.bio = data.bio;
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

        function renderSkillSelector() {
            const grid = document.getElementById('skill-selector');
            if (!grid) return;
            
            let html = '';
            for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
                html += `
                    <div class="skill-category-block">
                        <div class="skill-category-title">${category}</div>
                        <div class="skill-category-tags">
                            ${skills.map(skill => `
                                <button type="button" class="skill-tag ${selectedSkills.has(skill) ? 'selected' : ''}"
                                    onclick="toggleSkill('${skill}', this)">
                                    ${skill}
                                </button>
                            `).join('')}
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
                if (selectedSkills.size >= 6) {
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

        function updateCharCounter() {
            const bio = document.getElementById('settings-bio');
            const counter = document.getElementById('bio-char-counter');
            if (bio && counter) {
                const len = bio.value.length;
                counter.textContent = `${len} / 300`;
                counter.style.color = len > 270 ? '#DC2626' : '#9CA3AF';
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
            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
            
            // Save to Firestore if available
            if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                try {
                    const userRef = window.firebaseAPI.doc(window.firebaseDb, "users", window.firebaseAuth.currentUser.uid);
                    await window.firebaseAPI.updateDoc(userRef, {
                        name: nameVal,
                        bio: bioVal,
                        skills: skillsArr
                    });
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
        function sortWorkerJobs(mode) {
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
            cards.forEach((c, i) => {
                c.style.opacity = '0';
                c.style.transform = 'translateY(8px)';
                jobsList.appendChild(c);
                setTimeout(() => {
                    c.style.transition = 'opacity 200ms ease, transform 200ms ease';
                    c.style.opacity = '1';
                    c.style.transform = 'translateY(0)';
                }, i * 60);
            });
        }

        // ================================================
        // STAGGERED JOB CARD ANIMATION ON LOAD
        // ================================================
        function animateJobCards() {
            const cards = document.querySelectorAll('.job-card');
            cards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 250ms ease, transform 250ms ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 + i * 60);
            });
        }



        // Restore last sort preference on load
        window.addEventListener('DOMContentLoaded', () => {
            try {
                const savedSort = localStorage.getItem('melogo_sort');
                if (savedSort) sortWorkerJobs(savedSort);
                
                // Init Date Filter
                if (typeof renderDateFilter === 'function') renderDateFilter();
            } catch(e) {}
            setTimeout(animateJobCards, 300);
        });



        // ===================================================================
        // MOCK JOBS — Demo adatok + Firestore-ból szinkronizálódó valós hirdetések
        // ===================================================================
        // IMPORTANT: mockJobs must be on window so the Firebase module script can access it!
        window.mockJobs = [
            { id: 1, title: 'Fűnyírás a Desedánál', isNew: true, employer: 'Tóth János', price: 8000, distance: 2.5, lat: 46.3812, lon: 17.8123, category: 'Kert', location: 'Kaposvár, Deseda u. 12.', time: '2026-06-02', urgent: false, timeOffset: 1, desc: 'Kb. 200m² gyep levágása. Fűnyíró van, csak jöjj és csináld! Rövid munka, max 2-3 óra.', toolsRequired: 'employer' },
            { id: 2, title: 'Kerítésfestés', isNew: true, employer: 'Nagy Péter', price: 12000, distance: 3.1, lat: 46.3512, lon: 17.8345, category: 'Festés', location: 'Kaposvár, Fő u. 5.', time: '2026-06-03', urgent: false, timeOffset: 2, desc: 'Kb. 30 méter deszkakerítés festése fehér színűre. Festék és ecset adott, csak munkáskéz kell.', toolsRequired: 'employer' },
            { id: 3, title: 'Autómosás (kézi)', employer: 'Szabó Éva', price: 5000, distance: 0.8, lat: 46.3634, lon: 17.7899, category: 'Autó', location: 'Kaposvár, Sport u. 8.', time: '2026-06-02', urgent: true, timeOffset: 1, desc: 'Kis SUV kézi mosása kint az udvaron. Víz és szivacs adott. Sürgős, ma estére kell!', toolsRequired: 'employer' },
            { id: 4, title: 'Ablakok tisztítása', employer: 'Molnár István', price: 7000, distance: 1.2, lat: 46.3689, lon: 17.7912, category: 'Ház', location: 'Kaposvár, Vár u. 3.', time: '2026-06-03', urgent: false, timeOffset: 2, desc: 'Emelt szintű lakás 6 ablakának belső+külső tisztítása. Eszközök adottak.', toolsRequired: 'employer' },
            { id: 5, title: 'Gyomirtás, kapálás', employer: 'Kiss Mária', price: 6500, distance: 4.2, lat: 46.3312, lon: 17.7654, category: 'Kert', location: 'Kaposvár, Kert u. 1.', time: '2026-06-04', urgent: false, timeOffset: 3, desc: 'Veteményes kert kapálása és gyomtalanítása. Szerszámok a helyszínen.', toolsRequired: 'employer' },
            { id: 6, title: 'Bútor összeszereléS', employer: 'Horváth Gábor', price: 9000, distance: 2.0, lat: 46.3721, lon: 17.7888, category: 'Asztalos', location: 'Kaposvár, Béke tér 7.', time: '2026-06-05', urgent: true, timeOffset: 4, desc: 'IKEA PAX szekrény összeszerelek 3 ajtóval. Az instrukciók megvannak, csak kell egy segítő kéz!', toolsRequired: 'employer' },
            { id: 7, title: 'Kutyasétáltatás', employer: 'Kovács Edit', price: 3000, distance: 0.5, lat: 46.3567, lon: 17.7922, category: 'Ház', location: 'Kaposvár, Rózsa u. 9.', time: '2026-06-02', urgent: false, timeOffset: 1, desc: 'Kis labrador kutyus sétáltatása kb. 45 percig a Deseda körül. Szabad és barátságos kutya!', toolsRequired: 'worker' },
            { id: 8, title: 'Hólapátolás', employer: 'Fekete Zoltán', price: 4000, distance: 5.5, lat: 46.3112, lon: 17.7788, category: 'Kert', location: 'Kaposvár, Somogyi u. 15.', time: '2026-06-04', urgent: true, timeOffset: 3, desc: 'Bejáró és járda felszabadítása hó alól. Kb. 1 óra munka. Lapát adott.', toolsRequired: 'employer' },
            { id: 9, title: 'Költözés segítség', employer: 'Balogh Péter', price: 18000, distance: 2.3, lat: 46.3700, lon: 17.7850, category: 'Költöztetés', location: 'Kaposvár, Rákóczi u. 8.', time: '2026-06-07', urgent: false, timeOffset: 6, desc: 'Egyszobás lakás kiköltöztetése, furgon is van. 4-5 óra munka, 2 emelet. Komoly fizetés!', toolsRequired: 'employer' },
            { id: 10, title: 'Iroda takarítás', employer: 'Kovács & Társa Kft.', price: 22000, distance: 0.9, lat: 46.3580, lon: 17.7970, category: 'Takarítás', location: 'Kaposvár, Kossuth tér 2.', time: '2026-06-02', urgent: true, timeOffset: 1, desc: 'Kis irodahelyiség (4 szoba) alapos takarítása. Takarítószer biztosított, porszívó is van.', toolsRequired: 'employer' },
            { id: 11, title: 'Bevásárlás & csomagkézbesítés', employer: 'Nagy Erzsébet', price: 4000, distance: 0.6, lat: 46.3610, lon: 17.7940, category: 'Futár', location: 'Kaposvár, Virág u. 11.', time: '2026-06-03', urgent: false, timeOffset: 2, desc: 'Hetilista alapján bevásárlás a közeli Aldiban, majd házhoz szállítás. Lista és pénz előre adott.', toolsRequired: 'worker' },
            { id: 12, title: 'Rendezvény felállítás', employer: 'Kaposvári Rendezvényház', price: 15000, distance: 3.5, lat: 46.3480, lon: 17.8100, category: 'Rendezvény', location: 'Kaposvár, Sport u. 20.', time: '2026-06-05', urgent: false, timeOffset: 4, desc: 'Esküvői terem felállítása: asztalok, székek elrendezése, terítés segítség. Este 6-ra kell kész lenni.', toolsRequired: 'employer' },
            { id: 13, title: 'Idős néni segítsége', employer: 'Kovács Anna', price: 4500, distance: 1.1, lat: 46.3555, lon: 17.7960, category: 'Idősek', location: 'Kaposvár, Arany J. u. 14.', time: '2026-06-03', urgent: false, timeOffset: 2, desc: 'Hetente egyszer orvoshoz kísérés, gyógyszerkiváltás, kis bevásárlás. Kedves, megbízható személyt keresünk.', toolsRequired: 'employer' },
            { id: 14, title: 'Szőlőszüret segítség', employer: 'Takács Gazdaság', price: 12000, distance: 8.2, lat: 46.2900, lon: 17.7500, category: 'Mező', location: 'Kaposvár környéke, Szőlőhegy u. 1.', time: '2026-06-08', urgent: false, timeOffset: 7, desc: 'Kézzel szedett szőlő kb. fél napos munka. Ebéd biztosítva, reggel 7-től. Jó levegő, szép táj!', toolsRequired: 'employer' },
        ];
        // Local alias for backward compatibility with all existing code
        let mockJobs = window.mockJobs;

        function recalculateJobDistances() {
            mockJobs.forEach(job => {
                if (userCoords && job.lat && job.lon) {
                    job.distance = calculateHaversine(userCoords.lat, userCoords.lon, job.lat, job.lon);
                } else {
                    job.distance = null;
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
                    timeOffset: 0,
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
        let activeSortMode = 'distance';
        let currentMapCategory = 'all';
        let selectedMapJob = null;
        let userCoords = { lat: 46.3593, lon: 17.7967 }; // Central Kaposvár coordinates

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
            'Festés': { bg: '#7c3aed', class: 'cat-festes' },
            'Autó': { bg: '#d97706', class: 'cat-auto' },
            'Ház': { bg: '#2563eb', class: 'cat-haz' },
            'Asztalos': { bg: '#92400e', class: 'cat-asztalos' },
            'Kőműves': { bg: '#b45309', class: 'cat-komuves' },
            'Költöztetés': { bg: '#0891b2', class: 'cat-koltoztetes' },
            'Takarítás': { bg: '#0d9488', class: 'cat-takaritas' },
            'Rendezvény': { bg: '#db2777', class: 'cat-rendezv' },
            'Mező': { bg: '#65a30d', class: 'cat-mezo' },
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
                    <div class="job-card shimmer" style="min-height: 96px; margin-bottom: 16px; border-radius: 16px; border: 1px solid #F1F1F1; background: #fff; overflow: hidden; position: relative;">
                        <div style="padding: 24px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                                <div style="width: 60%; height: 20px; background: #E5E7EB; border-radius: 6px;"></div>
                                <div style="width: 25%; height: 20px; background: #E5E7EB; border-radius: 6px;"></div>
                            </div>
                            <div style="width: 40%; height: 16px; background: #F3F4F6; border-radius: 6px;"></div>
                        </div>
                    </div>
                `;
            }
            list.innerHTML = html;
        }

        function renderJobCards(jobs) {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;
            list.innerHTML = '';

            if (!jobs || jobs.length === 0) {
                list.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" style="margin-bottom: 12px;">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <h3 style="font-size: 16px; font-weight: 600; color: #080C1E; margin-bottom: 8px;">Nincs találat</h3>
                        <p style="font-size: 13px; color: #6B7280; max-width: 260px; margin: 0 auto;">Jelenleg nincs a keresésnek megfelelő munka. Próbálkozz más kategóriával vagy várostal!</p>
                    </div>
                `;
                return;
            }

            jobs.forEach(job => {
                const catInfo = catColors[job.category] || { bg: '#6B7280', class: '' };
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
                            <div class="job-title">${job.title}</div>
                            <div style="font-size:12px; color:var(--color-text-light); margin-top:2px;">${job.employer}</div>
                        </div>
                        <div class="job-price">${job.price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                    <div class="job-card-badges">
                        <span class="job-badge-cat">${job.category}</span>
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
                            📍 ${job.location.split(',').slice(-1)[0].trim()}
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });

            if (jobs.length === 0) {
                list.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--color-text-light);"><div style="font-size:32px; margin-bottom:12px;">🔍</div><div style="font-size:14px;">Úgy néz ki, ma mindenki pihen 😴 — próbálj nagyobb hatókört!</div></div>';
            }
        }

        function getFilteredAndSortedJobs() {
            // Allow jobs with null/undefined distance (no GPS) to show up always
            let jobs = mockJobs.filter(j => j.distance === null || j.distance === undefined || j.distance <= activeRadius);

            if (activeCategoryFilter !== 'Összes' && activeCategoryFilter !== 'all') {
                jobs = jobs.filter(j => j.category === activeCategoryFilter);
            }

            // Date filter
            if (activeDateFilter) {
                jobs = jobs.filter(j => j.time && j.time.startsWith(activeDateFilter));
            }

            // Sürgős jobs always on top
            const urgentJobs = jobs.filter(j => j.urgent);
            const normalJobs = jobs.filter(j => !j.urgent);

            if (activeSortMode === 'distance') {
                urgentJobs.sort((a, b) => a.distance - b.distance);
                normalJobs.sort((a, b) => a.distance - b.distance);
            } else if (activeSortMode === 'price') {
                urgentJobs.sort((a, b) => b.price - a.price);
                normalJobs.sort((a, b) => b.price - a.price);
            } else if (activeSortMode === 'newest') {
                urgentJobs.sort((a, b) => a.timeOffset - b.timeOffset);
                normalJobs.sort((a, b) => a.timeOffset - b.timeOffset);
            } else if (activeSortMode === 'urgent') {
                return [...urgentJobs, ...normalJobs];
            }

            return [...urgentJobs, ...normalJobs];
        }

        function refreshJobList() {
            renderSkeletonJobs('worker-jobs-list', 3);
            setTimeout(() => {
                renderJobCards(getFilteredAndSortedJobs());
            }, 300);
        }

        // ===================================================================
        // NEW FILTER/SORT FUNCTIONS
        // ===================================================================
        function filterWorkerJobs(cat) {
            activeCategoryFilter = cat;
            const catMap = { 'Összes': 'Minden', 'Kert': 'Kertészet', 'Festés': 'Festés', 'Autó': 'Autó', 'Ház': 'Ház b.' };
            const btns = document.querySelectorAll('.category-btn');
            btns.forEach(btn => {
                const label = btn.innerText.trim();
                const isActive = (catMap[cat] === label) || (cat === 'all' && label === 'Minden') || (cat === label);
                if (isActive) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
                // remove any explicit inline styling so class rules apply
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.border = '';
            });
            refreshJobList();
        }

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
                    <div onclick="setDateFilter('${isoDate}')" style="min-width: 52px; padding: 6px 0; border-radius: 12px; border: 1.5px solid ${isActive ? '#080C1E' : '#E5E7EB'}; background: ${isActive ? '#080C1E' : '#fff'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0;">
                        <span style="font-size: 11px; font-weight: 700; color: ${isActive ? '#fff' : '#6B7280'}; margin-bottom: 2px;">${dayName}</span>
                        <span style="font-size: 16px; font-weight: 800; color: ${isActive ? '#fff' : '#1F2937'};">${num}</span>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        }

        function sortWorkerJobsNew(mode) {
            activeSortMode = mode;
            document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
            const map = { distance: 'sort-dist', price: 'sort-price', newest: 'sort-new', urgent: 'sort-urg' };
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
            const job = mockJobs.find(j => j.id === jobId);
            if (!job) return;
            document.getElementById('worker-job-detail-title').innerText = job.title;
            document.getElementById('worker-job-detail-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('worker-job-detail-desc').innerText = job.desc;
            
            let locText = '📍 ' + job.location + ' (' + job.distance + ' km)';
            if (job.urgent) {
                locText += ' • 🔴 SÜRGŐS!';
            }
            if (job.toolsRequired === 'worker') {
                locText += ' • 🧰 Munkás hozza az eszközt';
            } else {
                locText += ' • 🛠️ Megbízó adja az eszközt';
            }
            document.getElementById('worker-job-detail-loc').innerText = locText;
            
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
                const catInfo = catColors[job.category] || { bg: '#6B7280' };
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
            slider.style.background = `linear-gradient(to right, #22C55E ${pct}%, #E5E7EB ${pct}%)`;
        }

        function confirmDistance() {
            const val = parseInt(document.getElementById('distance-slider').value);
            activeRadius = val;
            localStorage.setItem('melogo_radius', val);
            document.getElementById('distance-pill-text').innerText = val + ' km';
            closeDistanceSheet();
            refreshJobList();
            renderMapPins();
            showPushNotification('🗺️ Hatótáv frissítve', val + ' km körzetben keresünk munkákat!', '#22C55E');
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
                    html: `<div class="user-gps-dot" style="width: 16px; height: 16px; background: #3B82F6; border: 2.5px solid #fff; border-radius: 50%; box-shadow: 0 0 0 4px rgba(59,130,246,0.3); animation: gps-pulse 2s infinite;"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                gpsMarker = L.marker([userCoords.lat, userCoords.lon], { icon: gpsIcon }).addTo(leafletMap);
            }

            const visibleJobs = mockJobs.filter(j => {
                const matchesDistance = (j.distance === null || j.distance <= activeRadius);
                const matchesCategory = (currentMapCategory === 'all' || j.category === currentMapCategory);
                return matchesDistance && matchesCategory;
            });

            visibleJobs.forEach(job => {
                if (!job.lat || !job.lon) return;

                const priceIcon = L.divIcon({
                    className: 'leaflet-custom-pin',
                    html: `<div class="map-pin-label" style="background:#080C1E; color:white; padding:8px 12px; border-radius: 16px; font-weight:700; font-size:12px; border:2px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.15); cursor:pointer; pointer-events:auto; text-align:center; white-space:nowrap;">${job.price.toLocaleString('hu-HU')} Ft</div>`,
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
            const job = mockJobs.find(j => j.id === jobId);
            if (!job) return;
            selectedMapJob = job;

            document.getElementById('map-prev-title').innerText = job.title;
            document.getElementById('map-prev-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            
            const distText = job.distance !== null && job.distance !== undefined ? job.distance + ' km' : '? km';
            document.getElementById('map-prev-meta').innerText = distText + ' · ' + job.employer;

            const card = document.getElementById('map-preview-card');
            if (card) card.classList.add('visible');
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
                    setGPSStatus(true, 'GPS Aktív');
                    recalculateJobDistances();
                    if (typeof renderWorkerHome === 'function') renderWorkerHome();
                    if (typeof renderMapPins === 'function') renderMapPins();
                },
                (err) => {
                    userCoords = null;
                    setGPSStatus(false, 'GPS letiltva');
                    recalculateJobDistances();
                    if (typeof renderWorkerHome === 'function') renderWorkerHome();
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }

        function setGPSStatus(active, cityName) {
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



        // ===================================================================
        // WORKER PROFILE OVERLAY FOR EMPLOYER
        // ===================================================================
        async function openWorkerProfile(workerName) {
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
            
            // Try to fetch real profile data from Firestore by querying the name field
            if (window.firebaseAPI && window.firebaseDb) {
                try {
                    const q = window.firebaseAPI.query(
                        window.firebaseAPI.collection(window.firebaseDb, "users"), 
                        window.firebaseAPI.where("name", "==", name)
                    );
                    const querySnapshot = await window.firebaseAPI.getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
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
                    <span class="profile-skill-chip" style="background:#fff; border:0.5px solid var(--color-border); padding: 6px 12px; border-radius: 16px; font-size:11px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M3 12h1M20 12h1M12 3v1M12 20v1"/></svg>
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
                    return `
                        <div style="background: white; border-radius: 16px; border: 0.5px solid #F1F1F1; padding: 16px 20px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                                <div style="font-size: 13px; font-weight:700; color: #080C1E;">${reviewerName}</div>
                                <div style="font-size: 11px; color: #9CA3AF;">${reviewDate}</div>
                            </div>
                            <div style="font-size: 13px; margin-bottom: 6px;">${activeStars}</div>
                            <div style="font-size: 13px; color: #4B5563; line-height:1.5;">${reviewText}</div>
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

        function openChat(name, jobTitle, lastMsg, time, isUnread, chatId) {
            selectedChatId = chatId;
            window.selectedChatId = chatId;
            document.getElementById('chat-detail-name').innerText = name || 'Ismeretlen';
            document.getElementById('chat-detail-job').innerText = jobTitle || '';
            
            const avatarImg = document.getElementById('chat-detail-avatar');
            const avatarFallback = document.getElementById('chat-detail-avatar-fallback');
            if (avatarImg && avatarFallback && window.avatarCache && window.avatarCache[name]) {
                const photoURL = window.avatarCache[name];
                if (photoURL.startsWith('http') || photoURL.startsWith('data:')) {
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
            
            if (pinnedAddr) pinnedAddr.innerText = matchedJob ? matchedJob.location.split(',').slice(-1)[0].trim() : 'Kaposvár';
            if (pinnedPrice) pinnedPrice.innerText = matchedJob ? (matchedJob.price.toLocaleString('hu-HU') + ' Ft') : '12 000 Ft';
            if (pinnedJob) pinnedJob.innerText = jobTitle || 'Munka';

            const msgContainer = document.getElementById('chat-detail-messages');

            // Build simulated conversation dynamically based on job status or load persisted messages
            let msgs = [];
            const chat = localChats.find(c => c.id === chatId);
            
            if (chat && chat.messages) {
                msgs = [...chat.messages]; // Use copy to avoid side-effects
            } else {
                if (jobTitle === gameState.jobTitle && gameState.applied) {
                    const isEmployer = (currentRole === 'employer');
                    msgs = [
                        { from: isEmployer ? 'other' : 'me', text: 'Szia! Jelentkeztem a munkádra, szívesen elvállalom.<br>Mikor és hogyan egyezünk meg a részletekről?', time: '14:00' }
                    ];
                } else {
                    msgs = [
                        { from: 'other', text: 'Szia! Elvállalnád a munkát?', time: '10:00' },
                        { from: 'me', text: 'Szia! Igen, szívesen! Mikor kell?', time: '10:05' },
                        { from: 'other', text: lastMsg || 'Mikor tudnál jönni holnap?', time: time || '10:42' },
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
                if (gameState.status === 'Fizetve' || gameState.status === 'Befejezve' || gameState.status === 'Kifizetve') {
                    const startText = isEmployer ? '📅 Munkavállaló értesítve a kezdésről.' : `📅 Kérlek, érkezz pontosan a megbeszélt időpontra!`;
                    if (!msgs.some(m => m.from === 'system' && m.text === startText)) {
                        msgs.push({ from: 'system', text: startText });
                    }
                }
                if (gameState.status === 'Befejezve' || gameState.status === 'Kifizetve') {
                    const compText = '📸 Munka befejezve, ellenőrzésre vár';
                    if (!msgs.some(m => m.from === 'system' && m.text === compText)) {
                        msgs.push({ from: 'system', text: compText });
                    }
                }
                if (gameState.status === 'Kifizetve') {
                    const starsValue = (localWorkerApplications.find(a => a.title === jobTitle) || {}).rating || 5;
                    const payText = `✅ Sikeres kifizetés és értékelés<br><span style="font-size: 16px;">${starsHtml(starsValue)}</span>`;
                    if (!msgs.some(m => m.from === 'system' && m.text.includes('Sikeres kifizetés'))) {
                        msgs.push({ from: 'system', text: payText });
                    }
                }
            }

            msgContainer.innerHTML = '<div style="font-size: 12px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">MA</div>';

            msgs.forEach(msg => {
                const bubble = document.createElement('div');
                if (msg.from === 'system') {
                    bubble.style.cssText = 'background: #F8F9FB; border: 1px solid #D1D5DB; color: #080C1E; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
                    bubble.innerHTML = msg.text;
                } else {
                    const isMe = msg.from === 'me';
                    bubble.style.cssText = `
                        max-width:80%; padding:10px 14px; border-radius:${isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
                        background:${isMe ? 'var(--color-navy)' : '#fff'};
                        color:${isMe ? '#fff' : 'var(--color-navy)'};
                        font-size:14px; align-self:${isMe ? 'flex-end' : 'flex-start'};
                        box-shadow: 0 1px 4px rgba(0,0,0,0.07);
                    `;
                    bubble.innerHTML = msg.text + (msg.time ? `<div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">${msg.time}</div>` : '');
                }
                msgContainer.appendChild(bubble);
            });

            msgContainer.scrollTop = msgContainer.scrollHeight;
            document.getElementById('chat-detail-overlay').classList.add('open');
            updateChatActionBar(jobTitle);
        }

        function sendChatMessageNew() {
            const input = document.getElementById('chat-reply-input');
            const text = input.value.trim();
            if (!text) return;

            const msgContainer = document.getElementById('chat-detail-messages');
            const bubble = document.createElement('div');
            const now = new Date();
            const t = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

            bubble.style.cssText = `
                max-width:80%; padding:10px 14px; border-radius: 18px 18px 4px 18px;
                background:var(--color-navy); color:#fff; font-size:14px;
                align-self:flex-end; box-shadow: 0 1px 4px rgba(0,0,0,0.07);
            `;
            bubble.innerHTML = text + `<div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">${t}</div>`;
            msgContainer.appendChild(bubble);
            input.value = '';
            msgContainer.scrollTop = msgContainer.scrollHeight;

            // Persist sent message inside localChats and trigger save/sync!
            if (selectedChatId) {
                const chat = localChats.find(c => c.id === selectedChatId);
                if (chat) {
                    if (!chat.messages) chat.messages = [];
                    chat.messages.push({ from: 'me', text: text, time: t });
                    chat.lastMsg = text;
                    chat.time = 'Most';
                    saveLocalChats();
                    renderChatList();
                }
            }
        }

        function triggerPhotoAttach() {
            showPushNotification('📷 Fotó feltöltve', 'A munka fotója el lett küldve a munkáltatónak!', '#22C55E');
            const msgContainer = document.getElementById('chat-detail-messages');
            const bubble = document.createElement('div');
            bubble.style.cssText = `
                max-width:85%; padding:10px 14px; border-radius: 18px 18px 4px 18px;
                background:var(--color-navy); color:#fff; font-size:14px;
                align-self:flex-end; box-shadow: 0 1px 4px rgba(0,0,0,0.07);
            `;
            const photoHtml = '<div style="width:100%; height:80px; background:rgba(255,255,255,0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px;">📷</div><div style="font-size:11px; margin-top:6px; opacity:0.7;">Munka fotója elküldve</div>';
            bubble.innerHTML = photoHtml;
            msgContainer.appendChild(bubble);
            msgContainer.scrollTop = msgContainer.scrollHeight;

            // Persist photo attachment inside localChats and trigger save/sync!
            if (selectedChatId) {
                const chat = localChats.find(c => c.id === selectedChatId);
                if (chat) {
                    if (!chat.messages) chat.messages = [];
                    chat.messages.push({ from: 'me', text: photoHtml, time: 'Most' });
                    chat.lastMsg = '📷 Munka fotója elküldve';
                    chat.time = 'Most';
                    saveLocalChats();
                    renderChatList();
                }
            }
        }

        // ===================================================================
        // PUSH NOTIFICATION BANNER
        // ===================================================================
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
                showPushNotification('🏠 Üdv a MeloGo-ban!', '8 munka a közeledben · ' + activeRadius + ' km körzetben', '#22C55E');
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
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Jelentkezés elküldve';

                // Push notification
                const _applyUser = loadCurrentUser(); 
                showPushNotification('📩 ' + (_applyUser ? _applyUser.name : 'Valaki') + ' jelentkezett', 'A munkádra: ' + (gameState.jobTitle || 'Fűnyírás'), '#080C1E');
            }, 1000);
        }

        function updateApplyBtnState() {
            const btn = document.getElementById('worker-apply-btn');
            if (!btn) return;
            if (gameState.applied) {
                btn.classList.add('applied');
                btn.classList.remove('loading', 'confirmed');
                if (gameState.status === 'Keresés') {
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Már jelentkeztél';
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
                btnEmp.style.background = '#080C1E';
                btnEmp.style.color = '#fff';
                btnEmp.style.border = '2px solid #080C1E';
                
                btnWork.style.background = '#F9FAFB';
                btnWork.style.color = '#6B7280';
                btnWork.style.border = '2px solid #E5E7EB';
            } else {
                btnWork.style.background = '#080C1E';
                btnWork.style.color = '#fff';
                btnWork.style.border = '2px solid #080C1E';
                
                btnEmp.style.background = '#F9FAFB';
                btnEmp.style.color = '#6B7280';
                btnEmp.style.border = '2px solid #E5E7EB';
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
                    track.style.background = '#E5E7EB'; // Gray
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
            sheet.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:#fff;border-top-left-radius:24px;border-top-right-radius:24px;z-index:8001;padding:20px;max-height:70%;overflow-y:auto;';
            sheet.innerHTML = '<div style="width:36px;height:4px;background:#E5E7EB;border-radius:2px;margin:0 auto 16px;"></div><div style="font-size:16px;font-weight:700;color:#080C1E;margin-bottom:16px;">' + empActiveCat + ' munkák</div>';
            
            items.forEach(item => {
                const row = document.createElement('div');
                row.style.cssText = 'padding:14px 0;/* removed */display:flex;justify-content:space-between;align-items:center;cursor:pointer;';
                row.innerHTML = '<span style="font-size:14px;color:#1F2937;font-weight:500;">' + item.name + '</span><span style="font-size:13px;color:#22C55E;font-weight:600;">' + item.price.toLocaleString('hu-HU') + ' Ft</span>';
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

        function handleAddressInput(val) {
            const suggList = document.getElementById('emp-address-suggestions');
            if (!val || val.trim().length < 2) {
                suggList.style.display = 'none';
                return;
            }
            const term = val.trim().toLowerCase();
            const matches = MOCK_ADDRESSES.filter(a => a.toLowerCase().includes(term));
            if (matches.length === 0) {
                suggList.style.display = 'none';
                return;
            }
            suggList.innerHTML = matches.map(m => `
                <div style="padding:12px 16px; border-bottom:1px solid #F1F1F1; font-size:14px; color:#080C1E; cursor:pointer; display:flex; align-items:center; gap:8px;" onclick="selectAddress('${m}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${m.replace(new RegExp(term, 'gi'), match => `<b>${match}</b>`)}
                </div>
            `).join('');
            suggList.style.display = 'block';
        }

        function selectAddress(address, lat = null, lon = null) {
            confirmedAddress = address;
            confirmedLat = lat;
            confirmedLon = lon;
            document.getElementById('emp-loc-search-state').style.display = 'none';
            document.getElementById('emp-loc-locked-state').style.display = 'flex';
            document.getElementById('emp-confirmed-address').innerText = address;
            document.getElementById('emp-city').value = address.split(',')[1]?.trim() || 'Kaposvár';
            document.getElementById('emp-street').value = address.split(',')[0]?.trim() || address;
            const err = document.getElementById('err-loc');
            if (err) err.classList.remove('show');
        }

        function resetAddressSearch() {
            confirmedAddress = null;
            document.getElementById('emp-loc-locked-state').style.display = 'none';
            document.getElementById('emp-loc-search-state').style.display = 'block';
            document.getElementById('emp-address-input').value = '';
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
            btn.style.color = '#6B7280';
            
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
                statusEl.innerText = job.status;
                statusEl.className = 'emp-ad-pill ' + (job.status === 'Aktív' ? 'active' : job.status === 'Befejezett' ? 'completed' : 'seeking');
            }

            // Fill details card values
            document.getElementById('ad-detail-address').innerText = job.location;
            document.getElementById('ad-detail-datetime').innerText = job.datetime;
            document.getElementById('ad-detail-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('ad-detail-desc').innerText = job.details;

            // Fill applicants list card values
            const appContainer = document.getElementById('ad-detail-applicants-container');
            if (appContainer) {
                if (job.status === 'Keresés' && gameState.applied && gameState.jobTitle === job.title) {
                    const workerName = currentUser ? currentUser.name : "Diák";
                    let imgHtml = `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" alt="Avatar">`;
                    if (window.avatarCache && window.avatarCache[workerName]) {
                        const photoURL = window.avatarCache[workerName];
                        if (photoURL.startsWith('http') || photoURL.startsWith('data:')) {
                            imgHtml = `<img src="${photoURL}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" alt="Avatar">`;
                        } else {
                            imgHtml = `<div style="width:36px; height:36px; border-radius:50%; background:${getAvatarColor(workerName)}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; border:1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">${photoURL}</div>`;
                        }
                    }
                    appContainer.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: #F9FAFB; padding: 12px; border-radius: 16px; border: 1px solid #F1F1F1;">
                            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="openWorkerProfile('${workerName}')">
                                ${imgHtml}
                                <div>
                                    <div style="font-size: 14px; font-weight: 600; color: #080C1E; display: flex; align-items: center; gap: 4px;">
                                        ${workerName}
                                        <svg style="width: 13px; height: 13px; fill: #007aff;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                    </div>
                                    <div style="font-size: 11px; color: #6B7280; display: flex; align-items: center; gap: 4px; margin-top: 1px;">
                                        <span>★ 4.9</span>
                                        <span style="background: #EFF6FF; color: #1D4ED8; padding: 1px 6px; border-radius: 10px; font-weight: 600; font-size: 9px;">Megbízható</span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="openEmployerChatRoomFromAd()" style="background: var(--color-navy); color: #fff; border: none; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: transform 0.1s ease;">Chat megnyitása</button>
                        </div>
                    `;
                } else if (job.status === 'Aktív') {
                    const workerName = currentUser ? currentUser.name : "Diák";
                    let imgHtml = `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" alt="Avatar">`;
                    if (window.avatarCache && window.avatarCache[workerName]) {
                        const photoURL = window.avatarCache[workerName];
                        if (photoURL.startsWith('http') || photoURL.startsWith('data:')) {
                            imgHtml = `<img src="${photoURL}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" alt="Avatar">`;
                        } else {
                            imgHtml = `<div style="width:36px; height:36px; border-radius:50%; background:${getAvatarColor(workerName)}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; border:1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">${photoURL}</div>`;
                        }
                    }
                    appContainer.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: #F0FDF4; padding: 12px; border-radius: 16px; border: 1px solid #DCFCE7;">
                            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="openWorkerProfile('${workerName}')">
                                ${imgHtml}
                                <div>
                                    <div style="font-size: 14px; font-weight: 600; color: #080C1E; display: flex; align-items: center; gap: 4px;">
                                        ${workerName}
                                        <svg style="width: 13px; height: 13px; fill: #007aff;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                    </div>
                                    <div style="font-size: 11px; color: #166534; font-weight: 600; margin-top: 1px; display:flex; align-items:center; gap:4px;">
                                        <span>★ 4.9</span>
                                        <span>· Kiválasztott munkás</span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="openEmployerChatRoomFromAd()" style="background: var(--color-navy); color: #fff; border: none; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer;">Csevegés</button>
                        </div>
                    `;
                } else {
                    appContainer.innerHTML = `<div style="text-align: center; color: #9CA3AF; padding: 12px 0; font-size: 13px; font-style: italic;">Még senki nem jelentkezett</div>`;
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

        async function deleteEmployerAdFromDetail() {
            if (confirm('Biztosan törölni szeretnéd ezt a hirdetést?')) {
                const index = localEmployerJobs.findIndex(j => j.id === currentEmployerDetailJobId);
                if (index !== -1) {
                    const deletedJobTitle = localEmployerJobs[index].title;
                    localEmployerJobs.splice(index, 1);
                    saveEmployerJobs();
                    renderEmployerHome();
                    
                    // MENTÉS FIRESTORE-BA: Törlés
                    if (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAPI && window.firebaseDb) {
                        try {
                            const jobRef = window.firebaseAPI.doc(window.firebaseDb, "jobs", currentEmployerDetailJobId);
                            await window.firebaseAPI.deleteDoc(jobRef);
                            
                            // Audit read-back
                            const checkSnap = await window.firebaseAPI.getDoc(jobRef);
                            if (!checkSnap.exists()) {
                                console.log("Job successfully deleted from Firestore:", currentEmployerDetailJobId);
                            } else {
                                console.error("CRITICAL ERROR: Job still exists after delete!", currentEmployerDetailJobId);
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
                closeEmployerAdDetailNew();
                showGreenBanner('Hirdetés sikeresen törölve.');
            }
        }

        function openEmployerChatRoomFromAd() {
            closeEmployerAdDetailNew();
            // Open the chat with ${currentUser ? currentUser.name : "Diák"}
            setTimeout(() => {
                openEmployerChatRoom();
            }, 300);
        }

        // JS to populate and open details screen from chat pinned bar
        function openAdDetailFromChat() {
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
                    // Töröljük a korábbi beépített dummy beszélgetéseket a nevük és ID-juk alapján is, így 100% kikerülnek a gyorsítótárból
                    localChats = JSON.parse(saved).filter(c => 
                        c.name !== 'Tóth János' && 
                        c.name !== 'Nagy Péter' && 
                        c.name !== 'Kovács Edit' && 
                        c.name !== 'Kovács Edit (Megbízó)' && 
                        c.id !== 'chat_toth_janos' && 
                        c.id !== 'chat_nagy_peter' && 
                        c.id !== 'chat_kovacs_edit'
                    );
                    localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                } else {
                    localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                }
            } catch(e) {
                console.warn('[Chats] localStorage error:', e);
            }
            renderSkeletonChats('messages-chat-list', 3);
            setTimeout(() => {
                renderChatList();
            }, 300);
        }

        function saveLocalChats() {
            try {
                localStorage.setItem('melogo_local_chats', JSON.stringify(localChats));
                if (window.saveToCloud) window.saveToCloud('chats', localChats);
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
                    <div class="shimmer" style="display:flex; align-items:center; padding:16px 20px; border-bottom:1px solid #F1F1F1; background:#fff; gap:14px;">
                        <div style="width:48px; height: 52px; border-radius:50%; background:#E5E7EB; flex-shrink:0;"></div>
                        <div style="flex:1;">
                            <div style="width:40%; height:16px; background:#E5E7EB; border-radius:6px; margin-bottom:8px;"></div>
                            <div style="width:70%; height:14px; background:#F3F4F6; border-radius:6px;"></div>
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

            let filtered = localChats.filter(c => !c.archived && c.active);
            if (currentMsgFilter === 'unread') {
                filtered = filtered.filter(c => c.isUnread);
            }

            if (filtered.length === 0) {
                list.innerHTML = `
                    <div id="messages-empty-state" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 32px;text-align:center; flex:1;">
                        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <div style="font-size:16px;font-weight:500;color:var(--color-navy);margin-bottom:8px;">Még nincs üzeneted</div>
                        <div style="font-size:13px;color:#6B7280;line-height:1.6; max-width: 240px; margin: 0 auto;">Jelentkezz egy munkára és automatikusan megnyílik a chat a megbízóval.</div>
                    </div>
                `;
                return;
            }

            filtered.forEach(chat => {
                const initials = getInitials(chat.name);
                const avatarBg = getAvatarGradient(chat.name);
                const isUnreadClass = chat.isUnread ? 'unread' : '';
                
                const item = document.createElement('div');
                item.className = `chat-item-wrapper ${isUnreadClass}`;
                item.id = `item_${chat.id}`;
                item.setAttribute('data-id', chat.id);
                
                item.innerHTML = `
                    <!-- Delete Swipe Button -->
                    <div class="chat-item-delete-btn" onclick="event.stopPropagation(); deleteChatDirect('${chat.id}')">
                        Törlés
                    </div>
                    
                    <!-- Main Content -->
                    <div class="chat-item-content" 
                         onclick="openChatRoom('${chat.id}')"
                         ontouchstart="handleChatTouchStart(event, '${chat.id}')"
                         ontouchmove="handleChatTouchMove(event, '${chat.id}')"
                         ontouchend="handleChatTouchEnd(event, '${chat.id}')"
                         onmousedown="handleChatMouseDown(event, '${chat.id}')"
                         onmouseup="handleChatMouseUp(event)"
                         onmouseleave="handleChatMouseUp(event)">
                        
                        <div class="chat-item-avatar-container" ${currentRole === 'employer' ? `onclick="event.stopPropagation(); openWorkerProfile('${chat.name}')" style="cursor:pointer;"` : ''}>
                            <div class="chat-item-avatar" style="background:${avatarBg};">${initials}</div>
                            ${chat.isOnline ? '<div class="chat-item-online"></div>' : ''}
                        </div>
                        
                        <div class="chat-item-middle">
                            <div class="chat-item-first-line">
                                <span class="chat-item-name">${chat.name}</span>
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
        function handleChatTouchStart(e, chatId) {
            isSwiping = false;
            const touch = e.touches[0];
            swipeStartX = touch.clientX;
            selectedChatId = chatId;
            
            // Close any other open swipe items
            if (activeSwipeWrapper && activeSwipeWrapper !== e.currentTarget.parentElement) {
                resetSwipeTransform(activeSwipeWrapper);
            }
            
            // Long press timer
            longPressTimer = setTimeout(() => {
                openMsgActionSheet(chatId);
            }, 600);
        }

        function handleChatTouchMove(e, chatId) {
            if (longPressTimer) clearTimeout(longPressTimer);
            const touch = e.touches[0];
            swipeCurrentX = touch.clientX;
            const diffX = swipeStartX - swipeCurrentX;
            
            if (diffX > 15) { // Left swipe detected
                isSwiping = true;
                const wrapper = e.currentTarget;
                // Limit translate to -80px (delete button width)
                const translateX = Math.min(diffX, 80);
                wrapper.style.transform = `translateX(-${translateX}px)`;
                wrapper.style.transition = 'none';
            } else if (diffX < -15) { // Right swipe (closing)
                const wrapper = e.currentTarget;
                wrapper.style.transform = `translateX(0px)`;
                wrapper.style.transition = 'none';
            }
        }

        function handleChatTouchEnd(e, chatId) {
            if (longPressTimer) clearTimeout(longPressTimer);
            const wrapper = e.currentTarget;
            const diffX = swipeStartX - swipeCurrentX;
            
            wrapper.style.transition = 'transform 0.2s ease';
            if (isSwiping && diffX > 40) {
                wrapper.style.transform = `translateX(-80px)`;
                activeSwipeWrapper = wrapper.parentElement;
            } else {
                wrapper.style.transform = `translateX(0px)`;
                activeSwipeWrapper = null;
            }
        }

        function handleChatMouseDown(e, chatId) {
            selectedChatId = chatId;
            longPressTimer = setTimeout(() => {
                openMsgActionSheet(chatId);
            }, 600);
        }

        function handleChatMouseUp(e) {
            if (longPressTimer) clearTimeout(longPressTimer);
        }

        function resetSwipeTransform(el) {
            const content = el.querySelector('.chat-item-content');
            if (content) {
                content.style.transition = 'transform 0.2s ease';
                content.style.transform = 'translateX(0px)';
            }
            activeSwipeWrapper = null;
        }

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
            // Close any swipe wrapper
            if (activeSwipeWrapper) {
                resetSwipeTransform(activeSwipeWrapper);
                return;
            }
            
            const index = localChats.findIndex(c => c.id === chatId);
            if (index !== -1) {
                // Set as read
                localChats[index].isUnread = false;
                localChats[index].unreadCount = 0;
                saveLocalChats();
                renderChatList();
                
                const chat = localChats[index];
                openChat(chat.name, chat.jobTitle, chat.lastMsg, chat.time, false, chat.id);
            }
        }

        // ===================================================================
        // NEW: WORKER ACCEPT, COMPLETE & RATING LIFE CYCLE IN CHAT
        // ===================================================================
        function updateChatActionBar(jobTitle) {
            const bar = document.getElementById('chat-action-bar');
            if (!bar) return;

            // Find ${currentUser ? currentUser.name : "Diák"}'s application for this jobTitle
            const app = localWorkerApplications.find(a => a.title === jobTitle);
            if (!app) {
                bar.style.display = 'none';
                return;
            }

            const isEmployer = (currentRole === 'employer');

            if (app.status === 'Függőben' && isEmployer) {
                // Case A: Employer's view, job is Pending (Függőben)
                bar.style.display = 'flex';
                bar.style.backgroundColor = '#EFF6FF';
                bar.style.borderTop = '1px solid #DBEAFE';
                bar.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; color: #1E40AF; flex: 1;">
                        <span style="font-size: 16px;">📩</span>
                        <div style="font-size: 12px; font-weight: 600; line-height: 1.3;">
                            ${currentUser ? currentUser.name : "Diák"} jelentkezett a munkára.
                        </div>
                    </div>
                    <button class="btn" style="height: 32px; font-size: 11px; padding: 0 14px; border-radius: 8px; background-color: #1D4ED8; color: #fff; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(29, 78, 216, 0.2);" onclick="employerAcceptWorker('${jobTitle}', event)">
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
                        <div style="font-size: 12px; font-weight: 600; line-height: 1.3;">
                            A munka aktív! Végeztél a feladattal?
                        </div>
                    </div>
                    <button class="btn" style="height: 32px; font-size: 11px; padding: 0 14px; border-radius: 8px; background-color: #16A34A; color: #fff; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.2);" onclick="workerFinishJob('${jobTitle}')">
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
                    <div style="font-size: 12px; font-weight: 700; color: #92400E; text-align: center;">
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

        function employerAcceptWorker(jobTitle, event) {
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
                bubble.style.cssText = 'background: #F8F9FB; border: 1px solid #D1D5DB; color: #080C1E; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
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
        }

        function workerFinishJob(jobTitle) {
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
                bubble.style.cssText = 'background: #F8F9FB; border: 1px solid #D1D5DB; color: #080C1E; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
                bubble.innerText = '${currentUser ? currentUser.name : "Diák"} befejezte a munkát. Várakozás a jóváhagyásra és értékelésre.';
                msgContainer.appendChild(bubble);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }

            showGreenBanner('Jelentés elküldve! A munkáltató értesítést kapott.');

            // 4. Update UI
            updateChatActionBar(jobTitle);
            renderWorkerApplications();
            renderEmployerHome();
            updateAllUserUI();
        }

        function employerRateWorkerFromChat(jobTitle, stars) {
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

            gameState.status = 'Kifizetve';

            // 3. Append system message in the chat
            const msgContainer = document.getElementById('chat-detail-messages');
            if (msgContainer) {
                const bubble = document.createElement('div');
                bubble.style.cssText = 'background: #F8F9FB; border: 1px solid #D1D5DB; color: #080C1E; padding: 10px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-align: center; margin: 10px auto; max-width: 90%; width: 100%; box-sizing: border-box;';
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
        var localEmployerJobs = [
            {
                id: 'job_demo_1',
                title: 'Kert szépítése és fűnyírás',
                location: 'Kaposvár, Béke tér 12.',
                datetime: 'Holnap, 10:00',
                price: 14000,
                category: 'Kert',
                status: 'Keresés', // Keresés, Aktív, Befejezett
            }
        ];

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
                if (window.saveToCloud) window.saveToCloud('jobs', localEmployerJobs);
            } catch(e) {
                console.warn('[Employer] failed to save:', e);
            }
        }
        
        function saveWorkerApplications() {
            try {
                localStorage.setItem('melogo_worker_applications', JSON.stringify(localWorkerApplications));
                if (window.saveToCloud) window.saveToCloud('applications', localWorkerApplications);
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
                    <div class="emp-ad-card shimmer" style="border: 1px solid #F1F1F1; background: #fff;">
                        <div class="emp-ad-icon-circle" style="background:#E5E7EB; border:none;"></div>
                        <div class="emp-ad-middle">
                            <div style="width:60%; height:14px; background:#E5E7EB; border-radius:4px; margin-bottom:6px;"></div>
                            <div style="width:40%; height:10px; background:#F3F4F6; border-radius:4px;"></div>
                        </div>
                        <div class="emp-ad-right">
                            <div style="width:48px; height:20px; background:#E5E7EB; border-radius: 16px;"></div>
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

            const currentUserEmail = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : '';
            const myJobs = localEmployerJobs.filter(j => !j.ownerEmail || j.ownerEmail === currentUserEmail);

            // Calculate dynamic status counts for dashboard
            let countSeeking = 0;
            let countApplicants = 0;
            let countActive = 0;
            let countCompleted = 0;

            myJobs.forEach(job => {
                if (job.status === 'Befejezett') {
                    countCompleted++;
                } else if (job.status === 'Aktív') {
                    countActive++;
                } else if (job.status === 'Keresés') {
                    if (job.title === gameState.jobTitle && gameState.applied) {
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
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="1.5" style="margin-bottom:8px;">
                            <path d="M12 22v-4M17 22v-4M7 22v-4M2 18h20V4H2v14z"/>
                        </svg>
                        <h3 style="font-size: 13px; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">Még nincs aktív hirdetésed</h3>
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
                } else if (job.status === 'Aktív') {
                    statusClass = 'active';
                    statusText = 'Folyamatban';
                    cardClass = 'status-active';
                } else if (job.status === 'Keresés') {
                    if (job.title === gameState.jobTitle && gameState.applied) {
                        statusClass = 'applicants';
                        statusText = '1 jelentkező';
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
                    <div class="emp-ad-card ${cardClass}" onclick="clickEmployerAdCard('${job.id}')">
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

            if (!confirmedAddress) {
                valid = false;
                const err = document.getElementById('err-loc');
                if (err) { err.innerText = 'Kérjük válassz egy valós címet a listából.'; err.classList.add('show'); }
                const inp = document.getElementById('emp-address-input');
                if (inp) { inp.style.borderBottom = '2px solid #EF4444'; setTimeout(() => inp.style.borderBottom = '', 2000); }
            }

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
                        showPushNotification('Hirdetés módosítva!', 'A változtatások sikeresen elmentve!', '#22C55E');
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
                    createdAt: Date.now(),
                    urgent: document.getElementById('emp-urgent-toggle') ? document.getElementById('emp-urgent-toggle').checked : false,
                    toolsRequired: activeToolsRequired,
                    lat: confirmedLat || 46.3667,
                    lon: confirmedLon || 17.7833
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
                        showPushNotification('Hirdetés közzétéve!', 'A munkások már látják a munkádat!', '#22C55E');
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
                btn.style.background = '#22C55E';
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
            const parts = name.trim().split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        }

        function calcTrustLevel(jobCount, rating) {
            if (jobCount >= 15 && rating >= 4.7) return { level: 4, name: 'Prémium', bg: '#EEF2FF', color: '#080C1E' };
            if (jobCount >= 8 && rating >= 4.3) return { level: 3, name: 'Tapasztalt', bg: '#FFFBEB', color: '#B45309' };
            if (jobCount >= 3 && rating >= 4.0) return { level: 2, name: 'Megbízható', bg: '#EFF6FF', color: '#1D4ED8' };
            return { level: 1, name: 'Kezdő', bg: '#F3F4F6', color: '#6B7280' };
        }

        function renderTrustBadge(trust, size) {
            const sz = size === 'sm' ? 'font-size:11px;padding:3px 8px;' : 'font-size:12px;padding:4px 10px;';
            return '<span style="' + sz + 'background:' + trust.bg + ';color:' + trust.color + ';border-radius: 16px;font-weight:600;display:inline-block;">' + trust.name + '</span>';
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

            // Update bio and skills displays on profile screen
            const bioDisplay = document.getElementById('profile-bio-display');
            if (bioDisplay) {
                bioDisplay.textContent = user.bio ? '\u201c' + user.bio + '\u201d' : '"Nincs bemutatkozás megadva."';
            }
            
            const skillsDisplay = document.getElementById('profile-skills-display');
            if (skillsDisplay && user.skills) {
                skillsDisplay.innerHTML = user.skills.map(s => `
                    <span class="profile-skill-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M3 12h1M20 12h1M12 3v1M12 20v1"/></svg>
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
                '#080C1E',
                '#7c3aed',
                '#059669',
                '#b45309',
                '#1d4ed8'
            ];
            let h = 0;
            for (let i = 0; i < (name||'').length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFF;
            return colors[h % colors.length];
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
                    star.style.fill = '#080C1E';
                    star.style.color = '#080C1E';
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
                banner.style.cssText = 'position:fixed;top:-80px;left:50%;transform:translateX(-50%);background:rgba(8,12,30,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:14px 24px;border-radius:100px;font-weight:600;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:9999;transition:top 0.4s cubic-bezier(0.175,0.885,0.32,1.275);white-space:nowrap;display:flex;align-items:center;gap:8px;';
                document.body.appendChild(banner);
            }
            banner.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${text}</span>`;
            banner.style.top = '60px';
            setTimeout(() => { banner.style.top = '-60px'; }, 3000);
        }

        // ==========================================
        // DARK MODE
        // ==========================================
        function applyDarkMode(enabled) {
            const root = document.documentElement;
            if (enabled) {
                root.style.setProperty('--color-bg', '#1A1A2E');
                root.style.setProperty('--color-surface', '#16213E');
                root.style.setProperty('--color-card', '#1E2A45');
                root.style.setProperty('--color-border', '#2A2A4A');
                root.style.setProperty('--color-text-dark', '#FFFFFF');
                root.style.setProperty('--color-text', '#E5E7EB');
                root.style.setProperty('--color-text-muted', '#9CA3AF');
                document.body.style.background = '#1A1A2E';
                document.body.style.color = '#FFFFFF';
            } else {
                root.style.setProperty('--color-bg', '#F8F9FB');
                root.style.setProperty('--color-surface', '#FFFFFF');
                root.style.setProperty('--color-card', '#FFFFFF');
                root.style.setProperty('--color-border', '#F1F1F1');
                root.style.setProperty('--color-text-dark', '#080C1E');
                root.style.setProperty('--color-text', '#18181B');
                root.style.setProperty('--color-text-muted', '#6B7280');
                document.body.style.background = '';
                document.body.style.color = '';
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
                        <circle cx="75" cy="25" r="15" stroke="#E5E7EB"/>
                        <line x1="70" y1="20" x2="80" y2="30" opacity="0.4"/>
                        <line x1="80" y1="20" x2="70" y2="30" opacity="0.4"/>
                    </svg>
                    <div style="font-size:17px;font-weight:700;color:#374151;margin-bottom:8px;">Nincs közeli munka</div>
                    <div style="font-size:14px;color:#9CA3AF;line-height:1.6;margin-bottom:24px;">Próbálj nagyobb hatókört beállítani,<br>vagy nézz vissza hamarosan.</div>
                    <button onclick="openRadiusSlider()" style="background:#22C55E;color:#fff;border:none;padding:12px 24px;border-radius: 16px;font-weight:600;font-size:14px;cursor:pointer;">Hatókör növelése</button>
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
                    <div style="font-size:17px;font-weight:700;color:#374151;margin-bottom:8px;">Még csend van itt</div>
                    <div style="font-size:14px;color:#9CA3AF;line-height:1.6;">Jelentkezz egy munkára és automatikusan<br>megnyílik a chat.</div>
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
            const filledStr = '<span style="color:#080C1E;">★</span>'.repeat(num);
            const emptyStr = '<span style="color:#9CA3AF;">★</span>'.repeat(5 - num);
            return filledStr + emptyStr;
        }

        function renderProfileReviews() {
            const container = document.getElementById('profile-reviews-section');
            if (!container) return;
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const reviews = userData.reviews || [];
            if (reviews.length === 0) {
                container.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;padding:32px;text-align:center;"><svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D1D5DB\" stroke-width=\"1.5\" style=\"margin-bottom:12px;\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg><div style=\"font-size:15px;font-weight:600;color:#374151;margin-bottom:6px;\">Még nincs véleményed</div><div style=\"font-size:13px;color:#9CA3AF;\">Végezz el munkákat hogy értékeléseket kapj.</div></div>';
                return;
            }
            const last5 = reviews.slice(0, 5);
            container.innerHTML = last5.map(function(r) {
                return '<div style="background:#fff;border:1px solid #F1F1F1;border-radius: 16px;padding:14px 16px;margin-bottom:10px;">' +
                    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
                    '<div style="width:36px;height:36px;border-radius:50%;background-color:#080C1E;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;">' + (r.initials || '?') + '</div>' +
                    '<div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#080C1E;">' + r.name + '</div><div style="font-size:11px;color:#9CA3AF;">' + r.date + '</div></div>' +
                    '<div style="color:#FBBF24;font-size:14px;">' + starsHtml(r.stars) + '</div>' +
                    '</div>' +
                    (r.text ? '<div style="font-size:13px;color:#374151;line-height:1.5;">' + r.text + '</div>' : '') +
                    (r.job ? '<div style="font-size:11px;color:#9CA3AF;margin-top:6px;font-style:italic;">' + r.job + '</div>' : '') +
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
                    list.innerHTML = '<div style="text-align:center;padding:40px;color:#9CA3AF;">Még nincs egyetlen véleményed sem.</div>';
                } else {
                    list.innerHTML = reviews.map(function(r) {
                        return '<div style="background:#fff;border:1px solid #F1F1F1;border-radius: 16px;padding:14px 16px;margin-bottom:10px;">' +
                            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
                            '<div style="width:36px;height:36px;border-radius:50%;background-color:#080C1E;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;">' + (r.initials || '?') + '</div>' +
                            '<div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#080C1E;">' + r.name + '</div><div style="font-size:11px;color:#9CA3AF;">' + r.date + '</div></div>' +
                            '<div style="color:#FBBF24;font-size:14px;">' + starsHtml(r.stars) + '</div>' +
                            '</div>' +
                            (r.text ? '<div style="font-size:13px;color:#374151;line-height:1.5;">' + r.text + '</div>' : '') +
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
                track.style.background = '#22C55E';
                thumb.style.transform = 'translateX(20px)';
            }
            if (toggle) {
                toggle.addEventListener('change', function() {
                    const t = document.getElementById('dark-toggle-track');
                    const th = document.getElementById('dark-toggle-thumb');
                    if (this.checked) {
                        if (t) t.style.background = '#22C55E';
                        if (th) th.style.transform = 'translateX(20px)';
                    } else {
                        if (t) t.style.background = '#E5E7EB';
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
                
                // Migrációs szép részlet: ha a játék állapota szerint már jelentkeztünk, de a lista üres,
                // generáljunk egy visszamenőleges bejegyzést, hogy a korábbi tesztelésed megmaradjon!
                if (localWorkerApplications.length === 0 && typeof gameState !== 'undefined' && gameState.applied) {
                    localWorkerApplications.push({
                        id: 'app_demo_init',
                        title: gameState.jobTitle || 'Fűnyírás',
                        price: gameState.jobPrice || 12000,
                        status: gameState.status === 'Fizetve' ? 'Aktív' : gameState.status === 'Kifizetve' ? 'Kifizetve' : 'Függőben',
                        date: '2026. máj. 28.'
                    });
                    saveWorkerApplications();
                }
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
                    <div style="background: white; border-radius: 16px; border: 1px solid #F1F1F1; padding: 20px; text-align: center; box-sizing: border-box;">
                        <div style="font-size: 24px; margin-bottom: 8px;">💼</div>
                        <div style="font-size: 13px; font-weight: 600; color: #080C1E;">Nincs még aktív jelentkezésed</div>
                        <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px; line-height: 1.3;">Keress egy neked tetsző munkát a Főlapon, és jelentkezz rá!</div>
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
                    <div style="background: white; border-radius: 16px; border: 1px solid #F1F1F1; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; gap: 8px;">
                        <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1;">
                            <span style="font-size: 14px; font-weight: 700; color: #080C1E; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${app.title}</span>
                            <span style="font-size: 11px; color: #9CA3AF;">${app.date} · <span style="font-weight: 600; color: #22C55E;">${app.price.toLocaleString('hu-HU')} Ft</span></span>
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
                    { title: '📅 Időpont közeleg', msg: 'A munkaidő közeledik. Kérlek, érkezz pontosan a megbeszélt időpontra!', time: 'Most', color: '#080C1E', isNew: true },
                    { title: '📩 Jelentkezés elküldve', msg: 'Sikeresen jelentkeztél a(z) ' + (gameState.jobTitle || 'Fűnyírás') + ' feladatra.', time: '10 perce', color: '#080C1E', isNew: false },
                    { title: '💰 Stripe Kifizetés', msg: '47 500 Ft kifizetése sikeresen elindítva a bankszámládra.', time: 'Tegnap', color: '#22C55E', isNew: false },
                    { title: '⭐ Megbízható státusz', msg: 'Gratulálunk! Profilod elnyerte a Megbízható Diák jelvényt a kiváló visszajelzések alapján.', time: 'máj. 22.', color: '#16a34a', isNew: false },
                    { title: '🎉 Üdv a MeloGo-ban!', msg: 'Fiókod sikeresen aktiválva. Kezdj el böngészni a diákmunkák között!', time: 'máj. 20.', color: '#080C1E', isNew: false }
                ];
                
                // If not applied yet, remove the active application alert
                if (!gameState.applied) {
                    notifications.splice(0, 2);
                }

                list.innerHTML = notifications.map(function(n) {
                    return `
                        <div style="background: white; border-radius: 16px; border: 1px solid #F1F1F1; padding: 14px 16px; margin-bottom: 10px; position: relative; box-sizing: border-box;">
                            ${n.isNew ? '<div style="position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background-color: #EF4444; border-radius: 50%;"></div>' : ''}
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <div style="width: 8px; height: 8px; background: ${n.color}; border-radius: 50%;"></div>
                                <span style="font-weight: 700; color: #080C1E; font-size: 13px;">${n.title}</span>
                                <span style="font-size: 10px; color: #9CA3AF; margin-left: auto;">${n.time}</span>
                            </div>
                            <div style="font-size: 12px; color: #6B7280; line-height: 1.4;">${n.msg}</div>
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
                        <div style="background: #F8F9FB; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #F1F1F1; box-sizing: border-box;">
                            <div style="min-width: 0; flex: 1;">
                                <div style="font-size: 13px; font-weight: 700; color: #080C1E; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.title}</div>
                                <div style="font-size: 10px; color: #9CA3AF; margin-top: 2px;">${e.date}</div>
                            </div>
                            <div style="text-align: right; flex-shrink: 0; margin-left: 8px;">
                                <div style="font-size: 13px; font-weight: 700; color: #22C55E;">+${e.amount}</div>
                                <span style="font-size: 9px; color: #22C55E; background: #F0FDF4; padding: 2px 6px; border-radius: 8px; font-weight: 600; display: inline-block; margin-top: 2px;">${e.status}</span>
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
        window.renderWorkerHome = renderWorkerHome;

        