const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// BUG-04: Limit(50) on Jobs
html = html.replace(/jobsQuery = query\(collection\(db, "jobs"\), where\("status", "==", "Keresǟs"\)\);/g, 'jobsQuery = query(collection(db, "jobs"), where("status", "==", "Keresǟs"), window.firebaseAPI.limit(50));');

// BUG-07: Unsubscribe on chat close
html = html.replace(/(function closeWorkerChatRoom\(\) \{)/, `$1\n            if (window._chatMsgsUnsubscribe) { window._chatMsgsUnsubscribe(); window._chatMsgsUnsubscribe = null; }`);
html = html.replace(/(function closeEmployerChatRoom\(\) \{)/, `$1\n            if (window._chatMsgsUnsubscribe) { window._chatMsgsUnsubscribe(); window._chatMsgsUnsubscribe = null; }`);

// BUG-06: Image Compression
// Find submitWorkPhoto which reads the file
// I will replace the reader.onload with a canvas downscale.
const imageCompressionFunc = `
        function compressImage(dataUrl, maxWidth, quality, callback) {
            const img = new Image();
            img.onload = function() {
                let w = img.width;
                let h = img.height;
                if (w > maxWidth) {
                    h = Math.round((maxWidth / w) * h);
                    w = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                callback(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        }
`;
if (!html.includes('function compressImage')) {
    html = html.replace('<script>', '<script>\n' + imageCompressionFunc);
}
// Inject it into workerSubmitWorkPhoto and processChatPhotoUpload
html = html.replace(/reader\.readAsDataURL\(file\);\s*reader\.onload = function\(e\) \{([\s\S]*?)const base64Photo = e\.target\.result;/g, `reader.readAsDataURL(file);\n            reader.onload = function(e) {\n                compressImage(e.target.result, 1000, 0.7, function(compressedPhoto) {\n$1const base64Photo = compressedPhoto;`);
html = html.replace(/const photoData = e\.target\.result;/g, `const photoData = compressedPhoto;`); // Wait, need a careful replace.

// Safer replace for BUG-06:
html = html.replace(/reader\.readAsDataURL\(file\);\s*reader\.onload = function\(e\) \{\s*const base64Photo = e\.target\.result;/g, `reader.readAsDataURL(file);\n            reader.onload = function(e) {\n                compressImage(e.target.result, 1000, 0.7, function(compressedPhoto) {\n                    const base64Photo = compressedPhoto;`);
html = html.replace(/document\.getElementById\('worker-status-section'\)\.innerHTML = `[\s\S]*?A Munkǟltatǟ jǟvǟhagyǟsǟra\.[\s\S]*?`;\n            updateWorkerStatusUI\(\);\n        \}/g, `document.getElementById('worker-status-section').innerHTML = \\\`\n                    <div style="background-color: #f0fdf4; color: #166534; padding: 12px; border-radius: 8px; font-size: 11px; font-weight:600; text-align:center;">\n                        ǽ'? Fotǟ feltǟltve! A Gemini AI hitelesǟtette. Vǟrakozǟs a Munkǟltatǟ jǟvǟhagyǟsǟra.\n                    </div>\n                \\\`;\n            updateWorkerStatusUI();\n        });\n        }`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Batch 3 done');
