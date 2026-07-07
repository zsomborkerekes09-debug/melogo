const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// The blocks are roughly:
/*
                // 4. Update local applications state
                const appIndex = localWorkerApplications.findIndex(a => 
                    a.jobId === chatData.jobId && 
                    (a.workerUid === chatData.workerId || a.workerEmail === chatData.workerEmail)
                );
                if (appIndex !== -1) {
                    localWorkerApplications[appIndex].status = 'Aktív';
                    saveWorkerApplications();
                    
                    // Also update application document in Firestore
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    await window.firebaseAPI.updateDoc(appRef, { status: 'Aktív' })
                        .catch(e => console.warn("Firestore application update failed:", e));
                }
*/

const block1 = `                // 4. Update local applications state
                const appIndex = localWorkerApplications.findIndex(a => 
                    a.jobId === chatData.jobId && 
                    (a.workerUid === chatData.workerId || a.workerEmail === chatData.workerEmail)
                );
                if (appIndex !== -1) {
                    localWorkerApplications[appIndex].status = 'Aktív';
                    saveWorkerApplications();
                    
                    // Also update application document in Firestore
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    await window.firebaseAPI.updateDoc(appRef, { status: 'Aktív' })
                        .catch(e => console.warn("Firestore application update failed:", e));
                }`;

const block2 = `                // 3. Update application status
                const appIndex = localWorkerApplications.findIndex(a => 
                    a.jobId === chatData.jobId && 
                    (a.workerUid === chatData.workerId || a.workerEmail === chatData.workerEmail)
                );
                if (appIndex !== -1) {
                    localWorkerApplications[appIndex].status = 'Értékelésre vár';
                    saveWorkerApplications();
                    
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    await window.firebaseAPI.updateDoc(appRef, { status: 'Értékelésre vár' })
                        .catch(e => console.warn("Firestore application update failed:", e));
                }`;

const block3 = `                // 3. Update application status
                const appIndex = localWorkerApplications.findIndex(a => 
                    a.jobId === chatData.jobId && 
                    (a.workerUid === chatData.workerId || a.workerEmail === chatData.workerEmail)
                );
                if (appIndex !== -1) {
                    localWorkerApplications[appIndex].status = 'Befejezett';
                    saveWorkerApplications();
                    
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    await window.firebaseAPI.updateDoc(appRef, { status: 'Befejezett' })
                        .catch(e => console.warn("Firestore application update failed:", e));
                }`;

const block4 = `                // 3. Update application status
                const appIndex = localWorkerApplications.findIndex(a => 
                    a.jobId === chatData.jobId && 
                    (a.workerUid === chatData.workerId || a.workerEmail === chatData.workerEmail)
                );
                if (appIndex !== -1) {
                    localWorkerApplications[appIndex].status = 'Értékelve';
                    saveWorkerApplications();
                    
                    const appDocId = localWorkerApplications[appIndex].id;
                    const appRef = window.firebaseAPI.doc(window.firebaseDb, "applications", appDocId);
                    await window.firebaseAPI.updateDoc(appRef, { status: 'Értékelve' })
                        .catch(e => console.warn("Firestore application update failed:", e));
                }`;

content = content.replace(block1, "                await updateApplicationStatusInFirestore(chatData, 'Aktív');");
content = content.replace(block2, "                await updateApplicationStatusInFirestore(chatData, 'Értékelésre vár');");
content = content.replace(block3, "                await updateApplicationStatusInFirestore(chatData, 'Befejezett');");
content = content.replace(block4, "                await updateApplicationStatusInFirestore(chatData, 'Értékelve');");

fs.writeFileSync('index.html', content, 'utf-8');
console.log('Replacements done.');
