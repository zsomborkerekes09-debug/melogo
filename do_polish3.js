const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const dateFilterRegex = /function renderDateFilter\(\) \{[\s\S]*?html \+= `[\s\S]*?`;\n              \}\n              \n              container\.innerHTML = html;\n          \}/;

const newDateFilter = `function renderDateFilter() {
              const container = document.getElementById('date-filter-row');
              if (!container) return;
              
              const today = new Date();
              let html = '';
              
              for (let i = 0; i < 14; i++) {
                  const d = new Date(today);
                  d.setDate(today.getDate() + i);
                  const isoDate = d.toISOString().slice(0, 10);
                  
                  const days = ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'];
                  const dayName = (i === 0) ? 'Ma' : (i === 1) ? 'Holnap' : days[d.getDay()];
                  const num = d.getDate();
                  
                  const isActive = (activeDateFilter === isoDate);
                  
                  const borderStyle = isActive ? '1.5px solid var(--color-green)' : '1px solid rgba(255,255,255,0.20)';
                  const bgStyle = isActive ? 'rgba(13, 235, 107, 0.05)' : 'transparent';
                  const colorStyle = isActive ? 'var(--color-green)' : 'rgba(255,255,255,0.8)';
                  const titleColor = isActive ? 'var(--color-green)' : 'rgba(255,255,255,0.5)';
                  
                  html += \`
                      <div onclick="setDateFilter('\${isoDate}')" style="min-width: 48px; height: 56px; border-radius: 12px; border: \${borderStyle}; background: \${bgStyle}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease-in-out; flex-shrink: 0; box-sizing: border-box;">
                          <span style="font-size: 10px; font-weight: 400; color: \${titleColor}; margin-bottom: 2px;">\${dayName}</span>
                          <span style="font-size: 18px; font-weight: 600; color: \${colorStyle};">\${num}</span>
                      </div>
                  \`;
              }
              
              container.innerHTML = html;
          }`;

if (dateFilterRegex.test(content)) {
    content = content.replace(dateFilterRegex, newDateFilter);
    console.log("Success: date filter replaced.");
} else {
    console.log("Failed to match date filter.");
}

fs.writeFileSync(file, content);
