import fs from 'node:fs';

const source = fs.readFileSync('src/planner/goals.js', 'utf8');
const gymSource = fs.readFileSync('src/features/league/gyms.js', 'utf8');

const today = '2026-09-26';
const config = {
  strategy: 'progression',
  goalPriorityBonus: 2400,
};

const state = {
  goalPlan: null,
  gymCycle: {},
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

const now = () => Date.parse('2026-09-26T12:00:00+02:00');
const saveState = () => {};
const formatRemaining = () => '10 min';
const localDayKey = () => today;
let gymState = {};
const gymCycle = () => gymState;
const accountSnapshot = () => ({});
const observeAccountSnapshot = () => ({});

const api = new Function(
  'config',
  'state',
  'normalizeText',
  'now',
  'saveState',
  'formatRemaining',
  'localDayKey',
  'gymCycle',
  'accountSnapshot',
  'observeAccountSnapshot',
  `${source}
  return {
    buildGoalPlan,
    expeditionDependencyStep,
    goalTargetExpedition,
  };`
)(
  config,
  state,
  normalizeText,
  now,
  saveState,
  formatRemaining,
  localDayKey,
  gymCycle,
  accountSnapshot,
  observeAccountSnapshot
);

function baseSnapshot() {
  return {
    trainer: { level: 2 },
    roster: { known: true, count: 2, healthyCount: 2, pokemon: [] },
    league: {
      known: true,
      badges: 0,
      totalBadges: 8,
      dailyBattleAvailable: null,
      arena: null,
      champion: null,
      badge: null,
      needsHealing: false,
      lockedGyms: [],
    },
    expeditions: {
      phase: 'ready_to_start',
      activeTitle: null,
      selectedTitle: null,
      dueAt: null,
      completedTitles: ['route 1'],
      locked: [],
      failureStreaks: {},
    },
    pokedex: {
      known: true,
      capturedSpecies: 4,
      totalSpecies: null,
    },
  };
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected "${expected}", got "${actual}"`);
  }
}

{
  const snapshot = baseSnapshot();
  snapshot.league.dailyBattleAvailable = true;
  snapshot.league.arena = "Arène de l'Horizon";
  snapshot.league.champion = 'Nima';
  snapshot.league.badge = 'Badge Aube';
  gymState = { completedDay: null, challengeSubmittedDay: null };

  const plan = api.buildGoalPlan(snapshot);
  assertEqual(plan.step.action, 'challenge_gym', 'available gym should be challenged');
  assertEqual(plan.step.module, 'progression', 'gym challenge module');
}

{
  const snapshot = baseSnapshot();
  snapshot.league.dailyBattleAvailable = true;
  snapshot.league.lockedGyms = [{
    rank: 2,
    arena: 'Arène des Ramures',
    badge: 'Badge Racine',
    requirements: [{
      type: 'expedition',
      target: 'foret epines',
      label: 'Terminer l’expédition : Forêt Épines',
    }],
  }];
  snapshot.expeditions.locked = [{
    title: 'Forêt Épines',
    normalizedTitle: 'foret epines',
    requirements: [{
      type: 'trainer_level',
      target: 3,
      label: 'Niveau de dresseur requis : 3.',
    }],
  }];
  gymState = {
    completedDay: null,
    challengeSubmittedDay: today,
  };

  const plan = api.buildGoalPlan(snapshot);
  assertEqual(
    plan.step.action,
    'farm_trainer_level',
    'submitted gym must not be challenged twice; planner should advance dependencies'
  );
  assertEqual(plan.step.target, 3, 'trainer level target');
}

{
  const snapshot = baseSnapshot();
  snapshot.trainer.level = 3;
  snapshot.league.lockedGyms = [{
    rank: 2,
    arena: 'Arène des Ramures',
    badge: 'Badge Racine',
    requirements: [{
      type: 'expedition',
      target: 'foret epines',
      label: 'Terminer l’expédition : Forêt Épines',
    }],
  }];
  snapshot.expeditions.locked = [{
    title: 'Forêt Épines',
    normalizedTitle: 'foret epines',
    requirements: [{
      type: 'trainer_level',
      target: 3,
      label: 'Niveau de dresseur requis : 3.',
    }],
  }];
  gymState = { completedDay: today, challengeSubmittedDay: today };

  const plan = api.buildGoalPlan(snapshot);
  assertEqual(plan.step.action, 'complete_expedition', 'unlocked dependency expedition should be targeted');
  assertEqual(normalizeText(plan.step.target), 'foret epines', 'target expedition');
}

{
  const snapshot = baseSnapshot();
  snapshot.expeditions.locked = [{
    title: 'Mont Vertige',
    normalizedTitle: 'mont vertige',
    requirements: [{
      type: 'captured_species',
      target: 6,
      label: 'Espèces capturées requises : 6.',
    }],
  }];
  gymState = {};

  const plan = api.buildGoalPlan(snapshot);
  assertEqual(plan.step.action, 'farm_captures', 'species lock should select capture farming');
  assertEqual(plan.step.target, 6, 'species target');
}

{
  const snapshot = baseSnapshot();
  snapshot.expeditions.phase = 'running';
  snapshot.expeditions.activeTitle = 'Route 1';
  snapshot.expeditions.locked = [];
  gymState = {};

  const plan = api.buildGoalPlan(snapshot);
  assertEqual(plan.step.action, 'wait', 'running expedition should not cause pointless navigation');
}

if (!gymSource.includes('gym.challengeSubmittedDay === today')) {
  throw new Error('gym retry guard for challengeSubmittedDay is missing');
}
if (!gymSource.includes('completedDay: today')) {
  throw new Error('gym completedDay guard is missing on league index');
}

console.log('Goal planner scenarios: OK');
console.log('Daily gym retry guard: OK');
