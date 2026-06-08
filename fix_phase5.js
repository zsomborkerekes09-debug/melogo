const fs = require('fs');

function applyFixes() {
    const filePath = 'frontend/index.html';
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const replaceExact = (search, replacement, desc) => {
        if (content.includes(search)) {
            content = content.replace(search, replacement);
            console.log(`[SUCCESS] Applied fix: ${desc}`);
            modified = true;
        } else if (content.includes(search.replace(/\n/g, '\r\n'))) {
            content = content.replace(search.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
            console.log(`[SUCCESS] Applied fix: ${desc} (CRLF matched)`);
            modified = true;
        } else {
            console.warn(`[WARNING] Could not find string for: ${desc}`);
        }
    };

    // 1. Fix apple meta tag
    const searchMeta = `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`;
    const replaceMeta = `<meta name="apple-mobile-web-app-status-bar-style" content="black">`;
    replaceExact(searchMeta, replaceMeta, 'Update apple-mobile-web-app-status-bar-style');

    // 2. Remove chat demo seeding
    const searchChats = `                    // If saved list is empty (from old buggy filter), seed with demos
                    if (localChats.length === 0) {
                        localChats = [
                            { id: 'chat_demo_1', name: 'Kovács Béla', workerName: 'Kovács Béla', employerName: 'Megbízó', jobTitle: 'Fűnyírás', lastMsg: 'Szia! Mikor tudnál jönni?', time: '14:32', isUnread: true, unreadCount: 2, active: true, archived: false },
                            { id: 'chat_demo_2', name: 'Nagy Zsolt', workerName: 'Nagy Zsolt', employerName: 'Megbízó', jobTitle: 'Festés', lastMsg: 'Rendben, holnap 9-re jövök.', time: '10:15', isUnread: false, unreadCount: 0, active: true, archived: false },
                        ];
                        localStorage.setItem('melogo_chats', JSON.stringify(localChats));
                    }`;
    const replaceChats = `                    // Removed demo seed logic so new profiles start with empty chats`;
    replaceExact(searchChats, replaceChats, 'Remove chat demo seeding for parse fallback');

    // Another place where demo chats are seeded (line 9660ish)
    const searchChats2 = `                } else {
                    // Start fresh
                    localChats = [
                        { id: 'chat_demo_1', name: 'Kovács Béla', workerName: 'Kovács Béla', employerName: 'Megbízó', jobTitle: 'Fűnyírás', lastMsg: 'Szia! Mikor tudnál jönni?', time: '14:32', isUnread: true, unreadCount: 2, active: true, archived: false },
                        { id: 'chat_demo_2', name: 'Nagy Zsolt', workerName: 'Nagy Zsolt', employerName: 'Megbízó', jobTitle: 'Festés', lastMsg: 'Rendben, holnap 9-re jövök.', time: '10:15', isUnread: false, unreadCount: 0, active: true, archived: false },
                    ];
                    localStorage.setItem('melogo_chats', JSON.stringify(localChats));
                }`;
    const replaceChats2 = `                } else {
                    localChats = [];
                }`;
    replaceExact(searchChats2, replaceChats2, 'Remove chat demo seeding for new users');

    // 3. Move overlays on init to prevent click blocking due to transform stacking context
    const searchInit = `        // Init
        document.addEventListener('DOMContentLoaded', () => {
            initApp();`;
    const replaceInit = `        // Init
        document.addEventListener('DOMContentLoaded', () => {
            // Relocate overlays out of the slider to fix z-index stacking click blocks
            const phoneApp = document.getElementById('phone-app');
            document.querySelectorAll('.action-overlay, .settings-overlay, .overlay-success, .confirm-sheet').forEach(el => {
                if (el.parentNode !== phoneApp) {
                    phoneApp.appendChild(el);
                }
            });
            
            initApp();`;
    replaceExact(searchInit, replaceInit, 'Relocate overlays out of slider container on DOMContentLoaded');

    // Make sure openJobDetailById can find firestore jobs
    const searchJobDetail = `        function openJobDetailById(jobId) {
            const job = mockJobs.find(j => j.id === jobId);`;
    const replaceJobDetail = `        function openJobDetailById(jobId) {
            const allJobs = [...mockJobs, ...(window.firestoreJobs || [])];
            const job = allJobs.find(j => String(j.id) === String(jobId));`;
    replaceExact(searchJobDetail, replaceJobDetail, 'Allow openJobDetailById to find Firestore jobs');

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('[SUCCESS] All phase 5 fixes written to frontend/index.html');
    }
}
applyFixes();
