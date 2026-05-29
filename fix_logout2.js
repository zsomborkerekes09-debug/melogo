const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the Kijelentkezés button in the logout sheet using regex
// Search for the logout-sheet div, and then replace the button
const sheetStart = html.indexOf('id="logout-sheet"');
if (sheetStart !== -1) {
    const sheetEnd = html.indexOf('</div>', html.indexOf('</div>', sheetStart) + 1); // rough guess of end
    
    // Actually, I can just do a regex replace on the specific button
    // It looks like: <button ...>Kijelentkezés</button>
    // Let's replace the whole onclick attribute if the text is Kijelentkezés
    html = html.replace(/<button([^>]+)onclick="[^"]*"([^>]*)>\s*Kijelentkezés\s*<\/button>/, '<button$1onclick="logoutApp()"$2>Kijelentkezés</button>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fixed logout button with regex');
} else {
    console.log('Sheet not found');
}
