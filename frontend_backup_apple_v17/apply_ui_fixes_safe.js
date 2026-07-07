const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Splash screen sizing
content = content.replace(
    '<div style="font-size:44px;font-weight:700;color:#fff;font-family:\'DM Sans\',sans-serif;letter-spacing:-1.5px;animation: pulse 2s infinite;">Melo<span style="color:#22C55E;">Go</span></div>',
    '<div style="font-size:32px;font-weight:700;color:#fff;font-family:\'DM Sans\',sans-serif;letter-spacing:-1.5px;animation: pulse 2s infinite;">Melo<span style="color:#22C55E;">Go</span></div>'
);

// 2. Login page logo (melo to black)
content = content.replace(
    'style="font-size:36px; font-weight:800; font-family:\'DM Sans\',sans-serif; letter-spacing:-1.5px; color:#0A0F2E; width:160px; text-align:center; user-select:none;">Melo<span',
    'style="font-size:36px; font-weight:800; font-family:\'DM Sans\',sans-serif; letter-spacing:-1.5px; color:#000000; width:160px; text-align:center; user-select:none;">Melo<span'
);

// 3. Main page logo (melo to white, bolder)
content = content.replace(
    'class="brand-logo" style="margin:0 auto; user-select:none; display:flex; align-items:center; justify-content:center; letter-spacing:-1.5px;">Melo<span',
    'class="brand-logo" style="margin:0 auto; user-select:none; display:flex; align-items:center; justify-content:center; letter-spacing:-1.5px; color:#ffffff; font-weight:900;">Melo<span'
);

content = content.replace(
    'class="emp-welcome-title" style="margin:0; font-family:\'DM Sans\', sans-serif; font-size:24px; font-weight:800; letter-spacing:-1px; text-align:center;">Melo<span',
    'class="emp-welcome-title" style="margin:0; font-family:\'DM Sans\', sans-serif; font-size:24px; font-weight:900; letter-spacing:-1px; text-align:center; color:#ffffff;">Melo<span'
);

// 4. Nav bar capsule (bottom menu)
content = content.replace(
    '.bottom-nav {\n            position: fixed;\n            bottom: 0;\n            left: 0;\n            width: 100%;\n            background: rgba(255, 255, 255, 0.96);\n            backdrop-filter: blur(20px);\n            -webkit-backdrop-filter: blur(20px);\n            display: flex;\n            justify-content: space-around;\n            align-items: center;\n            padding: 12px 16px;\n            padding-bottom: env(safe-area-inset-bottom, 12px);\n            z-index: 100;\n            border-top: 1px solid rgba(229, 231, 235, 0.5);\n            border-radius: 32px 32px 0 0;\n            box-shadow: 0 -4px 20px rgba(0,0,0,0.03);\n        }',
    '.bottom-nav {\n            position: fixed;\n            bottom: 0;\n            left: 0;\n            width: 100%;\n            background: #ffffff;\n            display: flex;\n            justify-content: space-around;\n            align-items: center;\n            padding: 12px 16px;\n            padding-bottom: env(safe-area-inset-bottom, 12px);\n            z-index: 100;\n            border-top: 1px solid #e5e7eb;\n            border-radius: 32px 32px 0 0;\n            box-shadow: 0 -4px 20px rgba(0,0,0,0.03);\n        }'
);

content = content.replace(
    '.nav-item.active {\n            color: #22C55E;\n        }',
    '.nav-item.active {\n            color: #000000;\n        }'
);

content = content.replace(
    '.nav-item.active svg {\n            color: #22C55E;\n            stroke: #22C55E;\n            fill: rgba(34, 197, 94, 0.15);\n            filter: drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3));\n        }',
    '.nav-item.active svg {\n            color: #000000;\n            stroke: #000000;\n            fill: rgba(0, 0, 0, 0.15);\n            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));\n        }'
);

content = content.replace(
    '.nav-item.active .nav-label {\n            font-weight: 700;\n            color: #16A34A;\n        }',
    '.nav-item.active .nav-label {\n            font-weight: 700;\n            color: #000000;\n        }'
);

content = content.replace(
    '.nav-item {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n            background: none;\n            border: none;\n            color: #6B7280;\n            text-decoration: none;\n            flex: 1;\n            position: relative;\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            padding: 0 4px;\n        }',
    '.nav-item {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n            background: none;\n            border: none;\n            color: #000000;\n            text-decoration: none;\n            flex: 1;\n            position: relative;\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            padding: 0 4px;\n        }'
);

content = content.replace(
    '.nav-icon {\n            width: 26px;\n            height: 26px;\n            margin-bottom: 4px;\n            stroke-width: 2;\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n        }',
    '.nav-icon {\n            width: 26px;\n            height: 26px;\n            margin-bottom: 4px;\n            stroke-width: 2;\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            color: #000000;\n            stroke: #000000;\n        }'
);

// Force Dark Mode fix
content = content.replace(
    '<meta name="color-scheme" content="light">',
    '' // Remove it if it exists
);
content = content.replace(
    '<meta charset="UTF-8">',
    '<meta charset="UTF-8">\n    <meta name="color-scheme" content="light">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('UI Fixes applied cleanly!');
