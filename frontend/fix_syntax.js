const fs = require('fs');
const path = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let code = fs.readFileSync(path, 'utf8');

const regex = /handleBlock\([^)]+\);\n\s*\}\n\s*\}\n\s*\}\n\s*function closeEmployerJobDetail\(\)/;
const replacement = `handleBlock(reason || 'Nem adott meg okot');
            }
        }

        function closeEmployerJobDetail()`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(path, code);
    console.log("Fixed syntax error via regex");
} else {
    console.log("Regex not found");
}
