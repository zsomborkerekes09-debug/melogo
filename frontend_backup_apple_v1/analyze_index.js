const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

let output = '';
function log(msg) {
    output += msg + '\n';
}

// 1. Tag balance check
log("--- TAG BALANCE CHECK ---");
const tags = ['div', 'span', 'section', 'button', 'a', 'p', 'main', 'header', 'footer', 'script', 'style'];
tags.forEach(tag => {
    const openRegex = new RegExp(`<${tag}(\\s|>|/>)`, 'gi');
    const closeRegex = new RegExp(`</${tag}>`, 'gi');
    const openCount = (html.match(openRegex) || []).length;
    const closeCount = (html.match(closeRegex) || []).length;
    // Self closing tags count
    const selfCloseRegex = new RegExp(`<${tag}[^>]*/>`, 'gi');
    const selfCloseCount = (html.match(selfCloseRegex) || []).length;
    
    log(`${tag}: open=${openCount}, close=${closeCount}, self-closed=${selfCloseCount}, diff=${openCount - closeCount - selfCloseCount}`);
});

// 2. Identify potential overlays/modals that might block interaction
log("\n--- POTENTIAL OVERLAYS IN HTML ---");
const lines = html.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('id=') && (line.includes('overlay') || line.includes('modal') || line.includes('loading') || line.includes('backdrop') || line.includes('login') || line.includes('register') || line.includes('welcome'))) {
        log(`Line ${idx + 1}: ${line.trim()}`);
    }
});

// 3. Search for styles that might disable pointer events or cover screen
log("\n--- CSS INTERACTION BARRIERS ---");
lines.forEach((line, idx) => {
    if (line.includes('pointer-events') || line.includes('z-index') || line.includes('user-select') || line.includes('opacity: 0') || line.includes('display: none')) {
        if (line.includes('<style>') || line.trim().startsWith('.') || line.trim().startsWith('#') || line.includes(':') || line.includes('{')) {
            log(`Line ${idx + 1}: ${line.trim()}`);
        }
    }
});

fs.writeFileSync(path.join(__dirname, 'output_utf8.txt'), output, 'utf8');
console.log("Done writing output_utf8.txt");
