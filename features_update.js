const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ============================================================
// FEATURE 0: AUTO-SAVE CSS + HTML (Mentve indicator)
// ============================================================
const autoSaveCSS = `
        /* ===== AUTO-SAVE INDICATOR ===== */
        .autosave-indicator {
            position: absolute;
            top: 12px;
            right: 16px;
            font-size: 11px;
            color: #9CA3AF;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 400;
        }
        .autosave-indicator.show { opacity: 1; }
        .autosave-dot {
            width: 5px; height: 5px;
            border-radius: 50%;
            background: #22C55E;
        }
`;

// ============================================================
// FEATURE 1: BOTTOM NAV CAPSULE CSS
// ============================================================
const newNavCSS = `
        /* ===== BOTTOM NAV APPLE CAPSULE ===== */
        .bottom-nav {
            position: absolute;
            bottom: 16px;
            left: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid #E5E7EB;
            border-radius: 28px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            z-index: 100;
            flex-shrink: 0;
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: #9CA3AF;
            cursor: pointer;
            gap: 3px;
            flex: 1;
            height: 100%;
            border-radius: 24px;
            transition: all 0.15s;
            position: relative;
        }
        .nav-item.active {
            color: #0A0F2E;
        }
        .nav-item.active svg {
            color: #0A0F2E;
            stroke: #0A0F2E;
        }
        .nav-icon {
            width: 22px;
            height: 22px;
        }
        .nav-label {
            font-size: 10px;
            font-weight: 400;
        }
        .nav-item.active .nav-label {
            font-weight: 500;
            color: #0A0F2E;
        }
        .nav-badge {
            position: absolute;
            top: 8px;
            right: calc(50% - 18px);
            background: #EF4444;
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            min-width: 16px;
            height: 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
        }
`;

// ============================================================
// FEATURE 2: SORT PILLS CSS
// ============================================================
const newSortPillCSS = `
        /* ===== SORT PILLS (with SVG icons) ===== */
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
            display: flex;
            align-items: center;
            gap: 5px;
            height: 34px;
            padding: 0 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
            background: #fff;
            border: 1px solid #E5E7EB;
            color: #6B7280;
            transition: all 0.15s;
            flex-shrink: 0;
        }
        .sort-pill svg { flex-shrink: 0; }
        .sort-pill.active {
            background: #0A0F2E;
            color: #fff;
            border-color: transparent;
        }
        .sort-pill.active svg { stroke: #fff; }
`;

