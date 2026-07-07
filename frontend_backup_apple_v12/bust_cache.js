const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const cacheBuster = `
    <!-- FORCE CACHE BUSTER -->
    <script>
        if (!localStorage.getItem('melogo_force_update_v4')) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (let registration of registrations) {
                        registration.unregister();
                    }
                });
            }
            if ('caches' in window) {
                caches.keys().then(function(names) {
                    for (let name of names) {
                        caches.delete(name);
                    }
                });
            }
            localStorage.setItem('melogo_force_update_v4', 'true');
            window.location.reload(true);
        }
    </script>
`;

if (!content.includes('melogo_force_update_v4')) {
    content = content.replace('</head>', cacheBuster + '</head>');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cache buster injected!');
} else {
    console.log('Already injected.');
}
