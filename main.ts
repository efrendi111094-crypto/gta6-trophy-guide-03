// Mangrove Compass — hand-in program (Node 22, standard library only).
//
// The guide itself is the static files under app/: a tracker and cited
// walkthrough for all 55 Grand Theft Auto VI trophies, served from
// app/index.html with no build step and no network at run time. This
// program's only job is to hand that guide in: it copies app/ and
// screenshots/ from this repository into the output directory and writes
// dossier.json there, the summary the judge reads, using the vendored
// make.fun library (vendor/makefun-frontend.ts, left untouched).
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The gate's own caps: the text cap shapes the dossier's bytes; the rest
// refuse an entry the scorer would refuse (over 4 screenshots, one over
// 256 KiB, over 993 files or 48 MiB of app files).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
