const fs = require('fs');
let h = fs.readFileSync('frontend/index.html', 'utf8');

// Find the broken items.forEach block and replace it
const startMarker = 'items.forEach(item => {\n                    const isSel = selectedExactJob === item.name;\n                    html += `\n                        ';
const endMarker = 'list.innerHTML = html;\n            }\n        }\n\n        function jpDrillInto';

// Find by searching for the unique broken pattern
const brokenIdx = h.indexOf('&quot;');
if (brokenIdx === -1) {
    console.log('No &quot; found - may already be fixed or different issue');
    // Print JS parse test
    process.exit(0);
}
console.log('Found &quot; at index:', brokenIdx);
console.log('Context:', h.slice(brokenIdx - 100, brokenIdx + 100));

// Replace just the broken onclick line
const OLD_ONCLICK = `onclick="selectJobPickerItem('` + `\${item.name.replace(/'/g, &quot;\\\\&apos;&quot;)}', '\${item.name.replace(/'/g, &quot;\\\\&apos;&quot;)}')"`;
const NEW_ONCLICK = `onclick="selectJobPickerItem(this.dataset.v,this.dataset.v)" data-v="\${safeName}"`;

if (!h.includes('&quot;')) {
    console.log('Already clean');
} else {
    // Find items.forEach block and replace entire block
    const BLOCK_START = 'items.forEach(item => {';
    const BLOCK_END = '});\n\n                list.innerHTML = html;';
    
    const bi = h.indexOf(BLOCK_START, h.indexOf('jobPickerDrillCat'));
    const be = h.indexOf(BLOCK_END, bi);
    
    console.log('Block start:', bi, 'Block end:', be);
    
    if (bi !== -1 && be !== -1) {
        const newBlock = `items.forEach(item => {
                    const isSel = selectedExactJob === item.name;
                    const safeName = item.name.replace(/'/g, '&#39;');
                    html += '<div class="job-picker-item" onclick="selectJobPickerItem(this.dataset.v,this.dataset.v)" data-v="' + safeName + '">' +
                            '<span>' + item.name + '</span>' +
                            (isSel ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
                            '</div>';
                });

                list.innerHTML = html;`;
        
        h = h.slice(0, bi) + newBlock + h.slice(be + BLOCK_END.length);
        fs.writeFileSync('frontend/index.html', h);
        console.log('Fixed!');
    } else {
        console.log('Could not find block boundaries. bi=' + bi + ' be=' + be);
    }
}
