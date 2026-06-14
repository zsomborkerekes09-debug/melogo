const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Replace remaining rgba(128,128,128,0.2) globally to var(--color-surface)
html = html.replace(/background:\s*rgba\(128,128,128,0\.2\)/g, 'background: var(--color-surface)');
// Also border-bottom: 0.5px solid #FFFFFF; to var(--color-border)
html = html.replace(/border-bottom:\s*0\.5px\s*solid\s*#FFFFFF/g, 'border-bottom: 0.5px solid var(--color-border)');

// 2. Replace Settings Address Container
const settingsOldAddressHTMLRegex = /<!-- Address \(Employer only\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const settingsNewAddressHTML = `<!-- Address (Employer only) -->
                                <div id="settings-address-container" style="display:none; border-bottom: 0.5px solid var(--color-border); padding: 0 16px 12px 16px;">
                                    <div style="display:flex;align-items:center;gap:12px;padding:12px 0 4px 0;">
                                        <div class="settings-row-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        </div>
                                        <span class="settings-row-label">Cím adatok (Munkáltatóknak)</span>
                                    </div>
                                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
                                        <input type="text" id="set-country" placeholder="Ország" value="Magyarország" style="width: 100%; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                        <div style="display:flex; gap:8px;">
                                            <input type="text" id="set-zip" placeholder="Irányítószám" style="flex: 1; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                            <input type="text" id="set-county" placeholder="Megye" style="flex: 2; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                        </div>
                                        <input type="text" id="set-city" placeholder="Város" style="width: 100%; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                        <div style="display:flex; gap:8px;">
                                            <input type="text" id="set-street" placeholder="Utca" style="flex: 2; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                            <input type="text" id="set-house" placeholder="Házszám" style="flex: 1; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                        </div>
                                        <input type="text" id="set-apartment" placeholder="Emelet, ajtó (opcionális)" style="width: 100%; border: 1px solid var(--color-border); background: var(--color-surface); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text); box-sizing: border-box;">
                                    </div>
                                    <div class="emp-field-error" id="err-set-structured" style="margin-top:8px;">Minden kötelező mezőt tölts ki!</div>
                                </div>
                            </div>
                        </div>`;

if (html.match(settingsOldAddressHTMLRegex)) {
    html = html.replace(settingsOldAddressHTMLRegex, settingsNewAddressHTML);
    console.log('Successfully replaced Settings Address HTML');
} else {
    console.log('Error: Could not find Settings Address HTML regex.');
}

// 3. Update saveSettings() Validation
const oldSaveSettingsRegex = /function saveSettings\(\) \{[\s\S]*?if \(!addressVal\) \{[\s\S]*?window.confirmedAddress = addressVal;\s*\}/;
const newSaveSettingsCode = `function saveSettings() {
            const nameVal = document.getElementById('settings-name').value.trim();
            const bioVal = document.getElementById('settings-bio').value.trim();
            
            // Structured Address Collection
            const zip = (document.getElementById('set-zip') || {}).value?.trim() || '';
            const county = (document.getElementById('set-county') || {}).value?.trim() || '';
            const city = (document.getElementById('set-city') || {}).value?.trim() || '';
            const street = (document.getElementById('set-street') || {}).value?.trim() || '';
            const house = (document.getElementById('set-house') || {}).value?.trim() || '';
            const apt = (document.getElementById('set-apartment') || {}).value?.trim() || '';

            const isEmployer = (gameState.role === 'employer');

            if (isEmployer) {
                if (!zip || !county || !city || !street || !house) {
                    const err = document.getElementById('err-set-structured');
                    if (err) err.classList.add('show');
                    return;
                }
                const err = document.getElementById('err-set-structured');
                if (err) err.classList.remove('show');
                
                let generatedAddress = \`\${zip} \${city}, \${street} \${house}.\`;
                if (apt) generatedAddress += \` \${apt}\`;
                window.confirmedAddress = generatedAddress;
            }`;

if (html.match(oldSaveSettingsRegex)) {
    html = html.replace(oldSaveSettingsRegex, newSaveSettingsCode);
    console.log('Successfully replaced saveSettings validation');
} else {
    console.log('Error: Could not find saveSettings logic.');
}

// 4. Update load profile function logic to pre-fill from confirmedAddress
const oldOpenSettingsRegex = /function openSettings\(\) \{[\s\S]*?document.getElementById\('settings-address'\).value = window.confirmedAddress \|\| '';/;
const newOpenSettingsCode = `function openSettings() {
            // Fill general info
            document.getElementById('settings-name').value = document.getElementById('profile-name-display').innerText || '';
            document.getElementById('settings-bio').value = document.getElementById('profile-bio-display').innerText || '';
            
            // Split structured address if available
            if (window.confirmedAddress) {
                const parts = window.confirmedAddress.split(',');
                if (parts.length >= 2) {
                    const zipCity = parts[0].trim().split(' ');
                    document.getElementById('set-zip').value = zipCity[0] || '';
                    document.getElementById('set-city').value = zipCity.slice(1).join(' ') || '';
                    
                    const streetHouseApt = parts[1].trim().split(' ');
                    const houseApt = streetHouseApt.pop();
                    document.getElementById('set-street').value = streetHouseApt.join(' ') || '';
                    document.getElementById('set-house').value = houseApt || '';
                }
            }`;

if (html.match(oldOpenSettingsRegex)) {
    html = html.replace(oldOpenSettingsRegex, newOpenSettingsCode);
    console.log('Successfully replaced openSettings logic');
} else {
    console.log('Error: Could not find openSettings logic.');
}

fs.writeFileSync('frontend/index.html', html);
console.log('Settings refactoring complete.');
