const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ============================================================
// FÁZIS 1: ONBOARDING SCREENS (before login screen)
// ============================================================
const onboardingHTML = `
<div id="onboarding-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#0A0F2E;z-index:9999;display:flex;flex-direction:column;overflow:hidden;">
    <button onclick="skipOnboarding()" style="position:absolute;top:52px;right:24px;background:none;border:none;color:rgba(255,255,255,0.5);font-size:14px;font-weight:500;cursor:pointer;z-index:10;">Kihagyás</button>
    
    <div id="onboarding-slides" style="display:flex;width:300%;height:100%;transition:transform 0.4s cubic-bezier(0.25,0.8,0.25,1);">
        <!-- Slide 1 -->
        <div style="width:33.333%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 32px;box-sizing:border-box;">
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:40px;">
                <circle cx="100" cy="60" r="28"/>
                <path d="M52 160c0-26.5 21.5-48 48-48s48 21.5 48 48"/>
                <rect x="60" y="120" width="80" height="50" rx="8"/>
                <path d="M80 135 L90 155 L120 130" stroke="#22C55E" stroke-width="3"/>
                <rect x="30" y="150" width="40" height="30" rx="4"/>
                <rect x="130" y="150" width="40" height="30" rx="4"/>
                <path d="M30 155 L15 140 L30 125 M70 155 L85 140 L70 125" opacity="0.4"/>
            </svg>
            <h2 style="font-family:'Outfit',sans-serif;font-size:24px;font-weight:600;color:#fff;text-align:center;margin:0 0 12px;line-height:1.3;">Vállalj munkát a közeledben</h2>
            <p style="font-size:15px;color:rgba(255,255,255,0.6);text-align:center;line-height:1.6;margin:0;">Találj egynapos munkákat percek alatt, bárhol Magyarországon.</p>
        </div>
        <!-- Slide 2 -->
        <div style="width:33.333%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 32px;box-sizing:border-box;">
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:40px;">
                <rect x="55" y="40" width="70" height="120" rx="10"/>
                <rect x="63" y="55" width="54" height="75" rx="4"/>
                <circle cx="90" cy="148" r="5"/>
                <path d="M75 70 L105 70 M75 82 L100 82 M75 94 L95 94"/>
                <path d="M115 90 L145 90 L145 130 L115 130 Z" stroke="#22C55E"/>
                <path d="M125 110 L135 110 M125 120 L133 120"/>
                <path d="M110 95 L115 90"/>
            </svg>
            <h2 style="font-family:'Outfit',sans-serif;font-size:24px;font-weight:600;color:#fff;text-align:center;margin:0 0 12px;line-height:1.3;">Adj fel munkát percek alatt</h2>
            <p style="font-size:15px;color:rgba(255,255,255,0.6);text-align:center;line-height:1.6;margin:0;">Keress megbízható munkásokat a környékeden, azonnal.</p>
        </div>
        <!-- Slide 3 -->
        <div style="width:33.333%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 32px;box-sizing:border-box;">
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:40px;">
                <path d="M100 30 L140 50 L140 100 C140 135 100 165 100 165 C100 165 60 135 60 100 L60 50 Z"/>
                <path d="M82 100 L93 112 L118 88" stroke="#22C55E" stroke-width="3"/>
                <circle cx="70" cy="40" r="12" opacity="0.4"/>
                <circle cx="130" cy="40" r="12" opacity="0.4"/>
                <path d="M70 45 L100 50 L130 45" opacity="0.3" stroke-dasharray="4,4"/>
            </svg>
            <h2 style="font-family:'Outfit',sans-serif;font-size:24px;font-weight:600;color:#fff;text-align:center;margin:0 0 12px;line-height:1.3;">Biztonságos és átlátható</h2>
            <p style="font-size:15px;color:rgba(255,255,255,0.6);text-align:center;line-height:1.6;margin:0;">Értékelési rendszer, ellenőrzött profilok, teljes biztonság.</p>
        </div>
    </div>
    
    <!-- Dots -->
    <div style="position:absolute;bottom:120px;left:0;right:0;display:flex;justify-content:center;gap:8px;" id="onboarding-dots">
        <div class="ob-dot ob-dot-active"></div>
        <div class="ob-dot"></div>
        <div class="ob-dot"></div>
    </div>
    
    <!-- CTA buttons -->
    <div style="position:absolute;bottom:44px;left:32px;right:32px;">
        <button id="ob-next-btn" onclick="onboardingNext()" style="width:100%;height:52px;background:#22C55E;color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:transform 0.15s ease;">Tovább</button>
    </div>
</div>
<style>
.ob-dot { width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.25);transition:all 0.3s ease; }
.ob-dot-active { background:#22C55E;width:24px;border-radius:4px; }
</style>
`;

