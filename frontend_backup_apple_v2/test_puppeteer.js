const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('Navigating to app...');
    await page.goto('http://127.0.0.1:8080/');
    
    // Wait for the auth wrapper
    await page.waitForSelector('.auth-wrapper', { visible: true });
    
    console.log('Switching to registration form...');
    await page.click('button[onclick="showRegister()"]');
    await page.waitForSelector('#register-fields', { visible: true });
    
    // Check password fields
    console.log('Checking password fields...');
    const pw1Placeholder = await page.$eval('#app-pw', el => el.getAttribute('placeholder'));
    const pw2Placeholder = await page.$eval('#app-pw2', el => el.getAttribute('placeholder'));
    console.log(`Password 1 placeholder: ${pw1Placeholder}`);
    console.log(`Password 2 placeholder: ${pw2Placeholder}`);
    
    console.log('Filling in credentials...');
    const testEmail = `testuser_${Date.now()}@test.com`;
    await page.type('#app-email', testEmail);
    await page.type('#app-pw', 'password123');
    await page.type('#app-pw2', 'password123');
    
    console.log('Accepting terms...');
    await page.click('#terms-group');
    
    console.log('Proceeding to Step 1 (Name & Birth Year)...');
    await page.click('#btn-auth-register');
    
    await page.waitForSelector('#auth-step-1', { visible: true });
    
    console.log('Checking birth year field...');
    const birthYearType = await page.$eval('#app-birth-year', el => el.getAttribute('type'));
    const birthYearMode = await page.$eval('#app-birth-year', el => el.getAttribute('inputmode'));
    const birthYearPattern = await page.$eval('#app-birth-year', el => el.getAttribute('pattern'));
    console.log(`Birth year type: ${birthYearType}, inputmode: ${birthYearMode}, pattern: ${birthYearPattern}`);
    
    console.log('Filling in Step 1...');
    await page.type('#app-name', 'Test User');
    await page.type('#app-birth-year', '2000');
    
    await page.click('#btn-step-1-next');
    
    console.log('Test successful! Closing browser...');
    await browser.close();
})();
