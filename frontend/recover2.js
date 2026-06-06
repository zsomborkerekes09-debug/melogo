const fs = require('fs');
const logPath = 'C:\\\\Users\\\\zsomb\\\\.gemini\\\\antigravity\\\\brain\\\\26e7cc3a-4f89-4790-897e-5ef5e3eb61ab\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let maxLen = 0;
let bestContent = '';

for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    try {
        const step = JSON.parse(lines[i]);
        let content = '';
        if (step.content) content = step.content;
        if (step.tool_calls) {
            for (let c of step.tool_calls) {
                if (c.args && c.args.CodeContent) {
                    content = c.args.CodeContent;
                }
            }
        }
        
        if (typeof content === 'string' && content.includes('<title>MeloGo</title>')) {
            if (content.length > maxLen) {
                maxLen = content.length;
                bestContent = content;
            }
        }
    } catch(e) {}
}

if (maxLen > 0) {
    fs.writeFileSync('index_recovered.html', bestContent);
    console.log('Recovered ' + maxLen + ' bytes to index_recovered.html');
} else {
    console.log('Not found');
}
