const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('<div class="header-midnight">');
const endIdx = content.indexOf('<div id="home-worker-view"');
if (startIdx === -1 || endIdx === -1) {
    console.error('Not found');
    process.exit(1);
}

const oldHeader = content.substring(startIdx, endIdx);

const newHeader = `
                <div class="header-midnight" style="background: var(--color-bg) !important; padding: max(env(safe-area-inset-top), 24px) 20px 10px 20px; display: flex; flex-direction: column; gap: 16px; border: none !important; margin-bottom: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div class="brand-logo" style="font-size: 16px; margin-bottom: 0;">Melo<span>Go</span></div>
                        <div class="welcome-text" style="font-size: 14px; color: var(--color-text-muted); font-weight: 400; margin-bottom: 0;">Szia, <span class="user-first-name-display"></span>!</div>
                    </div>
                    <div class="search-bar" onclick="openSearchOverlay()" style="background: transparent; border: none; padding: 0; margin-top: 8px; margin-bottom: 4px; box-shadow: none;">
                        <input type="text" id="home-search-display" placeholder="Milyen munkát keresel?" readonly style="font-size: 28px; font-weight: 700; color: var(--color-text); padding: 0; margin: 0; cursor: pointer; pointer-events: none; background: transparent; border: none; box-shadow: none; outline: none;">
                    </div>
                    <div class="gps-bar" style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start; background: transparent; border: none; padding: 0; margin-bottom: 8px;">
                        <div class="gps-location" id="gps-location-text" style="cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--color-text-muted); background: transparent; padding: 0;" onclick="openLocationSheet()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span style="width: 80px; display: inline-block;">Helyzet</span>
                            <span id="gps-city-label" style="color: var(--color-text); font-weight: 500;">Helyzet keresése...</span>
                        </div>
                        <button class="distance-pill-btn" id="distance-pill" onclick="openDistanceSheet()" style="cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--color-text-muted); background: transparent !important; border: none !important; padding: 0; height: auto;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
                            <span style="width: 80px; display: inline-block;">Távolság</span>
                            <span id="distance-pill-text" style="color: var(--color-text); font-weight: 500;">10 km</span>
                        </button>
                    </div>
                </div>
                `;

content = content.replace(oldHeader, newHeader);

// Now flatten the filters
// Change "Közeli munkák" header
content = content.replace(
    '<h2 style="font-size: 18px; font-weight: 500; color: var(--color-text);">Közeli munkák</h2>',
    '<h2 style="font-size: 20px; font-weight: 600; color: var(--color-text); margin: 0;">Közeli munkák</h2>'
);

// Flatten the "Összes" button to be simple text
content = content.replace(
    '<div id="worker-job-filter-display" style="display:inline-flex; align-items:center; background:#fff; color:var(--color-text); padding:6px 12px; border:0.5px solid var(--color-border); border-radius: 6px; font-size:13px; font-weight: 500; cursor:pointer; box-sizing: border-box;" onclick="openJobPicker(\'filter\')">',
    '<div id="worker-job-filter-display" style="display:inline-flex; align-items:center; background:transparent; color:var(--color-text-muted); padding:4px 8px; border:none; border-radius: 4px; font-size:14px; font-weight: 500; cursor:pointer;" onclick="openJobPicker(\'filter\')">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Layout replaced successfully!');
