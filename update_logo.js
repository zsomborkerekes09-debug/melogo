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

    // Splash screen
    const searchSplash = `    <div style="font-size:44px;font-weight:700;color:#fff;font-family:'DM Sans',sans-serif;letter-spacing:-1.5px;animation: pulse 2s infinite;">Melo<span style="color:#ffffff;">Go</span></div>`;
    const replaceSplash = `    <div style="animation: pulse 2s infinite; display: flex; align-items: center; justify-content: center;"><img src="assets/logo_new.jpg" alt="MeloGo" style="height: 64px; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);"></div>`;
    replaceExact(searchSplash, replaceSplash, 'Splash screen logo');

    // Login screen
    const searchLogin = `<div style="font-size:36px; font-weight:800; font-family:'DM Sans',sans-serif; letter-spacing:-1.5px; color:#0A0F2E; width:160px; text-align:center; user-select:none;">Melo<span style="color:#000000;">Go</span></div>`;
    const replaceLogin = `<div style="width:100%; text-align:center; display:flex; justify-content:center; align-items:center;"><img src="assets/logo_new.jpg" alt="MeloGo" style="height: 52px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"></div>`;
    replaceExact(searchLogin, replaceLogin, 'Login screen logo');

    // Dashboard (worker)
    const searchWorkerDashboard = `<div class="brand-logo">Melo<span>Go</span></div>`;
    const replaceWorkerDashboard = `<div class="brand-logo" style="display:flex; align-items:center;"><img src="assets/logo_new.jpg" alt="MeloGo" style="height: 28px; border-radius: 6px;"></div>`;
    replaceExact(searchWorkerDashboard, replaceWorkerDashboard, 'Worker dashboard logo');

    // Dashboard (employer)
    const searchEmployerDashboard = `<div class="emp-welcome-title" style="text-align: center; width: 100%;">Melo<span style="color:#000000">Go</span></div>`;
    const replaceEmployerDashboard = `<div class="emp-welcome-title" style="text-align: center; width: 100%; display:flex; justify-content:center; align-items:center;"><img src="assets/logo_new.jpg" alt="MeloGo" style="height: 40px; border-radius: 8px;"></div>`;
    replaceExact(searchEmployerDashboard, replaceEmployerDashboard, 'Employer dashboard logo');

    // Profile screen
    const searchProfile = `<div class="brand-logo" style="font-size: 24px; font-weight: 700; color: #fff; margin: 0;  text-align: left; width: 100%;">Melo<span style="color:var(--color-green)">Go</span></div>`;
    const replaceProfile = `<div class="brand-logo" style="margin: 0; text-align: left; width: 100%; display:flex; align-items:center;"><img src="assets/logo_new.jpg" alt="MeloGo" style="height: 32px; border-radius: 8px;"></div>`;
    replaceExact(searchProfile, replaceProfile, 'Profile screen logo');

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('[SUCCESS] Logo replaced globally.');
    } else {
        console.log('[INFO] No changes were made.');
    }
}

applyFixes();
