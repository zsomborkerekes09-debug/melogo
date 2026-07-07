const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

const guestButtonHTML = `
        <!-- Guest Mode Button -->
        <div style="margin-top:12px; text-align:center;">
            <button onclick="document.getElementById('app-login-screen').classList.remove('active');" style="background:none; border:none; color:#8E8E93; font-size:14px; font-weight:500; cursor:pointer; text-decoration:underline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; transition: color 0.2s;">
                Csak körülnézek
            </button>
        </div>
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Remove stray \n \n \n texts if they accidentally made it into the raw HTML somehow
    html = html.replace(/\\n \\n /g, '');

    // Add the "Csak körülnézek" button
    html = html.replace(/<!-- Guest Mode Button -->[\s\S]*?<div style="margin-top: 16px; text-align: center; font-size: 11px;/, guestButtonHTML + '\n        <div style="margin-top: 16px; text-align: center; font-size: 11px;');

    // Remove the dark mode toggle completely
    html = html.replace(/<div id="dark-mode-toggle"[\s\S]*?<\/div>\s*<\/div>/g, '');
    html = html.replace(/<div id="dark-mode-toggle"[\s\S]*?<\/div>/g, '');

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
});
