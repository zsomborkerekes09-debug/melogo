const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Fix bottom-nav and blur containers
content = content.replace(/rgba\(20,\s*20,\s*22,\s*0\.8\)/g, 'rgba(255, 255, 255, 0.9)');
content = content.replace(/rgba\(28,\s*28,\s*30,\s*0\.85\)/g, 'rgba(255, 255, 255, 0.9)');
content = content.replace(/rgba\(35,\s*35,\s*38,\s*0\.9\)/g, 'rgba(255, 255, 255, 0.9)');
content = content.replace(/rgba\(45,\s*45,\s*48,\s*0\.8\)/g, 'rgba(255, 255, 255, 0.9)');
content = content.replace(/rgba\(28,\s*28,\s*30,\s*0\.6\)/g, 'rgba(255, 255, 255, 0.9)');

// Fix white semi-transparent backgrounds that are invisible on light mode
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[456]\)\s*!important/g, 'background: rgba(0, 0, 0, 0.03) !important');
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.08\)\s*!important/g, 'background: rgba(0, 0, 0, 0.05) !important');
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.1[025]\)\s*!important/g, 'background: rgba(0, 0, 0, 0.05) !important');
content = content.replace(/background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.08\)\s*!important/g, 'background-color: rgba(0, 0, 0, 0.05) !important');
content = content.replace(/background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.1[25]\)\s*!important/g, 'background-color: rgba(0, 0, 0, 0.05) !important');

// Fix forced white text that becomes invisible on white backgrounds
content = content.replace(/color:\s*#FFFFFF\s*!important;/g, 'color: var(--color-text) !important;');
content = content.replace(/color:\s*#fff\s*!important;/g, 'color: var(--color-text) !important;');
content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.7\)\s*!important;/g, 'color: var(--color-text-muted) !important;');

// Fix profile header and fallback avatars which were #000000
content = content.replace(/background-color:\s*#000000;\s*padding:\s*40px\s*20px\s*80px\s*20px;/g, 'background-color: var(--color-surface); padding: 40px 20px 80px 20px;');

// Avatars with #000000 -> #10B981 (Emerald) or var(--color-text)
content = content.replace(/background-color:\s*#000000;\s*color:\s*white;/g, 'background-color: var(--color-text); color: white;');
content = content.replace(/background-color:\s*#000000;\s*display:\s*flex;/g, 'background-color: var(--color-text); display: flex;');

fs.writeFileSync(file, content, 'utf8');
console.log('Purged Light Mode conflicts!');
