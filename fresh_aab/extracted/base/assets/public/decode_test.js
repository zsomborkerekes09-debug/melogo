const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The Windows-1252 to Unicode mapping (simplified for common bytes 0x80-0xFF)
const cp1252ToUnicode = new Map([
    [0x80, 0x20AC], [0x82, 0x201A], [0x83, 0x0192], [0x84, 0x201E],
    [0x85, 0x2026], [0x86, 0x2020], [0x87, 0x2021], [0x88, 0x02C6],
    [0x89, 0x2030], [0x8A, 0x0160], [0x8B, 0x2039], [0x8C, 0x0152],
    [0x8E, 0x017D], [0x91, 0x2018], [0x92, 0x2019], [0x93, 0x201C],
    [0x94, 0x201D], [0x95, 0x2022], [0x96, 0x2013], [0x97, 0x2014],
    [0x98, 0x02DC], [0x99, 0x2122], [0x9A, 0x0161], [0x9B, 0x203A],
    [0x9C, 0x0153], [0x9E, 0x017E], [0x9F, 0x0178]
]);
// Invert it
const unicodeToCp1252 = new Map();
for (let i = 0x00; i <= 0xFF; i++) {
    let u = i;
    if (cp1252ToUnicode.has(i)) {
        u = cp1252ToUnicode.get(i);
    }
    unicodeToCp1252.set(u, i);
}

function decodeWindows1252ToUtf8(str) {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (unicodeToCp1252.has(code)) {
            bytes.push(unicodeToCp1252.get(code));
        } else {
            // Unmapped or higher characters? If it's a higher character, it might be unrecoverable
            // Let's just push code % 256
            bytes.push(code & 0xFF);
        }
    }
    return Buffer.from(bytes).toString('utf8');
}

let attempt1 = decodeWindows1252ToUtf8(html);
let attempt2 = decodeWindows1252ToUtf8(attempt1);
let attempt3 = decodeWindows1252ToUtf8(attempt2);

console.log('Original snippet:', html.substring(html.indexOf('Milyen munk'), html.indexOf('Milyen munk') + 40));
console.log('Attempt 1 snippet:', attempt1.substring(attempt1.indexOf('Milyen munk'), attempt1.indexOf('Milyen munk') + 40));
console.log('Attempt 2 snippet:', attempt2.substring(attempt2.indexOf('Milyen munk'), attempt2.indexOf('Milyen munk') + 40));
console.log('Attempt 3 snippet:', attempt3.substring(attempt3.indexOf('Milyen munk'), attempt3.indexOf('Milyen munk') + 40));

