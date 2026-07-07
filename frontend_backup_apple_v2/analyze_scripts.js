const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const regex = /<script[\s\S]*?>/gi;
let match;
console.log("Script tags found:");
while ((match = regex.exec(html)) !== null) {
    const start = match.index;
    const linesBefore = html.substring(0, start).split('\n');
    console.log(`Line ${linesBefore.length}: ${match[0]}`);
}

// Check if there are multiple occurrences of some functions
const functionsToCheck = ['sendChatLocation', 'deleteAccount', 'logoutWorker', 'closeLogoutConfirm'];
functionsToCheck.forEach(fn => {
    const matches = [...html.matchAll(new RegExp(fn, 'g'))];
    console.log(`\nOccurrences of '${fn}': ${matches.length}`);
    matches.forEach((m, idx) => {
        const linesBefore = html.substring(0, m.index).split('\n');
        console.log(`  Occurrence ${idx + 1}: Line ${linesBefore.length}`);
    });
});
