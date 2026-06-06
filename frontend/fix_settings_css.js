const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const settingsCSS = `
        /* Apple-style Settings Screen CSS */
        .settings-overlay {
            background-color: #F3F4F6 !important; /* iOS gray background */
        }
        .settings-scroll {
            padding-bottom: 120px;
        }
        .settings-group-label {
            padding: 24px 16px 8px 16px;
            font-size: 13px;
            text-transform: uppercase;
            color: #6B7280;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .settings-card {
            background: #fff;
            margin: 0 16px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .settings-row {
            display: flex;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid #F3F4F6;
            cursor: pointer;
            transition: background 0.15s;
        }
        .settings-row:active {
            background: #F9FAFB;
        }
        .settings-row:last-child {
            border-bottom: none;
        }
        .settings-row-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #F3F4F6;
            color: #4B5563;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        }
        .settings-row-label {
            flex: 1;
            font-size: 16px;
            font-weight: 500;
            color: #1F2937;
        }
        .settings-chevron {
            color: #9CA3AF;
        }
        .settings-textarea {
            width: 100%;
            border: none;
            padding: 12px 16px;
            font-size: 15px;
            resize: none;
            background: transparent;
            outline: none;
            color: #1F2937;
            height: 100px;
            font-family: inherit;
        }
        .settings-textarea::placeholder {
            color: #9CA3AF;
        }
        .char-counter {
            display: block;
            text-align: right;
            padding: 0 16px 12px 16px;
            font-size: 12px;
            color: #9CA3AF;
        }
        .skill-selector-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 0 16px 16px 16px;
        }
        .skill-tag {
            padding: 6px 12px;
            border-radius: 20px;
            background: #F3F4F6;
            color: #4B5563;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid transparent;
            transition: all 0.2s;
        }
        .skill-tag.selected {
            background: #EFF6FF;
            color: #2563EB;
            border-color: #BFDBFE;
        }
        .availability-row {
            padding: 14px 16px;
        }
        .availability-options {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        .avail-btn {
            flex: 1;
            padding: 10px 0;
            border-radius: 10px;
            border: 1px solid #E5E7EB;
            background: #fff;
            color: #4B5563;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        #avail-active.active {
            background: #F0FDF4;
            color: #16A34A;
            border-color: #BBF7D0;
        }
        #avail-busy.active {
            background: #FEFCE8;
            color: #CA8A04;
            border-color: #FEF08A;
        }
        #avail-inactive.active {
            background: #F3F4F6;
            color: #374151;
            border-color: #E5E7EB;
        }
        .settings-save-btn {
            position: absolute;
            bottom: 30px;
            left: 20px;
            right: 20px;
            background: var(--color-navy);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 14px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(10,15,46,0.15);
            transition: transform 0.15s, background 0.15s;
        }
        .settings-save-btn:active {
            transform: scale(0.98);
        }
`;

if (!h.includes('.settings-group-label {')) {
    const styleClose = '    </style>';
    const idx = h.indexOf(styleClose);
    h = h.substring(0, idx) + settingsCSS + '\n' + styleClose + h.substring(idx + styleClose.length);
    fs.writeFileSync('index.html', h, 'utf8');
    console.log('✅ Settings CSS injected');
} else {
    console.log('⚠️ Settings CSS already exists');
}
