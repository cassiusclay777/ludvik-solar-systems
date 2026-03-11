/**
 * Dev server: načte .env a vloží NEXT_PUBLIC_GOOGLE_MAPS_API_KEY do index.html,
 * aby mapa v konfigurátoru fungovala.
 */
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3081;
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  if (!path.extname(filePath)) filePath += '.html';
  filePath = path.normalize(filePath);
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end();
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    let body = data;
    const ext = path.extname(filePath);
    if ((filePath.endsWith('index.html') || req.url === '/') && KEY) {
      body = Buffer.from(
        data.toString('utf8').replace(
          '<body>',
          '<body>\n    <script>window.__GOOGLE_MAPS_API_KEY__ = ' + JSON.stringify(KEY) + ';</script>'
        ),
        'utf8'
      );
    }
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    
    // Cache hlavičky
    if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (ext === '.css' || ext === '.js') {
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    }
    
    res.end(body);
  });
});

server.listen(PORT, () => {
  console.log('Dev server: http://localhost:' + PORT);
  if (!KEY) console.warn('Varování: GOOGLE_MAPS_API_KEY / NEXT_PUBLIC_GOOGLE_MAPS_API_KEY v .env není nastavený – mapa nebude fungovat.');
});
