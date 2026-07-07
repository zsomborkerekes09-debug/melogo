const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const refineCSS = `
<style id="refinements-css">
    /* 1. Köszöntő üzenet ("Szia, kk!") */
    .welcome-text {
        background: rgba(0, 0, 0, 0.05) !important;
        padding: 6px 14px !important;
        border-radius: 20px !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
    }

    /* 2. Keresőmező ("Milyen munkát keresel?") */
    #home-search-display {
        border: 1px solid rgba(0, 0, 0, 0.15) !important;
        background: rgba(255, 255, 255, 0.6) !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.02) !important;
    }
    #home-search-display::placeholder {
        color: #555555 !important;
        font-weight: 500 !important;
    }

    /* 3. Helyzet és Távolság feliratok */
    .gps-location, .distance-pill-btn {
        background: rgba(255, 255, 255, 0.5) !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        border: 1px solid rgba(0, 0, 0, 0.08) !important;
        color: #1C1C1E !important;
        display: flex !important;
        align-items: center !important;
    }
    .gps-location span, .distance-pill-btn span {
        color: #1C1C1E !important;
        font-weight: 500 !important;
    }

    /* 4. Kiválasztott szűrők elsötétítése (Narancs/Szürke háttér) */
    .category-btn.active, div[onclick^="setDateFilter"][style*="1px solid"], .filter-pill.active, .employer-pill.active {
        background-color: rgba(255, 87, 34, 0.1) !important;
        border-radius: 6px !important;
    }

    /* 5. "Minden feladat" fekete gomb javítása */
    select {
        background-color: rgba(255, 255, 255, 0.7) !important;
        color: #1C1C1E !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
    }

    /* 6. Térkép világosabbá tétele (invert filter eltávolítása, ha volt) */
    #app-map, .map-container, iframe {
        filter: none !important;
        -webkit-filter: none !important;
    }

    /* 7. Üzenetek zöld szín lecserélése */
    #worker-chat-room > div:first-child, #employer-chat-room > div:first-child {
        background: #F5F5F7 !important;
        color: #1C1C1E !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
    }
    #worker-chat-room > div:first-child *, #employer-chat-room > div:first-child * {
        color: #1C1C1E !important;
    }

    /* 8. Olvasatlan sárga keret -> Elegáns narancs pötty */
    .msg-item[style*="border-left"] {
        border-left: none !important;
        background: rgba(255,87,34,0.05) !important;
    }
    /* Elrejtjük az eredeti sárga/zöld pöttyöket */
    .msg-unread-dot {
        background: #FF5722 !important;
    }

    /* 9. Üzenetek olvashatóság */
    .msg-item {
        color: #1C1C1E !important;
    }
    .msg-item * {
        color: inherit !important;
    }
    .msg-item span[style*="color:"] {
        color: #636366 !important;
    }
    .chat-body {
        background: #DCDCE0 !important;
    }
    .message.received, .message[style*="background: var(--color-surface)"] {
        background: rgba(255,255,255,0.8) !important;
        color: #1C1C1E !important;
    }
    .message.sent, .message[style*="background: var(--color-green)"] {
        background: #FF5722 !important;
        color: #FFFFFF !important;
    }

    /* 10. Profil ragadt fehér feliratok */
    #worker-profile-overlay, #employer-profile-overlay, #worker-profile-modal, #employer-profile-modal {
        background: #DCDCE0 !important;
    }
    #worker-profile-overlay *, #employer-profile-overlay *, #worker-profile-modal *, #employer-profile-modal * {
        color: #1C1C1E !important;
    }
    .profile-name, .profile-desc {
        color: #1C1C1E !important;
    }
    
    /* Felülíró szabály a JS inline stílusokra a profilban */
    div[style*="background: var(--color-bg)"] {
        background: transparent !important;
    }
    div[style*="background: var(--color-surface)"] {
        background: rgba(255,255,255,0.5) !important;
    }

    /* 11. Értékelések és elvégzett munkák SÁRGA színűre */
    .stat-value {
        color: #FFC107 !important;
        font-weight: 700 !important;
    }
    .profile-stats svg {
        stroke: #FFC107 !important;
        fill: #FFC107 !important;
    }
    #worker-profile-modal div[style*="color: var(--color-green)"],
    #employer-profile-modal div[style*="color: var(--color-green)"] {
        color: #FFC107 !important;
    }
</style>
`;

if (content.includes('<style id="refinements-css">')) {
    content = content.replace(/<style id="refinements-css">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, refineCSS + '</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('UI Refinements applied successfully!');
