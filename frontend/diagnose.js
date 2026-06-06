const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find where search-overlay div starts
const searchOvIdx = h.indexOf('<!-- ===== SEARCH OVERLAY ===== -->');
const phoneAppEnd = h.lastIndexOf('</div>', h.indexOf('<script>'));

console.log('search-overlay at index:', searchOvIdx);
console.log('phone-app ends around:', phoneAppEnd);
console.log('Is overlay inside phone-app?', searchOvIdx < phoneAppEnd);

// Print 200 chars before the overlay insertion
const ctx = h.substring(searchOvIdx - 300, searchOvIdx + 50);
console.log('\nContext around overlay:');
console.log(ctx);
