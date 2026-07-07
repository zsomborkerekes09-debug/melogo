const fs = require('fs');
let html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', 'utf8');

const jsOverride = `
<script id="ultimate-js-override">
window.openJobSheet = function() {
    const select = document.getElementById('emp-job-select');
    const lists = document.querySelectorAll('#job-picker-list');
    lists.forEach(list => {
        list.innerHTML = '';
        Array.from(select.options).forEach(opt => {
            if(!opt.value) return; 
            const div = document.createElement('div');
            div.className = 'custom-sheet-option';
            div.innerText = opt.text;
            div.onclick = () => {
                select.value = opt.value;
                const display = document.getElementById('emp-job-display-text');
                if(display) display.innerText = opt.text;
                window.closeJobSheet();
                if(typeof window.onEmpJobSelectChange === 'function') {
                    window.onEmpJobSelectChange(opt.value);
                }
                select.dispatchEvent(new Event('change'));
            };
            list.appendChild(div);
        });
    });
    
    document.querySelectorAll('#job-picker-overlay').forEach(el => {
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('pointer-events', 'auto', 'important');
        el.style.setProperty('background', 'rgba(0,0,0,0.6)', 'important');
        el.classList.add('open');
    });
    document.querySelectorAll('#job-picker-sheet').forEach(el => {
        el.style.setProperty('transform', 'translateY(0)', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('pointer-events', 'auto', 'important');
        el.classList.add('open');
    });
};

window.closeJobSheet = function() {
    document.querySelectorAll('#job-picker-overlay').forEach(el => {
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.classList.remove('open');
    });
    document.querySelectorAll('#job-picker-sheet').forEach(el => {
        el.style.setProperty('transform', 'translateY(100%)', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.classList.remove('open');
    });
};
</script>
`;

if (!html.includes('id="ultimate-js-override"')) {
    html = html.replace('</body>', jsOverride + '\n</body>');
} else {
    html = html.replace(/<script id="ultimate-js-override">[\s\S]*?<\/script>/, jsOverride);
}

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html', html);
console.log('Inline style override injected!');
