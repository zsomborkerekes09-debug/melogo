const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find the main script tag
const scriptStart = html.indexOf('<script>', 4000) + 8;
const scriptEnd = html.indexOf('</script>', scriptStart);
const code = html.substring(scriptStart, scriptEnd);

try {
    // Try parsing it using the Function constructor
    new Function(code);
    console.log('No syntax errors found.');
} catch (e) {
    console.log('Syntax error found:');
    console.log(e.toString());
    
    // Attempt to locate the exact line
    const lines = code.split('\n');
    // We can't easily get the line number from the exception in node < 16, but let's try to extract it from stack
    console.log(e.stack.split('\n').slice(0, 3).join('\n'));
}
