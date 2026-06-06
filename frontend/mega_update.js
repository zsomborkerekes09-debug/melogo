const fs = require('fs');

// Read the entire current file
let html = fs.readFileSync('index.html', 'utf8');

// =====================================================
// 1. Add new CSS for search overlay, distance sheet, 
//    GPS bar, notification banner, sort pills
// =====================================================
const newCSS = `
        /* ===== SEARCH OVERLAY ===== */
        #search-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #fff;
            z-index: 5000;
            display: flex;
            flex-direction: column;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #search-overlay.open {
            transform: translateY(0);
        }
        .search-overlay-header {
            background: var(--color-navy);
            padding: 48px 16px 16px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .search-overlay-input-wrap {
            flex: 1;
            background: rgba(255,255,255,0.12);
            border-radius: 12px;
            display: flex;
            align-items: center;
            padding: 10px 14px;
            gap: 10px;
        }
        .search-overlay-input-wrap input {
            background: none;
            border: none;
            color: #fff;
            font-size: 15px;
            width: 100%;
            outline: none;
        }
        .search-overlay-input-wrap input::placeholder { color: rgba(255,255,255,0.5); }
        .search-cancel-btn {
            color: var(--color-green);
            font-size: 14px;
            font-weight: 600;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 0;
            white-space: nowrap;
        }
        .search-results-list {
            flex: 1;
            overflow-y: auto;
            background: #F8F9FB;
            padding: 16px;
        }
        .search-result-item {
            background: #fff;
            border-radius: 16px;
            padding: 14px 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            transition: transform 0.15s;
        }
        .search-result-item:active { transform: scale(0.98); }
        .search-result-icon {
            width: 36px; height: 36px;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .search-result-info { flex: 1; }
        .search-result-title { font-size: 14px; font-weight: 600; color: var(--color-navy); margin-bottom: 2px; }
        .search-result-sub { font-size: 12px; color: var(--color-text-light); }
        .search-result-price { font-size: 14px; font-weight: 700; color: var(--color-green); flex-shrink: 0; }
        .search-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--color-text-light);
            font-size: 14px;
        }
        .search-section-label {
            font-size: 12px;
            font-weight: 600;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            margin-top: 4px;
        }

        /* ===== GPS DISTANCE BAR (in header) ===== */
        .gps-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 14px;
        }
        .gps-location {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: rgba(255,255,255,0.8);
            font-weight: 400;
        }
        .gps-location.unknown {
            color: rgba(255,255,255,0.4);
        }
        .gps-dot {
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #22C55E;
            flex-shrink: 0;
        }
        .gps-dot.off { background: #6B7280; }
        .distance-pill-btn {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 20px;
            padding: 4px 12px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }

        /* ===== SORT PILLS ===== */
        .sort-row {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            padding-bottom: 4px;
            margin-bottom: 16px;
            scrollbar-width: none;
        }
        .sort-row::-webkit-scrollbar { display: none; }
        .sort-pill {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
            background: #fff;
            border: 1px solid var(--color-border);
            color: var(--color-text-light);
            transition: all 0.15s;
        }
        .sort-pill.active {
            background: var(--color-navy);
            color: #fff;
            border-color: transparent;
        }

        /* ===== DISTANCE BOTTOM SHEET ===== */
        #distance-sheet-backdrop {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 4000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        #distance-sheet-backdrop.open {
            opacity: 1;
            pointer-events: auto;
        }
        #distance-sheet {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            background: #fff;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 20px 24px 40px 24px;
            z-index: 4001;
            transform: translateY(100%);
            transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #distance-sheet.open { transform: translateY(0); }
        .distance-sheet-handle {
            width: 36px; height: 4px;
            background: #E5E7EB;
            border-radius: 2px;
            margin: 0 auto 20px;
        }
        .distance-sheet-title {
            font-size: 18px; font-weight: 700;
            color: var(--color-navy);
            text-align: center; margin-bottom: 6px;
        }
        .distance-value-display {
            font-size: 48px; font-weight: 800;
            color: var(--color-navy);
            text-align: center;
            margin: 16px 0 8px;
            font-family: 'Poppins', sans-serif;
        }
        .distance-value-display span {
            font-size: 20px; font-weight: 500;
            color: var(--color-text-light);
        }
        #distance-slider {
            width: 100%;
            appearance: none;
            -webkit-appearance: none;
            height: 4px;
            border-radius: 2px;
            background: #E5E7EB;
            margin: 12px 0 24px;
            outline: none;
        }
        #distance-slider::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none;
            width: 24px; height: 24px;
            border-radius: 50%;
            background: var(--color-green);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(34,197,94,0.4);
        }
        .distance-confirm-btn {
            width: 100%;
            background: var(--color-navy);
            color: #fff;
            border: none;
            border-radius: 14px;
            padding: 14px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        }

        /* ===== PUSH NOTIFICATION BANNER ===== */
        #push-banner {
            position: absolute;
            top: -80px;
            left: 16px; right: 16px;
            background: var(--color-navy);
            border-radius: 16px;
            padding: 14px 16px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #push-banner.show { top: 16px; }
        .push-banner-icon {
            width: 36px; height: 36px;
            border-radius: 10px;
            background: var(--color-green);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            color: #fff;
        }
        .push-banner-text { flex: 1; }
        .push-banner-title { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .push-banner-msg { font-size: 11px; color: rgba(255,255,255,0.7); }
        .push-banner-close {
            color: rgba(255,255,255,0.5);
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }

        /* ===== CHAT UNREAD DOT ===== */
        .chat-unread-dot-outer {
            width: 10px; height: 10px;
            border-radius: 50%;
            background: var(--color-green);
            flex-shrink: 0;
        }

        /* ===== ACTIVE JOB CARD ===== */
        .job-card {
            transition: transform 0.15s, box-shadow 0.15s;
        }
        .job-card:active {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .job-badge-urgent {
            background: #FEF3C7;
            color: #D97706;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 6px;
            display: inline-block;
        }
        .job-badge-cat {
            background: #F3F4F6;
            color: var(--color-text-light);
            font-size: 10px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 6px;
            display: inline-block;
        }
        .job-card-badges {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
        }

        /* ===== MAP PINS ===== */
        .map-pin-label {
            background: var(--color-navy);
            color: #fff;
            padding: 5px 9px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            position: relative;
            cursor: pointer;
            transition: transform 0.15s;
        }
        .map-pin-label:active { transform: scale(0.95); }
        .map-pin-label::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid var(--color-navy);
        }
        .map-pin-label.cat-kert { background: #16a34a; }
        .map-pin-label.cat-kert::after { border-top-color: #16a34a; }
        .map-pin-label.cat-auto { background: #d97706; }
        .map-pin-label.cat-auto::after { border-top-color: #d97706; }
        .map-pin-label.cat-festes { background: #7c3aed; }
        .map-pin-label.cat-festes::after { border-top-color: #7c3aed; }
        .map-pin-label.cat-haz { background: #2563eb; }
        .map-pin-label.cat-haz::after { border-top-color: #2563eb; }

        /* ===== MAP PREVIEW CARD animation ===== */
        #map-preview-card {
            transition: opacity 0.2s, transform 0.2s;
            opacity: 0;
            transform: translateY(10px);
        }
        #map-preview-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
`;

