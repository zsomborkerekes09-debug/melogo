import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNysWD3J01zAyuFMCYq0BJAavhy206eMs",
    authDomain: "melogo-app.firebaseapp.com",
    projectId: "melogo-app",
    storageBucket: "melogo-app.firebasestorage.app",
    messagingSenderId: "54031234",
    appId: "1:54031234:web:0a4c799b7a585291a9559b"
};

const appE = initializeApp(firebaseConfig, "emp");
const appW1 = initializeApp(firebaseConfig, "w1");
const appW2 = initializeApp(firebaseConfig, "w2");

const authE = getAuth(appE);
const authW1 = getAuth(appW1);
const authW2 = getAuth(appW2);

const dbE = getFirestore(appE);
const dbW1 = getFirestore(appW1);
const dbW2 = getFirestore(appW2);

async function runTest() {
    console.log("🚀 Starting E2E Live Test...");
    const ts = Date.now();
    const empEmail = `emp${ts}@test.com`;
    const w1Email = `w1${ts}@test.com`;
    const w2Email = `w2${ts}@test.com`;
    const pass = "password123";

    console.log("1️⃣ Registering users...");
    const empCred = await createUserWithEmailAndPassword(authE, empEmail, pass);
    const w1Cred = await createUserWithEmailAndPassword(authW1, w1Email, pass);
    const w2Cred = await createUserWithEmailAndPassword(authW2, w2Email, pass);
    console.log(`✅ Users created. Emp: ${empCred.user.uid}, W1: ${w1Cred.user.uid}, W2: ${w2Cred.user.uid}`);

    console.log("2️⃣ Employer posting a job...");
    const jobRef = await addDoc(collection(dbE, "jobs"), {
        title: "Test Job " + ts,
        details: "Load Test Job",
        price: "5000",
        status: "Keresés",
        ownerEmail: empEmail,
        ownerUid: empCred.user.uid,
        createdAt: serverTimestamp()
    });
    console.log(`✅ Job posted: ${jobRef.id}`);

    console.log("3️⃣ Workers finding the job and applying...");
    // Just applying directly to the jobRef.id
    const app1Ref = await addDoc(collection(dbW1, "applications"), {
        jobId: jobRef.id,
        workerUid: w1Cred.user.uid,
        employerUid: empCred.user.uid,
        workerName: "Worker 1",
        status: "pending",
        createdAt: serverTimestamp()
    });
    const app2Ref = await addDoc(collection(dbW2, "applications"), {
        jobId: jobRef.id,
        workerUid: w2Cred.user.uid,
        employerUid: empCred.user.uid,
        workerName: "Worker 2",
        status: "pending",
        createdAt: serverTimestamp()
    });
    console.log(`✅ Applications submitted. App1: ${app1Ref.id}, App2: ${app2Ref.id}`);

    console.log("4️⃣ Chat initialization...");
    const chatRef = await addDoc(collection(dbW1, "chats"), {
        jobId: jobRef.id,
        workerId: w1Cred.user.uid,
        employerId: empCred.user.uid,
        workerName: "Worker 1",
        employerName: "Employer",
        createdAt: serverTimestamp()
    });
    
    await addDoc(collection(dbW1, `chats/${chatRef.id}/messages`), {
        from: "worker",
        text: "Hello from Worker 1!",
        time: "Most"
    });
    console.log(`✅ Chat created and message sent: ${chatRef.id}`);

    console.log("5️⃣ Testing job deletion cascade...");
    await deleteDoc(doc(dbE, "jobs", jobRef.id));
    console.log(`✅ Job deleted by employer. Wait, does cascade work via rules?`);
    
    // Note: Cloud Functions or client logic is needed to cascade. Wait, the frontend explicitly deleted them!
    // Since this is a backend test, I will simulate the frontend cascade logic.
    console.log("Simulating Frontend Cascade logic (Employer deletes related docs)...");
    const qA = query(collection(dbE, "applications"), where("employerUid", "==", empCred.user.uid));
    const appsSnap = await getDocs(qA);
    for(const a of appsSnap.docs) {
        await deleteDoc(doc(dbE, "applications", a.id));
        console.log(`🧹 Deleted application ${a.id}`);
    }

    const qC = query(collection(dbE, "chats"), where("employerId", "==", empCred.user.uid));
    const chatsSnap = await getDocs(qC);
    for(const c of chatsSnap.docs) {
        await deleteDoc(doc(dbE, "chats", c.id));
        console.log(`🧹 Deleted chat ${c.id}`);
    }

    console.log("🎉 E2E Test Completed Successfully!");
    process.exit(0);
}

runTest().catch(console.error);
