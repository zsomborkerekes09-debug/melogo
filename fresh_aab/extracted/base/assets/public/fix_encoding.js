const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const cp1252ToUnicode = new Map([
    [0x80, 0x20AC], [0x82, 0x201A], [0x83, 0x0192], [0x84, 0x201E],
    [0x85, 0x2026], [0x86, 0x2020], [0x87, 0x2021], [0x88, 0x02C6],
    [0x89, 0x2030], [0x8A, 0x0160], [0x8B, 0x2039], [0x8C, 0x0152],
    [0x8E, 0x017D], [0x91, 0x2018], [0x92, 0x2019], [0x93, 0x201C],
    [0x94, 0x201D], [0x95, 0x2022], [0x96, 0x2013], [0x97, 0x2014],
    [0x98, 0x02DC], [0x99, 0x2122], [0x9A, 0x0161], [0x9B, 0x203A],
    [0x9C, 0x0153], [0x9E, 0x017E], [0x9F, 0x0178]
]);
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
        } else if (code <= 0xFF) {
            bytes.push(code);
        } else {
            // Unmapped characters: we shouldn't have them in a purely corrupted string, 
            // but if there's any, just keep them as UTF-8 bytes (this is simplified).
            // Actually, if we have true uncorrupted unicode, this will break it.
            // But everything was passed through PowerShell, so it was all converted to CP-1252 bytes.
            bytes.push(code & 0xFF);
        }
    }
    return Buffer.from(bytes).toString('utf8');
}

let attempt1 = decodeWindows1252ToUtf8(html);
let attempt2 = decodeWindows1252ToUtf8(attempt1);

fs.writeFileSync('index_fixed.html', attempt2, 'utf8');
console.log('Fixed file written to index_fixed.html');
