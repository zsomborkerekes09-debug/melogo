const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// Helper to replace precisely
function replaceRegex(regex, replacement) {
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        console.log("Success with: " + regex);
    } else {
        console.log("Failed to match: " + regex);
    }
}

// 1. Header (Logo gap, greeting size/name logic, top margins)
replaceRegex(/\.welcome-text\s*\{[^}]+\}/, '.welcome-text {\n    font-size: 13px;\n    font-weight: 400;\n    color: rgba(255,255,255,0.6);\n    text-align: center;\n    margin-bottom: 16px;\n    margin-top: 8px;\n}');
replaceRegex(/\.brand-logo\s*\{[^}]+\}/, '.brand-logo {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin-top: 24px;\n    margin-bottom: 0px;\n    letter-spacing: -0.5px;\n}');

// name logic
content = content.replace(/const fullName = user \? user\.name : '[^']+';/g, "const fullName = user && user.name ? user.name.split(' ')[0] : '';");
content = content.replace(/function getGreeting\(name\) \{[\s\S]*?return name \? `\$\{greetingPrefix\}, \$\{name\}!` : `\$\{greetingPrefix\}!`;\n          \}/, 
`function getGreeting(name) {
    if (!name) return '';
    const hour = new Date().getHours();
    const greetingPrefix = hour < 10 ? 'Jó reggelt' : (hour >= 19 ? 'Jó estét' : 'Szia');
    return \`\${greetingPrefix}, \${name}!\`;
}`);

// GPS row margin
replaceRegex(/\.gps-container\s*\{[^}]+\}/, '.gps-container {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    margin-top: 12px;\n    margin-bottom: 16px;\n}');

// 2. Search Bar
replaceRegex(/\.search-container\s*\{[^}]+\}/, '.search-container {\n    background: rgba(255,255,255,0.05);\n    border: 1px solid rgba(255,255,255,0.15);\n    border-radius: 20px;\n    display: flex;\n    align-items: center;\n    padding: 0 16px;\n    height: 48px;\n    margin: 0 16px;\n    transition: all 0.3s ease;\n}');
replaceRegex(/\.search-container i\s*\{[^}]+\}/, '.search-container i {\n    color: rgba(255,255,255,0.5);\n    font-size: 16px;\n    margin-right: 12px;\n}');
replaceRegex(/\.search-container input::placeholder\s*\{[^}]+\}/, '.search-container input::placeholder {\n    color: rgba(255,255,255,0.4);\n}');

fs.writeFileSync(file, content);
console.log('Script completed.');