// ============================================================
// FEATURE 3: JOB DETAIL APPLY BUTTON + LOADING STATE CSS
// ============================================================
const applyBtnCSS = `
        /* ===== APPLY BUTTON ===== */
        .apply-btn-main {
            width: 100%;
            height: 52px;
            background: #0A0F2E;
            color: #fff;
            border: none;
            border-radius: 14px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: transform 0.12s ease, background 0.2s ease;
        }
        .apply-btn-main:active { transform: scale(0.97); }
        .apply-btn-main.loading {
            background: #374151;
            pointer-events: none;
        }
        .apply-btn-main.confirmed {
            background: #22C55E;
            pointer-events: none;
        }
        .apply-btn-main.applied {
            background: #9CA3AF;
            pointer-events: none;
            cursor: not-allowed;
        }
        .btn-spinner {
            width: 18px; height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ===== EMPLOYER FORM - FULL REDESIGN ===== */
        .emp-form-header {
            background: #0A0F2E;
            padding: 44px 20px 20px 20px;
            display: flex;
            align-items: center;
            gap: 14px;
            flex-shrink: 0;
        }
        .emp-form-back-btn {
            background: rgba(255,255,255,0.12);
            border: none;
            border-radius: 10px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #fff;
            flex-shrink: 0;
        }
        .emp-form-title {
            font-size: 20px;
            font-weight: 700;
            color: #fff;
            font-family: 'Poppins', sans-serif;
        }
        .emp-form-body {
            flex: 1;
            overflow-y: auto;
            background: #F8F9FB;
            padding: 20px;
            padding-bottom: 100px;
        }
        .emp-form-section {
            background: #fff;
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 12px;
            border: 1px solid #F3F4F6;
        }
        .emp-section-label {
            font-size: 11px;
            font-weight: 600;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .emp-cat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .emp-cat-card {
            background: #F8F9FB;
            border: 1.5px solid #E5E7EB;
            border-radius: 14px;
            height: 72px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.15s;
            font-size: 13px;
            font-weight: 500;
            color: #374151;
        }
        .emp-cat-card.active {
            border: 2px solid #0A0F2E;
            background: #F0F2FF;
            color: #0A0F2E;
        }
        .emp-cat-card:active { transform: scale(0.97); }
        .emp-picker-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            cursor: pointer;
        }
        .emp-picker-row:not(:last-child) {
            border-bottom: 1px solid #F3F4F6;
        }
        .emp-picker-left {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: #374151;
        }
        .emp-picker-icon {
            width: 32px; height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F3F4F6;
            flex-shrink: 0;
        }
        .emp-input {
            width: 100%;
            border: none;
            outline: none;
            font-size: 15px;
            color: #1F2937;
            background: transparent;
            padding: 4px 0;
        }
        .emp-input::placeholder { color: #D1D5DB; }
        .emp-input-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #F3F4F6;
        }
        .emp-input-row:last-child { border-bottom: none; }
        .emp-textarea {
            width: 100%;
            border: none;
            outline: none;
            font-size: 14px;
            color: #1F2937;
            background: transparent;
            resize: none;
            min-height: 80px;
            line-height: 1.5;
        }
        .emp-textarea::placeholder { color: #D1D5DB; }
        .emp-char-counter {
            text-align: right;
            font-size: 11px;
            color: #9CA3AF;
            margin-top: 6px;
        }
        .emp-price-display {
            text-align: center;
            padding: 8px 0;
        }
        .emp-price-number {
            font-size: 40px;
            font-weight: 800;
            color: #0A0F2E;
            font-family: 'Poppins', sans-serif;
            letter-spacing: -1px;
        }
        .emp-price-unit {
            font-size: 20px;
            font-weight: 600;
            color: #9CA3AF;
            margin-left: 4px;
        }
        .emp-price-input-hidden {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            width: 1px;
            height: 1px;
        }
        .emp-recommended-price {
            text-align: center;
            font-size: 12px;
            color: #22C55E;
            font-weight: 500;
            margin-top: 4px;
        }
        .emp-submit-fixed {
            position: absolute;
            bottom: 96px;
            left: 20px;
            right: 20px;
            z-index: 10;
        }
        .emp-submit-btn {
            width: 100%;
            height: 52px;
            background: #0A0F2E;
            color: #fff;
            border: none;
            border-radius: 14px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(10,15,46,0.3);
            transition: transform 0.12s;
        }
        .emp-submit-btn:active { transform: scale(0.98); }
        .emp-field-error {
            font-size: 11px;
            color: #EF4444;
            margin-top: 4px;
            display: none;
        }
        .emp-field-error.show { display: block; }
        .emp-input.error, .emp-textarea.error {
            color: #EF4444;
        }

        /* ===== SUCCESS ANIMATION ===== */
        .emp-success-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #fff;
            z-index: 9000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s;
        }
        .emp-success-overlay.show {
            opacity: 1;
            pointer-events: auto;
        }
        .emp-success-circle {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: #22C55E;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes successPop {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .emp-success-title {
            font-size: 22px;
            font-weight: 700;
            color: #0A0F2E;
            margin-bottom: 8px;
        }
        .emp-success-sub {
            font-size: 14px;
            color: #6B7280;
        }

        /* Screens padding for floating nav */
        .screens-container {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        .screen {
            position: absolute;
            top: 0; left: 0; right: 0;
            bottom: 0;
            overflow-y: auto;
            padding-bottom: 96px;
        }
        /* Map screen doesn't need padding */
        #app-map-screen {
            padding-bottom: 0 !important;
        }
`;

