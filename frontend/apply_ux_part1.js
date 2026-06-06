const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. EMPTY STATES
h = h.replace(/Nincs találat a szűrők alapján/g, "Úgy néz ki, ma mindenki pihen 😴 — próbálj nagyobb hatókört!");
h = h.replace(/Nincs aktív hirdetésed/g, "Még nincs aktív hirdetésed. Ideje feladni egyet!");
h = h.replace(/<div style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 40px;">Még nincsenek üzeneteid.<\/div>/g, 
    '<div style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 40px;">Még csend van itt. De ez hamar megváltozik.</div>');

// 2. ONBOARDING TEXTS
h = h.replace(/placeholder="Email cím"/g, 'placeholder="Hova küldjük a foglalásaid?"');
h = h.replace(/placeholder="Jelszó"/g, 'placeholder="Válassz egy jelszót amit nem felejtesz el."');

// 3. LOGO KERNING
// `<div class="login-logo">Melo<span>Go</span></div>`
// `<div class="logo"><span class="white">Melo</span><span class="green">Go</span></div>`
const logoCSS = `
        .login-logo { letter-spacing: -1px; }
        .logo { letter-spacing: -1px; }
`;
if (!h.includes('letter-spacing: -1px;')) {
    h = h.replace('</style>', logoCSS + '\n    </style>');
}

// 4. DYNAMIC GREETING & HOLIDAYS
const greetingJS = `
        function getGreeting(name) {
            const hour = new Date().getHours();
            const date = new Date();
            
            // Holiday override
            if (date.getMonth() === 7 && date.getDate() === 20) {
                return \`Boldog államalapítást, \${name}! 🇭🇺\`;
            }
            
            if (hour < 10) return \`Jó reggelt, \${name}!\`;
            if (hour >= 19) return \`Jó estét, \${name}!\`;
            return \`Szia, \${name}!\`;
        }
        function updateGreetings() {
            const firstName = (localStorage.getItem('melogo_name') || 'Bence').split(' ')[0];
            const greeting = getGreeting(firstName);
            document.querySelectorAll('.greeting-text').forEach(el => el.innerText = greeting);
        }
`;
// Need to add `.greeting-text` class to the headers where it says "Szia Bence"
h = h.replace(/<h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Szia Bence!<\/h1>/g, 
    '<h1 class="greeting-text" style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Szia, Bence!</h1>');
h = h.replace(/<h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Szia János!<\/h1>/g, 
    '<h1 class="greeting-text" style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Szia, János!</h1>');

if (!h.includes('function getGreeting')) {
    h = h.replace('window.onload = function() {', greetingJS + '\n        window.onload = function() {');
    // call it on load
    h = h.replace('switchRole(savedRole);', 'switchRole(savedRole);\n                    updateGreetings();');
    h = h.replace("switchRole('worker');", "switchRole('worker');\n                    updateGreetings();");
}

// 5. FIRST JOB CELEBRATION
const confettiCSS = `
        #celebration-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(10, 15, 46, 0.95);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
        #celebration-overlay.show {
            opacity: 1;
            pointer-events: auto;
        }
        .celeb-title { font-size: 28px; font-weight: 700; margin-bottom: 16px; }
        .celeb-amount { font-size: 48px; font-weight: 800; color: var(--color-green); margin-bottom: 32px; }
        .celeb-btn { background: var(--color-green); color: white; padding: 16px 32px; border-radius: 20px; font-weight: 600; font-size: 16px; border: none; cursor: pointer; }
`;
if (!h.includes('#celebration-overlay')) {
    h = h.replace('</style>', confettiCSS + '\n    </style>');
    h = h.replace('</body>', `
    <div id="celebration-overlay">
        <div style="font-size: 64px; margin-bottom: 24px;">🎉</div>
        <div class="celeb-title">Megcsináltad az első melód!</div>
        <div class="celeb-amount" id="celeb-amount-text">12 000 Ft</div>
        <button class="celeb-btn" onclick="document.getElementById('celebration-overlay').classList.remove('show')">Király!</button>
    </div>\n</body>`);
}

// 6. AVATAR GRADIENT HASH
const avatarHashJS = `
        function getAvatarGradient(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            const c1 = Math.abs((hash * 123) % 360);
            const c2 = Math.abs((hash * 321) % 360);
            return \`linear-gradient(135deg, hsl(\${c1}, 70%, 60%), hsl(\${c2}, 70%, 50%))\`;
        }
        
        function updateAvatars() {
            document.querySelectorAll('.avatar-circle').forEach(el => {
                const name = el.getAttribute('data-name') || 'Bence';
                el.style.background = getAvatarGradient(name);
                el.style.color = 'white';
                el.style.border = '3px solid white';
            });
        }
`;
if (!h.includes('getAvatarGradient')) {
    h = h.replace('window.onload = function() {', avatarHashJS + '\n        window.onload = function() {');
    h = h.replace('updateGreetings();', 'updateGreetings(); updateAvatars();');
}
// Update HTML avatars to use data-name
h = h.replace(/<div class="profile-img">/g, '<div class="profile-img avatar-circle" data-name="Kovács Bence" style="display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">KB</div>');
// Remove existing img tag in profile
h = h.replace(/<img src="https:\/\/i\.pravatar\.cc\/150\?img=33"[^>]*>/g, '');

// 7. CARD LEFT BORDER ACCENT & SHIMMER & SLIDE DOWN
const cardAccentCSS = `
        .job-card {
            border-left-width: 3px !important;
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            overflow: hidden; /* for shimmer */
        }
        .cat-accent-Kert { border-left-color: #16a34a !important; }
        .cat-accent-Festés { border-left-color: #d97706 !important; } /* Amber */
        .cat-accent-Autó { border-left-color: #3b82f6 !important; } /* Blue */
        .cat-accent-Ház { border-left-color: #1e3a8a !important; } /* Navy */

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .job-card::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transform: translateX(-100%);
        }
        .job-card.shimmer::after {
            animation: shimmer 0.4s ease-out forwards;
        }

        @keyframes slideDownIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .slide-down-in { animation: slideDownIn 0.3s ease-out forwards; }
`;
if (!h.includes('.cat-accent-Kert')) {
    h = h.replace('</style>', cardAccentCSS + '\n    </style>');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Part 1 applied');
