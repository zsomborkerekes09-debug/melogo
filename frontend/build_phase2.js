const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ============================================================
// FIX 1: Profile header — dynamic name, avatar, trust badge
// ============================================================
html = html.replace(
    `                                <div style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #22C55E; background-color: #333; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 500; color: white;">
                                    KB
                                </div>`,
    `                                <div id="profile-avatar-circle" class="user-avatar-bg" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #22C55E; background: linear-gradient(135deg, #0A0F2E 0%, #1e3a8a 100%); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: white;">
                                    <span class="user-initials-display">?</span>
                                </div>`
);

html = html.replace(
    `                            <div style="font-size: 18px; font-weight: 500; color: white; margin-bottom: 4px;">Kovács Bence</div>
                            <div style="display:flex; align-items:center; justify-content:center; gap:4px; margin-bottom: 4px;">
                                <span style="color:#f4c542; font-size:13px;">★★★★★</span>
                                <span style="color:white; font-size:13px;">4.9</span>
                            </div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.55); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                Kaposvár • Kaposvári Egyetem
                            </div>`,
    `                            <div style="font-size: 18px; font-weight: 700; color: white; margin-bottom: 4px;" class="user-name-display">Felhasználó</div>
                            <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom: 6px;">
                                <div style="display:flex; align-items:center; gap:4px;">
                                    <span style="color:#f4c542; font-size:13px;">★</span>
                                    <span style="color:white; font-size:13px;" class="user-rating-display">5.0</span>
                                </div>
                                <span class="user-trust-badge"></span>
                            </div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.55); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span class="user-location-display">Magyarország</span>
                            </div>`
);

// ============================================================
// FIX 2: Stats bar — dynamic values
// ============================================================
html = html.replace(
    `                            <div style="flex: 1; text-align: center; border-right: 1px solid #F1F1F1;">
                                <div style="font-size: 20px; font-weight: 600; color: #0A0F2E;">12</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Meló</div>
                            </div>
                            <div style="flex: 1; text-align: center; border-right: 1px solid #F1F1F1;">
                                <div style="font-size: 20px; font-weight: 600; color: #22C55E;">98%</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Hűség</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 20px; font-weight: 600; color: #0A0F2E;">4.9</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Értékelés</div>
                            </div>`,
    `                            <div style="flex: 1; text-align: center; border-right: 1px solid #F1F1F1;">
                                <div style="font-size: 20px; font-weight: 600; color: #0A0F2E;" class="user-job-count">0</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Meló</div>
                            </div>
                            <div style="flex: 1; text-align: center; border-right: 1px solid #F1F1F1;">
                                <div style="font-size: 20px; font-weight: 600; color: #22C55E;" id="profile-loyalty">100%</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Hűség</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 20px; font-weight: 600; color: #0A0F2E;" class="user-rating-display">5.0</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Értékelés</div>
                            </div>`
);

// ============================================================
// FIX 3: Add MEGJELENÉS section + Vélemények section to profile
// ============================================================
const darkModeSection = `
                        <!-- MEGJELENÉS -->
                        <div>
                            <div class="settings-group-label">Megjelenés</div>
                            <div class="settings-card">
                                <div class="settings-row" style="cursor:default;">
                                    <div class="settings-row-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                                    </div>
                                    <span class="settings-row-label">Sötét mód</span>
                                    <label style="position:relative;display:inline-block;width:44px;height:24px;margin-left:auto;">
                                        <input type="checkbox" id="dark-mode-toggle" onchange="toggleDarkMode()" style="opacity:0;width:0;height:0;">
                                        <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#E5E7EB;transition:.3s;border-radius:24px;" id="dark-toggle-track">
                                            <span style="position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:white;transition:.3s;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.2);" id="dark-toggle-thumb"></span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- VÉLEMÉNYEK -->
                        <div>
                            <div class="settings-group-label" style="display:flex;justify-content:space-between;align-items:center;">
                                Vélemények
                                <button onclick="openAllReviews()" style="background:none;border:none;color:#1D4ED8;font-size:12px;font-weight:600;cursor:pointer;">Mind megtekintése</button>
                            </div>
                            <div id="profile-reviews-section">
                                <!-- Populated by JS -->
                            </div>
                        </div>

`;

