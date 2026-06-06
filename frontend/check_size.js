const fs = require('fs');
const logPath = 'C:\\\\Users\\\\zsomb\\\\.gemini\\\\antigravity\\\\brain\\\\26e7cc3a-4f89-4790-897e-5ef5e3eb61ab\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = lines.length - 1; i >= Math.max(0, lines.length - 500); i--) {
    if (!lines[i]) continue;
    try {
        const step = JSON.parse(lines[i]);
        if (step.tool_calls) {
            for (const call of step.tool_calls) {
                if (call.name === 'run_command' && call.args.CommandLine && call.args.CommandLine.includes('.length')) {
                    console.log('Size check in step ' + step.step_index + ': ' + call.args.CommandLine);
                }
            }
        }
        if (step.type === 'ACTION_OUTPUT' && step.content && step.content.includes('113143')) {
             console.log('Found size 113143 in step ' + step.step_index);
        }
        if (step.type === 'ACTION_OUTPUT' && step.content && step.content.includes('113650')) {
             console.log('Found size 113650 in step ' + step.step_index);
        }
    } catch(e) {}
}
