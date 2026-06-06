const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const lines = h.split('\n');

// Find key elements and their lines
const phoneAppLine = lines.findIndex(l => l.includes('id="phone-app"'));
const screensContLine = lines.findIndex(l => l.includes('class="screens-container"'));
const bnLine = lines.findIndex(l => l.includes('Alsó navigáció'));
const searchOverLine = lines.findIndex(l => l.includes('id="search-overlay"'));
const distSheetLine = lines.findIndex(l => l.includes('id="distance-sheet"'));
const pushBannerLine = lines.findIndex(l => l.includes('id="push-banner"'));
const chatDetailLine = lines.findIndex(l => l.includes('id="chat-detail-overlay"'));
const phoneAppClose = lines.findLastIndex(l => l.trim() === '</div>' && lines.findIndex(ll => ll.includes('id="phone-app"')) < lines.indexOf(l));

console.log('HTML Structure:');
console.log('  #phone-app starts at line:', phoneAppLine);
console.log('  .screens-container at line:', screensContLine);
console.log('  bottom-nav comment at line:', bnLine);
console.log('  #search-overlay at line:', searchOverLine);
console.log('  #distance-sheet at line:', distSheetLine);
console.log('  #push-banner at line:', pushBannerLine);
console.log('  #chat-detail-overlay at line:', chatDetailLine);
console.log('');
console.log('Order check (all should be ascending):');
console.log('  phone-app < screens-container:', phoneAppLine < screensContLine, `(${phoneAppLine} < ${screensContLine})`);
console.log('  bottom-nav < search-overlay:', bnLine < searchOverLine, `(${bnLine} < ${searchOverLine})`);

// Print the lines around the end of the chat-detail-overlay and what follows
console.log('\nLines 1740-1748:');
for(let i=1739; i<1748; i++) console.log(i+1, lines[i]);

// Check that search overlay CSS is set properly
console.log('\n#search-overlay CSS:');
const cssSoIdx = h.indexOf('#search-overlay {');
console.log(h.substring(cssSoIdx, cssSoIdx + 200));
