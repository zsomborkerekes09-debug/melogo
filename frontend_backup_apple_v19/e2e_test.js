const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 414, height: 896 });
    
    console.log('Navigating to local index.html...');
    await page.goto('file:///C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step1_splash.png' });
    console.log('Saved splash screenshot');

    // Wait for auth UI to appear
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step2_auth.png' });
    
    // Simulate Employer Login
    console.log('Simulating Employer Login...');
    await page.evaluate(() => {
        if(typeof switchRole === 'function') switchRole('employer');
        if(typeof selectRole === 'function') selectRole('employer');
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step3_employer_auth.png' });

    console.log('Logging in as Employer (Guest mode)...');
    await page.evaluate(() => {
        if(typeof loginAsGuest === 'function') loginAsGuest();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step4_employer_dashboard.png' });

    console.log('Opening Job Post UI and selecting Egyéb / Egyéni...');
    await page.evaluate(() => {
        if(typeof selectEmpCat === 'function') {
            selectEmpCat('Egyéb / Egyéni');
        }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step5_employer_job_cat.png' });

    console.log('Opening Job Picker...');
    await page.evaluate(() => {
        if(typeof openJobPickerNew === 'function') {
            openJobPickerNew();
        }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step6_employer_job_picker.png' });

    console.log('Switching to Worker Role...');
    await page.evaluate(() => {
        localStorage.clear();
        location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Logging in as Worker...');
    await page.evaluate(() => {
        if(typeof selectRole === 'function') selectRole('worker');
        if(typeof loginAsGuest === 'function') loginAsGuest();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step7_worker_dashboard.png' });

    console.log('Filtering Worker jobs by Takarítás...');
    await page.evaluate(() => {
        if(typeof filterWorkerJobs === 'function') filterWorkerJobs('Takarítás');
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_step8_worker_filtered.png' });
    
    await browser.close();
    console.log('End to end visual test finished.');
})();
