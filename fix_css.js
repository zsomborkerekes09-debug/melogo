const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const additionalCss = `
        /* Job List Fix */
        .job-list {
            flex-direction: column;
        }
        
        /* Bottom Nav Fix */
        .bottom-nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background-color: #fff;
            border-top: 1px solid var(--color-border);
            padding-top: 12px;
            padding-bottom: 24px;
            flex-shrink: 0;
            z-index: 100;
            width: 100%;
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: #9CA3AF;
            cursor: pointer;
            gap: 4px;
            width: 25%;
        }
        .nav-item.active {
            color: var(--color-navy);
        }
        .nav-item.active svg {
            color: var(--color-navy);
            stroke-width: 3;
        }
        .nav-icon {
            width: 24px;
            height: 24px;
        }
        .nav-label {
            font-size: 11px;
            font-weight: 600;
        }
        
        /* Desktop Info Hide */
        .desktop-info {
            display: none !important;
        }
        
        /* Profile Screens-Container Fix */
        #phone-app {
            display: flex;
            flex-direction: column;
        }
`;

html = html.replace('</style>', additionalCss + '\\n    </style>');

// In my Phase 6 refactor I also set the body CSS.
// But earlier I had issues with `.screens-container` because the slider might be closed properly but wait, the bottom nav is OUTSIDE the screens-container?
// Let's check where `bottom-nav` is.
fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed CSS appended!');
