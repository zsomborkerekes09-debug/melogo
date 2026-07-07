const fs = require('fs');
let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

// 1. Hide native selects and insert custom displays
html = html.replace(
    /<select\s*id="emp-job-select"[\s\S]*?<\/select>/,
    `<select id="emp-job-select" onchange="onEmpJobSelectChange(this.value)" style="display:none;"></select>
    <div id="emp-job-display" onclick="openJobSheet()" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: none; border-radius: 12px; padding: 14px 40px 14px 14px; font-size: 14px; font-weight: 300; color: #FFFFFF; cursor: pointer; position: relative; box-sizing: border-box; transition: background 0.2s cubic-bezier(0.32, 0.72, 0, 1);">
        <span id="emp-job-display-text" style="pointer-events:none;">Válassz munkát...</span>
        <svg style="position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
    </div>`
);

html = html.replace(
    /<select\s*id="emp-tutor-level-select"[\s\S]*?<\/select>/,
    `<select id="emp-tutor-level-select" style="display:none;"></select>
    <div id="emp-tutor-display" onclick="openTutorSheet()" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: none; border-radius: 12px; padding: 14px 40px 14px 14px; font-size: 14px; font-weight: 300; color: #FFFFFF; cursor: pointer; position: relative; box-sizing: border-box; transition: background 0.2s cubic-bezier(0.32, 0.72, 0, 1);">
        <span id="emp-tutor-display-text" style="pointer-events:none;">Válassz oktatási szintet...</span>
        <svg style="position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
    </div>`
);

// 2. Inject Bottom Sheets HTML
const sheetsHTML = `
<!-- Job Picker Bottom Sheet -->
<div class="overlay-backdrop" id="job-picker-overlay" onclick="closeJobSheet()"></div>
<div class="action-overlay" id="job-picker-sheet">
    <div class="grab-handle"></div>
    <div style="font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 16px; text-align: center;">Válassz munkát</div>
    <div id="job-picker-list" style="overflow-y: auto; flex: 1; padding-bottom: 20px;"></div>
</div>

<!-- Tutor Level Picker Bottom Sheet -->
<div class="overlay-backdrop" id="tutor-picker-overlay" onclick="closeTutorSheet()"></div>
<div class="action-overlay" id="tutor-picker-sheet">
    <div class="grab-handle"></div>
    <div style="font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 16px; text-align: center;">Oktatási szint</div>
    <div id="tutor-picker-list" style="overflow-y: auto; flex: 1; padding-bottom: 20px;"></div>
</div>
`;
html = html.replace('</body>', sheetsHTML + '\n</body>');

// 3. Inject JS Logic
const logicJS = `
<script>
// --- Custom Dropdown Logic ---
function openJobSheet() {
    const select = document.getElementById('emp-job-select');
    const list = document.getElementById('job-picker-list');
    list.innerHTML = '';
    
    // Add hover styles dynamically via class
    Array.from(select.options).forEach(opt => {
        if(!opt.value) return; // Skip empty placeholder
        const div = document.createElement('div');
        div.className = 'custom-sheet-option';
        div.innerText = opt.text;
        div.onclick = () => {
            select.value = opt.value;
            document.getElementById('emp-job-display-text').innerText = opt.text;
            closeJobSheet();
            if(window.onEmpJobSelectChange) onEmpJobSelectChange(opt.value);
            // manually trigger change event if needed
            select.dispatchEvent(new Event('change'));
        };
        list.appendChild(div);
    });
    
    document.getElementById('job-picker-overlay').classList.add('open');
    document.getElementById('job-picker-sheet').classList.add('open');
}

function closeJobSheet() {
    document.getElementById('job-picker-overlay').classList.remove('open');
    document.getElementById('job-picker-sheet').classList.remove('open');
}

function openTutorSheet() {
    const select = document.getElementById('emp-tutor-level-select');
    const list = document.getElementById('tutor-picker-list');
    list.innerHTML = '';
    
    Array.from(select.options).forEach(opt => {
        if(!opt.value) return; // Skip empty placeholder
        const div = document.createElement('div');
        div.className = 'custom-sheet-option';
        div.innerText = opt.text;
        div.onclick = () => {
            select.value = opt.value;
            document.getElementById('emp-tutor-display-text').innerText = opt.text;
            closeTutorSheet();
            select.dispatchEvent(new Event('change'));
        };
        list.appendChild(div);
    });
    
    document.getElementById('tutor-picker-overlay').classList.add('open');
    document.getElementById('tutor-picker-sheet').classList.add('open');
}

function closeTutorSheet() {
    document.getElementById('tutor-picker-overlay').classList.remove('open');
    document.getElementById('tutor-picker-sheet').classList.remove('open');
}

// Hook into existing logic to update display text when select options change natively
const originalPopulate = window.populateEmpJobSelect;
if(originalPopulate) {
    // If we need to intercept
}

// Ensure display text updates if select value changes via other means
setInterval(() => {
    const jobSel = document.getElementById('emp-job-select');
    const jobTxt = document.getElementById('emp-job-display-text');
    if(jobSel && jobSel.options[jobSel.selectedIndex] && jobTxt) {
        jobTxt.innerText = jobSel.options[jobSel.selectedIndex].text || 'Válassz munkát...';
    }
    
    const tutSel = document.getElementById('emp-tutor-level-select');
    const tutTxt = document.getElementById('emp-tutor-display-text');
    if(tutSel && tutSel.options[tutSel.selectedIndex] && tutTxt) {
        tutTxt.innerText = tutSel.options[tutSel.selectedIndex].text || 'Válassz oktatási szintet...';
    }
}, 500);

</script>
<style>
.custom-sheet-option {
    padding: 16px;
    font-size: 15px;
    font-weight: 400;
    color: #fff;
    border-bottom: 0.5px solid rgba(255,255,255,0.05);
    cursor: pointer;
    transition: background 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}
.custom-sheet-option:last-child {
    border-bottom: none;
}
.custom-sheet-option:hover, .custom-sheet-option:active {
    background: rgba(255, 255, 255, 0.15);
}
#emp-job-display:hover, #emp-tutor-display:hover {
    background: rgba(255, 255, 255, 0.08) !important;
}
#emp-job-display:active, #emp-tutor-display:active {
    background: rgba(255, 255, 255, 0.12) !important;
}
</style>
`;
html = html.replace('</body>', logicJS + '\n</body>');

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', html);
console.log('Selects fixed!');
