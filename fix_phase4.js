const fs = require('fs');

function applyFixes() {
    const filePath = 'frontend/index.html';
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Helper
    const replaceExact = (search, replacement, desc) => {
        if (content.includes(search)) {
            content = content.replace(search, replacement);
            console.log(`[SUCCESS] Applied fix: ${desc}`);
            modified = true;
        } else if (content.includes(search.replace(/\n/g, '\r\n'))) {
            content = content.replace(search.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
            console.log(`[SUCCESS] Applied fix: ${desc} (CRLF matched)`);
            modified = true;
        } else {
            console.warn(`[WARNING] Could not find string for: ${desc}`);
        }
    };

    // 1. Fix missing closing braces on onAuthStateChanged
    const searchAuthSyntax = `                let role = localStorage.getItem('melogo_active_role') || 'worker';
                if (typeof switchRole === 'function') switchRole(role);
        window.setupFirestoreListeners = function(role) {`;
    const replaceAuthSyntax = `                let role = localStorage.getItem('melogo_active_role') || 'worker';
                if (typeof switchRole === 'function') switchRole(role);
            }
        });
        window.setupFirestoreListeners = function(role) {`;
    replaceExact(searchAuthSyntax, replaceAuthSyntax, 'Fix onAuthStateChanged syntax error');

    // 2. Update HTML registration form to use 4 address fields
    const searchOldAddressHTML = `            <div class="floating-group" style="margin:0;">
                <div class="auth-input-container">
                    <input type="text" id="reg-address" class="auth-input-field login-input" placeholder="Lakcím (Irányítószám, Város, Utca, Házszám)">
                </div>
            </div>`;
    const replaceNewAddressHTML = `            <div style="display:flex; gap:12px; margin:0;">
                <div class="floating-group" style="margin:0; flex:1;">
                    <div class="auth-input-container">
                        <input type="text" id="reg-zip" class="auth-input-field login-input" placeholder="Irányítószám">
                    </div>
                </div>
                <div class="floating-group" style="margin:0; flex:2;">
                    <div class="auth-input-container">
                        <input type="text" id="reg-city" class="auth-input-field login-input" placeholder="Város">
                    </div>
                </div>
            </div>
            <div class="floating-group" style="margin:0;">
                <div class="auth-input-container">
                    <input type="text" id="reg-street" class="auth-input-field login-input" placeholder="Utca, házszám">
                </div>
            </div>
            <div class="floating-group" style="margin:0;">
                <div class="auth-input-container">
                    <input type="text" id="reg-county" class="auth-input-field login-input" placeholder="Megye">
                </div>
            </div>`;
    replaceExact(searchOldAddressHTML, replaceNewAddressHTML, 'Update address HTML inputs');

    // 3. Update JavaScript registration logic to read the 4 fields and concatenate them
    const searchAddressJS = `                var pwInput = document.getElementById('app-pw');
                var pw2Input = document.getElementById('app-pw2');
                var addressInput = document.getElementById('reg-address');
                
                var name = ((nameInput || {}).value || '').trim();
                var email = ((emailInput || {}).value || '').trim();
                var pw = ((pwInput || {}).value || '');
                var pw2 = ((pw2Input || {}).value || '');
                var address = ((addressInput || {}).value || '').trim() || 'Kaposvár';`;
    const replaceAddressJS = `                var pwInput = document.getElementById('app-pw');
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
                if(county && address !== 'Kaposvár') address += ' (' + county + ')';`;
    replaceExact(searchAddressJS, replaceAddressJS, 'Read and concatenate 4 address fields');

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('[SUCCESS] All fixes for phase 4 written to frontend/index.html');
    }
}
applyFixes();
