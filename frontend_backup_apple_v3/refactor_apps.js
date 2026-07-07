const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// 1. Inject the helper function right before executeEmployerAccept
const helperCode = `
        async function updateApplicationStatusInFirestore(chatData, newStatus) {
            if (!chatData || !chatData.jobId || !chatData.workerId) return;
            try {
                const appsQuery = window.firebaseAPI.query(
                    window.firebaseAPI.collection(window.firebaseDb, "applications"),
                    window.firebaseAPI.where("jobId", "==", chatData.jobId),
                    window.firebaseAPI.where("workerUid", "==", chatData.workerId)
                );
                const snap = await window.firebaseAPI.getDocs(appsQuery);
                if (!snap.empty) {
                    snap.forEach(async (docSnap) => {
                        await window.firebaseAPI.updateDoc(docSnap.ref, { status: newStatus });
                    });
                }
            } catch (e) {
                console.error("Failed to update application status via query:", e);
            }
        }
`;
content = content.replace('window.executeEmployerAccept = async function', helperCode + '\n        window.executeEmployerAccept = async function');

// 2. Replace all the localWorkerApplications update blocks

function replaceBlock(content, newStatus) {
    const blockRegex = /\/\/ [0-9]+\. Update(?: local)? applications? state\s+const appIndex = localWorkerApplications\.findIndex\([\s\S]*?\}\s*\}\s*catch/m;
    
    // We want to replace everything up to "catch", but we must keep the catch block intact!
    // Let's use a safer replacement string matching
    return content;
}

// Since regex across multiline can be brittle, let's use string split/join or simple literal replacement
// Let's output to a file and run it. I'll write the JS script manually.
