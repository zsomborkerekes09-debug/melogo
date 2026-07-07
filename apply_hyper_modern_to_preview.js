const fs = require('fs');
let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

if (!html.includes('id="job-picker-sheet"')) {
    const sheetsHTML = `
<div class="overlay-backdrop" id="job-picker-overlay" onclick="closeJobSheet()" style="z-index: 100000;"></div>
<div class="action-overlay glassmorphism" id="job-picker-sheet" style="z-index: 100001;">
    <div class="grab-handle"></div>
    <div style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 24px; text-align: center; font-family: 'Poppins', sans-serif;">Pontos munka</div>
    <div id="job-picker-list" style="overflow-y: auto; flex: 1; padding-bottom: 30px;"></div>
</div>

<div class="overlay-backdrop" id="tutor-picker-overlay" onclick="closeTutorSheet()" style="z-index: 100000;"></div>
<div class="action-overlay glassmorphism" id="tutor-picker-sheet" style="z-index: 100001;">
    <div class="grab-handle"></div>
    <div style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 24px; text-align: center; font-family: 'Poppins', sans-serif;">Oktatási szint</div>
    <div id="tutor-picker-list" style="overflow-y: auto; flex: 1; padding-bottom: 30px;"></div>
</div>
`;
    html = html.replace('</body>', sheetsHTML + '\n</body>');
}

if (!html.includes('function getJobIcon')) {
    const logicJS = `
<script>
function getJobIcon(text) {
    if(text.includes('Fűnyírás')) return '🌱';
    if(text.includes('Takarítás')) return '🧹';
    if(text.includes('Pakolás')) return '📦';
    if(text.includes('Mosás')) return '🚗';
    if(text.includes('Kutyasétáltatás')) return '🐕';
    if(text.includes('Gyerekfelügyelet')) return '👶';
    return '✨';
}

function openJobSheet() {
    const select = document.getElementById('emp-job-select');
    const list = document.getElementById('job-picker-list');
    list.innerHTML = '';
    Array.from(select.options).forEach(opt => {
        if(!opt.value) return; 
        const div = document.createElement('div');
        div.className = 'custom-sheet-option';
        const icon = getJobIcon(opt.text);
        div.innerHTML = \`<span class="option-icon">\${icon}</span> \${opt.text}\`;
        div.onclick = () => {
            select.value = opt.value;
            document.getElementById('emp-job-display-text').innerText = opt.text;
            closeJobSheet();
            if(window.onEmpJobSelectChange) onEmpJobSelectChange(opt.value);
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
        if(!opt.value) return; 
        const div = document.createElement('div');
        div.className = 'custom-sheet-option';
        div.innerText = '🎓 ' + opt.text;
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
`;
    html = html.replace('</body>', logicJS + '\n</body>');
}

// Ensure z-index is correct if it was already there but missing style
html = html.replace(/<div class="overlay-backdrop" id="job-picker-overlay"/g, '<div class="overlay-backdrop" id="job-picker-overlay" style="z-index: 100000;"');
html = html.replace(/<div class="action-overlay glassmorphism" id="job-picker-sheet"/g, '<div class="action-overlay glassmorphism" id="job-picker-sheet" style="z-index: 100001;"');
html = html.replace(/<div class="overlay-backdrop" id="tutor-picker-overlay"/g, '<div class="overlay-backdrop" id="tutor-picker-overlay" style="z-index: 100000;"');
html = html.replace(/<div class="action-overlay glassmorphism" id="tutor-picker-sheet"/g, '<div class="action-overlay glassmorphism" id="tutor-picker-sheet" style="z-index: 100001;"');

const hyperModernCSSFile = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/apply_hyper_modern.js', 'utf8');
const cssPart = hyperModernCSSFile.split('const hyperModernCSS = `')[1].split('`;')[0];

if (!html.includes('id="hyper-modern-redesign"')) {
    html = html.replace('</style>', '</style>\\n' + cssPart);
} else {
    // Replace the old one if it exists
    html = html.replace(/<style id="hyper-modern-redesign">[\s\S]*?<\/style>/, cssPart);
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Applied directly to preview_dark.html');
