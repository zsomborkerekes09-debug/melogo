const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('                </div>\n\n                <!-- Diák Chat & Teljesítés Overlay -->', '                </div>\n            </div> <!-- END screens-container -->\n\n                <!-- Diák Chat & Teljesítés Overlay -->');

html = html.replace('</div>\n\n</body>', '\n</body>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed div nesting for screens-container');
