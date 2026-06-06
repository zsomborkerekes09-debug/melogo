import re
import os

filepath = r"C:\Users\zsomb\.gemini\antigravity\scratch\melogo\frontend\index.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS slider
content = content.replace(
"""        #worker-slider {
            width: 400%;
        }

        #worker-slider .screen {
            width: 25%;
        }

        #employer-slider {
            width: 300%;
        }

        #employer-slider .screen {
            width: 33.333%;
        }""",
"""        #app-slider {
            width: 400%;
        }

        #app-slider .screen {
            width: 25%;
        }

        /* Role Switcher styles */
        .role-switcher-container {
            background-color: var(--color-navy);
            border-radius: 20px;
            padding: 4px;
            display: flex;
            width: 100%;
            max-width: 180px;
            margin: 0 auto;
        }
        .role-btn {
            flex: 1;
            padding: 6px 12px;
            font-size: 13px;
            font-weight: 700;
            color: #9CA3AF;
            background: transparent;
            border: none;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        .role-btn.active {
            background-color: white;
            color: var(--color-navy);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .role-card {
            background: white;
            border: 1.5px solid rgba(0,0,0,0.08);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            margin-bottom: 12px;
        }
        .role-card.active {
            border-color: var(--color-green-go);
            background: rgba(34, 197, 94, 0.05);
        }
        
        #home-employer-view { display: none; }
""")

# 2. Update intro text
content = content.replace(
"""A **bal oldali telefonon** a Munkavállaló (Diák), míg a **jobb oldali telefonon** a Munkáltató (Hirdető) élő nézetét látod, amelyek valós időben kommunikálnak egymással.""",
"""Egyetlen alkalmazáson belül mindkét szerep elérhető. Válts Munkás és Megbízó nézet között egyetlen gombnyomással a kezdőképernyőn!""")

# 3. Rename #phone-worker to #phone-app and remove the left phone label
content = content.replace(
"""        <!-- ======================================================= -->
        <!-- 1. BAL OLDALI TELEFON: MUNKAVÁLLALÓ (DIÁK) NÉZET -->
        <!-- ======================================================= -->
        <div class="phone-column">
            <div class="phone-label" style="color: var(--color-green-go);">
                <span class="indicator-dot green-glow"></span> Diák (Munkavállaló) Nézet
            </div>
            
            <div class="phone-container" id="phone-worker">""",
"""        <!-- ======================================================= -->
        <!-- EGYESÍTETT ALKALMAZÁS NÉZET -->
        <!-- ======================================================= -->
        <div class="phone-column">
            <div class="phone-label" style="color: var(--color-navy);">
                <span class="indicator-dot" style="background-color: var(--color-navy);"></span> MeloGo App
            </div>
            
            <div class="phone-container" id="phone-app">""")

