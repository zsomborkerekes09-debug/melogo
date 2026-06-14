const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix CSS
html = html.replace(/--color-navy: var\(--color-text\);/, '--color-navy: #0A0F2E;');
html = html.replace(/--color-text: var\(--color-text\);/, '--color-text: #0A0F2E;');
html = html.replace(/--color-text-light: var\(--color-text\);/, '--color-text-light: #4A5568;');
html = html.replace(/--color-border: var\(--color-text\);/, '--color-border: #E2E8F0;');

// Clean leaflet
const leafletRegex = /<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js">[\s\S]*?<\/script>/;
html = html.replace(leafletRegex, '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');

// Replace ALL broken sendChatLocation occurrences
const brokenRegex = /function sendChatLocation\(\) \{[\s\S]*?function sendWorkerChatLocation\(\) \{[\s\S]*?\}/g;

const fixedBase64 = 'ZnVuY3Rpb24gc2VuZENoYXRMb2NhdGlvbigpIHsKICAgIGNvbnN0IGRlc3QgPSBjdXJyZW50TWFwQ29vcmRzID8gZW5jb2RlVVJJQ29tcG9uZW50KGN1cnJlbnRNYXBDb29yZHMuYWRkcmVzcyB8fCAnS2Fwb3N2w6FyJykgOiAnS2Fwb3N2JUMzJUExcic7CiAgICBjb25zdCBsaW5rID0gYDxhIGhyZWY9Imh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9kaXIvP2FwaT0xJmRlc3RpbmF0aW9uPSR7ZGVzdH0iIHRhcmdldD0iX2JsYW5rIiBzdHlsZT0iY29sb3I6IzI1NjNFQjsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZTsiPvCfk40gSGVseXN6w61uIG1lZ255aXTDoXNhPC9hPmA7CiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0LXJlcGx5LWlucHV0Jyk7CiAgICBpZiAoaW5wdXQpIHsKICAgICAgICBpbnB1dC52YWx1ZSA9IGxpbms7CiAgICAgICAgc2VuZENoYXRNZXNzYWdlTmV3KHRydWUpOQogICAgfQp9CmZ1bmN0aW9uIHNlbmRXb3JrZXJDaGF0TG9jYXRpb24oKSB7CiAgICBjb25zdCBkZXN0ID0gJ0thcG9zdsOhcic7CiAgICBjb25zdCBsaW5rID0gYDxhIGhyZWY9Imh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9kaXIvP2FwaT0xJmRlc3RpbmF0aW9uPSR7ZGVzdH0iIHRhcmdldD0iX2JsYW5rIiBzdHlsZT0iY29sb3I6IzI1NjNFQjsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZTsiPvCfk40gSGVseXN6w61uIG1lZ255aXTDoXNhPC9hPmA7CiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JrZXItY2hhdC1yZXBseS1pbnB1dCcpOwogICAgaWYgKGlucHV0KSB7CiAgICAgICAgaW5wdXQudmFsdWUgPSBsaW5rOwogICAgICAgIHNlbmRXb3JrZXJDaGF0TWVzc2FnZU5ldyh0cnVlKTsKICAgIH0KfQ==';
const fixedFuncs = Buffer.from(fixedBase64, 'base64').toString('utf8');

html = html.replace(brokenRegex, fixedFuncs);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed using base64 string!');