// ============================================================
// FÁZIS 2: ONBOARDING JS LOGIC
// ============================================================
const onboardingJS = `
        // ==========================================
        // ONBOARDING
        // ==========================================
        let currentOnboardingSlide = 0;

        function initOnboarding() {
            const seen = localStorage.getItem('melogo_onboarding_done');
            const screen = document.getElementById('onboarding-screen');
            if (!screen) return;
            if (seen) {
                screen.style.display = 'none';
            } else {
                screen.style.display = 'flex';
            }
        }

        function onboardingNext() {
            currentOnboardingSlide++;
            if (currentOnboardingSlide >= 3) {
                skipOnboarding();
                return;
            }
            const slides = document.getElementById('onboarding-slides');
            slides.style.transform = 'translateX(-' + (currentOnboardingSlide * 33.333) + '%)';
            
            const dots = document.querySelectorAll('.ob-dot');
            dots.forEach((d, i) => {
                d.classList.toggle('ob-dot-active', i === currentOnboardingSlide);
            });
            
            const btn = document.getElementById('ob-next-btn');
            if (currentOnboardingSlide === 2) {
                btn.innerText = 'Kezdjük el';
                btn.style.background = '#22C55E';
            }
        }

        function skipOnboarding() {
            localStorage.setItem('melogo_onboarding_done', 'true');
            const screen = document.getElementById('onboarding-screen');
            if (screen) {
                screen.style.transition = 'opacity 0.4s ease';
                screen.style.opacity = '0';
                setTimeout(() => { screen.style.display = 'none'; }, 400);
            }
        }
`;

// ============================================================
// FÁZIS 3: CURRENT USER SYSTEM + TRUST LEVELS
// ============================================================
const userSystemJS = `
        // ==========================================
        // USER RENDSZER & TRUST SZINTEK
        // ==========================================
        function loadCurrentUser() {
            const workerSession = JSON.parse(localStorage.getItem('melogo_worker_session') || 'null');
            const employerSession = JSON.parse(localStorage.getItem('melogo_employer_session') || 'null');
            const activeRole = localStorage.getItem('melogo_active_role') || 'worker';
            
            const session = activeRole === 'employer' ? employerSession : workerSession;
            if (!session) return null;
            
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            return {
                name: session.name || 'Felhasználó',
                email: session.email || '',
                role: session.role || activeRole,
                jobCount: userData.jobCount || 0,
                rating: userData.rating || 5.0,
                reviewCount: userData.reviewCount || 0,
                reviews: userData.reviews || [],
                location: userData.location || 'Magyarország',
                trustLevel: calcTrustLevel(userData.jobCount || 0, userData.rating || 5.0),
                initials: getInitials(session.name || 'Felhasználó'),
                darkMode: localStorage.getItem('melogo_dark_mode') === 'true',
            };
        }

        function getInitials(name) {
            if (!name) return '?';
            const parts = name.trim().split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        }

        function calcTrustLevel(jobCount, rating) {
            if (jobCount >= 15 && rating >= 4.7) return { level: 4, name: 'Prémium', bg: '#EEF2FF', color: '#0A0F2E' };
            if (jobCount >= 8 && rating >= 4.3) return { level: 3, name: 'Tapasztalt', bg: '#FFFBEB', color: '#B45309' };
            if (jobCount >= 3 && rating >= 4.0) return { level: 2, name: 'Megbízható', bg: '#EFF6FF', color: '#1D4ED8' };
            return { level: 1, name: 'Kezdő', bg: '#F3F4F6', color: '#6B7280' };
        }

        function renderTrustBadge(trust, size) {
            const sz = size === 'sm' ? 'font-size:11px;padding:3px 8px;' : 'font-size:12px;padding:4px 10px;';
            return '<span style="' + sz + 'background:' + trust.bg + ';color:' + trust.color + ';border-radius:20px;font-weight:600;display:inline-block;">' + trust.name + '</span>';
        }

        function updateAllUserUI() {
            const user = loadCurrentUser();
            if (!user) return;
            
            // Update all name elements
            document.querySelectorAll('.user-name-display').forEach(el => { el.innerText = user.name; });
            document.querySelectorAll('.user-initials-display').forEach(el => { el.innerText = user.initials; });
            document.querySelectorAll('.user-location-display').forEach(el => { el.innerText = user.location; });
            document.querySelectorAll('.user-job-count').forEach(el => { el.innerText = user.jobCount; });
            document.querySelectorAll('.user-rating-display').forEach(el => { el.innerText = user.rating.toFixed(1); });
            document.querySelectorAll('.user-trust-badge').forEach(el => { el.innerHTML = renderTrustBadge(user.trustLevel); });
            
            const avatarBg = getAvatarGradient(user.name);
            document.querySelectorAll('.user-avatar-bg').forEach(el => { el.style.background = avatarBg; });
        }

        function getAvatarGradient(name) {
            const gradients = [
                'linear-gradient(135deg, #0A0F2E 0%, #1e3a8a 100%)',
                'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                'linear-gradient(135deg, #047857 0%, #22C55E 100%)',
                'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
                'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)',
            ];
            let h = 0;
            for (let i = 0; i < (name||'').length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFF;
            return gradients[h % gradients.length];
        }
`;

