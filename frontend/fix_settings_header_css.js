const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const headerCSS = `
        .settings-header {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60px;
            background: #fff;
            border-bottom: 1px solid #E5E7EB;
            position: relative;
            flex-shrink: 0;
            border-radius: 40px 40px 0 0;
        }
        .settings-header .settings-back-btn {
            position: absolute;
            left: 16px;
        }
        .settings-title {
            font-size: 17px;
            font-weight: 600;
            color: #1F2937;
        }
`;

if (!h.includes('.settings-header {')) {
    const styleClose = '    </style>';
    const idx = h.indexOf(styleClose);
    h = h.substring(0, idx) + headerCSS + '\n' + styleClose + h.substring(idx + styleClose.length);
    fs.writeFileSync('index.html', h, 'utf8');
    console.log('✅ Settings header CSS injected');
} else {
    console.log('⚠️ Settings header CSS already exists');
}
