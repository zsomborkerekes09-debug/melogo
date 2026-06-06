const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the Kijelentkezés button in the logout sheet
const logoutBtnOld = '<button class="btn btn-primary" style="background-color: #DC2626; color: white;" onclick="closeLogoutConfirm()">Kijelentkezés</button>';
const logoutBtnNew = '<button class="btn btn-primary" style="background-color: #DC2626; color: white;" onclick="logoutApp()">Kijelentkezés</button>';

if (html.includes(logoutBtnOld)) {
    html = html.replace(logoutBtnOld, logoutBtnNew);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fixed logout button');
} else {
    console.log('Button not found');
}
