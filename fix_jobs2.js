const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I will just use regex to replace all Job Cards up to the map screen
// This is the start of Job Card 1
const startIndex = html.indexOf('<!-- Job Card 1 -->');
// This is where Job Card 2 ends
const endMarker = '<div class="screen hidden" id="app-map-screen"';
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const pre = html.substring(0, startIndex);
    const post = html.substring(endIndex);
    
    const newJobsHTML = `<!-- Job Card 1 -->
                    <div class="job-card" onclick="openWorkerJobDetail()" data-distance="2.5" data-price="8000" data-time="1" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; cursor: pointer; background-color: #fff; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.03);">
                        <div style="flex: 1;">
                            <div class="job-title" style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Fűnyírás a Desedánál</div>
                            <div style="font-size: 13px; color: var(--color-text-light); margin-top: 4px;">Tóth János</div>
                            <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 11px; color: var(--color-text-light);">
                                <span style="display: flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 2.5 km</span>
                                <span style="display: flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Ma 14:00</span>
                            </div>
                        </div>
                        <div style="text-align: right; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; height: 100%;">
                            <div class="job-price" style="font-size: 16px; font-weight: 700; color: var(--color-green-go);">8 000 Ft</div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" style="margin-top: 12px;"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    </div>

                    <!-- Job Card 2 -->
                    <div class="job-card" onclick="openWorkerJobDetail()" data-distance="3.1" data-price="12000" data-time="2" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; cursor: pointer; background-color: #fff; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.03);">
                        <div style="flex: 1;">
                            <div class="job-title" style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Kerítésfestés</div>
                            <div style="font-size: 13px; color: var(--color-text-light); margin-top: 4px;">Nagy Péter</div>
                            <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 11px; color: var(--color-text-light);">
                                <span style="display: flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 3.1 km</span>
                                <span style="display: flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Holnap 09:00</span>
                            </div>
                        </div>
                        <div style="text-align: right; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; height: 100%;">
                            <div class="job-price" style="font-size: 16px; font-weight: 700; color: var(--color-green-go);">12 000 Ft</div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" style="margin-top: 12px;"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    </div>
                </div> <!-- END OF HOME SCREEN -->
            `;
            
    html = pre + newJobsHTML + post;
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fixed job cards!');
}
