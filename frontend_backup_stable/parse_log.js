const fs = require('fs');
const lines = fs.readFileSync('depth_log.txt', 'utf8').split('\n');
let maxBaseline = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Depth 0->1')) {
        // Function started
    } else if (line.includes('Depth 1->2')) {
        // Inner block
    }
}
// Actually, it's simpler to just print out the lines in depth_log.txt where depth goes from X to X+1, and look for where it fails to return to 0.
// Let's print the last line before it stops returning to 0.
