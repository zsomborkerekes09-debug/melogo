const fs = require('fs');
const content = fs.readFileSync('frontend/index.html', 'utf8');
const match = content.match(/<script type="module">([\s\S]*?)<\/script>/);
if (match) {
    fs.writeFileSync('temp_module.js', match[1]);
    console.log("Module extracted successfully. Length:", match[1].length);
} else {
    console.log("Module not found.");
}
