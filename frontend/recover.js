const fs = require('fs');
const logPath = 'C:\\\\Users\\\\zsomb\\\\.gemini\\\\antigravity\\\\brain\\\\26e7cc3a-4f89-4790-897e-5ef5e3eb61ab\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) continue;
    try {
        const step = JSON.parse(lines[i]);
        if (step.type === 'ACTION_OUTPUT' && step.content && step.content.includes('<!DOCTYPE html>')) {
            console.log('Found full HTML in step ' + step.step_index);
            // Verify if it contains SCREEN 3: PROFIL
            if (step.content.includes('<!-- SCREEN 3: PROFIL -->') || step.content.includes('<!-- DIÁK SCREEN 3: PROFIL -->')) {
                 fs.writeFileSync('index_recovered.html', step.content);
                 console.log('Recovered to index_recovered.html');
                 break;
            }
        }
    } catch(e) {}
}
