const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to app...');
    await page.goto('http://127.0.0.1:8080/');
    
    // Wait for the auth overlay to appear
    await page.waitForSelector('.auth-wrapper');
    
    // Switch to Register form
    console.log('Switching to registration form...');
    await page.click('button[onclick="showRegister()"]');
    await page.waitForSelector('#register-fields', { state: 'visible' });
    
    // Check attributes of password fields
    console.log('Checking password fields...');
    const pw1Placeholder = await page.getAttribute('#app-pw', 'placeholder');
    const pw2Placeholder = await page.getAttribute('#app-pw2', 'placeholder');
    console.log(`Password 1 placeholder: ${pw1Placeholder}`);
    console.log(`Password 2 placeholder: ${pw2Placeholder}`);
    
    // Enter credentials
    console.log('Filling in credentials...');
    await page.fill('#app-email', `testuser_${Date.now()}@test.com`);
    await page.fill('#app-pw', 'password123');
    await page.fill('#app-pw2', 'password123');
    
    // Accept terms
    console.log('Accepting terms...');
    await page.click('#terms-group');
    
    // Proceed to Step 1 Name
    console.log('Clicking Register Next...');
    await page.click('#btn-auth-register');
    
    // Wait for Step 1
    await page.waitForSelector('#auth-step-1', { state: 'visible' });
    
    console.log('Checking birth year field...');
    const birthYearType = await page.getAttribute('#app-birth-year', 'type');
    const birthYearMode = await page.getAttribute('#app-birth-year', 'inputmode');
    console.log(`Birth year type: ${birthYearType}, inputmode: ${birthYearMode}`);
    
    await browser.close();
})();
