const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

function replaceRegex(regex, replacement) {
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        console.log("Success with: " + regex);
    } else {
        console.log("Failed to match: " + regex);
    }
}

// 1. Button scale 0.97
replaceRegex(/\.btn:active\s*\{[^}]+\}/g, `.btn:active {\n    transform: scale(0.97);\n}`);
if (!content.includes('transform: scale(0.97)')) {
    // If not found, insert globally
    content = content.replace(/<\/style>/, `\nbutton:active, .btn:active, .nav-item:active, .emp-submit-btn:active, .job-apply-btn:active {\n    transform: scale(0.97) !important;\n    transition: transform 0.15s ease;\n}\n</style>`);
}

// 2. Pill selection 150ms
replaceRegex(/\.cat-pill\s*\{[^}]+\}/, function(match) {
    return match.replace(/transition:[^;]+;/, 'transition: all 150ms ease;');
});
replaceRegex(/\.sort-pill\s*\{[^}]+\}/, function(match) {
    return match.replace(/transition:[^;]+;/, 'transition: all 150ms ease;');
});
if (!content.includes('transition: all 150ms ease;')) {
    content = content.replace(/<\/style>/, `\n.cat-pill, .sort-pill {\n    transition: all 150ms ease !important;\n}\n</style>`);
}

// 3. Bottom sheet spring
replaceRegex(/\.bottom-sheet\s*\{[^}]+\}/, function(match) {
    return match.replace(/transition:[^;]+;/, 'transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.1);');
});
replaceRegex(/\.settings-overlay\s*\{[^}]+\}/, function(match) {
    return match.replace(/transition:[^;]+;/, 'transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.1);');
});

// 4. Screen transitions 280ms
replaceRegex(/\.fade-view\s*\{[^}]+\}/, function(match) {
    return match.replace(/transition:[^;]+;/, 'transition: opacity 280ms ease;');
});
if (!content.includes('transition: opacity 280ms ease;')) {
    content = content.replace(/<\/style>/, `\n.fade-view, .screen {\n    transition: opacity 280ms ease, transform 280ms ease;\n}\n</style>`);
}

// 5. Card stagger 60ms
content = content.replace(/<\/style>/, `
@keyframes cardEnter {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.job-card {
    animation: cardEnter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) both;
}
.job-card:nth-child(1) { animation-delay: 0ms; }
.job-card:nth-child(2) { animation-delay: 60ms; }
.job-card:nth-child(3) { animation-delay: 120ms; }
.job-card:nth-child(4) { animation-delay: 180ms; }
.job-card:nth-child(5) { animation-delay: 240ms; }
.job-card:nth-child(6) { animation-delay: 300ms; }
.job-card:nth-child(7) { animation-delay: 360ms; }
.job-card:nth-child(8) { animation-delay: 420ms; }
.job-card:nth-child(n+9) { animation-delay: 480ms; }
</style>`);

fs.writeFileSync(file, content);
console.log('Script 10_animations completed.');
