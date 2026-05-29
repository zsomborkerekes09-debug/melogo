const fs = require('fs');
const path = require('path');

const filepath = path.join('C:', 'Users', 'zsomb', '.gemini', 'antigravity', 'scratch', 'melogo', 'frontend', 'index.html');
let content = fs.readFileSync(filepath, 'utf8');

// 1. Redesign Onboarding Screen
const oldLoginStart = `                <!-- UNIFIED ONBOARDING SCREEN -->`;
const oldLoginEnd = `                <!-- Slider -->`;

const newLoginBlock = `                <!-- UNIFIED ONBOARDING SCREEN (Apple Style Redesign) -->
                <div class="login-screen" id="app-login-screen" style="background: white; border-radius: 40px; display: flex; flex-direction: column; align-items: center; padding-top: 60px;">
                    <!-- Removed blobs and gradients -->

                    <div style="margin-bottom: 40px; text-align:center;">
                        <div class="brand-logo" style="font-size: 32px; color: #0A0F2E; margin-bottom: 8px;">Melo<span style="color: #22C55E;">Go</span></div>
                        <div style="font-size: 15px; color: #86868b; font-family: Outfit; font-weight: 500;">Vállalj munkát a közeledben.</div>
                    </div>

                    <!-- Side-by-side Role Selection Cards -->
                    <div style="display:flex; width: 100%; gap: 12px; margin-bottom: 16px; padding: 0 24px; box-sizing: border-box;">
                        
                        <div class="role-card-mini active" id="role-card-worker" onclick="selectLoginRole('worker')" style="flex: 1; border: 1.5px solid #22C55E; border-radius: 16px; background: white; padding: 16px; display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; transition: all 0.2s ease;">
                            <div class="role-check-icon" style="position: absolute; top: 8px; right: 8px; color: #22C55E;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="1.5" style="margin-bottom: 8px;"><path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/></svg>
                            <div style="font-size:14px;font-weight:600;color:#0A0F2E;">Munkát keresek</div>
                        </div>

                        <div class="role-card-mini" id="role-card-employer" onclick="selectLoginRole('employer')" style="flex: 1; border: 0.5px solid #E5E7EB; border-radius: 16px; background: white; padding: 16px; display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; transition: all 0.2s ease;">
                            <div class="role-check-icon" style="position: absolute; top: 8px; right: 8px; color: transparent;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="1.5" style="margin-bottom: 8px;"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                            <div style="font-size:14px;font-weight:600;color:#0A0F2E;">Munkát adok</div>
                        </div>

                    </div>

                    <div style="font-size: 12px; color: #9CA3AF; text-align: center; margin-bottom: 24px; font-weight: 500;">Bármikor válthatsz a két szerep között.</div>

                    <div style="width: 100%; padding: 0 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px;">
                        <input type="email" id="app-email" value="bence@melogo.hu" placeholder="Email cím" style="width: 100%; padding: 16px; border-radius: 14px; border: none; background-color: #F8F9FB; font-size: 14px; color: #0A0F2E; outline: none; box-sizing: border-box; font-family: 'Outfit', sans-serif;">
                        <input type="password" id="app-pw" value="" placeholder="Jelszó (pl. melogo123)" style="width: 100%; padding: 16px; border-radius: 14px; border: none; background-color: #F8F9FB; font-size: 14px; color: #0A0F2E; outline: none; box-sizing: border-box; font-family: 'Outfit', sans-serif;">
                        
                        <button onclick="loginApp()" id="app-login-btn" style="width: 100%; margin-top: 12px; padding: 16px; border-radius: 14px; border: none; background-color: #0A0F2E; color: white; font-size: 16px; font-weight: 600; font-family: 'Outfit', sans-serif; cursor: pointer; transition: transform 0.1s ease;">
                            Regisztrálok &amp; Bejelentkezem
                        </button>
                    </div>
                </div>

`;

let startIdx = content.indexOf(oldLoginStart);
let endIdx = content.indexOf(oldLoginEnd);
if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newLoginBlock + content.substring(endIdx);
}

