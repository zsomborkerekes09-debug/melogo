const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 5.1 Avatar ring border (from 2px to 3px)
// It was probably `border: 2px solid var(--color-green);`
h = h.replace(/border:\s*2px\s*solid\s*var\(--color-green\)/g, 'border: 3px solid var(--color-green)');

// 5.2 Enlarge settings gear icon and tappable area
h = h.replace(/<button onclick="document.getElementById\('worker-settings'\)\.classList\.add\('open'\)" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; cursor: pointer;">\s*<svg width="20" height="20"[^>]*>.*?<\/svg>\s*<\/button>/g, 
    '<button onclick="document.getElementById(\'worker-settings\').classList.add(\'open\')" style="position: absolute; top: 10px; right: 10px; padding: 10px; background: none; border: none; color: white; cursor: pointer;">\n                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>\n                            </button>');

// 5.3 Section Labels Margins
h = h.replace(/<div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Szerepem<\/div>/g, 
    '<div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">SZEREPEM</div>');
h = h.replace(/<div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Fiókom<\/div>/g, 
    '<div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">FIÓKOM</div>');

// Also check the .settings-group-label in settings overlay
h = h.replace(/\.settings-group-label \{([\s\S]*?)padding:\s*24px 16px 8px 16px;([\s\S]*?)\}/g, '.settings-group-label {$1padding: 24px 16px 8px 16px; margin-top: 20px;$2}');

// 5.4 Role Switcher Active/Inactive States
h = h.replace(/\.role-btn\s*\{\s*flex:\s*1;\s*padding:\s*10px 0;\s*border-radius:\s*12px;\s*border:\s*none;\s*background:\s*none;\s*font-weight:\s*600;\s*font-size:\s*14px;\s*cursor:\s*pointer;\s*transition:\s*all 0.2s;\s*\}/, 
    '.role-btn { flex: 1; padding: 10px 0; border-radius: 12px; border: none; background: transparent; color: #9CA3AF !important; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }\n        .role-btn.active { background: var(--color-navy); color: white !important; }');
h = h.replace(/\.role-btn\.active\s*\{\s*background:\s*#fff;\s*box-shadow:\s*0 2px 8px rgba\(0,0,0,0.05\);\s*\}/, '');

// 5.5 Role description italic
h = h.replace(/<div id="role-description-text" style="font-size: 11px; color: #9CA3AF; text-align: center;">/g, 
    '<div id="role-description-text" style="font-size: 11px; color: #9CA3AF; text-align: center; font-style: italic;">');

// 5.6 Indent settings row dividers & 5.7 Update chevrons
h = h.replace(/\.settings-row\s*\{([\s\S]*?)border-bottom:\s*1px solid #F3F4F6;([\s\S]*?)\}/g, 
    '.settings-row {$1/* border-bottom removed */$2}\n        .settings-row-inner {\n            display: flex; align-items: center; width: 100%; border-bottom: 0.5px solid #E5E7EB;\n            padding-bottom: 14px;\n        }\n        .settings-row:last-child .settings-row-inner { border-bottom: none; }');
// Wait, the HTML structure of .settings-row doesn't have an inner wrapper. 
// A better way in CSS is box-shadow or absolute pseudo-element. Let's use pseudo-element for divider.
const dividerCSS = `
        .settings-row { position: relative; border-bottom: none !important; }
        .settings-row::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 56px; /* Indented */
            right: 0;
            height: 0.5px;
            background: #E5E7EB;
        }
        .settings-row:last-child::after { display: none; }
`;
if (!h.includes('left: 56px; /* Indented */')) {
    h = h.replace('</style>', dividerCSS + '\n    </style>');
}
// Remove existing border-bottom on settings-row
h = h.replace(/border-bottom:\s*1px solid #F3F4F6;/g, '/* removed */');

// 5.7 Chevrons to ti-chevron-right (16px #D1D5DB)
const newChevron = '<svg class="settings-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>';
h = h.replace(/<svg class="settings-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"><\/polyline><\/svg>/g, newChevron);

// 5.8 Tevékenység & 5.9 Támogatás Sections
const tevTamHtml = `
                        <!-- Tevékenység -->
                        <div>
                            <div class="settings-group-label">Tevékenység</div>
                            <div class="settings-card">
                                <div class="settings-row">
                                    <div class="settings-row-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg></div>
                                    <span class="settings-row-label">Letöltött összeg</span>
                                    <span style="font-size: 15px; font-weight: 600; color: #16A34A;">32 000 Ft</span>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-row-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                                    <span class="settings-row-label">Utolsó meló</span>
                                    <span style="font-size: 14px; color: #9CA3AF;">Tegnap</span>
                                </div>
                            </div>
                        </div>

                        <!-- Támogatás -->
                        <div>
                            <div class="settings-group-label">Támogatás</div>
                            <div class="settings-card">
                                <div class="settings-row">
                                    <div class="settings-row-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
                                    <span class="settings-row-label">Súgó</span>
                                    ${newChevron}
                                </div>
                                <div class="settings-row">
                                    <div class="settings-row-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                                    <span class="settings-row-label">Adatvédelem</span>
                                    ${newChevron}
                                </div>
                                <div class="settings-row">
                                    <div class="settings-row-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                                    <span class="settings-row-label">Feltételek</span>
                                    ${newChevron}
                                </div>
                            </div>
                        </div>
`;
// Insert before Fiók
h = h.replace(/<!-- Fiók -->/, tevTamHtml + '\n                        <!-- Fiók -->');

// 5.10 Logout Card Isolation
// Ensure the Fiók group looks like a standalone card with red text, 1px red border.
// Replace the entire Fiók section.
const logoutHTML = `
                        <!-- Fiók -->
                        <div style="margin-top: 32px; padding-bottom: 40px;">
                            <div class="settings-card" style="border: 1px solid #FECACA; background: #fff; margin: 0 16px;">
                                <div class="settings-row" onclick="closeSettings(); openLogoutConfirm();" style="justify-content: center; padding: 16px;">
                                    <span class="settings-row-label" style="color:#DC2626; flex: none; text-align: center;">Kijelentkezés</span>
                                </div>
                            </div>
                        </div>
`;
h = h.replace(/<!-- Fiók -->[\s\S]*?(?=<\/div>\s*<!-- Fixed save button -->)/, logoutHTML + '\n                    ');


fs.writeFileSync('index.html', h, 'utf8');
console.log('Profile script finished.');
