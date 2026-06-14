const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// The login screen is completely hardcoded with #fff and #000000 colors and style attributes
// We need to switch these to CSS variables to support dark mode

// 1. Fix #app-login-screen background
html = html.replace(
    /<div id="app-login-screen" style="([^"]*?)background-color:#fff !important;([^"]*?)">/g,
    '<div id="app-login-screen" style="$1background-color: var(--color-bg) !important;$2">'
);

// 2. Fix MeloGo logo text color
html = html.replace(
    /<div style="font-size:36px; font-weight:800; font-family:'DM Sans',sans-serif; letter-spacing:-1\.5px; color:#000000; width:160px; text-align:center; user-select:none;">Melo<span style="color:var\(--color-green\);">Go<\/span><\/div>/g,
    '<div style="font-size:36px; font-weight:800; font-family:\'DM Sans\',sans-serif; letter-spacing:-1.5px; color:var(--color-text); width:160px; text-align:center; user-select:none;">Melo<span style="color:var(--color-green);">Go</span></div>'
);

// 3. Fix "Hozd létre a fiókodat" subtitle
html = html.replace(
    /<h2 id="login-mode-subtitle" style="font-size:22px; font-weight:500; color:#000000; margin:0; font-family:'DM Sans',sans-serif;">Hozd létre a fiókodat<\/h2>/g,
    '<h2 id="login-mode-subtitle" style="font-size:22px; font-weight:500; color:var(--color-text); margin:0; font-family:\'DM Sans\',sans-serif;">Hozd létre a fiókodat</h2>'
);

// 4. Fix role-pill-worker and role-pill-employer CSS
html = html.replace(
    /\.auth-role-card \{[\s\S]*?color: #4B5563;[\s\S]*?\}/g,
    '.auth-role-card {\n    flex: 1;\n    height: 44px;\n    border-radius: 22px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 15px;\n    font-weight: 500;\n    color: var(--color-text-light);\n    background-color: var(--color-chat-bg);\n    cursor: pointer;\n    transition: all 0.2s ease;\n}'
);

html = html.replace(
    /\.auth-role-card\.active \{[\s\S]*?color: #000000;[\s\S]*?\}/g,
    '.auth-role-card.active {\n    background-color: var(--color-surface);\n    color: var(--color-text);\n    box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}'
);

// 5. Fix inputs CSS
html = html.replace(
    /\.auth-input-field \{[\s\S]*?color: #111827;[\s\S]*?\}/g,
    match => match.replace('color: #111827;', 'color: var(--color-text);').replace('background: #fff;', 'background: var(--color-bg);')
);

// 6. Fix input container border
html = html.replace(
    /\.auth-input-container \{[\s\S]*?border: 1px solid #E5E7EB;[\s\S]*?\}/g,
    match => match.replace('border: 1px solid #E5E7EB;', 'border: 1px solid var(--color-border);').replace('background: #fff;', 'background: var(--color-bg);')
);

// 7. Fix main login button
html = html.replace(
    /<button class="login-btn" id="main-auth-btn" onclick="loginApp\(\)" style="([^"]*?)background-color:#000000; color:#fff;([^"]*?)">/g,
    '<button class="login-btn" id="main-auth-btn" onclick="loginApp()" style="$1background-color:var(--color-text); color:var(--color-bg);$2">'
);

// 8. Fix link colors
html = html.replace(
    /<span style="color:#000000;([^"]*?)">ÁSZF<\/span>/g,
    '<span style="color:var(--color-text);$1">ÁSZF</span>'
);
html = html.replace(
    /<span style="color:#000000;([^"]*?)">Adatkezelési Tájékoztatót<\/span>/g,
    '<span style="color:var(--color-text);$1">Adatkezelési Tájékoztatót</span>'
);
html = html.replace(
    /<span style="color:#000000;([^"]*?)">Elfelejtett jelszó\?<\/span>/g,
    '<span style="color:var(--color-text);$1">Elfelejtett jelszó?</span>'
);
html = html.replace(
    /Nincs még fiókod\? <span style="color:#000000;([^"]*?)">Regisztrálj<\/span>/g,
    'Nincs még fiókod? <span style="color:var(--color-text);$1">Regisztrálj</span>'
);
html = html.replace(
    /Van már fiókod\? <span style="color:#000000;([^"]*?)">Jelentkezz be<\/span>/g,
    'Van már fiókod? <span style="color:var(--color-text);$1">Jelentkezz be</span>'
);

// 9. Fix Google Button
html = html.replace(
    /<button id="google-login-btn" onclick="loginWithGoogle\(\)" style="([^"]*?)background-color:#fff; color:#000000; border:1px solid #e0e0e0;([^"]*?)">/g,
    '<button id="google-login-btn" onclick="loginWithGoogle()" style="$1background-color:var(--color-surface); color:var(--color-text); border:1px solid var(--color-border);$2">'
);

// 10. Fix dropdowns inside js
html = html.replace(
    /color:#000000;(.*?)border-bottom:1px solid #FFFFFF;/g,
    'color:var(--color-text);$1border-bottom:1px solid var(--color-border);'
);

// 11. Fix floating label
html = html.replace(
    /\.floating-label \{[\s\S]*?color: #6B7280;[\s\S]*?\}/g,
    match => match.replace('color: #6B7280;', 'color: var(--color-text-muted);').replace('background: #fff;', 'background: var(--color-bg);')
);

fs.writeFileSync('frontend/index.html', html);
console.log('Fixed login screen hardcoded colors');
