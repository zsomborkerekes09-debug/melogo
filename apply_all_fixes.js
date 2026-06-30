const fs = require('fs');
const indexFile = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let html = fs.readFileSync(indexFile, 'utf8');

// --- BUG 1 & 3: LOGO TEXT VISIBILITY & FONT WEIGHT ---
html = html.replace(/font-weight:\s*500;.*?Melo/g, "font-weight: 700;color:#fff;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;letter-spacing:-1.5px;Melo");
html = html.replace(/font-weight:\s*600;.*?Melo/g, "font-weight: 700;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;letter-spacing:-1.5px;color:var(--color-text);width:160px;text-align:center;user-select:none;Melo");

// For the login screen logo specifically
html = html.replace(
    /<div style="font-size:36px; font-weight: 700;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;letter-spacing:-1.5px;color:var\(--color-text\);width:160px;text-align:center;user-select:none;">Melo<span style="color:var\(--color-green\);">Go<\/span><\/div>/g,
    `<div style="font-size:36px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing:-1.5px; color:#1A1A1A; width:160px; text-align:center; user-select:none;">Melo<span style="color:var(--color-green);">Go</span></div>`
);

// For the dark headers (Midnight Navy Header, Home Header, Emp Header)
html = html.replace(
    /<span style="color:#fff;">Melo<\/span><span style="color:var\(--color-green\);">Go<\/span>/g,
    `<span style="color:#FFFFFF; font-weight:700;">Melo</span><span style="color:var(--color-green); font-weight:700;">Go</span>`
);
html = html.replace(
    /Melo<span style="color:var\(--color-green\);">Go<\/span>/g,
    `<span style="color:#FFFFFF; font-weight:700;">Melo</span><span style="color:var(--color-green); font-weight:700;">Go</span>`
);
html = html.replace(
    /Melo<span style="color:var\(--color-green\)">Go<\/span>/g,
    `<span style="color:#FFFFFF; font-weight:700;">Melo</span><span style="color:var(--color-green); font-weight:700;">Go</span>`
);


// --- BUG 2: GOOGLE SIGN IN IMPORT SYNTAX ERROR ---
html = html.replace(
    /signInWithPopup,\s*browserPopupRedirectResolver,\s*sendPasswordResetEmail,\s*browserPopupRedirectResolver\s*\}/g,
    `signInWithPopup, browserPopupRedirectResolver, sendPasswordResetEmail }`
);


