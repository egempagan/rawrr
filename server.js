const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Baca isi file script Lua lu. Ganti 'YOUR_SCRIPT.lua' dengan nama file lu.
const SCRIPT_PATH = path.join(__dirname, 'YOUR_SCRIPT.lua');
let luaScript = '-- Script tidak ditemukan';

try {
    luaScript = fs.readFileSync(SCRIPT_PATH, 'utf8');
    console.log('✅ Script loaded successfully.');
} catch (err) {
    console.error('❌ Failed to load script:', err.message);
}

// Fungsi buat deteksi request dari Roblox Executor
function isRobloxExecutorRequest(req) {
    const userAgent = req.headers['user-agent'] || '';
    const accept = req.headers['accept'] || '';
    const secFetchDest = req.headers['sec-fetch-dest'] || '';

    // Cek apakah ini request dari browser
    const isBrowser = /Mozilla|Chrome|Safari|Edg|Firefox/i.test(userAgent) &&
                      !/Roblox|Lua|Krnl|Synapse|ScriptWare|Fluxus|Electron/i.test(userAgent);

    const isHtmlRequest = accept.includes('text/html') || secFetchDest === 'document';

    // Kalo bukan browser dan bukan request HTML, kita anggap dari executor
    return !isBrowser && !isHtmlRequest;
}

// Endpoint utama
app.get('/', (req, res) => {
    if (isRobloxExecutorRequest(req)) {
        // Kirim script Lua mentah (raw) ke executor
        res.setHeader('Content-Type', 'text/plain');
        res.send(luaScript);
        console.log(`✅ Script served to executor. IP: ${req.ip}`);
    } else {
        // Kirim halaman HTML biasa ke browser
        res.status(403).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Access Forbidden</title>
                <style>
                    body {
                        background-color: #0a0a0a;
                        color: #ff4444;
                        font-family: monospace;
                        text-align: center;
                        padding: 50px;
                    }
                    h1 { font-size: 3em; }
                    p { font-size: 1.2em; }
                </style>
            </head>
            <body>
                <h1>🚫 ACCESS DENIED</h1>
                <p>This resource is only accessible via Roblox executor.</p>
                <p>Your request has been blocked.</p>
            </body>
            </html>
        `);
        console.log(`❌ Browser access blocked. IP: ${req.ip}`);
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📜 Script path: ${SCRIPT_PATH}`);
});