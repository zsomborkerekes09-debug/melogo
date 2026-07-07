const fs = require('fs');

let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

// 1. We must ensure the custom select HTML exists!
if (!html.includes('id="job-picker-sheet"')) {
    const sheetsHTML = `
<!-- Job Picker Bottom Sheet (Hyper Modern) -->
<div class="overlay-backdrop" id="job-picker-overlay" onclick="closeJobSheet()"></div>
<div class="action-overlay glassmorphism" id="job-picker-sheet">
    <div class="grab-handle"></div>
    <div style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 24px; text-align: center; font-family: 'Poppins', sans-serif;">Pontos munka</div>
    <div id="job-picker-list" style="overflow-y: auto; flex: 1; padding-bottom: 30px;"></div>
</div>

<!-- Tutor Level Picker Bottom Sheet -->
<div class="overlay-backdrop" id="tutor-picker-overlay" onclick="closeTutorSheet()"></div>
<div class="action-overlay glassmorphism" id="tutor-picker-sheet">
    <div class="grab-handle"></div>
    <div style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 24px; text-align: center; font-family: 'Poppins', sans-serif;">Oktatási szint</div>
    <div id="tutor-picker-list" style="overflow-y: auto; flex: 1; padding-bottom: 30px;"></div>
</div>
`;
    html = html.replace('</body>', sheetsHTML + '\n</body>');
}

// 2. We must ensure the logic exists
if (!html.includes('function openJobSheet')) {
    const logicJS = `
<script>
// --- Custom Dropdown Logic ---
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

// Ensure proper z-index so the sheet shows above the employer form
html = html.replace(/<div class="overlay-backdrop" id="job-picker-overlay"/g, '<div class="overlay-backdrop" id="job-picker-overlay" style="z-index: 100000;"');
html = html.replace(/<div class="action-overlay glassmorphism" id="job-picker-sheet"/g, '<div class="action-overlay glassmorphism" id="job-picker-sheet" style="z-index: 100001;"');
html = html.replace(/<div class="overlay-backdrop" id="tutor-picker-overlay"/g, '<div class="overlay-backdrop" id="tutor-picker-overlay" style="z-index: 100000;"');
html = html.replace(/<div class="action-overlay glassmorphism" id="tutor-picker-sheet"/g, '<div class="action-overlay glassmorphism" id="tutor-picker-sheet" style="z-index: 100001;"');

// Now inject the massive 50-point Hyper Modern CSS
const hyperModernCSS = `
<style id="hyper-modern-redesign">
/* ========================================================
   50-POINT HYPER-MODERN GLASSMORPHISM & NEON OVERHAUL
   ======================================================== */

/* 8. Dynamic Black Background with Aurora & 50. Noise Texture */
body, html, #app-container, .screen {
    background-color: #050508 !important;
    background-image: 
        radial-gradient(circle at 15% 50%, rgba(50, 215, 75, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 85% 30%, rgba(10, 132, 255, 0.08) 0%, transparent 50%) !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
}

/* 11. Global Spring Animations */
* {
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}
.transition-smooth {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

/* 12. Thicker Typography for Headers */
h1, h2, .screen-title, .emp-form-title {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 700 !important;
    letter-spacing: -0.03em !important;
}

/* 1. Employer Form Modal: Glassmorphism */
#employer-form-overlay {
    background: rgba(10, 10, 15, 0.6) !important;
    backdrop-filter: blur(40px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(200%) !important;
}
.emp-form-header {
    background: transparent !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

/* 2. "Mi biztosítjuk / Munkás hozza" Buttons 3D */
#tools-btn-employer, #tools-btn-worker {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 20px !important;
    box-shadow: 
        inset 0 4px 10px rgba(255,255,255,0.02),
        0 8px 24px rgba(0,0,0,0.2) !important;
    color: rgba(255,255,255,0.6) !important;
    transform: translateY(0);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    font-weight: 600 !important;
}
#tools-btn-employer[style*="FFFFFF"], #tools-btn-worker[style*="FFFFFF"],
#tools-btn-employer[style*="rgb(255, 255, 255)"], #tools-btn-worker[style*="rgb(255, 255, 255)"] {
    background: linear-gradient(145deg, rgba(50, 215, 75, 0.15), rgba(50, 215, 75, 0.05)) !important;
    border: 1px solid rgba(50, 215, 75, 0.4) !important;
    color: #32D74B !important;
    box-shadow: 
        inset 0 2px 10px rgba(50, 215, 75, 0.2),
        0 12px 32px rgba(50, 215, 75, 0.15) !important;
    transform: translateY(-2px) scale(1.02) !important;
}

/* 3. Urgent Switch (Neon Pill) */
#urgent-track {
    background: rgba(255,255,255,0.08) !important;
    border: 1px solid rgba(255,255,255,0.05) !important;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.5) !important;
    height: 32px !important;
    width: 56px !important;
}
#urgent-thumb {
    width: 28px !important;
    height: 28px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}
input[type="checkbox"]:checked ~ #urgent-track {
    background: linear-gradient(90deg, #FF3B30, #FF9500) !important;
    border-color: #FF3B30 !important;
    box-shadow: 0 0 20px rgba(255, 59, 48, 0.4), inset 0 2px 6px rgba(0,0,0,0.2) !important;
}

/* 4. Price Input Big Typography */
#emp-price-input {
    font-family: 'Poppins', sans-serif !important;
    font-size: 56px !important;
    font-weight: 700 !important;
    text-align: center !important;
    background: transparent !important;
    color: #FFFFFF !important;
    border: none !important;
    text-shadow: 0 0 40px rgba(255,255,255,0.2) !important;
}