// ============================================================
// Insert all CSS before </style>
// ============================================================
const styleClose = '    </style>';
const firstStyleClose = h.indexOf(styleClose);
h = h.substring(0, firstStyleClose) + autoSaveCSS + newNavCSS + newSortPillCSS + applyBtnCSS + '\n' + styleClose + h.substring(firstStyleClose + styleClose.length);
console.log('✅ CSS inserted');

// ============================================================
// FEATURE 1: REPLACE OLD BOTTOM NAV CSS (disable old rules)
// ============================================================
// The old nav CSS is at lines 448-486. We'll just let the new CSS override it.
// Actually let's surgically replace the old .bottom-nav block
const oldNavCSS = `        /* Bottom Nav Fix */
        .bottom-nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background-color: #fff;
            border-top: 1px solid var(--color-border);
            padding-top: 12px;
            padding-bottom: 24px;
            flex-shrink: 0;
            z-index: 100;
            width: 100%;
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: #9CA3AF;
            cursor: pointer;
            gap: 4px;
            width: 25%;
        }
        .nav-item.active {
            color: var(--color-navy);
        }
        .nav-item.active svg {
            color: var(--color-navy);
            stroke-width: 3;
        }
        .nav-icon {
            width: 24px;
            height: 24px;
        }
        .nav-label {
            font-size: 11px;
            font-weight: 600;
        }`;

if (h.includes(oldNavCSS)) {
    h = h.replace(oldNavCSS, '        /* Bottom nav CSS moved to new capsule style above */');
    console.log('✅ Old nav CSS removed');
} else {
    console.log('⚠️ Old nav CSS not found exactly - new CSS will override via cascade');
}

// ============================================================
// FEATURE 2: REPLACE SORT PILLS WITH SVG ICONS
// ============================================================
const svgMapPin = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const svgCoin = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v1m0 6v1M9.5 10a2.5 2.5 0 1 1 3 4 2.5 2.5 0 1 1-3-4"/></svg>`;
const svgClock = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const svgBolt = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;

const oldSortRow = `                    <!-- Sort Pills -->
                    <div class="sort-row">
                        <div class="sort-pill active" id="sort-dist" onclick="sortWorkerJobsNew('distance')">📍 Távolság</div>
                        <div class="sort-pill" id="sort-price" onclick="sortWorkerJobsNew('price')">💰 Ár</div>
                        <div class="sort-pill" id="sort-new" onclick="sortWorkerJobsNew('newest')">🕐 Legfrissebb</div>
                        <div class="sort-pill" id="sort-urg" onclick="sortWorkerJobsNew('urgent')">⚡ Sürgős</div>
                    </div>`;

const newSortRow = `                    <!-- Sort Pills -->
                    <div class="sort-row">
                        <div class="sort-pill active" id="sort-dist" onclick="sortWorkerJobsNew('distance')">${svgMapPin} Távolság</div>
                        <div class="sort-pill" id="sort-price" onclick="sortWorkerJobsNew('price')">${svgCoin} Ár</div>
                        <div class="sort-pill" id="sort-new" onclick="sortWorkerJobsNew('newest')">${svgClock} Legfrissebb</div>
                        <div class="sort-pill" id="sort-urg" onclick="sortWorkerJobsNew('urgent')">${svgBolt} Sürgős</div>
                    </div>`;

if (h.includes(oldSortRow)) {
    h = h.replace(oldSortRow, newSortRow);
    console.log('✅ Sort pills updated');
} else {
    console.log('⚠️ Sort pills not found exactly');
}

// ============================================================
// FEATURE 3: JOB DETAIL "JELENTKEZÉS" BUTTON REDESIGN
// ============================================================
const oldApplyBtn = `                            <button class="btn" style="background-color: var(--color-midnight);" onclick="workerApplyToJob()">
                                Jelentkezés a munkára 🚀
                            </button>`;

