const fs = require('fs');
const lines = fs.readFileSync('frontend/index.html', 'utf8').split('\n');

let depth = 0;
let outputLines = [];
let extraDivsCount = 0;

for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Process tags roughly (only block level divs to not mess up inline)
    let openMatches = l.match(/<div[^>]*>/g) || [];
    let closeMatches = l.match(/<\/div>/g) || [];
    
    // We only care about lines from phone-app onwards
    if (i >= 2760) {
        depth += openMatches.length;
        
        let removedFromLine = 0;
        for (let c = 0; c < closeMatches.length; c++) {
            depth--;
            if (depth < 0) {
                // This is an EXTRA closing div! Remove one instance of </div> from this line
                l = l.replace('</div>', '');
                depth++; // Restore depth since we removed the extra closing div
                removedFromLine++;
                extraDivsCount++;
            }
        }
    }
    
    outputLines.push(l);
}

// Ensure phone-app is closed at the very end
if (depth > 0) {
    while(depth > 0) {
        outputLines.push('</div>');
        depth--;
    }
}
outputLines.push('</body>');
outputLines.push('</html>');

fs.writeFileSync('frontend/index.html', outputLines.join('\n'));
console.log('Fixed HTML! Removed ' + extraDivsCount + ' extra </div> tags and appended closing tags.');
