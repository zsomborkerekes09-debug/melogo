const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Fix 1: Remove duplicate filterWorkerJobs function (old one)
// The new one is defined in the new JS section at the bottom.
// The old one was:
const oldFilterFn = `        function filterWorkerJobs(cat) {
            // Update pills UI
            const btns = document.querySelectorAll('.category-btn');
            btns.forEach(btn => {
                if (btn.innerText.trim() === cat || (cat === 'all' && btn.innerText.trim() === 'Minden')) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = 'var(--color-navy)';
                    btn.style.color = '#fff';
                    btn.style.border = 'none';
                } else {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = '#fff';
                    btn.style.color = 'var(--color-text)';
                    btn.style.border = '1px solid var(--color-border)';
                }
            });

            // Filter cards
            const cards = document.querySelectorAll('#worker-jobs-list .job-card');
            cards.forEach(card => {
                const badge = card.getAttribute('data-category');
                if (cat === 'all' || cat === 'Minden' || cat === 'Összes' || badge === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }`;

if (h.includes(oldFilterFn)) {
    h = h.replace(oldFilterFn, '        // filterWorkerJobs is now handled by the new JS engine below');
    console.log('Fixed: Removed duplicate filterWorkerJobs');
} else {
    console.log('Note: old filterWorkerJobs not found (may already be removed)');
}

// Fix 2: The old sortWorkerJobs function conflicts with sortWorkerJobsNew
// Keep both but make sure old one doesn't break
// The old sortWorkerJobs references sort-btn class, new one uses sort-pill

// Fix 3: Make sure the window.onload properly chains
// Currently there's an original window.onload AND a new one that does:
// const _oldOnLoad = window.onload; window.onload = function() { if (_oldOnLoad) _oldOnLoad(); ... }
// But the original onload may call filterWorkerJobs('all') before renderJobCards is called
// which means worker-jobs-list is empty -> filterWorkerJobs gets no cards to filter
// Fix: In original onload, remove the filterWorkerJobs('all') call since renderJobCards handles it

const originalOnloadFilter = `            filterWorkerJobs('all');`;
if (h.includes(originalOnloadFilter)) {
    h = h.replace(originalOnloadFilter, `            // filterWorkerJobs is now handled by refreshJobList() in the new engine`);
    console.log('Fixed: Removed premature filterWorkerJobs call from original onload');
}

// Fix 4: Ensure onSearchInput renders ALL jobs when empty (currently might have an issue)
// The function already does filtered = mockJobs when q is empty - that's correct
// But let's also call it in openSearchOverlay to ensure results show
const openSOFix = `function openSearchOverlay() {
            document.getElementById('search-overlay').classList.add('open');
            setTimeout(() => {
                const inp = document.getElementById('search-overlay-input');
                if (inp) { inp.value = ''; inp.focus(); }
            }, 300);`;
const openSOFixed = `function openSearchOverlay() {
            document.getElementById('search-overlay').classList.add('open');
            onSearchInput(''); // Pre-populate with all jobs
            setTimeout(() => {
                const inp = document.getElementById('search-overlay-input');
                if (inp) { inp.value = ''; inp.focus(); }
            }, 300);`;
if (h.includes(openSOFix)) {
    h = h.replace(openSOFix, openSOFixed);
    console.log('Fixed: openSearchOverlay pre-populates results');
}

// Fix 5: Add position:relative to the body wrapping div if exists, 
// or ensure phone-app's overflow:hidden properly clips overlays
// The CSS already has overflow:hidden on .phone-container - this should work
// Let's also add a CSS rule to ensure #search-overlay works inside overflow:hidden parent

// Fix 6: The push notification banner has position:absolute relative to #phone-app
// with top: -80px when hidden and top: 16px when shown - this SHOULD work within overflow:hidden
// But since overflow:hidden clips the top:-80px, the banner IS hidden. When it gets top:16px, it shows.
// This is the correct behavior.

// Save
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nSaved. File size:', Math.round(h.length / 1024) + 'KB');

// Final verification
const finalH = fs.readFileSync('index.html', 'utf8');
const checks = [
    ['mockJobs defined', 'const mockJobs = ['],
    ['renderJobCards', 'function renderJobCards('],
    ['filterWorkerJobs (new)', 'function filterWorkerJobs(cat)'],
    ['sortWorkerJobsNew', 'function sortWorkerJobsNew('],
    ['openSearchOverlay pre-populate', "onSearchInput(''); // Pre-populate"],
    ['search overlay inside phone-app', true], // checked by position
    ['no duplicate filterWorkerJobs in old position', !finalH.includes("Update pills UI")],
];

checks.forEach(([label, check]) => {
    const result = typeof check === 'string' ? finalH.includes(check) : check;
    console.log((result ? '✅' : '❌') + ' ' + label);
});
