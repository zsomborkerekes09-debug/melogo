const fs = require('fs');

let html = fs.readFileSync('frontend/index.html', 'utf8');

const overlaysStart = html.indexOf('<!-- MOVED OVERLAYS -->');
const overlaysEndMarker = '<script type="module">';
const overlaysEnd = html.indexOf(overlaysEndMarker, overlaysStart);

if (overlaysStart !== -1 && overlaysEnd !== -1) {
    // Extract the overlays block
    let overlaysBlock = html.substring(overlaysStart, overlaysEnd);
    
    // We need to find the `</div>` that is right before `<script type="module">` 
    // because that's the closing tag of `#phone-app`
    const lastDivIdx = overlaysBlock.lastIndexOf('</div>');
    if (lastDivIdx !== -1) {
        // Splice out the overlays, leaving the </div>
        let extractedOverlays = overlaysBlock.substring(0, lastDivIdx);
        let remainingDiv = overlaysBlock.substring(lastDivIdx);
        
        // Remove the extracted overlays from the original HTML
        html = html.substring(0, overlaysStart) + remainingDiv + html.substring(overlaysEnd);
        
        // Now find </body>
        const bodyEndIdx = html.lastIndexOf('</body>');
        if (bodyEndIdx !== -1) {
            // Insert the extracted overlays right before </body>
            html = html.substring(0, bodyEndIdx) + extractedOverlays + '\n' + html.substring(bodyEndIdx);
            
            fs.writeFileSync('frontend/index.html', html, 'utf8');
            console.log("Successfully moved overlays outside of .phone-container!");
        } else {
            console.log("Error: Could not find </body>");
        }
    } else {
        console.log("Error: Could not find closing </div>");
    }
} else {
    console.log("Error: Could not find overlays block");
}