# 4. Refactor Login Screen (unified)
content = content.replace(
"""                <!-- DIÁK ONBOARDING / ELSŐ REGISZTRÁCIÓ SCREEN -->
                <div class="login-screen" id="worker-login-screen">
                    <!-- Háttér dekoráció -->
                    <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:linear-gradient(135deg,rgba(52,199,89,0.12),rgba(0,122,255,0.08));pointer-events:none;"></div>
                    <div style="position:absolute;bottom:-40px;left:-40px;width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,rgba(0,122,255,0.08),rgba(52,199,89,0.05));pointer-events:none;"></div>

                    <div style="margin-top:48px; text-align:center;">
                        <div class="login-logo">Melo<span>Go</span></div>
                        <div class="login-tagline">Vállalj munkát!</div>
                    </div>

                    <!-- Onboarding kártyák -->
                    <div style="display:flex;flex-direction:column;gap:10px;margin:0 0 24px 0;">
                        <div style="display:flex;align-items:center;gap:12px;background:#f9f9fb;border-radius:14px;padding:12px;border:1px solid rgba(0,0,0,0.05);">
                            <div style="width:36px;height:36px;border-radius:10px;background:rgba(52,199,89,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34c759" stroke-width="2.5"><path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/></svg>
                            </div>
                            <div><div style="font-size:12px;font-weight:700;color:#1c1c1e;">Válassz munkát a közeledben</div><div style="font-size:10px;color:#86868b;margin-top:1px;">GPS alapú, valós idejű kínálat</div></div>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;background:#f9f9fb;border-radius:14px;padding:12px;border:1px solid rgba(0,0,0,0.05);">
                            <div style="width:36px;height:36px;border-radius:10px;background:rgba(0,122,255,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <div><div style="font-size:12px;font-weight:700;color:#1c1c1e;">Biztonságos Stripe kifizetés</div><div style="font-size:10px;color:#86868b;margin-top:1px;">Letéti garancia minden munkára</div></div>
                        </div>
                    </div>

                    <div class="login-form">
                        <input type="email" class="login-input" id="worker-email" value="bence@melogo.hu" placeholder="Email cím">
                        <input type="password" class="login-input" id="worker-pw" value="" placeholder="Jelszó (pl. melogo123)">
                        <button class="login-btn" onclick="loginWorker()" id="worker-login-btn">
                            Regisztrálok &amp; Bejelentkezem
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        <button class="login-faceid" onclick="loginWorkerFaceID()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01M15 10h.01M9 15h6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                            Folytatás Face ID-val
                        </button>
                        <p style="font-size:10px;color:#86868b;text-align:center;line-height:1.5;margin-top:4px;">A folytatással elfogadod az Általános Szerződési Feltételeket és az Adatvédelmi Nyilatkozatot.</p>
                    </div>
                </div>

                <!-- Slider -->
                <div class="screen-slider" id="worker-slider">""",
"""                <!-- UNIFIED ONBOARDING SCREEN -->
                <div class="login-screen" id="app-login-screen">
                    <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:linear-gradient(135deg,rgba(52,199,89,0.12),rgba(0,122,255,0.08));pointer-events:none;"></div>
                    <div style="position:absolute;bottom:-40px;left:-40px;width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,rgba(0,122,255,0.08),rgba(52,199,89,0.05));pointer-events:none;"></div>

                    <div style="margin-top:48px; margin-bottom: 24px; text-align:center;">
                        <div class="login-logo">Melo<span>Go</span></div>
                        <div class="login-tagline">Válaszd ki a szereped</div>
                    </div>

                    <!-- Role Selection Cards -->
                    <div style="display:flex;flex-direction:column; margin-bottom: 24px;">
                        <div class="role-card active" id="role-card-worker" onclick="selectLoginRole('worker')">
                            <div style="width:40px;height:40px;border-radius:12px;background:rgba(52,199,89,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#34c759;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/></svg>
                            </div>
                            <div>
                                <div style="font-size:14px;font-weight:700;color:#1c1c1e;">Munkát keresek</div>
                                <div style="font-size:11px;color:#86868b;margin-top:2px;">Vállalok házkörüli munkákat a közelemben</div>
                            </div>
                        </div>

                        <div class="role-card" id="role-card-employer" onclick="selectLoginRole('employer')">
                            <div style="width:40px;height:40px;border-radius:12px;background:rgba(0,122,255,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#007aff;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                            </div>
                            <div>
                                <div style="font-size:14px;font-weight:700;color:#1c1c1e;">Munkát adok</div>
                                <div style="font-size:11px;color:#86868b;margin-top:2px;">Keresek megbízható embert feladatokra</div>
                            </div>
                        </div>
                        <div style="font-size: 11px; color: #9CA3AF; text-align: center; margin-top: -4px;">Bármikor válthatsz a két szerep között.</div>
                    </div>

                    <div class="login-form">
                        <input type="email" class="login-input" id="app-email" value="bence@melogo.hu" placeholder="Email cím">
                        <input type="password" class="login-input" id="app-pw" value="" placeholder="Jelszó (pl. melogo123)">
                        <button class="login-btn" onclick="loginApp()" id="app-login-btn">
                            Regisztrálok &amp; Bejelentkezem
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        <button class="login-faceid" onclick="loginAppFaceID()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01M15 10h.01M9 15h6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                            Folytatás Face ID-val
                        </button>
                    </div>
                </div>

                <!-- Slider -->
                <div class="screen-slider" id="app-slider">""")

