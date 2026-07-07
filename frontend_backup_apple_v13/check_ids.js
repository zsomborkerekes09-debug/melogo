const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const idsToCheck = [
    'worker-job-filter-display',
    'app-login-screen',
    'distance-pill-text',
    'distance-slider',
    'emp-price-input',
    'main-auth-btn',
    'login-email',
    'login-pw',
    'employer-success-desc',
    'push-banner',
    'chat-reply-input',
    'worker-chat-reply-input',
    'worker-chat-messages',
    'worker-status-section',
    'worker-apply-btn',
    'employer-action-title',
    'employer-chat-job-subtitle',
    'employer-chat-pinned-bar',
    'employer-chat-messages',
    'employer-action-footer'
];

console.log("=== Checking element IDs in HTML ===");
idsToCheck.forEach(id => {
    const pattern = new RegExp(`id=["']${id}["']`, 'i');
    const exists = pattern.test(html);
    console.log(`ID '${id}': ${exists ? 'EXISTS' : 'NOT FOUND ❌'}`);
});
