const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Remove !important from the input[type="range"] background in CSS so the JS gradient can take effect
content = content.replace(/input\[type="range"\] \{\s*background:\s*rgba\(255,255,255,0.15\)\s*!important;/g, 'input[type="range"] {\n    background: rgba(255,255,255,0.15);');

// Make sure updateSliderTrack is called when the modal opens or at least when the script loads
const callUpdate = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        if(typeof updateSliderTrack === 'function') {
            updateSliderTrack();
        }
    });
</script>
`;
content = content.replace(/<\/body>/, callUpdate + '\n</body>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed slider !important issue');
