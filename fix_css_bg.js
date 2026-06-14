const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// The login screen is still using white CSS classes that override the inline variables we set earlier.
// We need to fix the CSS rules themselves.

html = html.replace(
    /#app-login-screen \{[\s\S]*?background-color: #fff;[\s\S]*?\}/g,
    match => match.replace('background-color: #fff;', 'background-color: var(--color-bg);')
);

// We should also replace the few remaining background-color: #fff; in the CSS block, because they mess up dark mode globally anyway
html = html.replace(/background-color: #fff;/g, 'background-color: var(--color-bg);');
html = html.replace(/background-color: #ffffff;/gi, 'background-color: var(--color-bg);');

// The inputs and select need updating too, otherwise they'll be white
html = html.replace(
    /\.login-input \{[\s\S]*?background-color: #fff;[\s\S]*?\}/g,
    match => match.replace('background-color: #fff;', 'background-color: var(--color-bg);').replace('color: #000;', 'color: var(--color-text);')
);

fs.writeFileSync('frontend/index.html', html);
console.log('Fixed CSS background colors');
