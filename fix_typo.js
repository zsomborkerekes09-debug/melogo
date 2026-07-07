const fs = require('fs');
const files = [
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html',
    'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/preview_dark.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/várostal!/g, 'várossal!');
    content = content.replace(/várostal/g, 'várossal');
    fs.writeFileSync(file, content);
    console.log(`Fixed typo in ${file}`);
});
