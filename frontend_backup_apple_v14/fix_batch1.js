const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// BUG-05: safeSetItem
const safeSetItemFunc = `
        function safeSetItem(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    console.warn('Local storage full, clearing non-essential caches');
                    localStorage.removeItem('melogo_local_chats');
                    localStorage.removeItem('melogo_worker_applications');
                    try { localStorage.setItem(key, value); } catch (e2) { console.error('Still full', e2); }
                }
            }
        }
`;
if (!html.includes('function safeSetItem')) {
    html = html.replace('<script>', '<script>\n' + safeSetItemFunc);
}

// BUG-01: XSS Vulnerability
const escapeHtmlFunc = `
        function escapeHTML(str) {
            if (!str) return '';
            let s = str.replace(/[&<>'"]/g, tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
            // Restore safe location links if matched perfectly
            s = s.replace(/&lt;a href=&quot;(https:\\/\\/www\\.google\\.com\\/maps\\/dir\\/\\?api=1&amp;destination=[^&]+)&quot; target=&quot;_blank&quot; style=&quot;color:#2563EB; text-decoration:underline;&quot;&gt;📍 Helyszín megnyitása&lt;\\/a&gt;/g, '<a href="$1" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>');
            return s;
        }
`;
if (!html.includes('function escapeHTML')) {
    html = html.replace('<script>', '<script>\n' + escapeHtmlFunc);
}

// Replace innerHTML assignments
html = html.replace(/bubble\.innerHTML = msg\.text \+ `/g, 'bubble.innerHTML = escapeHTML(msg.text) + `');
html = html.replace(/bubble\.innerHTML = msg\.text \+ \(/g, 'bubble.innerHTML = escapeHTML(msg.text) + (');
html = html.replace(/bubble\.innerHTML = msg\.text;/g, 'bubble.innerHTML = escapeHTML(msg.text);');


// BUG-12: iPhone Safe Area Overlap
html = html.replace(/\.action-sheet \{/g, '.action-sheet {\n            padding-bottom: env(safe-area-inset-bottom);');
html = html.replace(/\.bottom-sheet \{/g, '.bottom-sheet {\n            padding-bottom: env(safe-area-inset-bottom);');

// BUG-14: History API
const historyApiFunc = `
        window.addEventListener('popstate', (e) => {
            const openModals = document.querySelectorAll('.bottom-sheet.active, .action-sheet.active, .settings-overlay.active, .action-overlay.active');
            if (openModals.length > 0) {
                if (typeof closeWorkerJobDetail === 'function') closeWorkerJobDetail();
                if (typeof closeEmployerAdDetailNew === 'function') closeEmployerAdDetailNew();
                if (typeof closeEmployerChatRoom === 'function') closeEmployerChatRoom();
                if (typeof closeWorkerChatRoom === 'function') closeWorkerChatRoom();
                if (typeof closeMsgActionSheet === 'function') closeMsgActionSheet();
                if (typeof closeProfileOverlay === 'function') closeProfileOverlay();
            }
        });
        function pushModalState() {
            history.pushState({ modal: true }, '');
        }
`;
if (!html.includes('popstate')) {
    html = html.replace('<script>', '<script>\n' + historyApiFunc);
}

html = html.replace(/const wDetail = document\.getElementById\('worker-job-detail'\);\s*wDetail\.classList\.add\('active'\);/g, "const wDetail = document.getElementById('worker-job-detail');\n            wDetail.classList.add('active');\n            pushModalState();");
html = html.replace(/document\.getElementById\('employer-ad-detail-new'\)\.classList\.add\('active'\);/g, "document.getElementById('employer-ad-detail-new').classList.add('active');\n            pushModalState();");

fs.writeFileSync('index.html', html, 'utf8');
console.log('Batch 1 done');
