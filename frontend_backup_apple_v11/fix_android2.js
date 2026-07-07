const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

// The replacement logic was flawed. Instead of replacing the whole block, let's just append the options object to the function call.
// The code looks like this:
// navigator.geolocation.getCurrentPosition(
//     async (pos) => { ... },
//     (err) => { ... }
// );
// We can find where the second callback ends and insert the options before the closing parenthesis.

// But wait, it's easier to just do a string replacement.
code = code.replace(/(\(err\) => \{\s*console\.error\(err\);\s*alert\(['"]Helymeghatározás sikertelen[^)]+\);?\s*\})\s*\)/g, '$1, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })');
code = code.replace(/(\(error\) => \{\s*console\.error\(error\);\s*alert\(['"]Helymeghatározás sikertelen[^)]+\);?\s*\})\s*\)/g, '$1, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })');

fs.writeFileSync(path, code);
console.log("Fixes applied successfully.");
