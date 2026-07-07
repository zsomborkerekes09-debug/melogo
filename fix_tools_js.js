const fs = require('fs');

const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const oldJs = `        function selectToolsRequired(type) {
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

const newJs = `        function selectToolsRequired(type) {
            activeToolsRequired = type;
            const btnEmp = document.getElementById('tools-btn-employer');
            const btnWork = document.getElementById('tools-btn-worker');
            if (!btnEmp || !btnWork) return;
            
            // Fixed for Dark Mode Apple aesthetic
            const activeBg = 'rgba(255,255,255,0.15)';
            const activeColor = '#FFFFFF';
            const activeBorder = '0.5px solid rgba(255,255,255,0.3)';
            
            const inactiveBg = 'var(--color-surface)';
            const inactiveColor = 'var(--color-text)';
            const inactiveBorder = '0.5px solid var(--color-border)';
            
            if (type === 'employer') {
                btnEmp.style.background = activeBg;
                btnEmp.style.color = activeColor;
                btnEmp.style.border = activeBorder;
                
                btnWork.style.background = inactiveBg;
                btnWork.style.color = inactiveColor;
                btnWork.style.border = inactiveBorder;
            } else {
                btnWork.style.background = activeBg;
                btnWork.style.color = activeColor;
                btnWork.style.border = activeBorder;
                
                btnEmp.style.background = inactiveBg;
                btnEmp.style.color = inactiveColor;
                btnEmp.style.border = inactiveBorder;
            }
        }`;

if (code.includes(oldJs)) {
    code = code.replace(oldJs, newJs);
    fs.writeFileSync(path, code, 'utf8');
    console.log("Success");
} else {
    console.log("Not found");
}
