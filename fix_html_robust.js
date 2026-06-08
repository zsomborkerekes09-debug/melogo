const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// Only check HTML part, before the big <script>
let scriptIndex = html.indexOf('<script>');
let htmlPart = scriptIndex !== -1 ? html.substring(0, scriptIndex) : html;
let scriptPart = scriptIndex !== -1 ? html.substring(scriptIndex) : '';

let regex = /<div\b[^>]*>|<\/div>/gi;
let match;
let depth = 0;
let toRemove = [];

// Track depth
while ((match = regex.exec(htmlPart)) !== null) {
    let tag = match[0].toLowerCase();
    if (tag === '</div>') {
        depth--;
        if (depth < 0) {
            console.log('Extra </div> found at index ' + match.index);
            toRemove.push({ start: match.index, end: match.index + match[0].length });
            depth = 0; // reset depth because we will remove this
        }
    } else {
        depth++;
    }
}

console.log('Final depth before removing extras: ' + depth);

// Remove extra divs from the end backwards to not mess up indices
for (let i = toRemove.length - 1; i >= 0; i--) {
    let rem = toRemove[i];
    htmlPart = htmlPart.substring(0, rem.start) + htmlPart.substring(rem.end);
}

// Append missing closing tags
let newDepth = 0;
regex.lastIndex = 0;
while ((match = regex.exec(htmlPart)) !== null) {
    if (match[0].toLowerCase() === '</div>') newDepth--;
    else newDepth++;
}

console.log('Depth after removal: ' + newDepth);

let closingTags = '';
while (newDepth > 0) {
    closingTags += '</div>\n';
    newDepth--;
}

if (!htmlPart.includes('</body>')) {
    closingTags += '</body>\n</html>\n';
}

fs.writeFileSync('frontend/index.html', htmlPart + closingTags + scriptPart);
console.log('Done fixing HTML!');
