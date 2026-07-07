const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Find the guest button container
    const guestBtnStart = html.indexOf('<!-- Guest Mode Button -->');
    if (guestBtnStart !== -1) {
        // Extract the guest button block
        const btnRegex = /<!-- Guest Mode Button -->[\s\S]*?<\/button>\s*<\/div>/;
        const match = html.match(btnRegex);
        
        if (match) {
            const btnHtml = match[0];
            
            // Remove it from its current location
            html = html.replace(btnHtml, '');
            
            // Insert it at the end of register-fields
            // Look for the end of register-fields which is followed by auth-step-1
            html = html.replace(/(<\/div>\s*<!-- STEP 1: Name field -->)/, btnHtml + '\n        $1');
        }
    }

    fs.writeFileSync(file, html);
    console.log(`Moved Guest Button in ${file}`);
});