# 5. Home Screen modification (Adding Role Switcher and wrapping views)
content = content.replace(
"""                    <!-- DIÁK SCREEN 0: MUNKALISTA -->
                    <div class="screen">
                        <div class="header-midnight">
                            <div class="header-top">
                                <div class="brand-logo">Melo<span>Go</span></div>
                            </div>
                            <div class="welcome-text">Szia, Bence</div>
                            <div class="main-question">Vállalj munkát!</div>
                            <div class="search-container" onclick="navigateWorker(1)" style="display: flex; align-items: center; gap: 8px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-text-muted); opacity: 0.8;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <span>Keress munkát a közelben...</span>
                            </div>
                        </div>

                        <!-- GPS HELYZET ÉS HATÓKÖR CSÚSZKA (RADIUS SLIDER) -->""",
"""                    <!-- SCREEN 0: HOME (UNIFIED) -->
                    <div class="screen" id="home-screen-scroll-container">
                        <div class="header-midnight">
                            <div class="header-top" style="justify-content: center; margin-bottom: 12px;">
                                <div class="brand-logo">Melo<span>Go</span></div>
                            </div>
                            
                            <!-- Role Switcher -->
                            <div class="role-switcher-container">
                                <button class="role-btn active" id="role-btn-worker" onclick="switchRole('worker')">Munkás</button>
                                <button class="role-btn" id="role-btn-employer" onclick="switchRole('employer')">Megbízó</button>
                            </div>
                            
                            <!-- Shared Search field (shown only in worker mode) -->
                            <div class="search-container" id="home-search-pill" onclick="navigateApp(1)" style="display: flex; align-items: center; gap: 8px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-text-muted); opacity: 0.8;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <span>Keress munkát a közelben...</span>
                            </div>
                        </div>
                        
                        <!-- WORKER VIEW -->
                        <div id="home-worker-view">
                        <!-- GPS HELYZET ÉS HATÓKÖR CSÚSZKA (RADIUS SLIDER) -->""")

# Find end of Worker Screen 0, wrap it and add Employer Screen 0.
# The worker screen ends right before <!-- DIÁK SCREEN 1: KETTŐS KERESŐ -->
content = content.replace(
"""                            </div>
                        </div>
                    </div>

                    <!-- DIÁK SCREEN 1: KETTŐS KERESŐ -->""",
"""                            </div>
                        </div>
                        </div> <!-- End of home-worker-view -->
                        
                        <!-- EMPLOYER VIEW -->
                        <div id="home-employer-view">
                            <div style="padding: 20px;">
                                <button class="btn" onclick="openEmployerFormOverlay()" style="background-color: var(--color-blue-uber); box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Adj fel új munkát
                                </button>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                                    <div style="background: white; border-radius: 16px; padding: 12px; border: 0.5px solid var(--color-border); text-align: center;">
                                        <div style="font-size: 20px; font-weight: 800; color: var(--color-blue-uber);">1</div>
                                        <div style="font-size: 10px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Aktív hirdetés</div>
                                    </div>
                                    <div style="background: white; border-radius: 16px; padding: 12px; border: 0.5px solid var(--color-border); text-align: center;">
                                        <div style="font-size: 20px; font-weight: 800; color: var(--color-text-dark);">0 Ft</div>
                                        <div style="font-size: 10px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Kifizetve</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section-jobs" id="employer-active-jobs-section">
                                <div class="section-title">Feladott munkáid</div>
                                <div class="jobs-list" id="employer-jobs-list">
                                    <div class="job-card" onclick="openEmployerJobDetail('Fűnyírás a Desedánál', '12 000 Ft', 'Somogy, Kaposvár, Deseda u. 12.')">
                                        <div class="job-card-top">
                                            <div class="job-title-container">
                                                <div class="job-icon-box" style="background-color: #eff6ff; color: var(--color-blue-uber); display: flex; align-items: center; justify-content: center;">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M12 22V12"/>
                                                        <path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/>
                                                        <path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/>
                                                    </svg>
                                                </div>
                                                <div class="job-title"><h4>Fűnyírás — Somogy, Kaposvár</h4></div>
                                            </div>
                                            <div class="job-card-price" id="employer-job-list-price">12 000 Ft</div>
                                        </div>
                                        <div class="job-card-meta">
                                            <span id="employer-job-list-status" style="color: var(--color-blue-uber); font-weight: 700;">Állapot: Keresés</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="employer-empty-state" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; margin-top: 20px;">
                                <div style="width: 80px; height: 80px; border-radius: 40px; background: rgba(0,122,255,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--color-blue-uber);">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                </div>
                                <h3 style="font-family: Outfit; font-size: 18px; margin-bottom: 8px;">Még nem adtál fel munkát</h3>
                                <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 24px;">Készíts új hirdetést, és találd meg a tökéletes diákot a feladatra percek alatt.</p>
                                <button class="btn" onclick="openEmployerFormOverlay()" style="background-color: var(--color-green-go);">Első munkám feladása</button>
                            </div>
                        </div>
                    </div>

                    <!-- SCREEN 1: KETTŐS KERESŐ (Shared) -->""")

