const fs = require('fs');
const p = 'frontend/index.html';
let h = fs.readFileSync(p, 'utf8');

// 1. Role button style
h = h.replace(/\.role-btn\.active\s*\{[^}]+\}/, `.role-btn.active {
            background-color: var(--color-text);
            color: var(--color-bg);
            border-radius: 20px;
        }`);

h = h.replace('<button class="role-btn active" id="role-btn-worker" onclick="switchRole(\'worker\')" style="color: var(--color-text);">Munkás</button>', '<button class="role-btn active" id="role-btn-worker" onclick="switchRole(\'worker\')">Munkás</button>');

h = h.replace('<button class="role-btn" id="role-btn-employer" onclick="switchRole(\'employer\')" style="color: var(--color-text);">Megbízó</button>', '<button class="role-btn" id="role-btn-employer" onclick="switchRole(\'employer\')">Megbízó</button>');

// 2. Employer Form CSS
h = h.replace(/\.emp-form-section\s*\{[\s\S]*?border: 1px solid #FFFFFF;\s*\}/, `.emp-form-section {
            background: transparent;
            border-radius: 0;
            padding: 24px 0;
            margin-bottom: 0;
            border: none;
            border-bottom: 1px solid var(--color-text);
        }
        .emp-form-section:last-child {
            border-bottom: none;
        }`);

// 3. Emojis
h = h.replace('✅ Mi biztosítjuk', '📦 Mi biztosítjuk');
h = h.replace('🔧 A munkásnak kell hoznia', '🔧 Munkás hozza');
h = h.replace("locText += ' • 🔴 SÜRGŐS!';", "locText += ' • 🚨 Sürgős!';");
h = h.replace("locText += ' • 🧰 Munkás hozza az eszközt';", "locText += ' • 🔧 Munkás hozza';");
h = h.replace("locText += ' • 🛠️ Megbízó adja az eszközt';", "locText += ' • 📦 Megbízó biztosítja';");

fs.writeFileSync(p, h);
console.log('Done!');
