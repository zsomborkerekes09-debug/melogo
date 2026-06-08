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

    // 1. Email registration save address fix
    const searchEmailReg = `                    if (regConfirmedAddress) {
                        userDataToSave.address = regConfirmedAddress;
                    }`;
    const replaceEmailReg = `                    if (regConfirmedAddress) {
                        userDataToSave.address = regConfirmedAddress;
                    } else if (typeof address !== 'undefined' && address) {
                        userDataToSave.address = address;
                    }`;
    replaceExact(searchEmailReg, replaceEmailReg, 'Fix email auth address save');
    
    const searchEmailReg2 = `                        address: (regConfirmedAddress) ? regConfirmedAddress : ''`;
    const replaceEmailReg2 = `                        address: (regConfirmedAddress) ? regConfirmedAddress : (typeof address !== 'undefined' ? address : '')`;
    replaceExact(searchEmailReg2, replaceEmailReg2, 'Fix email auth local storage address');

    // 2. Fix the logos: Change ONLY the 'Go' part to use var(--color-green) or #c0fc2a where appropriate
    
    // Splash screen: currently has <span style="color:#ffffff;">Go</span>
    const searchSplash = `Melo<span style="color:#ffffff;">Go</span>`;
    const replaceSplash = `Melo<span style="color:var(--color-green);">Go</span>`;
    replaceExact(searchSplash, replaceSplash, 'Splash logo color');

    // Login screen: currently has <span style="color:#000000;">Go</span>
    const searchLogin = `Melo<span style="color:#000000;">Go</span>`;
    const replaceLogin = `Melo<span style="color:var(--color-green);">Go</span>`;
    replaceExact(searchLogin, replaceLogin, 'Login screen logo color');

    // Employer screen: currently has Melo<span style="color:#000000">Go</span>
    const searchEmp = `Melo<span style="color:#000000">Go</span>`;
    const replaceEmp = `Melo<span style="color:var(--color-green);">Go</span>`;
    replaceExact(searchEmp, replaceEmp, 'Employer dashboard logo color');
    
    // Worker Dashboard has <div class="brand-logo">Melo<span>Go</span></div> -> the CSS brand-logo should handle it.
    // CSS .brand-logo span { color: var(--color-green-go); } was replaced by var(--color-green) in fix_phase3.js, so it's already neon green!

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('[SUCCESS] All address and logo text fixes written to frontend/index.html');
    }
}
applyFixes();