// Insert new CSS before the closing </style>
html = html.replace('    </style>', newCSS + '\n    </style>');

// =====================================================
// 2. Replace the header-midnight block with new header
// =====================================================
const oldHeader = `                <div class="header-midnight">
                    <div class="brand-logo">Melo<span>Go</span></div>
                    <div class="welcome-text">Szia, Bence!</div>
                    
                    <div class="search-bar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Milyen munkát keresel?">
                    </div>
                </div>`;

const newHeader = `                <div class="header-midnight">
                    <div class="brand-logo">Melo<span>Go</span></div>
                    <div class="welcome-text">Szia, Bence!</div>
                    
                    <div class="search-bar" onclick="openSearchOverlay()" style="cursor:pointer;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="home-search-display" placeholder="Milyen munkát keresel?" readonly style="cursor:pointer; pointer-events:none;">
                    </div>

                    <div class="gps-bar">
                        <div class="gps-location" id="gps-location-text">
                            <div class="gps-dot" id="gps-dot"></div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span id="gps-city-label">Helyzet keresése...</span>
                        </div>
                        <button class="distance-pill-btn" id="distance-pill" onclick="openDistanceSheet()">
                            <span id="distance-pill-text">10 km</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                    </div>
                </div>`;

if (html.includes(oldHeader)) {
    html = html.replace(oldHeader, newHeader);
    console.log('✅ Header replaced');
} else {
    // Try a softer match
    const headerStart = html.indexOf('<div class="header-midnight">');
    const headerEnd = html.indexOf('</div>\n\n                <div id="home-worker-view"');
    if (headerStart !== -1 && headerEnd !== -1) {
        html = html.substring(0, headerStart) + newHeader + html.substring(headerEnd + 6);
        console.log('✅ Header replaced (fallback)');
    } else {
        console.log('❌ Header not found');
    }
}

// =====================================================
// 3. Replace job list with dynamic container + sort row
// =====================================================
const oldWorkerView = `                <div id="home-worker-view" class="job-list">
                    <div class="flex-between" style="margin-bottom: 16px;">
                        <h2 style="font-size: 18px; font-weight: 700; color: var(--color-navy);">Közeli munkák</h2>
                        <span id="worker-job-filter-display" style="font-size: 13px; color: var(--color-green); font-weight: 500;">Összes</span>
                    </div>
                    <div class="categories-row" style="display: flex; gap: 8px; overflow-x: auto; margin-bottom: 16px; padding-bottom: 4px; scrollbar-width: none;">
                        <div class="category-btn active" onclick="filterWorkerJobs('Összes')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: var(--color-navy); color: #fff;">Minden</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Kert')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Kertészet</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Festés')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Festés</div>
                    </div>

                    <!-- Job Card 1 -->
                    <div class="job-card" style="cursor: pointer; position: relative;" onclick="document.getElementById(\\'worker-action-overlay\\').classList.add(\\'active\\')">
                        <div class="job-card-header">
                            <div>
                                <div class="job-title">Fűnyírás a Desedánál</div>
                                <div style="font-size: 13px; color: var(--color-text-light);">Tóth János</div>
                            </div>
                            <div class="job-price">8 000 Ft</div>
                        </div>
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                2.5 km
                            </div>
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Ma 14:00
                            </div>
                        </div>
                        
                    </div>

                    <!-- Job Card 2 -->
                    <div class="job-card" style="cursor: pointer; position: relative;" onclick="document.getElementById(\\'worker-action-overlay\\').classList.add(\\'active\\')">
                        <div class="job-card-header">
                            <div>
                                <div class="job-title">Kerítésfestés</div>
                                <div style="font-size: 13px; color: var(--color-text-light);">Nagy Péter</div>
                            </div>
                            <div class="job-price">12 000 Ft</div>
                        </div>
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                3.1 km
                            </div>
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Holnap 09:00
                            </div>
                        </div>
                        
                    </div>
                </div>`;

const newWorkerView = `                <div id="home-worker-view" class="job-list">
                    <div class="flex-between" style="margin-bottom: 12px;">
                        <h2 style="font-size: 18px; font-weight: 700; color: var(--color-navy);">Közeli munkák</h2>
                        <span id="worker-job-filter-display" style="font-size: 13px; color: var(--color-green); font-weight: 500; cursor:pointer;" onclick="openJobPicker('filter')">Összes ▾</span>
                    </div>

                    <!-- Category Pills -->
                    <div class="categories-row" style="display: flex; gap: 8px; overflow-x: auto; margin-bottom: 10px; padding-bottom: 4px; scrollbar-width: none;">
                        <div class="category-btn active" onclick="filterWorkerJobs('Összes')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: var(--color-navy); color: #fff;">Minden</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Kert')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Kertészet</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Festés')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Festés</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Autó')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Autó</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Ház')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Ház b.</div>
                    </div>

                    <!-- Sort Pills -->
                    <div class="sort-row">
                        <div class="sort-pill active" id="sort-dist" onclick="sortWorkerJobsNew('distance')">📍 Távolság</div>
                        <div class="sort-pill" id="sort-price" onclick="sortWorkerJobsNew('price')">💰 Ár</div>
                        <div class="sort-pill" id="sort-new" onclick="sortWorkerJobsNew('newest')">🕐 Legfrissebb</div>
                        <div class="sort-pill" id="sort-urg" onclick="sortWorkerJobsNew('urgent')">⚡ Sürgős</div>
                    </div>

                    <!-- Dynamic Job List -->
                    <div id="worker-jobs-list">
                        <!-- Populated by JS -->
                    </div>
                </div>`;

