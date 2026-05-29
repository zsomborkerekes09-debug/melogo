const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Check .phone-container CSS
const pcIdx = h.indexOf('.phone-container {');
console.log('.phone-container CSS:');
console.log(h.substring(pcIdx, pcIdx + 300));

// Check #phone-app specific CSS
const paIdx = h.indexOf('#phone-app {');
console.log('\n#phone-app CSS:');
console.log(h.substring(paIdx, paIdx + 200));

// Check the outer div structure - #app-login-screen and #phone-app siblings?
const loginIdx = h.indexOf('id="app-login-screen"');
const phoneIdx = h.indexOf('id="phone-app"');
console.log('\napp-login-screen at:', loginIdx, 'phone-app at:', phoneIdx);
console.log('app-login-screen sibling of phone-app (should be close to each other):', Math.abs(loginIdx - phoneIdx) < 5000);

// Check if there's any element wrapping both
const beforeLogin = h.substring(loginIdx - 200, loginIdx);
console.log('\nHTML before app-login-screen:');
console.log(beforeLogin);
