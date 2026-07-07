const fs = require('fs');

const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const newLines = `                    <div onclick="setDateFilter('\${isoDate}')" style="min-width: 52px; height: 64px; border-radius: 12px; border: 0.5px solid \${isActive ? 'rgba(255,255,255,0.15)' : '#333336'}; background: \${isActive ? 'rgba(255,255,255,0.15)' : '#1D1D1F'}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; box-sizing: border-box;">
                        <span style="font-size: 11px; font-weight: 300; color: #FFFFFF; margin-bottom: 2px; opacity: \${isActive ? '1' : '0.6'};">\${dayName}</span>
                        <span style="font-size: 16px; font-weight: 300; color: #FFFFFF; opacity: \${isActive ? '1' : '0.8'};">\${num}</span>
                    </div>`;

// Find the index of the old div
let targetIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('setDateFilter') && lines[i].includes('min-width: 52px')) {
        targetIdx = i;
        break;
    }
}

if (targetIdx !== -1) {
    // Replace 4 lines (the div and two spans and closing div)
    lines.splice(targetIdx, 4, newLines);
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    console.log("Success! Spliced at line " + targetIdx);
} else {
    console.log("Not found.");
}