if (html.includes(oldWorkerView)) {
    html = html.replace(oldWorkerView, newWorkerView);
    console.log('✅ Worker view replaced');
} else {
    console.log('⚠️ Worker view not exact match - trying partial replacement');
    // partial match: replace from the home-worker-view div start to end
    const startIdx = html.indexOf('<div id="home-worker-view" class="job-list">');
    const endIdx = html.indexOf('\n                </div>\n\n                <div id="home-employer-view"');
    if (startIdx !== -1 && endIdx !== -1) {
        html = html.substring(0, startIdx) + newWorkerView + html.substring(endIdx + 17);
        console.log('✅ Worker view replaced (partial)');
    }
}

// =====================================================
// 4. Replace Map screen with functional version
// =====================================================
const oldMapScreen = `            <!-- SCREEN 1: MAP -->
            <div class="screen" id="app-map-screen">
                <div class="map-container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Budapest_OpenStreetMap.svg/600px-Budapest_OpenStreetMap.svg.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Map">
                    
                    <div class="map-chips">
                        <div class="map-chip active">Minden</div>
                        <div class="map-chip">Kertészet</div>
                        <div class="map-chip">Autómosás</div>
                        <div class="map-chip">Takarítás</div>
                        <div class="map-chip">Szerelés</div>
                    </div>
                    
                    <!-- Map Pin -->
                    <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); cursor: pointer;" onclick="document.getElementById('map-preview-card').style.display='block'">
                        <div style="background-color: var(--color-navy); color: white; padding: 6px 10px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.2); position: relative;">
                            8 000 Ft
                            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--color-navy);"></div>
                        </div>
                    </div>

                    <!-- Floating Job Card -->
                    <div id="map-preview-card" style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: none;">
                        <div class="job-card-header">
                            <div>
                                <div class="job-title">Fűnyírás a Desedánál</div>
                                <div style="font-size: 13px; color: var(--color-text-light);">Tóth János</div>
                            </div>
                            <div class="job-price">8 000 Ft</div>
                        </div>
                        <button class="job-apply-btn" onclick="openWorkerJobDetail()">Részletek megtekintése</button>
                    </div>
                </div>
            </div>`;

const newMapScreen = `            <!-- SCREEN 1: MAP -->
            <div class="screen" id="app-map-screen" style="overflow: hidden;">
                <div class="map-container" style="position: relative; width: 100%; height: 100%; overflow: hidden;">
                    <!-- Map background using SVG city grid -->
                    <div id="map-bg" style="position: absolute; top:0; left:0; right:0; bottom:0; background: #e8eef4;">
                        <svg width="100%" height="100%" viewBox="0 0 375 600" xmlns="http://www.w3.org/2000/svg">
                            <!-- Roads -->
                            <rect width="375" height="600" fill="#e8eef4"/>
                            <!-- Main roads -->
                            <rect x="0" y="280" width="375" height="8" fill="#fff" opacity="0.8"/>
                            <rect x="180" y="0" width="8" height="600" fill="#fff" opacity="0.8"/>
                            <rect x="0" y="160" width="375" height="5" fill="#fff" opacity="0.5"/>
                            <rect x="0" y="400" width="375" height="5" fill="#fff" opacity="0.5"/>
                            <rect x="80" y="0" width="5" height="600" fill="#fff" opacity="0.5"/>
                            <rect x="290" y="0" width="5" height="600" fill="#fff" opacity="0.5"/>
                            <!-- Blocks -->
                            <rect x="90" y="170" width="80" height="100" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="90" y="290" width="80" height="100" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="200" y="170" width="80" height="100" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="200" y="290" width="80" height="100" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="90" y="60" width="80" height="90" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="200" y="60" width="80" height="90" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="90" y="410" width="80" height="90" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <rect x="200" y="410" width="80" height="90" rx="3" fill="#d1dde8" opacity="0.7"/>
                            <!-- Park -->
                            <ellipse cx="300" cy="450" rx="50" ry="60" fill="#b7e4c7" opacity="0.6"/>
                            <!-- Water -->
                            <ellipse cx="50" cy="350" rx="35" ry="25" fill="#bfdbfe" opacity="0.7"/>
                            <!-- Labels -->
                            <text x="130" y="225" font-size="8" fill="#8da0b3" text-anchor="middle" font-family="sans-serif">Béke tér</text>
                            <text x="240" y="340" font-size="8" fill="#8da0b3" text-anchor="middle" font-family="sans-serif">Kossuth u.</text>
                            <text x="295" y="452" font-size="8" fill="#4a7c59" text-anchor="middle" font-family="sans-serif">Deseda Park</text>
                        </svg>
                    </div>

                    <!-- Category chips -->
                    <div class="map-chips" id="map-chips-row">
                        <div class="map-chip active" onclick="filterMapPins('all', this)">Minden</div>
                        <div class="map-chip" onclick="filterMapPins('Kert', this)">Kertészet</div>
                        <div class="map-chip" onclick="filterMapPins('Festés', this)">Festés</div>
                        <div class="map-chip" onclick="filterMapPins('Autó', this)">Autó</div>
                        <div class="map-chip" onclick="filterMapPins('Ház', this)">Ház b.</div>
                    </div>

                    <!-- Map Pins (populated by JS) -->
                    <div id="map-pins-container" style="position: absolute; top:0; left:0; right:0; bottom:0; pointer-events: none;"></div>

                    <!-- Floating preview card -->
                    <div id="map-preview-card" style="position: absolute; bottom: 20px; left: 16px; right: 16px; background: white; border-radius: 20px; padding: 16px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.12);">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                            <div>
                                <div class="job-title" id="map-prev-title">Fűnyírás a Desedánál</div>
                                <div style="font-size: 12px; color: var(--color-text-light); margin-top:2px;" id="map-prev-meta">2.5 km · Tóth János</div>
                            </div>
                            <div class="job-price" id="map-prev-price">8 000 Ft</div>
                        </div>
                        <button class="job-apply-btn" onclick="openJobDetailFromMap()" style="border-radius:12px; font-size:13px; padding:10px;">Részletek →</button>
                    </div>
                </div>
            </div>`;

