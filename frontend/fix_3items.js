const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ================================================================
// FIX 1: BACK BUTTONS — csak ikon, szöveg nélkül (iOS stílus)
// ================================================================
// CSS fix: settings-back-btn legyen csak ikon gomb
const oldBackBtnCSS = h.match(/\.settings-back-btn \{[^}]+\}/)?.[0];
if (oldBackBtnCSS) {
    const newBackBtnCSS = `.settings-back-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F3F4F6;
            border: none;
            border-radius: 10px;
            width: 34px;
            height: 34px;
            cursor: pointer;
            color: var(--color-text-dark);
            flex-shrink: 0;
        }`;
    h = h.replace(oldBackBtnCSS, newBackBtnCSS);
    console.log('✅ settings-back-btn CSS updated');
} else {
    // Just inject it
    const styleClose = '    </style>';
    const insertCSS = `
        /* Back button - iOS icon only style */
        .settings-back-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F3F4F6;
            border: none;
            border-radius: 10px;
            width: 34px;
            height: 34px;
            cursor: pointer;
            color: var(--color-text-dark);
            flex-shrink: 0;
        }
    `;
    const idx = h.indexOf(styleClose);
    h = h.substring(0, idx) + insertCSS + h.substring(idx);
    console.log('✅ Back button CSS injected');
}

// Remove "Vissza" text from ALL back buttons
// Pattern: >Vissza</button> or > Vissza\n </button>
h = h.replace(/>\s*Vissza\s*<\/button>/g, '></button>');
h = h.replace(/>\s*Mégse\s*<\/button>/g, '></button>');
// In the employer form header, the back button already uses emp-form-back-btn class - keep it

// Also fix the chat header "Vissza" text
h = h.replace(/>\s*Vissza\n\s*<\/button>/g, '></button>');
console.log('✅ Vissza/Mégse text removed from back buttons');

// Fix the Profil back button text too
const profilBackOld = `<button class="settings-back-btn" onclick="closeSettings()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Profil
                        </button>`;
const profilBackNew = `<button class="settings-back-btn" onclick="closeSettings()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>`;
if (h.includes(profilBackOld)) {
    h = h.replace(profilBackOld, profilBackNew);
    console.log('✅ Profil back button fixed');
}

// Fix chat detail back button specifically (it has Vissza inline)
const chatBackOld = `<button class="settings-back-btn" onclick="document.getElementById('chat-detail-overlay').classList.remove('open')" style="color: var(--color-text-dark);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Vissza
                        </button>`;
const chatBackNew = `<button class="settings-back-btn" onclick="document.getElementById('chat-detail-overlay').classList.remove('open')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0F2E" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>`;
if (h.includes(chatBackOld)) {
    h = h.replace(chatBackOld, chatBackNew);
    console.log('✅ Chat back button fixed');
}

// ================================================================
// FIX 2: ÁR MEZŐ — közvetlenül írható input (nem kell klikkelni)
// ================================================================
// Replace the hidden price display trick with a real visible input
const oldPriceSection = `                        <!-- Card 5: Díjazás -->
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
                        </div>`;

const newPriceSection = `                        <!-- Card 5: Díjazás -->
                        <div class="emp-form-section" style="position:relative;">
                            <div class="emp-section-label">Díjazás</div>
                            <div style="display:flex; align-items:center; justify-content:center; gap:8px; padding:12px 0 4px;">
                                <input 
                                    type="number" 
                                    id="emp-price-input" 
                                    value="12000"
                                    oninput="updateEmpPriceDisplay(this.value)"
                                    style="
                                        width: 160px;
                                        font-size: 40px;
                                        font-weight: 800;
                                        color: #0A0F2E;
                                        font-family: 'Poppins', sans-serif;
                                        letter-spacing: -1px;
                                        border: none;
                                        outline: none;
                                        text-align: right;
                                        background: transparent;
                                        -moz-appearance: textfield;
                                    "
                                >
                                <span style="font-size:22px; font-weight:600; color:#9CA3AF; margin-top:4px;">Ft</span>
                            </div>
                            <style>#emp-price-input::-webkit-outer-spin-button,#emp-price-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}</style>
                            <div class="emp-recommended-price" id="emp-recommended-label">Ajánlott piaci ár: 12 000 Ft</div>
                            <div style="display:flex; justify-content:center; gap: 8px; margin-top:12px;">
                                <button onclick="adjustEmpPrice(-1000)" style="background:#F3F4F6; border:none; padding:6px 14px; border-radius:8px; font-size:13px; cursor:pointer; font-weight:500; color:#374151;">−1 000</button>
                                <button onclick="adjustEmpPrice(1000)" style="background:#F3F4F6; border:none; padding:6px 14px; border-radius:8px; font-size:13px; cursor:pointer; font-weight:500; color:#374151;">+1 000</button>
                                <button onclick="adjustEmpPrice(5000)" style="background:#F3F4F6; border:none; padding:6px 14px; border-radius:8px; font-size:13px; cursor:pointer; font-weight:500; color:#374151;">+5 000</button>
                            </div>
                        </div>`;

