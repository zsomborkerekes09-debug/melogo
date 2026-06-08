const fs = require('fs');
let c = fs.readFileSync('frontend/index.html', 'utf8');

// 1. modify openEmployerFormOverlay
const search1 = `        function openEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.add('open');
            selectEmployerFormCat('Kert'); // load default options
        }`;
const search1CrLf = search1.replace(/\n/g, '\r\n');
const replace1 = `        function openEmployerFormOverlay() {
            document.getElementById('employer-form-overlay').classList.add('open');
            selectEmployerFormCat('Kert'); // load default options
            if (currentUser && currentUser.role === 'employer' && currentUser.address) {
                selectAddress(currentUser.address);
            }
        }`;
const replace1CrLf = replace1.replace(/\n/g, '\r\n');

c = c.replace(search1, replace1).replace(search1CrLf, replace1CrLf);

// 2. modify selectAddress
const search2 = `        function selectAddress(address, lat = null, lon = null) {
            confirmedAddress = address;
            confirmedLat = lat;
            confirmedLon = lon;
            document.getElementById('emp-loc-search-state').style.display = 'none';
            document.getElementById('emp-loc-locked-state').style.display = 'flex';
            document.getElementById('emp-confirmed-address').innerText = address;
            document.getElementById('emp-city').value = address.split(',')[1]?.trim() || 'Kaposvár';
            document.getElementById('emp-street').value = address.split(',')[0]?.trim() || address;
            const err = document.getElementById('err-loc');
            if (err) err.classList.remove('show');
        }`;
const search2CrLf = search2.replace(/\n/g, '\r\n');
const replace2 = `        function selectAddress(address, lat = null, lon = null) {
            confirmedAddress = address;
            confirmedLat = lat;
            confirmedLon = lon;
            document.getElementById('emp-loc-search-state').style.display = 'none';
            document.getElementById('emp-loc-locked-state').style.display = 'flex';
            document.getElementById('emp-confirmed-address').innerText = address;
            document.getElementById('emp-city').value = address.split(',')[1]?.trim() || 'Kaposvár';
            document.getElementById('emp-street').value = address.split(',')[0]?.trim() || address;
            const err = document.getElementById('err-loc');
            if (err) err.classList.remove('show');

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
                })
                .catch(e => console.error("Geocoding error", e));
            }
        }`;
const replace2CrLf = replace2.replace(/\n/g, '\r\n');

c = c.replace(search2, replace2).replace(search2CrLf, replace2CrLf);

fs.writeFileSync('frontend/index.html', c);
