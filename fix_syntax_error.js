const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // The broken code looks like this:
    // function calcTrustLevel(jobCount, rating) { ... return { ... }; \n        };\n        }
    
    // We will find the exact broken block and replace it
    const regex = /function calcTrustLevel\([\s\S]*?return \{ level: 1[\s\S]*?\};[\s]*?\n[\s]*\}/g;
    
    const fixedCode = `function calcTrustLevel(jobCount, rating) {
            if (jobCount >= 15 && rating >= 4.7) return { level: 4, name: 'Prémium', bg: 'var(--color-green)', color: '#000000' };
            if (jobCount >= 8 && rating >= 4.3) return { level: 3, name: 'Tapasztalt', bg: 'rgba(255,255,255,0.2)', color: '#FFFFFF' };
            if (jobCount >= 3 && rating >= 4.0) return { level: 2, name: 'Megbízható', bg: 'rgba(255,255,255,0.15)', color: '#FFFFFF' };
            return { level: 1, name: 'Kezdő', bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' };
        }`;

    html = html.replace(regex, fixedCode);

    fs.writeFileSync(file, html);
    console.log(`Fixed syntax error in ${file}`);
});
