const fs = require('fs');

const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Fix .action-header text color (White box bug)
    content = content.replace(/\.action-header\s*\{[\s\S]*?color:\s*#fff;/g, (match) => {
        return match.replace('color: #fff;', 'color: var(--color-bg);');
    });

    // 2. Fix the "Bezár" button to use a back arrow icon and match new colors
    content = content.replace(
        /<button style="background:none; border:none; color:white; font-weight: 500; cursor:pointer;" onclick="document.getElementById\('worker-action-overlay'\).style.display = 'none'">Bezár<\/button>/g,
        `<button style="background:none; border:none; color:var(--color-bg); font-weight: 500; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:4px;" onclick="document.getElementById('worker-action-overlay').style.display = 'none'"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>`
    );

    // 3. Fix top safe area padding (Double padding bug)
    content = content.replace(/padding-top:\s*max\(24px,\s*env\(safe-area-inset-top\)\)\s*!important;/g, 'padding-top: 16px !important;');

    // 4. Fix Duplicate ID for Job Picker Bottom Sheet
    content = content.replace(/<div class="overlay-backdrop" id="job-picker-overlay" onclick="closeJobSheet\(\)"><\/div>/g, '<div class="overlay-backdrop" id="emp-job-picker-overlay-custom" onclick="closeJobSheet()"></div>');
    content = content.replace(/<div class="action-overlay" id="job-picker-sheet">/g, '<div class="action-overlay" id="emp-job-picker-sheet-custom">');
    
    // Update JS references for openJobSheet
    content = content.replace(/document\.getElementById\('job-picker-overlay'\)\.classList\.add\('open'\);/g, "document.getElementById('emp-job-picker-overlay-custom').classList.add('open');");
    content = content.replace(/document\.getElementById\('job-picker-sheet'\)\.classList\.add\('open'\);/g, "document.getElementById('emp-job-picker-sheet-custom').classList.add('open');");
    
    // Update JS references for closeJobSheet
    content = content.replace(/document\.getElementById\('job-picker-overlay'\)\.classList\.remove\('open'\);/g, "document.getElementById('emp-job-picker-overlay-custom').classList.remove('open');");
    content = content.replace(/document\.getElementById\('job-picker-sheet'\)\.classList\.remove\('open'\);/g, "document.getElementById('emp-job-picker-sheet-custom').classList.remove('open');");

    // 5. Fix Tool Buttons Active/Inactive Colors in HTML
    content = content.replace(/id="tools-btn-employer"([^>]*?)style="([^"]*?background:var\(--color-text\); color:#fff;[^"]*?)"/g, 'id="tools-btn-employer"$1style="flex:1; padding:13px 8px; border-radius:12px; border: 2px solid var(--color-text); background:var(--color-text); color:var(--color-bg); font-size:13px; font-weight: 500; cursor:pointer; transition:all 0.2s; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;"');
    content = content.replace(/id="tools-btn-worker"([^>]*?)style="([^"]*?background:\s*var\(--color-surface\); color:\s*var\(--color-text\);[^"]*?)"/g, 'id="tools-btn-worker"$1style="flex:1; padding:13px 8px; border-radius:12px; border: 2px solid var(--color-border); background: transparent; color: var(--color-text); font-size:13px; font-weight: 500; cursor:pointer; transition:all 0.2s; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;"');

    // 6. Fix Tool Buttons JS logic
    const oldJS = `function selectToolsRequired(type) {
            activeToolsRequired = type;
            const btnEmp = document.getElementById('tools-btn-employer');
            const btnWork = document.getElementById('tools-btn-worker');
            if (!btnEmp || !btnWork) return;
            
            if (type === 'employer') {
                btnEmp.style.background = 'var(--color-text)';
                btnEmp.style.color = '#fff';
                btnEmp.style.border = '2px solid var(--color-text)';
                
                btnWork.style.background = '#FFFFFF';
                btnWork.style.color = 'var(--color-text)';
                btnWork.style.border = '2px solid #FFFFFF';
            } else {
                btnWork.style.background = 'var(--color-text)';
                btnWork.style.color = '#fff';
                btnWork.style.border = '2px solid var(--color-text)';
                
                btnEmp.style.background = '#FFFFFF';
                btnEmp.style.color = 'var(--color-text)';
                btnEmp.style.border = '2px solid #FFFFFF';
            }
        }`;
        
    const newJS = `function selectToolsRequired(type) {
            activeToolsRequired = type;
            const btnEmp = document.getElementById('tools-btn-employer');
            const btnWork = document.getElementById('tools-btn-worker');
            if (!btnEmp || !btnWork) return;
            
            if (type === 'employer') {
                btnEmp.style.background = 'var(--color-text)';
                btnEmp.style.color = 'var(--color-bg)';
                btnEmp.style.border = '2px solid var(--color-text)';
                
                btnWork.style.background = 'transparent';
                btnWork.style.color = 'var(--color-text)';
                btnWork.style.border = '2px solid var(--color-border)';
            } else {
                btnWork.style.background = 'var(--color-text)';
                btnWork.style.color = 'var(--color-bg)';
                btnWork.style.border = '2px solid var(--color-text)';
                
                btnEmp.style.background = 'transparent';
                btnEmp.style.color = 'var(--color-text)';
                btnEmp.style.border = '2px solid var(--color-border)';
            }
        }`;
        
    content = content.replace(oldJS, newJS);

    // Write back
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed ' + file);
});
