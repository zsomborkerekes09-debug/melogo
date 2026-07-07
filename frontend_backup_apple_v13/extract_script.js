const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptStart = html.indexOf('<script>', 4000) + 8;
const scriptEnd = html.indexOf('</script>', scriptStart);
const code = html.substring(scriptStart, scriptEnd);
const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<') && !lines[i].includes('//') && !lines[i].includes('')) {
        // Many lines have < (like HTML strings inside quotes), so we want to find unquoted ones or suspicious ones.
        // Actually, let's just write the script to a temp file and let node syntax error tell us the line.
    }
}
fs.writeFileSync('temp_script.js', code);
