const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the Részletek buttons
html = html.replace(/<button class="job-apply-btn"[^>]*>Részletek<\/button>/g, '');

// 2. Make the job cards clickable
html = html.replace(/<div class="job-card">/g, '<div class="job-card" style="cursor: pointer; position: relative;" onclick="document.getElementById(\\\'worker-action-overlay\\\').classList.add(\\\'active\\\')">');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed job cards by making them sleek!');