html = html.replace(
    `                        <!-- Fiók -->
                        <div style="margin-top: 32px; padding-bottom: 40px;">`,
    darkModeSection + `                        <!-- Fiók -->
                        <div style="margin-top: 32px; padding-bottom: 40px;">`
);

// ============================================================
// FIX 4: "Munka lezárása" button in employer chat
// ============================================================
html = html.replace(
    '<div class="chat-body" id="employer-chat-messages"></div>',
    '<div class="chat-body" id="employer-chat-messages"></div>'
);

const oldEmployerInputArea = `                    <div style="background:#fff; padding:12px 16px 28px; border-top:1px solid var(--color-border); display:flex; gap:10px; align-items:center;">
                        <button onclick="triggerPhotoAttach()`;

const newEmployerInputArea = `                    <div id="employer-close-job-bar" style="padding:10px 16px;background:#fff;display:none;border-top:1px solid #F1F1F1;">
                        <button onclick="openCloseJobSheet()" style="width:100%;height:48px;background:#0A0F2E;color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Munka lezárása
                        </button>
                    </div>
                    <div style="background:#fff; padding:12px 16px 28px; border-top:1px solid var(--color-border); display:flex; gap:10px; align-items:center;">
                        <button onclick="triggerPhotoAttach()`;

html = html.replace(oldEmployerInputArea, newEmployerInputArea);

// ============================================================
// FIX 5: Show close-job bar when employer opens chat
// ============================================================
html = html.replace(
    `            chatMessages.innerHTML = html;

            updateEmployerActionFooter();
            document.getElementById('employer-action-overlay').classList.add('active');`,
    `            chatMessages.innerHTML = html;

            const closeBar = document.getElementById('employer-close-job-bar');
            if (closeBar && gameState.applied && gameState.status !== 'Kifizetve') {
                closeBar.style.display = 'block';
            } else if (closeBar) {
                closeBar.style.display = 'none';
            }

            updateEmployerActionFooter();
            document.getElementById('employer-action-overlay').classList.add('active');`
);

// ============================================================
// FIX 6: Call renderProfileReviews when profile tab opens
// ============================================================
html = html.replace(
    'function navigateApp(index) {',
    `function navigateApp(index) {
            if (index === 3) {
                setTimeout(function() { if(typeof renderProfileReviews === 'function') renderProfileReviews(); updateAllUserUI(); }, 100);
            }`
);

// ============================================================
// FIX 7: Remove hardcoded "Kovács Bence" from push notification
// ============================================================
html = html.replace(
    "showPushNotification('📩 Kovács Bence jelentkezett', 'A munkádra: ' + (gameState.job",
    "const _applyUser = loadCurrentUser(); showPushNotification('📩 ' + (_applyUser ? _applyUser.name : 'Valaki') + ' jelentkezett', 'A munkádra: ' + (gameState.job"
);

// ============================================================
// FIX 8: Add all reviews overlay + renderProfileReviews JS inline
// ============================================================
const allReviewsOverlay = `
<!-- All Reviews Overlay -->
<div class="settings-overlay" id="all-reviews-overlay" style="z-index:3000;">
    <div style="background:#0A0F2E;padding:52px 20px 16px;display:flex;align-items:center;gap:12px;">
        <button onclick="document.getElementById('all-reviews-overlay').classList.remove('active')" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style="font-size:17px;font-weight:700;color:#fff;">Összes vélemény</span>
    </div>
    <div style="padding:16px;overflow-y:auto;flex:1;" id="all-reviews-list"></div>
</div>
`;
html = html.replace('</body>', allReviewsOverlay + '\n</body>');

