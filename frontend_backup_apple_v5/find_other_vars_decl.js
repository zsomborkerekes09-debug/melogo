const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const vars = ['localChats', 'localEmployerJobs', 'localWorkerApplications'];
vars.forEach(v => {
    const regex = new RegExp(`(var|let|const)\\s+${v}\\b`, 'g');
    let match;
    console.log(`=== Declarations of '${v}' ===`);
    while ((match = regex.exec(html)) !== null) {
        const start = match.index;
        const linesBefore = html.substring(0, start).split('\n');
        console.log(`Line ${linesBefore.length}: ${match[0]}`);
    }
});