# 6. Change all `navigateWorker` calls inside the tabs to `navigateApp`
content = content.replace('onclick="navigateWorker(1)"', 'onclick="navigateApp(1)"')

# 7. Update bottom nav - make it a single nav for #phone-app and delete the employer phone completely.
# Find the start of employer phone
employer_phone_start = """        <!-- ======================================================= -->
        <!-- 2. JOBB OLDALI TELEFON: MUNKÁLTATÓ (HIRDETŐ) NÉZET -->
        <!-- ======================================================= -->"""
employer_phone_end = """    <!-- TÁJÉKOZTATÓ SZEKCIÓ ASZTALI NÉZETRE -->"""

start_idx = content.find(employer_phone_start)
end_idx = content.find(employer_phone_end)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

# But wait, we need to extract the "Employer Job Posting Form" (Screen 1 of employer) into an overlay!
# We can just write the overlay html directly before the bottom nav.
# Find the bottom nav in worker.
nav_start = """                <!-- Alsó navigáció (4 GOMBOS DIÁK NAVIGÁCIÓ) -->"""
nav_replace = """                <!-- Új munka feladása Overlay -->
                <div class="settings-overlay" id="employer-form-overlay">
                    <div class="settings-header">
                        <button class="settings-back-btn" onclick="closeEmployerFormOverlay()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Mégse
                        </button>
                        <div class="settings-title">Új munka feladása</div>
                    </div>
                    <div class="settings-scroll" style="background-color: var(--color-bg-light); padding: 0;">
                        <div class="form-card" style="margin-top: 0; border-radius: 0; box-shadow: none;">
                            <div>
                                <div class="form-label">Munka kategóriája</div>
                                <div class="category-grid">
                                    <button class="cat-select-btn active" id="emp-cat-Kert" onclick="selectEmployerFormCat('Kert')">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/>
                                        </svg> Kert
                                    </button>
                                    <button class="cat-select-btn" id="emp-cat-Festés" onclick="selectEmployerFormCat('Festés')">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#af52de" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12 22C17.52 22 22 17.52 22 12C22 5.5 16.5 2 12 2C6.5 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
                                            <circle cx="7.5" cy="10.5" r="1" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1" fill="currentColor"/><circle cx="10.5" cy="16.5" r="1" fill="currentColor"/>
                                        </svg> Festés
                                    </button>
                                    <button class="cat-select-btn" id="emp-cat-Autó" onclick="selectEmployerFormCat('Autó')">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9500" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.2-1.4.7L3 11c-.6.8-1 1.8-1 2.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M7 17h10"/>
                                        </svg> Autó
                                    </button>
                                    <button class="cat-select-btn" id="emp-cat-Ház" onclick="selectEmployerFormCat('Ház')">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="12" width="6" height="5" rx="1"/>
                                        </svg> Ház b.
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div class="form-label">Pontos munka kiválasztása</div>
                                <select class="dropdown-field" id="emp-job-select" onchange="updatePredefinedJobPrice(this.value)">
                                    <!-- Populated by JS -->
                                </select>
                            </div>

                            <div>
                                <div class="form-label">Egyedi Részletek / Leírás</div>
                                <input type="text" class="input-field" id="emp-details" placeholder="Pl. kb. 150m² fűnyírás, csiszolópapír van...">
                            </div>

                            <div>
                                <div class="form-label">Munkavégzés Helyszíne</div>
                                <div class="form-row" style="grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                                    <input type="text" class="input-field" id="emp-county" value="Somogy" placeholder="Megye">
                                    <input type="text" class="input-field" id="emp-city" value="Kaposvár" placeholder="Város">
                                </div>
                                <div class="form-row" style="grid-template-columns: 1.4fr 0.6fr; gap: 8px;">
                                    <input type="text" class="input-field" id="emp-street" placeholder="Utca (pl. Fő utca)">
                                    <input type="text" class="input-field" id="emp-house" placeholder="Házszám">
                                </div>
                            </div>

                            <div class="price-offer-card">
                                <div class="offer-left">
                                    <p>Felkínált összeg</p>
                                    <span id="emp-recommended-label">Ajánlott: 12 000 Ft</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 2px;">
                                    <input type="number" id="emp-price-input" class="price-input" value="12000">
                                    <span style="font-family: Outfit; font-weight: 800; color: #16a34a; font-size: 20px;">Ft</span>
                                </div>
                            </div>

                            <button class="btn" style="background-color: var(--color-midnight);" onclick="employerPublishJob()">
                                Hirdetés közzététele 🚀
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Hirdető Chat & Jóváhagyás Overlay -->
                <div class="action-overlay" id="employer-action-overlay">
                    <div class="action-header" style="background-color: var(--color-blue-uber);">
                        <span style="font-weight: 700; font-size: 14px;" id="employer-action-title">Kovács Bence (Diák)</span>
                        <button style="background:none; border:none; color:white; font-weight:700; cursor:pointer;" onclick="closeEmployerJobDetail()">Bezár</button>
                    </div>
                    <div class="chat-body" id="employer-chat-messages"></div>
                    
                    <div style="background-color: white; padding: 14px; border-top: 1px solid var(--color-border);" id="employer-action-footer"></div>
                </div>

                <!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->"""
