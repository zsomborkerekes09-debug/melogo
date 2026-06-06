const fs = require('fs');

let top = fs.readFileSync('rebuilt_top.html', 'utf8');
let bottom = fs.readFileSync('index.html', 'utf8');

// Add Role Switcher CSS to top
const roleSwitcherCss = `
        /* Role Switcher styles */
        .role-switcher-container {
            background-color: var(--color-bg);
            border-radius: 20px;
            padding: 4px;
            display: flex;
            width: 100%;
            margin: 0 auto;
        }
        .role-btn {
            flex: 1;
            padding: 6px 12px;
            border-radius: 16px;
            border: none;
            background: transparent;
            color: var(--color-text-light);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .role-btn.active {
            background-color: #fff;
            color: var(--color-navy);
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
`;
top = top.replace('/* Common utilities */', roleSwitcherCss + '\\n        /* Common utilities */');

// Fix display: none on app-profile-screen in bottom
bottom = bottom.replace('id="app-profile-screen" style="background-color: #F8F9FB; overflow-y: auto; display: none;"', 'id="app-profile-screen" style="background-color: #F8F9FB; overflow-y: auto;"');

// Ensure bottom doesn't have duplicate <!-- SCREEN 3: PROFIL -->
if (!bottom.trim().startsWith('<!-- SCREEN 3: PROFIL -->') && bottom.indexOf('<!-- SCREEN 3: PROFIL -->') > 100) {
    bottom = '\\n                    <!-- SCREEN 3: PROFIL -->' + bottom.substring(bottom.indexOf('<div class="screen" id="app-profile-screen"'));
}

let fullHtml = top + '\\n' + bottom;

// Also, the slider needs to close the screens-container and phone-app divs!
// Let's check if bottom contains closing divs for phone-app and screens-container.
// Actually, the original bottom had all the overlays, and then </body></html>.
// Where did screens-container and slider end?
// In the original, after SCREEN 3: PROFIL, there were the overlays.
// And BEFORE the overlays, the screens-container and slider were CLOSED!
// So in 'bottom', I need to check if the slider is closed.
// Let's just output the fullHtml and we'll check it.

fs.writeFileSync('index.html', fullHtml, 'utf8');
console.log('Fixed index.html created!');
