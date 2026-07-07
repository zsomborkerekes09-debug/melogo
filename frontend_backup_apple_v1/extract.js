const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (m) {
    fs.writeFileSync('C:/Users/zsomb/test_module.js', m[1]);
    console.log('Module extracted to test_module.js');
} else {
    console.log('No module script found!');
}