if (html.includes(oldMapScreen)) {
    html = html.replace(oldMapScreen, newMapScreen);
    console.log('✅ Map screen replaced');
} else {
    const mapStart = html.indexOf('            <!-- SCREEN 1: MAP -->');
    const mapEnd = html.indexOf('\n\n            <!-- SCREEN 2: MESSAGES -->');
    if (mapStart !== -1 && mapEnd !== -1) {
        html = html.substring(0, mapStart) + newMapScreen + html.substring(mapEnd);
        console.log('✅ Map screen replaced (partial)');
    } else {
        console.log('❌ Map screen not found');
    }
}

// =====================================================
// 5. Replace Messages screen to add unread dot + functional chat
// =====================================================
const oldMessages = `            <!-- SCREEN 2: MESSAGES -->
            <div class="screen" id="app-messages-screen">
                <div class="messages-header">
                    <div class="messages-title">Üzenetek</div>
                </div>
                <div class="chat-list">
                    <div class="chat-item" onclick="openChat()">
                        <div class="chat-avatar">TJ</div>
                        <div class="chat-details">
                            <div class="chat-name">Tóth János <span class="chat-time">10:42</span></div>
                            <div class="chat-msg chat-unread">Szia! Mikor tudnál jönni holnap?</div>
                        </div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-avatar">NP</div>
                        <div class="chat-details">
                            <div class="chat-name">Nagy Péter <span class="chat-time">Tegnap</span></div>
                            <div class="chat-msg">Tökéletes, köszönöm a munkát!</div>
                        </div>
                    </div>
                </div>
            </div>`;

const newMessages = `            <!-- SCREEN 2: MESSAGES -->
            <div class="screen" id="app-messages-screen" style="background:#F8F9FB;">
                <div class="messages-header">
                    <div class="messages-title">Üzenetek</div>
                </div>
                <div class="chat-list" id="messages-chat-list">
                    <div class="chat-item" style="cursor:pointer;" onclick="openChat('Tóth János', 'Fűnyírás', 'Szia! Mikor tudnál jönni holnap?', '10:42', true)">
                        <div style="position:relative; margin-right:16px;">
                            <div class="chat-avatar" style="background:#0A0F2E; color:#fff;">TJ</div>
                            <div style="position:absolute; top:0; right:0; width:10px; height:10px; border-radius:50%; background:#22C55E; border:2px solid #F8F9FB;"></div>
                        </div>
                        <div class="chat-details">
                            <div class="chat-name">Tóth János <span class="chat-time">10:42</span></div>
                            <div class="chat-msg chat-unread">Szia! Mikor tudnál jönni holnap?</div>
                        </div>
                    </div>
                    <div class="chat-item" style="cursor:pointer;" onclick="openChat('Nagy Péter', 'Kerítésfestés', 'Tökéletes, köszönöm a munkát!', 'Tegnap', false)">
                        <div style="position:relative; margin-right:16px;">
                            <div class="chat-avatar">NP</div>
                        </div>
                        <div class="chat-details">
                            <div class="chat-name">Nagy Péter <span class="chat-time">Tegnap</span></div>
                            <div class="chat-msg">Tökéletes, köszönöm a munkát!</div>
                        </div>
                    </div>
                    <div class="chat-item" style="cursor:pointer;" onclick="openChat('Kovács Edit', 'Kutyasétáltatás', 'Rendben, 3 órakor ott leszek!', 'H', false)">
                        <div style="position:relative; margin-right:16px;">
                            <div class="chat-avatar" style="background:#7c3aed; color:#fff;">KE</div>
                        </div>
                        <div class="chat-details">
                            <div class="chat-name">Kovács Edit <span class="chat-time">Hétfő</span></div>
                            <div class="chat-msg">Rendben, 3 órakor ott leszek!</div>
                        </div>
                    </div>
                </div>
            </div>`;

if (html.includes(oldMessages)) {
    html = html.replace(oldMessages, newMessages);
    console.log('✅ Messages screen replaced');
} else {
    const msgStart = html.indexOf('            <!-- SCREEN 2: MESSAGES -->');
    const msgEnd = html.indexOf('\n\\n                                        <!-- SCREEN 3: PROFIL -->');
    if (msgStart !== -1 && msgEnd !== -1) {
        html = html.substring(0, msgStart) + newMessages + html.substring(msgEnd);
        console.log('✅ Messages screen replaced (partial)');
    } else {
        console.log('❌ Messages screen not found');
    }
}

