const fs = require('fs');
const content = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
    if (l.includes('<div style="display: flex; gap: 14px; font-size: 28px; justify-content: center;" id="chat-stars-container">')) {
        console.log((i+1) + ': ' + l.trim());
    }
    if (l.includes('const link = <a href="https://www.google.com/maps/dir/?api=1&destination=')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
