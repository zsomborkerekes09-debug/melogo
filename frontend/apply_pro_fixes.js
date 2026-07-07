const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const proFixCSS = `
<style id="pro-fixes-css">
    /* 1. Köszöntő keret (Jó estét, kk!) */
    .welcome-text {
        background: rgba(0, 0, 0, 0.04) !important;
        padding: 6px 14px !important;
        border-radius: 12px !important;
        border: 1px solid rgba(0, 0, 0, 0.08) !important;
        display: inline-block !important;
        margin-top: 8px !important;
    }

    /* 2. Helyzet & Távolság pontos egymás alá igazítása és közelítése */
    .gps-location span:nth-child(2), #distance-pill span:nth-child(2) {
        width: 60px !important; /* Lecsökkentve a hatalmas űrt */
        display: inline-block !important;
    }
    #distance-pill {
        margin-top: 6px !important; /* Hogy szépen a Helyzet alatt legyen */
    }

    /* 3. Egységes kiválasztás mindenhol (ugyanaz a sötét háttér) */
    .category-btn.active, 
    div[onclick^="setDateFilter"][style*="0.15"], 
    div[onclick^="setDateFilter"][style*="rgba(255, 255, 255, 0.15)"],
    .filter-pill.active, 
    .employer-pill.active, 
    .sort-pill.active {
        background-color: rgba(0, 0, 0, 0.08) !important;
        color: #1C1C1E !important;
        border-radius: 6px !important;
        border: none !important;
    }

    /* 4. Munkahirdetés kártyák szövegeinek középre húzása (ne csússzanak le) */
    .job-card {
        padding: 16px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
    }
    .job-card h3 {
        margin-top: 0 !important;
    }

    /* 6. Üzenetek: Go neon színűre */
    .msg-midnight-header .brand-logo span {
        color: #c0fc2a !important; /* Neon zöld */
    }

    /* 7. Üzenetek: Olvasatlan gomb aljának javítása (ne legyen levágva) */
    .msg-filter-pill {
        height: auto !important;
        line-height: normal !important;
        padding: 6px 14px !important;
        border-radius: 20px !important;
        box-sizing: border-box !important;
    }

    /* 8. Üzenetek: "Még nincs üzeneted" alatti szöveg feketére */
    #app-messages-screen p, #app-messages-screen .empty-state-subtext, #app-messages-screen div[style*="Jelentkezz"] {
        color: #1C1C1E !important;
        opacity: 0.8 !important;
    }

    /* 9. Profil: Szerepválasztó (Munkás/Megbízó) sötét dobozának világosítása */
    .segmented-control {
        background: rgba(0, 0, 0, 0.06) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        padding: 4px !important;
    }
    .role-toggle-btn {
        color: #636366 !important;
    }
    .role-toggle-btn.active {
        background: #FFFFFF !important;
        color: #1C1C1E !important;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1) !important;
    }
</style>
`;

// Remove previous CSS blocks if they exist to prevent conflicts
content = content.replace(/<style id="pro-fixes-css">[\s\S]*?<\/style>/, '');

// Append new CSS
content = content.replace(/<\/head>/, proFixCSS + '</head>');

// 5. Térkép javítása: lecseréljük a hibás CartoDB URL-t egy stabil OSM világos térképre
content = content.replace(/https:\/\/{s}\.basemaps\.cartocdn\.com\/light_all\/{z}\/{x}\/{y}\{r\}\.png/g, 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied professional layout fixes!');
