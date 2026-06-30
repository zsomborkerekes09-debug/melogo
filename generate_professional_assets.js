const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("Starting professional assets generation...");
    
    // Choose the best logo source (prefer app_icon.png if it exists, otherwise app_icon_final.jpg)
    let logoPath = path.join(__dirname, 'frontend', 'app_icon.png');
    let mimeType = 'image/png';
    
    if (!fs.existsSync(logoPath)) {
        console.log("app_icon.png not found, falling back to app_icon_final.jpg");
        logoPath = path.join(__dirname, 'frontend', 'app_icon_final.jpg');
        mimeType = 'image/jpeg';
    } else {
        console.log("Using app_icon.png as source");
    }

    const imageBuffer = fs.readFileSync(logoPath);
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 1. Generate App Icon (1024x1024)
    // For a premium look, we give it a pure black background and let the logo fill most of it
    console.log("Generating icon.png...");
    await page.setViewport({ width: 1024, height: 1024 });
    await page.setContent(`
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1024px;
                    height: 1024px;
                    overflow: hidden;
                }
                img {
                    width: 900px;
                    height: 900px;
                    object-fit: contain;
                    border-radius: 180px; /* Slight rounded corners for premium feel */
                }
            </style>
        </head>
        <body>
            <img src="${dataUrl}" />
        </body>
        </html>
    `);
    await page.screenshot({ path: path.join(__dirname, 'assets', 'icon.png'), type: 'png' });

    // 2. Generate Splash Screen (2732x2732)
    // Premium apps like Uber, TikTok use a clean centered logo (about 20-25% of screen width) on a solid background
    console.log("Generating splash.png...");
    await page.setViewport({ width: 2732, height: 2732 });
    await page.setContent(`
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2732px;
                    height: 2732px;
                    overflow: hidden;
                }
                img {
                    width: 650px; /* Centered elegant size */
                    height: 650px;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            <img src="${dataUrl}" />
        </body>
        </html>
    `);
    await page.screenshot({ path: path.join(__dirname, 'assets', 'splash.png'), type: 'png' });

    await browser.close();
    console.log("Assets generation complete! Generated:");
    console.log(" - assets/icon.png");
    console.log(" - assets/splash.png");
})();
