import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const MODULES = [
  'src/core/config.js',
  'src/core/state.js',
  'src/core/dom.js',
  'src/features/expeditions/team.js',
  'src/features/league/gyms.js',
  'src/account/snapshot.js',
  'src/planner/goals.js',
  'src/features/expeditions/capture.js',
  'src/features/expeditions/cycle.js',
  'src/features/activities.js',
  'src/features/expeditions/catalog.js',
  'src/core/navigation.js',
  'src/ui/panel.js',
  'src/main.js',
];

const pkg = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf8'));
const version = String(process.env.PTA_VERSION || pkg.version || '0.0.0').trim();

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`Invalid Tampermonkey version "${version}". Expected X.X.X.`);
}

const chunks = [];
for (const file of MODULES) {
  const source = await fs.readFile(path.join(ROOT, file), 'utf8');
  chunks.push(`// ---- ${file} ----\n${source.trim()}\n`);
}

const runtime = `/* GENERATED FILE — edit src/, never this output. */
(() => {
  'use strict';

  const VERSION = ${JSON.stringify(version)};

${chunks.join('\n')}
})();
`;

let loader = await fs.readFile(path.join(ROOT, 'src/loader.user.js'), 'utf8');
loader = loader.replaceAll('__VERSION__', version);

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

await Promise.all([
  fs.writeFile(path.join(DIST, 'runtime.js'), runtime),
  fs.writeFile(path.join(DIST, 'poketaka.user.js'), loader),
  fs.writeFile(
    path.join(DIST, 'version.json'),
    JSON.stringify({ version }, null, 2) + '\n'
  ),
]);

console.log(`Built PokéTaka Automation ${version}`);
console.log(`Runtime modules: ${MODULES.length}`);
