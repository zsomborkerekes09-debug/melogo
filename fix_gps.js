const fs = require('fs');
const indexFile = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let html = fs.readFileSync(indexFile, 'utf8');

const universalPosFunc = `
window.getUniversalPosition = async function(onSuccess, onError, options) {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation) {
        try {
            let perm = await window.Capacitor.Plugins.Geolocation.checkPermissions();
            if (perm.location !== 'granted') {
                perm = await window.Capacitor.Plugins.Geolocation.requestPermissions();
            }
            if (perm.location !== 'granted') {
                if (onError) onError(new Error("Engedely megtagadva"));
                return;
            }
            const pos = await window.Capacitor.Plugins.Geolocation.getCurrentPosition({ enableHighAccuracy: true });
            onSuccess({ coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } });
        } catch (e) {
            if (onError) onError(e);
        }
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
    } else {
        if (onError) onError(new Error("Nem tamogatott"));
    }
};
`;

// Insert it right after <script> tags or before any initGPS function
if (!html.includes('window.getUniversalPosition = async function')) {
    html = html.replace('function initGPS() {', universalPosFunc + '\nfunction initGPS() {');
}

// Replace all navigator.geolocation.getCurrentPosition
html = html.replace(/navigator\.geolocation\.getCurrentPosition/g, 'window.getUniversalPosition');

fs.writeFileSync(indexFile, html);
console.log("Geolocation fixes applied successfully.");
