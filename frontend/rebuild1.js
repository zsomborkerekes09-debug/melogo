const fs = require('fs');

const css = `
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MeloGo</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-navy: #0A0F2E;
            --color-green: #22C55E;
            --color-bg: #F8F9FB;
            --color-text: #1F2937;
            --color-text-light: #6B7280;
            --color-border: #E5E7EB;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: #e5e5e5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .phone-container {
            width: 375px;
            height: 812px;
            background-color: #fff;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border-radius: 40px;
            display: flex;
            flex-direction: column;
        }

        .hidden { display: none !important; }

        /* Login Screen */
        #app-login-screen {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #fff;
            z-index: 1000;
            padding: 60px 24px 30px 24px;
            display: flex;
            flex-direction: column;
        }

        .login-logo {
            text-align: center;
            font-size: 36px;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            margin-bottom: 8px;
        }
        .login-logo span { color: var(--color-green); }

        .login-subtitle {
            text-align: center;
            color: var(--color-text-light);
            font-size: 15px;
            margin-bottom: 40px;
        }

        .role-cards {
            display: flex;
            gap: 16px;
            margin-bottom: 30px;
        }

        .role-card {
            flex: 1;
            background-color: #fff;
            border: 0.5px solid var(--color-border);
            border-radius: 16px;
            padding: 20px 16px;
            text-align: center;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
        }

        .role-card.active {
            border: 1.5px solid var(--color-green);
            background-color: #F0FDF4;
        }

        .role-card .check-icon {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 18px;
            height: 18px;
            background-color: var(--color-green);
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .role-card.active .check-icon {
            display: flex;
        }

        .role-card svg {
            margin-bottom: 12px;
            color: var(--color-navy);
        }

        .role-card-title {
            font-size: 15px;
            font-weight: 500;
            color: var(--color-text);
        }

        .login-input {
            width: 100%;
            background-color: var(--color-bg);
            border: none;
            border-radius: 12px;
            padding: 16px;
            font-size: 14px;
            margin-bottom: 16px;
            color: var(--color-text);
            outline: none;
        }

        .login-btn {
            width: 100%;
            background-color: var(--color-navy);
            color: #fff;
            border: none;
            border-radius: 24px;
            padding: 16px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            margin-top: auto;
            margin-bottom: 12px;
        }

        .face-id-btn {
            width: 100%;
            background-color: transparent;
            color: var(--color-navy);
            border: 1px solid var(--color-navy);
            border-radius: 24px;
            padding: 14px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 24px;
        }

        /* App Slider */
        .screens-container {
            flex: 1;
            position: relative;
            overflow: hidden;
            background-color: var(--color-bg);
        }

        #app-slider {
            display: flex;
            width: 400%;
            height: 100%;
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .screen {
            width: 25%;
            height: 100%;
            overflow-y: auto;
            position: relative;
            background-color: var(--color-bg);
        }

        /* Home Header */
        .header-midnight {
            background-color: var(--color-navy);
            padding: 48px 20px 24px 20px;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
        }

        .brand-logo {
            font-size: 32px;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            color: #fff;
            text-align: center;
            margin-bottom: 4px;
        }
        .brand-logo span { color: var(--color-green); }

        .welcome-text {
            font-size: 13px;
            font-weight: 300;
            color: rgba(255,255,255,0.7);
            text-align: center;
            margin-bottom: 20px;
        }

        .search-bar {
            background-color: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .search-bar input {
            background: none;
            border: none;
            color: #fff;
            width: 100%;
            font-size: 15px;
            outline: none;
        }
        .search-bar input::placeholder { color: rgba(255,255,255,0.5); }

        /* Job Cards */
        .job-list {
            padding: 20px;
        }
        
        .job-card {
            background: #fff;
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }

        .job-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .job-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-navy);
            margin-bottom: 4px;
        }

        .job-price {
            font-size: 16px;
            font-weight: 700;
            color: var(--color-green);
        }

        .job-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: var(--color-text-light);
            margin-bottom: 16px;
        }

        .job-meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .job-apply-btn {
            width: 100%;
            background-color: var(--color-navy);
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        /* Map Screen */
        .map-container {
            width: 100%;
            height: 100%;
            background-color: #E5E9F0; /* Map placeholder */
            position: relative;
        }

        .map-chips {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 8px;
            z-index: 10;
        }
        
        .map-chips::-webkit-scrollbar { display: none; }

        .map-chip {
            background-color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            color: var(--color-navy);
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .map-chip.active {
            background-color: var(--color-navy);
            color: #fff;
        }

        /* Messages Screen */
        .messages-header {
            padding: 40px 20px 20px 20px;
            background-color: #fff;
            border-bottom: 1px solid var(--color-border);
        }
        .messages-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--color-navy);
        }

        .chat-list {
            padding: 0;
        }

        .chat-item {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            background-color: #fff;
            border-bottom: 1px solid var(--color-border);
        }

        .chat-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #F3F4F6;
            margin-right: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 600;
            color: var(--color-navy);
        }

        .chat-details {
            flex: 1;
        }

        .chat-name {
            font-size: 15px;
            font-weight: 600;
            color: var(--color-navy);
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
        }

        .chat-time {
            font-size: 12px;
            color: var(--color-text-light);
            font-weight: 400;
        }

        .chat-msg {
            font-size: 14px;
            color: var(--color-text-light);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 220px;
        }
        
        .chat-unread {
            color: var(--color-text);
            font-weight: 500;
        }

        /* Common utilities */
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        
        /* Add some basic animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

<div id="app-login-screen">
    <div class="login-logo">Melo<span>Go</span></div>
    <div class="login-subtitle">Vállalj munkát a közeledben.</div>
    
    <div class="role-cards">
        <div class="role-card active" id="role-card-worker" onclick="selectLoginRole('worker')">
            <div class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <div class="role-card-title">Munkás</div>
        </div>
        <div class="role-card" id="role-card-employer" onclick="selectLoginRole('employer')">
            <div class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <div class="role-card-title">Megbízó</div>
        </div>
    </div>

    <input type="email" id="app-email" class="login-input" placeholder="Email cím" value="bence@melogo.hu">
    <input type="password" id="app-pw" class="login-input" placeholder="Jelszó" value="123456">
    
    <div style="text-align: right; margin-bottom: 40px;">
        <span style="color: var(--color-navy); font-size: 13px; font-weight: 500;">Elfelejtett jelszó?</span>
    </div>

    <button class="login-btn" onclick="loginApp()">Regisztrálok & Bejelentkezem</button>
    <button class="face-id-btn" onclick="loginAppFaceID()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3a2 2 0 0 0-2 2v4"></path><path d="M19 3a2 2 0 0 1 2 2v4"></path><path d="M5 21a2 2 0 0 1-2-2v-4"></path><path d="M19 21a2 2 0 0 0 2-2v-4"></path><path d="M9 9l.01 0"></path><path d="M15 9l.01 0"></path><path d="M12 15a3 3 0 0 0 3-3"></path></svg>
        Bejelentkezés Face ID-val
    </button>
    
    <div style="text-align: center; color: var(--color-text-light); font-size: 14px;">
        Már van fiókod? <span style="color: var(--color-navy); font-weight: 600;">Lépj be</span>
    </div>
</div>

<div id="phone-app" class="phone-container">
    <div class="screens-container">
        <div id="app-slider">
            
            <!-- SCREEN 0: HOME -->
            <div class="screen" id="app-home-screen">
                <div class="header-midnight">
                    <div class="brand-logo">Melo<span>Go</span></div>
                    <div class="welcome-text">Szia, Bence!</div>
                    
                    <div class="search-bar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Milyen munkát keresel?">
                    </div>
                </div>

                <div id="home-worker-view" class="job-list">
                    <div class="flex-between" style="margin-bottom: 16px;">
                        <h2 style="font-size: 18px; font-weight: 700; color: var(--color-navy);">Közeli munkák</h2>
                        <span style="font-size: 13px; color: var(--color-green); font-weight: 500;">Összes</span>
                    </div>

                    <!-- Job Card 1 -->
                    <div class="job-card">
                        <div class="job-card-header">
                            <div>
                                <div class="job-title">Fűnyírás a Desedánál</div>
                                <div style="font-size: 13px; color: var(--color-text-light);">Tóth János</div>
                            </div>
                            <div class="job-price">8 000 Ft</div>
                        </div>
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                2.5 km
                            </div>
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Ma 14:00
                            </div>
                        </div>
                        <button class="job-apply-btn" onclick="openWorkerJobDetail()">Részletek</button>
                    </div>

                    <!-- Job Card 2 -->
                    <div class="job-card">
                        <div class="job-card-header">
                            <div>
                                <div class="job-title">Kerítésfestés</div>
                                <div style="font-size: 13px; color: var(--color-text-light);">Nagy Péter</div>
                            </div>
                            <div class="job-price">12 000 Ft</div>
                        </div>
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                3.1 km
                            </div>
                            <div class="job-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Holnap 09:00
                            </div>
                        </div>
                        <button class="job-apply-btn">Részletek</button>
                    </div>
                </div>

                <div id="home-employer-view" class="job-list" style="display: none;">
                    <div class="flex-between" style="margin-bottom: 16px;">
                        <h2 style="font-size: 18px; font-weight: 700; color: var(--color-navy);">Aktív hirdetéseim</h2>
                    </div>
                    
                    <div style="background-color: #fff; border-radius: 20px; padding: 30px 20px; text-align: center; border: 1px dashed var(--color-border);">
                        <div style="width: 48px; height: 48px; background-color: #F3F4F6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-navy); margin-bottom: 8px;">Nincs aktív hirdetésed</h3>
                        <p style="font-size: 14px; color: var(--color-text-light); margin-bottom: 20px;">Keresel valakit a ház körüli munkákra? Adj fel egy hirdetést!</p>
                        <button onclick="openEmployerFormOverlay()" style="background-color: var(--color-navy); color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 500; cursor: pointer;">Hirdetés feladása</button>
                    </div>
                </div>
            </div>

            <!-- SCREEN 1: MAP -->
            <div class="screen" id="app-map-screen">
                <div class="map-container">
                    <img src="https://i.imgur.com/Bf0Yl3x.jpg" style="width: 100%; height: 100%; object-fit: cover;" alt="Map">
                    
                    <div class="map-chips">
                        <div class="map-chip active">Minden</div>
                        <div class="map-chip">Kertészet</div>
                        <div class="map-chip">Autómosás</div>
                        <div class="map-chip">Takarítás</div>
                        <div class="map-chip">Szerelés</div>
                    </div>
                    
                    <!-- Map Pin -->
                    <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); cursor: pointer;" onclick="document.getElementById('map-preview-card').style.display='block'">
                        <div style="background-color: var(--color-navy); color: white; padding: 6px 10px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.2); position: relative;">
                            8 000 Ft
                            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--color-navy);"></div>
                        </div>
                    </div>

                    <!-- Floating Job Card -->
                    <div id="map-preview-card" style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: none;">
                        <div class="job-card-header">
                            <div>
                                <div class="job-title">Fűnyírás a Desedánál</div>
                                <div style="font-size: 13px; color: var(--color-text-light);">Tóth János</div>
                            </div>
                            <div class="job-price">8 000 Ft</div>
                        </div>
                        <button class="job-apply-btn" onclick="openWorkerJobDetail()">Részletek megtekintése</button>
                    </div>
                </div>
            </div>

            <!-- SCREEN 2: MESSAGES -->
            <div class="screen" id="app-messages-screen">
                <div class="messages-header">
                    <div class="messages-title">Üzenetek</div>
                </div>
                <div class="chat-list">
                    <div class="chat-item" onclick="openChat()">
                        <div class="chat-avatar">TJ</div>
                        <div class="chat-details">
                            <div class="chat-name">Tóth János <span class="chat-time">10:42</span></div>
                            <div class="chat-msg chat-unread">Szia! Mikor tudnál jönni holnap?</div>
                        </div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-avatar">NP</div>
                        <div class="chat-details">
                            <div class="chat-name">Nagy Péter <span class="chat-time">Tegnap</span></div>
                            <div class="chat-msg">Tökéletes, köszönöm a munkát!</div>
                        </div>
                    </div>
                </div>
            </div>
`;
fs.writeFileSync('rebuilt_top.html', css, 'utf8');
console.log('rebuilt_top.html created!');