content = content.replace(nav_start, nav_replace)

# Modify the navigation buttons to call navigateApp
content = content.replace('onclick="navigateWorker(0)"', 'onclick="navigateApp(0)"')
content = content.replace('onclick="navigateWorker(2)"', 'onclick="navigateApp(2)"')
content = content.replace('onclick="navigateWorker(3)"', 'onclick="navigateApp(3)"')

content = content.replace('id="worker-nav-0"', 'id="app-nav-0"')
content = content.replace('id="worker-nav-1"', 'id="app-nav-1"')
content = content.replace('id="worker-nav-2"', 'id="app-nav-2"')
content = content.replace('id="worker-nav-3"', 'id="app-nav-3"')


# 8. Refactor Javascript
js_block_1 = """        // ==========================================
        // SESSION KEZELÉS (localStorage alapú)
        // ==========================================
        // Oldal betöltésekor: session ellenőrzés + inicializálás
        window.onload = function() {
            // Setup defaults
            let initialCatLabel = 'Minden feladat';
            document.getElementById('worker-job-filter-display').innerText = initialCatLabel;
            filterWorkerJobs('all');

            // Ha már be volt jelentkezve a diák → skip login
            if (localStorage.getItem('melogo_worker_session')) {
                const screen = document.getElementById('worker-login-screen');
                if (screen) screen.classList.add('hidden');
            }

            // Ha már be volt jelentkezve a munkáltató → skip login
            if (localStorage.getItem('melogo_employer_session')) {
                const screen = document.getElementById('employer-login-screen');
                if (screen) screen.classList.add('hidden');
            }
        };"""

