const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// 1. Inject Firebase error wrapper
const wrapperCode = `
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
`;

content = content.replace("window._fsOnSnapshot = onSnapshot;", "window._fsOnSnapshot = onSnapshot;\n" + wrapperCode);

fs.writeFileSync('index.html', content, 'utf-8');
