const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

const oldSelectAddressRegex = /function selectAddress\(address, lat = null, lon = null\) \{[\s\S]*?\.catch\(e => console\.error\("Geocoding error", e\)\);/g;
const newSelectAddressCode = `function selectAddress(address, lat = null, lon = null) {
            confirmedAddress = address;
            confirmedLat = lat;
            confirmedLon = lon;
            
            const err = document.getElementById('err-loc-structured');
            if (err) err.classList.remove('show');

            if (address) {
                const parts = address.split(',');
                if (parts.length >= 2) {
                    const zipCity = parts[0].trim().split(' ');
                    if (document.getElementById('emp-zip')) document.getElementById('emp-zip').value = zipCity[0] || '';
                    if (document.getElementById('emp-city')) document.getElementById('emp-city').value = zipCity.slice(1).join(' ') || '';
                    
                    const streetHouseApt = parts[1].trim().split(' ');
                    const houseApt = streetHouseApt.pop();
                    if (document.getElementById('emp-street')) document.getElementById('emp-street').value = streetHouseApt.join(' ') || '';
                    if (document.getElementById('emp-house')) document.getElementById('emp-house').value = houseApt || '';
                } else {
                    if (document.getElementById('emp-city')) document.getElementById('emp-city').value = address;
                }
            }

            if (!lat || !lon) {
                fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(address)}&format=json&limit=1\`, {
                    headers: { 'Accept-Language': 'hu' }
                })
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        confirmedLat = parseFloat(data[0].lat);
                        confirmedLon = parseFloat(data[0].lon);
                    }
                }).catch(e => console.error("Geocoding error", e));`;

if (html.match(oldSelectAddressRegex)) {
    html = html.replace(oldSelectAddressRegex, newSelectAddressCode);
    console.log('Replaced selectAddress successfully.');
} else {
    console.log('Failed to replace selectAddress.');
}

fs.writeFileSync('frontend/index.html', html);
