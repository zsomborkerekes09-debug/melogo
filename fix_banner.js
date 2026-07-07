const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

code = code.replace(
    "banner.style.top = 'calc(env(safe-area-inset-top, 40px) + 70px)';", 
    "banner.style.top = 'calc(env(safe-area-inset-top, 40px) + 90px)';"
);

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
console.log('Fixed banner CSS');