// 2. Add Employer Search Mode Branching
// Replace Search toggle bar text
const oldSearchToggle = `<button id="search-toggle-list" class="search-map-filter-btn" onclick="switchSearchTab('list')" style="flex: 1; border: none; padding: 6px; font-size: 11px; font-weight: 700; cursor: pointer; border-radius: 16px; background: none; color: white; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> Lista/Kereső
                                </button>`;
const newSearchToggle = `<button id="search-toggle-list" class="search-map-filter-btn" onclick="switchSearchTab('list')" style="flex: 1; border: none; padding: 6px; font-size: 11px; font-weight: 700; cursor: pointer; border-radius: 16px; background: none; color: white; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> <span id="search-tab-title">Lista/Kereső</span>
                                </button>`;
content = content.replace(oldSearchToggle, newSearchToggle);

const oldSearchInput = `<div class="search-input-box">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input type="text" id="worker-search-input" placeholder="Írd be: fűnyírás, festés, takarítás..." onkeyup="filterWorkerJobs('all')">
                            </div>`;
const newSearchInput = `<div class="search-input-box">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input type="text" id="worker-search-input" placeholder="Írd be: fűnyírás, festés, takarítás..." onkeyup="filterSearchMode()">
                            </div>`;
content = content.replace(oldSearchInput, newSearchInput);

// Add employer sorting options & worker list container
const searchSortOld = `<div class="sorting-bar" style="margin-top: 16px;">
                                <span class="sort-title">Rendezés</span>
                                <div class="sort-options">
                                    <button class="sort-btn active">Távolság</button>
                                    <button class="sort-btn">Ár</button>
                                    <button class="sort-btn">Sürgős</button>
                                </div>
                            </div>

                            <div class="jobs-list" id="search-list-results" style="margin-top: 16px; padding-bottom: 40px;">
                                <!-- Ide másoljuk a kártyákat dinamikusan -->
                            </div>`;
                            
const searchSortNew = `<div class="sorting-bar" style="margin-top: 16px;" id="search-worker-sort">
                                <span class="sort-title">Rendezés</span>
                                <div class="sort-options">
                                    <button class="sort-btn active">Távolság</button>
                                    <button class="sort-btn">Ár</button>
                                    <button class="sort-btn">Sürgős</button>
                                </div>
                            </div>
                            
                            <div class="sorting-bar" style="margin-top: 16px; display: none;" id="search-employer-sort">
                                <span class="sort-title">Rendezés</span>
                                <div class="sort-options">
                                    <button class="sort-btn active">Értékelés</button>
                                    <button class="sort-btn">Legközelebb</button>
                                    <button class="sort-btn">Tapasztalat</button>
                                </div>
                            </div>

                            <div class="jobs-list" id="search-list-results" style="margin-top: 16px; padding-bottom: 40px;">
                                <!-- Worker jobs copied here -->
                            </div>
                            
                            <div class="jobs-list" id="search-employer-results" style="margin-top: 16px; padding-bottom: 40px; display: none;">
                                <!-- Worker Profile Cards shown to Employers -->
                                
                                <div class="job-card" style="padding: 16px; align-items: center;">
                                    <div style="display: flex; gap: 12px; width: 100%;">
                                        <div style="width: 48px; height: 48px; border-radius: 24px; background: linear-gradient(135deg, #10b981, #059669); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; flex-shrink: 0;">KB</div>
                                        <div style="flex-grow: 1;">
                                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                                <div style="font-weight: 700; color: var(--color-navy); font-size: 15px;">Kovács Bence</div>
                                                <div style="display:flex;align-items:center;gap:3px;">
                                                    <span style="color:#f59e0b;font-size:12px;">&#9733;</span>
                                                    <span style="color:var(--color-navy);font-size:12px;font-weight:700;">4.9</span>
                                                </div>
                                            </div>
                                            <div style="font-size: 11px; color: var(--color-text-muted); margin-bottom: 8px;">Kaposvár (0.4 km)</div>
                                            <div style="display: flex; gap: 6px;">
                                                <span style="font-size: 10px; background: rgba(0,0,0,0.05); color: var(--color-text-muted); padding: 4px 8px; border-radius: 8px;">Kertészet</span>
                                                <span style="font-size: 10px; background: rgba(0,0,0,0.05); color: var(--color-text-muted); padding: 4px 8px; border-radius: 8px;">Autómosás</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onclick="openJobOfferOverlay('Kovács Bence')" style="width: 100%; margin-top: 14px; background-color: var(--color-navy); color: white; border: none; padding: 10px; border-radius: 12px; font-family: Outfit; font-weight: 600; font-size: 13px; cursor: pointer;">
                                        Ajánlj munkát
                                    </button>
                                </div>
                                
                                <div class="job-card" style="padding: 16px; align-items: center;">
                                    <div style="display: flex; gap: 12px; width: 100%;">
                                        <div style="width: 48px; height: 48px; border-radius: 24px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; flex-shrink: 0;">NT</div>
                                        <div style="flex-grow: 1;">
                                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                                <div style="font-weight: 700; color: var(--color-navy); font-size: 15px;">Nagy Tamás</div>
                                                <div style="display:flex;align-items:center;gap:3px;">
                                                    <span style="color:#f59e0b;font-size:12px;">&#9733;</span>
                                                    <span style="color:var(--color-navy);font-size:12px;font-weight:700;">4.7</span>
                                                </div>
                                            </div>
                                            <div style="font-size: 11px; color: var(--color-text-muted); margin-bottom: 8px;">Kaposvár (2.1 km)</div>
                                            <div style="display: flex; gap: 6px;">
                                                <span style="font-size: 10px; background: rgba(0,0,0,0.05); color: var(--color-text-muted); padding: 4px 8px; border-radius: 8px;">Festés</span>
                                                <span style="font-size: 10px; background: rgba(0,0,0,0.05); color: var(--color-text-muted); padding: 4px 8px; border-radius: 8px;">Takarítás</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onclick="openJobOfferOverlay('Nagy Tamás')" style="width: 100%; margin-top: 14px; background-color: var(--color-navy); color: white; border: none; padding: 10px; border-radius: 12px; font-family: Outfit; font-weight: 600; font-size: 13px; cursor: pointer;">
                                        Ajánlj munkát
                                    </button>
                                </div>
                                
                            </div>`;
