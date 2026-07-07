const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const fixComplaintsCSS = `
<style id="fix-complaints-css">
    /* 1. Keresőmező javítása: eredeti méret, fekete szöveg, látható keret */
    #home-search-display {
        border: 1px solid rgba(0, 0, 0, 0.2) !important;
        padding: initial !important; /* Revert my padding */
        font-size: initial !important; /* Revert my font size */
        background: transparent !important;
        box-shadow: none !important;
    }
    #home-search-display::placeholder {
        color: #1C1C1E !important; /* Fekete szöveg */
        font-weight: 400 !important;
    }

    /* 2. Helyzet és Távolság: egyforma, eredeti stílus visszahozása (nincs kártya) */
    .gps-location, .distance-pill-btn {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
    }

    /* 3. Egyetlen, egységes kiválasztási effekt (finom sötétedés) */
    .category-btn.active, div[onclick^="setDateFilter"][style*="1px solid"], .filter-pill.active, .employer-pill.active {
        background-color: rgba(0, 0, 0, 0.06) !important; /* Egyforma sötétedés */
        border-radius: 6px !important;
        border-color: transparent !important;
    }

    /* 4. Munka cikkekben a távolság és idő ne legyen fehér */
    .job-badge-loc, .job-badge-time, .job-card-badges span {
        color: #636366 !important;
    }

    /* 5. Térkép visszasötétítése (törlöm a filter:none-t) */
    #app-map, .map-container, iframe {
        filter: invert(90%) hue-rotate(180deg) !important;
        -webkit-filter: invert(90%) hue-rotate(180deg) !important;
    }

    /* 6. Üzenetek visszaállítása az eredeti sötét fejlécbe, de zöld nélkül */
    .msg-midnight-header {
        background: #111815 !important; /* Eredeti sötét szín */
    }
    .msg-midnight-header .brand-logo {
        color: #fff !important; /* Eredeti fehér szöveg */
    }
    .msg-midnight-header .brand-logo span {
        color: #FF5722 !important; /* Zöld helyett narancs */
        text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5) !important;
    }
    /* Olvasatlan pötty megtartása, de elegánsabban */
    .msg-filter-pill.inactive { background: transparent !important; color: #8E8E93 !important; }

    /* 7. Profil szerepváltás (Munkás/Megbízó) csúnya sárga háttér eltüntetése */
    .role-toggle-btn.active { background: transparent !important; color: #1C1C1E !important; }
    .role-toggle-btn { color: #8E8E93 !important; }
</style>
`;

// Remove the previous bad CSS blocks entirely to start clean for these components
content = content.replace(/<style id="refinements-css">[\s\S]*?<\/style>/, '');
content = content.replace(/<style id="profile-tiny-fix">[\s\S]*?<\/style>/, '');

if (content.includes('<style id="fix-complaints-css">')) {
    content = content.replace(/<style id="fix-complaints-css">[\s\S]*?<\/style>/, '');
}
content = content.replace(/<\/head>/, fixComplaintsCSS + '</head>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed complaints!');
