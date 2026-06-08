const fs = require('fs');
let c = fs.readFileSync('frontend/index.html', 'utf8');

const search = `            // Keep matched job status as 'Keresés' until employer accepts
            const matchedAdIndex = localEmployerJobs.findIndex(j => j.title === gameState.jobTitle);
            if (matchedAdIndex !== -1) {
                localEmployerJobs[matchedAdIndex].status = 'Keresés';
                saveEmployerJobs();
                renderEmployerHome();
            }`;
const searchCrLf = search.replace(/\n/g, '\r\n');
const replace = `            // Removed client-side localEmployerJobs cache modification here to avoid G-1 bug
            // Job status is now tracked via Firestore applications or mock tracking securely`;
const replaceCrLf = replace.replace(/\n/g, '\r\n');

c = c.replace(search, replace).replace(searchCrLf, replaceCrLf);

const search2 = `            // Prevent applying to own job if ownerUid matches
            if (matchedJob && matchedJob.ownerUid && matchedJob.ownerUid === currentUid) {
                alert("Saját munkádra nem jelentkezhetsz!");`;
const search2CrLf = search2.replace(/\n/g, '\r\n');
const replace2 = `            // Prevent applying to own job if ownerUid matches strictly
            if (matchedJob && matchedJob.ownerUid && currentUid !== 'NO_UID' && matchedJob.ownerUid === currentUid) {
                alert("Saját munkádra nem jelentkezhetsz!");`;
const replace2CrLf = replace2.replace(/\n/g, '\r\n');

c = c.replace(search2, replace2).replace(search2CrLf, replace2CrLf);

fs.writeFileSync('frontend/index.html', c);
