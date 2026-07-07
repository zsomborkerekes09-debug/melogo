const fs = require('fs');

let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

// 1. Redefine selectToolsRequired to properly add/remove the 'active' class
const selectToolsFix = `
<script>
window.selectToolsRequired = function(type) {
    window.activeToolsRequired = type;
    const btnEmp = document.getElementById('tools-btn-employer');
    const btnWork = document.getElementById('tools-btn-worker');
    if (!btnEmp || !btnWork) return;
    
    // First remove active class from both
    btnEmp.classList.remove('active');
    btnWork.classList.remove('active');
    
    if (type === 'employer') {
        btnEmp.classList.add('active');
    } else {
        btnWork.classList.add('active');
    }
};

// Auto-initialize to employer
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.selectToolsRequired) window.selectToolsRequired('employer');
    }, 500);
});
</script>
`;

if (!html.includes('window.selectToolsRequired = function(type)')) {
    html = html.replace('</body>', selectToolsFix + '\n</body>');
}

// 2. Add bulletproof CSS for BOTH buttons and sheets (removing #app-container)
const finalBulletproofCSS = `
<style id="ultimate-bulletproof-fix">
/* Tools Buttons */
body #tools-btn-employer, body #tools-btn-worker {
    background: #1C1C1E !important;
    color: #8E8E93 !important;
    border: 2px solid #2C2C2E !important;
}
body #tools-btn-employer.active, body #tools-btn-worker.active {
    background: #32D74B !important;
    color: #000000 !important;
    border: none !important;
}

/* Action Sheets */
body #job-picker-overlay, body #tutor-picker-overlay {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 100000 !important;
    background: rgba(0,0,0,0.6) !important;
}
body #job-picker-overlay.open, body #tutor-picker-overlay.open {
    opacity: 1 !important;
    pointer-events: auto !important;
}

body #job-picker-sheet, body #tutor-picker-sheet {
    transform: translateY(100%) !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease, visibility 0.3s ease !important;
    z-index: 100001 !important;
    background: #1C1C1E !important;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
}
body #job-picker-sheet.open, body #tutor-picker-sheet.open {
    transform: translateY(0) !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
}
</style>
`;

if (!html.includes('id="ultimate-bulletproof-fix"')) {
    html = html.replace('</style>', '</style>\n' + finalBulletproofCSS);
} else {
    html = html.replace(/<style id="ultimate-bulletproof-fix">[\s\S]*?<\/style>/, finalBulletproofCSS);
}

// Remove old conflicting CSS that tried to use [style*="var(--color-text)"] or [style*="255"]
html = html.replace(/body #app-container #employer-form-overlay #tools-btn-employer\[style\*="[^"]*"\][^}]*\}/g, '');
html = html.replace(/body #app-container #employer-form-overlay #tools-btn-worker\[style\*="[^"]*"\][^}]*\}/g, '');
html = html.replace(/body #app-container #employer-form-overlay #tools-btn-employer\.active[^}]*\}/g, '');
html = html.replace(/body #app-container #employer-form-overlay #tools-btn-worker\.active[^}]*\}/g, '');
html = html.replace(/body #app-container #employer-form-overlay #tools-btn-employer\s*,\s*body #app-container #employer-form-overlay #tools-btn-worker\s*\{[^}]*\}/g, '');

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Fixed for real!');
