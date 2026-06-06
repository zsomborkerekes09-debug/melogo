const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(/<div class="emp-welcome-title" style="text-align: center; width: 100%;">Melo<span style="color:var\(--color-green\)">Go<\/span><\/div>/g, 
`<div class="emp-welcome-title" style="text-align: left; width: 100%; margin-bottom: 24px;"><img src="logo_light.png" alt="MeloGo" style="width: 140px; height: auto; object-fit: contain;"></div>`);
fs.writeFileSync('index.html', c);
