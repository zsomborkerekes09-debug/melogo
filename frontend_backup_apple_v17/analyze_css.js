const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

// Search for all CSS style blocks containing action-overlay or employer-action-overlay
const styleRegex = /<style>([\s\S]*?)<\/style>/gi;
let match;
let count = 0;
while ((match = styleRegex.exec(html)) !== null) {
    count++;
    const content = match[1];
    const selectors = ['.action-overlay', '#employer-action-overlay', '#worker-action-overlay', '#global-overlay-backdrop', '.overlay-backdrop'];
    selectors.forEach(sel => {
        if (content.includes(sel)) {
            console.log(`Style Block ${count} contains selector ${sel}`);
            // Extract the matching rule
            const index = content.indexOf(sel);
            const excerpt = content.substring(Math.max(0, index - 50), Math.min(content.length, index + 300));
            console.log(`Excerpt around ${sel}:\n${excerpt}\n---`);
        }
    });
}

// Search for inline styles of these elements
const inlineRegex = /id=["'](?:employer-action-overlay|worker-action-overlay|global-overlay-backdrop)["'][^>]*?style=["']([^"']*)["']/gi;
while ((match = inlineRegex.exec(html)) !== null) {
    console.log(`Inline style for match: ${match[0]}`);
}
