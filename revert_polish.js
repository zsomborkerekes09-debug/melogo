const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Remove the final-ui-polish CSS block completely
    html = html.replace(/<style id="final-ui-polish">[\s\S]*?<\/style>/g, '');

    fs.writeFileSync(file, html);
    console.log(`Reverted polish in ${file}`);
});
