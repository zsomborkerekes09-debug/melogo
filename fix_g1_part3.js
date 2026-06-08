const fs = require('fs');
let c = fs.readFileSync('frontend/index.html', 'utf8');

const search = `                    ownerEmail: (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'employer@melogo.hu',
                    createdAt: Date.now(),`;
const searchCrLf = search.replace(/\n/g, '\r\n');
const replace = `                    ownerEmail: (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.email : 'employer@melogo.hu',
                    ownerUid: (window.firebaseAuth && window.firebaseAuth.currentUser) ? window.firebaseAuth.currentUser.uid : 'NO_UID',
                    createdAt: Date.now(),`;
const replaceCrLf = replace.replace(/\n/g, '\r\n');

c = c.replace(search, replace).replace(searchCrLf, replaceCrLf);

fs.writeFileSync('frontend/index.html', c);
