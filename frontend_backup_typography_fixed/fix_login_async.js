const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// The error on the user's screen is: undefined is not an object (evaluating 'window.firebaseAPI.createUserWithEmailAndPassword')
// This happens when loginApp() is called for registration, but window.firebaseAPI is undefined.
// WHY is window.firebaseAPI undefined? 
// Because the module script that sets window.firebaseAPI might not have finished loading/executing, 
// OR it crashed (syntax error) before it reached window.firebaseAPI = {...}
// We just fixed a syntax error. BUT maybe the button is pressed too early, or there's another error preventing execution.
// To be safe, we must ensure loginApp is marked as async AND waits for firebaseAPI.

const newLoginAppStart = `async function loginApp() {
            clearLoginError();
            clearAllInputErrors();
            var role = loginSelectedRole || 'worker';
            var btn = document.getElementById('main-auth-btn');
            
            // Wait for Firebase API to be ready (module loading)
            if (!window.firebaseAPI) {
                if (btn) { btn.disabled = true; btn.innerText = 'Töltés...'; }
                showLoginError('A rendszer töltődik, kérlek várj egy pillanatot...');
                setTimeout(loginApp, 1000);
                return;
            }
`;

content = content.replace(/function loginApp\(\) \{\s*clearLoginError\(\);\s*clearAllInputErrors\(\);\s*var role = loginSelectedRole \|\| 'worker';\s*var btn = document\.getElementById\('main-auth-btn'\);/, newLoginAppStart);

// Let's also fix the duplicate "var originalFilterWorkerJobs" that we created earlier, just to be clean.
content = content.replace(/var originalFilterWorkerJobs = window\.originalFilterWorkerJobs \|\| window\.filterWorkerJobs;/g, 'var originalFilterWorkerJobs = window.filterWorkerJobs;');


fs.writeFileSync(file, content, 'utf8');
console.log("Fixed missing async on loginApp and added safety check for window.firebaseAPI");
