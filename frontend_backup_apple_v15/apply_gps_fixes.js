const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const wrapperScript = `
        // GPS Wrapper to prevent hanging
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
        navigator.geolocation.getCurrentPosition = function(successCallback, errorCallback, options) {
            const defaultOptions = { timeout: 6000, enableHighAccuracy: false, maximumAge: 60000 };
            const mergedOptions = { ...defaultOptions, ...options };
            
            let isResolved = false;
            
            const wrappedSuccess = (pos) => {
                if (isResolved) return;
                isResolved = true;
                successCallback(pos);
            };
            
            const wrappedError = (err) => {
                if (isResolved) return;
                isResolved = true;
                console.warn("GPS Error: ", err);
                // Fake a default Budapest position so the app doesn't hang
                wrappedSuccess({
                    coords: {
                        latitude: 47.4979, 
                        longitude: 19.0402,
                        accuracy: 1000
                    }
                });
            };

            // Enforce a hard timeout just in case the native API hangs completely
            setTimeout(() => {
                wrappedError({ code: 3, message: 'Timeout' });
            }, mergedOptions.timeout + 500);

            originalGetCurrentPosition(wrappedSuccess, errorCallback || wrappedError, mergedOptions);
        };
`;

if (!content.includes('originalGetCurrentPosition')) {
    content = content.replace('// Expose to global window object', wrapperScript + '\n        // Expose to global window object');
}

fs.writeFileSync(file, content, 'utf8');
console.log('GPS Fixes applied successfully!');
