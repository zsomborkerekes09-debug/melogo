const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Soft Dark Mode colors (Neutral grays instead of pure blacks or blues)
    
    // CSS Variables block 1
    content = content.replace(/--color-bg:\s*#000000\s*!important;/g, '--color-bg: #121212 !important;');
    content = content.replace(/--color-surface:\s*#1C1C1E\s*!important;/g, '--color-surface: #1E1E1E !important;');
    content = content.replace(/--color-navy:\s*#000000\s*!important;/g, '--color-navy: #121212 !important;');
    content = content.replace(/--color-chat-bg:\s*#000000\s*!important;/g, '--color-chat-bg: #121212 !important;');
    
    // Specific Apple iOS 15 reset block (around line 3314)
    content = content.replace(/--color-border:\s*rgba\(84,84,88,0\.35\)\s*!important;/g, '--color-border: #2A2A2A !important;');
    content = content.replace(/--color-chat-bubble-in:\s*#1C1C1E\s*!important;/g, '--color-chat-bubble-in: #1E1E1E !important;');
    content = content.replace(/--color-chat-border-in:\s*#333336\s*!important;/g, '--color-chat-border-in: #2A2A2A !important;');
    // We keep --color-chat-bubble-out as #0066CC ? User said "szürkét használj ne sötétkéket" (use gray not dark blue)
    // The user probably meant the general dark blue tint that sometimes #1C1C1E or pure black might give off, or the apple blue.
    // Let's change the chat bubble out to neon green to match the brand!
    content = content.replace(/--color-chat-bubble-out:\s*#0066CC\s*!important;/g, '--color-chat-bubble-out: var(--color-green) !important;');
    content = content.replace(/--color-chat-text-out:\s*#FFFFFF\s*!important;/g, '--color-chat-text-out: #000000 !important;');
    
    // JS Theme logic replacements
    content = content.replace(/root\.style\.setProperty\('--color-bg',\s*'#000000'\);/g, "root.style.setProperty('--color-bg', '#121212');");
    content = content.replace(/document\.body\.style\.background\s*=\s*'#000000';/g, "document.body.style.background = '#121212';");
    content = content.replace(/root\.style\.setProperty\('--color-chat-bg',\s*'#000000'\);/g, "root.style.setProperty('--color-chat-bg', '#121212');");
    content = content.replace(/root\.style\.setProperty\('--color-surface',\s*'#1C1C1E'\);/g, "root.style.setProperty('--color-surface', '#1E1E1E');");

    // Also change #000000 backgrounds in phone-container if it's there
    content = content.replace(/background-color:\s*#000000/g, 'background-color: #121212');
    
    // Fix gradients that might use #1C1C1E or #000000
    content = content.replace(/linear-gradient\([^)]*#1C1C1E[^)]*\)/g, (match) => match.replace(/#1C1C1E/g, '#1E1E1E').replace(/#000000/g, '#121212'));

    // Write back
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed soft dark mode in ' + file);
});
