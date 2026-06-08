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

    // Retrieve address value on register
    const searchRegAddressVal = `                var pwInput = document.getElementById('app-pw');
                var pw2Input = document.getElementById('app-pw2');
                
                var name = ((nameInput || {}).value || '').trim();
                var email = ((emailInput || {}).value || '').trim();
                var pw = ((pwInput || {}).value || '');
                var pw2 = ((pw2Input || {}).value || '');`;
    const replaceRegAddressVal = `                var pwInput = document.getElementById('app-pw');
                var pw2Input = document.getElementById('app-pw2');
                var addressInput = document.getElementById('reg-address');
                
                var name = ((nameInput || {}).value || '').trim();
                var email = ((emailInput || {}).value || '').trim();
                var pw = ((pwInput || {}).value || '');
                var pw2 = ((pw2Input || {}).value || '');
                var address = ((addressInput || {}).value || '').trim() || 'Kaposvár';`;
    replaceExact(searchRegAddressVal, replaceRegAddressVal, 'Get address value on register');
    
    // Save address to firestore on register (Email auth path)
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
        console.log('[SUCCESS] All address fixes written to frontend/index.html');
    } else {
        console.log('[INFO] No changes were made.');
    }
}

applyFixes();
