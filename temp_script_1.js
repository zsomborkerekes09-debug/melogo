
        if (!localStorage.getItem('melogo_force_update_v5')) {
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
            localStorage.setItem('melogo_force_update_v5', 'true');
            window.location.reload(true);
        }
    