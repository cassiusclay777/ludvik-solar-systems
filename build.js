/**
 * Build: zkopíruje statické soubory do dist/ pro nasazení.
 * Čistý HTML/CSS/JS – žádný bundling.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const FILES = ['index.html', 'ludvik-a-syn.html', 'styles.css', 'script.js'];
const DIRS = ['images'];

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

for (const file of FILES) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
    console.log('  ', file);
  }
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
