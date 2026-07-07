const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Address & Location IDs ---');
lines.forEach((line, idx) => {
    if (line.includes('id=') && (line.toLowerCase().includes('address') || line.toLowerCase().includes('location') || line.toLowerCase().includes('hely'))) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});

console.log('\n--- Input fields ---');
lines.forEach((line, idx) => {
    if (line.includes('<input') && (line.toLowerCase().includes('address') || line.toLowerCase().includes('location') || line.toLowerCase().includes('hely') || line.toLowerCase().includes('cim') || line.toLowerCase().includes('cím'))) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});

console.log('\n--- Functions ---');
lines.forEach((line, idx) => {
    if (line.includes('function ') && (line.toLowerCase().includes('address') || line.toLowerCase().includes('location') || line.toLowerCase().includes('map') || line.toLowerCase().includes('hely'))) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
