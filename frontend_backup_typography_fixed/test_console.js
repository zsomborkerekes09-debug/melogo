const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
    
    console.log('Navigating to local index.html...');
    await page.goto('file:///C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', { waitUntil: 'networkidle2' });
    
    console.log('Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));
    
    const hasFirebaseAPI = await page.evaluate(() => {
        return !!window.firebaseAPI;
    });
    console.log('Has window.firebaseAPI?', hasFirebaseAPI);
    
    await browser.close();
    console.log('Done!');
})();
