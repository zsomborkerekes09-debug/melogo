const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

    await page.goto('file://' + __dirname + '/index.html', { waitUntil: 'load', timeout: 10000 });
    
    await page.evaluate(() => {
        localStorage.setItem('melogo_session', JSON.stringify({ name: 'Worker', email: 'w@w.com', role: 'worker', uid: 'w1' }));
        localStorage.setItem('melogo_active_role', 'worker');
    });

    await page.reload({ waitUntil: 'load', timeout: 10000 });

    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Calling openJobPicker('filter')...");
    await page.evaluate(() => {
        openJobPicker('filter');
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if job-picker-sheet has 'open' class
    const isOpen = await page.evaluate(() => {
        return document.getElementById('job-picker-sheet').classList.contains('open');
    });
    console.log("job-picker-sheet is open?", isOpen);
    
    // Check bounding rect
    const rect = await page.evaluate(() => {
        const el = document.getElementById('job-picker-sheet');
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return { top: r.top, bottom: r.bottom, height: r.height, transform: style.transform, visibility: style.visibility };
    });
    console.log("Sheet rect:", rect);

    await browser.close();
})().catch(console.error);
