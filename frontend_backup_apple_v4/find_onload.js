const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

// Find all occurrences of DOMContentLoaded, onload, or immediate function executions
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
if (scriptStart !== -1 && scriptEnd !== -1) {
    const scriptContent = html.substring(scriptStart, scriptEnd);
    
    // Look for event listeners
    const listenerRegex = /addEventListener\s*\(\s*['"](DOMContentLoaded|load)['"][\s\S]*?\)/gi;
    let match;
    console.log("=== Event Listeners ===");
    while ((match = listenerRegex.exec(scriptContent)) !== null) {
        console.log(match[0]);
    }
    
    // Look for onload
    const onloadRegex = /(\.onload|window\.onload)\s*=/gi;
    console.log("\n=== Onload Assignments ===");
    while ((match = onloadRegex.exec(scriptContent)) !== null) {
        const index = match.index;
        console.log(scriptContent.substring(index, index + 150));
    }

    // Let's also look for any immediate calls at the end of the script or document
    console.log("\n=== End of Script Content (last 500 chars) ===");
    console.log(scriptContent.substring(scriptContent.length - 500));
} else {
    console.log("No <script> block found");
}
