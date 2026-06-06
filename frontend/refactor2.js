const fs = require('fs');
const path = require('path');

const filepath = path.join('C:', 'Users', 'zsomb', '.gemini', 'antigravity', 'scratch', 'melogo', 'frontend', 'index.html');

let content = fs.readFileSync(filepath, 'utf8');

// 1. Remove toggle from Home Header and add Welcome text
const headerOld = `                            <!-- Role Switcher -->
                            <div class="role-switcher-container">
                                <button class="role-btn active" id="role-btn-worker" onclick="switchRole('worker')">Munkás</button>
                                <button class="role-btn" id="role-btn-employer" onclick="switchRole('employer')">Megbízó</button>
                            </div>`;
                            
const headerNew = `                            <div class="welcome-text" style="text-align: center; margin-bottom: 16px; font-size: 24px;">Szia, Bence!</div>`;

content = content.replace(headerOld, headerNew);


// 2. Add Role Switcher to Profile Screen
const profileOld = `                        <!-- Content Card -->
                        <div class="profile-content-card">`;
                        
const profileNew = `                        <!-- Content Card -->
                        <div class="profile-content-card">
                            <div class="profile-section-title" style="margin-top: 0; display: flex; align-items: center; justify-content: space-between;">
                                Szerepem
                                <svg id="role-check-anim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0; transform: scale(0.5); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <div style="background:#F3F4F6;border-radius:20px;padding:16px;margin-bottom:24px;">
                                <div class="role-switcher-container" style="max-width: 100%; margin-bottom: 8px;">
                                    <button class="role-btn active" id="role-btn-worker" onclick="switchRole('worker')" style="color: var(--color-navy);">Munkás</button>
                                    <button class="role-btn" id="role-btn-employer" onclick="switchRole('employer')" style="color: var(--color-navy);">Megbízó</button>
                                </div>
                                <div id="role-description-text" style="font-size: 12px; color: var(--color-text-muted); text-align: center; font-weight: 500;">
                                    Közeli munkákat keresel és vállalsz.
                                </div>
                            </div>`;

content = content.replace(profileOld, profileNew);


// 3. Update switchRole JS function
const jsOld = `            // UI Toggle
            document.getElementById('role-btn-worker').classList.remove('active');
            document.getElementById('role-btn-employer').classList.remove('active');
            document.getElementById(\`role-btn-\${role}\`).classList.add('active');

            const searchPill = document.getElementById('home-search-pill');`;
            
const jsNew = `            // UI Toggle
            const btnWorker = document.getElementById('role-btn-worker');
            const btnEmployer = document.getElementById('role-btn-employer');
            if (btnWorker && btnEmployer) {
                btnWorker.classList.remove('active');
                btnEmployer.classList.remove('active');
                document.getElementById(\`role-btn-\${role}\`).classList.add('active');
            }
            
            // Description & Animation update
            const desc = document.getElementById('role-description-text');
            const anim = document.getElementById('role-check-anim');
            if (desc) {
                desc.innerText = role === 'worker' ? 'Közeli munkákat keresel és vállalsz.' : 'Munkákat adsz fel és kezeled a jelentkezőket.';
            }
            if (anim) {
                anim.style.opacity = '1';
                anim.style.transform = 'scale(1)';
                setTimeout(() => {
                    anim.style.opacity = '0';
                    anim.style.transform = 'scale(0.5)';
                }, 1500);
            }

            const searchPill = document.getElementById('home-search-pill');`;

content = content.replace(jsOld, jsNew);

fs.writeFileSync(filepath, content, 'utf8');
console.log('Refactor2 complete using Node.js');
