const fs = require('fs');
const path = require('path');

const filepath = path.join('C:', 'Users', 'zsomb', '.gemini', 'antigravity', 'scratch', 'melogo', 'frontend', 'index.html');
let content = fs.readFileSync(filepath, 'utf8');

// The replacement HTML block
const newProfileHtml = `                    <!-- SCREEN 3: PROFIL -->
                    <div class="screen" id="app-profile-screen" style="background-color: #F8F9FB; overflow-y: auto; display: none;">
                        
                        <!-- Top section — Hero area (Dark Navy) -->
                        <div style="background-color: #0A0F2E; padding: 40px 20px 80px 20px; position: relative; text-align: center;">
                            <button onclick="document.getElementById('worker-settings').classList.add('open')" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; cursor: pointer;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>

                            <div style="position: relative; display: inline-block; margin-top: 10px; margin-bottom: 12px;">
                                <div style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #22C55E; background-color: #333; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 500; color: white;">
                                    KB
                                </div>
                                <div style="position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; background-color: #22C55E; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid #0A0F2E;">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>

                            <div style="font-size: 18px; font-weight: 500; color: white; margin-bottom: 4px;">Kovács Bence</div>
                            <div style="display:flex; align-items:center; justify-content:center; gap:4px; margin-bottom: 4px;">
                                <span style="color:#f4c542; font-size:13px;">★★★★★</span>
                                <span style="color:white; font-size:13px;">4.9</span>
                            </div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.55); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                Kaposvár • Kaposvári Egyetem
                            </div>
                        </div>

                        <!-- Stats bar floating card -->
                        <div style="margin: -35px 20px 20px 20px; background-color: white; border-radius: 16px; border: 1px solid #F1F1F1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; position: relative; z-index: 2; padding: 16px 0;">
                            <div style="flex: 1; text-align: center; border-right: 1px solid #F1F1F1;">
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
                            </div>
                        </div>

                        <!-- Content Sections Container -->
                        <div style="padding: 0 20px 40px 20px; display: flex; flex-direction: column; gap: 24px;">
                            
                            <!-- Section 1: SZEREPEM -->
                            <div>
                                <div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Szerepem</div>
                                <div style="background-color: white; border-radius: 16px; border: 1px solid #F1F1F1; padding: 16px;">
                                    <div class="role-switcher-container" style="max-width: 100%; margin-bottom: 8px; background-color: #F8F9FB;">
                                        <button class="role-btn active" id="role-btn-worker" onclick="switchRole('worker')" style="color: #0A0F2E;">Munkás</button>
                                        <button class="role-btn" id="role-btn-employer" onclick="switchRole('employer')" style="color: #0A0F2E;">Megbízó</button>
                                    </div>
                                    <div id="role-description-text" style="font-size: 11px; color: #9CA3AF; text-align: center;">
                                        Közeli munkákat keresel és vállalsz.
                                    </div>
                                </div>
                            </div>

                            <!-- Section 2: FIÓKOM -->
                            <div>
                                <div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Fiókom</div>
                                <div style="background-color: white; border-radius: 16px; border: 1px solid #F1F1F1;">
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Bemutatkozás szerkesztése</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                    <div style="margin-left: 48px; height: 0.5px; background-color: #E5E7EB;"></div>
                                    
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;" onclick="document.getElementById('photo-upload').click()">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Profilkép módosítása</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                    <div style="margin-left: 48px; height: 0.5px; background-color: #E5E7EB;"></div>
                                    
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Szaktudások kezelése</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                    <div style="margin-left: 48px; height: 0.5px; background-color: #E5E7EB;"></div>
                                    
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Értesítések</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 3: TEVÉKENYSÉG -->
                            <div>
                                <div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Tevékenység</div>
                                <div style="background-color: white; border-radius: 16px; border: 1px solid #F1F1F1;">
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Letöltött összeg</span>
                                        <span style="font-size: 15px; color: #22C55E; margin-right: 8px;">47 500 Ft</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                    <div style="margin-left: 48px; height: 0.5px; background-color: #E5E7EB;"></div>
                                    
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Utolsó meló</span>
                                        <span style="font-size: 14px; color: #9CA3AF; margin-right: 8px;">2026. máj. 22.</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 4: TÁMOGATÁS -->
                            <div>
                                <div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Támogatás</div>
                                <div style="background-color: white; border-radius: 16px; border: 1px solid #F1F1F1;">
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Súgó és GYIK</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                    <div style="margin-left: 48px; height: 0.5px; background-color: #E5E7EB;"></div>
                                    
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Adatvédelem</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                    <div style="margin-left: 48px; height: 0.5px; background-color: #E5E7EB;"></div>
                                    
                                    <div style="height: 52px; display: flex; align-items: center; padding: 0 16px; cursor: pointer;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        <span style="font-size: 15px; color: #000; flex-grow: 1;">Felhasználási feltételek</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 5: FIÓK -->
                            <div>
                                <div style="font-size: 12px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.5px; margin-bottom: 8px; margin-left: 4px; font-weight: 600;">Fiók</div>
                                <div style="background-color: white; border-radius: 16px; border: 1px solid #FECACA; height: 52px; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="openLogoutConfirm()">
                                    <span style="font-size: 15px; color: #DC2626; font-weight: 500;">Kijelentkezés</span>
                                </div>
                            </div>

                        </div>
                    </div>`;

// Replace the original screen
// I must be careful. Let's find "<!-- DIÁK SCREEN 3: PROFIL -->" or "<!-- SCREEN 3: PROFIL -->"
let startSearchString = '<!-- DIÁK SCREEN 3: PROFIL -->';
if (content.indexOf(startSearchString) === -1) {
    startSearchString = '<!-- SCREEN 3: PROFIL -->';
}
const startIdx = content.indexOf(startSearchString);
if (startIdx !== -1) {
    const endIdx = content.indexOf('<!-- Diák Chat & Teljesítés Overlay -->', startIdx);
    if (endIdx !== -1) {
        content = content.substring(0, startIdx) + newProfileHtml + '\n\n                ' + content.substring(endIdx);
    } else {
        console.log('Error: Could not find endIdx');
    }
} else {
    console.log('Error: Could not find startIdx');
}

fs.writeFileSync(filepath, content, 'utf8');
console.log('Phase 8 complete.');