content = content.replace(searchSortOld, searchSortNew);

// Add Job Offer Overlay to bottom of HTML
const offerOverlay = `
                <!-- Ajánlat Overlay Megbízóknak -->
                <div class="settings-overlay" id="job-offer-overlay">
                    <div class="settings-header" style="background-color: white; border-bottom: 1px solid var(--color-border); z-index: 10;">
                        <button class="settings-back-btn" onclick="document.getElementById('job-offer-overlay').classList.remove('open')" style="color: var(--color-text-dark);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Vissza
                        </button>
                        <div class="settings-title">Ajánlat küldése</div>
                    </div>
                    <div class="settings-scroll" style="background-color: var(--color-bg-light); padding: 20px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 13px; color: var(--color-text-muted);">Munkás neve</div>
                            <div style="font-size: 18px; font-weight: 700; color: var(--color-navy);" id="offer-worker-name">Kovács Bence</div>
                        </div>
                        
                        <div class="form-card" style="margin-top: 0;">
                            <div>
                                <div class="form-label">Munka leírása</div>
                                <input type="text" class="input-field" placeholder="Pl. Fűnyírás a kertben">
                            </div>
                            
                            <div>
                                <div class="form-label">Időpont</div>
                                <input type="text" class="input-field" placeholder="Pl. Holnap, 14:00">
                            </div>
                            
                            <div class="price-offer-card">
                                <div class="offer-left">
                                    <p>Ajánlott összeg</p>
                                </div>
                                <div style="display: flex; align-items: center; gap: 2px;">
                                    <input type="number" class="price-input" value="10000">
                                    <span style="font-family: Outfit; font-weight: 800; color: #16a34a; font-size: 20px;">Ft</span>
                                </div>
                            </div>

                            <button class="btn" style="background-color: var(--color-green-go); margin-top: 10px;" onclick="document.getElementById('job-offer-overlay').classList.remove('open');">
                                Ajánlat elküldése 🚀
                            </button>
                        </div>
                    </div>
                </div>
`;
content = content.replace(`                <!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->`, offerOverlay + `                <!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->`);


// Modify Javascript
const oldRoleSelectJS = `        function selectLoginRole(role) {
            loginSelectedRole = role;
            document.getElementById('role-card-worker').classList.remove('active');
            document.getElementById('role-card-employer').classList.remove('active');
            document.getElementById(\`role-card-\${role}\`).classList.add('active');
        }`;
        
