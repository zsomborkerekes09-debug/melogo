const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
let phoneAppIndex = -1;
let bottomNavIndex = -1;
let bodyIndex = -1;
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('id="phone-app"')) phoneAppIndex = i;
    if(lines[i].includes('class="bottom-nav"')) bottomNavIndex = i;
    if(lines[i].includes('</body>')) bodyIndex = i;
}
console.log('phone-app:', phoneAppIndex);
console.log('bottom-nav:', bottomNavIndex);
console.log('body:', bodyIndex);
