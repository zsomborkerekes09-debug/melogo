const fs = require('fs');
const html = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');
const start = html.indexOf('class="bottom-nav"');
if (start > -1) {
    console.log(html.substring(Math.max(0, start - 100), start + 800));
} else {
    console.log("bottom-nav class not found");
}
