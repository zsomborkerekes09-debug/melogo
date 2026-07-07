const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Force the inline background style to have !important so it overrides ANY CSS class
content = content.replace(/slider\.style\.background\s*=\s*(`linear-gradient[^`]+`)/g, "slider.style.setProperty('background', $1, 'important')");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed slider !important issue');
