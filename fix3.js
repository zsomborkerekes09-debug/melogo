const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const categories = `
                    <div class="categories-row" style="display: flex; gap: 8px; overflow-x: auto; margin-bottom: 16px; padding-bottom: 4px; scrollbar-width: none;">
                        <div class="category-btn active" onclick="filterWorkerJobs('Összes')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: var(--color-navy); color: #fff;">Minden</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Kert')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Kertészet</div>
                        <div class="category-btn" onclick="filterWorkerJobs('Festés')" style="padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; background-color: #fff; border: 1px solid var(--color-border); color: var(--color-text);">Festés</div>
                    </div>`;
html = html.replace('<span id="worker-job-filter-display" style="font-size: 13px; color: var(--color-green); font-weight: 500;">Összes</span>\n                    </div>', '<span id="worker-job-filter-display" style="font-size: 13px; color: var(--color-green); font-weight: 500;">Összes</span>\n                    </div>' + categories);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Added categories row');
