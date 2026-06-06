const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add mock MOCK_ADDRESSES and selectAddress functions to the main JS block
const jsCode = `
        const MOCK_ADDRESSES = [
            "Fő utca 14., Kaposvár",
            "Ady Endre utca 21., Kaposvár",
            "Zárda utca 5., Kaposvár",
            "Kossuth Lajos tér 1., Kaposvár",
            "Berzsenyi Dániel utca 10., Kaposvár"
        ];
        let confirmedAddress = null;

        function handleAddressInput(val) {
            const suggList = document.getElementById('emp-address-suggestions');
            if (!val || val.trim().length < 2) {
                suggList.style.display = 'none';
                return;
            }
            const term = val.trim().toLowerCase();
            const matches = MOCK_ADDRESSES.filter(a => a.toLowerCase().includes(term));
            if (matches.length === 0) {
                suggList.style.display = 'none';
                return;
            }
            suggList.innerHTML = matches.map(m => \`
                <div style="padding:12px 16px; border-bottom:1px solid #F1F1F1; font-size:14px; color:#0A0F2E; cursor:pointer; display:flex; align-items:center; gap:8px;" onclick="selectAddress('\${m}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    \${m.replace(new RegExp(term, 'gi'), match => \`<b>\${match}</b>\`)}
                </div>
            \`).join('');
            suggList.style.display = 'block';
        }

        function selectAddress(address) {
            confirmedAddress = address;
            document.getElementById('emp-loc-search-state').style.display = 'none';
            document.getElementById('emp-loc-locked-state').style.display = 'flex';
            document.getElementById('emp-confirmed-address').innerText = address;
            document.getElementById('emp-city').value = address.split(',')[1]?.trim() || 'Kaposvár';
            document.getElementById('emp-street').value = address.split(',')[0]?.trim() || address;
            const err = document.getElementById('err-loc');
            if (err) err.classList.remove('show');
        }

        function resetAddressSearch() {
            confirmedAddress = null;
            document.getElementById('emp-loc-locked-state').style.display = 'none';
            document.getElementById('emp-loc-search-state').style.display = 'block';
            document.getElementById('emp-address-input').value = '';
            document.getElementById('emp-address-suggestions').style.display = 'none';
            document.getElementById('emp-city').value = '';
            document.getElementById('emp-street').value = '';
        }
`;
if (!html.includes('MOCK_ADDRESSES')) {
    html = html.replace('function autoFillGPS() {', jsCode + '\n        function autoFillGPS() {');
}

// 2. Update autoFillGPS
html = html.replace(/document\.getElementById\('emp-city'\)\.value = 'Kaposvár';/g, "selectAddress('Fő utca 14., Kaposvár');");
html = html.replace(/document\.getElementById\('emp-street'\)\.value = 'Fő utca 14\.';/g, "");

// 3. Update employerPublishJobNew validation
const oldValidation = `            if (!street || !street.value.trim()) {
                valid = false;
                const err = document.getElementById('err-loc');
                if (err) err.classList.add('show');
                if (street) { street.style.borderBottom = '2px solid #EF4444'; setTimeout(() => street.style.borderBottom = '', 2000); }
            }`;
const newValidation = `            if (!confirmedAddress) {
                valid = false;
                const err = document.getElementById('err-loc');
                if (err) { err.innerText = 'Kérjük válassz egy valós címet a listából.'; err.classList.add('show'); }
                const inp = document.getElementById('emp-address-input');
                if (inp) { inp.style.borderBottom = '2px solid #EF4444'; setTimeout(() => inp.style.borderBottom = '', 2000); }
            }`;
html = html.replace(oldValidation, newValidation);

// 4. Replace Helyszín card HTML
const oldHelyszin = `                            <div class="emp-input-row">
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
                            <div class="emp-field-error" id="err-loc">Add meg a helyszínt!</div>`;

const newHelyszin = `                            <!-- Search Input State -->
                            <div id="emp-loc-search-state" style="position:relative; margin-top: 12px;">
                                <div class="emp-input-row">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    <input class="emp-input" id="emp-address-input" placeholder="Keress egy címet..." autocomplete="off" oninput="handleAddressInput(this.value)">
                                </div>
                                <div id="emp-address-suggestions" style="display:none; position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid #F1F1F1; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); z-index:50; margin-top:4px; max-height:200px; overflow-y:auto;">
                                </div>
                                <div class="emp-field-error" id="err-loc">Kérjük válassz egy valós címet a listából.</div>
                            </div>

                            <!-- Locked State -->
                            <div id="emp-loc-locked-state" style="display:none; flex-direction:column; gap:12px; margin-top: 12px;">
                                <div style="display:flex; align-items:center; justify-content:space-between; background:#F8F9FB; padding:12px 16px; border-radius:12px; border:1px solid #E5E7EB;">
                                    <div style="display:flex; align-items:center; gap:12px; flex:1;">
                                        <div style="width:32px; height:32px; background:#22C55E; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <div style="font-size:14px; font-weight:600; color:#0A0F2E; line-height:1.4;" id="emp-confirmed-address"></div>
                                    </div>
                                    <button type="button" onclick="resetAddressSearch()" style="background:none; border:none; color:#9CA3AF; padding:8px; cursor:pointer;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <div style="width:100%; height:120px; border-radius:12px; background-color:#E5E7EB; background-image:url('https://maps.googleapis.com/maps/api/staticmap?center=Kaposv%C3%A1r,Hungary&zoom=14&size=400x120&maptype=roadmap&markers=color:red%7CKaposv%C3%A1r,Hungary&key=YOUR_API_KEY'); background-size:cover; background-position:center; position:relative;">
                                </div>
                            </div>
                            
                            <!-- Hidden inputs for legacy JS compatibility -->
                            <input type="hidden" id="emp-city" value="">
                            <input type="hidden" id="emp-street" value="">
                            <input type="hidden" id="emp-county" value="Somogy">
                            <input type="hidden" id="emp-house" value="">`;
html = html.replace(oldHelyszin, newHelyszin);

// 5. Replace Submit Button Position
// Remove from scroll area:
const oldSubmitBlock = `                    <!-- Fixed Submit Button -->
                    <div class="emp-submit-fixed">
                        <button class="emp-submit-btn" onclick="employerPublishJobNew()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            Hirdetés közzététele
                        </button>
                    </div>`;
html = html.replace(oldSubmitBlock, "");

// Make sure emp-form-body has padding to not be hidden by the bottom strip
html = html.replace('class="emp-form-body" id="emp-form-body"', 'class="emp-form-body" id="emp-form-body" style="padding-bottom: 96px;"');

// Add the new absolute button strip at the end of employer-form-overlay
const newSubmitBlock = `
                    <!-- Fixed Submit Button Strip -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: #fff; border-top: 1px solid #F1F1F1; z-index: 100; padding: 0 20px; display: flex; align-items: center; padding-bottom: 16px;">
                        <button class="emp-submit-btn" style="height: 52px; border-radius: 14px; background: #0A0F2E; color: #fff; width: 100%; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-size: 16px; cursor:pointer;" onclick="employerPublishJobNew()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            Hirdetés közzététele
                        </button>
                    </div>`;

// Find where to inject it. It should be right before the Success Animation Overlay, or right before the closing div of employer-form-overlay
html = html.replace('<!-- Success Animation Overlay -->', newSubmitBlock + '\n\n                    <!-- Success Animation Overlay -->');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Places UX applied');
