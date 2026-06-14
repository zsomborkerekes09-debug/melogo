const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Add --color-surface and --color-text-muted to :root
if (!html.includes('--color-surface: #FFFFFF;')) {
    html = html.replace(
        /--color-border: #E2E8F0;/g,
        '--color-border: #E2E8F0;\n            --color-surface: #FFFFFF;\n            --color-text-muted: #64748B;'
    );
}

// 2. Add max-width to .settings-overlay just in case it's breaking out
html = html.replace(/\.settings-overlay\s*\{/g, '.settings-overlay {\n            max-width: 480px;\n            margin: 0 auto;');

// 3. Make sure .settings-overlay has proper background
html = html.replace(/\.settings-overlay\s*\{[\s\S]*?background-color:\s*var\(--color-bg\);/g, match => match.replace('background-color: var(--color-bg);', 'background-color: var(--color-bg); /* fallback */'));

fs.writeFileSync('frontend/index.html', html);
console.log('Fixed CSS variables');
