
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
