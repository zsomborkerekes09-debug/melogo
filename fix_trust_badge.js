const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    const oldFn = /function calcTrustLevel\([\s\S]*?return { level: 1[\s\S]*?}/;
    const newFn = `function calcTrustLevel(jobCount, rating) {
            if (jobCount >= 15 && rating >= 4.7) return { level: 4, name: 'Prémium', bg: 'var(--color-green)', color: '#000000' };
            if (jobCount >= 8 && rating >= 4.3) return { level: 3, name: 'Tapasztalt', bg: 'rgba(255,255,255,0.2)', color: '#FFFFFF' };
            if (jobCount >= 3 && rating >= 4.0) return { level: 2, name: 'Megbízható', bg: 'rgba(255,255,255,0.15)', color: '#FFFFFF' };
            return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };
        }`;

    html = html.replace(oldFn, newFn);
    
    // Also let's fix the role toggle (Munkás/Megbízó) in case it has hardcoded backgrounds
    // The role toggle HTML:
    /*
    <div style="background-color: white; border-radius: 20px; padding: 2px; display: flex; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    */
    html = html.replace(/<div style="background-color: white; border-radius: 20px; padding: 2px; display: flex; align-items: center; box-shadow: 0 1px 3px rgba\(0,0,0,0.1\);">/g, '<div style="background-color: rgba(255,255,255,0.08); border-radius: 20px; padding: 2px; display: flex; align-items: center;">');

    // And inside the role toggle, the active state had `background-color: var(--color-bg);` which is black, but maybe text was black too?
    // `<div id="role-worker-pill" style="padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; background-color: var(--color-bg); color: var(--color-text); transition: all 0.2s;">Munkás</div>`
    // Wait, var(--color-bg) is black, var(--color-text) is white. That's fine!

    fs.writeFileSync(file, html);
    console.log(`Updated trust badges and role toggle in ${file}`);
});
