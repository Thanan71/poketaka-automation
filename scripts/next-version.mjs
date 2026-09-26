import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const SEMVER = /^\d+\.\d+\.\d+$/;
const currentPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const current = String(currentPackage.version || '').trim();

if (!SEMVER.test(current)) {
  throw new Error(`package.json version must use X.X.X, got "${current}"`);
}

let previous = null;
try {
  const previousRaw = execFileSync(
    'git',
    ['show', 'HEAD^:package.json'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  );
  previous = String(JSON.parse(previousRaw).version || '').trim();
} catch {
  previous = null;
}

if (previous && !SEMVER.test(previous)) {
  previous = null;
}

// If the developer explicitly changed package.json's version, preserve it.
// Otherwise increment only the patch component.
if (previous && current !== previous) {
  process.stdout.write(current);
} else {
  const [major, minor, patch] = current.split('.').map(Number);
  process.stdout.write(`${major}.${minor}.${patch + 1}`);
}
