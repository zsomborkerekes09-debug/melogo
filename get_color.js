const { Jimp } = require('jimp');

async function run() {
    try {
        const image = await Jimp.read('frontend/assets/logo_new.jpg');
        const colorCounts = {};
        
        for (let y = 0; y < image.bitmap.height; y++) {
            for (let x = 0; x < image.bitmap.width; x++) {
                const color = image.getPixelColor(x, y);
                const r = (color >> 24) & 255;
                const g = (color >> 16) & 255;
                const b = (color >> 8) & 255;
                
                if (g > 200 && r > 100 && b < 100) {
                    const hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
                }
            }
        }
        
        const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
        console.log('Top 5 lime colors:', sorted.slice(0, 5));
    } catch(e) {
        console.error(e);
    }
}
run();
