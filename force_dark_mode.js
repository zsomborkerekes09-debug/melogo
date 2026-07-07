const fs = require('fs');

const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the default :root variables with Dark Mode variables
content = content.replace(/--color-bg:\s*#FFFFFF;/g, '--color-bg: #121212;');
content = content.replace(/--color-surface:\s*#FFFFFF;/g, '--color-surface: #1E1E1E;');
content = content.replace(/--color-text:\s*#000000;/g, '--color-text: #FFFFFF;');
content = content.replace(/--color-text-light:\s*#4A5568;/g, '--color-text-light: #94A3B8;');
content = content.replace(/--color-border:\s*#E2E8F0;/g, '--color-border: #2A2A2A;');
content = content.replace(/--color-text-muted:\s*#64748B;/g, '--color-text-muted: #64748B;'); // Keep as is or make lighter
content = content.replace(/--color-chat-bg:\s*#F3F4F6;/g, '--color-chat-bg: #121212;');
content = content.replace(/--color-chat-bubble-in:\s*#FFFFFF;/g, '--color-chat-bubble-in: #1E1E1E;');
content = content.replace(/--color-chat-bubble-out:\s*#000000;/g, '--color-chat-bubble-out: var(--color-green);');
content = content.replace(/--color-chat-text-in:\s*#000000;/g, '--color-chat-text-in: #FFFFFF;');
content = content.replace(/--color-chat-text-out:\s*#FFFFFF;/g, '--color-chat-text-out: #000000;');
content = content.replace(/--color-chat-border-in:\s*#E2E8F0;/g, '--color-chat-border-in: #2A2A2A;');

// 2. Force applyDarkMode to always apply dark mode, and remove the light mode block
content = content.replace(/function applyDarkMode\(enabled\)\s*\{/g, 'function applyDarkMode(enabled) {\n            enabled = true; // FORCE DARK MODE');

// 3. Make sure body background defaults to dark mode before JS
content = content.replace(/background-color:\s*var\(--color-text\)/g, 'background-color: #000000'); // the phone-container background outside the app

fs.writeFileSync(file, content, 'utf8');
console.log('Forced dark mode successfully.');