const newRoleSelectJS = `        function selectLoginRole(role) {
            loginSelectedRole = role;
            document.getElementById('role-card-worker').style.borderColor = '#E5E7EB';
            document.getElementById('role-card-employer').style.borderColor = '#E5E7EB';
            document.getElementById('role-card-worker').querySelector('.role-check-icon').style.color = 'transparent';
            document.getElementById('role-card-employer').querySelector('.role-check-icon').style.color = 'transparent';
            
            document.getElementById(\`role-card-\${role}\`).style.borderColor = '#22C55E';
            document.getElementById(\`role-card-\${role}\`).querySelector('.role-check-icon').style.color = '#22C55E';
        }`;
content = content.replace(oldRoleSelectJS, newRoleSelectJS);

const oldSwitchRoleJS = `            const searchPill = document.getElementById('home-search-pill');
            
            if (role === 'worker') {
                document.getElementById('home-worker-view').style.display = 'flex';
                document.getElementById('home-employer-view').style.display = 'none';
                if (searchPill) searchPill.style.display = 'flex';
            } else {
                document.getElementById('home-worker-view').style.display = 'none';
                document.getElementById('home-employer-view').style.display = 'flex';
                if (searchPill) searchPill.style.display = 'none';
                
                // Empty state logic (mock: if no jobs exist)
                // For the demo, we assume there is one active job by default (Fűnyírás a Desedánál)
                // If it's hidden, we show the empty state.
            }`;
            
const newSwitchRoleJS = `            const searchPill = document.getElementById('home-search-pill');
            const searchInput = document.getElementById('worker-search-input');
            const searchTabTitle = document.getElementById('search-tab-title');
            const mapToggleBtn = document.getElementById('search-toggle-map');
            
            if (role === 'worker') {
                document.getElementById('home-worker-view').style.display = 'flex';
                document.getElementById('home-employer-view').style.display = 'none';
                if (searchPill) searchPill.style.display = 'flex';
                
                // Search screen logic
                document.getElementById('search-worker-sort').style.display = 'flex';
                document.getElementById('search-employer-sort').style.display = 'none';
                document.getElementById('search-list-results').style.display = 'block';
                document.getElementById('search-employer-results').style.display = 'none';
                if(searchInput) searchInput.placeholder = "Írd be: fűnyírás, festés, takarítás...";
                if(searchTabTitle) searchTabTitle.innerText = "Lista/Kereső";
                if(mapToggleBtn) mapToggleBtn.style.display = 'flex'; // Workers can see map
                
            } else {
                document.getElementById('home-worker-view').style.display = 'none';
                document.getElementById('home-employer-view').style.display = 'flex';
                if (searchPill) searchPill.style.display = 'none';
                
                // Search screen logic
                document.getElementById('search-worker-sort').style.display = 'none';
                document.getElementById('search-employer-sort').style.display = 'flex';
                document.getElementById('search-list-results').style.display = 'none';
                document.getElementById('search-employer-results').style.display = 'block';
                if(searchInput) searchInput.placeholder = "Írd be: fűnyírás, festés...";
                if(searchTabTitle) searchTabTitle.innerText = "Keress munkást";
                if(mapToggleBtn) mapToggleBtn.style.display = 'none'; // Employers only see list of workers
                
                // Force switch to list view in employer mode
                switchSearchTab('list');
            }`;
content = content.replace(oldSwitchRoleJS, newSwitchRoleJS);

// Add missing JS functions
const jsFunctions = `
        function filterSearchMode() {
            if(currentRole === 'worker') {
                filterWorkerJobs('all');
            } else {
                // Employer search logic mock (not fully implemented for demo)
            }
        }
        function openJobOfferOverlay(workerName) {
            document.getElementById('offer-worker-name').innerText = workerName;
            document.getElementById('job-offer-overlay').classList.add('open');
        }
`;
content = content.replace(`        function switchSearchTab(tab) {`, jsFunctions + `\n        function switchSearchTab(tab) {`);


fs.writeFileSync(filepath, content, 'utf8');
console.log('Phase 6 Refactoring complete.');
