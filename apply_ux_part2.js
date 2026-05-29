const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 7. CARD LEFT BORDER ACCENT & SHIMMER in JS render
// Add `cat-accent-${category}` and `shimmer` classes when creating cards.
h = h.replace(/<div class="job-card" onclick="openJobDetail\(\$\{job\.id\}\)">/g, 
    '<div class="job-card cat-accent-${job.category === \'Ház belseje\' ? \'Ház\' : job.category} shimmer slide-down-in" onclick="openJobDetail(${job.id})">');

// 8. RELATIVE TIME & POPULARITY & RETURNING EMPLOYER in JS render
const advancedRenderJS = `
        function getRelativeTime(timeStr) {
            if (timeStr.includes('Ma')) return '5 perce adták fel';
            if (timeStr.includes('Holnap')) return '1 órája adták fel';
            return timeStr; // For older ones, we'll keep the string or parse a real date.
        }
        function getPopularityTag(isUrgent) {
            if (!isUrgent) return '';
            const count = Math.floor(Math.random() * 5) + 2;
            return \`<span style="font-size:10px; color:#D97706; font-weight:600; margin-left:8px;">👁 \${count} munkás nézi most</span>\`;
        }
        function getReturningTag(employer) {
            if (employer === 'Tóth János' || employer === 'Szabó Éva') {
                return \`<div style="font-size:10px; color:var(--color-navy); background:#E0E7FF; padding:2px 8px; border-radius:10px; display:inline-block; margin-bottom:4px; font-weight:600;">Korábban már dolgoztál nála</div>\`;
            }
            return '';
        }
`;
if (!h.includes('getRelativeTime')) {
    h = h.replace('function renderJobList', advancedRenderJS + '\n        function renderJobList');
}
// Update render string
h = h.replace(/\$\{job\.time\}/g, '${getRelativeTime(job.time)}');
h = h.replace(/<span style="color: #9CA3AF; display:inline-flex; align-items:center; gap:4px;">.*?<\/span>/g, 
    '${getReturningTag(job.employer)}<br><span style="color: #9CA3AF; display:inline-flex; align-items:center; gap:4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${job.employer}</span>${getPopularityTag(job.urgent)}');

// 9. CROSS FADE ROLE SWITCH
const crossFadeCSS = `
        .fade-view { transition: opacity 0.3s ease; }
        .fade-view.hidden { opacity: 0; pointer-events: none; position: absolute; }
`;
if (!h.includes('.fade-view')) {
    h = h.replace('</style>', crossFadeCSS + '\n    </style>');
}
h = h.replace(/id="home-worker-view" class="job-list"/g, 'id="home-worker-view" class="job-list fade-view"');
h = h.replace(/id="home-employer-view" class="hidden"/g, 'id="home-employer-view" class="fade-view hidden"');
// Update switchRole JS to use opacity
h = h.replace(/document\.getElementById\('home-worker-view'\)\.classList\.add\('hidden'\);/g, "document.getElementById('home-worker-view').style.opacity = '0'; setTimeout(()=>document.getElementById('home-worker-view').classList.add('hidden'), 300);");
h = h.replace(/document\.getElementById\('home-employer-view'\)\.classList\.remove\('hidden'\);/g, "setTimeout(()=>{document.getElementById('home-employer-view').classList.remove('hidden'); document.getElementById('home-employer-view').style.opacity = '1';}, 300);");
h = h.replace(/document\.getElementById\('home-employer-view'\)\.classList\.add\('hidden'\);/g, "document.getElementById('home-employer-view').style.opacity = '0'; setTimeout(()=>document.getElementById('home-employer-view').classList.add('hidden'), 300);");
h = h.replace(/document\.getElementById\('home-worker-view'\)\.classList\.remove\('hidden'\);/g, "setTimeout(()=>{document.getElementById('home-worker-view').classList.remove('hidden'); document.getElementById('home-worker-view').style.opacity = '1';}, 300);");