const newApplyBtn = `                            <button class="apply-btn-main" id="worker-apply-btn" onclick="handleWorkerApply()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                Jelentkezem a munkára
                            </button>`;

if (h.includes(oldApplyBtn)) {
    h = h.replace(oldApplyBtn, newApplyBtn);
    console.log('✅ Apply button redesigned');
} else {
    console.log('⚠️ Apply button not found exactly');
}

// ============================================================
// FEATURE 4: EMPLOYER FORM - FULL REDESIGN
// ============================================================
const oldEmpForm = `                <!-- Új munka feladása Overlay -->
                <div class="settings-overlay" id="employer-form-overlay">
                    <div class="settings-header" style="background-color: white; border-bottom: 1px solid var(--color-border); z-index: 10;">
                        <button class="settings-back-btn" onclick="closeEmployerFormOverlay()" style="color: var(--color-text-dark);">
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
                </div>`;

const newEmpForm = `                <!-- Új munka feladása Overlay - TELJES ÚJRATERVEZÉS -->
                <div class="settings-overlay" id="employer-form-overlay" style="display:flex; flex-direction:column;">
                    <!-- Dark Navy Header -->
                    <div class="emp-form-header">
                        <button class="emp-form-back-btn" onclick="closeEmployerFormOverlay()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div class="emp-form-title">Új munka feladása</div>
                        <div style="position:absolute; top:44px; right:20px;" id="emp-autosave" class="autosave-indicator">
                            <div class="autosave-dot"></div>Mentve
                        </div>
                    </div>

                    <!-- Scrollable Form Body -->
                    <div class="emp-form-body" id="emp-form-body">

                        <!-- Card 1: Kategória -->
                        <div class="emp-form-section">
                            <div class="emp-section-label">Kategória</div>
                            <div class="emp-cat-grid">
                                <div class="emp-cat-card active" id="emp-cat-Kert" onclick="selectEmpCat('Kert')">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12c-2.5-2.5-6-2.5-6-2.5s0 3.5 6 2.5Z"/><path d="M12 14c2.5-2.5 6-2.5 6-2.5s0 3.5-6 2.5Z"/></svg>
                                    🌳 Kert
                                </div>
                                <div class="emp-cat-card" id="emp-cat-Festés" onclick="selectEmpCat('Festés')">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/><circle cx="7.5" cy="10.5" r="1.2" fill="#7c3aed"/><circle cx="12" cy="7.5" r="1.2" fill="#7c3aed"/><circle cx="16.5" cy="10.5" r="1.2" fill="#7c3aed"/></svg>
                                    🎨 Festés
                                </div>
                                <div class="emp-cat-card" id="emp-cat-Autó" onclick="selectEmpCat('Autó')">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.2-1.4.7L3 11c-.6.8-1 1.8-1 2.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>
                                    🚗 Autó
                                </div>
                                <div class="emp-cat-card" id="emp-cat-Ház" onclick="selectEmpCat('Ház')">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="12" width="6" height="5" rx="1"/></svg>
                                    🏠 Ház belseje
                                </div>
                            </div>
                        </div>

                        <!-- Card 2: Pontos munka -->
                        <div class="emp-form-section">
                            <div class="emp-section-label">Pontos munka</div>
                            <div class="emp-picker-row" onclick="openJobPickerNew()" id="emp-job-picker-row">
                                <div class="emp-picker-left">
                                    <div class="emp-picker-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>
                                    </div>
                                    <span id="emp-job-picker-label" style="font-size:14px; color:#1F2937;">Fűnyírás</span>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                            <div class="emp-field-error" id="err-job">Kérlek válassz munkát!</div>
                            <!-- Hidden select for compatibility -->
                            <select id="emp-job-select" style="display:none;" onchange="updatePredefinedJobPrice(this.value)"></select>
                        </div>

                        <!-- Card 3: Leírás -->
                        <div class="emp-form-section" style="position:relative;">
                            <div class="emp-section-label">Leírás</div>
                            <textarea class="emp-textarea" id="emp-details" placeholder="Írd le pontosan mit kell csinálni..." maxlength="300" oninput="updateEmpDescCounter(this)"></textarea>
                            <div class="emp-char-counter" id="emp-desc-counter">0 / 300</div>
                            <div class="emp-field-error" id="err-desc">Írj legalább 10 karaktert!</div>
                        </div>

                        <!-- Card 4: Helyszín -->
                        <div class="emp-form-section">
                            <div class="emp-section-label">Helyszín</div>
                            <div class="emp-input-row">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <input class="emp-input" id="emp-city" value="Kaposvár" placeholder="Város">
                            </div>
                            <div class="emp-input-row">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink:0;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                <input class="emp-input" id="emp-street" placeholder="Utca, házszám (pl. Fő utca 12.)">
                            </div>
                            <!-- hidden county and house fields for backwards compat -->
                            <input type="hidden" id="emp-county" value="Somogy">
                            <input type="hidden" id="emp-house" value="">
                            <div class="emp-field-error" id="err-loc">Add meg a helyszínt!</div>
                        </div>

                        <!-- Card 5: Díjazás -->
                        <div class="emp-form-section" style="position:relative;">
                            <div class="emp-section-label">Díjazás</div>
                            <div class="emp-price-display" onclick="focusEmpPrice()">
                                <span class="emp-price-number" id="emp-price-display">12 000</span>
                                <span class="emp-price-unit">Ft</span>
                            </div>
                            <input type="number" id="emp-price-input" class="emp-price-input-hidden" value="12000" oninput="updateEmpPriceDisplay(this.value)">
                            <div class="emp-recommended-price" id="emp-recommended-label">Ajánlott piaci ár: 12 000 Ft</div>
                            <div style="display:flex; justify-content:center; gap: 8px; margin-top:12px;">
                                <button onclick="adjustEmpPrice(-1000)" style="background:#F3F4F6; border:none; padding:6px 14px; border-radius:8px; font-size:14px; cursor:pointer; font-weight:500; color:#374151;">−1 000</button>
                                <button onclick="adjustEmpPrice(1000)" style="background:#F3F4F6; border:none; padding:6px 14px; border-radius:8px; font-size:14px; cursor:pointer; font-weight:500; color:#374151;">+1 000</button>
                                <button onclick="adjustEmpPrice(5000)" style="background:#F3F4F6; border:none; padding:6px 14px; border-radius:8px; font-size:14px; cursor:pointer; font-weight:500; color:#374151;">+5 000</button>
                            </div>
                        </div>

                        <!-- Card 6: Időpont -->
                        <div class="emp-form-section">
                            <div class="emp-section-label">Időpont</div>
                            <div class="emp-input-row">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink:0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <input type="datetime-local" class="emp-input" id="emp-datetime" style="color:#1F2937;">
                            </div>
                        </div>

                    </div>

                    <!-- Fixed Submit Button -->
                    <div class="emp-submit-fixed">
                        <button class="emp-submit-btn" onclick="employerPublishJobNew()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            Hirdetés közzététele
                        </button>
                    </div>

                    <!-- Success Animation Overlay -->
                    <div class="emp-success-overlay" id="emp-success-anim">
                        <div class="emp-success-circle">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div class="emp-success-title">Hirdetés közzétéve!</div>
                        <div class="emp-success-sub">Diákok már keresik a munkát</div>
                    </div>
                </div>`;

