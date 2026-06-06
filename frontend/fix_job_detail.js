const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 4.1 Add back arrow to left side of header in `action-overlay-header`
h = h.replace(/(<div class="action-overlay-header[^>]*>)\s*(<div class="action-overlay-title">)/g, 
    '$1\n        <button class="settings-back-btn" onclick="closeJobDetail()" style="position:absolute; left:16px; background:none; color:white;">\n            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>\n        </button>\n        $2');

// Make sure the title is centered by updating the header CSS
if (!h.includes('justify-content: center')) {
    h = h.replace(/\.action-overlay-header\s*\{\s*background:\s*var\(--color-navy\);\s*color:\s*#fff;\s*padding:\s*16px;\s*display:\s*flex;\s*justify-content:\s*space-between;\s*align-items:\s*center;\s*\}/g, 
        '.action-overlay-header {\n            background: var(--color-navy);\n            color: #fff;\n            padding: 16px;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            position: relative;\n        }');
}
// The close button "Bezár" is already on the right (if it exists). 
// Wait, the original header was `justify-content: space-between`. 
// If I change it to `center`, the right button needs `position: absolute; right: 16px;`.
h = h.replace(/<button style="background: none; border: none; color: white; font-size: 14px; cursor: pointer;" onclick="closeJobDetail\(\)">Bezár<\/button>/g, 
    '<button style="position: absolute; right: 16px; background: none; border: none; color: white; font-size: 14px; font-weight: 500; cursor: pointer;" onclick="closeJobDetail()">Bezár</button>');

// 4.2 Increase description line-height
h = h.replace(/\.job-detail-desc\s*\{([\s\S]*?)\}/g, (m, inner) => {
    return `.job-detail-desc {${inner}}`.replace(/line-height:[^;]+;/, 'line-height: 1.6;');
});
if (!h.includes('line-height: 1.6;')) { // Fallback if no existing line-height
    h = h.replace(/\.job-detail-desc\s*\{/g, '.job-detail-desc { line-height: 1.6; ');
}

// 4.3 Generali banner colors and text size
h = h.replace(/<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">.*?<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"><\/path><\/svg>/g, 
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>');
h = h.replace(/<div style="font-size: 12px; color: #6B7280; line-height: 1.4;">Felelősségbiztosítás fedezi az esetleges károkat a munka során.<\/div>/g, 
    '<div style="font-size: 11px; color: #6B7280; line-height: 1.4;">Felelősségbiztosítás fedezi az esetleges károkat a munka során.</div>');

// 4.4 Employer Mini-Card & 4.5 Map Thumbnail
// We need to inject these into the `openJobDetail` JS function since the content is dynamic.
const mapThumbnailHTML = `
            <!-- Map Thumbnail -->
            <div style="margin-top: 16px; border-radius: 12px; overflow: hidden; height: 160px; background: #E5E7EB; position: relative;">
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=\${encodeURIComponent(job.location)}&zoom=14&size=400x160&scale=2&maptype=roadmap&markers=color:green%7C\${encodeURIComponent(job.location)}&key=YOUR_API_KEY" alt="Térkép" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23E5E7EB\\'/><text x=\\'50%\\' y=\\'50%\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%239CA3AF\\' text-anchor=\\'middle\\' dy=\\'.3em\\'>Térkép betöltése...</text></svg>'">
            </div>
`;
const employerCardHTML = `
            <!-- Employer Mini-Card -->
            <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; border: 1px solid #F1F1F1; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--color-navy); font-size: 14px;">
                        \${job.employer.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 14px; color: var(--color-navy);">\${job.employer}</div>
                        <div style="font-size: 12px; color: #6B7280; display: flex; align-items: center; gap: 4px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 5.0
                        </div>
                    </div>
                </div>
                <div style="font-size: 12px; font-weight: 600; color: var(--color-navy);">Profil megtekintése</div>
            </div>
`;

// Insert the Employer Mini-Card just before `<div class="job-detail-card">`
h = h.replace(/(<div class="job-detail-card">)/, employerCardHTML + '\n            $1');

// Insert Map Thumbnail after `<div class="job-detail-desc">${job.desc}</div>`
h = h.replace(/(<div class="job-detail-desc">\$\{job\.desc\}<\/div>)/, '$1\n' + mapThumbnailHTML);

// 4.6 Loading spinner on Apply Button & 4.7 Stripe trust note
const applyBtnHTML = `
            <div style="margin-top: 24px; padding-bottom: 40px;">
                <button id="apply-btn" style="width: 100%; background: var(--color-green); color: white; border: none; padding: 16px; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;" onclick="submitApplication(this)">
                    <span id="apply-text">Jelentkezem a munkára</span>
                    <svg id="apply-spinner" class="ptr-spinner" style="display: none; margin-left: 8px;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M16 12a4 4 0 0 0-8 0"></path></svg>
                </button>
                <div style="text-align: center; font-size: 11px; color: #9CA3AF; margin-top: 12px;">A munkadíj a munka elvégzése után kerül kifizetésre a Stripe rendszerén keresztül.</div>
            </div>
`;
// Replace the old button in JS `openJobDetail`
h = h.replace(/<div style="margin-top: 24px; text-align: center;">\s*<button style="[^>]*>Jelentkezem a munkára<\/button>\s*<\/div>/g, applyBtnHTML);
h = h.replace(/<button style="width: 100%; background-color: var\(--color-green\); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;" onclick="document\.getElementById\('job-detail-overlay'\)\.classList\.remove\('open'\); showToast\('Jelentkezés elküldve!'\);">Jelentkezem a munkára<\/button>/g, applyBtnHTML);

// 4.6 JS Function for the apply button animation
const applyJS = `
        function submitApplication(btn) {
            if (btn.disabled) return;
            btn.disabled = true;
            btn.style.opacity = '0.7';
            document.getElementById('apply-text').textContent = 'Feldolgozás...';
            document.getElementById('apply-spinner').style.display = 'block';
            
            setTimeout(() => {
                closeJobDetail();
                showToast('Jelentkezés elküldve!');
                // Reset button for next time
                btn.disabled = false;
                btn.style.opacity = '1';
                document.getElementById('apply-text').textContent = 'Jelentkezem a munkára';
                document.getElementById('apply-spinner').style.display = 'none';
            }, 1500);
        }
`;
if (!h.includes('function submitApplication')) {
    h = h.replace('function openJobDetail', applyJS + '\n        function openJobDetail');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Job Detail script finished.');
