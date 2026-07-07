const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    console.log('Navigating to https://melogo-kappa.vercel.app...');
    await page.goto('https://melogo-kappa.vercel.app/', { waitUntil: 'networkidle2' });
    
    // Clear all storage and caches to simulate a fresh user
    await page.evaluate(async () => {
        localStorage.clear();
        sessionStorage.clear();
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            for (const name of cacheNames) {
                await caches.delete(name);
            }
        }
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const reg of regs) {
                await reg.unregister();
            }
        }
    });
    console.log('Storage and caches cleared. Reloading...');
    await page.reload({ waitUntil: 'networkidle2' });
    
    // Check if the HTML contains the fixes
    const html = await page.content();
    console.log('Komuves fix present in HTML?', html.includes('emp-cat-Komuves'));
    console.log('Google teszt diak fix present?', html.includes('google_teszt_diak@melogo.hu'));
    
    console.log('Clicking START...');
    await page.click('button[onclick="startApp()"]');
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Selecting Worker role...');
    await page.click('div[onclick="selectRole(\'worker\')"]');
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Clicking Continue (accept terms)...');
    await page.click('#terms-checkbox');
    await page.click('button[onclick="goToLogin()"]');
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Clicking Google Login...');
    await page.click('#google-login-btn');
    
    // Wait for the mock timeout
    console.log('Waiting for mock Google Login (2 seconds)...');
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if we are on the dashboard (worker-screen is visible)
    const isDashboardVisible = await page.evaluate(() => {
        const scr = document.getElementById('worker-screen');
        return scr && !scr.classList.contains('hidden');
    });
    console.log('Is Worker Dashboard visible after Google Login?', isDashboardVisible);
    
    // Now switch to employer role to post a job
    console.log('Switching to Employer role...');
    await page.evaluate(() => {
        switchRole('employer');
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Check employer screen
    console.log('Clicking "Új munka feladása" button...');
    await page.evaluate(() => {
        document.querySelector('.fab').click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click Kőműves
    console.log('Clicking Kőműves category...');
    await page.evaluate(() => {
        document.getElementById('emp-cat-Komuves').click();
    });
    await new Promise(r => setTimeout(r, 500));
    
    // Check if dropdown populated
    const dropdownHtml = await page.evaluate(() => {
        return document.getElementById('emp-job-select').innerHTML;
    });
    console.log('Dropdown HTML after clicking Kőműves:');
    console.log(dropdownHtml.substring(0, 200) + '...');
    
    // Submit job
    console.log('Trying to submit job...');
    await page.evaluate(() => {
        document.getElementById('emp-title').value = 'Test title';
        document.getElementById('emp-address').value = 'Budapest';
        document.getElementById('emp-date').value = 'Ma';
        document.getElementById('emp-price').value = '10000';
        employerPublishJob();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // See if success screen is visible or error is shown
    const isSuccess = await page.evaluate(() => {
        return document.getElementById('worker-success').classList.contains('active');
    });
    const toast = await page.evaluate(() => {
        const push = document.getElementById('push-notification');
        return push && push.style.opacity === '1' ? push.innerText : null;
    });
    
    console.log('Is Success Screen visible?', isSuccess);
    console.log('Push notification text:', toast);
    
    await browser.close();
    console.log('Done!');
})();
