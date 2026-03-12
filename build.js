/**
 * Build: zkopíruje statické soubory do dist/ pro nasazení.
 * Čistý HTML/CSS/JS – žádný bundling.
 * Do index.html vloží Google Maps API klíč z env (pro Vercel).
 */
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
console.log('  [build] Google Maps key:', GOOGLE_MAPS_KEY ? 'present' : 'MISSING – mapa v konfigurátoru nebude fungovat');

const FILES = ['index.html', 'ludvik-a-syn.html', 'styles.css', 'script.js'];
const DIRS = ['images'];

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

for (const file of FILES) {
  const src = path.join(ROOT, file);
  if (!fs.existsSync(src)) continue;
  const dest = path.join(DIST, file);
  if (file === 'index.html') {
    let html = fs.readFileSync(src, 'utf8');
    html = html.replace('{{GOOGLE_MAPS_API_KEY}}', GOOGLE_MAPS_KEY);
    fs.writeFileSync(dest, html);
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log('  ', file);
}

for (const dir of DIRS) {
  const src = path.join(ROOT, dir);
  const dest = path.join(DIST, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log('  ', dir + '/');
  }
}

console.log('Build done → dist/');
