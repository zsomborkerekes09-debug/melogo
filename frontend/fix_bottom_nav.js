const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 6.1 Normalize icon stroke weight to 1.5px
h = h.replace(/<svg class="tab-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/g, 
    '<svg class="tab-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">');

// 6.2 Active tab label navy 500
h = h.replace(/\.nav-item\.active \.nav-label\s*\{\s*color:\s*var\(--color-navy\);\s*\}/, 
    '.nav-item.active .nav-label { color: var(--color-navy); font-weight: 500; }');

// 6.3 Add 8px bottom padding & 6.5 Blur backdrop filter to capsule
h = h.replace(/\.bottom-nav\s*\{\s*position:\s*absolute;\s*bottom:\s*20px;\s*left:\s*12px;\s*right:\s*12px;\s*height:\s*64px;\s*background:\s*#fff;\s*border-radius:\s*32px;\s*display:\s*flex;\s*justify-content:\s*space-around;\s*align-items:\s*center;\s*border:\s*1px solid #E5E7EB;\s*box-shadow:\s*0 10px 25px rgba\(0,0,0,0.1\);\s*z-index:\s*100;\s*\}/, 
    '.bottom-nav { position: absolute; bottom: 20px; left: 12px; right: 12px; height: 72px; padding-bottom: 8px; background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 36px; display: flex; justify-content: space-around; align-items: center; border: 1px solid rgba(229,231,235,0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100; }');

// 6.4 Unread message badge on Üzenetek tab
const unreadBadgeCSS = `
        .unread-badge {
            position: absolute;
            top: -2px;
            right: -6px;
            background: var(--color-navy);
            color: white;
            font-size: 10px;
            font-weight: 700;
            min-width: 16px;
            height: 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            padding: 0 4px;
        }
`;
if (!h.includes('.unread-badge')) {
    h = h.replace('</style>', unreadBadgeCSS + '\n    </style>');
}

// Add the badge to the HTML
h = h.replace(/(<div class="nav-icon-wrap"[^>]*>\s*<svg[^>]*>.*?<\/svg>)\s*(<\/div>\s*<span class="nav-label">Üzenetek<\/span>)/g, 
    '$1\n                            <div class="unread-badge">3</div>\n                        $2');

// 6.6 Search focus transition
h = h.replace(/\.search-overlay-input-wrap\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*background:\s*rgba\(255,255,255,0\.1\);\s*border-radius:\s*12px;\s*padding:\s*0 12px;\s*height:\s*44px;\s*flex:\s*1;\s*\}/, 
    '.search-overlay-input-wrap { display: flex; align-items: center; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 0 12px; height: 44px; flex: 1; border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.2s; }\n        .search-overlay-input-wrap:focus-within { border-color: rgba(255,255,255,0.3); }');

// Update main search bar too
h = h.replace(/\.search-bar\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*background-color:\s*rgba\(255,255,255,0\.1\);\s*padding:\s*12px 16px;\s*border-radius:\s*16px;\s*margin-bottom:\s*24px;\s*\}/, 
    '.search-bar { display: flex; align-items: center; background-color: rgba(255,255,255,0.1); padding: 12px 16px; border-radius: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.2s; cursor: text; }\n        .search-bar:active { border-color: rgba(255,255,255,0.3); }');

// 6.7 Filter pill bounce animation
h = h.replace(/\.filter-pill\s*\{\s*padding:\s*8px 16px;\s*border-radius:\s*20px;\s*background-color:\s*#fff;\s*font-size:\s*13px;\s*font-weight:\s*500;\s*color:\s*var\(--color-text\);\s*cursor:\s*pointer;\s*white-space:\s*nowrap;\s*\}/, 
    '.filter-pill { padding: 8px 16px; border-radius: 20px; background-color: #fff; font-size: 13px; font-weight: 500; color: var(--color-text); cursor: pointer; white-space: nowrap; transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s, color 0.2s; }\n        .filter-pill:active { transform: scale(0.95); }');

fs.writeFileSync('index.html', h, 'utf8');
console.log('Bottom Nav & Polish script finished.');
