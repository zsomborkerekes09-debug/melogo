const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3099;
const SERVE_DIR = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend';

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(SERVE_DIR, req.url === '/' ? 'preview_dark.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found: ' + req.url);
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Sötét előnézet szerver fut!\n`);
    console.log(`   👉 Nyisd meg: http://localhost:${PORT}/preview_dark.html\n`);
});