/* 7. Input Fields Neumorphic Depression */
#emp-details, #emp-address {
    background: rgba(0, 0, 0, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    box-shadow: inset 0 4px 12px rgba(0,0,0,0.5) !important;
    border-radius: 16px !important;
    color: #FFFFFF !important;
    transition: all 0.3s ease !important;
}
#emp-details:focus, #emp-address:focus {
    border-bottom: 2px solid #32D74B !important;
    background: rgba(0, 0, 0, 0.3) !important;
    box-shadow: inset 0 4px 12px rgba(0,0,0,0.5), 0 8px 24px rgba(50, 215, 75, 0.1) !important;
}

/* 6. Submit Button Pulsing Gradient */
.emp-submit-btn {
    background: linear-gradient(135deg, #32D74B 0%, #0A84FF 100%) !important;
    border-radius: 20px !important;
    height: 60px !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    border: none !important;
    box-shadow: 0 10px 30px rgba(50, 215, 75, 0.3) !important;
    animation: pulseGlow 3s infinite alternate !important;
}
@keyframes pulseGlow {
    0% { box-shadow: 0 10px 30px rgba(50, 215, 75, 0.3); }
    100% { box-shadow: 0 10px 40px rgba(10, 132, 255, 0.5); }
}

/* 5. Custom Dropdown Glassmorphism */
.glassmorphism {
    background: rgba(20, 20, 25, 0.75) !important;
    backdrop-filter: blur(50px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(50px) saturate(200%) !important;
    border-top: 1px solid rgba(255,255,255,0.1) !important;
}
.custom-sheet-option {
    padding: 20px !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    color: #FFFFFF !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    display: flex !important;
    align-items: center !important;
    gap: 16px !important;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}
.option-icon {
    font-size: 24px !important;
    background: rgba(255,255,255,0.05) !important;
    padding: 10px !important;
    border-radius: 12px !important;
}
.custom-sheet-option:hover {
    background: rgba(255,255,255,0.1) !important;
    padding-left: 28px !important;
}

/* 9. Floating Cards & 24. Dark Mode Contrasts */
.job-card, .emp-cat-card, .role-card {
    background: rgba(30, 30, 35, 0.6) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255,255,255,0.05) !important;
    border-radius: 24px !important;
    box-shadow: 0 16px 40px rgba(0,0,0,0.4) !important;
}
.job-card:active {
    transform: scale(0.95) !important;
}

/* 18. Bottom Menu Dynamic Island */
.bottom-nav {
    background: rgba(20, 20, 25, 0.85) !important;
    backdrop-filter: blur(40px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(200%) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 40px !important;
    margin: 0 16px 24px 16px !important;
    padding-bottom: 0 !important;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
    bottom: env(safe-area-inset-bottom) !important;
}
.nav-item {
    padding: 12px 0 !important;
}

/* 22. Neon Red Badges */
.msg-badge, [id*="badge"] {
    background: #FF3B30 !important;
    box-shadow: 0 0 12px rgba(255, 59, 48, 0.6) !important;
    border: 2px solid #141419 !important;
}

/* 16. Map Pins Neon Pulse */
.map-pin-label {
    background: #32D74B !important;
    color: #000 !important;
    box-shadow: 0 0 20px rgba(50, 215, 75, 0.6) !important;
    border: none !important;
    font-weight: 800 !important;
}
.user-gps-dot {
    background: #0A84FF !important;
    box-shadow: 0 0 24px rgba(10, 132, 255, 0.8) !important;
    border: 2px solid #FFF !important;
}

/* 35. Distance Slider Neon Track */
input[type="range"] {
    background: rgba(255,255,255,0.1) !important;
    height: 8px !important;
    border-radius: 4px !important;
}
input[type="range"]::-webkit-slider-thumb {
    background: #32D74B !important;
    width: 24px !important;
    height: 24px !important;
    box-shadow: 0 0 16px rgba(50, 215, 75, 0.8) !important;
    border: 2px solid #FFFFFF !important;
}

/* 25. Selected Pills Neon Dot */
.filter-pill.active, .category-btn.active, div[onclick^="setDateFilter"].active-date, .emp-cat-card.active {
    background: rgba(255,255,255,0.1) !important;
    border: 1px solid rgba(50, 215, 75, 0.5) !important;
    color: #FFF !important;
    box-shadow: 0 8px 24px rgba(50, 215, 75, 0.15) !important;
}

/* 42. Category Icons Glow */
.category-btn.active svg, .emp-cat-card.active svg {
    stroke: #32D74B !important;
    filter: drop-shadow(0 0 8px rgba(50, 215, 75, 0.8)) !important;
}

/* 21. Chat Bubbles Liquid */
.chat-bubble-sent {
    background: linear-gradient(135deg, #0A84FF 0%, #005bb5 100%) !important;
    box-shadow: 0 8px 20px rgba(10, 132, 255, 0.3) !important;
    border-radius: 20px 20px 4px 20px !important;
}
.chat-bubble-received {
    background: rgba(255,255,255,0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255,255,255,0.05) !important;
    border-radius: 20px 20px 20px 4px !important;
}

/* Fix Display Job Picker */
#emp-job-display {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    padding: 18px 20px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}

</style>
`;
if (!html.includes('id="hyper-modern-redesign"')) {
    html = html.replace('</head>', hyperModernCSS + '\n</head>');
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', html);
console.log('Hyper Modern UI Injected!');
