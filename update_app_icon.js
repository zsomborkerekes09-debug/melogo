const fs = require('fs');

const filePath = 'frontend/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const search = `    <link rel="icon" href="app_icon.png" type="image/png">
    <link rel="apple-touch-icon" href="app_icon.png">
    <link rel="icon" href="icon-192.svg" type="image/svg+xml">`;

const replace = `    <link rel="icon" href="assets/logo_new.jpg" type="image/jpeg">
    <link rel="apple-touch-icon" href="assets/logo_new.jpg">`;

if (content.includes(search)) {
    content = content.replace(search, replace);
} else if (content.includes(search.replace(/\n/g, '\r\n'))) {
    content = content.replace(search.replace(/\n/g, '\r\n'), replace.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(filePath, content);
console.log('App icon updated to assets/logo_new.jpg');
