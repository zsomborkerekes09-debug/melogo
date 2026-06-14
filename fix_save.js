const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// Replace settings address validation in saveSettings
const oldSaveSettingsTarget = `if (activeRole === 'employer') {
                if (!settingsConfirmedAddress || settingsConfirmedAddress.length < 2) {
                    alert("Megbízóként kötelező megadni a pontos címed!");
                    return;
                }
                userData.address = settingsConfirmedAddress;
                firestoreUpdateData.address = settingsConfirmedAddress;
            }`;

const newSaveSettingsCode = `if (activeRole === 'employer') {
                const zip = (document.getElementById('set-zip') || {}).value?.trim() || '';
                const county = (document.getElementById('set-county') || {}).value?.trim() || '';
                const city = (document.getElementById('set-city') || {}).value?.trim() || '';
                const street = (document.getElementById('set-street') || {}).value?.trim() || '';
                const house = (document.getElementById('set-house') || {}).value?.trim() || '';
                const apt = (document.getElementById('set-apartment') || {}).value?.trim() || '';
                
                if (!zip || !county || !city || !street || !house) {
                    const err = document.getElementById('err-set-structured');
                    if (err) err.classList.add('show');
                    return;
                }
                const err = document.getElementById('err-set-structured');
                if (err) err.classList.remove('show');
                
                let generatedAddress = \`\${zip} \${city}, \${street} \${house}.\`;
                if (apt) generatedAddress += \` \${apt}\`;
                
                settingsConfirmedAddress = generatedAddress;
                userData.address = generatedAddress;
                firestoreUpdateData.address = generatedAddress;
            }`;

if (html.includes(oldSaveSettingsTarget)) {
    html = html.replace(oldSaveSettingsTarget, newSaveSettingsCode);
    console.log('Replaced saveSettings successfully.');
} else {
    console.log('Failed to replace saveSettings.');
}

fs.writeFileSync('frontend/index.html', html);
