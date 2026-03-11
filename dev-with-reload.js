/**
 * Spustí server.js a pak browser-sync s live reload.
 * Po změně .html / .css / .js se stránka v prohlížeči automaticky obnoví.
 */
const { spawn } = require('child_process');
const http = require('http');

const BACKEND_PORT = 3081;
const BROWSER_SYNC_PORT = 3080;
const ROOT = __dirname;

function waitForServer() {
    return new Promise((resolve) => {
        function tryConnect() {
            const req = http.get(`http://127.0.0.1:${BACKEND_PORT}`, (res) => {
                resolve();
            });
            req.on('error', () => {
                setTimeout(tryConnect, 200);
            });
        }
        tryConnect();
    });
}

const server = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    stdio: 'inherit'
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

waitForServer().then(() => {
    const browserSync = require('browser-sync');
    browserSync.init({
        proxy: `http://localhost:${BACKEND_PORT}`,
        files: ['**/*.html', '**/*.css', '**/*.js', 'images/**'],
        open: true,
        port: BROWSER_SYNC_PORT
    });
});

server.on('close', (code) => {
    process.exit(code);
});
