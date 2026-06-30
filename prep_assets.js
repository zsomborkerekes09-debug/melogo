const fs = require('fs');
const path = require('path');
// This script will just copy the jpg to png since many tools can read jpgs renamed as pngs, 
// or I can try to use a basic method, but actually @capacitor/assets accepts .jpg if we rename the config or pass it.
// Let's check @capacitor/assets documentation. It usually accepts assets/icon.png or assets/icon.jpg.

fs.copyFileSync('frontend/app_icon_final.jpg', 'assets/icon.jpg');
fs.copyFileSync('frontend/app_icon_final.jpg', 'assets/splash.jpg');
console.log("Copied jpgs");
