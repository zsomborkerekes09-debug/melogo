const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. CSS variables fix for full-screen-right and settings-overlay
html = html.replace(/\.settings-overlay\s*\{[\s\S]*?background-color:\s*#FFFFFF;/g, match => match.replace('#FFFFFF', 'var(--color-bg)'));
html = html.replace(/\.full-screen-right\s*\{[\s\S]*?background-color:\s*#FFFFFF;/g, match => match.replace('#FFFFFF', 'var(--color-bg)'));
html = html.replace(/\.emp-form-body\s*\{[\s\S]*?background:\s*rgba\(128,128,128,0\.2\);/g, match => match.replace('rgba(128,128,128,0.2)', 'var(--color-bg)'));
html = html.replace(/\.emp-cat-card\s*\{[\s\S]*?background:\s*rgba\(128,128,128,0\.2\);/g, match => match.replace('rgba(128,128,128,0.2)', 'var(--color-surface)'));

// 2. Replace Employer Form Address Section
const employerOldAddressHTMLRegex = /<!-- Card 4: Helyszín -->[\s\S]*?<!-- Card 5: Díjazás -->/;
const employerNewAddressHTML = `<!-- Card 4: Helyszín -->
                        <div class="emp-form-section">
                            <div class="emp-section-label">Helyszín</div>
                            <!-- Redesigned Structured Address Form -->
                            <div id="emp-loc-structured-state" style="display:flex; flex-direction:column; gap:12px; margin-top: 12px;">
                                <div class="emp-input-row" style="padding:0; border:none; background:transparent;">
                                    <input class="emp-input" id="emp-country" placeholder="Ország" value="Magyarország" style="flex:1; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                </div>
                                <div style="display:flex; gap:12px;">
                                    <div class="emp-input-row" style="padding:0; flex:1; border:none; background:transparent;">
                                        <input class="emp-input" id="emp-zip" placeholder="Irányítószám" style="width:100%; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                    </div>
                                    <div class="emp-input-row" style="padding:0; flex:2; border:none; background:transparent;">
                                        <input class="emp-input" id="emp-county" placeholder="Megye" style="width:100%; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                    </div>
                                </div>
                                <div class="emp-input-row" style="padding:0; border:none; background:transparent;">
                                    <input class="emp-input" id="emp-city" placeholder="Település / Város" style="flex:1; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                </div>
                                <div style="display:flex; gap:12px;">
                                    <div class="emp-input-row" style="padding:0; flex:2; border:none; background:transparent;">
                                        <input class="emp-input" id="emp-street" placeholder="Utca neve" style="width:100%; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                    </div>
                                    <div class="emp-input-row" style="padding:0; flex:1; border:none; background:transparent;">
                                        <input class="emp-input" id="emp-house" placeholder="Házszám" style="width:100%; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                    </div>
                                </div>
                                <div class="emp-input-row" style="padding:0; border:none; background:transparent;">
                                    <input class="emp-input" id="emp-apartment" placeholder="Emelet, ajtó (opcionális)" style="flex:1; border:1px solid var(--color-border); border-radius:12px; padding:12px; background:var(--color-surface); color:var(--color-text);">
                                </div>
                                <div class="emp-field-error" id="err-loc-structured">Minden kötelező mezőt (Irányítószám, Megye, Város, Utca, Házszám) ki kell tölteni!</div>
                            </div>
                        </div>

                        <!-- Card 5: Díjazás -->`;
if (html.match(employerOldAddressHTMLRegex)) {
    html = html.replace(employerOldAddressHTMLRegex, employerNewAddressHTML);
    console.log('Successfully replaced employer form address HTML');
} else {
    console.log('Error: Could not find employer old address HTML regex.');
}

// 3. Update employerPublishJobNew Validation
const oldPublishValidCheckRegex = /if \(\!confirmedAddress\) \{[\s\S]*?if \(\!valid\) \{/;
const newPublishValidCheck = `        const zipVal = (document.getElementById('emp-zip') ? document.getElementById('emp-zip').value.trim() : '');
        const countyVal = (document.getElementById('emp-county') ? document.getElementById('emp-county').value.trim() : '');
        const cityVal = (document.getElementById('emp-city') ? document.getElementById('emp-city').value.trim() : '');
        const streetVal = (document.getElementById('emp-street') ? document.getElementById('emp-street').value.trim() : '');
        const houseVal = (document.getElementById('emp-house') ? document.getElementById('emp-house').value.trim() : '');
        const aptVal = document.getElementById('emp-apartment') ? document.getElementById('emp-apartment').value.trim() : '';
        
        if (!zipVal || !countyVal || !cityVal || !streetVal || !houseVal) {
            valid = false;
            const err = document.getElementById('err-loc-structured');
            if (err) { err.innerText = 'Kérjük tölts ki minden kötelező címadatot!'; err.classList.add('show'); }
            ['emp-zip', 'emp-county', 'emp-city', 'emp-street', 'emp-house'].forEach(id => {
                const el = document.getElementById(id);
                if(el && !el.value.trim()) {
                    el.style.border = '1px solid #EF4444';
                    setTimeout(() => el.style.border = '1px solid var(--color-border)', 2500);
                }
            });
        }

        let generatedAddress = \`\${zipVal} \${cityVal}, \${streetVal} \${houseVal}.\`;
        if (aptVal) generatedAddress += \` \${aptVal}\`;
        let finalConfirmedAddress = generatedAddress;
        window.confirmedAddress = finalConfirmedAddress;

        if (!valid) {`;

if (html.match(oldPublishValidCheckRegex)) {
    html = html.replace(oldPublishValidCheckRegex, newPublishValidCheck);
    console.log('Successfully replaced publish validation');
} else {
    console.log('Error: Could not find publish validation regex.');
}

fs.writeFileSync('frontend/index.html', html);
console.log('Refactoring complete.');
