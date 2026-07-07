const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const originalLoginAsGuest = `function loginAsGuest() {
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
        }`;

const newLoginAsGuest = `function loginAsGuest() {
            localStorage.setItem('melogo_guest_mode', 'true');
            if (navigator.vibrate) navigator.vibrate(50);
            
            const screen = document.getElementById('onboarding-screen');
            const loginScreen = document.getElementById('app-login-screen');
            
            if (screen) {
                screen.style.opacity = '0';
                setTimeout(function() {
                    screen.classList.add('hidden');
                    screen.style.display = 'none';
                    screen.style.opacity = '';
                }, 350);
            }
            if (loginScreen) {
                loginScreen.style.opacity = '0';
                setTimeout(function() {
                    loginScreen.classList.add('hidden');
                    loginScreen.style.display = 'none';
                    loginScreen.style.opacity = '';
                }, 350);
            }
            
            setTimeout(function() {
                if (typeof updateAllUserUI === 'function') updateAllUserUI();
                if (typeof updateGreetings === 'function') updateGreetings();
                // Set default mock UI for guest
                document.querySelectorAll('.profile-name-text').forEach(e => e.innerText = 'Vendég');
                // Refresh job list without filters for guest
                if (typeof refreshJobList === 'function') refreshJobList();
            }, 350);
        }`;

code = code.replace(originalLoginAsGuest, newLoginAsGuest);
fs.writeFileSync(path, code);
console.log("Guest login fix applied.");
