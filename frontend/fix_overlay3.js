const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// The overlays (search-overlay, distance-sheet, push-banner, chat-detail-overlay)
// are currently located AFTER line 1742 (outside #phone-app).
// We need them INSIDE #phone-app, before its closing </div>.

// Strategy:
// 1. Find the big overlay block (from SEARCH OVERLAY comment to chat-detail-overlay closing div)
// 2. Remove it from its current location
// 3. Insert it BEFORE the closing </div> of #phone-app

// Find the overlay block start
const ovStartMarker = '\n                \n        </div>\n\n    <!-- TÁJÉKOZTATÓ';
const ovStartMarkerAlt = '\n                \n                <!-- ===== SEARCH OVERLAY =====';

// Find where the overlays are now
const soIdx = h.indexOf('<!-- ===== SEARCH OVERLAY =====');
if (soIdx === -1) { console.log('Cannot find overlay'); process.exit(1); }
console.log('Search overlay found at char index:', soIdx);

// Find end: the push-banner and chat-detail-overlay together end before <!-- TÁJÉKOZTATÓ
const tajIdx = h.indexOf('\n    <!-- TÁJÉKOZTATÓ SZEKCIÓ');
console.log('TÁJÉKOZTATÓ section at:', tajIdx);

// Extract the whole overlay block
// It starts some chars before the SEARCH OVERLAY comment
const blockStart = h.lastIndexOf('\n', soIdx - 1);
const blockEnd = h.indexOf('\n        </div>\n\n    <!-- TÁJÉKOZTATÓ');

if (blockEnd === -1) {
    console.log('Trying different block end marker...');
}

// Different approach: just get from soIdx backwards a bit to the previous closing div
const prevClosingDiv = h.lastIndexOf('</div>', soIdx);
const ovBlock = h.substring(prevClosingDiv + 6, tajIdx).trimEnd();
console.log('Block to move length:', ovBlock.length);
console.log('Block preview (first 80):', ovBlock.substring(0, 80));

// Remove the overlay block from current location
// and the preceding empty line/whitespace
const beforeOvBlock = h.substring(0, prevClosingDiv + 6);
const afterOvBlock = h.substring(tajIdx);
h = beforeOvBlock + afterOvBlock;
console.log('Removed block from current location');

// Now find the correct position to insert: 
// INSIDE #phone-app, right before its closing </div>
// #phone-app has class "phone-container" - find it
// The bottom-nav is the last element inside #phone-app before it closes
// Find the bottom-nav's closing </div>
const bnComment = h.indexOf('<!-- Alsó navigáció (4 GOMBOS UNIFIED NAVIGÁCIÓ) -->');
const bnClose = h.indexOf('</div>', h.indexOf('nav-label">Profil', bnComment)) + 6;
// Now find the NEXT closing div which should be the #phone-app's main content closing

// Actually, let's look for the exact pattern:
//   </div>  <- bottom-nav
//           <- (empty)
// </div>   <- phone-app's screens-container or content wrapper
// </div>   <- phone-app

// Find the position right after bottom-nav closing </div>
const insertAfterBottomNav = bnClose;
console.log('Insert position (after bottom-nav close):', insertAfterBottomNav);
console.log('Context:', h.substring(insertAfterBottomNav, insertAfterBottomNav + 40));

// Insert the overlay block there
const newOvBlock = '\n' + ovBlock.trim() + '\n';
h = h.substring(0, insertAfterBottomNav) + newOvBlock + h.substring(insertAfterBottomNav);
console.log('Inserted overlay block inside #phone-app after bottom-nav');

// Verify
const newSoIdx = h.indexOf('id="search-overlay"');
const newBnIdx = h.indexOf('<!-- Alsó navigáció');
const newTajIdx = h.indexOf('<!-- TÁJÉKOZTATÓ');
console.log('\nVerification:');
console.log('bottom-nav at:', newBnIdx);
console.log('search-overlay at:', newSoIdx);
console.log('TÁJÉKOZTATÓ at:', newTajIdx);
console.log('Overlay after bottom-nav?', newSoIdx > newBnIdx);
console.log('Overlay before TÁJÉKOZTATÓ?', newSoIdx < newTajIdx);

fs.writeFileSync('index.html', h, 'utf8');
console.log('\nSaved. Size:', Math.round(h.length / 1024) + 'KB');
