import fs from 'node:fs';

const source = fs.readFileSync('src/features/expeditions/capture.js', 'utf8');
const backgroundSource = fs.readFileSync('src/core/background.js', 'utf8');

const config = {
  autoCapture: true,
  smartCapture: true,
  captureNewSpecies: true,
  captureRare: true,
  captureOwnedDuplicates: false,
  captureUnknownEncounters: false,
  minCaptureIvScore: 80,
  minBallReserve: 3,
};

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'‘`´]/g, ' ')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const parseOptionalBoolean = value => {
  if (value == null || value === '') return null;
  const normalized = normalizeText(value);
  if (['1', 'true', 'yes', 'oui', 'new', 'owned', 'captured'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'non', 'unknown'].includes(normalized)) return false;
  return null;
};

const api = new Function(
  'config',
  'normalizeText',
  'parseOptionalBoolean',
  `${source}
  return { decideCapture, encounterOwnershipState };`
)(config, normalizeText, parseOptionalBoolean);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function context(overrides = {}) {
  return {
    captureButton: {},
    form: {},
    skipButton: null,
    attemptsRemaining: 3,
    ballReserve: 10,
    captureChance: 60,
    isNew: null,
    rarity: '',
    ivScore: null,
    ...overrides,
  };
}

let decision = api.decideCapture(context({
  isNew: false,
  rarity: 'rare',
  ivScore: 95,
}));
assert(
  decision.action === 'ignore' &&
  /doublons bloques/i.test(normalizeText(decision.reason)),
  'owned rare/high-IV Pokémon must be blocked before rare/IV rules'
);

decision = api.decideCapture(context({
  isNew: false,
  rarity: '',
  ivScore: 100,
}));
assert(
  decision.action === 'ignore',
  'owned high-IV Pokémon must remain blocked by default'
);

decision = api.decideCapture(context({
  isNew: true,
  rarity: '',
  ivScore: null,
}));
assert(
  decision.action === 'capture',
  'new species must still be captured'
);

config.captureOwnedDuplicates = true;
decision = api.decideCapture(context({
  isNew: false,
  rarity: 'rare',
  ivScore: 95,
}));
assert(
  decision.action === 'capture',
  'explicit duplicate opt-in may allow a rare owned Pokémon'
);
config.captureOwnedDuplicates = false;

const fakeRoot = text => ({
  innerText: text,
  textContent: text,
  getAttribute: () => null,
});

assert(
  api.encounterOwnershipState(fakeRoot('Absente du Pokédex')) === true,
  'PokéTaka "Absente du Pokédex" must be recognized as a new species'
);

assert(
  api.encounterOwnershipState(fakeRoot('Présente dans le Pokédex')) === false,
  'PokéTaka owned/Pokédex wording must be recognized as already owned'
);

assert(
  backgroundSource.includes('const decision = decideCapture(context)') &&
  backgroundSource.includes('encounterOwnershipState(encounter, text)'),
  'background capture must share the exact visible capture policy'
);

console.log('Owned duplicate rare veto: OK');
console.log('Owned duplicate high-IV veto: OK');
console.log('New species capture: OK');
console.log('Explicit duplicate opt-in: OK');
console.log('Pokédex ownership parsing: OK');
console.log('Visible/background policy unification: OK');
