const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace apple-premium-light-mode :root block
const oldRoot = `:root {
    --color-chat-bg: var(--color-bg) !important;
    --color-chat-bubble-in: #1C1C1E !important;
    --color-chat-bubble-out: #30D158 !important;
    --color-chat-text-in: #FFFFFF !important;
    --color-chat-text-out: #FFFFFF !important;
    --color-chat-border-in: #333336 !important;
    --color-bg: transparent !important;
    --color-surface: rgba(255, 255, 255, 0.7) !important;
    --color-text: #1D1D1F !important;
    --color-text-light: #3A3A3C !important;
    --color-border: rgba(0, 0, 0, 0.08) !important;
    --color-text-muted: #86868B !important;
    --color-green: #FF5722 !important; /* Keep brand accent */
    --color-navy: #000000 !important;
    --color-chat-bg: #000000 !important;
    --color-chat-bubble-in: #1C1C1E !important;
    --color-chat-bubble-out: #0066CC !important; /* Apple iMessage blue */
    --color-chat-text-in: #FFFFFF !important;
    --color-chat-text-out: #FFFFFF !important;
}`;

const newRoot = `:root {
    --color-profile-header-bg: #FFFFFF;
    --color-profile-header-text: #1D1D1F;
    --color-navy: #000000;
    --color-green: #FF5722;
    --color-logo-green: #c0fc2a;
    --color-bg: #F8F9FB;
    --color-text: #1D1D1F;
    --color-text-light: #4A5568;
    --color-border: rgba(0, 0, 0, 0.08);
    --color-surface: #FFFFFF;
    --color-text-muted: #86868B;
    
    --color-chat-bg: #F3F4F6;
    --color-chat-bubble-in: #FFFFFF;
    --color-chat-bubble-out: #FF5722;
    --color-chat-text-in: #000000;
    --color-chat-text-out: #FFFFFF;
    --color-chat-border-in: #E2E8F0;
}`;

if (content.includes(oldRoot)) {
    content = content.replace(oldRoot, newRoot);
    console.log('Replaced :root in apple-premium-light-mode style tag.');
} else {
    // try replacing dynamically
    console.log('oldRoot block not found exactly as string. Doing regex replace...');
    const rootRegex = /<style id="apple-premium-light-mode">[\s\S]*?:root \{[\s\S]*?\}/;
    content = content.replace(rootRegex, `<style id="apple-premium-light-mode">\n\n:root {\n    --color-profile-header-bg: #FFFFFF;\n    --color-profile-header-text: #1D1D1F;\n    --color-navy: #000000;\n    --color-green: #FF5722;\n    --color-logo-green: #c0fc2a;\n    --color-bg: #F8F9FB;\n    --color-text: #1D1D1F;\n    --color-text-light: #4A5568;\n    --color-border: rgba(0, 0, 0, 0.08);\n    --color-surface: #FFFFFF;\n    --color-text-muted: #86868B;\n    \n    --color-chat-bg: #F3F4F6;\n    --color-chat-bubble-in: #FFFFFF;\n    --color-chat-bubble-out: #FF5722;\n    --color-chat-text-in: #000000;\n    --color-chat-text-out: #FFFFFF;\n    --color-chat-border-in: #E2E8F0;\n}`);
    console.log('Regex :root replaced.');
}

// 2. Replace HTML back buttons with specific close functions
const backButtons = [
    { target: `onclick="document.getElementById('job-offer-overlay').classList.remove('open')"`, replacement: `onclick="closeJobOffer()"` },
    { target: `onclick="document.getElementById('worker-profile-overlay').classList.remove('open')"`, replacement: `onclick="closeWorkerProfileOverlay()"` },
    { target: `onclick="document.getElementById('employer-profile-overlay').classList.remove('open')"`, replacement: `onclick="closeEmployerProfileOverlay()"` },
    { target: `onclick="document.getElementById('notifications-overlay').classList.remove('open')"`, replacement: `onclick="closeNotificationsSheet()"` },
    { target: `onclick="document.getElementById('help-overlay').classList.remove('open')"`, replacement: `onclick="closeHelpSheet()"` },
    { target: `onclick="document.getElementById('privacy-overlay').classList.remove('open')"`, replacement: `onclick="closePrivacySheet()"` },
    { target: `onclick="document.getElementById('terms-overlay').classList.remove('open')"`, replacement: `onclick="closeTermsSheet()"` }
];

backButtons.forEach(btn => {
    if (content.includes(btn.target)) {
        content = content.replace(btn.target, btn.replacement);
        console.log(`Replaced button: ${btn.target}`);
    } else {
        console.warn(`Button target not found: ${btn.target}`);
    }
});