// ============================================================
// FÁZIS 4: RATING SYSTEM
// ============================================================
const ratingSystemJS = `
        // ==========================================
        // RATING SYSTEM
        // ==========================================
        let currentRating = 0;
        let ratingFor = 'worker'; // or 'employer'

        function openRatingScreen(forRole) {
            ratingFor = forRole;
            currentRating = 0;
            const overlay = document.getElementById('rating-overlay');
            if (!overlay) return;
            
            document.querySelectorAll('.rating-star').forEach((s, i) => {
                s.style.fill = 'none';
                s.style.color = '#D1D5DB';
                setTimeout(() => {
                    s.style.transform = 'scale(1)';
                    s.parentElement.style.transform = 'translateY(0)';
                }, i * 80);
            });
            document.getElementById('rating-text').value = '';
            overlay.classList.add('active');
        }

        function setRatingStar(n) {
            currentRating = n;
            document.querySelectorAll('.rating-star-btn').forEach((btn, i) => {
                const star = btn.querySelector('.rating-star');
                if (i < n) {
                    star.style.fill = '#FBBF24';
                    star.style.color = '#FBBF24';
                    btn.style.transform = 'scale(1.15)';
                } else {
                    star.style.fill = 'none';
                    star.style.color = '#D1D5DB';
                    btn.style.transform = 'scale(1)';
                }
            });
        }

        function submitRating() {
            if (currentRating === 0) {
                document.getElementById('rating-error').style.display = 'block';
                return;
            }
            document.getElementById('rating-error').style.display = 'none';
            
            const text = document.getElementById('rating-text').value.trim();
            const user = loadCurrentUser();
            
            // Save rating to userData
            const userData = JSON.parse(localStorage.getItem('melogo_user_data') || '{}');
            const newReview = {
                name: 'Értékelő felhasználó',
                initials: 'ÉF',
                stars: currentRating,
                date: new Date().toLocaleDateString('hu-HU'),
                text: text || '',
                job: gameState.jobTitle || 'Munka'
            };
            if (!userData.reviews) userData.reviews = [];
            userData.reviews.unshift(newReview);
            
            const allRatings = userData.reviews.map(r => r.stars);
            userData.rating = (allRatings.reduce((a,b) => a+b, 0) / allRatings.length);
            userData.reviewCount = userData.reviews.length;
            localStorage.setItem('melogo_user_data', JSON.stringify(userData));
            
            // Close rating and show success
            const overlay = document.getElementById('rating-overlay');
            if (overlay) overlay.classList.remove('active');
            
            showGreenBanner('Értékelés elküldve! Köszönjük.');
            updateAllUserUI();
        }

        function showGreenBanner(text) {
            let banner = document.getElementById('green-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'green-banner';
                banner.style.cssText = 'position:fixed;top:-60px;left:50%;transform:translateX(-50%);background:#22C55E;color:#fff;padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px;z-index:9999;transition:top 0.4s cubic-bezier(0.25,0.8,0.25,1);white-space:nowrap;';
                document.body.appendChild(banner);
            }
            banner.innerText = text;
            banner.style.top = '60px';
            setTimeout(() => { banner.style.top = '-60px'; }, 3000);
        }
`;

