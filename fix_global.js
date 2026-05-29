const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. Replace green price with navy
h = h.replace(/\.job-price \{([\s\S]*?)color:\s*var\(--color-green\);/g, '.job-price {$1color: var(--color-navy);');

// 2. Standardize section titles (Közeli munkák, Munka részletei)
h = h.replace(/\.section-title \{([\s\S]*?)\}/g, (match, inner) => {
    return `.section-title {${inner}}`.replace(/font-size:[^;]+;/, 'font-size: 17px;').replace(/font-weight:[^;]+;/, 'font-weight: 500;');
});
h = h.replace(/\.job-detail-section-title \{([\s\S]*?)\}/g, (match, inner) => {
    return `.job-detail-section-title {${inner}}`.replace(/font-size:[^;]+;/, 'font-size: 17px;').replace(/font-weight:[^;]+;/, 'font-weight: 500;');
});

// 3. Unify header heights to 120px
h = h.replace(/\.header \{([\s\S]*?)padding:\s*60px 24px 20px 24px;([\s\S]*?)\}/g, (match, p1, p2) => {
    // If we want height 120px, we can add height: 120px;
    return `.header {${p1}padding: 60px 24px 20px 24px; height: 120px; display: flex; flex-direction: column; justify-content: center;${p2}}`;
});

// Let's also check other headers like .settings-header if they need fixed height? The prompt says "Every screen must have exactly the same dark navy header height (120px)".
// Right now, .header is the main home screen header.

// 4. Update placeholder styling
const placeholderCSS = `
        ::placeholder {
            color: #9CA3AF !important;
            font-size: 14px !important;
            opacity: 1; /* Firefox */
        }
`;
if (!h.includes('::placeholder {')) {
    h = h.replace('</style>', placeholderCSS + '\n    </style>');
}

// 5. Add Launch Screen CSS
const launchScreenCSS = `
        #launch-screen {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--color-navy);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.6s ease;
            pointer-events: none;
        }
        #launch-screen .logo {
            font-size: 32px;
            font-weight: 700;
        }
        #launch-screen .logo .white { color: #fff; }
        #launch-screen .logo .green { color: var(--color-green); }
`;
if (!h.includes('#launch-screen {')) {
    h = h.replace('</style>', launchScreenCSS + '\n    </style>');
}

// 6. Launch Screen HTML
const launchScreenHTML = `
    <!-- Launch Screen -->
    <div id="launch-screen">
        <div class="logo"><span class="white">Melo</span><span class="green">Go</span></div>
    </div>
`;
if (!h.includes('id="launch-screen"')) {
    h = h.replace('<div class="phone-container">', '<div class="phone-container">\n' + launchScreenHTML);
}

// 7. Launch Screen JS (fade out on load)
const launchScreenJS = `
        // Hide launch screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                const launch = document.getElementById('launch-screen');
                if (launch) {
                    launch.style.opacity = '0';
                    setTimeout(() => launch.remove(), 600);
                }
            }, 500); // Show it for 500ms minimum
        });
`;
if (!h.includes('Hide launch screen')) {
    h = h.replace('// Initialize map pins', launchScreenJS + '\n        // Initialize map pins');
}

// 8. Emojis replacement
// I will do this in the next script or manually. Let's do a few known ones:
h = h.replace(/🔴/g, ''); // we will replace it with a dot CSS later
h = h.replace(/⚡/g, '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>');
h = h.replace(/🚀/g, '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>');
// Remove emojis from status buttons
h = h.replace(/🟢 /g, '');
h = h.replace(/🟡 /g, '');
h = h.replace(/⚫ /g, '');
h = h.replace(/&#x1F7E2;/g, '');
h = h.replace(/&#x1F7E1;/g, '');
h = h.replace(/&#x26AB;/g, '');

fs.writeFileSync('index.html', h, 'utf8');
console.log('Global CSS/HTML script finished.');
