/**
 * Stáhne seznam modelů z OpenCode API a doplní provider.opencode.models do config.
 * Použití:
 *   OPENCODE_MODELS_URL=https://api.example.com/v1/models node .opencode/scripts/fetch-models.js
 *   node .opencode/scripts/fetch-models.js https://api.example.com/v1/models
 *
 * Očekávaný tvar odpovědi: { "object": "list", "data": [ { "id": "gpt-5.2-codex", ... }, ... ] }
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const url = process.env.OPENCODE_MODELS_URL || process.argv[2];
const projectRoot = path.resolve(__dirname, '../..');
const configPath = path.join(projectRoot, 'opencode.jsonc');

if (!url) {
  console.error('Použití: OPENCODE_MODELS_URL=<url> node fetch-models.js');
  console.error('    nebo: node fetch-models.js <url>');
  process.exit(1);
}

function get(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    lib.get(urlStr, (res) => {
      let data = '';
      res.on('data', (ch) => { data += ch; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const json = await get(url);
  const list = json.data || json.models || [];
  const ids = list.map((m) => (typeof m === 'string' ? m : m.id)).filter(Boolean);
  if (ids.length === 0) {
    console.error('V odpovědi nebyly nalezeny žádné modely (očekáváno .data[] nebo .models[] s .id).');
    process.exit(1);
  }
  const models = {};
  ids.forEach((id) => { models[id] = {}; });

  let configStr = fs.readFileSync(configPath, 'utf8');
  const stripComments = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  let config;
  try {
    config = JSON.parse(stripComments(configStr));
  } catch (e) {
    console.error('Nepodařilo se parsovat opencode.jsonc:', e.message);
    process.exit(1);
  }
  config.provider = config.provider || {};
  config.provider.opencode = config.provider.opencode || {};
  config.provider.opencode.models = models;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log('Do opencode.jsonc doplněno', ids.length, 'modelů (provider.opencode.models).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
