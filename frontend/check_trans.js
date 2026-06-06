const fs = require('fs');
const logPath = 'C:\\\\Users\\\\zsomb\\\\.gemini\\\\antigravity\\\\brain\\\\26e7cc3a-4f89-4790-897e-5ef5e3eb61ab\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = lines.length - 1; i >= Math.max(0, lines.length - 500); i--) {
    if (!lines[i]) continue;
    if (lines[i].includes('index.html') && (lines[i].includes('length') || lines[i].includes('substring') || lines[i].includes('replace_file_content'))) {
        console.log('Step ' + i + ': ' + lines[i].substring(0, 300));
    }
}
