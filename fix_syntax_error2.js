const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Let's find the exact string that is broken and replace it.
    const brokenStr1 = `return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };\r\n        };\r\n        }`;
    const brokenStr2 = `return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };\n        };\n        }`;
    const brokenStr3 = `return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };\n        }\n        }`;
    const brokenStr4 = `return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };\r\n        }\r\n        }`;

    const goodStr = `return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };\n        }`;

    let replaced = false;
    
    if (html.includes(brokenStr1)) { html = html.replace(brokenStr1, goodStr); replaced = true; }
    if (html.includes(brokenStr2)) { html = html.replace(brokenStr2, goodStr); replaced = true; }
    if (html.includes(brokenStr3)) { html = html.replace(brokenStr3, goodStr); replaced = true; }
    if (html.includes(brokenStr4)) { html = html.replace(brokenStr4, goodStr); replaced = true; }

    // Regex fallback just in case
    html = html.replace(/return { level: 1, name: 'Kezdő', bg: 'rgba\(255,255,255,0\.08\)', color: '#FFFFFF' };[\s]*};[\s]*}/g, goodStr);
    html = html.replace(/return { level: 1, name: 'Kezdő', bg: 'rgba\(255,255,255,0\.08\)', color: '#FFFFFF' };[\s]*};[\s]*\}/g, goodStr);

    fs.writeFileSync(file, html);
    console.log(`String replaced: ${replaced} in ${file}`);
});
