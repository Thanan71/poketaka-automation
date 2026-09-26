import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const MODULES = [
  'src/core/config.js',
  'src/core/state.js',
  'src/core/dom.js',
  'src/features/expeditions/cycle.js',
  'src/features/activities.js',
  'src/features/expeditions/catalog.js',
  'src/core/navigation.js',
  'src/ui/panel.js',
  'src/main.js',
];

const pkg = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf8'));
const version = String(process.env.PTA_VERSION || pkg.version || '0.0.0').trim();

if (!/^\d+(?:\.\d+){1,3}$/.test(version)) {
  throw new Error(`Invalid Tampermonkey version: ${version}`);
}

const chunks = [];
for (const file of MODULES) {
  const content = await fs.readFile(path.join(ROOT, file), 'utf8');
  chunks.push(`// ---- ${file} ----\n${content.trim()}\n`);
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

const index = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PokéTaka Automation</title>
</head>
<body>
  <main>
    <h1>PokéTaka Automation</h1>
    <p>Version Tampermonkey : <strong>${version}</strong></p>
    <p><a href="./poketaka.user.js">Installer / mettre à jour le userscript</a></p>
  </main>
</body>
</html>
`;

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(DIST, 'runtime.js'), runtime),
  fs.writeFile(path.join(DIST, 'poketaka.user.js'), loader),
  fs.writeFile(path.join(DIST, 'version.json'), JSON.stringify({ version }, null, 2) + '\n'),
  fs.writeFile(path.join(DIST, 'index.html'), index),
  fs.writeFile(path.join(DIST, '.nojekyll'), ''),
]);

console.log(`Built PokéTaka Automation ${version}`);
console.log(`Runtime modules: ${MODULES.length}`);