// ============================================================
// FÁZIS 5: DARK MODE
// ============================================================
const darkModeJS = `
        // ==========================================
        // DARK MODE
        // ==========================================
        function applyDarkMode(enabled) {
            const root = document.documentElement;
            if (enabled) {
                root.style.setProperty('--color-bg', '#1A1A2E');
                root.style.setProperty('--color-surface', '#16213E');
                root.style.setProperty('--color-card', '#1E2A45');
                root.style.setProperty('--color-border', '#2A2A4A');
                root.style.setProperty('--color-text-dark', '#FFFFFF');
                root.style.setProperty('--color-text', '#E5E7EB');
                root.style.setProperty('--color-text-muted', '#9CA3AF');
                document.body.style.background = '#1A1A2E';
                document.body.style.color = '#FFFFFF';
            } else {
                root.style.setProperty('--color-bg', '#F8F9FB');
                root.style.setProperty('--color-surface', '#FFFFFF');
                root.style.setProperty('--color-card', '#FFFFFF');
                root.style.setProperty('--color-border', '#F1F1F1');
                root.style.setProperty('--color-text-dark', '#0A0F2E');
                root.style.setProperty('--color-text', '#18181B');
                root.style.setProperty('--color-text-muted', '#6B7280');
                document.body.style.background = '';
                document.body.style.color = '';
            }
        }

        function toggleDarkMode() {
            const isDark = localStorage.getItem('melogo_dark_mode') === 'true';
            const newVal = !isDark;
            localStorage.setItem('melogo_dark_mode', String(newVal));
            applyDarkMode(newVal);
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = newVal;
        }

        function initDarkMode() {
            const isDark = localStorage.getItem('melogo_dark_mode') === 'true';
            applyDarkMode(isDark);
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = isDark;
        }
`;

// ============================================================
// FÁZIS 6: EMPTY STATES
// ============================================================
const emptyStatesJS = `
        // ==========================================
        // EMPTY STATES
        // ==========================================
        function showWorkerEmptyState() {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;
            list.innerHTML = \`
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px;text-align:center;">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" style="margin-bottom:24px;">
                        <circle cx="44" cy="44" r="26"/>
                        <line x1="62" y1="62" x2="80" y2="80"/>
                        <path d="M34 44 L44 30 M44 44 L56 44" opacity="0.5"/>
                        <circle cx="75" cy="25" r="15" stroke="#E5E7EB"/>
                        <line x1="70" y1="20" x2="80" y2="30" opacity="0.4"/>
                        <line x1="80" y1="20" x2="70" y2="30" opacity="0.4"/>
                    </svg>
                    <div style="font-size:17px;font-weight:700;color:#374151;margin-bottom:8px;">Nincs közeli munka</div>
                    <div style="font-size:14px;color:#9CA3AF;line-height:1.6;margin-bottom:24px;">Próbálj nagyobb hatókört beállítani,<br>vagy nézz vissza hamarosan.</div>
                    <button onclick="openRadiusSlider()" style="background:#22C55E;color:#fff;border:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;">Hatókör növelése</button>
                </div>
            \`;
        }

        function showMessagesEmptyState() {
            const list = document.getElementById('messages-chat-list');
            if (!list || list.children.length > 0) return;
            const hasItems = Array.from(list.children).some(c => !c.id || !c.id.includes('empty'));
            if (hasItems) return;
            list.innerHTML = \`
                <div id="messages-empty-state" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 32px;text-align:center;">
                    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" style="margin-bottom:20px;">
                        <path d="M20 30 L80 30 L80 65 L55 65 L40 80 L40 65 L20 65 Z" rx="8"/>
                        <line x1="35" y1="45" x2="65" y2="45" opacity="0.5"/>
                        <line x1="35" y1="55" x2="55" y2="55" opacity="0.5"/>
                    </svg>
                    <div style="font-size:17px;font-weight:700;color:#374151;margin-bottom:8px;">Még csend van itt</div>
                    <div style="font-size:14px;color:#9CA3AF;line-height:1.6;">Jelentkezz egy munkára és automatikusan<br>megnyílik a chat.</div>
                </div>
            \`;
        }
`;