// ============================================================
// FIX 9: Inject renderProfileReviews and dark mode sync JS
// ============================================================
const extraJS = `
        function starsHtml(n) {
            const filled = '★'.repeat(Math.max(0, Math.min(5, n)));
            const empty = '☆'.repeat(Math.max(0, 5 - Math.min(5, n)));
            return filled + empty;
        }

        function renderProfileReviews() {
            const container = document.getElementById('profile-reviews-section');
            if (!container) return;
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const reviews = userData.reviews || [];
            if (reviews.length === 0) {
                container.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;padding:32px;text-align:center;"><svg width=\\"48\\" height=\\"48\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"#D1D5DB\\" stroke-width=\\"1.5\\" style=\\"margin-bottom:12px;\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"/></svg><div style=\\"font-size:15px;font-weight:600;color:#374151;margin-bottom:6px;\\">Még nincs véleményed</div><div style=\\"font-size:13px;color:#9CA3AF;\\">Végezz el munkákat hogy értékeléseket kapj.</div></div>';
                return;
            }
            const last5 = reviews.slice(0, 5);
            container.innerHTML = last5.map(function(r) {
                return '<div style="background:#fff;border:1px solid #F1F1F1;border-radius:14px;padding:14px 16px;margin-bottom:10px;">' +
                    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
                    '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0A0F2E,#1e3a8a);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;">' + (r.initials || '?') + '</div>' +
                    '<div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#0A0F2E;">' + r.name + '</div><div style="font-size:11px;color:#9CA3AF;">' + r.date + '</div></div>' +
                    '<div style="color:#FBBF24;font-size:14px;">' + starsHtml(r.stars) + '</div>' +
                    '</div>' +
                    (r.text ? '<div style="font-size:13px;color:#374151;line-height:1.5;">' + r.text + '</div>' : '') +
                    (r.job ? '<div style="font-size:11px;color:#9CA3AF;margin-top:6px;font-style:italic;">' + r.job + '</div>' : '') +
                    '</div>';
            }).join('');
        }

        function openAllReviews() {
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const reviews = userData.reviews || [];
            const overlay = document.getElementById('all-reviews-overlay');
            if (!overlay) return;
            const list = document.getElementById('all-reviews-list');
            if (list) {
                if (reviews.length === 0) {
                    list.innerHTML = '<div style="text-align:center;padding:40px;color:#9CA3AF;">Még nincs egyetlen véleményed sem.</div>';
                } else {
                    list.innerHTML = reviews.map(function(r) {
                        return '<div style="background:#fff;border:1px solid #F1F1F1;border-radius:14px;padding:14px 16px;margin-bottom:10px;">' +
                            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
                            '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0A0F2E,#1e3a8a);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;">' + (r.initials || '?') + '</div>' +
                            '<div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#0A0F2E;">' + r.name + '</div><div style="font-size:11px;color:#9CA3AF;">' + r.date + '</div></div>' +
                            '<div style="color:#FBBF24;font-size:14px;">' + starsHtml(r.stars) + '</div>' +
                            '</div>' +
                            (r.text ? '<div style="font-size:13px;color:#374151;line-height:1.5;">' + r.text + '</div>' : '') +
                            '</div>';
                    }).join('');
                }
            }
            overlay.classList.add('active');
        }

        // Dark mode toggle visual sync (called after DOM ready)
        function initDarkModeToggle() {
            const track = document.getElementById('dark-toggle-track');
            const thumb = document.getElementById('dark-toggle-thumb');
            const toggle = document.getElementById('dark-mode-toggle');
            const isDark = localStorage.getItem('melogo_dark_mode') === 'true';
            if (toggle) toggle.checked = isDark;
            if (isDark && track && thumb) {
                track.style.background = '#22C55E';
                thumb.style.transform = 'translateX(20px)';
            }
            if (toggle) {
                toggle.addEventListener('change', function() {
                    const t = document.getElementById('dark-toggle-track');
                    const th = document.getElementById('dark-toggle-thumb');
                    if (this.checked) {
                        if (t) t.style.background = '#22C55E';
                        if (th) th.style.transform = 'translateX(20px)';
                    } else {
                        if (t) t.style.background = '#E5E7EB';
                        if (th) th.style.transform = 'translateX(0)';
                    }
                });
            }
        }
`;

const lastScriptClose = html.lastIndexOf('</script>');
html = html.substring(0, lastScriptClose) + extraJS + '\n        </script>' + html.substring(lastScriptClose + '</script>'.length);

// Call initDarkModeToggle on navigateApp(3)
html = html.replace(
    `if (index === 3) {
                setTimeout(function() { if(typeof renderProfileReviews === 'function') renderProfileReviews(); updateAllUserUI(); }, 100);
            }`,
    `if (index === 3) {
                setTimeout(function() { if(typeof renderProfileReviews === 'function') renderProfileReviews(); updateAllUserUI(); if(typeof initDarkModeToggle === 'function') initDarkModeToggle(); }, 100);
            }`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Phase 2 applied successfully');
