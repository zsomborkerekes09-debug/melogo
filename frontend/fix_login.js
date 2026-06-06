const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ============================================================
// COMPLETE LOGIN SCREEN REWRITE
// ============================================================

// 1. Find and replace the entire login screen content
const oldLoginScreen = `    <div class="login-logo">Melo<span>Go</span></div>
    <div class="login-subtitle">Vállalj munkát a közeledben.</div>
    
    <div class="role-cards">
        <div class="role-card active" id="role-card-worker" onclick="selectLoginRole('worker')">
            <div class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <div class="role-card-title">Munkás</div>
        </div>
        <div class="role-card" id="role-card-employer" onclick="selectLoginRole('employer')">
            <div class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <div class="role-card-title">Megbízó</div>
        </div>
    </div>

    <input type="text" id="app-name" class="login-input" placeholder="Teljes neved (pl. Kovács Bence)" style="margin-bottom:12px;">
    <div style="position:relative;">
        <input type="email" id="app-email" class="login-input" placeholder="Email cím (pl. bence@gmail.com)" value="" style="padding-left:44px;">
        <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
    </div>

    <input type="password" id="app-pw" class="login-input" placeholder="Válassz egy jelszót amit nem felejtesz el." value="123456">
    
    <div style="text-align: right; margin-bottom: 40px;">
        <span style="color: var(--color-navy); font-size: 13px; font-weight: 500;">Elfelejtett jelszó?</span>
    </div>

    <button class="login-btn" onclick="loginApp()">Regisztrálok & Bejelentkezem</button>
    <button class="face-id-btn" onclick="loginAppFaceID()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3a2 2 0 0 0-2 2v4"></path><path d="M19 3a2 2 0 0 1 2 2v4"></path><path d="M5 21a2 2 0 0 1-2-2v-4"></path><path d="M19 21a2 2 0 0 0 2-2v-4"></path><path d="M9 9l.01 0"></path><path d="M15 9l.01 0"></path><path d="M12 15a3 3 0 0 0 3-3"></path></svg>
        Bejelentkezés Face ID-val
    </button>
    
    <div style="text-align: center; color: var(--color-text-light); font-size: 14px;">
        Már van fiókod? <span style="color: var(--color-navy); font-weight: 600;">Lépj be</span>
    </div>
</div>`;

