const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The file was saved as UTF-8, but its content is double-encoded UTF-8 -> Windows-1252 -> UTF-8.
// We can decode it by treating the UTF-8 string characters as Windows-1252 bytes.
// But we need to be careful: Node's 'binary' encoding is essentially Latin-1 (ISO-8859-1).
// Windows-1252 is slightly different but close enough for Hungarian characters (áéíóöőúüű).

let fixed = Buffer.from(html, 'binary').toString('utf8');

// Let's test if this fixes the word "Keres"
let index = fixed.indexOf('Milyen munkát keresel?');
if (index !== -1) {
    console.log('Restoration successful! Found: Milyen munkát keresel?');
} else {
    console.log('Restoration failed.');
    console.log('Original sample:', html.substring(html.indexOf('Milyen munk'), html.indexOf('Milyen munk') + 40));
    console.log('Fixed sample:', fixed.substring(fixed.indexOf('Milyen munk'), fixed.indexOf('Milyen munk') + 40));
}
