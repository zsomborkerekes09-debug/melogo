const fs = require('fs');

const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(path, 'utf8');

const oldStr = `                html += \`
                    <div onclick="setDateFilter('\${isoDate}')" style="min-width: 52px; height: 64px; border-radius: 12px; border: 1px solid \${isActive ? '#FFFFFF' : '#333336'}; background: \${isActive ? '#FFFFFF' : '#1D1D1F'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box;">
                        <span style="font-size: 11px; font-weight: 500; color: \${isActive ? '#000000' : '#F5F5F7'}; margin-bottom: 2px;">\${dayName}</span>
                        <span style="font-size: 16px; font-weight: 600; color: \${isActive ? '#000000' : '#F5F5F7'};">\${num}</span>
                    </div>
                \`;`;

const newStr = `                html += \`
                    <div onclick="setDateFilter('\${isoDate}')" style="min-width: 52px; height: 64px; border-radius: 12px; border: 0.5px solid \${isActive ? 'rgba(255,255,255,0.15)' : '#333336'}; background: \${isActive ? 'rgba(255,255,255,0.15)' : '#1D1D1F'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box;">
                        <span style="font-size: 11px; font-weight: 300; color: #FFFFFF; margin-bottom: 2px; opacity: \${isActive ? '1' : '0.6'};">\${dayName}</span>
                        <span style="font-size: 16px; font-weight: 300; color: #FFFFFF; opacity: \${isActive ? '1' : '0.8'};">\${num}</span>
                    </div>
                \`;`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Success");
} else {
    console.log("Not found");
}
