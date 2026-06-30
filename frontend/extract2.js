const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (m) {
    fs.writeFileSync('C:/Users/zsomb/test_module2.js', m[1]);
    console.log('Extracted to test_module2.js');
} else {
    console.log('Not found');
}
