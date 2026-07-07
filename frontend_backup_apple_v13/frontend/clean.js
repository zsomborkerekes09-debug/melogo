const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');
const regex = /<style id="apple-premium-dark-mode">[\s\S]*?APPLE PREMIUM SÖTÉT MÓD\s*<\/div>/g;
const matches = code.match(regex);
if (matches) {
    code = code.replace(regex, '');
    fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
    console.log('Removed ' + matches.length + ' injected dark mode blocks!');
} else {
    console.log('No blocks found.');
}
