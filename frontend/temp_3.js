
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
    