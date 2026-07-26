const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

let changed = false;

// 1. msg-filter-pill
if (!content.includes('/* Fix for msg-filter-pill visibility */')) {
    content = content.replace('</style>', `
/* Fix for msg-filter-pill visibility */
.msg-filter-pill.active {
    background-color: var(--color-text) !important;
    color: var(--color-bg) !important;
    border: none !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    font-weight: 500 !important;
}
.msg-filter-pill.inactive {
    background-color: rgba(142, 142, 147, 0.1) !important;
    color: #8E8E93 !important;
    border: none !important;
}
</style>`);
    changed = true;
}

// 2. Jelenlegi helyzet megadva
const locTarget = `btn.innerHTML = '📍 Jelenlegi helyzet megadva';
            btn.style.background = 'rgba(34, 197, 94, 0.1)';
            btn.style.color = 'var(--color-green)';
            btn.style.border = '1px solid rgba(34, 197, 94, 0.2)';`;

const locNew = `btn.innerHTML = '📍 ' + (typeof window.t === 'function' ? window.t('Jelenlegi helyzet megadva') : 'Jelenlegi helyzet megadva');
            btn.style.background = 'rgba(255, 87, 34, 0.1)';
            btn.style.color = '#FF5722';
            btn.style.border = '1px solid rgba(255, 87, 34, 0.2)';`;

if (content.includes(locTarget)) {
    content = content.replace(locTarget, locNew);
    changed = true;
} else {
    console.log('Location target block not found verbatim.');
}

// 3. Day Boxes
const boxTarget = `html += \`
                    <div onclick="setDateFilter('\${isoDate}')" style="min-width: 52px; height: 64px; border-radius: 6px; border: none; background: \${isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box;">
                        <span style="font-size: 11px; font-weight: 300; color: #FFFFFF; margin-bottom: 2px; opacity: \${isActive ? '1' : '0.6'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'};">\${dayName}</span>
                        <span style="font-size: 16px; font-weight: 300; color: #FFFFFF; opacity: \${isActive ? '1' : '0.8'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'}; font-weight: \${isActive ? '500' : '400'};">\${num}</span>
                    </div>
                \`;`;

const boxNew = `html += \`
                    <div onclick="setDateFilter('\${isoDate}')" style="min-width: 52px; height: 76px; border-radius: 8px; border: 1px solid \${isActive ? 'transparent' : 'var(--color-border)'}; background: \${isActive ? 'var(--color-text)' : 'transparent'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box;">
                        <span style="font-size: 11px; font-weight: \${isActive ? '500' : '400'}; color: \${isActive ? 'var(--color-bg)' : 'var(--color-text)'}; margin-bottom: 4px; opacity: \${isActive ? '1' : '0.6'};">\${typeof window.t === 'function' ? window.t(dayName) : dayName}</span>
                        <span style="font-size: 18px; font-weight: \${isActive ? '600' : '400'}; color: \${isActive ? 'var(--color-bg)' : 'var(--color-text)'}; opacity: \${isActive ? '1' : '0.8'};">\${num}</span>
                    </div>
                \`;`;

if (content.includes(boxTarget)) {
    content = content.replace(boxTarget, boxNew);
    changed = true;
} else {
    console.log('Day box target block not found verbatim.');
}

// 4. Translations
if (!content.includes('"Ma": "Today"')) {
    content = content.replace('"Vélemény": "Review", "Vélemények": "Reviews",', `"Vélemény": "Review", "Vélemények": "Reviews",
            "Ma": "Today", "Holnap": "Tomorrow", "V": "Sun", "H": "Mon", "K": "Tue", "Sze": "Wed", "Cs": "Thu", "P": "Fri", "Szo": "Sat",
            "Összes": "All", "Olvasatlan": "Unread", "Jelenlegi helyzet megadva": "Current location provided",`);
    changed = true;
}

if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated index.html with exact matches.');
} else {
    console.log('No changes applied.');
}