if (h.includes(oldEmpForm)) {
    h = h.replace(oldEmpForm, newEmpForm);
    console.log('✅ Employer form fully redesigned');
} else {
    // Try partial match on the first distinctive line
    const empFormStart = h.indexOf('                <!-- Új munka feladása Overlay -->');
    const empFormEnd = h.indexOf('                </div>\n                \n                <!-- Hirdető Chat');
    if (empFormStart !== -1 && empFormEnd !== -1) {
        h = h.substring(0, empFormStart) + newEmpForm + '\n' + h.substring(empFormEnd + 17);
        console.log('✅ Employer form redesigned (partial match)');
    } else {
        console.log('❌ Employer form not found');
    }
}

// ============================================================
// Add new JavaScript for all features
// ============================================================
const newFeatureJS = `

        // ================================================================
        // AUTO-SAVE SYSTEM
        // ================================================================
        const autoSaveTimers = {};
        const autoSaveIndicators = {};

        function initAutoSave() {
            // Find all inputs, textareas, selects that have an ID
            const formEls = document.querySelectorAll('input[id], textarea[id], select[id]');
            formEls.forEach(el => {
                // Restore saved value
                const saved = localStorage.getItem('as_' + el.id);
                if (saved !== null && el.type !== 'submit' && el.type !== 'button') {
                    if (el.type === 'checkbox') {
                        el.checked = saved === 'true';
                    } else {
                        el.value = saved;
                    }
                }
                // Listen for changes
                el.addEventListener('input', () => {
                    clearTimeout(autoSaveTimers[el.id]);
                    autoSaveTimers[el.id] = setTimeout(() => {
                        localStorage.setItem('as_' + el.id, el.value);
                        showAutoSaveIndicator(el);
                    }, 500);
                });
            });
            console.log('[AutoSave] Initialized on', formEls.length, 'elements');
        }

        function showAutoSaveIndicator(triggerEl) {
            // Show "Mentve" in the nearest settings-overlay parent or form overlay
            let container = triggerEl.closest('.settings-overlay, .action-overlay, #employer-form-overlay');
            if (!container) return;
            let indicator = container.querySelector('.autosave-indicator');
            if (!indicator) return;
            indicator.classList.add('show');
            clearTimeout(indicator._hideTimer);
            indicator._hideTimer = setTimeout(() => indicator.classList.remove('show'), 1500);
        }

        // ================================================================
        // NEW APPLY BUTTON HANDLER
        // ================================================================
        function handleWorkerApply() {
            const btn = document.getElementById('worker-apply-btn');
            if (!btn || btn.classList.contains('loading') || btn.classList.contains('confirmed') || btn.classList.contains('applied')) return;

            // Loading state
            btn.classList.add('loading');
            btn.innerHTML = '<div class="btn-spinner"></div> Küldés...';

            setTimeout(() => {
                // Call original apply function
                workerApplyToJob();

                // Confirmed state
                btn.classList.remove('loading');
                btn.classList.add('confirmed');
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Jelentkezés elküldve';

                // Push notification
                showPushNotification('📩 Kovács Bence jelentkezett', 'A munkádra: ' + (gameState.jobTitle || 'Fűnyírás'), '#0A0F2E');
            }, 1000);
        }

        function updateApplyBtnState() {
            const btn = document.getElementById('worker-apply-btn');
            if (!btn) return;
            if (gameState.applied) {
                btn.classList.add('applied');
                btn.classList.remove('loading', 'confirmed');
                if (gameState.status === 'Keresés') {
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Már jelentkeztél';
                } else if (gameState.status === 'Fizetve') {
                    btn.innerHTML = '🔒 Letét zárolva — Munkára!';
                }
            }
        }

        // ================================================================
        // EMPLOYER FORM — NEW FUNCTIONS
        // ================================================================
        let empActiveCat = 'Kert';

        function selectEmpCat(cat) {
            empActiveCat = cat;
            // Also call original function for compatibility
            selectEmployerFormCat(cat);
            
            document.querySelectorAll('.emp-cat-card').forEach(c => c.classList.remove('active'));
            const el = document.getElementById('emp-cat-' + cat);
            if (el) el.classList.add('active');
            
            // Update picker label to first item of this category
            if (typeof jobCatalog !== 'undefined' && jobCatalog[cat]) {
                const firstItem = jobCatalog[cat][0];
                const label = document.getElementById('emp-job-picker-label');
                if (label) label.textContent = firstItem.name;
                updateEmpPriceFromJob(firstItem.name);
            }
        }

        function openJobPickerNew() {
            // Open a bottom sheet with the job options for the selected category
            const items = (typeof jobCatalog !== 'undefined' && jobCatalog[empActiveCat]) ? jobCatalog[empActiveCat] : [];
            const sheetId = 'emp-job-picker-sheet';
            
            // Remove old sheet if exists
            const oldSheet = document.getElementById(sheetId);
            if (oldSheet) oldSheet.remove();
            
            const backdrop = document.createElement('div');
            backdrop.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:8000;';
            backdrop.onclick = () => { backdrop.remove(); sheet.remove(); };
            
            const sheet = document.createElement('div');
            sheet.id = sheetId;
            sheet.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:#fff;border-top-left-radius:24px;border-top-right-radius:24px;z-index:8001;padding:20px;max-height:70%;overflow-y:auto;';
            sheet.innerHTML = '<div style="width:36px;height:4px;background:#E5E7EB;border-radius:2px;margin:0 auto 16px;"></div><div style="font-size:16px;font-weight:700;color:#0A0F2E;margin-bottom:16px;">' + empActiveCat + ' munkák</div>';
            
            items.forEach(item => {
                const row = document.createElement('div');
                row.style.cssText = 'padding:14px 0;border-bottom:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:center;cursor:pointer;';
                row.innerHTML = '<span style="font-size:14px;color:#1F2937;font-weight:500;">' + item.name + '</span><span style="font-size:13px;color:#22C55E;font-weight:600;">' + item.price.toLocaleString('hu-HU') + ' Ft</span>';
                row.onclick = () => {
                    const label = document.getElementById('emp-job-picker-label');
                    if (label) label.textContent = item.name;
                    // Update hidden select
                    const sel = document.getElementById('emp-job-select');
                    if (sel) {
                        sel.value = item.name;
                    }
                    updateEmpPriceFromJob(item.name);
                    backdrop.remove();
                    sheet.remove();
                };
                sheet.appendChild(row);
            });
            
            const phoneApp = document.getElementById('phone-app');
            if (phoneApp) { phoneApp.appendChild(backdrop); phoneApp.appendChild(sheet); }
        }

        function updateEmpDescCounter(el) {
            const counter = document.getElementById('emp-desc-counter');
            if (counter) counter.textContent = el.value.length + ' / 300';
        }

        function updateEmpPriceDisplay(val) {
            const n = parseInt(val) || 0;
            const display = document.getElementById('emp-price-display');
            if (display) display.textContent = n.toLocaleString('hu-HU');
        }

        function updateEmpPriceFromJob(jobName) {
            if (typeof jobCatalog === 'undefined') return;
            let price = 12000;
            for (const cat in jobCatalog) {
                const match = jobCatalog[cat].find(j => j.name === jobName);
                if (match) { price = match.price; break; }
            }
            const inp = document.getElementById('emp-price-input');
            const lbl = document.getElementById('emp-recommended-label');
            if (inp) inp.value = price;
            if (lbl) lbl.textContent = 'Ajánlott piaci ár: ' + price.toLocaleString('hu-HU') + ' Ft';
            updateEmpPriceDisplay(price);
        }

        function focusEmpPrice() {
            const inp = document.getElementById('emp-price-input');
            if (inp) inp.focus();
        }

        function adjustEmpPrice(delta) {
            const inp = document.getElementById('emp-price-input');
            if (!inp) return;
            const cur = parseInt(inp.value) || 0;
            inp.value = Math.max(1000, cur + delta);
            updateEmpPriceDisplay(inp.value);
        }

        function employerPublishJobNew() {
            // Validate fields
            let valid = true;

            const city = document.getElementById('emp-city');
            const street = document.getElementById('emp-street');
            const details = document.getElementById('emp-details');
            const jobLabel = document.getElementById('emp-job-picker-label');

            // Hide all errors first
            document.querySelectorAll('.emp-field-error').forEach(e => e.classList.remove('show'));

            if (!details || details.value.length < 10) {
                valid = false;
                const err = document.getElementById('err-desc');
                if (err) err.classList.add('show');
                if (details) details.classList.add('error');
                setTimeout(() => { if (details) details.classList.remove('error'); }, 2000);
            }

            if (!street || !street.value.trim()) {
                valid = false;
                const err = document.getElementById('err-loc');
                if (err) err.classList.add('show');
                if (street) { street.style.borderBottom = '2px solid #EF4444'; setTimeout(() => street.style.borderBottom = '', 2000); }
            }

            if (!valid) {
                // Scroll to first error
                const firstErr = document.querySelector('.emp-field-error.show');
                if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Submit: call original publish function
            employerPublishJob();

            // Show success animation
            const anim = document.getElementById('emp-success-anim');
            if (anim) {
                anim.classList.add('show');
                setTimeout(() => {
                    anim.classList.remove('show');
                    closeEmployerFormOverlay();
                    showPushNotification('🚀 Hirdetés közzétéve!', 'Diákok már látják a munkádat', '#22C55E');
                }, 1800);
            }
        }

        // Init datetime field with today + 1 hour
        function initEmpDatetime() {
            const dt = document.getElementById('emp-datetime');
            if (!dt) return;
            const saved = localStorage.getItem('as_emp-datetime');
            if (saved) { dt.value = saved; return; }
            const now = new Date();
            now.setHours(now.getHours() + 1, 0, 0, 0);
            const pad = n => String(n).padStart(2, '0');
            dt.value = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':00';
        }

        // ================================================================
        // OVERRIDE window.onload TO ADD NEW INITS
        // ================================================================
        const _prevOnLoad2 = window.onload;
        window.onload = function() {
            if (_prevOnLoad2) _prevOnLoad2();
            
            // Init auto-save
            initAutoSave();
            
            // Init datetime
            initEmpDatetime();

            // Init employer form category
            if (typeof selectEmployerFormCat === 'function') {
                selectEmployerFormCat('Kert');
            }

            // Init emp price display
            const empPrice = document.getElementById('emp-price-input');
            if (empPrice) updateEmpPriceDisplay(empPrice.value);
        };
`;

