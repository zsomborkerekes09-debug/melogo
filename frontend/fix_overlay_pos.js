const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ====================
// 1. FIX: Search overlay must NOT start open.
//    Change its initial display to properly hidden.
//    The CSS already has transform: translateY(100%) which should hide it.
//    But it needs to be inside #phone-app (position: relative, overflow: hidden)
//
// Current structure inside #phone-app (after our changes):
//   .screens-container > #app-slider > .screen x4
//   [overlays inserted here - BUT inside profile screen's closing tags?]
//   .bottom-nav
//   closing </div> x2

// Let's check: find where the search-overlay div actually starts in HTML
const soStart = h.indexOf('\n                <!-- ===== SEARCH OVERLAY ===== -->');
if (soStart === -1) { console.log('OVERLAY NOT FOUND'); process.exit(1); }

// Find where it ends (look for the Chat Detail overlay end)
const soEnd = h.indexOf('\n                </div>\n\n\n                <!-- Alsó navigáció');
if (soEnd === -1) { console.log('OVERLAY END NOT FOUND'); process.exit(1); }

// Extract the entire overlay block
const overlayBlock = h.substring(soStart, soEnd + 1);
console.log('Overlay block length:', overlayBlock.length);
console.log('Block starts:', overlayBlock.substring(0, 80));

// Remove the overlay block from its current position
h = h.substring(0, soStart) + h.substring(soEnd + 1);
console.log('Removed from old position');

// Now find the correct insertion point: just BEFORE the closing </div></div> of #phone-app
// #phone-app closes with:
//   </div>  <- closes bottom-nav
// </div>  <- closes the inner div (screens-container sibling)
// </div>  <- closes .screens-container
// Actually, let's insert right AFTER the bottom-nav closing </div>

const bottomNavClose = h.indexOf('                </div>\n            </div>\n        </div>\n\n    <!-- TÁJÉKOZTATÓ');
if (bottomNavClose !== -1) {
    // Insert after the bottom-nav's closing div, before closing of #phone-app's wrapping divs
    const insertAfterBottomNav = h.indexOf('</div>', h.indexOf('<span class="nav-label">Profil</span>')) + 6;
    h = h.substring(0, insertAfterBottomNav) + overlayBlock + h.substring(insertAfterBottomNav);
    console.log('Inserted overlay block after bottom-nav');
} else {
    console.log('Could not find insertion point');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Done');
