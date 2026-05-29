const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function traceParent(id) {
    const targetIdx = html.indexOf('id="' + id + '"');
    if (targetIdx === -1) {
        console.log(id + ' not found');
        return;
    }

    let stack = [];
    let pos = 0;
    
    // Find all tags before the target index
    const regex = /<\/?(div|section|span|button|header|main|body|html)\b[^>]*>/gi;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
        if (match.index >= targetIdx) break;
        const tag = match[0];
        if (tag.startsWith('</')) {
            stack.pop();
        } else {
            stack.push({
                tag: tag,
                index: match.index,
                line: html.substring(0, match.index).split('\n').length
            });
        }
    }
    
    console.log(`\n=== STACK FOR ID "${id}" ===`);
    stack.forEach((item, index) => {
        console.log(`${'  '.repeat(index)}Line ${item.line}: ${item.tag.substring(0, 80)}`);
    });
}

traceParent('worker-settings');
traceParent('help-overlay');
traceParent('msg-action-sheet');