// =====================================================
// 6. Add Search Overlay + Distance Sheet + Notification Banner HTML
//    before the closing </div> of #phone-app (before bottom-nav)
// =====================================================
const newOverlays = `
                <!-- ===== SEARCH OVERLAY ===== -->
                <div id="search-overlay">
                    <div class="search-overlay-header">
                        <div class="search-overlay-input-wrap">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input type="text" id="search-overlay-input" placeholder="Milyen munkát keresel?" oninput="onSearchInput(this.value)" autofocus>
                        </div>
                        <button class="search-cancel-btn" onclick="closeSearchOverlay()">Mégse</button>
                    </div>
                    <div class="search-results-list" id="search-results-list">
                        <div class="search-section-label">Közeli munkák</div>
                        <!-- Populated by JS -->
                    </div>
                </div>

                <!-- ===== DISTANCE SHEET ===== -->
                <div id="distance-sheet-backdrop" onclick="closeDistanceSheet()"></div>
                <div id="distance-sheet">
                    <div class="distance-sheet-handle"></div>
                    <div class="distance-sheet-title">Hatótávolság</div>
                    <div style="font-size: 13px; color: var(--color-text-light); text-align:center;">Csak a kiválasztott körzetben lévő munkák jelennek meg</div>
                    <div class="distance-value-display"><span id="distance-display-km">10</span> <span>km</span></div>
                    <input type="range" id="distance-slider" min="1" max="50" value="10" oninput="onDistanceSliderChange(this.value)">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--color-text-light); margin-bottom:8px;">
                        <span>1 km</span><span>50 km</span>
                    </div>
                    <button class="distance-confirm-btn" onclick="confirmDistance()">Beállítás</button>
                </div>

                <!-- ===== PUSH NOTIFICATION BANNER ===== -->
                <div id="push-banner">
                    <div class="push-banner-icon" id="push-banner-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </div>
                    <div class="push-banner-text">
                        <div class="push-banner-title" id="push-banner-title">MeloGo</div>
                        <div class="push-banner-msg" id="push-banner-msg">Értesítés</div>
                    </div>
                    <button class="push-banner-close" onclick="document.getElementById('push-banner').classList.remove('show')">×</button>
                </div>

                <!-- ===== CHAT DETAIL OVERLAY ===== -->
                <div class="settings-overlay" id="chat-detail-overlay">
                    <div class="settings-header" style="background: #fff; border-bottom: 1px solid var(--color-border);">
                        <button class="settings-back-btn" onclick="document.getElementById('chat-detail-overlay').classList.remove('open')" style="color: var(--color-text-dark);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Vissza
                        </button>
                        <div style="text-align:center;">
                            <div class="settings-title" id="chat-detail-name" style="font-size:15px;">Tóth János</div>
                            <div style="font-size:11px; color: var(--color-green); font-weight:600;" id="chat-detail-job">Fűnyírás</div>
                        </div>
                        <div style="width:60px;"></div>
                    </div>
                    <div id="chat-detail-messages" style="flex:1; background:#F8F9FB; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:10px;">
                        <!-- Populated dynamically -->
                    </div>
                    <div style="background:#fff; padding:12px 16px 28px; border-top:1px solid var(--color-border); display:flex; gap:10px; align-items:center;">
                        <button onclick="triggerPhotoAttach()" style="background:#F3F4F6; border:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </button>
                        <input type="text" id="chat-reply-input" placeholder="Üzenet írása..." style="flex:1; background:#F3F4F6; border:none; padding:10px 14px; border-radius:20px; font-size:14px; outline:none;" onkeydown="if(event.key==='Enter') sendChatMessageNew()">
                        <button onclick="sendChatMessageNew()" style="background:var(--color-green); color:#fff; border:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </div>
                </div>
`;

// Insert before the bottom-nav
const bottomNavIdx = html.indexOf('                <!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->');
if (bottomNavIdx !== -1) {
    html = html.substring(0, bottomNavIdx) + newOverlays + '\n' + html.substring(bottomNavIdx);
    console.log('✅ New overlays inserted');
} else {
    console.log('❌ Bottom nav marker not found');
}

