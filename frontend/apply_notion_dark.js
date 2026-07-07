const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Color Palette replacements
const notionBg = '#191919';
const notionSurface = '#252525';
const notionSurfaceHover = '#2F2F2F';
const notionText = 'rgba(255, 255, 255, 0.81)';
const notionTextMuted = 'rgba(255, 255, 255, 0.44)';
const notionBorder = 'rgba(255, 255, 255, 0.09)';

// Update root variables
content = content.replace(/--color-bg:\s*#[a-fA-F0-9]+\s*!important;/g, `--color-bg: ${notionBg} !important;`);
content = content.replace(/--color-surface:\s*#[a-fA-F0-9]+\s*!important;/g, `--color-surface: ${notionSurface} !important;`);
content = content.replace(/--color-text:\s*#[a-fA-F0-9]+\s*!important;/g, `--color-text: ${notionText} !important;`);
content = content.replace(/--color-text-muted:\s*rgba\([^)]+\)\s*!important;/g, `--color-text-muted: ${notionTextMuted} !important;`);
content = content.replace(/--color-border:\s*rgba\([^)]+\)\s*!important;/g, `--color-border: ${notionBorder} !important;`);

// 2. Flatten Visual Elements
// Remove box-shadows entirely
content = content.replace(/box-shadow:[^;]+;/g, 'box-shadow: none !important;');
// Remove linear-gradients and replace with solid surfaces
content = content.replace(/background:\s*linear-gradient\([^)]+\)\s*!important;/g, `background: ${notionSurface} !important;`);
// Remove backdrop-filter
content = content.replace(/backdrop-filter:[^;]+;/g, '');
content = content.replace(/-webkit-backdrop-filter:[^;]+;/g, '');

// 3. Adjust Geometry (Square Look - 6px)
// Replace 12px, 14px, 16px, 20px, 24px, 50px with 6px
content = content.replace(/border-radius:\s*(12|14|16|20|24|50)px/g, 'border-radius: 6px');
content = content.replace(/border-top-left-radius:\s*24px/g, 'border-top-left-radius: 6px');
content = content.replace(/border-top-right-radius:\s*24px/g, 'border-top-right-radius: 6px');

// Ensure inputs have notion background
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0.08\)\s*!important;/g, `background: ${notionBg} !important;`);
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0.12\)\s*!important;/g, `background: ${notionSurface} !important;`);

// Ensure thin borders on inputs
content = content.replace(/border:\s*0\.5px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.1\)\s*!important;/g, `border: 1px solid ${notionBorder} !important;`);

fs.writeFileSync(file, content, 'utf8');
console.log('Notion Dark Mode applied!');
