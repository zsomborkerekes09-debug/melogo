const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const pickerCSS = `
        /* Job Picker Sheet Styles */
        .job-picker-header {
            background-color: #F3F4F6;
            color: #6B7280;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 8px 20px;
            letter-spacing: 0.5px;
            margin-top: 8px;
        }
        .job-picker-header:first-child {
            margin-top: 0;
        }
        .job-picker-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #F3F4F6;
            font-size: 15px;
            font-weight: 500;
            color: #1F2937;
            cursor: pointer;
            background-color: #fff;
            transition: background-color 0.15s;
        }
        .job-picker-item:active {
            background-color: #F9FAFB;
        }
        .job-picker-item:last-child {
            border-bottom: none;
        }
`;

if (!h.includes('.job-picker-item {')) {
    const styleClose = '    </style>';
    const idx = h.indexOf(styleClose);
    h = h.substring(0, idx) + pickerCSS + '\n' + styleClose + h.substring(idx + styleClose.length);
    fs.writeFileSync('index.html', h, 'utf8');
    console.log('✅ Job picker CSS injected');
} else {
    console.log('⚠️ Job picker CSS already exists');
}
