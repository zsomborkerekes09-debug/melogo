const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const polyfill = `
    <script>
        // Polyfill to force Capacitor Geolocation
        window.addEventListener('load', () => {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation) {
                console.log("Using Capacitor Native Geolocation");
                navigator.geolocation.getCurrentPosition = function(success, error, options) {
                    options = options || { enableHighAccuracy: true, timeout: 10000 };
                    window.Capacitor.Plugins.Geolocation.getCurrentPosition(options)
                        .then(pos => success(pos))
                        .catch(err => {
                            console.error("Capacitor Geolocation Error", err);
                            if(error) error(err);
                        });
                };
            } else {
                console.log("Using standard Web Geolocation");
                const originalGet = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
                navigator.geolocation.getCurrentPosition = function(success, error, options) {
                    options = options || { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
                    originalGet(success, error, options);
                };
            }
        });
    </script>
`;

code = code.replace('<script src="https://unpkg.com/geofire-common@5.2.0/dist/geofire-common/geofire-common.min.js" defer></script>', 
    '<script src="https://unpkg.com/geofire-common@5.2.0/dist/geofire-common/geofire-common.min.js" defer></script>\n' + polyfill);

fs.writeFileSync(path, code);
console.log("Geolocation polyfill injected!");
