const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Login logo: Make it 200px wide and add cache-bust
c = c.replace(/<img src="logo_dark\.png"[^>]*>/g, 
'<img src="logo_dark.png?v=3" alt="MeloGo" style="width: 200px; height: auto; object-fit: contain; margin-bottom: 24px;">');

// Home page logos: Make it 200px wide and add cache-bust
c = c.replace(/<img src="logo_light\.png"[^>]*width:\s*180px[^>]*>/g, 
'<img src="logo_light.png?v=3" alt="MeloGo" style="width: 200px; height: auto; object-fit: contain;">');

// Chat page logos: Make it 56px height and add cache-bust
c = c.replace(/<img src="logo_light\.png"[^>]*height:\s*48px[^>]*>/g, 
'<img src="logo_light.png?v=3" alt="MeloGo" style="height: 56px; width: auto; object-fit: contain;">');

fs.writeFileSync('index.html', c, 'utf8');
console.log('Cache busted and sizes increased!');
