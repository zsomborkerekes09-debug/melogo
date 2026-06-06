const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

const checks = {
    'GPS bar': 'gps-bar',
    'Distance pill btn': 'distance-pill-btn',
    'Search overlay': 'id="search-overlay"',
    'Distance sheet': 'id="distance-sheet"',
    'Distance slider': 'id="distance-slider"',
    'Push banner': 'id="push-banner"',
    'Mock jobs DB': 'const mockJobs',
    'Sort pills': 'sort-pill',
    'Chat overlay': 'chat-detail-overlay',
    'Map pins container': 'map-pins-container',
    'renderJobCards': 'function renderJobCards',
    'openSearchOverlay': 'function openSearchOverlay',
    'filterMapPins': 'function filterMapPins',
    'initGPS': 'function initGPS',
    'showPushNotification': 'function showPushNotification',
    'Sort function': 'sortWorkerJobsNew',
    'Chat send': 'sendChatMessageNew',
    'Distance confirm': 'function confirmDistance',
    'Job detail by ID': 'openJobDetailById',
};

let allOK = true;
for (const [label, token] of Object.entries(checks)) {
    const found = h.includes(token);
    if (!found) allOK = false;
    console.log((found ? '✅' : '❌') + ' ' + label);
}
console.log('\nFile size:', Math.round(h.length / 1024) + ' KB');
console.log('All OK:', allOK);
