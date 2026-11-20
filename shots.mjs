// shots.mjs — takes the entry's 4 screenshots with headless Chrome.
//
// Serves app/ on a local port, opens each view in a fresh browser context
// (so demo mode seeds its 12 earned trophies), and saves JPEGs to
// screenshots/. Run from the repository root: node shots.mjs
//
// Uses the vendored playwright-core and Chrome headless shell under the
// shared shot tooling directory — no install step, no network.

import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const requireShot = createRequire('/home/hatch/workspace/makefun/shot/node_modules/playwright-core/index.js');
const { chromium } = requireShot('playwright-core');

const HERE = fileURLToPath(new URL('.', import.meta.url));
const APP_DIR = join(HERE, 'app');
const SHOTS_DIR = join(HERE, 'screenshots');
const CHROME = '/home/hatch/workspace/makefun/shot/chrome/chrome-headless-shell-linux64/chrome-headless-shell';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const VIEWS = [
  { file: '1-cover.jpg', path: '/index.html?demo=1', waitFor: '.trophy-row', note: 'Tracker with the Positive Mental Attitude guide open, audit strip, filters, progress' },
  { file: '2-roadmap.jpg', path: '/index.html?demo=1#roadmap', waitFor: '.stage-row', note: 'Platinum roadmap, all 55 trophies in stage order' },
  { file: '3-sources.jpg', path: '/index.html?demo=1#sources', waitFor: '.matrix-table', note: 'Source matrix with disputes' },
  { file: '4-missable.jpg', path: '/index.html?demo=1#missable', waitFor: '.watch-card', note: 'Missable watch list' },
];

function serveFile(res, filePath) {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
}

async function main() {
  mkdirSync(SHOTS_DIR, { recursive: true });
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const rel = url.pathname === '/' ? '/index.html' : url.pathname;
    serveFile(res, join(APP_DIR, decodeURIComponent(rel)));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const base = 'http://127.0.0.1:' + port;

  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  try {
    for (const view of VIEWS) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      const page = await context.newPage();
      await page.goto(base + view.path, { waitUntil: 'networkidle' });
      await page.waitForSelector(view.waitFor, { timeout: 15000 });
      await page.waitForTimeout(400);
      const out = join(SHOTS_DIR, view.file);
      let quality = 80;
      for (;;) {
        await page.screenshot({ path: out, type: 'jpeg', quality });
        const size = statSync(out).size;
        if (size <= 262144 || quality <= 45) {
          console.log(view.file, size + ' bytes', 'quality ' + quality);
          break;
        }
        quality -= 10;
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