// --- BUG 4: BOTTOM NAVIGATION CAPSULE ---
html = html.replace(
    /\.bottom-nav\s*\{\s*position:\s*absolute;\s*bottom:\s*0;\s*left:\s*0;\s*width:\s*100%;\s*background:\s*#000000;\s*border-top:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\);\s*padding-bottom:\s*env\(safe-area-inset-bottom\);\s*border-radius:\s*0;/g,
    `.bottom-nav {
            position: absolute;
            bottom: max(24px, env(safe-area-inset-bottom));
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 32px);
            max-width: 400px;
            background: #FFFFFF;
            border-radius: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.05);
            padding-bottom: 0;`
);

html = html.replace(
    /\.nav-item\s*i\s*\{\s*font-size:\s*20px;\s*margin-bottom:\s*4px;\s*transition:\s*all\s*0\.3s\s*ease;\s*color:\s*rgba\(255,\s*255,\s*255,\s*0\.6\);\s*\}/g,
    `.nav-item i {
            font-size: 20px;
            margin-bottom: 4px;
            transition: all 0.3s ease;
            color: #1A1A1A;
        }`
);
html = html.replace(
    /\.nav-item\.active\s*i\s*\{\s*color:\s*var\(--color-green\);\s*transform:\s*scale\(1\.15\);\s*\}/g,
    `.nav-item.active i {
            color: #000000;
            font-weight: 700;
            transform: scale(1.15);
        }`
);
html = html.replace(
    /\.nav-item\s*span\s*\{\s*font-size:\s*10px;\s*font-weight:\s*500;\s*color:\s*rgba\(255,\s*255,\s*255,\s*0\.6\);\s*transition:\s*color\s*0\.3s\s*ease;\s*\}/g,
    `.nav-item span {
            font-size: 10px;
            font-weight: 500;
            color: #1A1A1A;
            transition: color 0.3s ease;
        }`
);
html = html.replace(
    /\.nav-item\.active\s*span\s*\{\s*color:\s*var\(--color-green\);\s*font-weight:\s*600;\s*\}/g,
    `.nav-item.active span {
            color: #000000;
            font-weight: 700;
        }`
);


// --- BUG 5: MAP SCREEN ---
html = html.replace(
    /id="map" style="width: 100%; height: 100%;"><\/div>/g,
    `id="map" style="width: 100%; height: 100%;"></div>
    
    <div id="map-loading-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:var(--color-bg); z-index:999; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div style="width: 40px; height: 40px; border: 4px solid rgba(0,0,0,0.1); border-top-color: var(--color-green); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <div id="map-loading-text" style="margin-top: 16px; color: var(--color-text); font-weight: 500;">Térkép betöltése...</div>
        <button id="map-retry-btn" style="display:none; margin-top: 16px; background: var(--color-green); color: #000; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600;" onclick="initMapScreen()">Újrapróbálkozás</button>
    </div>
    
    <button onclick="refreshMapLocation()" style="position:absolute; right:16px; bottom:120px; width:48px; height:48px; border-radius:50%; background:var(--color-surface); border:1px solid var(--color-border); z-index:998; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; color:var(--color-text); cursor:pointer;">
        <i class="ti ti-current-location" style="font-size:24px;"></i>
    </button>`
);

const mapLogic = `
function initMapScreen() {
    document.getElementById('map-loading-overlay').style.display = 'flex';
    document.getElementById('map-loading-text').innerText = 'Térkép betöltése...';
    document.getElementById('map-retry-btn').style.display = 'none';
    
    const mapTimeout = setTimeout(() => {
        document.getElementById('map-loading-text').innerText = 'A térkép betöltése sikertelen.';
        document.getElementById('map-retry-btn').style.display = 'block';
    }, 10000);

    setTimeout(() => {
        if (!window.mapInstance) {
            window.mapInstance = L.map('map', { zoomControl: false }).setView([47.4979, 19.0402], 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap',
                maxZoom: 19
            }).addTo(window.mapInstance);
            
            window.mapInstance.on('load', () => {
                clearTimeout(mapTimeout);
                document.getElementById('map-loading-overlay').style.display = 'none';
            });
            setTimeout(() => {
                clearTimeout(mapTimeout);
                document.getElementById('map-loading-overlay').style.display = 'none';
                window.mapInstance.invalidateSize();
            }, 1000);
        } else {
            clearTimeout(mapTimeout);
            document.getElementById('map-loading-overlay').style.display = 'none';
            window.mapInstance.invalidateSize();
        }
        
        refreshMapLocation();
        renderMapPins();
    }, 300);
}

async function refreshMapLocation() {
    if (window.getUniversalPosition) {
        window.getUniversalPosition((pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            window.userCoords = { lat, lon };
            if (window.mapInstance) {
                window.mapInstance.setView([lat, lon], 14);
                if (window.userMarker) {
                    window.userMarker.setLatLng([lat, lon]);
                } else {
                    window.userMarker = L.circleMarker([lat, lon], {
                        radius: 8,
                        fillColor: '#2563EB',
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 1
                    }).addTo(window.mapInstance);
                }
            }
        }, (err) => {
            console.error(err);
            if (window.userCoords && window.mapInstance) {
                window.mapInstance.setView([window.userCoords.lat, window.userCoords.lon], 14);
            }
        }, { enableHighAccuracy: false }); 
    }
}`;

html = html.replace(/function initMapScreen\(\)\s*\{[\s\S]*?renderMapPins\(\);\s*\}/, mapLogic);

// --- NEW FEATURES 1 & 2: Medence takarítás & Egyéni munka ---
html = html.replace(
    /const jobCategories = \{/,
    `const jobCategories = {
            'Medence takarítás': ['Medence tisztítás', 'Medence vegyszerezés', 'Medence télesítés / nyitás', 'Medence szűrő karbantartás'],`
);

html = html.replace(
    /'Festés': \{ bg: '#7c3aed', class: 'cat-festes' \},/,
    `'Festés': { bg: '#7c3aed', class: 'cat-festes' },
        'Medence takarítás': { bg: '#0ea5e9', class: 'cat-medence' },
        'Egyéni munka': { bg: '#64748b', class: 'cat-egyeni' },`
);

html = html.replace(
    /\.cat-festes \{ background-color: rgba\(124,\s*58,\s*237,\s*0\.1\); color: #7c3aed; \}/,
    `.cat-festes { background-color: rgba(124, 58, 237, 0.1); color: #7c3aed; }
    .cat-medence { background-color: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
    .cat-egyeni { background-color: rgba(100, 116, 139, 0.1); color: #64748b; }`
);
html = html.replace(
    /\.cat-accent-Festés \{ border-left-color: var\(--color-text\) !important; \}/,
    `.cat-accent-Festés { border-left-color: var(--color-text) !important; }
    .cat-accent-Medence\\ takarítás { border-left-color: var(--color-text) !important; }
    .cat-accent-Egyéni\\ munka { border-left-color: var(--color-text) !important; }`
);

html = html.replace(
    /<div class="emp-cat-card" id="emp-cat-Festés" onclick="selectEmpCat\('Festés'\)">\s*<i class="ti ti-paint"><\/i>\s*Festés\s*<\/div>/,
    `<div class="emp-cat-card" id="emp-cat-Festés" onclick="selectEmpCat('Festés')">
                <i class="ti ti-paint"></i>
                Festés
            </div>
            <div class="emp-cat-card" id="emp-cat-Medence takarítás" onclick="selectEmpCat('Medence takarítás')">
                <i class="ti ti-droplet"></i>
                Medence takarítás
            </div>
            <div class="emp-cat-card" id="emp-cat-Egyéni munka" onclick="selectEmpCat('Egyéni munka')">
                <i class="ti ti-pencil"></i>
                Egyéni munka
            </div>`
);

html = html.replace(
    /<div id="emp-subcat-section" style="display:none; margin-top:24px;">/,
    `<div id="emp-custom-job-section" style="display:none; margin-top:24px;">
        <label class="emp-label">Egyéni munka megnevezése</label>
        <input type="text" class="emp-input" id="emp-custom-job-title" placeholder="Pl. Terasztisztítás" maxlength="50">
    </div>
    <div id="emp-subcat-section" style="display:none; margin-top:24px;">`
);

html = html.replace(
    /function selectEmpCat\(cat\) \{[\s\S]*?const subSection = document.getElementById\('emp-subcat-section'\);/,
    `function selectEmpCat(cat) {
            const cards = document.querySelectorAll('.emp-cat-card');
            cards.forEach(c => c.classList.remove('active'));
            const clicked = document.getElementById('emp-cat-' + cat);
            if(clicked) clicked.classList.add('active');
            
            document.getElementById('emp-cat-display').innerText = cat;
            document.getElementById('emp-cat-display').style.color = 'var(--color-text)';
            
            const subSection = document.getElementById('emp-subcat-section');
            const customSection = document.getElementById('emp-custom-job-section');
            
            if (cat === 'Egyéni munka') {
                subSection.style.display = 'none';
                customSection.style.display = 'block';
                closeCategoryPicker();
                return;
            } else {
                customSection.style.display = 'none';
            }`
);

html = html.replace(
    /let cat = document.getElementById\('emp-cat-display'\)\.innerText;\s*let subcat = document\.getElementById\('emp-subcat-display'\)\.innerText;/g,
    `let cat = document.getElementById('emp-cat-display').innerText;
            let subcat = document.getElementById('emp-subcat-display').innerText;
            if (cat === 'Egyéni munka') {
                const customTitle = document.getElementById('emp-custom-job-title').value.trim();
                if (!customTitle) {
                    alert("Kérjük add meg az egyéni munka megnevezését!");
                    return;
                }
                subcat = customTitle;
            }`
);

html = html.replace(
    /<div class="map-chip" onclick="filterMapPins\('Festés', this\)">Festés<\/div>/,
    `<div class="map-chip" onclick="filterMapPins('Festés', this)">Festés</div>
        <div class="map-chip" onclick="filterMapPins('Medence takarítás', this)">Medence takarítás</div>
        <div class="map-chip" onclick="filterMapPins('Egyéb', this)">Egyéb</div>`
);

html = html.replace(
    /<div class="category-btn" onclick="filterWorkerJobs\('Festés'\)">Festés<\/div>/,
    `<div class="category-btn" onclick="filterWorkerJobs('Festés')">Festés</div>
        <div class="category-btn" onclick="filterWorkerJobs('Medence takarítás')">Medence takarítás</div>
        <div class="category-btn" onclick="filterWorkerJobs('Egyéb')">Egyéb</div>`
);

html = html.replace(
    /if \(activeWorkerCat !== 'Minden' && job\.category !== activeWorkerCat\) return false;/g,
    `if (activeWorkerCat !== 'Minden') {
                if (activeWorkerCat === 'Egyéb') {
                    if (job.category !== 'Egyéni munka') return false;
                } else if (job.category !== activeWorkerCat) {
                    return false;
                }
            }`
);

// Bug 1 fix where login logo is still missing color #1A1A1A due to regex failing
// I will just replace the exact line using a simpler string replace:
let loginLogoRegex = /<div style="font-size:36px; font-weight: 700;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;letter-spacing:-1\.5px;color:var\(--color-text\);width:160px;text-align:center;user-select:none;">Melo<span style="color:var\(--color-green\);">Go<\/span><\/div>/;
html = html.replace(loginLogoRegex, `<div style="font-size:36px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing:-1.5px; color:#1A1A1A; width:160px; text-align:center; user-select:none;">Melo<span style="color:var(--color-green);">Go</span></div>`);

fs.writeFileSync(indexFile, html);
console.log("All UI fixes and features applied successfully.");
