const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');
html = html.split('\\n\\n').join('');
html = html.split('\\n        /* Common utilities */').join('\n        /* Common utilities */');
html = html.split('</html>\\n</body>\\n</html>\\n').join('</html>');
fs.writeFileSync('frontend/index.html', html);
console.log('Cleaned perfectly!');