// Insert before closing </script>
const scriptClose = '    </script>';
const lastScriptClose = h.lastIndexOf(scriptClose);
if (lastScriptClose !== -1) {
    h = h.substring(0, lastScriptClose) + newFeatureJS + '\n\n' + scriptClose + h.substring(lastScriptClose + scriptClose.length);
    console.log('✅ New feature JS injected');
} else {
    console.log('❌ Could not find </script>');
}

// ============================================================
// Add autosave indicator to the worker-action-overlay header
// ============================================================
const oldActionHeader = `                    <div class="action-header">
                        <span style="font-weight: 700; font-size: 14px;" id="worker-job-detail-title">Fűnyírás a Desedánál</span>
                        <button style="background:none; border:none; color:white; font-weight:700; cursor:pointer;" onclick="document.getElementById('worker-action-overlay').classList.remove('active')">Bezár</button>
                    </div>`;

const newActionHeader = `                    <div class="action-header" style="position:relative;">
                        <span style="font-weight: 700; font-size: 14px;" id="worker-job-detail-title">Fűnyírás a Desedánál</span>
                        <button style="background:none; border:none; color:white; font-weight:700; cursor:pointer;" onclick="document.getElementById('worker-action-overlay').classList.remove('active')">Bezár</button>
                    </div>`;

// (kept same but with position:relative for future indicator)

// Save
fs.writeFileSync('index.html', h, 'utf8');
console.log('\n🎉 All features applied!');
console.log('File size:', Math.round(h.length / 1024), 'KB');
