const fs = require('fs');

const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Convert to Light Mode
content = content.replace(/--color-bg:\s*#121212;/g, '--color-bg: #F8F9FA;');
content = content.replace(/--color-surface:\s*#1E1E1E;/g, '--color-surface: #FFFFFF;');
content = content.replace(/--color-text:\s*#FFFFFF;/g, '--color-text: #111827;');
content = content.replace(/--color-text-light:\s*#94A3B8;/g, '--color-text-light: #4B5563;');
content = content.replace(/--color-border:\s*#2A2A2A;/g, '--color-border: #E5E7EB;');
content = content.replace(/--color-text-muted:\s*#64748B;/g, '--color-text-muted: #9CA3AF;');

// Chat vars
content = content.replace(/--color-chat-bg:\s*#121212;/g, '--color-chat-bg: #F3F4F6;');
content = content.replace(/--color-chat-bubble-in:\s*#1E1E1E;/g, '--color-chat-bubble-in: #FFFFFF;');
// we keep bubble-out as var(--color-green)
content = content.replace(/--color-chat-text-in:\s*#FFFFFF;/g, '--color-chat-text-in: #111827;');
content = content.replace(/--color-chat-text-out:\s*#000000;/g, '--color-chat-text-out: #FFFFFF;');
content = content.replace(/--color-chat-border-in:\s*#2A2A2A;/g, '--color-chat-border-in: #E5E7EB;');

// Fix body / container backgrounds
content = content.replace(/body\s*\{\s*background-color:\s*#000000/g, 'body { background-color: #111827');
content = content.replace(/\.phone-container\s*\{[^}]*background-color:\s*#000000/g, (match) => match.replace('#000000', 'var(--color-bg)'));

// If I missed the phone container:
content = content.replace(/background-color:\s*#000000\s*!important/g, 'background-color: var(--color-bg) !important');
// specifically the phone-container which has background-color: #000000;
content = content.replace(/overflow:\s*hidden;\s*background-color:\s*#000000;/g, 'overflow: hidden; background-color: var(--color-bg);');

// 2. Change the main green to Emerald Green
content = content.replace(/--color-green:\s*#c0fc2a;/g, '--color-green: #10B981;');
content = content.replace(/--color-green:\s*#AAFF00\s*!important;/g, '--color-green: #10B981 !important;');

// 3. Keep the logo neon green (#c0fc2a)
content = content.replace(/\.brand-logo\s+span\s*\{\s*color:\s*var\(--color-green\);\s*\}/g, '.brand-logo span { color: #c0fc2a; }');
content = content.replace(/#launch-screen\s+\.logo\s+\.green\s*\{\s*color:\s*var\(--color-green\);\s*\}/g, '#launch-screen .logo .green { color: #c0fc2a; }');
content = content.replace(/color:\s*var\(--color-green\)/g, (match, offset, fullText) => {
    // If it's part of MeloGo logo inline style
    const surrounding = fullText.substring(offset - 20, offset + 30);
    if (surrounding.includes('Melo') && surrounding.includes('Go')) {
        return 'color: #c0fc2a';
    }
    return match;
});

// Also fix any hardcoded #121212 to #FFFFFF where it applies to cards/surfaces
content = content.replace(/background:\s*#121212;/g, 'background: #FFFFFF;');
content = content.replace(/background-color:\s*#121212;/g, 'background-color: var(--color-bg);');

// Also update the meta theme-color to white
content = content.replace(/<meta name="theme-color" content="#000000">/g, '<meta name="theme-color" content="#F8F9FA">');

// One more check for the logo inline style since regex match function might miss some if formatting differs
content = content.replace(/Melo<span style="color:var\(--color-green\);">Go<\/span>/g, 'Melo<span style="color:#c0fc2a;">Go</span>');
content = content.replace(/Melo<span style="color:var\(--color-green\)">Go<\/span>/g, 'Melo<span style="color:#c0fc2a">Go</span>');

// Light mode inputs need white backgrounds
content = content.replace(/\.auth-input,\s*input[^\{]*\{\s*background:\s*rgba\(255, 255, 255, 0\.08\)\s*!important;/g, '.auth-input, input:not([type="checkbox"]):not([type="radio"]), textarea, select {\n    background: #FFFFFF !important;');
content = content.replace(/border:\s*0\.5px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\)\s*!important;/g, 'border: 0.5px solid #E5E7EB !important;');
content = content.replace(/color:\s*#FFFFFF\s*!important;/g, (match, offset, str) => {
    // We don't want to replace all white colors, only those in inputs.
    // Let's just do a targeted replacement for inputs.
    return match;
});

// Let's fix input colors targeting
content = content.replace(/(\.auth-input,\s*input[\s\S]*?border-radius:\s*12px\s*!important;[\s\S]*?padding:\s*16px\s*20px\s*!important;[\s\S]*?)color:\s*#FFFFFF\s*!important;/g, '$1color: #111827 !important;');

fs.writeFileSync(file, content, 'utf8');
console.log('Applied Light Emerald Mode');
