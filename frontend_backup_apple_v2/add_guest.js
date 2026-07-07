const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');
let block = `
        function loginAsGuest() {
            localStorage.setItem('melogo_guest_mode', 'true');
            if (navigator.vibrate) navigator.vibrate(50);
            
            const screen = document.getElementById('onboarding-screen');
            if (screen) {
                screen.style.opacity = '0';
                setTimeout(function() {
                    screen.classList.add('hidden');
                    screen.style.display = 'none';
                    screen.style.opacity = '';
                    if (typeof updateAllUserUI === 'function') updateAllUserUI();
                    if (typeof updateGreetings === 'function') updateGreetings();
                    // Set default mock UI for guest
                    document.querySelectorAll('.profile-name-text').forEach(e => e.innerText = 'Vendég');
                }, 350);
            }
        }
`;
if (code.indexOf('function loginAsGuest()') === -1) {
    code = code.replace('async function loginWithGoogle()', block + '\n        async function loginWithGoogle()');
    fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
    console.log('Added loginAsGuest');
} else {
    console.log('loginAsGuest already exists');
}
