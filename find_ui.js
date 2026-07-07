const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');
let lines = code.split('\n');
lines.forEach((l, i) => {
    if ((l.includes('position:') && l.includes('absolute') && l.includes('top:')) || l.includes('snackbar')) {
        console.log("LINE:", i, l.trim());
    }
});
