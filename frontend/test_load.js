const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runTest() {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport to mobile size
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

    const consoleErrors = [];
    const consoleLogs = [];

    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        consoleLogs.push(`[CONSOLE ${type.toUpperCase()}] ${text}`);
        if (type === 'error') {
            consoleErrors.push(text);
        }
    });

    page.on('pageerror', err => {
        consoleLogs.push(`[PAGE ERROR] ${err.name}: ${err.message}\nStack: ${err.stack}\nLine: ${err.lineNumber || err.line}\nCol: ${err.columnNumber || err.col}`);
        consoleErrors.push(err.stack || err.toString());
    });

    const fileUrl = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
    console.log(`Navigating to: ${fileUrl}`);
    
    try {
        await page.goto(fileUrl, { waitUntil: 'load', timeout: 10000 });
        console.log("Page loaded. Waiting 3 seconds for scripts and Firebase...");
        await new Promise(r => setTimeout(r, 3000));

        // Take a screenshot of the initial state
        const screenshotPath = path.join(__dirname, 'initial_state.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved initial screenshot to: ${screenshotPath}`);

        // Print captured console logs
        console.log("\n=== Captured Console Logs ===");
        consoleLogs.forEach(log => console.log(log));

        console.log("\n=== Checking Interactivity ===");
        // Try to click "Munkás vagyok" or "Megbízó vagyok"
        // Let's find button with text containing "Munkás vagyok" or "Megbízó"
        const roleBtns = await page.$$('.role-card, .login-role-selector button, button');
        console.log(`Found ${roleBtns.length} buttons/role cards on page.`);

        // Log active elements and their styles
        const bodyClicksBlocked = await page.evaluate(() => {
            const el = document.elementFromPoint(187, 406); // Center of the screen
            if (el) {
                return {
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    outerHTML: el.outerHTML.substring(0, 200),
                    pointerEvents: window.getComputedStyle(el).pointerEvents,
                    zIndex: window.getComputedStyle(el).zIndex
                };
            }
            return null;
        });
        console.log("Element at center of screen (187, 406):", bodyClicksBlocked);

        // Click "Munkás vagyok" (role-card or button)
        const clicked = await page.evaluate(() => {
            // Let's find button containing 'Munkás vagyok'
            const buttons = Array.from(document.querySelectorAll('button, div, span'));
            const workerBtn = buttons.find(b => b.textContent && b.textContent.includes('Munkás vagyok'));
            if (workerBtn) {
                workerBtn.click();
                return { found: true, id: workerBtn.id, className: workerBtn.className };
            }
            return { found: false };
        });
        console.log("Tried clicking 'Munkás vagyok':", clicked);

        // Wait 1 second and check if class changed or anything happened
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: path.join(__dirname, 'after_click_state.png') });
        console.log("Saved post-click screenshot.");

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
}

runTest();
