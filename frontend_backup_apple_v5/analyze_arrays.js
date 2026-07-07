const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

function findOccurrences(query) {
    const regex = new RegExp(`\\.(${query})\\s*\\(`, 'g');
    const matches = [...html.matchAll(regex)];
    console.log(`=== Matches for '.${query}(': ${matches.length} ===`);
    matches.forEach((m, idx) => {
        const start = m.index;
        const linesBefore = html.substring(0, start).split('\n');
        const lineNum = linesBefore.length;
        // Print around the match (50 chars before, 150 chars after)
        console.log(`Match ${idx + 1}: Line ${lineNum}`);
        console.log(html.substring(start - 50, start + 150).trim().replace(/\r?\n/g, ' '));
        console.log('---');
    });
}

findOccurrences('filter');
findOccurrences('forEach');
