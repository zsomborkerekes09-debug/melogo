const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

// Fix Firestore import and init
code = code.replace(
    'import { getFirestore, collection, addDoc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, doc, query, where, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";',
    'import { getFirestore, initializeFirestore, collection, addDoc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, doc, query, where, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";'
);

code = code.replace(
    'const db = getFirestore(app);',
    'const db = initializeFirestore(app, { experimentalForceLongPolling: true });'
);

// Fix the typo made by replace_file_content earlier
code = code.replace('továbves is átírhatsz', 'továbbra is átírhatsz');

fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
console.log("Fixed!");
