const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const toastCSS = `
        .toast-success {
            position: absolute;
            top: -60px; /* Hidden above the screen */
            left: 50%;
            transform: translateX(-50%);
            background: #10B981;
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(16,185,129,0.3);
            z-index: 10000;
            transition: top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            pointer-events: none;
            white-space: nowrap;
        }
        .toast-success.show {
            top: 24px;
        }
`;

if (!h.includes('.toast-success {')) {
    const styleClose = '    </style>';
    const idx = h.indexOf(styleClose);
    h = h.substring(0, idx) + toastCSS + '\n' + styleClose + h.substring(idx + styleClose.length);
    fs.writeFileSync('index.html', h, 'utf8');
    console.log('✅ Toast CSS injected');
} else {
    console.log('⚠️ Toast CSS already exists');
}