// 3. Replace closeWorkerJobDetail & closeAllActionOverlays and define other close functions
const targetCloseBlock = `        function closeWorkerJobDetail() {
            document.getElementById('worker-action-overlay').style.display = 'none';
        }

        function closeAllActionOverlays() {
            document.querySelectorAll('.action-overlay.active, .settings-overlay.active').forEach(el => {
                el.style.display = 'none';
            });
        }`;

const replacementCloseBlock = `        function closeWorkerJobDetail() {
            const el = document.getElementById('worker-action-overlay');
            if (el) {
                el.classList.remove('active');
                el.classList.remove('open');
                el.style.display = '';
            }
            closeGlobalBackdrop();
        }

        function closeEmployerJobDetail() {
            const el = document.getElementById('employer-action-overlay');
            if (el) {
                el.classList.remove('active');
                el.classList.remove('open');
                el.style.display = '';
            }
            closeGlobalBackdrop();
        }

        function closeAllActionOverlays() {
            document.querySelectorAll('.action-overlay, .settings-overlay').forEach(el => {
                el.classList.remove('active');
                el.classList.remove('open');
                el.style.display = '';
            });
            closeGlobalBackdrop();
        }

        function closeGlobalBackdrop() {
            const backdrop = document.getElementById('global-overlay-backdrop');
            if (backdrop) {
                backdrop.classList.remove('open');
                backdrop.classList.remove('active');
            }
        }

        function closeJobOffer() {
            const el = document.getElementById('job-offer-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }
        function closeWorkerProfileOverlay() {
            const el = document.getElementById('worker-profile-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }
        function closeEmployerProfileOverlay() {
            const el = document.getElementById('employer-profile-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }
        function closeNotificationsSheet() {
            const el = document.getElementById('notifications-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }
        function closeHelpSheet() {
            const el = document.getElementById('help-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }
        function closePrivacySheet() {
            const el = document.getElementById('privacy-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }
        function closeTermsSheet() {
            const el = document.getElementById('terms-overlay');
            if (el) { el.classList.remove('open'); el.classList.remove('active'); el.style.display = ''; }
            closeGlobalBackdrop();
        }`;

if (content.includes(targetCloseBlock)) {
    content = content.replace(targetCloseBlock, replacementCloseBlock);
    console.log('Replaced and defined all close functions.');
} else {
    // Try regex-based replacement for robustness
    const closeRegex = /function closeWorkerJobDetail\(\)[\s\S]*?function closeAllActionOverlays\(\)[\s\S]*?\}\s*\}/;
    if (closeRegex.test(content)) {
        content = content.replace(closeRegex, replacementCloseBlock);
        console.log('Replaced close functions via regex.');
    } else {
        console.warn('Could not find close functions block. Writing at fallback...');
    }
}

// 4. Update openEmployerProfile function to open overlay instantly
const originalOpenFunc = `        async function openEmployerProfile(name, uid) {
            // Find a job associated with this employer to extract general location details`;

const replacementOpenFunc = `        async function openEmployerProfile(name, uid) {
            // Open the overlay instantly
            const el = document.getElementById('employer-profile-overlay');
            if (el) {
                el.style.display = '';
                el.classList.add('open');
                el.classList.add('active');
            }
            const backdrop = document.getElementById('global-overlay-backdrop');
            if (backdrop) {
                backdrop.classList.add('open');
                backdrop.classList.add('active');
            }

            // Find a job associated with this employer to extract general location details`;

if (content.includes(originalOpenFunc)) {
    content = content.replace(originalOpenFunc, replacementOpenFunc);
    console.log('Updated openEmployerProfile to open instantly.');
} else {
    console.warn('Could not find original openEmployerProfile signature.');
}

// 5. Update closeEmployerJobDetail in index.html to use the new closeEmployerJobDetail function
const oldCloseEmployerJobDetail = `        function closeEmployerJobDetail() {
            document.getElementById('employer-action-overlay').style.display = 'none';
        }`;

if (content.includes(oldCloseEmployerJobDetail)) {
    content = content.replace(oldCloseEmployerJobDetail, ''); // remove it since we defined it above
    console.log('Removed duplicate closeEmployerJobDetail.');
}

// 6. Ensure worker-action-overlay close call inside workerApplyToJob uses closeWorkerJobDetail()
const oldWorkerApplyClose = `// Close the job detail overlay first
                document.getElementById('worker-action-overlay').style.display = 'none';`;
const newWorkerApplyClose = `// Close the job detail overlay first
                closeWorkerJobDetail();`;
if (content.includes(oldWorkerApplyClose)) {
    content = content.replace(oldWorkerApplyClose, newWorkerApplyClose);
    console.log('Updated workerApplyToJob overlay close.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Finished applying overlay and theme fixes.');
