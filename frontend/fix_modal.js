const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const insertHtml = `
<!-- Legal Modal -->
<div id="legal-modal" class="hidden" style="position:fixed; top:0; left:0; right:0; bottom:0; background:var(--color-bg); z-index:9999; display:flex; flex-direction:column;">
    <div style="height: 50px; display:flex; align-items:center; justify-content:space-between; padding: 0 16px; border-bottom: 1px solid var(--color-border); padding-top: env(safe-area-inset-top); background: var(--color-bg);">
        <button onclick="closeLegalModal()" style="background:none; border:none; color:var(--color-text); font-size:16px; font-weight:600; padding:10px;">Vissza</button>
        <span id="legal-modal-title" style="font-weight:600; font-size: 16px; color:var(--color-text);"></span>
        <div style="width:60px;"></div>
    </div>
    <iframe id="legal-iframe" style="flex:1; border:none; width:100%;" src=""></iframe>
</div>
<script>
function openLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const iframe = document.getElementById('legal-iframe');
    const title = document.getElementById('legal-modal-title');
    if (type === 'terms') {
        title.innerText = 'ÁSZF';
        iframe.src = 'terms.html';
    } else {
        title.innerText = 'Adatvédelem';
        iframe.src = 'privacy-policy.html';
    }
    modal.classList.remove('hidden');
}
function closeLegalModal() {
    document.getElementById('legal-modal').classList.add('hidden');
    document.getElementById('legal-iframe').src = '';
}
</script>
`;

if (!code.includes('id="legal-modal"')) {
    code = code.replace('</body>', insertHtml + '\n</body>');
}
code = code.replace(/window\.open\('terms\.html',\s*'_blank'\)/g, "openLegalModal('terms')");
code = code.replace(/window\.open\('privacy\.html',\s*'_blank'\)/g, "openLegalModal('privacy')");
code = code.replace(/window\.open\('privacy-policy\.html',\s*'_blank'\)/g, "openLegalModal('privacy')");

fs.writeFileSync(path, code);
console.log('Legal modal injected');
