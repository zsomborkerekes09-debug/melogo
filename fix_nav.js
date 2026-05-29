const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// THE BUG: My new CSS added `.screen { position: absolute; ... padding-bottom: 96px }`
// which overwrote the slider's `.screen { width: 25%; height: 100% }` layout
// Fix: Remove the bad screen CSS and replace with correct approach

// Find and remove the bad override I added
const badScreenCSS = `        /* Screens padding for floating nav */
        .screens-container {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        .screen {
            position: absolute;
            top: 0; left: 0; right: 0;
            bottom: 0;
            overflow-y: auto;
            padding-bottom: 96px;
        }
        /* Map screen doesn't need padding */
        #app-map-screen {
            padding-bottom: 0 !important;
        }`;

if (h.includes(badScreenCSS)) {
    // Replace with correct approach: only add padding-bottom to scroll contents, NOT position:absolute
    const fixedScreenCSS = `        /* Screens padding for floating nav (FIXED - don't break slider!) */
        /* Each scrollable screen content gets padding-bottom for the floating nav */
        .job-list, .chat-list, .messages-header + *, #app-messages-screen > * {
            /* padding handled per-screen below */
        }
        /* Add padding to scrollable screen containers */
        #app-home-screen .screen-scroll-content,
        #app-messages-screen,
        #app-profile-screen {
            padding-bottom: 96px;
        }`;
    h = h.replace(badScreenCSS, fixedScreenCSS);
    console.log('✅ Removed bad screen CSS override');
} else {
    console.log('⚠️ Bad screen CSS not found exactly, trying to find and remove it');
    // Try to find it by parts
    const badPart = `        .screen {\n            position: absolute;\n            top: 0; left: 0; right: 0;\n            bottom: 0;\n            overflow-y: auto;\n            padding-bottom: 96px;\n        }`;
    if (h.includes(badPart)) {
        h = h.replace(badPart, '        /* .screen position fix: kept original slider CSS */');
        console.log('✅ Removed position:absolute from .screen');
    } else {
        console.log('⚠️ Could not find bad .screen CSS exactly');
    }
    
    const badMapCSS = `        /* Map screen doesn't need padding */\n        #app-map-screen {\n            padding-bottom: 0 !important;\n        }`;
    if (h.includes(badMapCSS)) {
        h = h.replace(badMapCSS, '');
        console.log('✅ Removed map screen override');
    }
}

// Now add proper padding-bottom to the SCROLLABLE CONTENT inside each screen
// The screens have overflow-y: auto already (from original CSS)
// We just need padding-bottom: 96px on the screens themselves so the floating nav doesn't cover content

// Find the original .screen CSS and add padding-bottom there
const origScreenCSS = `        .screen {
            width: 25%;
            height: 100%;
            overflow-y: auto;
            position: relative;
            background-color: var(--color-bg);
        }`;

const fixedOrigScreenCSS = `        .screen {
            width: 25%;
            height: 100%;
            overflow-y: auto;
            position: relative;
            background-color: var(--color-bg);
            padding-bottom: 96px; /* Space for floating nav capsule */
        }`;

if (h.includes(origScreenCSS)) {
    h = h.replace(origScreenCSS, fixedOrigScreenCSS);
    console.log('✅ Added padding-bottom to original .screen CSS');
} else {
    console.log('⚠️ Original .screen CSS not found - might already be modified');
    // Check if padding-bottom is already there
    if (h.includes('padding-bottom: 96px')) {
        console.log('  padding-bottom already present somewhere');
    }
}

// Remove map screen override if it ended up duplicated
// Map screen is not scrollable so it doesn't need padding

// Make sure navigateApp function works correctly - it should be using translateX
// Check if it exists
const navFnExists = h.includes('function navigateApp(');
console.log('navigateApp function exists:', navFnExists);

// Verify the slider CSS is intact
const sliderCSS = h.includes('#app-slider') && h.includes('width: 400%') && h.includes('transform');
console.log('app-slider CSS intact:', sliderCSS);

// Verify .screen width is 25%
const screen25 = h.includes('width: 25%');
console.log('.screen width: 25%:', screen25);

fs.writeFileSync('index.html', h, 'utf8');
console.log('\n✅ Navigation fix applied!');
console.log('File size:', Math.round(h.length / 1024) + 'KB');