js_block_1_new = """        // ==========================================
        // SESSION ÉS ROLE KEZELÉS
        // ==========================================
        let currentRole = 'worker';
        let loginSelectedRole = 'worker';

        window.onload = function() {
            let initialCatLabel = 'Minden feladat';
            document.getElementById('worker-job-filter-display').innerText = initialCatLabel;
            filterWorkerJobs('all');

            if (localStorage.getItem('melogo_app_session')) {
                const screen = document.getElementById('app-login-screen');
                if (screen) screen.classList.add('hidden');
                
                const savedRole = localStorage.getItem('melogo_active_role');
                if (savedRole) {
                    switchRole(savedRole);
                } else {
                    switchRole('worker');
                }
            } else {
                switchRole('worker'); // default for login screen
            }
        };

        function selectLoginRole(role) {
            loginSelectedRole = role;
            document.getElementById('role-card-worker').classList.remove('active');
            document.getElementById('role-card-employer').classList.remove('active');
            document.getElementById(`role-card-${role}`).classList.add('active');
        }

        function loginApp() {
            const email = document.getElementById('app-email').value;
            const pw = document.getElementById('app-pw').value;
            if (email && pw) {
                document.getElementById('app-login-screen').classList.add('hidden');
                localStorage.setItem('melogo_app_session', 'true');
                switchRole(loginSelectedRole);
            } else {
                alert('Kérlek add meg az emailt és jelszót!');
            }
        }

        function loginAppFaceID() {
            document.getElementById('app-login-screen').classList.add('hidden');
            localStorage.setItem('melogo_app_session', 'true');
            switchRole(loginSelectedRole);
        }

        function switchRole(role) {
            currentRole = role;
            localStorage.setItem('melogo_active_role', role);
            
            // Haptic
            if (navigator.vibrate) navigator.vibrate(50);
            
            // Scroll reset
            const homeScreen = document.getElementById('home-screen-scroll-container');
            if (homeScreen) homeScreen.scrollTop = 0;

            // UI Toggle
            document.getElementById('role-btn-worker').classList.remove('active');
            document.getElementById('role-btn-employer').classList.remove('active');
            document.getElementById(`role-btn-${role}`).classList.add('active');

            const searchPill = document.getElementById('home-search-pill');
            
            if (role === 'worker') {
                document.getElementById('home-worker-view').style.display = 'flex';
                document.getElementById('home-employer-view').style.display = 'none';
                if (searchPill) searchPill.style.display = 'flex';
            } else {
                document.getElementById('home-worker-view').style.display = 'none';
                document.getElementById('home-employer-view').style.display = 'flex';
                if (searchPill) searchPill.style.display = 'none';
                
                // Empty state logic (mock: if no jobs exist)
                // We mock this by checking if the active jobs section is hidden.
                // For the demo, we assume there is one active job by default (Fűnyírás a Desedánál)
                // If it's hidden, we show the empty state.
            }
        }
        
        function openEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.add('open');
            selectEmployerFormCat('Kert'); // load default options
        }
        function closeEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.remove('open');
        }"""
        
content = content.replace(js_block_1, js_block_1_new)

# 9. Update navigateWorker to navigateApp
nav_js = """        // 1. DIÁK NAVIGÁCIÓ
        function navigateWorker(index) {
            document.getElementById('worker-slider').style.transform = `translateX(-${index * 25}%)`;
            const navs = document.querySelectorAll('#phone-worker .bottom-nav .nav-item');
            navs.forEach(nav => nav.classList.remove('active'));
            document.getElementById(`worker-nav-${index}`).classList.add('active');

            if (index !== 1) {
                document.getElementById('map-preview-card').style.display = 'none';
            }
        }"""
nav_js_new = """        // EGYESÍTETT NAVIGÁCIÓ
        function navigateApp(index) {
            document.getElementById('app-slider').style.transform = `translateX(-${index * 25}%)`;
            const navs = document.querySelectorAll('#phone-app .bottom-nav .nav-item');
            navs.forEach(nav => nav.classList.remove('active'));
            document.getElementById(`app-nav-${index}`).classList.add('active');

            if (index !== 1) {
                document.getElementById('map-preview-card').style.display = 'none';
            }
        }"""
content = content.replace(nav_js, nav_js_new)

# Remove Employer Navigation as it's dead code now
content = re.sub(r"// 2. HIRDETŐ NAVIGÁCIÓ.*?}", "", content, flags=re.DOTALL)

# Delete old login functions
content = re.sub(r"function loginWorker.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"function loginWorkerFaceID.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"function loginEmployer.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"function loginEmployerFaceID.*?\}", "", content, flags=re.DOTALL)

# Update publish job to close overlay and update employer list
content = content.replace("function employerPublishJob() {", """function employerPublishJob() {
            closeEmployerFormOverlay();""")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done refactoring via script.")
