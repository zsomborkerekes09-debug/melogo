const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="hu">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                margin: 0;
                padding: 0;
                width: 1024px;
                height: 500px;
                background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: white;
                overflow: hidden;
            }
            .content {
                padding-left: 80px;
                z-index: 2;
                max-width: 500px;
            }
            .title {
                font-size: 80px;
                font-weight: 800;
                margin: 0;
                background: linear-gradient(90deg, #E2FF3D, #00FF88);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -2px;
            }
            .subtitle {
                font-size: 32px;
                font-weight: 300;
                margin-top: 10px;
                color: #dddddd;
            }
            .graphics {
                position: relative;
                width: 400px;
                height: 500px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 50px;
            }
            .circle1 {
                position: absolute;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: #E2FF3D;
                filter: blur(80px);
                opacity: 0.3;
                top: 50px;
                right: 50px;
            }
            .circle2 {
                position: absolute;
                width: 250px;
                height: 250px;
                border-radius: 50%;
                background: #00FF88;
                filter: blur(70px);
                opacity: 0.2;
                bottom: 20px;
                left: 20px;
            }
            .phone-mockup {
                width: 240px;
                height: 480px;
                background: #0a0a0a;
                border: 12px solid #222;
                border-radius: 36px;
                position: relative;
                z-index: 10;
                box-shadow: -20px 20px 50px rgba(0,0,0,0.8);
                transform: rotate(-10deg) translateY(30px);
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 20px;
            }
            .phone-screen {
                width: 216px;
                height: 430px;
                background: #111;
                border-radius: 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 30px;
            }
            .logo-text {
                font-size: 36px;
                font-weight: bold;
                color: white;
            }
            .logo-text span {
                color: #E2FF3D;
            }
            .job-card {
                width: 180px;
                height: 60px;
                background: #222;
                border-radius: 12px;
                margin-top: 20px;
                opacity: 0.8;
            }
            .job-card.green {
                border-left: 4px solid #00FF88;
            }
            .job-card.yellow {
                border-left: 4px solid #E2FF3D;
            }
            .abstract-shape {
                position: absolute;
                width: 800px;
                height: 800px;
                border: 2px solid rgba(226, 255, 61, 0.1);
                border-radius: 50%;
                top: -150px;
                right: -200px;
                z-index: 1;
            }
        </style>
    </head>
    <body>
        <div class="abstract-shape"></div>
        <div class="content">
            <h1 class="title">MeloGo</h1>
            <p class="subtitle">Vállalj melót. Keress embert. Gyorsan, egyszerűen.</p>
        </div>
        <div class="graphics">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="phone-mockup">
                <div class="phone-screen">
                    <div class="logo-text">Melo<span>Go</span></div>
                    <div class="job-card yellow"></div>
                    <div class="job-card green"></div>
                    <div class="job-card yellow" style="opacity: 0.5;"></div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    fs.writeFileSync('temp_banner.html', htmlContent);

    const browser = await puppeteer.launch({ executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
    await page.goto('file://' + __dirname + '/temp_banner.html');
    await page.screenshot({ path: 'C:/Users/zsomb/Desktop/MeloGo_Kiemelt_Grafika.png' });
    await browser.close();
    fs.unlinkSync('temp_banner.html');
    console.log('Done');
})();
