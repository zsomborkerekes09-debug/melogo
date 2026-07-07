const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const finalCheckCSS = `
<style id="final-checklist-css">
    /* 1. "Minden feladat felirat fura kicsit abba a feket dobozba" -> Fekete doboz eltávolítása, világos stílus */
    #worker-job-filter-display {
        background: rgba(255, 255, 255, 0.6) !important;
        color: #1C1C1E !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
    }

    /* 2. "Térkép világosabb legyen" -> Világos (eredeti) Google Maps, eltüntetjük az invert filtert */
    #app-map, .map-container, iframe {
        filter: none !important;
        -webkit-filter: none !important;
    }

    /* 3. "És nem annyira olvasható az üzenetek oldal" -> Olvashatóbb chat buborékok és listák */
    .msg-item, .chat-item {
        color: #1C1C1E !important;
        background: rgba(255,255,255,0.5) !important;
        border-bottom: 1px solid rgba(0,0,0,0.05) !important;
    }
    .msg-item * {
        color: #1C1C1E !important;
    }
    .msg-item span[style*="color"] {
        color: #636366 !important;
    }
    .chat-body, #app-messages-screen {
        background: #DCDCE0 !important;
    }
    .message.received {
        background: rgba(255,255,255,0.9) !important;
        color: #1C1C1E !important;
    }
    .message.sent, .message[style*="background: var(--color-green)"] {
        background: #FF5722 !important;
        color: #FFFFFF !important;
    }

    /* 4. "Profilnál fehérek a feliratok amiknek feketének kéne lenniük" -> Biztosra megyünk */
    #app-profile-screen, #worker-profile-overlay, #employer-profile-overlay {
        background: #DCDCE0 !important;
    }
    .profile-name, .profile-desc, .profile-section * {
        color: #1C1C1E !important;
    }
    /* De a profil képben (avatar) maradjon fehér a betű */
    .avatar { color: #ffffff !important; }
</style>
`;

if (content.includes('<style id="final-checklist-css">')) {
    content = content.replace(/<style id="final-checklist-css">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, finalCheckCSS + '</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Final checklist applied!');
