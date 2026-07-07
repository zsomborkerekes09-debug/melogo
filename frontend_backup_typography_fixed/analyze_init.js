const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

// Find _safeInit definition
const safeInitRegex = /function\s+_safeInit\s*\([\s\S]*?\{([\s\S]*?)\n\s*\}/gi;
let match = safeInitRegex.exec(html);
if (match) {
    console.log("=== _safeInit definition ===");
    console.log(match[0]);
} else {
    // Search for _safeInit occurrences
    const matches = [...html.matchAll(/_safeInit/g)];
    console.log(`\nOccurrences of '_safeInit': ${matches.length}`);
    matches.forEach((m, idx) => {
        const linesBefore = html.substring(0, m.index).split('\n');
        console.log(`  Occurrence ${idx + 1}: Line ${linesBefore.length}`);
    });
}

// Find all onload blocks
const lines = html.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('window.onload') || line.includes('DOMContentLoaded')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
        // print next 10 lines
        for (let i = 1; i <= 15; i++) {
            if (lines[idx + i] !== undefined) {
                console.log(`  ${idx + 1 + i}: ${lines[idx + i]}`);
            }
        }
        console.log('---');
    }
});
