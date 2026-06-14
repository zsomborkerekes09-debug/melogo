import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace CSS
html = re.sub(r'--color-navy: var\(--color-text\);', '--color-navy: #0A0F2E;', html)
html = re.sub(r'--color-text: var\(--color-text\);', '--color-text: #0A0F2E;', html)
html = re.sub(r'--color-text-light: var\(--color-text\);', '--color-text-light: #4A5568;', html)
html = re.sub(r'--color-border: var\(--color-text\);', '--color-border: #E2E8F0;', html)

# Clean Leaflet script tag
html = re.sub(r'<script src="https://unpkg\.com/leaflet@1\.9\.4/dist/leaflet\.js">.*?</script>', '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>', html, flags=re.DOTALL)

# Fix sendChatLocation functions globally
pattern = r'function sendChatLocation\(\)\s*\{.*?function sendWorkerChatLocation\(\)\s*\{.*?\}'

fixed_code = '''function sendChatLocation() {
    const dest = currentMapCoords ? encodeURIComponent(currentMapCoords.address || 'Kaposvár') : 'Kaposv%C3%A1r';
    const link = <a href="https://www.google.com/maps/dir/?api=1&destination=" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>;
    const input = document.getElementById('chat-reply-input');
    if (input) {
        input.value = link;
        sendChatMessageNew(true);
    }
}
function sendWorkerChatLocation() {
    const dest = 'Kaposvár';
    const link = <a href="https://www.google.com/maps/dir/?api=1&destination=" target="_blank" style="color:#2563EB; text-decoration:underline;">📍 Helyszín megnyitása</a>;
    const input = document.getElementById('worker-chat-reply-input');
    if (input) {
        input.value = link;
        sendWorkerChatMessageNew(true);
    }
}'''

html = re.sub(pattern, fixed_code, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
