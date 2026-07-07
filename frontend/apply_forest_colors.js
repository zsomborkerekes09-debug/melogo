const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const forestBg = '#111815';
const forestSurface = '#1A241F';
const forestText = 'rgba(255, 255, 255, 0.85)';
const forestTextMuted = '#8B9E93';
const forestBorder = 'rgba(52, 211, 153, 0.15)'; // Very subtle mint border
const forestMint = '#34D399';

// Replace root variables
content = content.replace(/--color-bg:\s*#[a-fA-F0-9]+\s*!important;/g, `--color-bg: ${forestBg} !important;`);
content = content.replace(/--color-surface:\s*#[a-fA-F0-9]+\s*!important;/g, `--color-surface: ${forestSurface} !important;`);
content = content.replace(/--color-text:\s*rgba\([^)]+\)\s*!important;/g, `--color-text: ${forestText} !important;`);
content = content.replace(/--color-text-muted:\s*rgba\([^)]+\)\s*!important;/g, `--color-text-muted: ${forestTextMuted} !important;`);
content = content.replace(/--color-border:\s*rgba\([^)]+\)\s*!important;/g, `--color-border: ${forestBorder} !important;`);

// Also update the Emerald green to Mint green for a softer look
content = content.replace(/--color-green:\s*#[a-fA-F0-9]+\s*!important;/g, `--color-green: ${forestMint} !important;`);
content = content.replace(/--color-green:\s*#[a-fA-F0-9]+;/g, `--color-green: ${forestMint};`);

// Update the inline styles in the recent JS/CSS injections
content = content.replace(/#10B981/g, forestMint);
content = content.replace(/#191919/g, forestBg);
content = content.replace(/#252525/g, forestSurface);

fs.writeFileSync(file, content, 'utf8');
console.log('Forest Minimalist colors applied!');
