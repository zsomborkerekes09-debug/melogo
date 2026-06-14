const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

const oldOpenOverlayRegex = /document\.getElementById\('emp-address-input'\)\.value = '';/g;
const newOpenOverlayCode = `
            if (document.getElementById('emp-zip')) document.getElementById('emp-zip').value = '';
            if (document.getElementById('emp-county')) document.getElementById('emp-county').value = '';
            if (document.getElementById('emp-city')) document.getElementById('emp-city').value = '';
            if (document.getElementById('emp-street')) document.getElementById('emp-street').value = '';
            if (document.getElementById('emp-house')) document.getElementById('emp-house').value = '';
            if (document.getElementById('emp-apartment')) document.getElementById('emp-apartment').value = '';
            
            const errLocStructured = document.getElementById('err-loc-structured');
            if (errLocStructured) errLocStructured.classList.remove('show');
`;

if (html.match(oldOpenOverlayRegex)) {
    html = html.replace(oldOpenOverlayRegex, newOpenOverlayCode);
    console.log('Replaced openEmployerFormOverlay correctly.');
} else {
    console.log('Could not find openEmployerFormOverlay address reset.');
}

fs.writeFileSync('frontend/index.html', html);
