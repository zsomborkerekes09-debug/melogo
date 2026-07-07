const puppeteer = require('puppeteer');

(async () => {
    console.log("Indítás...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const pageEmployer = await browser.newPage();
    const pageWorker = await browser.newPage();

    await pageEmployer.setViewport({ width: 375, height: 812 });
    await pageWorker.setViewport({ width: 375, height: 812 });

    const APP_URL = 'https://melogo-kappa.vercel.app/';

    // --- EMPLOYER E2E ---
    console.log("Megbízó: Oldal betöltése...");
    await pageEmployer.goto(APP_URL, { waitUntil: 'networkidle2' });
    
    // Bypass Login for Employer
    await pageEmployer.evaluate(() => {
        window.currentUser = { name: "Megbízó Teszt", email: "employer_test_1@test.com", uid: "emp123" };
        localStorage.setItem('melogo_active_role', 'employer');
        localStorage.setItem('melogo_employer_session', 'true');
        if (typeof loginApp === 'function') loginApp();
        else {
            document.getElementById('onboarding-screen').style.display = 'none';
            document.getElementById('phone-app').style.display = 'block';
            if (typeof switchRole === 'function') switchRole('employer');
        }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await pageEmployer.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_employer_home.png' });

    // Job Posting
    console.log("Megbízó: Új munka feladása...");
    await pageEmployer.evaluate(() => {
        if (typeof openJobPostSheet === 'function') openJobPostSheet();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Select category (Egyéb)
    await pageEmployer.evaluate(() => {
        const catBtns = document.querySelectorAll('#job-post-categories .job-post-cat-btn');
        let found = null;
        catBtns.forEach(btn => { if(btn.innerText.includes('Egyéb')) found = btn; });
        if (found) found.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if Custom Input appears
    await pageEmployer.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_employer_job_category.png' });
    
    // Type custom title
    await pageEmployer.evaluate(() => {
        const titleInput = document.getElementById('job-title-input');
        if(titleInput) {
            titleInput.value = "Terasz takarítás automatizált";
        }
    });

    // Set other fields
    await pageEmployer.evaluate(() => {
        const desc = document.getElementById('emp-details');
        const price = document.getElementById('emp-price-input');
        const city = document.getElementById('emp-city');
        const street = document.getElementById('emp-street');
        
        if (desc) desc.value = "Terasz alapos feltakarítása és lemosása.";
        if (price) price.value = "15000";
        if (city) city.value = "Budapest";
        if (street) street.value = "Fő utca 12.";
    });

    // Submit
    await pageEmployer.evaluate(() => {
        if (typeof employerPublishJobNew === 'function') employerPublishJobNew();
    });
    console.log("Megbízó: Munka feladva!");
    await new Promise(r => setTimeout(r, 4000));
    await pageEmployer.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_employer_posted.png' });

    // --- WORKER E2E ---
    console.log("Munkás: Oldal betöltése...");
    await pageWorker.goto(APP_URL, { waitUntil: 'networkidle2' });
    
    // Bypass Login for Worker
    await pageWorker.evaluate(() => {
        window.currentUser = { name: "Munkás Teszt", email: "worker_test_1@test.com", uid: "work123" };
        localStorage.setItem('melogo_active_role', 'worker');
        localStorage.setItem('melogo_worker_session', 'true');
        if (typeof loginApp === 'function') loginApp();
        else {
            document.getElementById('onboarding-screen').style.display = 'none';
            document.getElementById('phone-app').style.display = 'block';
            if (typeof switchRole === 'function') switchRole('worker');
        }
    });
    
    await new Promise(r => setTimeout(r, 4000)); // wait for firestore sync
    console.log("Munkás: Munkák listázása...");
    await pageWorker.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_worker_home.png' });

    // Filter to Egyéb just to be sure it appears
    await pageWorker.evaluate(() => {
        if (typeof filterWorkerJobs === 'function') filterWorkerJobs('Egyéb');
    });
    await new Promise(r => setTimeout(r, 1000));
    await pageWorker.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_worker_filtered.png' });

    // Open job
    await pageWorker.evaluate(() => {
        const cards = document.querySelectorAll('.job-card');
        for (let c of cards) {
            if (c.innerText.includes('Terasz takarítás automatizált')) {
                c.click();
                break;
            }
        }
    });
    await new Promise(r => setTimeout(r, 1000));
    await pageWorker.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_worker_job_detail.png' });

    console.log("Munkás: Jelentkezés a munkára...");
    await pageWorker.evaluate(() => {
        const btns = document.querySelectorAll('#worker-job-detail-sheet button');
        for(let btn of btns) {
            if(btn.innerText.includes('Jelentkezem')) {
                btn.click();
                break;
            }
        }
    });
    await new Promise(r => setTimeout(r, 3000));
    await pageWorker.screenshot({ path: 'C:/Users/zsomb/.gemini/antigravity/brain/1df3c4d9-dc51-4d5f-94c4-97886e1c79cd/test_worker_applied.png' });

    await browser.close();
    console.log("Teszt sikeresen befejeződött.");
})();
