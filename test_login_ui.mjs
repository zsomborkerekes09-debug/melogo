import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';

// Helper to check if server is up
function checkServer() {
    return new Promise((resolve) => {
        http.get('http://localhost:3000/', (res) => {
            resolve(res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 404);
        }).on('error', () => {
            resolve(false);
        });
    });
}

// Helper to wait
const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
    console.log("Starting local Express static server in background on port 3000...");
    const devServer = spawn('node', [
        '-e', 
        "const express = require('express'); const app = express(); app.use(express.static('frontend')); app.listen(3000, () => console.log('Static server is up on port 3000'));"
    ], {
        cwd: 'c:\\Users\\zsomb\\Documents\\melogo_app\\scratch\\melogo',
        detached: false
    });

    devServer.stdout.on('data', (data) => {
        console.log(`[Server] ${data.toString().trim()}`);
    });

    devServer.stderr.on('data', (data) => {
        console.error(`[Server Error] ${data.toString().trim()}`);
    });

    console.log("Waiting for server to become ready on port 3000...");
    let ready = false;
    for (let i = 0; i < 15; i++) {
        ready = await checkServer();
        if (ready) {
            console.log("Server is ready!");
            break;
        }
        await delay(1000);
    }

    if (!ready) {
        console.error("Local Express server failed to start on port 3000.");
        devServer.kill();
        process.exit(1);
    }

    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Capture console messages in the browser
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    try {
        console.log("\n--- TEST PHASE 1: Clean launch (Should display login screen) ---");
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
        
        // Clear storage initially to simulate a fresh install
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        // Reload to apply cleared storage
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
        await delay(3000); // Wait for auth listener to execute

        let isLoginScreenHidden = await page.evaluate(() => {
            const screen = document.getElementById('app-login-screen');
            return screen ? screen.classList.contains('hidden') : null;
        });

        console.log(`Login Screen Hidden: ${isLoginScreenHidden}`);
        if (isLoginScreenHidden === false) {
            console.log("✅ SUCCESS: Login screen is visible on clean launch!");
        } else {
            console.log("❌ FAILED: Login screen should be visible but is hidden.");
        }

        console.log("\n--- TEST PHASE 2: Click Guest Mode (Should hide login screen) ---");
        // Click the guest mode button
        await page.evaluate(() => {
            const btn = document.getElementById('guest-mode-btn');
            if (btn) btn.click();
        });
        await delay(1500); // Wait for transition animation and class addition

        isLoginScreenHidden = await page.evaluate(() => {
            const screen = document.getElementById('app-login-screen');
            return screen ? screen.classList.contains('hidden') : null;
        });

        const guestModeVal = await page.evaluate(() => localStorage.getItem('melogo_guest_mode'));

        console.log(`Login Screen Hidden: ${isLoginScreenHidden}`);
        console.log(`melogo_guest_mode in localStorage: ${guestModeVal}`);

        if (isLoginScreenHidden === true && guestModeVal === 'true') {
            console.log("✅ SUCCESS: Login screen hidden and guest mode flag set!");
        } else {
            console.log("❌ FAILED: Guest mode transition failed.");
        }

        console.log("\n--- TEST PHASE 3: Reload Page (Should keep login screen hidden) ---");
        await page.reload({ waitUntil: 'networkidle0' });
        await delay(3000); // Wait for auth listener to check guest mode

        isLoginScreenHidden = await page.evaluate(() => {
            const screen = document.getElementById('app-login-screen');
            return screen ? screen.classList.contains('hidden') : null;
        });

        console.log(`Login Screen Hidden: ${isLoginScreenHidden}`);
        if (isLoginScreenHidden === true) {
            console.log("✅ SUCCESS: Login screen remains hidden after page reload!");
        } else {
            console.log("❌ FAILED: Login screen should have remained hidden.");
        }

        console.log("\n--- TEST PHASE 4: Exit Guest Mode (Should restore login screen) ---");
        // Clear guest mode flag and reload to simulate logout / resetting guest mode
        await page.evaluate(() => {
            localStorage.removeItem('melogo_guest_mode');
            location.reload();
        });
        await delay(3000); // Wait for page to reload and auth listener to trigger

        isLoginScreenHidden = await page.evaluate(() => {
            const screen = document.getElementById('app-login-screen');
            return screen ? screen.classList.contains('hidden') : null;
        });

        console.log(`Login Screen Hidden: ${isLoginScreenHidden}`);
        if (isLoginScreenHidden === false) {
            console.log("✅ SUCCESS: Login screen is visible again after guest mode is removed!");
        } else {
            console.log("❌ FAILED: Login screen failed to show after clearing guest mode.");
        }

        // Take a screenshot of the login screen for verification
        const screenshotPath = 'c:\\Users\\zsomb\\Documents\\melogo_app\\scratch\\melogo\\frontend\\test_login.png';
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved screenshot to ${screenshotPath}`);

    } catch (e) {
        console.error("Test execution encountered an error:", e);
    } finally {
        console.log("Closing browser and server...");
        await browser.close();
        devServer.kill();
        console.log("Done!");
    }
})();
