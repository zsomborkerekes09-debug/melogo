const fs = require('fs');
const h = fs.readFileSync('frontend/index.html', 'utf8');
const lines = h.split('\n');
lines.forEach((l, i) => {
  if (l.includes('class="screen"')) {
    console.log(i + 1, l.trim().slice(0, 100));
  }
});
