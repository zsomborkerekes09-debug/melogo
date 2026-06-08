const fs = require('fs');

function applyFixes() {
    const filePath = 'frontend/index.html';
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Helper to replace precisely
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

    // 1. UI Overlay Click Block
    const searchOverlayCss = `.action-overlay, .settings-overlay, .overlay-success, .confirm-sheet {
            position: absolute;
            left: 0;
            right: 0;
            margin: 0 auto;
            max-width: 500px;
            width: 100%;
            background-color: #fff;
            z-index: 2000;`;
    const replaceOverlayCss = `.action-overlay, .settings-overlay, .overlay-success, .confirm-sheet {
            position: absolute;
            left: 0;
            right: 0;
            margin: 0 auto;
            max-width: 500px;
            width: 100%;
            background-color: #fff;
            z-index: 2000;
            pointer-events: auto !important;`;
    replaceExact(searchOverlayCss, replaceOverlayCss, 'UI Overlay CSS (Pointer Events)');

    // 2. Branding Logo Consistency
    // Replace all var(--color-green-go) with var(--color-green)
    const oldLength = content.length;
    content = content.replace(/var\(--color-green-go\)/g, 'var(--color-green)');
    if (content.length !== oldLength) {
        console.log('[SUCCESS] Replaced --color-green-go with --color-green globally.');
        modified = true;
    }

    // 3. Chat Messaging Failure
    const searchChatInput = `<input type="text" id="chat-reply-input" placeholder="Írj üzenetet..." onkeydown="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); sendChatMessageNew(); }"`;
    const replaceChatInput = `<input type="text" id="chat-reply-input" placeholder="Írj üzenetet..." oninput="handleChatInput(this)" onkeydown="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); sendChatMessageNew(); }"`;
    replaceExact(searchChatInput, replaceChatInput, 'Chat input oninput handler');

    const searchFirestoreChatUpdate = `                            window.firebaseAPI.updateDoc(chatRef, {
                                messages: chat.messages,
                                lastMsg: chat.lastMsg,
                                time: chat.time
                            });
                        } catch(e) {`;
    const replaceFirestoreChatUpdate = `                            window.firebaseAPI.updateDoc(chatRef, {
                                messages: chat.messages,
                                lastMsg: chat.lastMsg,
                                time: chat.time
                            });
                            saveLocalChats();
                            renderChatList();
                        } catch(e) {`;
    replaceExact(searchFirestoreChatUpdate, replaceFirestoreChatUpdate, 'Sync local chats after Firestore update');

    // 4. Google Auth Loading Message
    const searchGoogleAuth = `        async function loginWithGoogle() {
            if (window.firebaseAuth && window.firebaseAPI && window.firebaseAPI.signInWithPopup) {
                const provider = new window.firebaseAPI.GoogleAuthProvider();`;
    const replaceGoogleAuth = `        async function loginWithGoogle() {
            if (!window.firebaseAPI || !window.firebaseAPI.signInWithPopup) {
                alert("A rendszer és a Google azonosítás még betöltés alatt áll. Kérjük, várj pár másodpercet és próbáld újra.");
                return;
            }
            if (window.firebaseAuth && window.firebaseAPI && window.firebaseAPI.signInWithPopup) {
                const provider = new window.firebaseAPI.GoogleAuthProvider();`;
    replaceExact(searchGoogleAuth, replaceGoogleAuth, 'Google Auth waiting check');

    // 5. Missing Address Input Field in Registration
    const searchRegForm = `            <div class="floating-group" style="margin:0;">
                <div class="auth-input-container">
                    <input type="password" id="app-pw2" class="auth-input-field login-input" placeholder="Jelszó megerősítése" style="padding-right:44px;">
                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('app-pw2', this)">
                        <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
            </div>`;
    const replaceRegForm = `            <div class="floating-group" style="margin:0;">
                <div class="auth-input-container">
                    <input type="password" id="app-pw2" class="auth-input-field login-input" placeholder="Jelszó megerősítése" style="padding-right:44px;">
                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('app-pw2', this)">
                        <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
            </div>
            
            <div class="floating-group" style="margin:0;">
                <div class="auth-input-container">
                    <input type="text" id="reg-address" class="auth-input-field login-input" placeholder="Lakcím (Irányítószám, Város, Utca, Házszám)">
                </div>
            </div>`;
    replaceExact(searchRegForm, replaceRegForm, 'Insert registration address field');

    // Retrieve address value on register
    const searchRegAddressVal = `            var name = document.getElementById('app-name').value.trim();
            var email = document.getElementById('app-email').value.trim();
            var pw1 = document.getElementById('app-pw').value;
            var pw2 = document.getElementById('app-pw2').value;`;
    const replaceRegAddressVal = `            var name = document.getElementById('app-name').value.trim();
            var email = document.getElementById('app-email').value.trim();
            var pw1 = document.getElementById('app-pw').value;
            var pw2 = document.getElementById('app-pw2').value;
            var addressEl = document.getElementById('reg-address');
            var address = addressEl && addressEl.value.trim() ? addressEl.value.trim() : 'Kaposvár';`;
    replaceExact(searchRegAddressVal, replaceRegAddressVal, 'Get address value on register');
    
    // Save address to firestore on register
    const searchFirestoreSaveUser = `                                    firstName: user.displayName ? user.displayName.split(' ')[0] : 'Új',
                                    lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : 'Felhasználó',
                                    role: role,
                                    createdAt: window.firebaseAPI.serverTimestamp(),
                                    bio: '',
                                    skills: [],
                                    location: 'Kaposvár'`;
    const replaceFirestoreSaveUser = `                                    firstName: user.displayName ? user.displayName.split(' ')[0] : 'Új',
                                    lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : 'Felhasználó',
                                    role: role,
                                    createdAt: window.firebaseAPI.serverTimestamp(),
                                    bio: '',
                                    skills: [],
                                    location: (typeof address !== 'undefined') ? address : 'Kaposvár'`;
    replaceExact(searchFirestoreSaveUser, replaceFirestoreSaveUser, 'Save address to firestore (Google auth path)');

    const searchFirestoreEmailReg = `                                await window.firebaseAPI.setDoc(userRef, {
                                    email: email,
                                    firstName: name.split(' ')[0] || name,
                                    lastName: name.split(' ').slice(1).join(' ') || '',
                                    role: role,
                                    createdAt: window.firebaseAPI.serverTimestamp(),
                                    bio: '',
                                    skills: [],
                                    location: 'Kaposvár'
                                });`;
    const replaceFirestoreEmailReg = `                                await window.firebaseAPI.setDoc(userRef, {
                                    email: email,
                                    firstName: name.split(' ')[0] || name,
                                    lastName: name.split(' ').slice(1).join(' ') || '',
                                    role: role,
                                    createdAt: window.firebaseAPI.serverTimestamp(),
                                    bio: '',
                                    skills: [],
                                    location: (typeof address !== 'undefined') ? address : 'Kaposvár'
                                });`;
    replaceExact(searchFirestoreEmailReg, replaceFirestoreEmailReg, 'Save address to firestore (Email Auth path)');


    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('[SUCCESS] All possible fixes written to frontend/index.html');
    } else {
        console.log('[INFO] No changes were made.');
    }
}

applyFixes();
