const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
    });
    
    page.on('pageerror', err => {
        console.log('PAGE ERROR:', err.message);
    });

    console.log('Navigating to file...');
    await page.goto('file://C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html');
    
    // Wait for the auth wrapper or wait a bit
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Test successful! Closing browser...');
    await browser.close();
})();
