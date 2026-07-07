const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptStart = html.indexOf('<script>', 4000) + 8;
const scriptEnd = html.indexOf('</script>', scriptStart);
const code = html.substring(scriptStart, scriptEnd);
fs.writeFileSync('temp_main.js', code, 'utf8');
