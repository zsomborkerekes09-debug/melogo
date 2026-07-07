const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // 1. Remove the literal '\n' strings
    html = html.replace(/\\n/g, '');

    // 2. Remove the dark mode toggle completely (it was a hardcoded div with position:fixed)
    html = html.replace(/<div style="position:fixed;bottom:110px;right:16px;background:#FFFFFF;color:#000000;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;z-index:99999;box-shadow:0 4px 16px rgba\(255,255,255,0\.2\);">[\s\S]*?<\/div>/g, '');
    html = html.replace(/✦ APPLE PREMIUM SÖTÉT MÓD/g, ''); // Nuke any remnants

    // 3. Fix the "Csak körülnézek" button behavior
    html = html.replace(/classList\.remove\('active'\)/g, "style.display = 'none'");

    // Make the button more elegant (give it a nice subtle pill shape instead of just underlined text)
    const oldBtn = `<button onclick="document.getElementById('app-login-screen').style.display = 'none';" style="background:none; border:none; color:#8E8E93; font-size:14px; font-weight:500; cursor:pointer; text-decoration:underline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; transition: color 0.2s;">
                Csak körülnézek
            </button>`;
    
    const newBtn = `<button onclick="document.getElementById('app-login-screen').style.display = 'none';" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#FFFFFF; font-size:14px; font-weight:500; cursor:pointer; padding: 10px 24px; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);">
                Csak körülnézek
            </button>`;
            
    html = html.replace(oldBtn, newBtn);
    
    // Also try to replace it if it still has the old classList.remove
    const oldBtn2 = `<button onclick="document.getElementById('app-login-screen').classList.remove('active');" style="background:none; border:none; color:#8E8E93; font-size:14px; font-weight:500; cursor:pointer; text-decoration:underline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; transition: color 0.2s;">
                Csak körülnézek
            </button>`;
    html = html.replace(oldBtn2, newBtn);

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
});
