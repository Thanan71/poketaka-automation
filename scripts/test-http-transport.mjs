import fs from 'node:fs';

const source = fs.readFileSync('src/core/http.js', 'utf8');
const captureSource = fs.readFileSync('src/features/expeditions/capture.js', 'utf8');
const teamSource = fs.readFileSync('src/features/expeditions/team.js', 'utf8');
const gymSource = fs.readFileSync('src/features/league/gyms.js', 'utf8');
const pokemonSource = fs.readFileSync('src/features/pokemon/progression.js', 'utf8');

const location = {
  href: 'https://poketaka.fr/expeditions',
  origin: 'https://poketaka.fr',
};

const api = new Function(
  'location',
  'state',
  'config',
  'saveState',
  'updatePanel',
  'markModuleAction',
  'moduleFromLocation',
  'now',
  'log',
  `${source}
  return { directActionKind };`
)(
  location,
  {},
  { directHttpActions: true },
  () => {},
  () => {},
  () => {},
  () => null,
  () => 0,
  () => {},
);

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected "${expected}", got "${actual}"`);
  }
}

assertEqual(
  api.directActionKind('https://poketaka.fr/expeditions/encounters/abc/capture'),
  'capture',
  'capture endpoint'
);
assertEqual(
  api.directActionKind('https://poketaka.fr/expeditions/route-1/launch'),
  'expedition_launch',
  'expedition launch endpoint'
);
assertEqual(
  api.directActionKind('https://poketaka.fr/gyms/horizon/challenge'),
  'gym_challenge',
  'gym challenge endpoint'
);
assertEqual(
  api.directActionKind('https://poketaka.fr/collection/pokemon-id/level-up'),
  'pokemon_level_up',
  'level-up endpoint'
);
assertEqual(
  api.directActionKind('https://poketaka.fr/collection/pokemon-id/evolve'),
  'pokemon_evolve',
  'evolve endpoint'
);
assertEqual(
  api.directActionKind('https://poketaka.fr/collection/pokemon-id/items/revive'),
  'pokemon_item',
  'item endpoint'
);

for (const unsafe of [
  'https://poketaka.fr/collection/pokemon-id/transfer',
  'https://poketaka.fr/market/buy',
  'https://poketaka.fr/collection/pokemon-id/trade',
  'https://example.com/expeditions/route-1/launch',
]) {
  assertEqual(api.directActionKind(unsafe), null, `unsafe endpoint must stay blocked: ${unsafe}`);
}

if (!source.includes("credentials: 'same-origin'")) {
  throw new Error('direct transport must reuse only same-origin session credentials');
}
if (!source.includes("idempotency_key")) {
  throw new Error('direct transport must preserve observed idempotency keys');
}
if (!captureSource.includes("expectedKind: 'capture'")) {
  throw new Error('capture must use the direct HTTP transport');
}
if (!teamSource.includes("'pokemon_public_ids[]': plannedIds")) {
  throw new Error('expedition team must be submitted directly as pokemon_public_ids[]');
}
if (!gymSource.includes("'pokemon_public_ids[]': plannedIds")) {
  throw new Error('gym team must be submitted directly as pokemon_public_ids[]');
}
if (!pokemonSource.includes("expectedKind: 'pokemon_level_up'")) {
  throw new Error('level-up must use the direct HTTP transport');
}
if (!pokemonSource.includes("expectedKind: 'pokemon_evolve'")) {
  throw new Error('evolution must use the direct HTTP transport');
}

console.log('Direct HTTP endpoint whitelist: OK');
console.log('Unsafe/destructive endpoints blocked: OK');
console.log('Observed CSRF/idempotency transport: OK');
console.log('Capture/expedition/gym/level/evolution direct POST wiring: OK');
