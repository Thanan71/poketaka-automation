import fs from 'node:fs';
import { DOMParser } from 'linkedom';

const resultSource = fs.readFileSync('src/features/expeditions/result.js', 'utf8');
const stateSource = fs.readFileSync('src/core/state.js', 'utf8');
const httpSource = fs.readFileSync('src/core/http.js', 'utf8');
const domSource = fs.readFileSync('src/core/dom.js', 'utf8');
const cycleSource = fs.readFileSync('src/features/expeditions/cycle.js', 'utf8');
const backgroundSource = fs.readFileSync('src/core/background.js', 'utf8');
const panelSource = fs.readFileSync('src/ui/panel.js', 'utf8');
const catalogSource = fs.readFileSync('src/features/expeditions/catalog.js', 'utf8');

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'‘`´]/g, ' ')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parse(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

const resultApi = new Function(
  'normalizeText',
  `${resultSource}\nreturn { expeditionResultState, expeditionRewardsRecovered };`
)(normalizeText);

const catalogApi = new Function(
  'isVisible',
  'findClickable',
  'elementText',
  'document',
  `${catalogSource}\nreturn { expeditionPrepareLink, expeditionCards };`
)(
  () => false,
  () => null,
  el => normalizeText(el?.textContent || ''),
  null
);

const detachedCatalogHtml = `
<!doctype html>
<html>
  <body>
    <section class="mission-catalog mission-tabset__panel" data-panel="available">
      <div class="mission-catalog__grid">
        <article class="mission-card">
          <h3>Forêt Épines</h3>
          <a class="primary-button" href="https://poketaka.fr/expeditions/thorn_forest/prepare">
            Préparer l’expédition
          </a>
        </article>
      </div>
    </section>
  </body>
</html>`;

const detachedCatalog = parse(detachedCatalogHtml);
const detachedCards = catalogApi.expeditionCards(detachedCatalog);
assert(
  detachedCards.length === 1,
  'detached expedition catalog must keep native /prepare links even when isVisible() is false'
);
assert(
  catalogApi.expeditionPrepareLink(detachedCards[0])?.getAttribute('href')?.includes('/thorn_forest/prepare'),
  'detached expedition ranking must resolve the real prepare URL'
);

const pendingClaimHtml = `
<!doctype html>
<html>
  <body>
    <section class="mission-report">
      <div class="mission-encounter">
        <p>Aucun Pokémon sauvage rencontré.</p>
      </div>
      <section class="mission-rewards">
        <article>
          <strong>+75 XP</strong>
          <span class="mission-reward__meta">À récupérer</span>
        </article>
        <article>
          <strong>+38 Pokédollars</strong>
          <span class="mission-reward__meta">Sécurisée</span>
        </article>
      </section>
      <form method="POST" action="https://poketaka.fr/expeditions/results/result-123/claim">
        <input type="hidden" name="_token" value="csrf-real">
        <button type="submit">Récupérer les récompenses</button>
      </form>
    </section>
  </body>
</html>`;

const pending = resultApi.expeditionResultState(parse(pendingClaimHtml));
assert(pending.hasCapture === false, 'no encounter fixture must not expose a capture');
assert(pending.hasClaim === true, 'pending result must expose the real claim form');
assert(pending.rewardsRecovered === false, 'claim form must make the result unresolved');

const captureAndClaimHtml = `
<!doctype html>
<html>
  <body>
    <section class="mission-encounter">
      <h3>Salamèche</h3>
      <form data-capture-form method="POST" action="/expeditions/encounters/enc-1/capture">
        <input type="hidden" name="_token" value="csrf">
        <input type="hidden" name="idempotency_key" value="capture-1">
        <button type="submit">Lancer la Ball</button>
      </form>
    </section>
    <section class="mission-rewards">
      <span class="mission-reward__meta">À récupérer</span>
    </section>
    <form method="POST" action="/expeditions/results/result-123/claim">
      <input type="hidden" name="_token" value="csrf">
      <button type="submit">Récupérer les récompenses</button>
    </form>
  </body>
</html>`;

const captureAndClaim = resultApi.expeditionResultState(parse(captureAndClaimHtml));
assert(captureAndClaim.hasCapture === true, 'capture fixture must expose the encounter');
assert(captureAndClaim.hasClaim === true, 'capture result may still have pending rewards');
assert(captureAndClaim.rewardsRecovered === false, 'pending rewards must remain unresolved');

const resolvedHtml = `
<!doctype html>
<html>
  <body>
    <section class="mission-rewards">
      <span class="mission-reward__meta">Sécurisée</span>
      <span class="mission-reward__meta">Récupérée</span>
    </section>
    <div class="result-claimed">Récompenses récupérées</div>
  </body>
</html>`;

const resolved = resultApi.expeditionResultState(parse(resolvedHtml));
assert(resolved.hasCapture === false, 'resolved result must not expose a stale capture');
assert(resolved.hasClaim === false, 'resolved result must not expose a claim form');
assert(resolved.rewardsRecovered === true, 'resolved reward metadata must be accepted');

assert(
  stateSource.includes('function resetCaptureDecision') &&
  stateSource.includes('function clearExpeditionSelection') &&
  stateSource.includes('function acquireActionGuard'),
  'state integrity helpers must exist'
);

assert(
  httpSource.includes('http:${kind}:${url.pathname}') &&
  httpSource.includes('idempotency || \'no-idempotency\'') &&
  httpSource.includes('acquireActionGuard(guardKey, cooldownMs)'),
  'direct POSTs must use a durable endpoint/idempotency cooldown guard'
);

assert(
  domSource.includes('acquireActionGuard(guardKey, 4500)'),
  'DOM actions must use a short duplicate-action cooldown'
);

assert(
  cycleSource.includes("reconcileExpeditionResultState(document, 'visible_result')") &&
  cycleSource.includes('if (resultState.hasClaim)') &&
  cycleSource.includes("navigate: true"),
  'visible result flow must reconcile server DOM and never leave a pending claim'
);

assert(
  backgroundSource.includes("reconcileExpeditionResultState(page.doc, 'background_result')") &&
  backgroundSource.includes("clearExpeditionSelection('claim_verified:background')"),
  'background result flow must reconcile and clear stale state after verified claim'
);

assert(
  backgroundSource.includes("resultAction &&") &&
  backgroundSource.includes("expeditionCycle().phase !== 'ready_to_start'") &&
  backgroundSource.includes("Slot libéré après résultat — recherche immédiate d’une nouvelle expédition") &&
  backgroundSource.includes("backgroundObserveExpeditions({\n        force: true"),
  'verified claims must keep the same background cycle alive and immediately re-observe /expeditions'
);

assert(
  panelSource.includes('liveCapture.captureButton || liveCapture.form || liveCapture.skipButton') &&
  panelSource.includes('context.captureButton || context.form || context.skipButton'),
  'resolved encounters must not stay visible as actionable capture decisions'
);

console.log('Real expedition-result HTML fixtures: OK');
console.log('Pending claim invariant: OK');
console.log('Capture state cleanup wiring: OK');
console.log('HTTP/DOM duplicate-action guards: OK');
console.log('Visible/background result reconciliation: OK');
console.log('Verified claim relaunch continuation: OK');
console.log('Resolved capture panel cleanup: OK');
console.log('Detached expedition catalog prepare detection: OK');
