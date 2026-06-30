const fs = require('fs');

// 1. Fix capacitor.config.json
const capFile = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/capacitor.config.json';
let capConfig = JSON.parse(fs.readFileSync(capFile, 'utf8'));
if (capConfig.plugins && capConfig.plugins.SplashScreen) {
    capConfig.plugins.SplashScreen.androidScaleType = "CENTER_INSIDE";
    capConfig.plugins.SplashScreen.backgroundColor = "#000000";
}
fs.writeFileSync(capFile, JSON.stringify(capConfig, null, 2));

// 2. Fix index.html CSS
const indexFile = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let html = fs.readFileSync(indexFile, 'utf8');

// Fix Search Bar
html = html.replace(
    /\.search-bar\s*\{\s*background-color:\s*rgba\(255,255,255,0\.05\);\s*border:\s*1px\s*solid\s*rgba\(255,255,255,0\.15\);\s*border-radius:\s*20px;\s*height:\s*48px;\s*gap:\s*12px;\s*box-sizing:\s*border-box;\s*\}/,
    `.search-bar {
            background-color: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 20px;
            height: 48px;
            gap: 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 0 16px;
        }`
);

// Fix Bottom Nav (Restore previous full width style)
html = html.replace(
    /\.bottom-nav\s*\{\s*position:\s*absolute;\s*bottom:\s*max\(36px,\s*env\(safe-area-inset-bottom\)\);\s*left:\s*50%;\s*transform:\s*translateX\(-50%\);\s*width:\s*calc\(100%\s*-\s*24px\);\s*max-width:\s*100%;\s*background:\s*rgba\(0,\s*0,\s*0,\s*0\.8\);\s*backdrop-filter:\s*blur\(20px\);\s*-webkit-backdrop-filter:\s*blur\(20px\);\s*border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.12\);\s*border-radius:\s*20px;/,
    `.bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #000000;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: env(safe-area-inset-bottom);
            border-radius: 0;`
);

// Fix Header Logo (Add color: #fff to Melo)
// Replace Melo<span style="color:var(--color-green);">Go</span> with <span style="color:#fff;">Melo</span><span style="color:var(--color-green);">Go</span>
// But only inside the header contexts where it might be dark mode. We can just replace it globally.
html = html.replace(/Melo<span style="color:var\(--color-green\);">Go<\/span>/g, '<span style="color:#fff;">Melo</span><span style="color:var(--color-green);">Go</span>');
html = html.replace(/Melo<span style="color:var\(--color-green\)">Go<\/span>/g, '<span style="color:#fff;">Melo</span><span style="color:var(--color-green);">Go</span>');

// Fix Google Auth fallback to redirect issue
// Find window.firebaseAPI.signInWithPopup(window.firebaseAuth, provider)
// Add browserPopupRedirectResolver
html = html.replace(
    /await window\.firebaseAPI\.signInWithPopup\(window\.firebaseAuth, provider\);/g,
    `await window.firebaseAPI.signInWithPopup(window.firebaseAuth, provider, window.firebaseAPI.browserPopupRedirectResolver);`
);

// Add browserPopupRedirectResolver to exports
html = html.replace(
    /import \{ getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, OAuthProvider, signInWithPopup, sendPasswordResetEmail \} from "https:\/\/www\.gstatic\.com\/firebasejs\/10\.12\.2\/firebase-auth\.js";/,
    `import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, OAuthProvider, signInWithPopup, sendPasswordResetEmail, browserPopupRedirectResolver } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";`
);

html = html.replace(
    /signInWithPopup,/g,
    `signInWithPopup,
            browserPopupRedirectResolver,`
);


fs.writeFileSync(indexFile, html);
console.log("Fixes applied successfully.");
