const fs = require('fs');
const path = require('path');

const filepath = path.join('C:', 'Users', 'zsomb', '.gemini', 'antigravity', 'scratch', 'melogo', 'frontend', 'index.html');
let content = fs.readFileSync(filepath, 'utf8');

// 1. Remove "Térkép / Lista/Kereső" toggle block
const toggleBlockStart = `<div class="header-midnight" style="padding-bottom: 16px;">
                            <div style="display: flex; background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 4px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px;">`;
const toggleBlockEnd = `                                </button>
                            </div>
                        </div>`;

let toggleStartIdx = content.indexOf(toggleBlockStart);
if(toggleStartIdx !== -1) {
    let toggleEndIdx = content.indexOf(toggleBlockEnd, toggleStartIdx) + toggleBlockEnd.length;
    content = content.substring(0, toggleStartIdx) + content.substring(toggleEndIdx);
}

// 2. Remove `#search-content-list` entirely
const listBlockStart = `<div id="search-content-list" style="background-color: white; padding: 20px; flex-grow: 1; display: none; flex-direction: column; gap: 20px;">`;
const listBlockEndMatch = `                                </div>
                            </div>
                        </div>
                    </div>`; // Ends the SCREEN 1 block

let listStartIdx = content.indexOf(listBlockStart);
if(listStartIdx !== -1) {
    // Find the end of SCREEN 1
    let listEndIdx = content.indexOf('<!-- DIÁK SCREEN 2: ÜZENETEK -->', listStartIdx);
    if(listEndIdx !== -1) {
        // Find the last closing div of screen 1
        let screen1Closing = content.lastIndexOf('</div>\n                    </div>\n\n                    <!-- DIÁK SCREEN 2: ÜZENETEK -->');
        if (screen1Closing === -1) {
             screen1Closing = content.lastIndexOf('</div>\n                    </div>\n                    <!-- DIÁK SCREEN 2: ÜZENETEK -->');
        }
        
        content = content.substring(0, listStartIdx) + `                    </div>\n` + content.substring(listEndIdx);
    }
}

// 3. Clean `#search-content-map` style to not have `flex-grow: 1; display: flex; ...` inline but keep it simple, actually `display: flex;` is fine for the map container. But it was hidden/shown by JS. So it doesn't matter, we just leave the HTML as is, but remove the JS toggles.
const searchMapDivOld = `<div id="search-content-map" style="background-color: white; padding: 16px; flex-grow: 1; display: flex; flex-direction: column; gap: 12px;">`;
const searchMapDivNew = `<div id="search-content-map" style="background-color: white; padding: 16px; flex-grow: 1; display: flex; flex-direction: column; gap: 12px; height: 100%;">`;
content = content.replace(searchMapDivOld, searchMapDivNew);


// 4. Update bottom nav to "Térkép" and map pin icon
const oldNav1 = `<button class="nav-item" id="app-nav-1" onclick="navigateApp(1)">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="7"/>
                            <line x1="16.5" y1="16.5" x2="22" y2="22"/>
                        </svg>
                        <span class="nav-label">Keresés</span>
                    </button>`;
const newNav1 = `<button class="nav-item" id="app-nav-1" onclick="navigateApp(1)">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span class="nav-label">Térkép</span>
                    </button>`;
content = content.replace(oldNav1, newNav1);

// 5. Update JS switchRole to hide/show `app-nav-1`
// Replace the search screen logic block inside switchRole
const oldRoleWorkerBlock = `                // Search screen logic
                document.getElementById('search-worker-sort').style.display = 'flex';
                document.getElementById('search-employer-sort').style.display = 'none';
                document.getElementById('search-list-results').style.display = 'block';
                document.getElementById('search-employer-results').style.display = 'none';
                if(searchInput) searchInput.placeholder = "Írd be: fűnyírás, festés, takarítás...";
                if(searchTabTitle) searchTabTitle.innerText = "Lista/Kereső";
                if(mapToggleBtn) mapToggleBtn.style.display = 'flex'; // Workers can see map`;

const newRoleWorkerBlock = `                // Search screen logic removed for Phase 7
                const nav1 = document.getElementById('app-nav-1');
                if(nav1) nav1.style.display = 'flex';`;

const oldRoleEmployerBlock = `                // Search screen logic
                document.getElementById('search-worker-sort').style.display = 'none';
                document.getElementById('search-employer-sort').style.display = 'flex';
                document.getElementById('search-list-results').style.display = 'none';
                document.getElementById('search-employer-results').style.display = 'block';
                if(searchInput) searchInput.placeholder = "Írd be: fűnyírás, festés...";
                if(searchTabTitle) searchTabTitle.innerText = "Keress munkást";
                if(mapToggleBtn) mapToggleBtn.style.display = 'none'; // Employers only see list of workers
                
                // Force switch to list view in employer mode
                switchSearchTab('list');`;

const newRoleEmployerBlock = `                // Search screen logic removed for Phase 7
                const nav1 = document.getElementById('app-nav-1');
                if(nav1) nav1.style.display = 'none';
                
                // If employer is currently on the map tab, navigate to home
                navigateApp(0);`;

content = content.replace(oldRoleWorkerBlock, newRoleWorkerBlock);
content = content.replace(oldRoleEmployerBlock, newRoleEmployerBlock);

// Remove the `switchSearchTab` function entirely as it throws errors if elements are missing
const switchTabStart = `        // SZÖVEGES ÉS TÉRKÉPES KERESŐ TOGGLE VÁLTÓ
        function switchSearchTab(mode) {`;
const switchTabEnd = `        }`; // Let's just use replace with regex for the function

const switchTabRegex = /function switchSearchTab[\s\S]*?mapContent\.style\.display = 'none';\n            }\n        }/;
content = content.replace(switchTabRegex, '// switchSearchTab removed');


fs.writeFileSync(filepath, content, 'utf8');
console.log('Phase 7 Refactoring complete.');
