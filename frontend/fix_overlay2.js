const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
const lines = h.split('\n');

// PROBLEM 1: The autofocus attribute on search input auto-opens the keyboard / triggers display
// PROBLEM 2: Overlay is inside the profile-screen's divs, not as a direct #phone-app child
// PROBLEM 3: Empty search results because onSearchInput called before mockJobs is available

// Fix 1: Remove autofocus from search overlay input
h = h.replace(' autofocus>', '>');
h = h.replace(' autofocus ', ' ');
console.log('Fix 1: Removed autofocus');

// Fix 2: Move the entire overlay block to AFTER bottom-nav closing div
// Strategy: Find the overlay block, remove from current position, re-insert in correct location

// Find the overlay block start (the HTML comment before #search-overlay)
const ovStart = h.indexOf('\n                <!-- ===== SEARCH OVERLAY ===== -->');
if (ovStart === -1) { console.log('ERROR: Could not find overlay start'); process.exit(1); }

// Find the overlay block end: after chat-detail-overlay's closing tag
// The chat detail overlay ends with </div> for its outer div
const chatDetailClose = h.indexOf('</div>\n\n                <!-- Alsó navigáció');
if (chatDetailClose === -1) { 
    // try to find it differently
    console.log('Trying alternate end search...');
    const bnLine = lines.findIndex(l => l.includes('Alsó navigáció'));
    console.log('Bottom nav at line:', bnLine);
    
    // Extract overlay block lines (from ovStart-equivalent to bnLine)
    const ovStartLine = lines.findIndex(l => l.includes('SEARCH OVERLAY') && !l.includes('/*') && !l.includes('=====\n'));
    console.log('Overlay start line:', ovStartLine);
}

// Find where chat-detail-overlay closing div is, before the bottom nav comment
const bnIdx = h.indexOf('<!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->');
if (bnIdx === -1) { console.log('ERROR: Bottom nav not found'); process.exit(1); }

const ovBlockEnd = bnIdx;
const ovBlock = h.substring(ovStart, ovBlockEnd);
console.log('Overlay block extracted, length:', ovBlock.length);
console.log('Block preview:', ovBlock.substring(0, 60));

// Remove overlay block from current position
h = h.substring(0, ovStart) + h.substring(ovBlockEnd);
console.log('Removed from inside profile section');

// Now find the BOTTOM NAV closing tag - we want to insert AFTER the bottom-nav and BEFORE the closing divs of phone-app
// The structure after bottom-nav is:
//   </div>  <- closes bottom-nav div
// </div>  <- closes something
// </div>  <- closes #phone-app
// So insert after the bottom-nav's </div>

const bnNewIdx = h.indexOf('<!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->');
// Find the closing </div> of bottom-nav
const bnEnd = h.indexOf('</div>', bnNewIdx + 50); // skip past some content
// Actually find it properly: after the last nav-item
const lastNavItem = h.indexOf('<span class="nav-label">Profil</span>', bnNewIdx);
const lastNavClose = h.indexOf('</div>', lastNavItem);
const bottomNavClose = h.indexOf('</div>', lastNavClose + 1); // the bottom-nav's </div>
const insertPoint = bottomNavClose + 6;

console.log('Inserting overlays at position:', insertPoint);
h = h.substring(0, insertPoint) + '\n' + ovBlock + h.substring(insertPoint);
console.log('Inserted overlay block after bottom-nav');

// Fix 3: The onSearchInput function needs to populate results correctly.
// Let's verify it works by ensuring mockJobs is defined before it's called.
// The issue might be that onSearchInput is rendering but the DOM element isn't found.
// Let's add a safety check.
h = h.replace(
    'function onSearchInput(query) {\n            const q = query.toLowerCase().trim();\n            const resultList = document.getElementById(\'search-results-list\');',
    'function onSearchInput(query) {\n            const q = (query || \'\').toLowerCase().trim();\n            const resultList = document.getElementById(\'search-results-list\');\n            if (!resultList) return;\n            if (typeof mockJobs === \'undefined\') { resultList.innerHTML = \'<div class="search-empty">Betöltés...</div>\'; return; }'
);
console.log('Fix 3: Added safety checks to onSearchInput');

// Fix 4: openSearchOverlay should focus the input AFTER opening
h = h.replace(
    'function openSearchOverlay() {\n            document.getElementById(\'search-overlay\').classList.add(\'open\');\n            setTimeout(() => {\n                const inp = document.getElementById(\'search-overlay-input\');\n                if (inp) inp.focus();\n            }, 300);',
    'function openSearchOverlay() {\n            document.getElementById(\'search-overlay\').classList.add(\'open\');\n            setTimeout(() => {\n                const inp = document.getElementById(\'search-overlay-input\');\n                if (inp) { inp.value = \'\'; inp.focus(); }\n            }, 300);'
);
console.log('Fix 4: Fixed openSearchOverlay focus');

// Fix 5: The #search-overlay needs position: fixed inside the phone container
// Change position to fixed but scope it to phone-app using transform trick
// Actually the correct fix is to make #phone-app the positioning context
// #phone-app already has position:relative via .phone-container
// But the overlay may have been inside the profile screen's overflow:auto div
// Now that we moved it to be a sibling of bottom-nav (direct child of #phone-app), it should work.
// BUT we need to make sure the overlay's position:absolute is relative to #phone-app, not the screen
// Fix: Use position:absolute with proper z-index and top:0 left:0 right:0 bottom:0
// This is already in the CSS. The issue was just placement.

// Verify final structure
const finalOvIdx = h.indexOf('id="search-overlay"');
const finalBnIdx = h.indexOf('<!-- Alsó navigáció');
console.log('\nFinal positions:');
console.log('search-overlay at char:', finalOvIdx);
console.log('bottom-nav comment at char:', finalBnIdx);
console.log('Overlay is AFTER bottom-nav?', finalOvIdx > finalBnIdx);

fs.writeFileSync('index.html', h, 'utf8');
console.log('\nSaved! File size:', Math.round(h.length / 1024) + 'KB');
