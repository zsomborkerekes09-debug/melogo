const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const map = {
    '├®': 'é',
    '├í': 'á',
    '├¡': 'í',
    '├│': 'ó',
    '├Â': 'ö',
    '├╝': 'ü',
    '├║': 'ú',
    '┼æ': 'ő',
    '┼▒': 'ű',
    '├ü': 'Á',
    '├ë': 'É',
    '├ì': 'Í',
    '├û': 'Ö',
    '├Ь': 'Ü',
    '├│': 'ó',
    '├é': 'Â', // if any
    '├ä': 'Ä',
    // Let's just catch the main hungarian ones:
    '├®': 'é', '├í': 'á', '├¡': 'í', '├│': 'ó', '├Â': 'ö', '├╝': 'ü', '├║': 'ú', '┼æ': 'ő', '┼▒': 'ű',
    '├ü': 'Á', '├ë': 'É', '├ì': 'Í', '├û': 'Ö', '├Ь': 'Ü'
};

for (const [bad, good] of Object.entries(map)) {
    content = content.split(bad).join(good);
}

// Write back
fs.writeFileSync(file, content, 'utf8');
console.log('Encoding fixed!');