// ============================================================
// INJECT: Rating Overlay HTML (add before </body>)
// ============================================================
const ratingOverlayHTML = `
<!-- RATING OVERLAY -->
<div class="action-overlay" id="rating-overlay" style="z-index:5000;">
    <div style="padding:24px 24px 0;">
        <div style="width:36px;height:4px;background:#E5E7EB;border-radius:2px;margin:0 auto 20px;"></div>
        <div style="font-size:18px;font-weight:700;color:#0A0F2E;text-align:center;margin-bottom:4px;">Hogyan sikerült?</div>
        <div style="font-size:13px;color:#9CA3AF;text-align:center;margin-bottom:28px;">Értékeld a munkát 1-5 csillaggal</div>
        
        <div style="display:flex;justify-content:center;gap:12px;margin-bottom:24px;">
            <button class="rating-star-btn" onclick="setRatingStar(1)" style="background:none;border:none;cursor:pointer;padding:8px;transition:transform 0.15s ease;">
                <svg class="rating-star" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="rating-star-btn" onclick="setRatingStar(2)" style="background:none;border:none;cursor:pointer;padding:8px;transition:transform 0.15s ease;">
                <svg class="rating-star" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="rating-star-btn" onclick="setRatingStar(3)" style="background:none;border:none;cursor:pointer;padding:8px;transition:transform 0.15s ease;">
                <svg class="rating-star" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="rating-star-btn" onclick="setRatingStar(4)" style="background:none;border:none;cursor:pointer;padding:8px;transition:transform 0.15s ease;">
                <svg class="rating-star" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="rating-star-btn" onclick="setRatingStar(5)" style="background:none;border:none;cursor:pointer;padding:8px;transition:transform 0.15s ease;">
                <svg class="rating-star" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
        </div>
        
        <div id="rating-error" style="display:none;color:#EF4444;font-size:13px;text-align:center;margin-bottom:8px;">Kérlek adj csillagos értékelést!</div>
        
        <textarea id="rating-text" placeholder="Írj egy rövid véleményt... (opcionális)" maxlength="300" style="width:100%;min-height:80px;border:1.5px solid #E5E7EB;border-radius:12px;padding:12px 14px;font-size:14px;font-family:'Inter',sans-serif;resize:none;outline:none;color:#0A0F2E;box-sizing:border-box;"></textarea>
        
        <button onclick="submitRating()" style="width:100%;height:52px;background:#0A0F2E;color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;margin-top:16px;margin-bottom:32px;font-family:'Inter',sans-serif;">Értékelés küldése</button>
    </div>
</div>

<!-- "MUNKA LEZÁRÁSA" CONFIRM SHEET -->
<div id="close-job-backdrop" onclick="closeCloseJobSheet()" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:4000;"></div>
<div id="close-job-sheet" style="position:fixed;bottom:-300px;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;z-index:4001;padding:20px 24px 40px;transition:bottom 0.35s cubic-bezier(0.25,0.8,0.25,1);">
    <div style="width:36px;height:4px;background:#E5E7EB;border-radius:2px;margin:0 auto 20px;"></div>
    <div style="font-size:17px;font-weight:700;color:#0A0F2E;margin-bottom:6px;">Munka lezárása</div>
    <div style="font-size:14px;color:#6B7280;margin-bottom:24px;">Kérlek erősítsd meg, hogy a munka elvégzésre és a kifizetésre sor került.</div>
    <button onclick="confirmCloseJob()" style="width:100%;height:52px;background:#0A0F2E;color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Készpénzben kifizetve és lezárom
    </button>
    <button onclick="closeCloseJobSheet()" style="width:100%;height:48px;background:#F3F4F6;color:#374151;border:none;border-radius:14px;font-size:15px;font-weight:600;cursor:pointer;">Mégsem</button>
</div>
`;

// ============================================================
// INJECT: Munka lezárása button into employer chat
// ============================================================
const closeJobJS = `
        // ==========================================
        // MUNKA LEZÁRÁSA FLOW
        // ==========================================
        function openCloseJobSheet() {
            document.getElementById('close-job-backdrop').style.display = 'block';
            document.getElementById('close-job-sheet').style.bottom = '0px';
        }

        function closeCloseJobSheet() {
            document.getElementById('close-job-backdrop').style.display = 'none';
            document.getElementById('close-job-sheet').style.bottom = '-300px';
        }

        function confirmCloseJob() {
            closeCloseJobSheet();
            gameState.status = 'Kifizetve';
            
            // Close employer overlay
            const empOverlay = document.getElementById('employer-action-overlay');
            if (empOverlay) empOverlay.classList.remove('active');
            
            showGreenBanner('Munka lezárva! Köszönjük.');
            
            setTimeout(() => {
                openRatingScreen('worker');
            }, 800);
        }
`;

// ============================================================
// ADD NAME INPUT to login screen
// ============================================================
html = html.replace(
    '<input type="email" id="app-email" class="login-input" placeholder="Hova küldjük a foglalásaid?" value="bence@melogo.hu">',
    '<input type="text" id="app-name" class="login-input" placeholder="Teljes neved (pl. Kovács Bence)" style="margin-bottom:12px;">\n    <input type="email" id="app-email" class="login-input" placeholder="Hova küldjük a foglalásaid?" value="">'
);

