import fs from 'node:fs';

const httpSource = fs.readFileSync('src/core/http.js', 'utf8');
const backgroundSource = fs.readFileSync('src/core/background.js', 'utf8');
const navigationSource = fs.readFileSync('src/core/navigation.js', 'utf8');
const teamSource = fs.readFileSync('src/features/expeditions/team.js', 'utf8');
const catalogSource = fs.readFileSync('src/features/expeditions/catalog.js', 'utf8');
const pokemonSource = fs.readFileSync('src/features/pokemon/progression.js', 'utf8');

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

console.log('Background GET whitelist: OK');
console.log('Detached HTML parsing: OK');
console.log('Expedition/league/collection background observation: OK');
console.log('Fresh-route navigation suppression + fallback: OK');
console.log('Background POST actions without page changes: OK');