const newLoginScreen = `    <!-- Logo -->
    <div class="login-logo">Melo<span>Go</span></div>
    <div class="login-subtitle" id="login-mode-subtitle">Hozd létre a fiókodat</div>

    <!-- Role cards -->
    <div class="role-cards" id="login-role-cards">
        <div class="role-card active" id="role-card-worker" onclick="selectLoginRole('worker')">
            <div class="check-icon" id="check-worker">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <div class="role-card-title">Munkás</div>
        </div>
        <div class="role-card" id="role-card-employer" onclick="selectLoginRole('employer')">
            <div class="check-icon" id="check-employer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <div class="role-card-title">Megbízó</div>
        </div>
    </div>

    <!-- Error message -->
    <div id="login-err" style="display:none;color:#EF4444;font-size:13px;text-align:center;margin:0 0 12px;padding:10px 16px;background:#FEF2F2;border-radius:10px;border:1px solid #FECACA;"></div>

    <!-- REGISTER fields (shown by default) -->
    <div id="register-fields">
        <input type="text" id="app-name" class="login-input" placeholder="Teljes neved (pl. Kovács Bence)" autocomplete="name">
        <div style="position:relative;margin-bottom:0;">
            <input type="email" id="app-email" class="login-input" placeholder="Email cím (pl. bence@gmail.com)" style="padding-left:44px;" autocomplete="email">
            <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
        </div>
        <div style="position:relative;margin-bottom:0;">
            <input type="password" id="app-pw" class="login-input" placeholder="Jelszó (min. 6 karakter)" style="padding-left:44px;" autocomplete="new-password">
            <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div style="position:relative;margin-bottom:0;">
            <input type="password" id="app-pw2" class="login-input" placeholder="Jelszó megerősítése" style="padding-left:44px;" autocomplete="new-password">
            <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
    </div>

    <!-- LOGIN fields (hidden by default) -->
    <div id="login-fields" style="display:none;">
        <div style="position:relative;margin-bottom:0;">
            <input type="email" id="login-email" class="login-input" placeholder="Email cím" style="padding-left:44px;" autocomplete="email">
            <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
        </div>
        <div style="position:relative;margin-bottom:0;">
            <input type="password" id="login-pw" class="login-input" placeholder="Jelszó" style="padding-left:44px;" autocomplete="current-password">
            <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div style="text-align:right;margin:8px 0 20px;">
            <span style="color:var(--color-navy);font-size:13px;font-weight:500;cursor:pointer;" onclick="alert('Jelszó emlékeztetőt elküldtük a megadott email címre!')">Elfelejtett jelszó?</span>
        </div>
    </div>

    <!-- Main action button -->
    <button class="login-btn" id="main-auth-btn" onclick="loginApp()" style="margin-top:20px;">Regisztrálok & Bejelentkezem</button>

    <!-- Face ID button -->
    <button class="face-id-btn" onclick="loginAppFaceID()" style="display:flex;align-items:center;justify-content:center;gap:10px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3a2 2 0 0 0-2 2v4"/><path d="M19 3a2 2 0 0 1 2 2v4"/><path d="M5 21a2 2 0 0 1-2-2v-4"/><path d="M19 21a2 2 0 0 0 2-2v-4"/><path d="M9 9l.01 0"/><path d="M15 9l.01 0"/><path d="M12 15a3 3 0 0 0 3-3"/></svg>
        Gyors bejelentkezés Face ID-val
    </button>

    <!-- Toggle register/login -->
    <div id="auth-toggle-row" style="text-align:center;margin-top:20px;padding-bottom:40px;">
        <span style="color:#6B7280;font-size:14px;">Már van fiókod? </span>
        <button onclick="switchToLogin()" id="toggle-to-login" style="background:none;border:none;color:#0A0F2E;font-size:14px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;">Lépj be</button>
        <button onclick="switchToRegister()" id="toggle-to-register" style="display:none;background:none;border:none;color:#0A0F2E;font-size:14px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;">Regisztrálj</button>
    </div>
</div>`;

html = html.replace(oldLoginScreen, newLoginScreen);

// ============================================================
// 2. Rewrite all auth functions
// ============================================================
const oldLoginApp = `        function loginApp() {
            const name = (document.getElementById('app-name') ? document.getElementById('app-name').value.trim() : '') || 'Felhasználó';
            const email = document.getElementById('app-email').value;
            const role = loginSelectedRole || 'worker';
            if (!name || name.length < 2) { showLoginError('Kérlek add meg a neved!'); return; }
            if (!email || !email.includes('@')) { showLoginError('Kérlek adj meg egy érvényes email címet!'); return; }
            const session = { email, name, role, loginAt: Date.now() };
            localStorage.setItem('melogo_worker_session', JSON.stringify({...session, role:'worker'}));
            localStorage.setItem('melogo_employer_session', JSON.stringify({...session, role:'employer'}));
            localStorage.setItem('melogo_active_role', role);
            localStorage.setItem('melogo_app_session', 'true');
            const screen = document.getElementById('app-login-screen');
            if (screen) { screen.style.transition='opacity 0.3s'; screen.style.opacity='0'; setTimeout(()=>{screen.classList.add('hidden');screen.style.opacity='';},300); }
            updateAllUserUI();
            updateGreetings();
            return; // skip old login logic below`;

