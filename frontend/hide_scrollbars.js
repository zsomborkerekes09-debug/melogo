const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const scrollbarCSS = `
        /* Hide scrollbars but keep scrolling functionality */
        .screen::-webkit-scrollbar, 
        .job-picker-list::-webkit-scrollbar,
        .settings-scroll::-webkit-scrollbar,
        .chat-body::-webkit-scrollbar,
        .emp-form-body::-webkit-scrollbar,
        #job-picker-list::-webkit-scrollbar {
            display: none;
        }
        .screen, .job-picker-list, .settings-scroll, .chat-body, .emp-form-body, #job-picker-list {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
`;

if (!h.includes('/* Hide scrollbars')) {
    const styleClose = '    </style>';
    const idx = h.indexOf(styleClose);
    h = h.substring(0, idx) + scrollbarCSS + '\n' + styleClose + h.substring(idx + styleClose.length);
    fs.writeFileSync('index.html', h, 'utf8');
    console.log('✅ Scrollbar hiding CSS injected');
} else {
    console.log('⚠️ Scrollbar hiding CSS already exists');
}