// Fix loginApp to use real name
html = html.replace(
    'function loginApp() {',
    `function loginApp() {
            const name = (document.getElementById('app-name') ? document.getElementById('app-name').value.trim() : '') || 'Felhasználó';
            const email = document.getElementById('app-email').value;
            const role = loginSelectedRole || 'worker';
            if (!name || name.length < 2) { showLoginError('Kérlek add meg a neved!'); return; }
            if (!email || !email.includes('@')) { showLoginError('Kérlek adj meg egy érvényes email címet!'); return; }
            const session = { email, name, role, loginAt: Date.now() };
            localStorage.setItem('melogo_worker_session', JSON.stringify({...session, role:'worker'}));
            localStorage.setItem('melogo_employer_session', JSON.stringify({...session, role:'employer'}));
            localStorage.setItem('melogo_active_role', role);
            localStorage.setItem('melogo_app_session', 'true');
            const screen = document.getElementById('app-login-screen');
            if (screen) { screen.style.transition='opacity 0.3s'; screen.style.opacity='0'; setTimeout(()=>{screen.classList.add('hidden');screen.style.opacity='';},300); }
            updateAllUserUI();
            updateGreetings();
            return; // skip old login logic below
`
);

// Fix loginAppFaceID to auto-fill name
html = html.replace(
    'function loginAppFaceID() {',
    `function loginAppFaceID() {
            const session = { email: 'demo@melogo.hu', name: 'Demo Felhasználó', role: loginSelectedRole || 'worker', loginAt: Date.now(), faceId: true };
            localStorage.setItem('melogo_worker_session', JSON.stringify({...session, role:'worker'}));
            localStorage.setItem('melogo_employer_session', JSON.stringify({...session, role:'employer'}));
            localStorage.setItem('melogo_app_session', 'true');
            localStorage.setItem('melogo_active_role', session.role);
            const screen = document.getElementById('app-login-screen');
            if (screen) { screen.style.transition='opacity 0.3s'; screen.style.opacity='0'; setTimeout(()=>{screen.classList.add('hidden');screen.style.opacity='';},300); }
            updateAllUserUI();
            updateGreetings();
            return;
`
);

// Add showLoginError function
if (!html.includes('function showLoginError')) {
    html = html.replace('function loginApp() {', `function showLoginError(msg) {
            let err = document.getElementById('login-err');
            if (!err) { err = document.createElement('div'); err.id='login-err'; err.style.cssText='color:#EF4444;font-size:13px;text-align:center;margin:-16px 0 16px;'; document.getElementById('app-login-screen').insertBefore(err, document.querySelector('.login-btn')); }
            err.innerText = msg;
        }\n\n        function loginApp() {`);
}

// ============================================================
// INJECT: Onboarding before login
// ============================================================
html = html.replace('<div id="app-login-screen">', onboardingHTML + '\n<div id="app-login-screen">');

// ============================================================
// INJECT: all JS blocks before closing </script>
// ============================================================
const allNewJS = onboardingJS + userSystemJS + ratingSystemJS + darkModeJS + emptyStatesJS + closeJobJS;

// Find the last </script> before </body>
const lastScriptClose = html.lastIndexOf('</script>');
html = html.substring(0, lastScriptClose) + allNewJS + '\n        </script>';
html = html.substring(0, html.lastIndexOf('</script>') + '</script>'.length) + html.substring(html.lastIndexOf('</script>') + '</script>'.length);

// ============================================================
// INJECT: Rating overlay and close-job sheet before </body>
// ============================================================
html = html.replace('</body>', ratingOverlayHTML + '\n</body>');

// ============================================================
// FIX: Call initOnboarding and initDarkMode on load
// ============================================================
html = html.replace(
    'window.onload = function() {\n            let initialCatLabel',
    `window.onload = function() {
            initOnboarding();
            initDarkMode();
            updateAllUserUI();
            let initialCatLabel`
);

// ============================================================
// FIX: Dynamic greeting uses real name
// ============================================================
html = html.replace(
    "const firstName = (localStorage.getItem('melogo_name') || 'Bence').split(' ')[0];",
    "const workerSess = JSON.parse(localStorage.getItem('melogo_worker_session') || '{}'); const firstName = (workerSess.name || 'Barátom').split(' ')[0];"
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Phase 1-6 applied successfully');
