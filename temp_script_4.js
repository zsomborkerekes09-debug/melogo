
        // Smooth swipe-to-go-back listener for settings and chat overlays
        (function() {
            document.addEventListener('touchstart', handleSwipeStart, {passive: true});
            document.addEventListener('touchend', handleSwipeEnd, {passive: true});
            let swipeStartX = 0;
            let swipeStartY = 0;

            function handleSwipeStart(e) {
                swipeStartX = e.changedTouches[0].screenX;
                swipeStartY = e.changedTouches[0].screenY;
            }

            function handleSwipeEnd(e) {
                const swipeEndX = e.changedTouches[0].screenX;
                const swipeEndY = e.changedTouches[0].screenY;
                // Check if swipe started from the left edge (<= 40px)
                if (swipeStartX <= 40) {
                    const deltaX = swipeEndX - swipeStartX;
                    const deltaY = Math.abs(swipeEndY - swipeStartY);
                    
                    // If horizontal swipe is long enough and vertical swipe is minimal
                    if (deltaX > 50 && deltaY < 50) {
                        // Find active overlays
                        const overlays = document.querySelectorAll('.settings-overlay.open, .settings-overlay.active, #chat-detail-overlay');
                        for (let el of overlays) {
                            // For chat overlay
                            if (el.id === 'chat-detail-overlay' && el.classList.contains('open')) {
                                if (typeof closeChatRoom === 'function') closeChatRoom();
                                return;
                            } else if (el.classList.contains('open') || el.classList.contains('active')) {
                                // Map overlays to their close functions
                                if (el.id === 'worker-settings' && typeof closeWorkerSettings === 'function') closeWorkerSettings();
                                else if (el.id === 'employer-form-overlay' && typeof closeEmployerForm === 'function') closeEmployerForm();
                                else if (el.id === 'job-offer-overlay' && typeof closeJobOffer === 'function') closeJobOffer();
                                else if (el.id === 'worker-profile-overlay' && typeof closeWorkerProfileOverlay === 'function') closeWorkerProfileOverlay();
                                else if (el.id === 'employer-profile-overlay' && typeof closeEmployerProfileOverlay === 'function') closeEmployerProfileOverlay();
                                else if (el.id === 'notifications-overlay' && typeof closeNotificationsSheet === 'function') closeNotificationsSheet();
                                else if (el.id === 'help-overlay' && typeof closeHelpSheet === 'function') closeHelpSheet();
                                else if (el.id === 'privacy-overlay' && typeof closePrivacySheet === 'function') closePrivacySheet();
                                else if (el.id === 'terms-overlay' && typeof closeTermsSheet === 'function') closeTermsSheet();
                                return;
                            }
                        }
                    }
                }
            }
        })();
    