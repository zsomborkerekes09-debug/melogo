const fs = require('fs');

const orig = fs.readFileSync('profile_original.html', 'utf8');
let openOrig = (orig.match(/<div\b[^>]*>/gi) || []).length;
let closeOrig = (orig.match(/<\/div>/gi) || []).length;
console.log('Original Open divs: ' + openOrig + ', Close divs: ' + closeOrig + ', Diff: ' + (openOrig - closeOrig));

const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<!-- SCREEN 3: PROFIL -->');
const end = html.indexOf('<!-- Diák Chat & Teljesítés Overlay -->');
const newProfile = html.substring(start, end);

let openNew = (newProfile.match(/<div\b[^>]*>/gi) || []).length;
let closeNew = (newProfile.match(/<\/div>/gi) || []).length;
console.log('New Open divs: ' + openNew + ', Close divs: ' + closeNew + ', Diff: ' + (openNew - closeNew));
