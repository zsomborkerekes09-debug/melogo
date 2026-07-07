const fs = require('fs');
let code = fs.readFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', 'utf8');

const target = `        function recalculateJobDistances() {
            mockJobs.forEach(job => {
                if (gameState.gpsActive && userCoords && job.lat && job.lon) {
                    const d = calculateHaversine(userCoords.lat, userCoords.lon, job.lat, job.lon);
                    job.distance = Math.round(d * 10) / 10;
                } else {
                    job.distance = null;
                }
            });
        }`;

const replacement = `        function recalculateJobDistances() {
            mockJobs.forEach(job => {
                // BUGFIX: Removed gameState.gpsActive condition so manual geocoding still calculates distance
                if (userCoords && job.lat && job.lon) {
                    const d = calculateHaversine(userCoords.lat, userCoords.lon, job.lat, job.lon);
                    job.distance = Math.round(d * 10) / 10;
                } else {
                    job.distance = null;
                }
            });
        }`;

if (code.includes('if (gameState.gpsActive && userCoords && job.lat && job.lon)')) {
    code = code.replace(target, replacement);
    fs.writeFileSync('C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html', code);
    console.log("Fixed recalculateJobDistances!");
} else {
    console.log("Could not find the target code.");
}
