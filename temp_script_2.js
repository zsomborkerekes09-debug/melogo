
        let globalSnackbarTimeout = null;
        window.alert = function(msg) {
            const snackbar = document.getElementById('global-snackbar');
            const text = document.getElementById('global-snackbar-text');
            if (!snackbar || !text) {
                console.warn('Alert called but snackbar not found:', msg);
                return;
            }
            text.innerText = msg;
            snackbar.style.bottom = '24px';
            if (globalSnackbarTimeout) clearTimeout(globalSnackbarTimeout);
            globalSnackbarTimeout = setTimeout(() => {
                snackbar.style.bottom = '-100px';
            }, 3500);
        };
    