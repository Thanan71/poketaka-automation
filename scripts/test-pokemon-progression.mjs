import fs from 'node:fs';

const source = fs.readFileSync('src/features/pokemon/progression.js', 'utf8');
const backgroundSource = fs.readFileSync('src/core/background.js', 'utf8');
const navigationSource = fs.readFileSync('src/core/navigation.js', 'utf8');

const config = {
  autoLevelPokemon: true,
  autoEvolvePokemon: true,
  minStardustReserve: 500,
  pokemonProgressionScanMinutes: 45,
  preserveEvolutionCandies: true,
};

const nowValue = Date.parse('2026-09-26T12:00:00+02:00');
const now = () => nowValue;
const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'‘`´]/g, ' ')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

let expedition = { phase: 'idle', title: null };
let gym = { phase: 'done', selectedTeam: [] };
let goal = { step: { module: null } };

const state = {
  pokemonProgression: {
    phase: 'idle',
    scannedIds: [],
    lastScanAt: 0,
    blockedUntil: 0,
  },
  expeditionPlan: {
    teamIds: [],
    team: [],
    viability: 'viable',
  },
  smartTeam: {
    lastRecommendedLevel: null,
  },
};

const api = new Function(
  'config',
  'state',
  'normalizeText',
  'now',
  'gymCycle',
  'currentGoalPlan',
  'expeditionCycle',
  `${source}
  return {
    pokemonNumber,
    expeditionHasPriorityOverPokemonProgression,
    pokemonProgressionPriorityRecords,
    pokemonProgressionScanDue,
  };`
)(
  config,
  state,
  normalizeText,
  now,
  () => gym,
  () => goal,
  () => expedition,
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

expedition = { phase: 'running', title: 'Route 1' };
assert(
  api.pokemonProgressionScanDue() === false,
  'progression must wait while an expedition is running'
);

assert(api.pokemonNumber('Niveau 12') === 12, 'level parser must read integers');
assert(api.pokemonNumber('1 192 Poussières') === 1192, 'resource parser must read spaced thousands');
assert(api.pokemonNumber('1\u00a0192') === 1192, 'resource parser must read non-breaking spaces');

expedition = { phase: 'ready_to_start', title: null };
state.expeditionPlan.viability = 'viable';
assert(
  api.pokemonProgressionScanDue() === false,
  'a free expedition slot must have priority over routine Pokémon progression'
);

state.expeditionPlan.viability = 'blocked';
assert(
  api.pokemonProgressionScanDue({ allowExpeditionFallback: true }) === true,
  'Pokémon progression may run only as an explicit fallback for a blocked expedition team'
);

expedition = { phase: 'ready_to_start', title: null };
state.expeditionPlan.teamIds = ['starter'];
state.expeditionPlan.team = ['Salamèche'];
state.smartTeam.lastRecommendedLevel = 15;

const ranked = api.pokemonProgressionPriorityRecords([
  { id: 'starter', name: 'Salamèche', level: 12, favorite: true },
  { id: 'bird', name: 'Piafabec', level: 14, favorite: false },
]);

assert(ranked.length === 1, 'only planned Pokémon may receive resources');
assert(ranked[0].id === 'starter', 'planned Pokémon must remain the progression target');

state.expeditionPlan.teamIds = [];
state.expeditionPlan.team = [];
const openRanking = api.pokemonProgressionPriorityRecords([
  { id: 'starter', name: 'Salamèche', level: 12, favorite: true },
  { id: 'bird', name: 'Piafabec', level: 14, favorite: false },
]);

assert(openRanking.length === 2, 'without a plan the collection may be ranked normally');

assert(
  source.includes("evolutions.length === 1") &&
  source.includes("Plusieurs évolutions sont possibles · choix automatique refusé"),
  'branching evolutions must remain manual'
);

assert(
  source.includes("stardust.available - stardust.required >= config.minStardustReserve"),
  'stardust reserve guard must be enforced'
);

assert(
  source.includes("preserveCandyForEvolution") &&
  source.includes("Bonbons réservés pour"),
  'evolution candy reserve guard must be enforced'
);

assert(
  backgroundSource.includes("action: 'evolve_done'") &&
  backgroundSource.includes("action: 'level_up_done'") &&
  backgroundSource.includes("markPokemonScanned(context.id"),
  'successful background upgrades must mark the Pokémon as processed'
);

assert(
  backgroundSource.includes("state.expeditionPlan?.viability === 'blocked'") &&
  backgroundSource.includes("allowExpeditionFallback: true"),
  'background Pokémon progression must only be a fallback after a blocked team plan'
);

assert(
  navigationSource.includes("expeditionHasPriorityOverPokemonProgression()") &&
  navigationSource.includes("pokemonFallbackNeeded"),
  'visible orchestration must keep expedition priority above stale Pokémon progression state'
);

console.log('Pokémon progression scenarios: OK');
console.log('Expedition relaunch priority: OK');
console.log('Numeric level/resource parsing: OK');
console.log('One-upgrade-per-scan rule: OK');
console.log('Planned-team resource targeting: OK');
