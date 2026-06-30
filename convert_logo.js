const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("Starting conversion...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Read the jpg file and convert to base64
    const jpgPath = path.join(__dirname, 'frontend', 'app_icon_final.jpg');
    const imageBuffer = fs.readFileSync(jpgPath);
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    // Set viewport to 1024x1024
    await page.setViewport({ width: 1024, height: 1024 });

    // Load HTML with the image
    await page.setContent(`
        <style>
            body { margin: 0; padding: 0; background: #011E41; display: flex; align-items: center; justify-content: center; width: 1024px; height: 1024px; }
            img { width: 1024px; height: 1024px; object-fit: contain; }
        </style>
        <img src="${dataUrl}" />
    `);

    // Take screenshot as PNG
    await page.screenshot({ path: path.join(__dirname, 'assets', 'icon.png'), type: 'png' });
    await page.screenshot({ path: path.join(__dirname, 'assets', 'splash.png'), type: 'png' });

    await browser.close();
    console.log("Conversion complete! Created assets/icon.png and assets/splash.png");
})();
