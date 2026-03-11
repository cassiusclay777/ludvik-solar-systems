#!/usr/bin/env node

// Load .env from project root so NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set for env checks
try {
    require('dotenv').config();
    require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });
} catch (_) {}

const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const LOG_PATH = path.join(__dirname, 'heartbeat.log');

async function readConfig() {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read config:', error.message);
        process.exit(1);
    }
}

async function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] ${message}\n`;
    console.log(line.trim());
    try {
        await fs.appendFile(LOG_PATH, line);
    } catch (error) {
        console.error('Failed to write log:', error.message);
    }
}

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return { ok: true };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

async function checkDirectoryHasFiles(dirPath, minFiles = 1) {
    try {
        const files = await fs.readdir(dirPath);
        const filtered = files.filter(f => !f.startsWith('.'));
        return { ok: filtered.length >= minFiles, count: filtered.length };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

async function checkHttp(url, expectedStatus = 200, timeout = 5000) {
    return new Promise((resolve) => {
        const module = url.startsWith('https') ? https : http;
        const req = module.get(url, { timeout }, (res) => {
            res.on('data', () => {});
            res.on('end', () => {
                resolve({ ok: res.statusCode === expectedStatus, status: res.statusCode });
            });
        });
        req.on('timeout', () => {
            req.destroy();
            resolve({ ok: false, error: 'Timeout' });
        });
        req.on('error', (error) => {
            resolve({ ok: false, error: error.message });
        });
    });
}

async function checkEnv(key, optional = false) {
    const value = process.env[key];
    if (!value && !optional) {
        return { ok: false, error: `Environment variable ${key} is not set` };
    }
    return { ok: true, value: value || '(optional)' };
}

async function runChecks() {
    const config = await readConfig();
    const results = [];
    const checks = config.checks || [];

    for (const check of checks) {
        let result;
        switch (check.type) {
            case 'file':
                result = await checkFileExists(check.path);
                break;
            case 'directory':
                result = await checkDirectoryHasFiles(check.path, check.minFiles);
                break;
            case 'http':
                result = await checkHttp(check.url, check.expectedStatus, check.timeout);
                break;
            case 'env':
                result = await checkEnv(check.key, check.optional);
                break;
            default:
                result = { ok: false, error: `Unknown check type: ${check.type}` };
        }
        results.push({
            id: check.id,
            description: check.description,
            ok: result.ok,
            details: result
        });
    }

    return results;
}

async function main() {
    await log('Starting heartbeat check');
    const results = await runChecks();
    const failed = results.filter(r => !r.ok);
    const passed = results.filter(r => r.ok);

    for (const result of results) {
        const status = result.ok ? '✓' : '✗';
        await log(`${status} ${result.id}: ${result.description}`);
        if (!result.ok) {
            await log(`  → ${JSON.stringify(result.details)}`, 'WARN');
        }
    }

    await log(`Heartbeat completed: ${passed.length} passed, ${failed.length} failed`);
    if (failed.length > 0) {
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(async (error) => {
        await log(`Unhandled error: ${error.message}`, 'ERROR');
        process.exit(1);
    });
}

module.exports = { runChecks, log };