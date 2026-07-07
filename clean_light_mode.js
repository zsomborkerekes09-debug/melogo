const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Midnight headers should be light
content = content.replace(/background:\s*#121212/g, 'background: #FFFFFF');
content = content.replace(/background-color:\s*#121212/g, 'background-color: #FFFFFF');
content = content.replace(/background:\s*linear-gradient\(to bottom, #121212 0%, #121212 40%, rgba\(18,18,18,0\) 100%\);/g, 'background: linear-gradient(to bottom, #F8F9FA 0%, #F8F9FA 40%, rgba(248,249,250,0) 100%);');

// White text shouldn't be everywhere in Light Mode
// Let's specifically target classes like .screen, .phone-container etc.
// The CSS vars like --color-text take care of most things.

// Fix bottom nav background
content = content.replace(/\.bottom-nav\s*\{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.05\)[^}]*\}/g, (match) => match.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.05\)/, 'background: rgba(255, 255, 255, 0.9)'));
content = content.replace(/backdrop-filter:\s*blur\(20px\)\s*saturate\(180%\)/g, 'backdrop-filter: blur(20px) saturate(180%)'); // this is fine

fs.writeFileSync(file, content, 'utf8');
console.log('Cleaned up dark mode leftovers');
