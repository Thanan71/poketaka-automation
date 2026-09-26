import fs from 'node:fs';

const httpSource = fs.readFileSync('src/core/http.js', 'utf8');
const backgroundSource = fs.readFileSync('src/core/background.js', 'utf8');
const navigationSource = fs.readFileSync('src/core/navigation.js', 'utf8');
const teamSource = fs.readFileSync('src/features/expeditions/team.js', 'utf8');
const catalogSource = fs.readFileSync('src/features/expeditions/catalog.js', 'utf8');
const pokemonSource = fs.readFileSync('src/features/pokemon/progression.js', 'utf8');
const panelSource = fs.readFileSync('src/ui/panel.js', 'utf8');
const stateSource = fs.readFileSync('src/core/state.js', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(
  httpSource.includes("['expeditions', /^\\/expeditions") &&
  httpSource.includes("['league', /^\\/league") &&
  httpSource.includes("['collection', /^\\/collection"),
  'background GET whitelist must include expeditions, league and collection'
);

assert(
  httpSource.includes("credentials: 'same-origin'") &&
  httpSource.includes("method: 'GET'"),
  'background GET must reuse only same-origin authenticated requests'
);

assert(
  httpSource.includes("new DOMParser().parseFromString(html, 'text/html')"),
  'background GET must parse detached HTML documents'
);

assert(
  backgroundSource.includes("fetchObservedPage('/expeditions'") &&
  backgroundSource.includes("fetchObservedPage('/league'") &&
  backgroundSource.includes("fetchObservedPage('/collection'"),
  'background coordinator must observe the three main information pages'
);

assert(
  backgroundSource.includes("state.expeditionPlan = {") &&
  backgroundSource.includes("viability: assessment.plan.known") &&
  backgroundSource.includes("normalizeText(state.expeditionPlan?.title || '') !=="),
  'background expedition plan must stay synchronized with prepared and active missions'
);

assert(
  backgroundSource.includes("state.selectedExpedition = active.title") &&
  backgroundSource.includes("state.selectedExpeditionScore = null"),
  'observed active expedition must replace stale selected expedition metadata'
);

assert(
  panelSource.includes("['running', 'due', 'result', 'claiming', 'opening_result']") &&
  panelSource.includes("cycle.title || state.expeditionPlan?.title"),
  'panel mission card must prefer the actually active expedition'
);

assert(
  backgroundSource.includes("navigate: false") &&
  backgroundSource.includes("'pokemon_public_ids[]': plannedIds"),
  'background actions must submit direct POST payloads without navigating'
);

assert(
  navigationSource.includes("module.id === 'progression'") &&
  navigationSource.includes("backgroundRouteFresh('/league')") &&
  navigationSource.includes("module.id === 'pokemon'") &&
  navigationSource.includes("backgroundRouteFresh('/collection')") &&
  navigationSource.includes("backgroundRouteFresh('/expeditions')") &&
  navigationSource.includes("expeditionCycle().phase !== 'due'"),
  'visible navigation must be suppressed only after fresh background observations'
);

assert(
  teamSource.includes("function expeditionTeamRequirement(root = document)") &&
  teamSource.includes("function teamRequirementFromForm(form)"),
  'team parser must support detached preparation documents'
);

assert(
  catalogSource.includes("function rankExpeditions(root = document)") &&
  catalogSource.includes("analyzeExpedition(card, index, pageContext, root)"),
  'expedition ranking must support detached documents'
);

assert(
  pokemonSource.includes("function collectionPokemonRecords(root = document") &&
  pokemonSource.includes("function pokemonLevelUpOption(root = document)") &&
  pokemonSource.includes("function pokemonEvolutionOptions(root = document)"),
  'Pokémon progression parsers must support downloaded profile documents'
);

assert(
  !backgroundSource.includes('location.assign(') &&
  !backgroundSource.includes('clickElement('),
  'background coordinator must not perform visible navigation or simulated clicks'
);

assert(
  backgroundSource.includes('async function verifyBackgroundExpeditionLaunch') &&
  backgroundSource.includes("fetchObservedPage('/expeditions'") &&
  backgroundSource.includes("force: true") &&
  backgroundSource.includes('attempt: 2'),
  'silent expedition launch must be verified and retried once with fresh server state'
);

assert(
  backgroundSource.includes('function expeditionRewardClaimForm') &&
  backgroundSource.includes('function expeditionRewardsRecovered') &&
  backgroundSource.includes("expectedKind: 'expedition_claim'") &&
  backgroundSource.includes('async function verifyBackgroundExpeditionClaim'),
  'background result handling must claim and verify expedition rewards before relaunch'
);

assert(
  backgroundSource.includes("redirectedToIndex") &&
  backgroundSource.includes("result_marked_recovered"),
  'reward claim verification must accept both result confirmation and redirect to expedition index'
);

assert(
  backgroundSource.includes("['due', 'ready_to_start', 'preparing', 'starting']") &&
  backgroundSource.includes("backgroundObserveExpeditions({\n        force: true"),
  'actionable expedition phases must trigger immediate silent background handling in the same cycle'
);

assert(
  navigationSource.includes('backgroundExpeditionOwnsCycle') &&
  navigationSource.includes("state.captureDecision?.action !== 'manual'"),
  'silent background expedition handling must suppress visible expedition fallback unless manual intervention is required'
);

assert(
  panelSource.includes('Journal d’actions') &&
  panelSource.includes('data-action="view-logs"') &&
  panelSource.includes('data-action="clear-logs"'),
  'panel must expose a dedicated log page with clear action'
);

assert(
  stateSource.includes('actionLog: []') &&
  stateSource.includes('function appendActionLog') &&
  stateSource.includes('.slice(0, 120)'),
  'action log must persist and stay bounded'
);

console.log('Background GET whitelist: OK');
console.log('Detached HTML parsing: OK');
console.log('Expedition/league/collection background observation: OK');
console.log('Background expedition-plan synchronization: OK');
console.log('Observed active-expedition selection sync: OK');
console.log('Panel active mission precedence: OK');
console.log('Fresh-route navigation suppression + fallback: OK');
console.log('Background POST actions without page changes: OK');
console.log('Silent expedition launch verification/retry: OK');
console.log('Background expedition reward claim + verification: OK');
console.log('Visible expedition redirect suppression: OK');
console.log('Panel action log page: OK');
