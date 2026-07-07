const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // FIX 1: navigateApp hides bottom nav items
    html = html.replace(/navs\.forEach\(nav => nav\.style\.display\s*=\s*'none'\);/g, "navs.forEach(nav => nav.classList.remove('active'));");

    // FIX 2: switchRole hides role buttons
    html = html.replace(/btnWorker\.style\.display\s*=\s*'none';[\s\S]*?btnEmployer\.style\.display\s*=\s*'none';/g, "btnWorker.classList.remove('active');\n                btnEmployer.classList.remove('active');");

    fs.writeFileSync(file, html);
    console.log(`Successfully fixed logic bugs in ${file}`);
});
