const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

const functionsToWrap = [
    'executeEmployerAccept',
    'executeEmployerReject',
    'executeEmployerStartJob',
    'executeWorkerCompleteJob',
    'executeEmployerRateJob'
];

for (let fnName of functionsToWrap) {
    const fnStartRegex = new RegExp((async function \\([^)]*\\)\\s*\\{)(?!\\s*try\\s*\\{));
    const match = fnStartRegex.exec(content);
    if (match) {
        console.log('Found', fnName, 'to wrap');
    } else {
        console.log('Already wrapped or not found:', fnName);
    }
}
