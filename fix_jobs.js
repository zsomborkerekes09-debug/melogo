const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The new sleek Apple style job list HTML
const newJobsHTML = `
                    <div class="job-list" id="worker-jobs-list" style="padding: 0 20px; display: flex; flex-direction: column;">
                        
                        <!-- Job Card 1 -->
                        <div class="job-card" onclick="document.getElementById('worker-action-overlay').classList.add('active')" data-distance="2.5" data-price="8000" data-time="1" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; cursor: pointer; background-color: #fff; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.03);">
                            <div style="flex: 1;">
                                <div class="job-title" style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Fűnyírás a Desedánál</div>
                                <div style="font-size: 13px; color: var(--color-text-muted); margin-top: 4px;">Tóth János</div>
                                <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 11px; color: var(--color-text-muted);">
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-top:-2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 2.5 km</span>
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-top:-2px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Ma 14:00</span>
                                </div>
                            </div>
                            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 12px;">
                                <div class="job-price" style="font-size: 16px; font-weight: 700; color: var(--color-green-go);">8 000 Ft</div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </div>

                        <!-- Job Card 2 -->
                        <div class="job-card" onclick="document.getElementById('worker-action-overlay').classList.add('active')" data-distance="3.1" data-price="12000" data-time="2" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; cursor: pointer; background-color: #fff; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.03);">
                            <div style="flex: 1;">
                                <div class="job-title" style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Kerítésfestés</div>
                                <div style="font-size: 13px; color: var(--color-text-muted); margin-top: 4px;">Nagy Péter</div>
                                <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 11px; color: var(--color-text-muted);">
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-top:-2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 3.1 km</span>
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-top:-2px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Holnap 09:00</span>
                                </div>
                            </div>
                            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 12px;">
                                <div class="job-price" style="font-size: 16px; font-weight: 700; color: var(--color-green-go);">12 000 Ft</div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </div>

                    </div>`;

// Replace everything between id="worker-jobs-list" and <!-- SCREEN 1: MAP -->
const startMarker = '<div class="job-list" id="worker-jobs-list"';
const endMarker = '<!-- SCREEN 1: MAP -->';
if (html.includes(startMarker) && html.includes(endMarker)) {
    const pre = html.substring(0, html.indexOf(startMarker));
    const post = html.substring(html.indexOf(endMarker));
    // Important: in the original I had an extra closing </div> for #home-worker-home right before the map!
    // Wait, the end marker should be carefully located. I will look for <!-- END OF HOME SCREEN --> or similar.
    
    // Instead of string replacement, I can just do a regex replace from startMarker to the closing </div> of the screen.
    // Let's just find the exact block and replace it.
    
    const blockStart = html.indexOf(startMarker);
    const blockEnd = html.indexOf(endMarker);
    const blockContent = html.substring(blockStart, blockEnd);
    
    // Replace the job list part of the block
    const newBlockContent = newJobsHTML + '\n                </div>\n            '; // Closing tag for #app-home-screen
    
    html = html.substring(0, blockStart) + newJobsHTML + '\n                </div>\n            ' + html.substring(blockEnd);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Job cards replaced successfully');
} else {
    console.log('Markers not found!');
}
