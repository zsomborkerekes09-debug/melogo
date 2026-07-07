const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');
let m = code.indexOf('id="worker-job-detail');
if (m !== -1) console.log(code.substring(m-100, m+1500));
