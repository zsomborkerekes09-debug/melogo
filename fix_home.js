const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 2.1 Re-add border-radius and subtle border to job cards
// I just made them edge to edge earlier with margin 0 and border-radius 0.
h = h.replace(/\.job-list\s*\{\s*padding:\s*20px 0;\s*\}/, '.job-list { padding: 20px 16px; }');
h = h.replace(/\.job-card\s*\{\s*background:\s*#fff;\s*margin-bottom:\s*8px;\s*border-radius:\s*0;\s*padding:\s*20px;\s*border-bottom:\s*1px solid var\(--color-border\);\s*box-shadow:\s*none;\s*\}/, '.job-card { background: #fff; margin-bottom: 12px; border-radius: 16px; padding: 20px; border: 1px solid #F1F1F1; box-shadow: none; }');

// If the regex doesn't match perfectly, I will also just use a global replace.
if (!h.includes('padding: 20px 16px;')) {
    h = h.replace('.job-list { padding: 20px 0; }', '.job-list { padding: 20px 16px; }');
}
if (!h.includes('border-radius: 16px; padding: 20px;')) {
    h = h.replace('.job-card { background: #fff; border-radius: 0; padding: 20px; margin-bottom: 8px; border-bottom: 1px solid var(--color-border); box-shadow: none; }', '.job-card { background: #fff; border-radius: 16px; padding: 20px; margin-bottom: 12px; border: 1px solid #F1F1F1; box-shadow: none; }');
}

// 2.2 Category Pills Scrollable
// Find .category-scroll-container
const categoryCSS = `
        .category-scroll-container {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            padding: 0 24px 8px 24px;
            margin: 0 -24px;
            scrollbar-width: none; /* Firefox */
        }
        .category-scroll-container::-webkit-scrollbar {
            display: none;
        }
        .category-gradient {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 40px;
            background: linear-gradient(to right, rgba(10,15,46,0) 0%, rgba(10,15,46,1) 100%);
            pointer-events: none;
        }
`;
if (!h.includes('.category-gradient')) {
    h = h.replace('</style>', categoryCSS + '\n    </style>');
}

// Wrap categories in HTML
if (!h.includes('class="category-gradient"')) {
    const startCat = h.indexOf('<div style="display: flex; justify-content: space-between;');
    if(startCat !== -1) {
        h = h.replace('<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 13px;">', 
        '<div style="position: relative; margin-bottom: 24px;">\n                            <div class="category-scroll-container">\n');
        
        // Find end of this flex box. Actually let's just replace the exact lines
    }
}

// 2.3 Remove "Minden feladat" green subtitle
// <div style="font-size: 13px; color: var(--color-green); font-weight: 600; margin-bottom: 12px; letter-spacing: 0.5px;">MINDEN FELADAT</div>
h = h.replace(/<div style="font-size: 13px; color: var\(--color-green\); font-weight: 600; margin-bottom: 12px; letter-spacing: 0.5px;">MINDEN FELADAT<\/div>\s*/g, '');

// 2.4 Location Indicator pulsing green dot
const pulseCSS = `
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .loc-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
        }
        .loc-dot.active {
            background-color: var(--color-green);
            animation: pulse-green 2s infinite;
        }
        .loc-dot.inactive {
            background-color: #EF4444; /* Red */
        }
`;
if (!h.includes('@keyframes pulse-green')) {
    h = h.replace('</style>', pulseCSS + '\n    </style>');
}

// Replace the gray dot HTML in header
h = h.replace(/<span style="display: inline-block; width: 6px; height: 6px; background-color: #9CA3AF; border-radius: 50%; margin-right: 6px;"><\/span>/g, '<span class="loc-dot active"></span>');

// 2.5 Distance selector pin icon
// `<span style="display:flex;align-items:center;background:rgba(255,255,255,0.1);padding:4px 10px;border-radius:20px;font-size:12px;color:white;font-weight:600;">50 km <svg...`
h = h.replace(/(<span style="display:flex;align-items:center;background:rgba\(255,255,255,0\.1\);padding:4px 10px;border-radius:20px;font-size:12px;color:white;font-weight:600;">)\s*50 km/g, 
    '$1<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> 50 km');

// 2.6 Divider above sort pills & 2.7 Scrollable sort pills
const sortScrollCSS = `
        .sort-scroll-container {
            display: flex;
            overflow-x: auto;
            gap: 8px;
            padding: 16px 20px 0 20px;
            scrollbar-width: none;
            border-top: 1px solid #E5E7EB;
        }
        .sort-scroll-container::-webkit-scrollbar {
            display: none;
        }
`;
if (!h.includes('.sort-scroll-container')) {
    h = h.replace('</style>', sortScrollCSS + '\n    </style>');
}

h = h.replace(/<div class="filter-pills">/g, '<div class="sort-scroll-container filter-pills" style="margin: 0 -20px; border-top: 1px solid #E5E7EB;">');
// Remove existing padding if we just added it to the container
h = h.replace(/\.filter-pills\s*\{\s*display:\s*flex;\s*gap:\s*8px;\s*margin-bottom:\s*16px;\s*overflow-x:\s*auto;\s*padding-bottom:\s*8px;\s*\}/, 
              '.filter-pills { margin-bottom: 16px; padding-bottom: 8px; }');

// 2.8 Pull to refresh
const p2rCSS = `
        .ptr-container {
            height: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: height 0.3s ease;
        }
        .ptr-container.loading {
            height: 60px;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .ptr-spinner {
            animation: spin 1s linear infinite;
            color: var(--color-green);
        }
`;
if (!h.includes('.ptr-container')) {
    h = h.replace('</style>', p2rCSS + '\n    </style>');
}
if (!h.includes('id="ptr-container"')) {
    h = h.replace('<div class="job-list" id="job-list">', '<div class="ptr-container" id="ptr-container"><svg class="ptr-spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M16 12a4 4 0 0 0-8 0"></path></svg></div>\n                        <div class="job-list" id="job-list">');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Home CSS/HTML script finished.');