// =====================================================
// 7. Add NEW JavaScript at end of script block
// =====================================================
const newJS = `

        // ===================================================================
        // MOCK JOB DATABASE
        // ===================================================================
        const mockJobs = [
            { id: 1, title: 'Fűnyírás a Desedánál', employer: 'Tóth János', price: 8000, distance: 2.5, category: 'Kert', location: 'Kaposvár, Deseda u. 12.', time: 'Ma 14:00', urgent: false, timeOffset: 0, desc: 'Kb. 200m² gyep levágása. Fűnyíró van, csak jöjj és csináld! Rövid munka, max 2-3 óra.' },
            { id: 2, title: 'Kerítésfestés', employer: 'Nagy Péter', price: 12000, distance: 3.1, category: 'Festés', location: 'Kaposvár, Fő u. 5.', time: 'Holnap 09:00', urgent: false, timeOffset: 1, desc: 'Kb. 30 méter deszkakerítés festése fehér színűre. Festék és ecset adott, csak munkáskéz kell.' },
            { id: 3, title: 'Autómosás (kézi)', employer: 'Szabó Éva', price: 5000, distance: 0.8, category: 'Autó', location: 'Kaposvár, Sport u. 8.', time: 'Ma 16:00', urgent: true, timeOffset: 0, desc: 'Kis SUV kézi mosása kint az udvaron. Víz és szivacs adott. Sürgős, ma estére kell!' },
            { id: 4, title: 'Ablakok tisztítása', employer: 'Molnár István', price: 7000, distance: 1.2, category: 'Ház', location: 'Kaposvár, Vár u. 3.', time: 'Holnap 10:00', urgent: false, timeOffset: 1, desc: 'Emelt szintű lakás 6 ablakának belső+külső tisztítása. Eszközök adottak.' },
            { id: 5, title: 'Gyomirtás, kapálás', employer: 'Kiss Mária', price: 6500, distance: 4.2, category: 'Kert', location: 'Kaposvár, Kert u. 1.', time: 'H', urgent: false, timeOffset: 3, desc: 'Veteményes kert kapálása és gyomtalanítása. Szerszámok a helyszínen.' },
            { id: 6, title: 'Bútor összeszerelés', employer: 'Horváth Gábor', price: 9000, distance: 2.0, category: 'Ház', location: 'Kaposvár, Béke tér 7.', time: 'K', urgent: true, timeOffset: 2, desc: 'IKEA PAX szekrény összeszerelek 3 ajtóval. Az instrukciók megvannak, csak kell egy segítő kéz!' },
            { id: 7, title: 'Kutyasétáltatás', employer: 'Kovács Edit', price: 3000, distance: 0.5, category: 'Ház', location: 'Kaposvár, Rózsa u. 9.', time: 'Ma 17:00', urgent: false, timeOffset: 0, desc: 'Kis labrador kutyus sétáltatása kb. 45 percig a Deseda körül. Szabad és barátságos kutya!' },
            { id: 8, title: 'Hólapátolás', employer: 'Fekete Zoltán', price: 4000, distance: 5.5, category: 'Kert', location: 'Kaposvár, Somogyi u. 15.', time: 'Ma 08:00', urgent: true, timeOffset: 0, desc: 'Bejáró és járda felszabadítása hó alól. Kb. 1 óra munka. Lapát adott.' },
        ];

        // Current state
        let activeRadius = parseInt(localStorage.getItem('melogo_radius') || '10');
        let activeSortMode = 'distance';
        let activeCategoryFilter = 'Összes';
        let currentMapCategory = 'all';
        let selectedMapJob = null;

        // Map pin positions (relative % coordinates)
        const jobMapPositions = {
            1: { top: 55, left: 48 },
            2: { top: 42, left: 62 },
            3: { top: 65, left: 30 },
            4: { top: 38, left: 20 },
            5: { top: 70, left: 72 },
            6: { top: 48, left: 55 },
            7: { top: 60, left: 22 },
            8: { top: 30, left: 45 },
        };

        const catColors = {
            'Kert': { bg: '#16a34a', class: 'cat-kert' },
            'Festés': { bg: '#7c3aed', class: 'cat-festes' },
            'Autó': { bg: '#d97706', class: 'cat-auto' },
            'Ház': { bg: '#2563eb', class: 'cat-haz' },
        };

        // ===================================================================
        // RENDER JOB CARDS
        // ===================================================================
        function renderJobCards(jobs) {
            const list = document.getElementById('worker-jobs-list');
            if (!list) return;
            list.innerHTML = '';

            jobs.forEach(job => {
                const catInfo = catColors[job.category] || { bg: '#6B7280', class: '' };
                const card = document.createElement('div');
                card.className = 'job-card';
                card.setAttribute('data-category', job.category);
                card.setAttribute('data-distance', job.distance);
                card.setAttribute('data-price', job.price);
                card.setAttribute('data-time', job.timeOffset);
                card.setAttribute('data-urgent', job.urgent ? '1' : '0');
                card.setAttribute('data-id', job.id);
                card.style.cursor = 'pointer';
                card.onclick = () => openJobDetailById(job.id);

                card.innerHTML = \`
                    <div class="job-card-header" style="margin-bottom:8px;">
                        <div style="flex:1;">
                            <div class="job-title">\${job.title}</div>
                            <div style="font-size:12px; color:var(--color-text-light); margin-top:2px;">\${job.employer}</div>
                        </div>
                        <div class="job-price">\${job.price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                    <div class="job-card-badges">
                        <span class="job-badge-cat">\${job.category}</span>
                        \${job.urgent ? '<span class="job-badge-urgent">⚡ Sürgős</span>' : ''}
                    </div>
                    <div class="job-meta" style="margin-bottom:0;">
                        <div class="job-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            \${job.distance} km
                        </div>
                        <div class="job-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            \${job.time}
                        </div>
                        <div class="job-meta-item" style="color:var(--color-text-light); font-size:11px;">
                            📍 \${job.location.split(',').slice(-1)[0].trim()}
                        </div>
                    </div>
                \`;
                list.appendChild(card);
            });

            if (jobs.length === 0) {
                list.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--color-text-light);"><div style="font-size:32px; margin-bottom:12px;">🔍</div><div style="font-size:14px;">Nincs találat a szűrők alapján</div></div>';
            }
        }

        function getFilteredAndSortedJobs() {
            let jobs = mockJobs.filter(j => j.distance <= activeRadius);

            if (activeCategoryFilter !== 'Összes' && activeCategoryFilter !== 'all') {
                jobs = jobs.filter(j => j.category === activeCategoryFilter);
            }

            if (activeSortMode === 'distance') {
                jobs.sort((a, b) => a.distance - b.distance);
            } else if (activeSortMode === 'price') {
                jobs.sort((a, b) => b.price - a.price);
            } else if (activeSortMode === 'newest') {
                jobs.sort((a, b) => a.timeOffset - b.timeOffset);
            } else if (activeSortMode === 'urgent') {
                jobs.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
            }

            return jobs;
        }

        function refreshJobList() {
            renderJobCards(getFilteredAndSortedJobs());
        }

        // ===================================================================
        // NEW FILTER/SORT FUNCTIONS
        // ===================================================================
        function filterWorkerJobs(cat) {
            activeCategoryFilter = cat;
            const btns = document.querySelectorAll('.category-btn');
            btns.forEach(btn => {
                const label = btn.innerText.trim();
                const isActive = (cat === 'Összes' && label === 'Minden') ||
                                 label === cat ||
                                 (cat === 'all' && label === 'Minden');
                if (isActive) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = 'var(--color-navy)';
                    btn.style.color = '#fff';
                    btn.style.border = 'none';
                } else {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = '#fff';
                    btn.style.color = 'var(--color-text)';
                    btn.style.border = '1px solid var(--color-border)';
                }
            });
            refreshJobList();
        }

        function sortWorkerJobsNew(mode) {
            activeSortMode = mode;
            document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
            const map = { distance: 'sort-dist', price: 'sort-price', newest: 'sort-new', urgent: 'sort-urg' };
            const el = document.getElementById(map[mode]);
            if (el) el.classList.add('active');
            refreshJobList();
        }

        // ===================================================================
        // JOB DETAIL
        // ===================================================================
        function openJobDetailById(jobId) {
            const job = mockJobs.find(j => j.id === jobId);
            if (!job) return;
            document.getElementById('worker-job-detail-title').innerText = job.title;
            document.getElementById('worker-job-detail-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('worker-job-detail-desc').innerText = job.desc;
            document.getElementById('worker-job-detail-loc').innerText = '📍 ' + job.location + ' (' + job.distance + ' km)';
            document.getElementById('worker-action-overlay').classList.add('active');
        }

        function openJobDetailFromMap() {
            if (selectedMapJob) openJobDetailById(selectedMapJob.id);
        }

        // ===================================================================
        // SEARCH OVERLAY
        // ===================================================================
        function openSearchOverlay() {
            document.getElementById('search-overlay').classList.add('open');
            setTimeout(() => {
                const inp = document.getElementById('search-overlay-input');
                if (inp) inp.focus();
            }, 300);
            onSearchInput('');
        }

        function closeSearchOverlay() {
            document.getElementById('search-overlay').classList.remove('open');
        }

        function onSearchInput(query) {
            const q = query.toLowerCase().trim();
            const resultList = document.getElementById('search-results-list');

            let filtered = mockJobs;
            if (q) {
                filtered = mockJobs.filter(j =>
                    j.title.toLowerCase().includes(q) ||
                    j.category.toLowerCase().includes(q) ||
                    j.location.toLowerCase().includes(q) ||
                    j.employer.toLowerCase().includes(q)
                );
            }

            if (filtered.length === 0) {
                resultList.innerHTML = '<div class="search-empty">Nem található ilyen munka. Próbálj más kulcsszót!</div>';
                return;
            }

            const label = q ? 'Találatok' : 'Összes közeli munka';
            resultList.innerHTML = '<div class="search-section-label">' + label + '</div>' + filtered.map(job => {
                const catInfo = catColors[job.category] || { bg: '#6B7280' };
                return \`
                    <div class="search-result-item" onclick="selectSearchResult(\${job.id})">
                        <div class="search-result-icon" style="background:\${catInfo.bg}20;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="\${catInfo.bg}" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div class="search-result-info">
                            <div class="search-result-title">\${job.title}</div>
                            <div class="search-result-sub">\${job.distance} km · \${job.employer} · \${job.category}</div>
                        </div>
                        <div class="search-result-price">\${job.price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                \`;
            }).join('');
        }

        function selectSearchResult(jobId) {
            closeSearchOverlay();
            setTimeout(() => openJobDetailById(jobId), 350);
        }

        // ===================================================================
        // DISTANCE SHEET
        // ===================================================================
        function openDistanceSheet() {
            const slider = document.getElementById('distance-slider');
            if (slider) slider.value = activeRadius;
            document.getElementById('distance-display-km').innerText = activeRadius;
            updateSliderTrack();
            document.getElementById('distance-sheet-backdrop').classList.add('open');
            document.getElementById('distance-sheet').classList.add('open');
        }

        function closeDistanceSheet() {
            document.getElementById('distance-sheet-backdrop').classList.remove('open');
            document.getElementById('distance-sheet').classList.remove('open');
        }

        function onDistanceSliderChange(val) {
            document.getElementById('distance-display-km').innerText = val;
            updateSliderTrack();
        }

        function updateSliderTrack() {
            const slider = document.getElementById('distance-slider');
            if (!slider) return;
            const pct = ((slider.value - 1) / (50 - 1)) * 100;
            slider.style.background = \`linear-gradient(to right, #22C55E \${pct}%, #E5E7EB \${pct}%)\`;
        }

        function confirmDistance() {
            const val = parseInt(document.getElementById('distance-slider').value);
            activeRadius = val;
            localStorage.setItem('melogo_radius', val);
            document.getElementById('distance-pill-text').innerText = val + ' km';
            closeDistanceSheet();
            refreshJobList();
            renderMapPins();
            showPushNotification('🗺️ Hatótáv frissítve', val + ' km körzetben keresünk munkákat!', '#22C55E');
        }

        // ===================================================================
        // GPS & LOCATION
        // ===================================================================
        function initGPS() {
            if (!navigator.geolocation) {
                setGPSStatus(false, 'GPS nem elérhető');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // Szimuláció: koordináta alapján meghatározunk egy városnevet
                    // Valódi appban reverse geocoding API-t hívnánk
                    setGPSStatus(true, 'Kaposvár');
                },
                (err) => {
                    setGPSStatus(false, 'Helyzet ismeretlen');
                },
                { timeout: 5000 }
            );
        }

        function setGPSStatus(active, cityName) {
            const dot = document.getElementById('gps-dot');
            const label = document.getElementById('gps-city-label');
            const locText = document.getElementById('gps-location-text');
            if (!dot || !label) return;

            if (active) {
                dot.className = 'gps-dot';
                label.innerText = cityName;
                locText.className = 'gps-location';
            } else {
                dot.className = 'gps-dot off';
                label.innerText = cityName;
                locText.className = 'gps-location unknown';
            }
        }

        // ===================================================================
        // MAP PINS
        // ===================================================================
        function renderMapPins() {
            const container = document.getElementById('map-pins-container');
            if (!container) return;
            container.innerHTML = '';

            const visibleJobs = mockJobs.filter(j => j.distance <= activeRadius);

            visibleJobs.forEach(job => {
                const pos = jobMapPositions[job.id];
                if (!pos) return;

                const catInfo = catColors[job.category] || { class: '' };
                const pin = document.createElement('div');
                pin.style.cssText = \`position:absolute; top:\${pos.top}%; left:\${pos.left}%; transform:translate(-50%,-100%); pointer-events:auto;\`;
                pin.setAttribute('data-cat', job.category);
                pin.setAttribute('data-id', job.id);

                pin.innerHTML = \`<div class="map-pin-label \${catInfo.class}" onclick="onMapPinClick(\${job.id})">\${job.price.toLocaleString('hu-HU')} Ft</div>\`;
                container.appendChild(pin);
            });
        }

        function filterMapPins(cat, chipEl) {
            currentMapCategory = cat;
            document.querySelectorAll('.map-chip').forEach(c => c.classList.remove('active'));
            if (chipEl) chipEl.classList.add('active');

            const pins = document.querySelectorAll('#map-pins-container [data-cat]');
            pins.forEach(pin => {
                const pinCat = pin.getAttribute('data-cat');
                if (cat === 'all' || pinCat === cat) {
                    pin.style.display = 'block';
                } else {
                    pin.style.display = 'none';
                }
            });
            document.getElementById('map-preview-card').classList.remove('visible');
        }

        function onMapPinClick(jobId) {
            const job = mockJobs.find(j => j.id === jobId);
            if (!job) return;
            selectedMapJob = job;

            document.getElementById('map-prev-title').innerText = job.title;
            document.getElementById('map-prev-price').innerText = job.price.toLocaleString('hu-HU') + ' Ft';
            document.getElementById('map-prev-meta').innerText = job.distance + ' km · ' + job.employer;

            const card = document.getElementById('map-preview-card');
            card.classList.add('visible');
        }

        // ===================================================================
        // CHAT
        // ===================================================================
        let currentChatMessages = [];

        function openChat(name, jobTitle, lastMsg, time, isUnread) {
            document.getElementById('chat-detail-name').innerText = name || 'Ismeretlen';
            document.getElementById('chat-detail-job').innerText = jobTitle || '';

            const msgContainer = document.getElementById('chat-detail-messages');

            // Build simulated conversation
            const msgs = [
                { from: 'other', text: 'Szia! Elvállalnád a munkát?', time: '10:00' },
                { from: 'me', text: 'Szia! Igen, szívesen! Mikor kell?', time: '10:05' },
                { from: 'other', text: lastMsg || 'Mikor tudnál jönni holnap?', time: time || '10:42' },
            ];

            msgContainer.innerHTML = '<div style="font-size:11px; text-align:center; color:var(--color-text-light); margin-bottom:12px;">Ma</div>';

            msgs.forEach(msg => {
                const bubble = document.createElement('div');
                const isMe = msg.from === 'me';
                bubble.style.cssText = \`
                    max-width:80%; padding:10px 14px; border-radius:\${isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
                    background:\${isMe ? 'var(--color-navy)' : '#fff'};
                    color:\${isMe ? '#fff' : 'var(--color-navy)'};
                    font-size:14px; align-self:\${isMe ? 'flex-end' : 'flex-start'};
                    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
                \`;
                bubble.innerHTML = msg.text + \`<div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">\${msg.time}</div>\`;
                msgContainer.appendChild(bubble);
            });

            msgContainer.scrollTop = msgContainer.scrollHeight;
            document.getElementById('chat-detail-overlay').classList.add('open');
        }

        function sendChatMessageNew() {
            const input = document.getElementById('chat-reply-input');
            const text = input.value.trim();
            if (!text) return;

            const msgContainer = document.getElementById('chat-detail-messages');
            const bubble = document.createElement('div');
            const now = new Date();
            const t = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

            bubble.style.cssText = \`
                max-width:80%; padding:10px 14px; border-radius:18px 18px 4px 18px;
                background:var(--color-navy); color:#fff; font-size:14px;
                align-self:flex-end; box-shadow: 0 1px 4px rgba(0,0,0,0.07);
            \`;
            bubble.innerHTML = text + \`<div style="font-size:10px; opacity:0.5; margin-top:4px; text-align:right;">\${t}</div>\`;
            msgContainer.appendChild(bubble);
            input.value = '';
            msgContainer.scrollTop = msgContainer.scrollHeight;

            // Simulate reply after 2 seconds
            setTimeout(() => {
                const replies = [
                    'Rendben, holnap ott leszek!',
                    'Köszönöm, hamarosan visszajövök.',
                    'Igen, megfelelő! 👍',
                    'Oké, várlak!',
                ];
                const reply = replies[Math.floor(Math.random() * replies.length)];
                const rb = document.createElement('div');
                rb.style.cssText = \`
                    max-width:80%; padding:10px 14px; border-radius:18px 18px 18px 4px;
                    background:#fff; color:var(--color-navy); font-size:14px;
                    align-self:flex-start; box-shadow: 0 1px 4px rgba(0,0,0,0.07);
                \`;
                const now2 = new Date();
                const t2 = now2.getHours() + ':' + String(now2.getMinutes()).padStart(2, '0');
                rb.innerHTML = reply + \`<div style="font-size:10px; opacity:0.5; margin-top:4px;">\${t2}</div>\`;
                msgContainer.appendChild(rb);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, 2000);
        }

        function triggerPhotoAttach() {
            showPushNotification('📷 Fotó feltöltve', 'A munka fotója el lett küldve a munkáltatónak!', '#22C55E');
            const msgContainer = document.getElementById('chat-detail-messages');
            const bubble = document.createElement('div');
            bubble.style.cssText = \`
                max-width:85%; padding:10px 14px; border-radius:18px 18px 4px 18px;
                background:var(--color-navy); color:#fff; font-size:14px;
                align-self:flex-end; box-shadow: 0 1px 4px rgba(0,0,0,0.07);
            \`;
            bubble.innerHTML = '<div style="width:100%; height:80px; background:rgba(255,255,255,0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px;">📷</div><div style="font-size:11px; margin-top:6px; opacity:0.7;">Munka fotója elküldve</div>';
            msgContainer.appendChild(bubble);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }

        // ===================================================================
        // PUSH NOTIFICATION BANNER
        // ===================================================================
        function showPushNotification(title, msg, color) {
            const banner = document.getElementById('push-banner');
            const icon = document.getElementById('push-banner-icon');
            document.getElementById('push-banner-title').innerText = title;
            document.getElementById('push-banner-msg').innerText = msg;
            if (icon && color) icon.style.background = color;
            banner.classList.add('show');
            setTimeout(() => banner.classList.remove('show'), 4000);
        }

        // ===================================================================
        // INIT ON LOAD
        // ===================================================================
        const _oldOnLoad = window.onload;
        window.onload = function() {
            if (_oldOnLoad) _oldOnLoad();

            // Init distance pill
            document.getElementById('distance-pill-text').innerText = activeRadius + ' km';

            // Init slider track
            const slider = document.getElementById('distance-slider');
            if (slider) {
                slider.value = activeRadius;
                updateSliderTrack();
            }

            // Init GPS
            initGPS();

            // Render jobs
            refreshJobList();

            // Render map pins
            renderMapPins();

            // Show welcome push notification after 2.5 seconds
            setTimeout(() => {
                showPushNotification('🏠 Üdv a MeloGo-ban!', '8 munka a közeledben · ' + activeRadius + ' km körzetben', '#22C55E');
            }, 2500);
        };
`;

// Insert the new JS before closing </script>
const scriptClose = '    </script>';
const scriptCloseIdx = html.lastIndexOf(scriptClose);
if (scriptCloseIdx !== -1) {
    html = html.substring(0, scriptCloseIdx) + newJS + '\n\n' + scriptClose + html.substring(scriptCloseIdx + scriptClose.length);
    console.log('✅ New JS injected');
} else {
    console.log('❌ Could not find </script>');
}

// Save
fs.writeFileSync('index.html', html, 'utf8');
console.log('\n🎉 All changes applied successfully!');
console.log('Total file size:', Math.round(html.length / 1024) + ' KB');