// 10. RATING STARS ANIMATION & COUNT UP
const starsJS = `
        function animateProfile() {
            // Count up
            const amountEl = document.getElementById('profile-earned-amount');
            if (amountEl) {
                let current = 0;
                const target = 32000;
                const interval = setInterval(() => {
                    current += 1000;
                    if (current >= target) { current = target; clearInterval(interval); }
                    amountEl.innerText = current.toLocaleString('hu-HU') + ' Ft';
                }, 15);
            }
            // Stagger stars
            const stars = document.querySelectorAll('.profile-star');
            stars.forEach((s, i) => {
                s.style.opacity = '0';
                s.style.transform = 'scale(0.5)';
                s.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                setTimeout(() => {
                    s.style.opacity = '1';
                    s.style.transform = 'scale(1)';
                }, 300 + (i * 80));
            });
        }
`;
if (!h.includes('animateProfile()')) {
    h = h.replace('function openSettings()', starsJS + '\n        function openSettings()');
    h = h.replace('function switchTab(tabId)', "function switchTab(tabId) {\n            if(tabId === 'profil') setTimeout(animateProfile, 100);");
}
h = h.replace(/32 000 Ft/g, '<span id="profile-earned-amount">0 Ft</span>');
// Add class to stars
h = h.replace(/<svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"/g, '<svg class="profile-star" width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"');

// 11. SEARCH CLEAR X ANIMATION & KEYBOARD SCROLL & DISTANCE MAGIC
const uxJS = `
        // Input scroll into view
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => input.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
            });
        });
        
        // Search clear X
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear-btn');
        if (searchInput && searchClear) {
            searchClear.style.transition = 'transform 0.2s';
            searchInput.addEventListener('input', () => {
                if (searchInput.value.length > 0) {
                    searchClear.style.display = 'block';
                    setTimeout(()=>searchClear.style.transform = 'scale(1)', 10);
                } else {
                    searchClear.style.transform = 'scale(0)';
                    setTimeout(()=>searchClear.style.display = 'none', 200);
                }
            });
        }

        // Distance magic (simulate walking closer)
        setInterval(() => {
            document.querySelectorAll('.job-distance-text').forEach(el => {
                let dist = parseFloat(el.innerText);
                if (dist > 0.1 && Math.random() > 0.8) {
                    dist -= 0.1;
                    el.innerText = dist.toFixed(1) + ' km';
                    el.style.color = 'var(--color-green)';
                    setTimeout(()=>el.style.color='#9CA3AF', 500);
                }
            });
        }, 5000);
`;
if (!h.includes('Distance magic')) {
    h = h.replace('updateGreetings();', 'updateGreetings();\n                    ' + uxJS);
}
// Add class to distance text
h = h.replace(/\$\{job\.distance\} km/g, '<span class="job-distance-text">${job.distance}</span> km');

// 12. HUNGARIAN FORMATS & STRIPE BREAKDOWN
h = h.replace(/A munkadíj a munka elvégzése után kerül kifizetésre a Stripe rendszerén keresztül./g, 
    'A munkadíj a munka elvégzése után kerül kifizetésre a Stripe rendszerén keresztül.<br><span style="color:var(--color-navy); font-weight:600;">\${job.price.toLocaleString(\'hu-HU\')} Ft munkadíj − \${(job.price * 0.15).toLocaleString(\'hu-HU\')} Ft (15% platform díj) = \${(job.price * 0.85).toLocaleString(\'hu-HU\')} Ft utalva a Stripe egyenlegedre.</span>');
// Note: In string literals inside `openJobDetail` the job is accessible.

// Fix dates (simulated everywhere to hu-HU format)
h = h.replace(/Ma 14:00/g, '2026. máj. 24.');
h = h.replace(/Ma 16:00/g, '2026. máj. 24.');
h = h.replace(/Ma 17:00/g, '2026. máj. 24.');

fs.writeFileSync('index.html', h, 'utf8');
console.log('Part 2 applied');
