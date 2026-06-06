const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

const checks = {
    'Auto-save initAutoSave': 'function initAutoSave()',
    'Auto-save indicator CSS': '.autosave-indicator {',
    'Nav capsule CSS': 'border-radius: 28px;',
    'Nav backdrop-filter': 'backdrop-filter: blur(20px)',
    'Sort pills SVG icons': 'viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    'Apply btn new class': 'class="apply-btn-main"',
    'Apply btn loading spinner': 'btn-spinner',
    'Apply btn handleWorkerApply': 'function handleWorkerApply()',
    'Employer form dark header': 'class="emp-form-header"',
    'Employer cat grid': 'emp-cat-grid',
    'Employer picker row': 'emp-picker-row',
    'Employer textarea': 'class="emp-textarea"',
    'Employer char counter': 'emp-char-counter',
    'Employer price display': 'emp-price-display',
    'Employer datetime': 'emp-datetime',
    'Employer submit fixed': 'emp-submit-fixed',
    'Success animation': 'emp-success-overlay',
    'Employer publish new': 'function employerPublishJobNew',
    'openJobPickerNew': 'function openJobPickerNew',
    'selectEmpCat': 'function selectEmpCat',
    'Screens padding-bottom': 'padding-bottom: 96px',
};

let ok = 0, fail = 0;
for (const [label, token] of Object.entries(checks)) {
    const found = h.includes(token);
    if (found) ok++; else fail++;
    console.log((found ? '✅' : '❌') + ' ' + label);
}

console.log('\nResult:', ok, '/', Object.keys(checks).length, 'checks passed');
console.log('File size:', Math.round(h.length / 1024) + 'KB');
