const fs = require('fs');
const content = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const regex = /<script.*?>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = regex.exec(content)) !== null) {
    fs.writeFileSync(`C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/temp_${i}.js`, match[1]);
    i++;
}
console.log(`Extracted ${i} script blocks.`);
