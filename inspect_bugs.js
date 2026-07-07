const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

// Print characters before app-login-screen
const start = html.indexOf('id="app-login-screen"');
console.log(html.substring(Math.max(0, start - 200), start));

// Also let's check for literal backslash-n in the entire file using a simple regex
const matches = html.match(/\\n/g);
console.log('Matches for literal \\n:', matches ? matches.length : 0);

// Print the dark mode button HTML
const darkStart = html.indexOf('id="dark-mode-toggle"');
if (darkStart !== -1) {
    console.log('Dark mode toggle found!');
    console.log(html.substring(darkStart, darkStart + 400));
} else {
    console.log('Dark mode toggle NOT found in index.html');
}

const prevHtml = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');
const pDarkStart = prevHtml.indexOf('id="dark-mode-toggle"');
if (pDarkStart !== -1) {
    console.log('Dark mode toggle found in preview_dark.html!');
    console.log(prevHtml.substring(pDarkStart, pDarkStart + 400));
} else {
    console.log('Dark mode toggle NOT found in preview_dark.html');
}
