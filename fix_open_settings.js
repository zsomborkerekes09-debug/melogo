const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

const oldOpenSettingsTarget = `            const addrContainer = document.getElementById('settings-address-container');
            const addrField = document.getElementById('settings-address');
            if (activeRole === 'employer') {
                if (addrContainer) addrContainer.style.display = 'block';
                if (addrField) {
                    addrField.value = userData.address || '';
                    settingsConfirmedAddress = userData.address || '';
                }
            } else {
                if (addrContainer) addrContainer.style.display = 'none';
            }`;

const newOpenSettingsCode = `            const addrContainer = document.getElementById('settings-address-container');
            if (activeRole === 'employer') {
                if (addrContainer) addrContainer.style.display = 'block';
                if (userData.address) {
                    settingsConfirmedAddress = userData.address;
                    const parts = userData.address.split(',');
                    if (parts.length >= 2) {
                        const zipCity = parts[0].trim().split(' ');
                        if (document.getElementById('set-zip')) document.getElementById('set-zip').value = zipCity[0] || '';
                        if (document.getElementById('set-city')) document.getElementById('set-city').value = zipCity.slice(1).join(' ') || '';
                        
                        const streetHouseApt = parts[1].trim().split(' ');
                        const houseApt = streetHouseApt.pop();
                        if (document.getElementById('set-street')) document.getElementById('set-street').value = streetHouseApt.join(' ') || '';
                        if (document.getElementById('set-house')) document.getElementById('set-house').value = houseApt || '';
                    } else {
                        if (document.getElementById('set-city')) document.getElementById('set-city').value = userData.address;
                    }
                }
            } else {
                if (addrContainer) addrContainer.style.display = 'none';
            }`;

if (html.includes(oldOpenSettingsTarget)) {
    html = html.replace(oldOpenSettingsTarget, newOpenSettingsCode);
    console.log('Replaced openSettings successfully.');
} else {
    console.log('Failed to replace openSettings.');
}

fs.writeFileSync('frontend/index.html', html);
