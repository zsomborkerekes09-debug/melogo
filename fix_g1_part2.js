const fs = require('fs');
let c = fs.readFileSync('frontend/index.html', 'utf8');

const search = `            const currentUserEmail = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : '';
            const myJobs = localEmployerJobs.filter(j => !j.ownerEmail || j.ownerEmail === currentUserEmail);`;
const searchCrLf = search.replace(/\n/g, '\r\n');
const replace = `            const currentUserUid = (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : 'NO_UID';
            const myJobs = localEmployerJobs.filter(j => j.ownerUid === currentUserUid);`;
const replaceCrLf = replace.replace(/\n/g, '\r\n');

c = c.replace(search, replace).replace(searchCrLf, replaceCrLf);

fs.writeFileSync('frontend/index.html', c);
