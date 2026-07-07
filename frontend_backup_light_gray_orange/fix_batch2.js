const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// BUG-08: Forgot Password UI
html = html.replace(/(<div class="floating-group" style="margin-bottom:16px;">[\s\S]*?<input type="password" id="login-pw".*?>[\s\S]*?)<\/div>/, `$1\n            <div style="text-align: right; margin-top: 8px;"><a href="#" onclick="forgotPassword(); return false;" style="font-size: 13px; color: var(--color-primary); text-decoration: none; font-weight: 500;">Elfelejtetted a jelszavad?</a></div>\n        </div>`);

const forgotPwFunc = `
        async function forgotPassword() {
            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value : '';
            if (!email || !email.includes('@')) {
                highlightInputError('login-email', 'A jelszó visszaállításához add meg az email címedet!');
                showLoginError('A jelszó visszaállításához add meg az email címedet!');
                return;
            }
            if (window.firebaseAuth) {
                try {
                    await window.firebaseAPI.sendPasswordResetEmail(window.firebaseAuth, email);
                    alert('Jelszó-visszaállítási link elküldve a(z) ' + email + ' címre!');
                } catch(e) {
                    console.error(e);
                    showLoginError('Hiba történt a levél küldésekor. Ellenőrizd a címet!');
                }
            } else {
                alert('Firebase nincs inicializálva!');
            }
        }
`;
if (!html.includes('function forgotPassword')) {
    html = html.replace('<script>', '<script>\n' + forgotPwFunc);
}

// BUG-03: Account Deletion
// Add delete button near logout in both settings overlays
html = html.replace(/(<button.*?onclick="logoutWorker\(\)".*?>Kijelentkez.*?<\/button>)/, `$1\n                        <button style="width:100%; min-height:52px; border-radius:14px; border:none; background:#7F1D1D; color:#fff; font-size:15px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; margin-top: 8px;" onclick="deleteAccount()">Fiók végleges törlése</button>`);
html = html.replace(/(<button.*?onclick="logoutEmployer\(\)".*?>Kijelentkez.*?<\/button>)/, `$1\n                        <button style="width:100%; min-height:52px; border-radius:14px; border:none; background:#7F1D1D; color:#fff; font-size:15px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; margin-top: 8px;" onclick="deleteAccount()">Fiók végleges törlése</button>`);
// Note: We'll inject the logic next.
const delAccFunc = `
        async function deleteAccount() {
            if(confirm("Biztosan véglegesen törölni szeretnéd a fiókodat? Ez a művelet nem visszavonható!")) {
                if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                    try {
                        await window.firebaseAuth.currentUser.delete();
                        alert("Fiók sikeresen törölve.");
                        logoutApp();
                        window.location.reload();
                    } catch(e) {
                        console.error(e);
                        if (e.code === 'auth/requires-recent-login') {
                            alert("A fiók törléséhez kérjük jelentkezz be újra frissen!");
                            logoutApp();
                        } else {
                            alert("Hiba a fiók törlésekor.");
                        }
                    }
                }
            }
        }
`;
if (!html.includes('function deleteAccount')) {
    html = html.replace('<script>', '<script>\n' + delAccFunc);
}

// BUG-15: Hardcoded Kaposvár Coordinates
// Change the fallback coordinates in the map functionality
html = html.replace(/lat: 46\.3593,\s*lon: 17\.7967/g, 'lat: 47.4979, lon: 19.0402');

// BUG-10: NaN Crashes in price validation
html = html.replace(/const price = parseInt\(\(document\.getElementById\('emp-price-input'\) \|\| \{\}\)\.value\);/g, `
        const rawPrice = (document.getElementById('emp-price-input') || {}).value;
        const price = parseInt(rawPrice);
        if (isNaN(price) || price < 0) {
            alert('Kérjük adj meg egy érvényes összeget!');
            return;
        }`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Batch 2 done');
