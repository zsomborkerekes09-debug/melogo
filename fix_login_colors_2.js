const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// I missed a few color:#000000 strings because of slight regex mismatch in the previous replace calls.
// Let's do a more robust replacement for the remaining ones on the login screen.

html = html.replace(/<span style="color:#000000; font-weight:600; text-decoration:underline;" onclick="event\.stopPropagation\(\); alert\('MeloGo ÁSZF megnyitása\.\.\.'\)">ÁSZF<\/span>/g, '<span style="color:var(--color-text); font-weight:600; text-decoration:underline;" onclick="event.stopPropagation(); alert(\'MeloGo ÁSZF megnyitása...\')">ÁSZF</span>');

html = html.replace(/<span style="color:#000000; font-weight:600; text-decoration:underline;" onclick="event\.stopPropagation\(\); alert\('MeloGo Adatkezelési Tájékoztató megnyitása\.\.\.'\)">Adatkezelési Tájékoztatót<\/span>/g, '<span style="color:var(--color-text); font-weight:600; text-decoration:underline;" onclick="event.stopPropagation(); alert(\'MeloGo Adatkezelési Tájékoztató megnyitása...\')">Adatkezelési Tájékoztatót</span>');

html = html.replace(/<span style="color:#000000; font-size:12px; font-weight:500; cursor:pointer;"/g, '<span style="color:var(--color-text); font-size:12px; font-weight:500; cursor:pointer;"');

html = html.replace(/<span style="color:#000000; font-weight:600; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode\(\)">Jelentkezz be<\/span>/g, '<span style="color:var(--color-text); font-weight:600; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Jelentkezz be</span>');

html = html.replace(/<span style="color:#000000; font-weight:600; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode\(\)">Regisztrálj<\/span>/g, '<span style="color:var(--color-text); font-weight:600; text-decoration:underline; cursor:pointer;" onclick="toggleAuthMode()">Regisztrálj</span>');

fs.writeFileSync('frontend/index.html', html);
console.log('Fixed remaining login screen colors');
