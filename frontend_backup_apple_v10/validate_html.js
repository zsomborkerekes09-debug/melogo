const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const originalHtml = fs.readFileSync(filePath, 'utf8');

function validateHTML(html) {
    // 1. Strip comments
    let stripped = html.replace(/<!--[\s\S]*?-->/g, (match) => ' '.repeat(match.length));

    // 2. Strip script tags but preserve their space to keep line numbers intact
    stripped = stripped.replace(/<script[\s\S]*?<\/script>/gi, (match) => {
        // Replace all characters except newlines with spaces
        return match.replace(/[^\r\n]/g, ' ');
    });

    // 3. Strip style tags
    stripped = stripped.replace(/<style[\s\S]*?<\/style>/gi, (match) => {
        return match.replace(/[^\r\n]/g, ' ');
    });

    const tagRegex = /<\/?([a-zA-Z0-9:-]+)(?:\s+[^>]*?)?>/g;
    let match;
    const stack = [];
    const selfClosingTags = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'link', 'meta', 'param', 'source', 'track', 'wbr', 'path', 'circle', 'svg', 'use', 'rect', 'meta'
    ]);

    let lines = originalHtml.split('\n');
    function getLineAndCol(index) {
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            if (count + lines[i].length + 1 > index) {
                return { line: i + 1, col: index - count + 1 };
            }
            count += lines[i].length + 1;
        }
        return { line: lines.length, col: 0 };
    }

    console.log("Analyzing HTML tags (excluding scripts, styles, comments)...");

    while ((match = tagRegex.exec(stripped)) !== null) {
        const fullTag = match[0].trim();
        const tagName = match[1].toLowerCase();
        const index = match.index;

        if (selfClosingTags.has(tagName) || fullTag.endsWith('/>')) {
            continue;
        }

        const isClosing = fullTag.startsWith('</');
        const pos = getLineAndCol(index);

        if (!isClosing) {
            stack.push({ name: tagName, pos, tag: fullTag });
        } else {
            if (stack.length === 0) {
                console.error(`Error: Closing tag </${tagName}> at line ${pos.line}, col ${pos.col} has no matching opening tag.`);
                continue;
            }
            const last = stack.pop();
            if (last.name !== tagName) {
                console.error(`Mismatched tag: Opened <${last.name}> at line ${last.pos.line}, col ${last.pos.col} but closed with </${tagName}> at line ${pos.line}, col ${pos.col}`);
                // Put last back to try to recover
                stack.push(last);
            }
        }
    }

    if (stack.length > 0) {
        console.error(`\nUnclosed tags remaining: ${stack.length}`);
        stack.forEach(tag => {
            console.error(`- <${tag.name}> at line ${tag.pos.line}, col ${tag.pos.col} (Tag: ${tag.tag.substring(0, 50)})`);
        });
    } else {
        console.log("HTML tags are fully balanced!");
    }
}

validateHTML(originalHtml);
