const fs = require('fs');
const path = 'frontend/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove scattered font-family inline styles
content = content.replace(/font-family:\s*['"A-Za-z\s,]+;/g, '');

// 2. Change global font-family in body CSS
content = content.replace(/body\s*\{[^}]*font-family:[^;]+;/g, function(match) {
    return match.replace(/font-family:[^;]+;/, 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;');
});

// Also replace specific old font families
content = content.replace(/font-family:\s*'DM Sans',\s*sans-serif;/g, 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;');
content = content.replace(/font-family:\s*inherit;/g, '');

// Ensure body has the new font
if (!content.includes('font-family: -apple-system')) {
    content = content.replace(/body\s*\{/, 'body {\n            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;');
}

// 3. Lower font weights
content = content.replace(/font-weight:\s*([4-8]00)/g, function(match, p1) {
    const w = parseInt(p1);
    if (w === 800) return 'font-weight: 600';
    if (w === 700) return 'font-weight: 500';
    if (w === 600) return 'font-weight: 400';
    if (w === 500) return 'font-weight: 300';
    return match; // 400 stays 400
});

// 4. Update the Google font link just in case
content = content.replace(/family=DM\+Sans:wght@[^&]+/, 'family=DM+Sans:wght@300;400;500');

fs.writeFileSync(path, content);
console.log('Fonts updated successfully');
