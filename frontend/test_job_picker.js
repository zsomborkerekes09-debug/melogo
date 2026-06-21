const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

    await page.goto('file://' + __dirname + '/index.html', { waitUntil: 'networkidle0' });
    
    console.log("Setting localStorage...");
    await page.evaluate(() => {
        localStorage.setItem('melogo_session', JSON.stringify({ name: 'Worker', email: 'w@w.com', role: 'worker', uid: 'w1' }));
        localStorage.setItem('melogo_role', 'worker');
    });

    console.log("Reloading...");
    await page.reload({ waitUntil: 'networkidle0' });

    console.log("Clicking worker-job-filter-display...");
    await page.click('#worker-job-filter-display');
    
    console.log("Wait for a bit...");
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Done.");
    await browser.close();
})();
