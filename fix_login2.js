const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================
// STEP 1: Remove the OLD dead code inside loginApp
// =========================================================
html = html.replace(
`            return; // skip old login logic below

            const email = document.getElementById('app-email').value;
            const pw = document.getElementById('app-pw').value;
            if (email && pw) {
                document.getElementById('app-login-screen').classList.add('hidden');
                localStorage.setItem('melogo_app_session', 'true');
                switchRole(loginSelectedRole);
            } else {
                alert('Kérlek add meg az emailt és jelszót!');
            }
        }`,
`        }`
);

// =========================================================
// STEP 2: Remove dead code inside loginAppFaceID
// =========================================================
html = html.replace(
`            return;

            document.getElementById('app-login-screen').classList.add('hidden');
            localStorage.setItem('melogo_app_session', 'true');
            switchRole(loginSelectedRole);
        }`,
`        }`
);

// =========================================================
// STEP 3: Remove the OLD duplicate showLoginError (the one
// that tries to createElement and uses querySelector)
// =========================================================
html = html.replace(
`        function showLoginError(msg) {
            let err = document.getElementById('login-err');
            if (!err) { err = document.createElement('div'); err.id='login-err'; err.style.cssText='color:#EF4444;font-size:13px;text-align:center;margin:-16px 0 16px;'; document.getElementById('app-login-screen').insertBefore(err, document.querySelector('.login-btn')); }
            err.innerText = msg;
        }

        let isLoginMode = false;`,
`        let isLoginMode = false;`
);

// =========================================================
// STEP 4: Fix the login screen bottom area to look like
// two proper cards (matching the role cards above)
// =========================================================
html = html.replace(
`    <!-- Toggle register/login -->
    <div id="auth-toggle-row" style="text-align:center;margin-top:20px;padding-bottom:40px;">
        <span style="color:#6B7280;font-size:14px;">Már van fiókod? </span>
        <button onclick="switchToLogin()" id="toggle-to-login" style="background:none;border:none;color:#0A0F2E;font-size:14px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;">Lépj be</button>
        <button onclick="switchToRegister()" id="toggle-to-register" style="display:none;background:none;border:none;color:#0A0F2E;font-size:14px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;">Regisztrálj</button>
    </div>`,
`    <!-- Toggle register/login — styled like role cards -->
    <div id="auth-toggle-row" style="margin-top:20px;padding-bottom:40px;display:flex;gap:12px;">
        <div id="auth-card-register" onclick="switchToRegister()" style="flex:1;border:2px solid #22C55E;border-radius:16px;padding:16px 12px;text-align:center;cursor:pointer;background:#F0FDF4;transition:all 0.2s;">
            <div style="font-size:18px;margin-bottom:4px;">✏️</div>
            <div style="font-size:13px;font-weight:700;color:#0A0F2E;">Regisztráció</div>
            <div style="font-size:11px;color:#6B7280;margin-top:2px;">Új fiók</div>
        </div>
        <div id="auth-card-login" onclick="switchToLogin()" style="flex:1;border:2px solid #E5E7EB;border-radius:16px;padding:16px 12px;text-align:center;cursor:pointer;background:#fff;transition:all 0.2s;">
            <div style="font-size:18px;margin-bottom:4px;">🔑</div>
            <div style="font-size:13px;font-weight:700;color:#0A0F2E;">Belépés</div>
            <div style="font-size:11px;color:#6B7280;margin-top:2px;">Van már fiókom</div>
        </div>
    </div>`
);

// =========================================================
// STEP 5: Update switchToLogin / switchToRegister to use new cards
// =========================================================
html = html.replace(
`        function switchToLogin() {
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
        }`,
`        function switchToLogin() {
            isLoginMode = true;
            var rf = document.getElementById('register-fields');
            var lf = document.getElementById('login-fields');
            var rc = document.getElementById('login-role-cards');
            var sub = document.getElementById('login-mode-subtitle');
            var btn = document.getElementById('main-auth-btn');
            var cReg = document.getElementById('auth-card-register');
            var cLog = document.getElementById('auth-card-login');
            if (rf) rf.style.display = 'none';
            if (lf) lf.style.display = 'block';
            if (rc) rc.style.display = 'none';
            if (sub) sub.innerText = 'Üdv vissza!';
            if (btn) btn.innerText = 'Bejelentkezem';
            if (cReg) { cReg.style.borderColor = '#E5E7EB'; cReg.style.background = '#fff'; }
            if (cLog) { cLog.style.borderColor = '#22C55E'; cLog.style.background = '#F0FDF4'; }
            clearLoginError();
        }

        function switchToRegister() {
            isLoginMode = false;
            var rf = document.getElementById('register-fields');
            var lf = document.getElementById('login-fields');
            var rc = document.getElementById('login-role-cards');
            var sub = document.getElementById('login-mode-subtitle');
            var btn = document.getElementById('main-auth-btn');
            var cReg = document.getElementById('auth-card-register');
            var cLog = document.getElementById('auth-card-login');
            if (rf) rf.style.display = 'block';
            if (lf) lf.style.display = 'none';
            if (rc) rc.style.display = 'flex';
            if (sub) sub.innerText = 'Hozd létre a fiókodat';
            if (btn) btn.innerText = 'Regisztrálok & Bejelentkezem';
            if (cReg) { cReg.style.borderColor = '#22C55E'; cReg.style.background = '#F0FDF4'; }
            if (cLog) { cLog.style.borderColor = '#E5E7EB'; cLog.style.background = '#fff'; }
            clearLoginError();
        }`
);

// =========================================================
// STEP 6: Verify no syntax issues — remove pre-filled pw
// =========================================================
html = html.replace(
    'placeholder="Válassz egy jelszót amit nem felejtesz el." value="123456"',
    'placeholder="Válassz egy jelszót amit nem felejtesz el."'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Login screen surgical fix done');
