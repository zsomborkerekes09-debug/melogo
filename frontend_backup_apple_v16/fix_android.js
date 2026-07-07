const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

// Fix 1: Google Auth Domain (Firebase Android WebView Storage Partitioning Fix)
code = code.replace(/authDomain:\s*["']melogo-app\.firebaseapp\.com["']/g, 'authDomain: "melogo-app.web.app"');

// Fix 2: GPS options
code = code.replace(
    /navigator\.geolocation\.getCurrentPosition\(\s*async\s*\(pos\)\s*=>\s*\{([\s\S]*?)\},\s*\(err\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g,
    'navigator.geolocation.getCurrentPosition(async (pos) => {$1}, (err) => {$2}, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })'
);

code = code.replace(
    /navigator\.geolocation\.getCurrentPosition\(\s*async\s*\(pos\)\s*=>\s*\{([\s\S]*?)\},\s*\(error\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g,
    'navigator.geolocation.getCurrentPosition(async (pos) => {$1}, (error) => {$2}, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })'
);

fs.writeFileSync(path, code);
console.log("Fixes applied successfully.");