if (h.includes(oldPriceSection)) {
    h = h.replace(oldPriceSection, newPriceSection);
    console.log('✅ Price input redesigned - directly typable');
} else {
    console.log('⚠️ Price section not found exactly');
}

// ================================================================
// FIX 3: PONTOS MUNKA — látható legördülő select
// ================================================================
const oldJobPickerSection = `                        <!-- Card 2: Pontos munka -->
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
                        </div>`;

const newJobPickerSection = `                        <!-- Card 2: Pontos munka -->
                        <div class="emp-form-section">
                            <div class="emp-section-label">Pontos munka</div>
                            <div style="position:relative;">
                                <select 
                                    id="emp-job-select" 
                                    onchange="onEmpJobSelectChange(this.value)"
                                    style="
                                        width: 100%;
                                        appearance: none;
                                        -webkit-appearance: none;
                                        background: #F8F9FB;
                                        border: 1.5px solid #E5E7EB;
                                        border-radius: 12px;
                                        padding: 14px 40px 14px 14px;
                                        font-size: 14px;
                                        font-weight: 500;
                                        color: #1F2937;
                                        outline: none;
                                        cursor: pointer;
                                        font-family: 'Inter', sans-serif;
                                    "
                                >
                                    <!-- Populated by JS -->
                                </select>
                                <svg style="position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                            <div class="emp-field-error" id="err-job">Kérlek válassz munkát!</div>
                            <!-- Label for compatibility -->
                            <span id="emp-job-picker-label" style="display:none;"></span>
                        </div>`;

if (h.includes(oldJobPickerSection)) {
    h = h.replace(oldJobPickerSection, newJobPickerSection);
    console.log('✅ Job picker replaced with visible dropdown select');
} else {
    console.log('⚠️ Job picker section not found exactly');
}

// Add the onEmpJobSelectChange function to JS
const jsInsertPoint = 'function updateEmpPriceFromJob(jobName) {';
const newJSFn = `function onEmpJobSelectChange(val) {
            // Update the label span for compatibility
            const lbl = document.getElementById('emp-job-picker-label');
            if (lbl) lbl.textContent = val;
            // Update price
            updatePredefinedJobPrice(val);
            updateEmpPriceFromJob(val);
        }

        `;
if (h.includes(jsInsertPoint) && !h.includes('function onEmpJobSelectChange')) {
    h = h.replace(jsInsertPoint, newJSFn + jsInsertPoint);
    console.log('✅ onEmpJobSelectChange JS function added');
}

// Also fix the settings-header layout to properly center the title with icon-only back btn
const settingsHeaderCSS = h.match(/\.settings-header \{[^}]+\}/)?.[0];
if (settingsHeaderCSS) {
    const newHeaderCSS = `.settings-header {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            background-color: #fff;
            border-bottom: 1px solid var(--color-border);
            position: relative;
            gap: 12px;
            flex-shrink: 0;
        }`;
    h = h.replace(settingsHeaderCSS, newHeaderCSS);
    console.log('✅ settings-header CSS updated for icon-only back button');
}

// And settings-title to be centered absolutely
const settingsTitleCSS = h.match(/\.settings-title \{[^}]+\}/)?.[0];
if (settingsTitleCSS) {
    const newTitleCSS = `.settings-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 16px;
            font-weight: 700;
            color: var(--color-navy);
            pointer-events: none;
        }`;
    h = h.replace(settingsTitleCSS, newTitleCSS);
    console.log('✅ settings-title CSS: absolutely centered');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('\n🎉 All 3 fixes applied!');
console.log('File size:', Math.round(h.length / 1024), 'KB');
