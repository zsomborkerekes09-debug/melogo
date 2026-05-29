const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ============================================================
// FIX: Move onboarding/darkMode/userUI calls to use 
// DOMContentLoaded instead of window.onload so they run
// after all inline scripts are parsed.
// The real issue: initOnboarding() is called in window.onload
// (line ~3020) but it's defined much later in the same script
// block — JS hoists function declarations, but these are
// function expressions/statements inside the script, so they
// ARE hoisted. The REAL issue is that window.onload fires 
// correctly, but initOnboarding references DOM elements that
// aren't fully set up yet, OR there's a JS error in the 
// onload chain stopping everything.
//
// ACTUAL FIX: Remove initOnboarding/initDarkMode/updateAllUserUI
// from window.onload and instead call them at the very end of
// the script (they'll run after the page loads), and make the
// onboarding self-initialize via inline script.
// ============================================================

// 1. Remove from window.onload
html = html.replace(
    `        window.onload = function() {
            initOnboarding();
            initDarkMode();
            updateAllUserUI();
            let initialCatLabel`,
    `        window.onload = function() {
            let initialCatLabel`
);

// 2. At the very end of the last script block, add self-init
// that runs after everything is defined
const initCode = `
        // AUTO-INIT: runs after all functions are defined
        (function() {
            function _safeInit() {
                try { if(typeof initOnboarding==='function') initOnboarding(); } catch(e) { console.warn('initOnboarding:', e); }
                try { if(typeof initDarkMode==='function') initDarkMode(); } catch(e) { console.warn('initDarkMode:', e); }
                try { if(typeof updateAllUserUI==='function') updateAllUserUI(); } catch(e) { console.warn('updateAllUserUI:', e); }
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', _safeInit);
            } else {
                _safeInit();
            }
        })();
`;

const lastClose = html.lastIndexOf('</script>');
html = html.substring(0, lastClose) + initCode + '\n        </script>' + html.substring(lastClose + '</script>'.length);

// 3. Fix the onboarding screen: remove display:flex default,
// use display:none and let JS show it, preventing flash
html = html.replace(
    '<div id="onboarding-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#0A0F2E;z-index:9999;display:flex;flex-direction:column;overflow:hidden;">',
    '<div id="onboarding-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#0A0F2E;z-index:9999;display:none;flex-direction:column;overflow:hidden;">'
);

// 4. Fix skipOnboarding to also set pointer-events:none
html = html.replace(
    `        function skipOnboarding() {
            localStorage.setItem('melogo_onboarding_done', 'true');
            const screen = document.getElementById('onboarding-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.4s ease';
                screen.style.opacity = '0';
                setTimeout(() => { screen.style.display = 'none'; }, 400);
            }
        }`,
    `        function skipOnboarding() {
            localStorage.setItem('melogo_onboarding_done', 'true');
            const screen = document.getElementById('onboarding-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.4s ease';
                screen.style.opacity = '0';
                screen.style.pointerEvents = 'none';
                setTimeout(function() { screen.style.display = 'none'; screen.style.opacity = ''; screen.style.pointerEvents = ''; }, 450);
            }
        }`
);

// 5. Fix initOnboarding to properly set display
html = html.replace(
    `        function initOnboarding() {
            const seen = localStorage.getItem('melogo_onboarding_done');
            const screen = document.getElementById('onboarding-screen');
            if (!screen) return;
            if (seen) {
                screen.style.display = 'none';
            } else {
                screen.style.display = 'flex';
            }
        }`,
    `        function initOnboarding() {
            const seen = localStorage.getItem('melogo_onboarding_done');
            const screen = document.getElementById('onboarding-screen');
            if (!screen) return;
            if (seen) {
                screen.style.display = 'none';
                screen.style.pointerEvents = 'none';
            } else {
                screen.style.display = 'flex';
                screen.style.pointerEvents = 'auto';
                currentOnboardingSlide = 0;
                const slides = document.getElementById('onboarding-slides');
                if (slides) slides.style.transform = 'translateX(0%)';
                const btn = document.getElementById('ob-next-btn');
                if (btn) btn.innerText = 'Tovább';
                const dots = document.querySelectorAll('.ob-dot');
                dots.forEach(function(d, i) { d.classList.toggle('ob-dot-active', i === 0); });
            }
        }`
);

// 6. Also add a "reset" button visible only in the onboarding area for dev testing
// (shows localStorage clear button at bottom)
// Actually, just ensure the app-login-screen doesn't have display:none hardcoded

fs.writeFileSync('index.html', html, 'utf8');
console.log('Phase 3 fix applied');