const newLoginApp = `        let isLoginMode = false;

        function switchToLogin() {
            isLoginMode = true;
            document.getElementById('register-fields').style.display = 'none';
            document.getElementById('login-fields').style.display = 'block';
            document.getElementById('login-role-cards').style.display = 'none';
            document.getElementById('login-mode-subtitle').innerText = 'Üdv vissza!';
            document.getElementById('main-auth-btn').innerText = 'Bejelentkezem';
            document.getElementById('toggle-to-login').style.display = 'none';
            document.getElementById('toggle-to-register').style.display = 'inline';
            var toggleRow = document.getElementById('auth-toggle-row');
            if (toggleRow) { toggleRow.innerHTML = '<span style="color:#6B7280;font-size:14px;">Még nincs fiókod? </span><button onclick="switchToRegister()" style="background:none;border:none;color:#0A0F2E;font-size:14px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;">Regisztrálj</button>'; }
            clearLoginError();
        }

        function switchToRegister() {
            isLoginMode = false;
            document.getElementById('register-fields').style.display = 'block';
            document.getElementById('login-fields').style.display = 'none';
            document.getElementById('login-role-cards').style.display = 'flex';
            document.getElementById('login-mode-subtitle').innerText = 'Hozd létre a fiókodat';
            document.getElementById('main-auth-btn').innerText = 'Regisztrálok & Bejelentkezem';
            var toggleRow = document.getElementById('auth-toggle-row');
            if (toggleRow) { toggleRow.innerHTML = '<span style="color:#6B7280;font-size:14px;">Már van fiókod? </span><button onclick="switchToLogin()" style="background:none;border:none;color:#0A0F2E;font-size:14px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;">Lépj be</button>'; }
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

        function loginApp() {
            clearLoginError();
            var role = loginSelectedRole || 'worker';
            
            if (isLoginMode) {
                // LOGIN flow
                var email = (document.getElementById('login-email') || {}).value || '';
                var pw = (document.getElementById('login-pw') || {}).value || '';
                if (!email || !email.includes('@')) { showLoginError('Kérlek adj meg érvényes email címet!'); return; }
                if (!pw) { showLoginError('Add meg a jelszavad!'); return; }
                // Simulate: retrieve saved name
                var savedSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
                var name = savedSession.name || email.split('@')[0];
                doEnterApp(name, email, role);
            } else {
                // REGISTER flow
                var name = ((document.getElementById('app-name') || {}).value || '').trim();
                var email = ((document.getElementById('app-email') || {}).value || '').trim();
                var pw = ((document.getElementById('app-pw') || {}).value || '');
                var pw2 = ((document.getElementById('app-pw2') || {}).value || '');
                if (!name || name.length < 2) { showLoginError('Kérlek add meg a teljes neved!'); return; }
                if (!email || !email.includes('@')) { showLoginError('Kérlek adj meg érvényes email címet!'); return; }
                if (!pw || pw.length < 6) { showLoginError('A jelszónak legalább 6 karakternek kell lennie!'); return; }
                if (pw !== pw2) { showLoginError('A két jelszó nem egyezik meg!'); return; }
                doEnterApp(name, email, role);
            }
            return; // skip old login logic below`;

html = html.replace(oldLoginApp, newLoginApp);

// Fix loginAppFaceID to use doEnterApp
html = html.replace(
    `        function loginAppFaceID() {
            const session = { email: 'demo@melogo.hu', name: 'Demo Felhasználó', role: loginSelectedRole || 'worker', loginAt: Date.now(), faceId: true };
            localStorage.setItem('melogo_worker_session', JSON.stringify({...session, role:'worker'}));
            localStorage.setItem('melogo_employer_session', JSON.stringify({...session, role:'employer'}));
            localStorage.setItem('melogo_app_session', 'true');
            localStorage.setItem('melogo_active_role', session.role);
            const screen = document.getElementById('app-login-screen');
            if (screen) { screen.style.transition='opacity 0.3s'; screen.style.opacity='0'; setTimeout(()=>{screen.classList.add('hidden');screen.style.opacity='';},300); }
            updateAllUserUI();
            updateGreetings();
            return;`,
    `        function loginAppFaceID() {
            var savedSession = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}');
            var name = savedSession.name || 'Demo Felhasználó';
            var email = savedSession.email || 'demo@melogo.hu';
            doEnterApp(name, email, loginSelectedRole || 'worker');
            return;`
);

// Also remove old showLoginError if it still exists as a duplicate
// Keep only our new version (it's already defined in loginApp replacement)

fs.writeFileSync('index.html', html, 'utf8');
console.log('Login screen rewrite applied');
