const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

code = code.replace('<div class="action-overlay" id="job-picker-overlay" onclick="closeJobSheet()"></div>', '<div class="overlay-backdrop" id="job-picker-overlay" onclick="closeJobSheet()"></div>');
code = code.replace('<div class="apply-bottom-sheet" id="job-picker-sheet">', '<div class="action-overlay" id="job-picker-sheet">');

code = code.replace('<div class="action-overlay" id="tutor-picker-overlay" onclick="closeTutorSheet()"></div>', '<div class="overlay-backdrop" id="tutor-picker-overlay" onclick="closeTutorSheet()"></div>');
code = code.replace('<div class="apply-bottom-sheet" id="tutor-picker-sheet">', '<div class="action-overlay" id="tutor-picker-sheet">');

// Also update fix_selects.js so if it's run again, it's correct
let fixScript = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/fix_selects.js', 'utf8');
fixScript = fixScript.replace('<div class="action-overlay" id="job-picker-overlay"', '<div class="overlay-backdrop" id="job-picker-overlay"');
fixScript = fixScript.replace('<div class="apply-bottom-sheet" id="job-picker-sheet">', '<div class="action-overlay" id="job-picker-sheet">');
fixScript = fixScript.replace('<div class="action-overlay" id="tutor-picker-overlay"', '<div class="overlay-backdrop" id="tutor-picker-overlay"');
fixScript = fixScript.replace('<div class="apply-bottom-sheet" id="tutor-picker-sheet">', '<div class="action-overlay" id="tutor-picker-sheet">');
fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/fix_selects.js', fixScript);

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
console.log('Fixed classes successfully!');
