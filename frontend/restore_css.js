const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const overlayCSS = `
        /* OVERLAYS CSS RESTORED */
        .action-overlay, .settings-overlay, .overlay-success, .confirm-sheet {
            position: absolute;
            left: 0;
            width: 100%;
            background-color: #fff;
            z-index: 2000;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }

        .action-overlay {
            bottom: 0;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
            max-height: 90%;
        }
        .action-overlay.active {
            transform: translateY(0);
        }

        .action-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background-color: var(--color-navy);
            color: #fff;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
        }

        .settings-overlay {
            bottom: 0;
            height: 100%;
            background-color: #F8F9FB;
        }
        .settings-overlay.open {
            transform: translateY(0);
        }

        .overlay-success {
            bottom: 0;
            height: 100%;
            align-items: center;
            justify-content: center;
            background-color: #fff;
        }
        .overlay-success.active {
            transform: translateY(0);
        }

        .confirm-sheet {
            bottom: 0;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 20px 24px 32px 24px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
            z-index: 3001;
            max-height: 80%;
        }
        .confirm-sheet.open {
            transform: translateY(0);
        }
        
        .confirm-sheet-backdrop {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 3000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .confirm-sheet-backdrop.open, .confirm-sheet-backdrop.active {
            opacity: 1;
            pointer-events: auto;
        }

        .confirm-sheet-handle {
            width: 40px; height: 4px;
            background-color: #E5E7EB;
            border-radius: 2px;
            margin: 0 auto 20px auto;
        }
        .confirm-sheet-title {
            font-size: 20px; font-weight: 800; color: var(--color-navy);
            margin-bottom: 8px; text-align: center;
        }
        .confirm-sheet-desc {
            font-size: 14px; color: var(--color-text);
            text-align: center; margin-bottom: 24px;
        }
        
        /* Job Detail Layout inside Action Overlay */
        .chat-body {
            padding: 20px;
            flex-grow: 1;
            overflow-y: auto;
            background-color: #F8F9FB;
            display: flex;
            flex-direction: column;
        }
`;

html = html.replace('</style>', overlayCSS + '\n    </style>');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Restored overlay CSS');
