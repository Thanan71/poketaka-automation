/* GENERATED FILE — edit src/, never this output. */
(() => {
  'use strict';

  const VERSION = "0.9.10";

// ---- src/core/config.js ----
const STORAGE_KEY = 'poketaka-automation:config';
  const STATE_KEY = 'poketaka-automation:state';

  const DEFAULT_CONFIG = {
    enabled: false,
    directHttpActions: true,
    backgroundHttpMode: true,
    backgroundRefreshSeconds: 30,
    intervalMs: 15000,
    jitterMs: 3500,
    autoClaimExpeditions: true,
    autoStartExpeditions: true,
    autoHeal: true,
    autoHarvest: true,
    autoIncubatorClaim: true,
    autoBreedingClaim: true,
    autoProgression: true,
    autoGyms: true,
    autoLevelPokemon: true,
    autoEvolvePokemon: true,
    preserveEvolutionCandies: true,
    minStardustReserve: 500,
    pokemonProgressionScanMinutes: 45,
    minGymHpPercent: 70,
    gymRetryMinutes: 30,
    strategy: 'progression',
    goalPriorityBonus: 2400,
    minSuccessChance: 55,
    avoidLongLowValue: true,
    smartTeam: true,
    minTeamHpPercent: 45,
    maxRecommendedLevelDeficit: 2,
    rosterCacheMinutes: 30,
    missionBlockMinutes: 20,
    autoCapture: false,
    smartCapture: true,
    captureNewSpecies: true,
    captureRare: true,
    captureOwnedDuplicates: false,
    captureUnknownEncounters: false,
    minCaptureIvScore: 80,
    minBallReserve: 3,
    autoPlant: false,
    panelCollapsed: false,
    debug: true,
  };

  const MODULES = [
    { id: 'expeditions', label: 'Expéditions', keywords: ['expedition', 'expeditions', 'exploration'] },
    { id: 'healing', label: 'Soins', keywords: ['centre pokemon', 'pokemon center', 'soins', 'heal'] },
    { id: 'pokemon', label: 'Pokémon', keywords: ['collection', 'mes pokemon'] },
    { id: 'greenhouse', label: 'Serre', keywords: ['serre', 'greenhouse'] },
    { id: 'incubator', label: 'Incubateur', keywords: ['incubateur', 'incubator', 'oeufs', 'eggs', 'fossiles', 'fossils'] },
    { id: 'breeding', label: 'Pension', keywords: ['pension', 'daycare', 'elevage', 'breeding'] },
    { id: 'progression', label: 'Progression', keywords: ['arene', 'gym', 'ligue', 'league'] },
  ];

  const UNSAFE_WORDS = [
    'acheter', 'buy', 'purchase',
    'vendre', 'sell',
    'liberer', 'release',
    'supprimer', 'delete',
    'echanger', 'trade',
    'abandonner', 'abandon',
  ];

  const TYPE_CHART = {
    normal: { roche: 0.5, rock: 0.5, acier: 0.5, steel: 0.5, spectre: 0, ghost: 0 },
    feu: { plante: 2, grass: 2, glace: 2, ice: 2, insecte: 2, bug: 2, acier: 2, steel: 2, feu: 0.5, eau: 0.5, water: 0.5, roche: 0.5, rock: 0.5, dragon: 0.5 },
    eau: { feu: 2, sol: 2, ground: 2, roche: 2, rock: 2, eau: 0.5, plante: 0.5, grass: 0.5, dragon: 0.5 },
    electrik: { eau: 2, water: 2, vol: 2, flying: 2, electrik: 0.5, plante: 0.5, grass: 0.5, dragon: 0.5, sol: 0, ground: 0 },
    plante: { eau: 2, water: 2, sol: 2, ground: 2, roche: 2, rock: 2, feu: 0.5, plante: 0.5, poison: 0.5, vol: 0.5, flying: 0.5, insecte: 0.5, bug: 0.5, dragon: 0.5, acier: 0.5, steel: 0.5 },
    glace: { plante: 2, grass: 2, sol: 2, ground: 2, vol: 2, flying: 2, dragon: 2, feu: 0.5, eau: 0.5, water: 0.5, glace: 0.5, acier: 0.5, steel: 0.5 },
    combat: { normal: 2, glace: 2, roche: 2, rock: 2, tenebres: 2, dark: 2, acier: 2, steel: 2, poison: 0.5, vol: 0.5, flying: 0.5, psy: 0.5, psychic: 0.5, insecte: 0.5, bug: 0.5, fee: 0.5, fairy: 0.5, spectre: 0, ghost: 0 },
    poison: { plante: 2, grass: 2, fee: 2, fairy: 2, poison: 0.5, sol: 0.5, ground: 0.5, roche: 0.5, rock: 0.5, spectre: 0.5, ghost: 0.5, acier: 0, steel: 0 },
    sol: { feu: 2, electrik: 2, poison: 2, roche: 2, rock: 2, acier: 2, steel: 2, plante: 0.5, grass: 0.5, insecte: 0.5, bug: 0.5, vol: 0, flying: 0 },
    vol: { plante: 2, grass: 2, combat: 2, insecte: 2, bug: 2, electrik: 0.5, roche: 0.5, rock: 0.5, acier: 0.5, steel: 0.5 },
    psy: { combat: 2, poison: 2, psy: 0.5, psychic: 0.5, acier: 0.5, steel: 0.5, tenebres: 0, dark: 0 },
    insecte: { plante: 2, grass: 2, psy: 2, psychic: 2, tenebres: 2, dark: 2, feu: 0.5, combat: 0.5, poison: 0.5, vol: 0.5, flying: 0.5, spectre: 0.5, ghost: 0.5, acier: 0.5, steel: 0.5, fee: 0.5, fairy: 0.5 },
    roche: { feu: 2, glace: 2, vol: 2, flying: 2, insecte: 2, bug: 2, combat: 0.5, sol: 0.5, ground: 0.5, acier: 0.5, steel: 0.5 },
    spectre: { psy: 2, psychic: 2, spectre: 2, ghost: 2, tenebres: 0.5, dark: 0.5, normal: 0 },
    dragon: { dragon: 2, acier: 0.5, steel: 0.5, fee: 0, fairy: 0 },
    tenebres: { psy: 2, psychic: 2, spectre: 2, ghost: 2, combat: 0.5, tenebres: 0.5, dark: 0.5, fee: 0.5, fairy: 0.5 },
    acier: { glace: 2, roche: 2, rock: 2, fee: 2, fairy: 2, feu: 0.5, eau: 0.5, water: 0.5, electrik: 0.5, acier: 0.5, steel: 0.5 },
    fee: { combat: 2, dragon: 2, tenebres: 2, dark: 2, feu: 0.5, poison: 0.5, acier: 0.5, steel: 0.5 },
  };

// ---- src/core/state.js ----
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const now = () => Date.now();

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

  function loadConfig() {
    return { ...DEFAULT_CONFIG, ...(GM_getValue(STORAGE_KEY, {}) || {}) };
  }

  function saveConfig(config) {
    GM_setValue(STORAGE_KEY, config);
  }

  function loadState() {
    return {
      lastActionAt: 0,
      lastAction: 'aucune',
      lastBotClickAt: 0,
      actionLog: [],
      panelView: 'dashboard',
      httpTransport: {
        requests: 0,
        lastAt: 0,
        lastEndpoint: null,
        lastKind: null,
        lastStatus: null,
        lastError: null,
      },
      backgroundHttp: {
        gets: 0,
        cacheHits: 0,
        lastAt: 0,
        lastUrl: null,
        lastStatus: null,
        lastError: null,
        lastSweepAt: 0,
        observedPaths: {},
      },
      navIndex: 0,
      actions: 0,
      selectedExpedition: null,
      selectedExpeditionScore: null,
      moduleStatus: {},
      lastNavigationAt: 0,
      expeditionCycle: {
        phase: 'unknown',
        title: null,
        resultUrl: null,
        dueAt: null,
        lastTransitionAt: 0,
      },
      smartTeam: {
        lastSelection: [],
        lastMissionTypes: [],
        lastRecommendedLevel: null,
      },
      rosterSnapshot: {
        capturedAt: 0,
        pokemon: [],
      },
      expeditionBlocks: {},
      expeditionPlan: {
        title: null,
        team: [],
        teamIds: [],
        teamScore: null,
        viability: 'unknown',
        reason: null,
        updatedAt: 0,
      },
      pokemonProgression: {
        phase: 'idle',
        targetId: null,
        targetName: null,
        targetLevel: null,
        action: null,
        reason: null,
        scannedIds: [],
        scanStartedAt: 0,
        lastScanAt: 0,
        blockedUntil: 0,
        lastUpgradeAt: 0,
        lastEvolutionAt: 0,
      },
      captureDecision: {
        action: 'none',
        reason: null,
        species: null,
        isNew: null,
        rarity: null,
        ivScore: null,
        ballName: null,
        ballCode: null,
        ballReserve: null,
        captureChance: null,
        attemptsRemaining: null,
        updatedAt: 0,
      },
      expeditionStats: {},
      lastRecordedResultUrl: null,
      gymCycle: {
        phase: 'unknown',
        checkedDay: null,
        availableToday: null,
        arena: null,
        champion: null,
        badge: null,
        badges: null,
        totalBadges: 8,
        requiredTeamSize: null,
        selectedTeam: [],
        teamScore: null,
        reason: null,
        needsHealing: false,
        blockedUntil: 0,
        lastCheckAt: 0,
        lastChallengeAt: 0,
        challengeSubmittedDay: null,
        completedDay: null,
      },
      accountSnapshot: {
        version: 1,
        observedAt: 0,
        page: null,
        trainer: { level: null },
        roster: {
          known: false,
          capturedAt: 0,
          count: 0,
          healthyCount: 0,
          averageLevel: null,
          pokemon: [],
        },
        league: {
          known: false,
          badges: null,
          totalBadges: 8,
          dailyBattleAvailable: null,
          arena: null,
          champion: null,
          badge: null,
          phase: 'unknown',
          needsHealing: false,
          lockedGyms: [],
        },
        expeditions: {
          phase: 'unknown',
          activeTitle: null,
          selectedTitle: null,
          dueAt: null,
          completedTitles: [],
          locked: [],
          failureStreaks: {},
        },
        pokedex: {
          known: false,
          capturedSpecies: null,
          totalSpecies: null,
        },
        resources: {
          known: false,
          balls: null,
        },
        sources: [],
      },
      goalPlan: {
        version: 1,
        generatedAt: 0,
        strategy: 'progression',
        primary: {
          id: 'idle',
          title: 'Observer le compte',
          reason: 'Pas encore assez de contexte.',
          module: null,
          target: null,
        },
        step: {
          id: 'observe',
          title: 'Collecter l’état du compte',
          reason: 'Le planner attend davantage de données.',
          module: null,
          action: 'observe',
          target: null,
        },
        blockers: [],
        confidence: 'low',
      },
      orchestrator: {
        lastDecision: null,
        lastReason: null,
        lastPriority: 0,
      },
      ...(GM_getValue(STATE_KEY, {}) || {}),
    };
  }

  function saveState(state) {
    GM_setValue(STATE_KEY, state);
  }

  function actionLogEntries() {
    return Array.isArray(state.actionLog) ? state.actionLog : [];
  }

  function appendActionLog(level, category, message, details = null) {
    const entry = {
      id: `${now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: now(),
      level: level || 'info',
      category: category || 'bot',
      message: String(message || ''),
      details: details == null
        ? null
        : typeof details === 'string'
          ? details
          : JSON.stringify(details),
    };

    state.actionLog = [entry, ...actionLogEntries()].slice(0, 120);
    saveState(state);
    return entry;
  }

  function clearActionLog() {
    state.actionLog = [];
    saveState(state);
    updatePanel();
  }

  function expeditionCycle() {
    if (!state.expeditionCycle || typeof state.expeditionCycle !== 'object') {
      state.expeditionCycle = {
        phase: 'unknown',
        title: null,
        resultUrl: null,
        dueAt: null,
        lastTransitionAt: 0,
      };
    }
    return state.expeditionCycle;
  }

  function setExpeditionPhase(phase, patch = {}) {
    const previous = expeditionCycle();
    state.expeditionCycle = {
      ...previous,
      ...patch,
      phase,
      lastTransitionAt: previous.phase === phase
        ? previous.lastTransitionAt
        : now(),
    };
    const changed =
      previous.phase !== state.expeditionCycle.phase ||
      previous.title !== state.expeditionCycle.title ||
      previous.resultUrl !== state.expeditionCycle.resultUrl ||
      previous.dueAt !== state.expeditionCycle.dueAt;

    saveState(state);
    updatePanel();

    if (changed) {
      appendActionLog(
        'info',
        'expedition',
        `Cycle expédition → ${phase}`,
        {
          title: state.expeditionCycle.title,
          dueAt: state.expeditionCycle.dueAt,
        }
      );
    }

    log('Cycle expédition:', state.expeditionCycle);
  }

  let config = loadConfig();
  let state = loadState();
  let running = false;
  let timer = null;

  function log(...args) {
    if (config.debug) console.log('[PokéTaka Auto]', ...args);
  }

// ---- src/core/dom.js ----
function elementText(el) {
    return normalizeText([
      el?.innerText,
      el?.textContent,
      el?.getAttribute?.('aria-label'),
      el?.getAttribute?.('title'),
      el?.getAttribute?.('value'),
    ].filter(Boolean).join(' '));
  }

  function isVisible(el) {
    if (!el || !el.isConnected || el.disabled) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity) !== 0 &&
      rect.width > 0 && rect.height > 0;
  }

  function isUnsafe(el) {
    const text = elementText(el);
    return UNSAFE_WORDS.some(word => text.includes(word));
  }

  function isBotUiElement(el) {
    return Boolean(el?.closest?.('#pta-panel'));
  }

  function clickableElements(root = document) {
    return [...root.querySelectorAll('button, a[href], input[type="submit"], input[type="button"], [role="button"]')]
      .filter(isVisible)
      .filter(el => !isBotUiElement(el))
      .filter(el => !isUnsafe(el));
  }

  function findClickable(patterns, root = document, { exclude = [] } = {}) {
    const wanted = patterns.map(normalizeText);
    const blocked = exclude.map(normalizeText);
    return clickableElements(root).find(el => {
      const text = elementText(el);
      return wanted.some(pattern => text.includes(pattern)) &&
        !blocked.some(pattern => text.includes(pattern));
    }) || null;
  }

  function findAllClickables(patterns, root = document, { exclude = [] } = {}) {
    const wanted = patterns.map(normalizeText);
    const blocked = exclude.map(normalizeText);
    return clickableElements(root).filter(el => {
      const text = elementText(el);
      return wanted.some(pattern => text.includes(pattern)) &&
        !blocked.some(pattern => text.includes(pattern));
    });
  }

  async function clickElement(el, actionName) {
    if (!el || !isVisible(el) || isBotUiElement(el) || isUnsafe(el)) return false;

    state.lastActionAt = now();
    state.lastBotClickAt = now();
    state.lastAction = actionName;
    state.actions += 1;
    markModuleAction(moduleFromLocation()?.id);
    appendActionLog(
      'info',
      'dom',
      actionName,
      {
        tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      }
    );
    saveState(state);
    updatePanel();

    log('Action:', actionName, el);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(300 + Math.floor(Math.random() * 600));
    el.click();
    return true;
  }

  function recentBotAction(maxAgeMs = 6000) {
    return now() - state.lastBotClickAt <= maxAgeMs;
  }

  async function handleConfirmation() {
    if (!recentBotAction()) return false;
    const confirm = findClickable(
      ['confirmer', 'confirm', 'oui', 'yes', 'valider'],
      document,
      { exclude: ['annuler', 'cancel'] },
    );
    if (!confirm) return false;
    return clickElement(confirm, 'Confirmation');
  }

// ---- src/core/http.js ----
let directRequestInFlight = false;

const backgroundPageCache = new Map();
let backgroundRequestInFlight = false;

function backgroundHttpState() {
  if (!state.backgroundHttp || typeof state.backgroundHttp !== 'object') {
    state.backgroundHttp = {
      gets: 0,
      cacheHits: 0,
      lastAt: 0,
      lastUrl: null,
      lastStatus: null,
      lastError: null,
      lastSweepAt: 0,
      observedPaths: {},
    };
  }
  return state.backgroundHttp;
}

function backgroundRouteFresh(pathname, maxAgeMs = 90000) {
  const observedAt = Number(backgroundHttpState().observedPaths?.[pathname] || 0);
  return observedAt > 0 && now() - observedAt <= maxAgeMs;
}

function backgroundPageKind(urlLike) {
  let url;
  try {
    url = new URL(urlLike, location.href);
  } catch {
    return null;
  }

  if (url.origin !== location.origin) return null;

  const path = url.pathname;
  const routes = [
    ['expeditions', /^\/expeditions\/?$/],
    ['expedition_prepare', /^\/expeditions\/[^/]+\/prepare\/?$/],
    ['expedition_result', /^\/expeditions\/results\/[^/]+\/?$/],
    ['league', /^\/league\/?$/],
    ['gym_prepare', /^\/gyms\/[^/]+\/prepare\/?$/],
    ['collection', /^\/collection\/?$/],
    ['pokemon_profile', /^\/collection\/[^/]+\/?$/],
  ];

  return routes.find(([, pattern]) => pattern.test(path))?.[0] || null;
}

function recordBackgroundHttp(patch = {}) {
  state.backgroundHttp = {
    ...backgroundHttpState(),
    ...patch,
  };
  saveState(state);
  updatePanel();
}

function attachBackgroundBase(doc, href) {
  if (!doc?.head) return doc;
  const existing = doc.querySelector('base[data-poketaka-background-base]');
  if (existing) existing.remove();

  const base = doc.createElement('base');
  base.setAttribute('data-poketaka-background-base', '');
  base.href = href;
  doc.head.prepend(base);
  return doc;
}

async function fetchObservedPage(
  urlLike,
  {
    cacheMs = 8000,
    force = false,
  } = {}
) {
  if (!config.backgroundHttpMode) return null;

  let url;
  try {
    url = new URL(urlLike, location.href);
  } catch {
    return null;
  }

  const kind = backgroundPageKind(url.href);
  if (!kind) {
    log('GET background refusé: route non autorisée', url.href);
    return null;
  }

  const cacheKey = url.href;
  const cached = backgroundPageCache.get(cacheKey);
  if (!force && cached && now() - cached.fetchedAt <= cacheMs) {
    recordBackgroundHttp({
      cacheHits: Number(backgroundHttpState().cacheHits || 0) + 1,
      lastAt: now(),
      lastUrl: url.pathname,
      lastStatus: 'cache',
      lastError: null,
    });
    return cached;
  }

  if (backgroundRequestInFlight) return null;
  backgroundRequestInFlight = true;

  try {
    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml',
      },
      credentials: 'same-origin',
      redirect: 'follow',
      cache: 'no-store',
    });

    const finalUrl = new URL(response.url || url.href, url.href);

    if (finalUrl.origin !== location.origin) {
      throw new Error('Redirection GET cross-origin refusée');
    }

    if (/^\/login\/?$/.test(finalUrl.pathname)) {
      throw new Error('Session PokéTaka expirée');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      throw new Error(`Réponse non HTML (${contentType || 'inconnue'})`);
    }

    const html = await response.text();
    const doc = attachBackgroundBase(
      new DOMParser().parseFromString(html, 'text/html'),
      finalUrl.href
    );

    const result = {
      kind,
      url: finalUrl.href,
      pathname: finalUrl.pathname,
      status: response.status,
      fetchedAt: now(),
      html,
      doc,
    };

    backgroundPageCache.set(cacheKey, result);

    recordBackgroundHttp({
      gets: Number(backgroundHttpState().gets || 0) + 1,
      lastAt: now(),
      lastUrl: finalUrl.pathname,
      lastStatus: response.status,
      lastError: null,
      observedPaths: {
        ...(backgroundHttpState().observedPaths || {}),
        [finalUrl.pathname]: now(),
      },
    });

    return result;
  } catch (error) {
    const message = error?.message || String(error);
    recordBackgroundHttp({
      lastAt: now(),
      lastUrl: url.pathname,
      lastStatus: 'error',
      lastError: message,
    });
    appendActionLog(
      'error',
      'background',
      `GET arrière-plan échoué: ${url.pathname}`,
      message
    );
    log('GET background en échec', url.pathname, message);
    return null;
  } finally {
    backgroundRequestInFlight = false;
  }
}

function httpTransportState() {
  if (!state.httpTransport || typeof state.httpTransport !== 'object') {
    state.httpTransport = {
      requests: 0,
      lastAt: 0,
      lastEndpoint: null,
      lastKind: null,
      lastStatus: null,
      lastError: null,
    };
  }
  return state.httpTransport;
}

function directActionKind(urlLike) {
  let url;
  try {
    url = new URL(urlLike, location.href);
  } catch {
    return null;
  }

  if (url.origin !== location.origin) return null;

  const path = url.pathname;
  const routes = [
    ['capture', /^\/expeditions\/encounters\/[^/]+\/capture\/?$/],
    ['expedition_claim', /^\/expeditions\/results\/[^/]+\/claim\/?$/],
    ['expedition_launch', /^\/expeditions\/[^/]+\/launch\/?$/],
    ['gym_challenge', /^\/gyms\/[^/]+\/challenge\/?$/],
    ['pokemon_level_up', /^\/collection\/[^/]+\/level-up\/?$/],
    ['pokemon_evolve', /^\/collection\/[^/]+\/evolve\/?$/],
    ['pokemon_item', /^\/collection\/[^/]+\/items\/[a-z0-9_-]+\/?$/i],
  ];

  return routes.find(([, pattern]) => pattern.test(path))?.[0] || null;
}

function formMethod(form) {
  return String(form?.getAttribute('method') || form?.method || 'GET').toUpperCase();
}

function formDataWithOverrides(form, overrides = {}) {
  const data = new FormData(form);

  for (const [key, value] of Object.entries(overrides || {})) {
    data.delete(key);

    if (Array.isArray(value)) {
      value.forEach(entry => {
        if (entry != null) data.append(key, String(entry));
      });
      continue;
    }

    if (value != null) data.set(key, String(value));
  }

  return data;
}

function requestBodyFromForm(form, overrides = {}) {
  const data = formDataWithOverrides(form, overrides);
  const enctype = String(form.enctype || '').toLowerCase();

  if (enctype.includes('multipart/form-data')) {
    return { body: data, headers: {} };
  }

  const params = new URLSearchParams();
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string') params.append(key, value);
  }

  return {
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };
}

function directRequestErrorFromHtml(html) {
  if (!html || typeof DOMParser === 'undefined') return null;

  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const error = doc.querySelector(
      '.error-summary, [role="alert"].context-alert, .field-error[role="alert"]'
    );
    const text = error?.textContent?.replace(/\s+/g, ' ').trim();
    return text || null;
  } catch {
    return null;
  }
}

function recordHttpTransport(patch = {}) {
  state.httpTransport = {
    ...httpTransportState(),
    ...patch,
  };
  saveState(state);
  updatePanel();
}

function recordDirectAction(actionName, kind, endpoint) {
  state.lastActionAt = now();
  state.lastAction = actionName;
  state.actions += 1;
  markModuleAction(moduleFromLocation()?.id);

  recordHttpTransport({
    requests: Number(httpTransportState().requests || 0) + 1,
    lastAt: now(),
    lastEndpoint: endpoint,
    lastKind: kind,
    lastStatus: 'pending',
    lastError: null,
  });

  appendActionLog(
    'info',
    'http',
    actionName,
    { method: 'POST', kind, endpoint, status: 'pending' }
  );
}

function finalizeDirectNavigation(response) {
  let finalUrl = null;

  try {
    finalUrl = new URL(response.url || location.href, location.href);
  } catch {
    finalUrl = new URL(location.href);
  }

  if (finalUrl.origin !== location.origin) {
    throw new Error('Redirection cross-origin refusée');
  }

  if (/^\/login\/?$/.test(finalUrl.pathname)) {
    throw new Error('Session PokéTaka expirée');
  }

  const current = new URL(location.href);

  if (
    finalUrl.pathname === current.pathname &&
    finalUrl.search === current.search
  ) {
    location.reload();
    return;
  }

  location.assign(finalUrl.href);
}

async function submitObservedForm(
  form,
  actionName,
  {
    overrides = {},
    expectedKind = null,
    navigate = true,
    moduleId = null,
  } = {}
) {
  if (!config.directHttpActions) return false;
  if (!form || directRequestInFlight) return false;
  if (formMethod(form) !== 'POST') return false;

  const action = form.getAttribute('action') || form.action;
  const kind = directActionKind(action);
  if (!kind) {
    log('HTTP direct refusé: endpoint non autorisé', action);
    return false;
  }

  if (expectedKind && kind !== expectedKind) {
    log('HTTP direct refusé: type inattendu', { expectedKind, kind, action });
    return false;
  }

  const url = new URL(action, location.href);
  const { body, headers } = requestBodyFromForm(form, overrides);

  const csrf = body instanceof URLSearchParams
    ? body.get('_token')
    : body.get('_token');
  const idempotency = body instanceof URLSearchParams
    ? body.get('idempotency_key')
    : body.get('idempotency_key');

  if (!csrf) {
    log('HTTP direct refusé: token CSRF absent', kind);
    return false;
  }

  // Les actions critiques observées utilisent une clé d'idempotence. On la
  // conserve telle quelle et on refuse d'en inventer une.
  if (
    ['capture', 'expedition_launch', 'gym_challenge', 'pokemon_level_up', 'pokemon_evolve', 'pokemon_item']
      .includes(kind) &&
    !idempotency
  ) {
    log('HTTP direct refusé: clé idempotency absente', kind);
    return false;
  }

  directRequestInFlight = true;
  recordDirectAction(actionName, kind, url.pathname);
  if (moduleId) markModuleAction(moduleId);

  try {
    const response = await fetch(url.href, {
      method: 'POST',
      body,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        ...headers,
      },
      credentials: 'same-origin',
      redirect: 'follow',
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const html = contentType.includes('text/html')
      ? await response.text()
      : '';

    const errorText = directRequestErrorFromHtml(html);

    if (!response.ok || errorText) {
      const message = errorText || `HTTP ${response.status}`;
      recordHttpTransport({
        lastStatus: response.status,
        lastError: message,
      });
      state.lastAction = `${actionName} — échec: ${message}`;
      saveState(state);
      updatePanel();
      appendActionLog(
        'error',
        'http',
        `${actionName} — échec`,
        {
          endpoint: url.pathname,
          kind,
          status: response.status,
          message,
        }
      );
      log('HTTP direct en échec', {
        kind,
        endpoint: url.pathname,
        status: response.status,
        message,
      });
      return false;
    }

    recordHttpTransport({
      lastStatus: response.status,
      lastError: null,
    });

    appendActionLog(
      'success',
      'http',
      `${actionName} — réussi`,
      {
        endpoint: url.pathname,
        kind,
        status: response.status,
        finalUrl: response.url,
        navigate,
      }
    );

    log('HTTP direct réussi', {
      kind,
      endpoint: url.pathname,
      status: response.status,
      finalUrl: response.url,
    });

    if (navigate) finalizeDirectNavigation(response);
    return true;
  } catch (error) {
    const message = error?.message || String(error);
    recordHttpTransport({
      lastStatus: 'error',
      lastError: message,
    });
    state.lastAction = `${actionName} — erreur HTTP: ${message}`;
    saveState(state);
    updatePanel();
    appendActionLog(
      'error',
      'http',
      `${actionName} — erreur réseau`,
      {
        endpoint: url.pathname,
        kind,
        message,
      }
    );
    console.error('[PokéTaka Auto] HTTP direct', kind, error);
    return false;
  } finally {
    directRequestInFlight = false;
  }
}

function recentDirectRequest(maxAgeMs = 6000) {
  return now() - Number(httpTransportState().lastAt || 0) <= maxAgeMs;
}

function navigateDirectly(urlLike, actionName) {
  let url;

  try {
    url = new URL(urlLike, location.href);
  } catch {
    return false;
  }

  if (url.origin !== location.origin) return false;

  state.lastActionAt = now();
  state.lastAction = actionName;
  state.lastNavigationAt = now();
  state.actions += 1;
  appendActionLog(
    'info',
    'navigation',
    actionName,
    { target: url.pathname }
  );
  saveState(state);
  updatePanel();

  location.assign(url.href);
  return true;
}

// ---- src/features/expeditions/team.js ----
function teamRequirementFromForm(form) {
  if (!form) return null;

  const min = Number(form.getAttribute('data-team-min') || 1);
  const max = Number(form.getAttribute('data-team-max') || min);
  const selectedIds = [...form.querySelectorAll('[data-team-select]')]
    .map(select => select.value)
    .filter(Boolean);

  return { form, min, max, selected: selectedIds.length, selectedIds };
}

function expeditionTeamRequirement(root = document) {
  const form = root.querySelector('form.expedition-prep[data-team-builder]');
  return teamRequirementFromForm(form);
}

function canonicalType(value) {
  const type = normalizeText(value);
  const aliases = {
    fire: 'feu', water: 'eau', grass: 'plante', electric: 'electrik',
    ice: 'glace', fighting: 'combat', ground: 'sol', flying: 'vol',
    psychic: 'psy', bug: 'insecte', rock: 'roche', ghost: 'spectre',
    dark: 'tenebres', steel: 'acier', fairy: 'fee',
  };
  return aliases[type] || type;
}

function typeMultiplier(attacker, defender) {
  const atk = canonicalType(attacker);
  const def = canonicalType(defender);
  return TYPE_CHART[atk]?.[def] ?? 1;
}

function parseMissionTypes(text = '') {
  const normalized = normalizeText(text);
  const aliases = [
    ['normal', ['normal']],
    ['feu', ['feu', 'fire']],
    ['eau', ['eau', 'water']],
    ['electrik', ['electrik', 'electric']],
    ['plante', ['plante', 'grass']],
    ['glace', ['glace', 'ice']],
    ['combat', ['combat', 'fighting']],
    ['poison', ['poison']],
    ['sol', ['sol', 'ground']],
    ['vol', ['vol', 'flying']],
    ['psy', ['psy', 'psychic']],
    ['insecte', ['insecte', 'bug']],
    ['roche', ['roche', 'rock']],
    ['spectre', ['spectre', 'ghost']],
    ['dragon', ['dragon']],
    ['tenebres', ['tenebres', 'dark']],
    ['acier', ['acier', 'steel']],
    ['fee', ['fee', 'fairy']],
  ];

  return aliases
    .filter(([, words]) => words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(normalized)))
    .map(([type]) => type);
}

function parseRequiredTeamSize(text = '') {
  return parseFirstMatch(normalizeText(text), [
    /(?:equipe|team)\s*[:=-]?\s*(\d+)\s*(?:pokemon|pokemons)?/i,
    /(?:pokemon|pokemons)\s*(?:requis|required)?\s*[:=-]?\s*(\d+)/i,
  ]) || 1;
}

function expeditionPreparationContext(requirement) {
  const root = requirement?.form?.closest('main') || document;
  const facts = {};

  root.querySelectorAll('.expedition-prep-facts > div').forEach(row => {
    const key = normalizeText(row.querySelector('dt')?.textContent || '');
    const value = normalizeText(row.querySelector('dd')?.textContent || '');
    if (key) facts[key] = value;
  });

  const typeText = facts['types principaux'] || facts.types || '';
  const missionTypes = parseMissionTypes(typeText);

  const recommendedLevel = parseNumber(
    (facts['niveau conseille'] || facts['niveau recommandé'] || '').match(/\d+(?:[.,]\d+)?/)?.[0]
  );

  return {
    title: normalizeText(root.querySelector('.page-header h1, h1')?.textContent || ''),
    missionTypes,
    recommendedLevel,
    durationMinutes: parseDurationMinutes(facts.duree || facts.duration || ''),
    teamSize: requirement?.min || parseRequiredTeamSize(facts.equipe || ''),
  };
}

function pokemonFromCard(card) {
  const hp = parseNumber(card.getAttribute('data-pokemon-hp')) || 0;
  const hpMax = parseNumber(card.getAttribute('data-pokemon-hp-max')) || hp || 1;

  return {
    card,
    id: card.getAttribute('data-pokemon-id') || '',
    name: card.getAttribute('data-pokemon-name') || normalizeText(card.textContent || ''),
    level: parseNumber(card.getAttribute('data-pokemon-level')) || 0,
    hp,
    hpMax,
    hpPercent: hpMax > 0 ? (hp / hpMax) * 100 : 0,
    types: (card.getAttribute('data-pokemon-types') || '')
      .split(/[\s,;/]+/)
      .map(canonicalType)
      .filter(Boolean),
    favorite: card.getAttribute('data-pokemon-favorite') === '1',
    heldItem: Boolean(card.getAttribute('data-pokemon-held-item')),
  };
}

function serializablePokemon(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    level: pokemon.level,
    hp: pokemon.hp,
    hpMax: pokemon.hpMax,
    hpPercent: pokemon.hpPercent,
    types: pokemon.types,
    favorite: pokemon.favorite,
    heldItem: pokemon.heldItem,
  };
}

function scorePokemonForMission(pokemon, context) {
  let score = pokemon.level * 12;
  const reasons = [`niveau ${pokemon.level}`];

  score += pokemon.hpPercent * 0.55;
  reasons.push(`PV ${Math.round(pokemon.hpPercent)}%`);

  let viable = pokemon.hpPercent >= config.minTeamHpPercent;
  if (!viable) {
    score -= 1000;
    reasons.push(`PV sous ${config.minTeamHpPercent}%`);
  }

  if (context.recommendedLevel != null) {
    const delta = pokemon.level - context.recommendedLevel;

    if (delta >= 0) {
      const bonus = Math.min(90, 30 + delta * 9);
      score += bonus;
      reasons.push(`+${bonus} niveau adapté`);
    } else {
      const deficit = Math.abs(delta);
      const penalty = Math.min(700, deficit * 80);
      score -= penalty;
      reasons.push(`-${penalty} déficit niveau ${deficit}`);

      if (deficit > config.maxRecommendedLevelDeficit) {
        viable = false;
        reasons.push(`déficit > ${config.maxRecommendedLevelDeficit}`);
      }
    }
  }

  if (context.missionTypes?.length && pokemon.types?.length) {
    const offensive = context.missionTypes.reduce((sum, defender) => {
      const best = Math.max(
        ...pokemon.types.map(attacker => typeMultiplier(attacker, defender))
      );

      if (best >= 2) return sum + 50;
      if (best > 1) return sum + 20;
      if (best === 0) return sum - 90;
      if (best < 1) return sum - 30;
      return sum;
    }, 0);

    const defensive = context.missionTypes.reduce((sum, attacker) => {
      const received = pokemon.types.reduce(
        (multiplier, defender) => multiplier * typeMultiplier(attacker, defender),
        1
      );

      if (received === 0) return sum + 55;
      if (received <= 0.25) return sum + 40;
      if (received < 1) return sum + 25;
      if (received >= 4) return sum - 90;
      if (received > 1) return sum - 45;
      return sum;
    }, 0);

    score += offensive + defensive;
    if (offensive) reasons.push(`${offensive > 0 ? '+' : ''}${offensive} attaque/types`);
    if (defensive) reasons.push(`${defensive > 0 ? '+' : ''}${defensive} défense/types`);
  }

  if (pokemon.favorite) score += 5;
  if (pokemon.heldItem) score += 8;

  return {
    ...pokemon,
    score: Math.round(score),
    viable,
    reasons,
    missionTypes: context.missionTypes || [],
    recommendedLevel: context.recommendedLevel ?? null,
  };
}

function chooseTeamForMission(roster, context) {
  const teamSize = Math.max(1, Number(context.teamSize || 1));
  const ranked = roster
    .map(pokemon => scorePokemonForMission(pokemon, context))
    .sort((a, b) => b.score - a.score);

  const viable = ranked.filter(pokemon => pokemon.viable);
  const team = [];
  const usedTypes = new Set();

  while (team.length < teamSize) {
    const remaining = viable.filter(pokemon => !team.some(member => member.id === pokemon.id));
    if (!remaining.length) break;

    const next = remaining
      .map(pokemon => {
        const newTypes = pokemon.types.filter(type => !usedTypes.has(type)).length;
        const overlap = pokemon.types.filter(type => usedTypes.has(type)).length;
        return {
          pokemon,
          adjustedScore: pokemon.score + newTypes * 18 - overlap * 6,
        };
      })
      .sort((a, b) => b.adjustedScore - a.adjustedScore)[0]?.pokemon;

    if (!next) break;
    team.push(next);
    next.types.forEach(type => usedTypes.add(type));
  }

  const complete = team.length >= teamSize;
  const teamScore = team.length
    ? Math.round(team.reduce((sum, pokemon) => sum + pokemon.score, 0) / team.length)
    : null;

  const avgLevel = team.length
    ? team.reduce((sum, pokemon) => sum + pokemon.level, 0) / team.length
    : null;

  const minHpPercent = team.length
    ? Math.min(...team.map(pokemon => pokemon.hpPercent))
    : null;

  return {
    known: roster.length > 0,
    viable: complete,
    teamSize,
    team,
    ranked,
    teamScore,
    avgLevel,
    minHpPercent,
    reason: complete
      ? `équipe viable ${team.map(pokemon => pokemon.name).join(', ')}`
      : `seulement ${team.length}/${teamSize} Pokémon viable(s)`,
  };
}

function updateRosterSnapshot(requirement) {
  if (!requirement?.form) return [];

  const visibleRoster = [...requirement.form.querySelectorAll('[data-team-pokemon][data-pokemon-id]')]
    .map(pokemonFromCard)
    .filter(pokemon => pokemon.id);

  const previousById = new Map(
    (state.rosterSnapshot?.pokemon || []).map(pokemon => [pokemon.id, pokemon])
  );

  const mergedById = new Map();
  for (const pokemon of visibleRoster) mergedById.set(pokemon.id, pokemon);

  for (const selectedId of requirement.selectedIds || []) {
    if (!mergedById.has(selectedId) && previousById.has(selectedId)) {
      mergedById.set(selectedId, previousById.get(selectedId));
    }
  }

  const roster = [...mergedById.values()];
  state.rosterSnapshot = {
    capturedAt: now(),
    pokemon: roster.map(serializablePokemon),
  };
  saveState(state);
  return roster;
}

function cachedRoster() {
  const snapshot = state.rosterSnapshot;
  if (!snapshot?.capturedAt || !Array.isArray(snapshot.pokemon)) return [];

  const maxAgeMs = config.rosterCacheMinutes * 60 * 1000;
  if (now() - snapshot.capturedAt > maxAgeMs) return [];

  return snapshot.pokemon;
}

function estimateTeamForMission(context) {
  const roster = cachedRoster();
  if (!roster.length) {
    return {
      known: false,
      viable: null,
      teamSize: context.teamSize || 1,
      team: [],
      ranked: [],
      teamScore: null,
      avgLevel: null,
      minHpPercent: null,
      reason: 'roster inconnu',
    };
  }

  return chooseTeamForMission(roster, context);
}

function currentMissionBlock(title) {
  const block = state.expeditionBlocks?.[title];
  if (!block?.until) return null;
  if (block.until <= now()) {
    delete state.expeditionBlocks[title];
    saveState(state);
    return null;
  }
  return block;
}

function blockMissionTemporarily(title, reason) {
  const until = now() + config.missionBlockMinutes * 60 * 1000;
  state.expeditionBlocks = {
    ...(state.expeditionBlocks || {}),
    [title]: { until, reason, createdAt: now() },
  };
  saveState(state);
  return until;
}

function preparationTeamPlan(requirement) {
  const roster = updateRosterSnapshot(requirement);
  const context = expeditionPreparationContext(requirement);
  const plan = chooseTeamForMission(roster, context);

  state.expeditionPlan = {
    title: expeditionCycle().title || context.title,
    team: plan.team.map(pokemon => pokemon.name),
    teamIds: plan.team.map(pokemon => pokemon.id),
    teamScore: plan.teamScore,
    viability: plan.viable ? 'viable' : 'blocked',
    reason: plan.reason,
    updatedAt: now(),
  };

  state.smartTeam = {
    lastSelection: plan.team.map(pokemon => pokemon.name),
    lastMissionTypes: context.missionTypes,
    lastRecommendedLevel: context.recommendedLevel,
  };

  saveState(state);
  return { context, plan };
}

async function selectNextPlannedPokemon(requirement, assessment) {
  const selected = new Set(requirement.selectedIds || []);
  const next = assessment.plan.team.find(pokemon => !selected.has(pokemon.id));
  if (!next) return false;

  const select = [...requirement.form.querySelectorAll('select[data-team-select]')]
    .find(input =>
      !input.value &&
      [...input.options].some(option => option.value === next.id)
    );

  if (select) {
    select.value = next.id;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    state.lastAction = `Équipe intelligente: ${next.name} (score ${next.score})`;
    state.lastActionAt = now();
    state.lastBotClickAt = now();
    state.actions += 1;
    saveState(state);
    updatePanel();
    log('Équipe intelligente via select:', next);
    return true;
  }

  const card = assessment.plan.ranked.find(pokemon => pokemon.id === next.id)?.card;
  if (card && isVisible(card)) {
    return clickElement(
      card,
      `Équipe intelligente: ${next.name} (score ${next.score})`
    );
  }

  return false;
}

async function handleExpeditionPreparation() {
  if (!config.autoStartExpeditions) return false;

  const requirement = expeditionTeamRequirement();
  if (!requirement) return false;

  const assessment = preparationTeamPlan(requirement);
  const canonicalTitle = expeditionCycle().title || assessment.context.title || 'expedition';

  if (assessment.plan.viable && state.expeditionBlocks?.[canonicalTitle]) {
    delete state.expeditionBlocks[canonicalTitle];
    saveState(state);
  }

  if (config.smartTeam && !assessment.plan.viable) {
    const title = canonicalTitle;
    blockMissionTemporarily(title, assessment.plan.reason);

    state.lastAction = `Mission écartée: ${title} — ${assessment.plan.reason}`;
    saveState(state);
    updatePanel();

    const link = expeditionIndexLink();
    if (link) {
      setExpeditionPhase('ready_to_start', {
        title: null,
        resultUrl: null,
        dueAt: null,
      });
      return clickElement(link, 'Équipe insuffisante — retour aux expéditions');
    }

    return false;
  }

  if (
    config.directHttpActions &&
    config.smartTeam &&
    assessment.plan.viable
  ) {
    if (recentDirectRequest(1800) || recentBotAction(1800)) return false;

    const plannedIds = assessment.plan.team.map(pokemon => pokemon.id);
    if (plannedIds.length >= requirement.min) {
      setExpeditionPhase('starting', {
        title: canonicalTitle,
      });

      const submitted = await submitObservedForm(
        requirement.form,
        `Lancement HTTP: ${canonicalTitle}`,
        {
          expectedKind: 'expedition_launch',
          overrides: {
            selection_source: 'custom',
            'pokemon_public_ids[]': plannedIds,
          },
        }
      );

      if (!submitted) {
        setExpeditionPhase('preparing', {
          title: canonicalTitle,
        });
      }

      return submitted;
    }
  }

  if (requirement.selected < requirement.min) {
    if (config.smartTeam) {
      const selected = await selectNextPlannedPokemon(requirement, assessment);
      if (selected) {
        setExpeditionPhase('preparing');
        return true;
      }
    }

    const lastTeamButton = document.querySelector(
      'button[data-last-expedition-team][data-last-team-ids]'
    );

    if (lastTeamButton && isVisible(lastTeamButton)) {
      setExpeditionPhase('preparing');
      return clickElement(lastTeamButton, 'Application de la dernière équipe');
    }

    state.lastAction = `Préparation bloquée — équipe ${requirement.selected}/${requirement.min}`;
    saveState(state);
    updatePanel();
    return false;
  }

  const launchButton = findClickable([
    'lancer l expedition',
    'lancer expedition',
    'commencer l expedition',
    'commencer expedition',
    'confirmer le depart',
    'confirmer depart',
    'partir',
    'demarrer',
    'start expedition',
    'start',
  ], requirement.form, {
    exclude: ['annuler', 'cancel', 'acheter', 'buy'],
  });

  if (launchButton) {
    if (recentBotAction(1800) || recentDirectRequest(1800)) return false;
    setExpeditionPhase('starting');

    if (config.directHttpActions) {
      const submitted = await submitObservedForm(
        requirement.form,
        'Lancement HTTP de l’expédition',
        { expectedKind: 'expedition_launch' }
      );

      if (!submitted) setExpeditionPhase('preparing');
      return submitted;
    }

    return clickElement(launchButton, 'Lancement de l’expédition');
  }

  return false;
}

// ---- src/features/league/gyms.js ----
function localDayKey(timestamp = new Date()) {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function gymCycle() {
  if (!state.gymCycle || typeof state.gymCycle !== 'object') {
    state.gymCycle = {
      phase: 'unknown',
      checkedDay: null,
      availableToday: null,
      arena: null,
      champion: null,
      badge: null,
      badges: null,
      totalBadges: 8,
      requiredTeamSize: null,
      selectedTeam: [],
      teamScore: null,
      reason: null,
      needsHealing: false,
      blockedUntil: 0,
      lastCheckAt: 0,
      lastChallengeAt: 0,
      challengeSubmittedDay: null,
      completedDay: null,
    };
  }
  return state.gymCycle;
}

function setGymCycle(phase, patch = {}) {
  const previous = gymCycle();
  state.gymCycle = {
    ...previous,
    ...patch,
    phase,
    lastCheckAt: now(),
  };
  saveState(state);
  updatePanel();
  log('Cycle arène:', state.gymCycle);
}

function isLeagueIndexPage() {
  return /^\/league\/?$/.test(location.pathname);
}

function isGymPreparePage() {
  return /^\/gyms\/[^/]+\/prepare\/?$/.test(location.pathname);
}

function isGymResultLikePage() {
  return /^\/gyms\/[^/]+\/(?!prepare\/?$)[^/]+\/?$/.test(location.pathname);
}

function gymReturnToCircuitLink() {
  return [...document.querySelectorAll('a[href]')]
    .filter(isVisible)
    .find(anchor => {
      try {
        const url = new URL(anchor.href, location.href);
        return url.origin === location.origin && /^\/league\/?$/.test(url.pathname);
      } catch {
        return false;
      }
    }) || null;
}

function gymPreparationForm() {
  if (!isGymPreparePage()) return null;
  return document.querySelector(
    'form[data-team-builder][action*="/gyms/"][action$="/challenge"]'
  );
}

function parseGymProgress() {
  const progress = document.querySelector('.gym-progress');
  if (!progress) return { badges: null, totalBadges: 8 };

  const text = normalizeText(
    progress.getAttribute('aria-label') ||
    progress.querySelector('strong')?.textContent ||
    progress.textContent ||
    ''
  );
  const match = text.match(/(\d+)\s*\/\s*(\d+)/);
  return {
    badges: match ? Number(match[1]) : null,
    totalBadges: match ? Number(match[2]) : 8,
  };
}

function leagueDailyStatus() {
  if (!isLeagueIndexPage()) return null;

  const headerText = normalizeText(
    document.querySelector('.page-header__actions')?.textContent || ''
  );

  if (/combat du jour disponible|daily battle available/.test(headerText)) {
    return true;
  }

  if (
    /combat du jour (?:deja )?(?:utilise|termine|indisponible)|daily battle (?:used|completed|unavailable)/.test(headerText)
  ) {
    return false;
  }

  return null;
}

function availableGymContext() {
  if (!isLeagueIndexPage()) return null;

  const card = document.querySelector(
    '.gym-circuit--available .gym-card--available, .gym-card.gym-card--available'
  );
  if (!card || !isVisible(card)) return null;

  const prepare = card.querySelector(
    'a.primary-button[href*="/gyms/"][href$="/prepare"], a[href*="/gyms/"][href$="/prepare"]'
  );
  if (!prepare || !isVisible(prepare)) return null;

  const facts = normalizeText(card.textContent || '');
  const teamSizeMatch = facts.match(/equipe de\s*(\d+)\s*pokemon/i);

  return {
    card,
    prepare,
    arena: card.querySelector('.gym-card__identity h3, h3')?.textContent?.trim() || 'Arène',
    champion:
      card.querySelector('.gym-card__identity p:last-child')?.textContent
        ?.replace(/^\s*Champion\s*:\s*/i, '')
        .trim() || null,
    badge: card.querySelector('.gym-card__identity .card-label, .card-label')?.textContent?.trim() || null,
    rank: parseNumber(card.querySelector('.gym-rank')?.textContent?.match(/\d+/)?.[0]),
    teamSize: teamSizeMatch ? Number(teamSizeMatch[1]) : null,
  };
}

function gymPrepareContext(requirement) {
  const form = requirement?.form;
  if (!form) return null;

  const root = form.closest('main') || document;
  const title = root.querySelector('.page-header h1, h1')?.textContent?.trim() || 'Arène';
  const hero = root.querySelector('.gym-preparation-hero');
  const champion = hero?.querySelector('h2')?.textContent?.trim() || null;
  const badge = hero?.querySelector('.card-label')?.textContent?.trim() || null;

  return {
    title,
    champion,
    badge,
    missionTypes: [],
    recommendedLevel: null,
    teamSize: requirement.min,
  };
}

function gymTeamPlan(requirement) {
  const roster = updateRosterSnapshot(requirement);
  const context = gymPrepareContext(requirement);

  const healthyRoster = roster.filter(
    pokemon => pokemon.hpPercent >= config.minGymHpPercent
  );

  const plan = chooseTeamForMission(healthyRoster, {
    title: context?.title || 'Arène',
    missionTypes: [],
    recommendedLevel: null,
    teamSize: requirement.min,
  });

  const viable = plan.team.length >= requirement.min;
  const needsHealing =
    roster.length >= requirement.min &&
    healthyRoster.length < requirement.min;

  state.gymCycle = {
    ...gymCycle(),
    phase: viable ? 'preparing' : 'blocked',
    checkedDay: localDayKey(),
    availableToday: true,
    arena: context?.title || gymCycle().arena,
    champion: context?.champion || gymCycle().champion,
    badge: context?.badge || gymCycle().badge,
    requiredTeamSize: requirement.min,
    selectedTeam: plan.team.map(pokemon => pokemon.name),
    teamScore: plan.teamScore,
    reason: viable
      ? `Équipe prête: ${plan.team.map(pokemon => pokemon.name).join(', ')}`
      : needsHealing
        ? `Soins requis: ${healthyRoster.length}/${requirement.min} Pokémon au-dessus de ${config.minGymHpPercent}% PV`
        : `Seulement ${roster.length}/${requirement.min} Pokémon disponibles`,
    needsHealing,
    blockedUntil: viable || needsHealing ? 0 : now() + config.gymRetryMinutes * 60 * 1000,
    lastCheckAt: now(),
  };
  saveState(state);
  updatePanel();

  return {
    context,
    plan: {
      ...plan,
      viable,
    },
  };
}

async function selectNextGymPokemon(requirement, assessment) {
  const selected = new Set(requirement.selectedIds || []);
  const next = assessment.plan.team.find(pokemon => !selected.has(pokemon.id));
  if (!next) return false;

  const select = [...requirement.form.querySelectorAll('select[data-team-select]')]
    .find(input =>
      !input.value &&
      [...input.options].some(option => option.value === next.id)
    );

  if (!select) return false;

  select.value = next.id;
  select.dispatchEvent(new Event('input', { bubbles: true }));
  select.dispatchEvent(new Event('change', { bubbles: true }));

  state.lastAction = `Arène: sélection de ${next.name} (score ${next.score})`;
  state.lastActionAt = now();
  state.lastBotClickAt = now();
  state.actions += 1;
  state.gymCycle = {
    ...gymCycle(),
    phase: 'preparing',
    selectedTeam: assessment.plan.team.map(pokemon => pokemon.name),
    teamScore: assessment.plan.teamScore,
    reason: `Composition en cours ${requirement.selected + 1}/${requirement.min}`,
    lastCheckAt: now(),
  };
  saveState(state);
  updatePanel();
  log('Arène: sélection Pokémon', next);
  return true;
}

function leagueNeedsDailyCheck() {
  if (!config.autoGyms) return false;
  const gym = gymCycle();
  const today = localDayKey();

  if (gym.completedDay === today) return false;
  if (gym.challengeSubmittedDay === today) return false;

  if (gym.phase === 'blocked' && gym.blockedUntil && gym.blockedUntil > now()) {
    return false;
  }

  if (gym.availableToday === true) return true;
  if (gym.phase === 'blocked' && (!gym.blockedUntil || gym.blockedUntil <= now())) {
    return true;
  }

  return gym.checkedDay !== today;
}

function leagueAttentionReason() {
  const gym = gymCycle();
  if (gym.completedDay === localDayKey()) {
    return null;
  }
  if (gym.availableToday === true) {
    return gym.arena
      ? `combat d’arène disponible: ${gym.arena}`
      : 'combat d’arène disponible';
  }
  if (gym.checkedDay !== localDayKey()) {
    return 'vérification quotidienne du Circuit des Arènes';
  }
  return null;
}

async function handleLeagueAutomation() {
  if (!config.autoGyms) return false;

  if (isGymResultLikePage()) {
    state.gymCycle = {
      ...gymCycle(),
      phase: 'result',
      checkedDay: localDayKey(),
      availableToday: false,
      completedDay: localDayKey(),
      reason: 'Combat résolu — combat quotidien consommé',
      lastCheckAt: now(),
    };
    saveState(state);
    updatePanel();

    const returnLink = gymReturnToCircuitLink();
    if (!returnLink) return false;

    if (now() - (gymCycle().lastChallengeAt || 0) < 2500) {
      return false;
    }

    return config.directHttpActions
      ? navigateDirectly(returnLink.href, 'Arène: retour au Circuit')
      : clickElement(returnLink, 'Arène: retour au Circuit');
  }

  if (isLeagueIndexPage()) {
    const today = localDayKey();
    const dailyAvailable = leagueDailyStatus();
    const progress = parseGymProgress();
    const gym = availableGymContext();

    if (
      gymCycle().completedDay === today ||
      gymCycle().challengeSubmittedDay === today
    ) {
      setGymCycle('done', {
        checkedDay: today,
        availableToday: false,
        badges: progress.badges,
        totalBadges: progress.totalBadges,
        completedDay: today,
        reason: 'Combat d’arène déjà tenté aujourd’hui — nouvelle tentative bloquée',
      });
      return false;
    }

    if (dailyAvailable === false) {
      setGymCycle('done', {
        checkedDay: today,
        availableToday: false,
        badges: progress.badges,
        totalBadges: progress.totalBadges,
        arena: null,
        champion: null,
        badge: null,
        requiredTeamSize: null,
        selectedTeam: [],
        teamScore: null,
        needsHealing: false,
        blockedUntil: 0,
        reason: 'Combat du jour déjà utilisé ou indisponible',
      });
      return false;
    }

    if (!gym) {
      setGymCycle('blocked', {
        checkedDay: today,
        availableToday: dailyAvailable === true ? true : null,
        badges: progress.badges,
        totalBadges: progress.totalBadges,
        arena: null,
        champion: null,
        badge: null,
        requiredTeamSize: null,
        selectedTeam: [],
        teamScore: null,
        needsHealing: false,
        blockedUntil: now() + config.gymRetryMinutes * 60 * 1000,
        reason: dailyAvailable === true
          ? 'Combat du jour disponible, mais aucune arène n’est encore débloquée'
          : 'Aucune arène disponible actuellement',
      });
      return false;
    }

    setGymCycle('available', {
      checkedDay: today,
      availableToday: dailyAvailable !== false,
      badges: progress.badges,
      totalBadges: progress.totalBadges,
      arena: gym.arena,
      champion: gym.champion,
      badge: gym.badge,
      requiredTeamSize: gym.teamSize,
      reason: `${gym.badge || 'Badge'} · équipe de ${gym.teamSize || '?'}`,
      needsHealing: false,
      blockedUntil: 0,
    });

    if (recentBotAction(1800)) return false;

    setGymCycle('opening_prepare', {
      arena: gym.arena,
      champion: gym.champion,
      badge: gym.badge,
    });

    if (config.directHttpActions) {
      return navigateDirectly(
        gym.prepare.href,
        `Arène: ouvrir ${gym.arena}`
      );
    }

    return clickElement(
      gym.prepare,
      `Arène: préparer ${gym.arena}`
    );
  }

  if (isGymPreparePage()) {
    const form = gymPreparationForm();
    if (!form) return false;

    const requirement = expeditionTeamRequirement();
    if (!requirement || requirement.form !== form) return false;

    const assessment = gymTeamPlan(requirement);

    if (!assessment.plan.viable) {
      state.lastAction = `Arène bloquée — ${gymCycle().reason}`;
      saveState(state);
      updatePanel();
      return false;
    }

    if (config.directHttpActions && assessment.plan.viable) {
      if (recentDirectRequest(1800) || recentBotAction(1800)) return false;

      const plannedIds = assessment.plan.team.map(pokemon => pokemon.id);
      if (plannedIds.length >= requirement.min) {
        state.gymCycle = {
          ...gymCycle(),
          phase: 'challenging',
          selectedTeam: assessment.plan.team.map(pokemon => pokemon.name),
          teamScore: assessment.plan.teamScore,
          reason: `Défi HTTP lancé avec ${assessment.plan.team.map(pokemon => pokemon.name).join(', ')}`,
          lastChallengeAt: now(),
          challengeSubmittedDay: localDayKey(),
        };
        saveState(state);
        updatePanel();

        const submitted = await submitObservedForm(
          form,
          `Arène HTTP: défier ${assessment.context?.champion || assessment.context?.title || 'le Champion'}`,
          {
            expectedKind: 'gym_challenge',
            overrides: {
              selection_source: 'custom',
              'pokemon_public_ids[]': plannedIds,
            },
          }
        );

        if (!submitted) {
          state.gymCycle = {
            ...gymCycle(),
            phase: 'blocked',
            challengeSubmittedDay: null,
            reason: httpTransportState().lastError
              ? `Défi HTTP refusé: ${httpTransportState().lastError}`
              : 'Défi HTTP non soumis',
          };
          saveState(state);
          updatePanel();
        }

        return submitted;
      }
    }

    if (requirement.selected < requirement.min) {
      return selectNextGymPokemon(requirement, assessment);
    }

    const chosenIds = new Set(requirement.selectedIds);
    const plannedIds = new Set(assessment.plan.team.map(pokemon => pokemon.id));
    const selectionMatchesPlan =
      chosenIds.size === plannedIds.size &&
      [...plannedIds].every(id => chosenIds.has(id));

    if (!selectionMatchesPlan) {
      state.gymCycle = {
        ...gymCycle(),
        phase: 'blocked',
        reason: 'La sélection actuelle ne correspond pas au plan intelligent',
      };
      state.lastAction = 'Arène: composition inattendue — lancement suspendu';
      saveState(state);
      updatePanel();
      return false;
    }

    const challenge = form.querySelector(
      'footer.expedition-prep-submit button.primary-button[type="submit"], button.primary-button[type="submit"]'
    );

    if (!challenge || !isVisible(challenge) || challenge.disabled) return false;
    if (recentBotAction(1800)) return false;

    state.gymCycle = {
      ...gymCycle(),
      phase: 'challenging',
      selectedTeam: assessment.plan.team.map(pokemon => pokemon.name),
      teamScore: assessment.plan.teamScore,
      reason: `Défi lancé avec ${assessment.plan.team.map(pokemon => pokemon.name).join(', ')}`,
      lastChallengeAt: now(),
      challengeSubmittedDay: localDayKey(),
    };
    saveState(state);
    updatePanel();

    if (config.directHttpActions) {
      const submitted = await submitObservedForm(
        form,
        `Arène HTTP: défier ${assessment.context?.champion || assessment.context?.title || 'le Champion'}`,
        { expectedKind: 'gym_challenge' }
      );

      if (!submitted) {
        state.gymCycle = {
          ...gymCycle(),
          phase: 'blocked',
          challengeSubmittedDay: null,
          reason: httpTransportState().lastError
            ? `Défi HTTP refusé: ${httpTransportState().lastError}`
            : 'Défi HTTP non soumis',
        };
        saveState(state);
        updatePanel();
      }

      return submitted;
    }

    return clickElement(
      challenge,
      `Arène: défier ${assessment.context?.champion || assessment.context?.title || 'le Champion'}`
    );
  }

  return false;
}

// ---- src/account/snapshot.js ----
function emptyAccountSnapshot() {
  return {
    version: 1,
    observedAt: 0,
    page: null,
    trainer: {
      level: null,
    },
    roster: {
      known: false,
      capturedAt: 0,
      count: 0,
      healthyCount: 0,
      averageLevel: null,
      pokemon: [],
    },
    league: {
      known: false,
      badges: null,
      totalBadges: 8,
      dailyBattleAvailable: null,
      arena: null,
      champion: null,
      badge: null,
      phase: 'unknown',
      needsHealing: false,
      lockedGyms: [],
    },
    expeditions: {
      phase: 'unknown',
      activeTitle: null,
      selectedTitle: null,
      dueAt: null,
      completedTitles: [],
      locked: [],
      failureStreaks: {},
    },
    pokedex: {
      known: false,
      capturedSpecies: null,
      totalSpecies: null,
    },
    resources: {
      known: false,
      balls: null,
    },
    sources: [],
  };
}

function accountSnapshot() {
  if (!state.accountSnapshot || typeof state.accountSnapshot !== 'object') {
    state.accountSnapshot = emptyAccountSnapshot();
  }
  return state.accountSnapshot;
}

function missionHubProgress() {
  const root = document.querySelector('.mission-hub__progress');
  if (!root) return null;

  const result = {
    trainerLevel: null,
    capturedSpecies: null,
  };

  root.querySelectorAll(':scope > div').forEach(row => {
    const label = normalizeText(row.querySelector('span')?.textContent || '');
    const value = parseNumber(row.querySelector('strong')?.textContent);

    if (value == null) return;
    if (label === 'niveau' || label.includes('niveau dresseur')) {
      result.trainerLevel = value;
    }
    if (label.includes('especes capturees')) {
      result.capturedSpecies = value;
    }
  });

  return result;
}

function parseTrainerLevelFromDom() {
  const hub = missionHubProgress();
  if (hub?.trainerLevel != null) return hub.trainerLevel;

  const direct = document.querySelector(
    '[data-trainer-level], .trainer-level, .trainer-profile__level, .profile-level'
  );

  if (direct) {
    const raw =
      direct.getAttribute('data-trainer-level') ||
      direct.textContent ||
      '';
    const match = String(raw).match(/\d+/);
    if (match) return Number(match[0]);
  }

  const profile = document.querySelector('.trainer-file, [data-trainer-profile]');
  if (profile) {
    const text = normalizeText(profile.textContent || '');
    const match = text.match(/(?:niveau|niv|level|lvl)\s*[:.-]?\s*(\d+)/i);
    if (match) return Number(match[1]);
  }

  return null;
}

function parsePokedexProgressFromDom() {
  const hub = missionHubProgress();
  if (hub?.capturedSpecies != null) {
    return {
      capturedSpecies: hub.capturedSpecies,
      totalSpecies: null,
    };
  }

  const root = document.querySelector(
    '[data-pokedex-progress], .pokedex-progress, .dex-progress'
  );
  if (!root) return null;

  const raw =
    root.getAttribute('data-pokedex-progress') ||
    root.getAttribute('aria-label') ||
    root.textContent ||
    '';

  const match = String(raw).match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return null;

  return {
    capturedSpecies: Number(match[1]),
    totalSpecies: Number(match[2]),
  };
}

function parseLeagueRequirement(text) {
  const raw = String(text || '').trim();
  const normalized = normalizeText(raw);

  let match = normalized.match(/terminer l expedition\s*:?\s*(.+)$/i);
  if (match) {
    return {
      type: 'expedition',
      target: match[1].trim(),
      label: raw,
    };
  }

  match = normalized.match(/obtenir\s*:?\s*(badge\s+.+)$/i);
  if (match) {
    return {
      type: 'badge',
      target: match[1].trim(),
      label: raw,
    };
  }

  match = normalized.match(/(?:niveau|niv|level)\s*(?:dresseur|trainer)?\s*:?\s*(\d+)/i);
  if (match) {
    return {
      type: 'trainer_level',
      target: Number(match[1]),
      label: raw,
    };
  }

  return {
    type: 'unknown',
    target: raw,
    label: raw,
  };
}

function parseLockedGymsFromDom() {
  if (!/^\/league\/?$/.test(location.pathname)) return null;

  return [...document.querySelectorAll('.gym-card--locked')].map((card, index) => {
    const identity = card.querySelector('.gym-card__identity');
    const requirements = [...card.querySelectorAll('.gym-requirements p')]
      .map(node => parseLeagueRequirement(node.textContent || ''))
      .filter(requirement => requirement.label);

    return {
      rank:
        parseNumber(card.querySelector('.gym-rank')?.textContent?.match(/\d+/)?.[0]) ||
        index + 1,
      arena:
        identity?.querySelector('h3')?.textContent?.trim() ||
        card.querySelector('h3')?.textContent?.trim() ||
        `Arène ${index + 1}`,
      champion:
        [...(identity?.querySelectorAll('p') || [])]
          .map(node => node.textContent?.trim() || '')
          .find(text => /^champion\s*:/i.test(text))
          ?.replace(/^champion\s*:\s*/i, '') ||
        null,
      badge:
        identity?.querySelector('.card-label')?.textContent?.trim() ||
        card.querySelector('.card-label')?.textContent?.trim() ||
        null,
      requirements,
    };
  });
}

function rosterSnapshotForAccount() {
  const roster = state.rosterSnapshot;
  if (!roster?.capturedAt || !Array.isArray(roster.pokemon)) {
    return {
      known: false,
      capturedAt: 0,
      count: 0,
      healthyCount: 0,
      averageLevel: null,
      pokemon: [],
    };
  }

  const pokemon = roster.pokemon.map(entry => ({
    id: entry.id,
    name: entry.name,
    level: entry.level,
    hpPercent: entry.hpPercent,
    types: Array.isArray(entry.types) ? entry.types : [],
  }));

  const healthy = pokemon.filter(entry =>
    Number(entry.hpPercent || 0) >= config.minTeamHpPercent
  );

  return {
    known: pokemon.length > 0,
    capturedAt: roster.capturedAt,
    count: pokemon.length,
    healthyCount: healthy.length,
    averageLevel: pokemon.length
      ? Math.round(
          pokemon.reduce((sum, entry) => sum + Number(entry.level || 0), 0) /
          pokemon.length
        )
      : null,
    pokemon,
  };
}

function parseExpeditionLockRequirement(text, previousTitle = null) {
  const raw = String(text || '').trim();
  const normalized = normalizeText(raw);

  let match = normalized.match(/niveau de dresseur requis\s*:?\s*(\d+)/i);
  if (match) {
    return { type: 'trainer_level', target: Number(match[1]), label: raw };
  }

  match = normalized.match(/especes capturees requises\s*:?\s*(\d+)/i);
  if (match) {
    return { type: 'captured_species', target: Number(match[1]), label: raw };
  }

  match = normalized.match(/badges requis\s*:?\s*(\d+)/i);
  if (match) {
    return { type: 'badges', target: Number(match[1]), label: raw };
  }

  if (/terminez d abord l expedition precedente|terminez l expedition precedente/.test(normalized)) {
    return {
      type: 'previous_expedition',
      target: previousTitle ? normalizeText(previousTitle) : null,
      label: raw,
    };
  }

  return { type: 'unknown', target: raw, label: raw };
}

function parseLockedExpeditionsFromDom() {
  if (!/^\/expeditions\/?$/.test(location.pathname)) return null;

  const availableTitles = [
    ...document.querySelectorAll(
      '.mission-tabset__panel[data-panel="available"] article h3, [data-panel="available"] article h3'
    ),
  ]
    .map(node => node.textContent?.trim())
    .filter(Boolean);

  const lockedCards = [
    ...document.querySelectorAll('.mission-locked__grid article'),
  ];

  let previousTitle = availableTitles[availableTitles.length - 1] || null;

  return lockedCards.map(card => {
    const title = card.querySelector('h3')?.textContent?.trim() || 'Destination verrouillée';
    const requirements = [...card.querySelectorAll('li')]
      .map(node => parseExpeditionLockRequirement(node.textContent || '', previousTitle))
      .filter(requirement => requirement.label);

    const result = {
      title,
      normalizedTitle: normalizeText(title),
      difficulty: card.querySelector('.mission-difficulty')?.textContent?.trim() || null,
      requirements,
    };

    previousTitle = title;
    return result;
  });
}

function expeditionSnapshotForAccount() {
  const cycle = expeditionCycle();
  const failureStreaks = {};
  const completed = new Set(
    Array.isArray(state.accountSnapshot?.expeditions?.completedTitles)
      ? state.accountSnapshot.expeditions.completedTitles
      : []
  );

  for (const [title, stats] of Object.entries(state.expeditionStats || {})) {
    const streak = Number(stats?.failureStreak || 0);
    if (streak > 0) failureStreaks[title] = streak;
    if (Number(stats?.successes || 0) > 0) completed.add(normalizeText(title));
  }

  if (/^\/expeditions\/?$/.test(location.pathname)) {
    document.querySelectorAll('.mission-archives a strong').forEach(node => {
      const title = normalizeText(node.textContent || '');
      if (title) completed.add(title);
    });
  }

  return {
    phase: cycle.phase || 'unknown',
    activeTitle: cycle.title || null,
    selectedTitle: state.selectedExpedition || null,
    dueAt: cycle.dueAt || null,
    completedTitles: [...completed],
    locked:
      parseLockedExpeditionsFromDom() ??
      state.accountSnapshot?.expeditions?.locked ??
      [],
    failureStreaks,
  };
}

function leagueSnapshotForAccount(previous) {
  const gym = typeof gymCycle === 'function'
    ? gymCycle()
    : (state.gymCycle || {});

  const lockedGyms = parseLockedGymsFromDom();

  return {
    known:
      previous?.known ||
      gym.badges != null ||
      gym.availableToday != null ||
      /^\/league\/?$/.test(location.pathname),
    badges: gym.badges ?? previous?.badges ?? null,
    totalBadges: gym.totalBadges || previous?.totalBadges || 8,
    dailyBattleAvailable:
      gym.availableToday ?? previous?.dailyBattleAvailable ?? null,
    arena: gym.arena ?? previous?.arena ?? null,
    champion: gym.champion ?? previous?.champion ?? null,
    badge: gym.badge ?? previous?.badge ?? null,
    phase: gym.phase || previous?.phase || 'unknown',
    needsHealing: Boolean(gym.needsHealing),
    lockedGyms: lockedGyms ?? previous?.lockedGyms ?? [],
  };
}

function observeAccountSnapshot() {
  const previous = accountSnapshot();
  const trainerLevel = parseTrainerLevelFromDom();
  const pokedex = parsePokedexProgressFromDom();
  const capture = state.captureDecision || {};
  const sources = new Set(previous.sources || []);

  sources.add(location.pathname);

  const next = {
    ...previous,
    version: 1,
    observedAt: now(),
    page: location.pathname,
    trainer: {
      level: trainerLevel ?? previous.trainer?.level ?? null,
    },
    roster: rosterSnapshotForAccount(),
    league: leagueSnapshotForAccount(previous.league),
    expeditions: expeditionSnapshotForAccount(),
    pokedex: pokedex
      ? {
          known: true,
          capturedSpecies: pokedex.capturedSpecies,
          totalSpecies: pokedex.totalSpecies ?? previous.pokedex?.totalSpecies ?? null,
        }
      : (previous.pokedex || emptyAccountSnapshot().pokedex),
    resources: {
      known:
        capture.ballReserve != null ||
        previous.resources?.known ||
        false,
      balls:
        capture.ballReserve ??
        previous.resources?.balls ??
        null,
    },
    sources: [...sources].slice(-20),
  };

  state.accountSnapshot = next;
  saveState(state);
  return next;
}

function accountSnapshotAgeMs() {
  const snapshot = accountSnapshot();
  return snapshot.observedAt ? now() - snapshot.observedAt : Infinity;
}

// ---- src/planner/goals.js ----
function emptyGoalPlan() {
  return {
    version: 1,
    generatedAt: 0,
    strategy: 'progression',
    primary: {
      id: 'idle',
      title: 'Observer le compte',
      reason: 'Pas encore assez de contexte pour choisir un objectif.',
      module: null,
      target: null,
    },
    step: {
      id: 'observe',
      title: 'Collecter l’état du compte',
      reason: 'Le planner attend davantage de données observées.',
      module: null,
      action: 'observe',
      target: null,
    },
    blockers: [],
    confidence: 'low',
  };
}

function currentGoalPlan() {
  if (!state.goalPlan || typeof state.goalPlan !== 'object') {
    state.goalPlan = emptyGoalPlan();
  }
  return state.goalPlan;
}

function hasCompletedExpedition(snapshot, title) {
  if (!title) return false;
  const target = normalizeText(title);
  return (snapshot.expeditions?.completedTitles || [])
    .some(completed => normalizeText(completed) === target);
}

function requirementSatisfied(snapshot, requirement) {
  if (!requirement) return false;

  if (requirement.type === 'trainer_level') {
    const level = snapshot.trainer?.level;
    return level != null && level >= Number(requirement.target || 0);
  }

  if (requirement.type === 'captured_species') {
    const count = snapshot.pokedex?.capturedSpecies;
    return count != null && count >= Number(requirement.target || 0);
  }

  if (requirement.type === 'badges') {
    const badges = snapshot.league?.badges;
    return badges != null && badges >= Number(requirement.target || 0);
  }

  if (requirement.type === 'previous_expedition') {
    return requirement.target
      ? hasCompletedExpedition(snapshot, requirement.target)
      : false;
  }

  if (requirement.type === 'expedition') {
    return hasCompletedExpedition(snapshot, requirement.target);
  }

  if (requirement.type === 'badge') {
    const badges = snapshot.league?.badges;
    return badges != null && badges > 0;
  }

  return false;
}

function lockedExpedition(snapshot, title) {
  const target = normalizeText(title || '');
  return (snapshot.expeditions?.locked || [])
    .find(entry => normalizeText(entry.title || entry.normalizedTitle) === target) || null;
}

function firstUnmetRequirement(snapshot, requirements = []) {
  return requirements.find(requirement => !requirementSatisfied(snapshot, requirement)) || null;
}

function expeditionDependencyStep(snapshot, targetTitle) {
  const locked = lockedExpedition(snapshot, targetTitle);

  if (!locked) {
    return {
      id: 'complete-expedition',
      title: `Terminer ${targetTitle}`,
      reason: 'Cette expédition est la prochaine dépendance de progression.',
      module: 'expeditions',
      action: 'complete_expedition',
      target: targetTitle,
    };
  }

  const unmet = firstUnmetRequirement(snapshot, locked.requirements);

  if (!unmet) {
    return {
      id: 'unlock-expedition',
      title: `Lancer ${locked.title}`,
      reason: 'Toutes les conditions observées sont satisfaites.',
      module: 'expeditions',
      action: 'complete_expedition',
      target: locked.title,
    };
  }

  if (unmet.type === 'trainer_level') {
    const current = snapshot.trainer?.level;
    return {
      id: 'raise-trainer-level',
      title: `Atteindre le niveau dresseur ${unmet.target}`,
      reason: current == null
        ? `${locked.title} exige le niveau ${unmet.target}.`
        : `${locked.title} exige le niveau ${unmet.target} · actuel ${current}.`,
      module: 'expeditions',
      action: 'farm_trainer_level',
      target: Number(unmet.target),
    };
  }

  if (unmet.type === 'captured_species') {
    const current = snapshot.pokedex?.capturedSpecies;
    return {
      id: 'capture-species',
      title: `Atteindre ${unmet.target} espèces capturées`,
      reason: current == null
        ? `${locked.title} demande ${unmet.target} espèces.`
        : `${locked.title} demande ${unmet.target} espèces · actuel ${current}.`,
      module: 'expeditions',
      action: 'farm_captures',
      target: Number(unmet.target),
    };
  }

  if (unmet.type === 'badges') {
    const current = snapshot.league?.badges;
    return {
      id: 'earn-badges',
      title: `Obtenir ${unmet.target} badges`,
      reason: current == null
        ? `${locked.title} demande ${unmet.target} badges.`
        : `${locked.title} demande ${unmet.target} badges · actuel ${current}.`,
      module: 'progression',
      action: 'earn_badges',
      target: Number(unmet.target),
    };
  }

  if (unmet.type === 'previous_expedition' && unmet.target) {
    return expeditionDependencyStep(snapshot, unmet.target);
  }

  return {
    id: 'inspect-expedition-lock',
    title: `Débloquer ${locked.title}`,
    reason: unmet.label || 'Une condition de déblocage reste à satisfaire.',
    module: 'expeditions',
    action: 'inspect_unlock',
    target: locked.title,
  };
}

function nextLockedGym(snapshot) {
  const gyms = [...(snapshot.league?.lockedGyms || [])]
    .sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0));

  if (!gyms.length) return null;

  const badges = Number(snapshot.league?.badges || 0);
  return gyms.find(gym => Number(gym.rank || 0) > badges) || gyms[0];
}

function gymProgressionGoal(snapshot) {
  const league = snapshot.league || {};
  const gymState = typeof gymCycle === 'function' ? gymCycle() : (state.gymCycle || {});
  const today = typeof localDayKey === 'function' ? localDayKey() : null;

  if (
    league.dailyBattleAvailable === true &&
    (
      !today ||
      (
        gymState.completedDay !== today &&
        gymState.challengeSubmittedDay !== today
      )
    )
  ) {
    const arena = league.arena || 'l’arène disponible';
    const badge = league.badge || 'le prochain badge';

    if (league.needsHealing || gymState.needsHealing) {
      return {
        primary: {
          id: 'win-current-gym',
          title: `Obtenir ${badge}`,
          reason: `${arena} est disponible aujourd’hui.`,
          module: 'progression',
          target: arena,
        },
        step: {
          id: 'heal-for-gym',
          title: 'Soigner l’équipe d’arène',
          reason: 'Le combat quotidien ne doit pas être consommé avec une équipe trop blessée.',
          module: 'healing',
          action: 'heal',
          target: arena,
        },
        blockers: ['PV insuffisants pour l’équipe d’arène'],
        confidence: 'high',
      };
    }

    return {
      primary: {
        id: 'win-current-gym',
        title: `Obtenir ${badge}`,
        reason: `${arena} est disponible et le combat quotidien n’est pas consommé.`,
        module: 'progression',
        target: arena,
      },
      step: {
        id: 'challenge-gym',
        title: `Défier ${league.champion || 'le Champion'}`,
        reason: 'Le combat d’arène est l’action de progression prioritaire disponible aujourd’hui.',
        module: 'progression',
        action: 'challenge_gym',
        target: arena,
      },
      blockers: [],
      confidence: 'high',
    };
  }

  const locked = nextLockedGym(snapshot);
  if (!locked) return null;

  const expectedPreviousBadges = Math.max(0, Number(locked.rank || 1) - 1);
  const unmet = (locked.requirements || []).find(requirement => {
    if (
      requirement.type === 'badge' &&
      Number(snapshot.league?.badges || 0) >= expectedPreviousBadges
    ) {
      return false;
    }
    return !requirementSatisfied(snapshot, requirement);
  }) || null;

  if (!unmet) {
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: `${locked.badge || 'Le prochain badge'} est le prochain jalon de Ligue.`,
        module: 'progression',
        target: locked.arena,
      },
      step: {
        id: 'refresh-league',
        title: 'Actualiser le Circuit des Arènes',
        reason: 'Les conditions connues semblent satisfaites ; il faut revalider le déblocage.',
        module: 'progression',
        action: 'refresh_league',
        target: locked.arena,
      },
      blockers: [],
      confidence: 'medium',
    };
  }

  if (unmet.type === 'expedition') {
    const step = expeditionDependencyStep(snapshot, unmet.target);
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: `${locked.arena} exige l’expédition ${unmet.target}.`,
        module: 'progression',
        target: locked.arena,
      },
      step,
      blockers: [unmet.label],
      confidence: 'high',
    };
  }

  if (unmet.type === 'trainer_level') {
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: unmet.label,
        module: 'progression',
        target: locked.arena,
      },
      step: {
        id: 'raise-trainer-level',
        title: `Atteindre le niveau dresseur ${unmet.target}`,
        reason: unmet.label,
        module: 'expeditions',
        action: 'farm_trainer_level',
        target: Number(unmet.target),
      },
      blockers: [unmet.label],
      confidence: 'high',
    };
  }

  if (unmet.type === 'badge') {
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: unmet.label,
        module: 'progression',
        target: locked.arena,
      },
      step: {
        id: 'earn-required-badge',
        title: `Obtenir le badge requis`,
        reason: unmet.label,
        module: 'progression',
        action: 'earn_badge',
        target: unmet.target,
      },
      blockers: [unmet.label],
      confidence: 'medium',
    };
  }

  return {
    primary: {
      id: 'unlock-next-gym',
      title: `Débloquer ${locked.arena}`,
      reason: 'Une condition du prochain badge reste à remplir.',
      module: 'progression',
      target: locked.arena,
    },
    step: {
      id: 'inspect-gym-requirement',
      title: 'Compléter la condition de Ligue',
      reason: unmet.label,
      module: 'progression',
      action: 'inspect_requirement',
      target: unmet.target,
    },
    blockers: [unmet.label],
    confidence: 'medium',
  };
}

function defaultExpeditionGoal(snapshot) {
  const expedition = snapshot.expeditions || {};

  if (['due', 'result', 'claiming'].includes(expedition.phase)) {
    return {
      primary: {
        id: 'progress-account',
        title: 'Faire progresser le compte',
        reason: 'Une expédition terminée doit être résolue avant de recalculer la suite.',
        module: 'expeditions',
        target: expedition.activeTitle,
      },
      step: {
        id: 'resolve-expedition',
        title: `Résoudre ${expedition.activeTitle || 'l’expédition'}`,
        reason: 'Le résultat est disponible.',
        module: 'expeditions',
        action: 'resolve_expedition',
        target: expedition.activeTitle,
      },
      blockers: [],
      confidence: 'high',
    };
  }

  if (expedition.phase === 'running') {
    return {
      primary: {
        id: 'progress-account',
        title: 'Faire progresser le compte',
        reason: 'Une expédition est déjà en cours.',
        module: 'expeditions',
        target: expedition.activeTitle,
      },
      step: {
        id: 'wait-expedition',
        title: `Attendre ${expedition.activeTitle || 'l’expédition'}`,
        reason: expedition.dueAt
          ? `Retour prévu dans ${formatRemaining(expedition.dueAt)}.`
          : 'Le bot reprendra à la résolution.',
        module: null,
        action: 'wait',
        target: expedition.activeTitle,
      },
      blockers: [],
      confidence: 'high',
    };
  }

  const firstLocked = (expedition.locked || [])[0];
  if (firstLocked) {
    const step = expeditionDependencyStep(snapshot, firstLocked.title);
    return {
      primary: {
        id: 'unlock-expedition',
        title: `Débloquer ${firstLocked.title}`,
        reason: 'C’est la prochaine destination verrouillée observée.',
        module: 'expeditions',
        target: firstLocked.title,
      },
      step,
      blockers: firstUnmetRequirement(snapshot, firstLocked.requirements)
        ? [firstUnmetRequirement(snapshot, firstLocked.requirements).label]
        : [],
      confidence: 'high',
    };
  }

  return {
    primary: {
      id: 'progress-expeditions',
      title: 'Avancer dans les expéditions',
      reason: 'Aucun autre jalon bloquant n’est actuellement connu.',
      module: 'expeditions',
      target: null,
    },
    step: {
      id: 'best-expedition',
      title: 'Lancer la meilleure expédition disponible',
      reason: 'Le moteur Smart Expedition choisira mission + équipe.',
      module: 'expeditions',
      action: 'best_expedition',
      target: null,
    },
    blockers: [],
    confidence: 'medium',
  };
}

function buildGoalPlan(snapshot = accountSnapshot()) {
  const base = {
    version: 1,
    generatedAt: now(),
    strategy: config.strategy || 'progression',
  };

  if (config.strategy === 'progression') {
    const gymGoal = gymProgressionGoal(snapshot);
    if (gymGoal) return { ...base, ...gymGoal };
    return { ...base, ...defaultExpeditionGoal(snapshot) };
  }

  return { ...base, ...defaultExpeditionGoal(snapshot) };
}

function refreshGoalPlan(snapshot = observeAccountSnapshot()) {
  const plan = buildGoalPlan(snapshot);
  state.goalPlan = plan;
  saveState(state);
  return plan;
}

function goalModulePriorityBonus(moduleId) {
  const plan = currentGoalPlan();
  if (!moduleId) return 0;
  if (plan.step?.module === moduleId) return config.goalPriorityBonus;
  if (plan.primary?.module === moduleId) return Math.round(config.goalPriorityBonus * 0.45);
  return 0;
}

function goalCandidatePriorityBonus(candidateName) {
  const map = {
    expedition: 'expeditions',
    heal: 'healing',
    gym: 'progression',
    progression: 'progression',
    'pokemon-progression': 'pokemon',
    incubator: 'incubator',
    breeding: 'breeding',
    'greenhouse-harvest': 'greenhouse',
    'greenhouse-plant': 'greenhouse',
  };

  const moduleId = candidateName?.startsWith('navigation:')
    ? candidateName.slice('navigation:'.length)
    : map[candidateName];

  return goalModulePriorityBonus(moduleId);
}

function goalTargetExpedition() {
  const plan = currentGoalPlan();
  if (plan.step?.module !== 'expeditions') return null;
  if (!['complete_expedition', 'unlock_expedition'].includes(plan.step?.action)) return null;
  return plan.step.target || null;
}

// ---- src/features/pokemon/progression.js ----
function pokemonProgressionState() {
  if (!state.pokemonProgression || typeof state.pokemonProgression !== 'object') {
    state.pokemonProgression = {
      phase: 'idle',
      targetId: null,
      targetName: null,
      targetLevel: null,
      action: null,
      reason: null,
      scannedIds: [],
      scanStartedAt: 0,
      lastScanAt: 0,
      blockedUntil: 0,
      lastUpgradeAt: 0,
      lastEvolutionAt: 0,
    };
  }
  return state.pokemonProgression;
}

function setPokemonProgression(patch = {}) {
  state.pokemonProgression = {
    ...pokemonProgressionState(),
    ...patch,
  };
  saveState(state);
  updatePanel();
}

function pokemonNumber(value) {
  if (value == null) return null;
  const match = String(value)
    .replace(/\u00a0/g, ' ')
    .match(/-?\d[\d\s]*(?:[.,]\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function isCollectionIndexPage() {
  return /^\/collection\/?$/.test(location.pathname);
}

function isPokemonProfilePage() {
  return Boolean(
    /^\/collection\/[^/]+\/?$/.test(location.pathname) &&
    document.querySelector('#pokemon-profile-section')
  );
}

function pokemonProfileId() {
  if (!isPokemonProfilePage()) return null;
  return location.pathname.split('/').filter(Boolean)[1] || null;
}

function collectionPokemonRecords(root = document, baseUrl = location.href) {
  if (root === document && !isCollectionIndexPage()) return [];

  return [...root.querySelectorAll('a.pokemon-record[href*="/collection/"]')]
    .filter(card => root !== document || isVisible(card))
    .map(card => {
      let id = null;
      let href = null;
      try {
        const url = new URL(card.getAttribute('href') || card.href, baseUrl);
        href = url.href;
        id = url.pathname.split('/').filter(Boolean)[1] || null;
      } catch {}

      return {
        id,
        name: card.querySelector('.pokemon-record__name-row h2, h2')?.textContent?.trim() || 'Pokémon',
        level: pokemonNumber(card.querySelector('.pokemon-record__level')?.textContent) || 0,
        types: [...card.querySelectorAll('.type-icon img[alt]')]
          .map(img => canonicalType(img.alt))
          .filter(Boolean),
        favorite: Boolean(card.querySelector('[aria-label="Favori"]')),
        href,
        card,
      };
    })
    .filter(record => record.id && record.href);
}

function pokemonProfileContext(rootDoc = document, profileUrl = location.href) {
  if (rootDoc === document && !isPokemonProfilePage()) return null;

  const root = rootDoc.querySelector('#pokemon-profile-section');
  if (!root) return null;

  const resourceStrip = rootDoc.querySelector('.pokemon-resource-strip');
  const name = root.querySelector('#pokemon-profile-title')?.textContent?.trim() || 'Pokémon';
  const level = pokemonNumber(root.querySelector('.pokemon-profile__level-badge strong')?.textContent);
  const hpProgress = root.querySelector('progress.pokemon-health');
  const badges = normalizeText(
    [...(root.querySelectorAll('.pokemon-profile__badges .status-badge') || [])]
      .map(node => node.textContent || '')
      .join(' ')
  );

  let id = null;
  try {
    id = new URL(profileUrl, location.href).pathname.split('/').filter(Boolean)[1] || null;
  } catch {}

  let stardust = null;
  let candies = null;
  let candyName = null;

  resourceStrip?.querySelectorAll(':scope > div').forEach(row => {
    const label = row.querySelector('span')?.textContent?.trim() || '';
    const value = pokemonNumber(row.querySelector('strong')?.textContent);
    const normalized = normalizeText(label);

    if (normalized.includes('poussiere etoile')) stardust = value;
    if (normalized.includes('bonbons')) {
      candies = value;
      candyName = label;
    }
  });

  const activityHelp = rootDoc.querySelector(
    '#pokemon-level-dialog .form-help, #pokemon-evolution-dialog .form-help'
  );

  return {
    id,
    name,
    level,
    hpPercent: hpProgress ? Number(hpProgress.value || 0) : null,
    inActivity:
      badges.includes('en expedition') ||
      Boolean(
        activityHelp &&
        /participe actuellement a une activite/.test(
          normalizeText(activityHelp.textContent || '')
        )
      ),
    stardust,
    candies,
    candyName,
  };
}

function gameplayRequirementInfo(node) {
  if (!node) return null;
  return {
    label: node.querySelector('strong')?.textContent?.trim() || 'Ressource',
    required: pokemonNumber(node.querySelector('.gameplay-requirement__required')?.textContent),
    available: pokemonNumber(node.querySelector('.gameplay-requirement__available')?.textContent),
    missing: node.classList.contains('gameplay-requirement--missing'),
  };
}

function pokemonLevelUpOption(root = document) {
  const dialog = root.querySelector('#pokemon-level-dialog');
  const form = dialog?.querySelector('form[action*="/level-up"]');
  if (!dialog || !form) {
    return {
      available: false,
      reason: dialog?.querySelector('.form-help')?.textContent?.trim() || 'Renforcement indisponible',
    };
  }

  const submit = form.querySelector('button[data-level-up-submit][type="submit"], button.primary-button[type="submit"]');
  const targetLevel = pokemonNumber(form.querySelector('input[name="target_level"]')?.value);
  const currentLevel = pokemonNumber(
    form.querySelector('[data-level-up-level-change] dd span')?.textContent
  );
  const requirements = [...form.querySelectorAll('.gameplay-requirement')]
    .map(gameplayRequirementInfo)
    .filter(Boolean);
  const stardust = requirements.find(requirement =>
    normalizeText(requirement.label).includes('poussiere')
  );
  const candy = requirements.find(requirement =>
    normalizeText(requirement.label).includes('bonbon')
  );
  const hasMissing = requirements.some(requirement => requirement.missing);

  const reserveSafe =
    stardust?.required == null ||
    stardust?.available == null ||
    stardust.available - stardust.required >= config.minStardustReserve;

  return {
    available: Boolean(submit && !submit.disabled && !hasMissing && reserveSafe),
    dialog,
    form,
    submit,
    currentLevel,
    targetLevel,
    requirements,
    stardust,
    candy,
    reserveSafe,
    reason: hasMissing
      ? 'Ressources insuffisantes'
      : !reserveSafe
        ? `Réserve de Poussière protégée (${config.minStardustReserve})`
        : targetLevel
          ? `Renforcement vers le niveau ${targetLevel}`
          : 'Renforcement disponible',
  };
}

function pokemonEvolutionOptions(root = document) {
  const dialog = root.querySelector('#pokemon-evolution-dialog');
  if (!dialog) return [];

  return [...dialog.querySelectorAll('form[action*="/evolve"]')].map(form => {
    const panel = form.closest('[data-evolution-panel]') || form;
    const submit = form.querySelector('button.primary-button[type="submit"]');
    const current = panel.querySelector(
      '.evolution-comparison__pokemon:not(.evolution-comparison__pokemon--target) strong'
    )?.textContent?.trim() || null;
    const target = panel.querySelector(
      '.evolution-comparison__pokemon--target strong'
    )?.textContent?.trim() || null;
    const requirements = [...form.querySelectorAll('.gameplay-requirement')]
      .map(gameplayRequirementInfo)
      .filter(Boolean);
    const missing = requirements.some(requirement => requirement.missing);

    return {
      form,
      panel,
      submit,
      current,
      target,
      requirements,
      available: Boolean(submit && !submit.disabled && !missing),
      reason: missing
        ? requirements
            .filter(requirement => requirement.missing)
            .map(requirement => `${requirement.label} ${requirement.available ?? '?'} / ${requirement.required ?? '?'}`)
            .join(', ')
        : target
          ? `Évolution vers ${target}`
          : 'Évolution disponible',
    };
  });
}

function pokemonProgressionPriorityRecords(records) {
  const expeditionIds = new Set(state.expeditionPlan?.teamIds || []);
  const expeditionNames = new Set(
    (state.expeditionPlan?.team || []).map(normalizeText)
  );
  const gymNames = new Set(
    (gymCycle().selectedTeam || []).map(normalizeText)
  );
  const recommendedLevel = Number(state.smartTeam?.lastRecommendedLevel || 0);
  const hasPlannedTargets =
    expeditionIds.size > 0 ||
    expeditionNames.size > 0 ||
    gymNames.size > 0;

  return records
    .map(record => {
      let priority = 0;
      const normalizedName = normalizeText(record.name);
      const planned =
        expeditionIds.has(record.id) ||
        expeditionNames.has(normalizedName) ||
        gymNames.has(normalizedName);

      if (expeditionIds.has(record.id)) priority += 1200;
      if (expeditionNames.has(normalizedName)) priority += 900;
      if (gymNames.has(normalizedName)) priority += 850;

      // Lorsqu'un objectif d'équipe existe, on refuse d'investir dans un
      // Pokémon secondaire simplement parce que la cible utile est occupée.
      if (hasPlannedTargets && !planned) priority -= 10000;

      if (!hasPlannedTargets && record.favorite) priority += 220;

      if (planned && recommendedLevel > 0 && record.level < recommendedLevel) {
        priority += 400 + (recommendedLevel - record.level) * 45;
      }

      priority += Math.min(250, record.level * 12);

      return { ...record, priority, planned };
    })
    .filter(record => !hasPlannedTargets || record.planned)
    .sort((a, b) => b.priority - a.priority || b.level - a.level);
}

function resetPokemonProgressionScan() {
  setPokemonProgression({
    phase: 'scanning',
    targetId: null,
    targetName: null,
    targetLevel: null,
    action: null,
    reason: 'Recherche d’un renforcement ou d’une évolution utile',
    scannedIds: [],
    scanStartedAt: now(),
    blockedUntil: 0,
  });
}

function expeditionHasPriorityOverPokemonProgression() {
  return [
    'running',
    'due',
    'result',
    'claiming',
    'opening_result',
    'ready_to_start',
    'preparing',
    'starting',
  ].includes(expeditionCycle().phase);
}

function pokemonProgressionScanDue({ allowExpeditionFallback = false } = {}) {
  if (!config.autoLevelPokemon && !config.autoEvolvePokemon) return false;

  const progress = pokemonProgressionState();
  if (progress.blockedUntil && progress.blockedUntil > now()) return false;

  // Une expédition à résoudre ou à relancer est toujours prioritaire.
  // La progression Pokémon n'est autorisée en fallback que si une tentative
  // d'expédition a explicitement échoué faute d'équipe viable.
  if (
    !allowExpeditionFallback &&
    expeditionHasPriorityOverPokemonProgression()
  ) {
    return false;
  }

  const goal = currentGoalPlan();
  const teamBlocked =
    state.expeditionPlan?.viability === 'blocked' ||
    gymCycle().phase === 'blocked';

  if (goal.step?.module === 'pokemon' || teamBlocked) return true;

  const age = now() - Number(progress.lastScanAt || 0);
  return age >= config.pokemonProgressionScanMinutes * 60 * 1000;
}

function markPokemonScanned(id, patch = {}) {
  const progress = pokemonProgressionState();
  const scanned = new Set(progress.scannedIds || []);
  if (id) scanned.add(id);

  setPokemonProgression({
    ...patch,
    scannedIds: [...scanned],
  });
}

function collectionReturnLink() {
  return [...document.querySelectorAll('a[href]')]
    .find(anchor => {
      try {
        const url = new URL(anchor.href, location.href);
        return url.origin === location.origin && /^\/collection\/?$/.test(url.pathname);
      } catch {
        return false;
      }
    }) || null;
}

async function openNextPokemonProgressionTarget() {
  const records = collectionPokemonRecords();
  if (!records.length) return false;

  const progress = pokemonProgressionState();
  const scanExpired =
    !progress.scanStartedAt ||
    now() - progress.scanStartedAt > config.pokemonProgressionScanMinutes * 60 * 1000;

  if (scanExpired) resetPokemonProgressionScan();

  const scanned = new Set(pokemonProgressionState().scannedIds || []);
  const candidates = pokemonProgressionPriorityRecords(records)
    .filter(record => !scanned.has(record.id));

  if (!candidates.length) {
    setPokemonProgression({
      phase: 'idle',
      targetId: null,
      targetName: null,
      targetLevel: null,
      action: null,
      reason: 'Analyse terminée · aucun renforcement sûr disponible',
      scannedIds: [],
      lastScanAt: now(),
      blockedUntil: now() + config.pokemonProgressionScanMinutes * 60 * 1000,
    });
    return false;
  }

  const target = candidates[0];
  setPokemonProgression({
    phase: 'opening_profile',
    targetId: target.id,
    targetName: target.name,
    targetLevel: target.level,
    action: 'inspect',
    reason: `Inspection de ${target.name} niveau ${target.level}`,
  });

  return config.directHttpActions
    ? navigateDirectly(target.href, `Progression Pokémon: inspecter ${target.name}`)
    : clickElement(target.card, `Progression Pokémon: inspecter ${target.name}`);
}

async function handlePokemonProfileProgression() {
  const context = pokemonProfileContext();
  if (!context) return false;

  const progress = pokemonProgressionState();
  const alreadyScanned = (progress.scannedIds || []).includes(context.id);

  if (alreadyScanned) {
    const back = collectionReturnLink();
    if (!back) return false;
    return config.directHttpActions
      ? navigateDirectly(back.href, 'Progression Pokémon: retour à la collection')
      : clickElement(back, 'Progression Pokémon: retour à la collection');
  }

  if (context.inActivity) {
    markPokemonScanned(context.id, {
      phase: 'blocked',
      targetId: context.id,
      targetName: context.name,
      targetLevel: context.level,
      action: 'skip',
      reason: `${context.name} participe actuellement à une activité`,
    });

    const back = collectionReturnLink();
    if (!back) return false;
    return config.directHttpActions
      ? navigateDirectly(back.href, `Progression Pokémon: ${context.name} occupé`)
      : clickElement(back, `Progression Pokémon: ${context.name} occupé`);
  }

  const evolutions = pokemonEvolutionOptions();
  const affordableEvolutions = evolutions.filter(option => option.available);

  if (
    config.autoEvolvePokemon &&
    evolutions.length === 1 &&
    affordableEvolutions.length === 1
  ) {
    const evolution = affordableEvolutions[0];

    if (config.directHttpActions) {
      setPokemonProgression({
        phase: 'evolving',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'evolve',
        reason: evolution.reason,
        lastEvolutionAt: now(),
      });

      const submitted = await submitObservedForm(
        evolution.form,
        `Évolution HTTP: ${context.name} → ${evolution.target || 'évolution'}`,
        { expectedKind: 'pokemon_evolve' }
      );

      if (!submitted) {
        markPokemonScanned(context.id, {
          phase: 'blocked',
          targetId: context.id,
          targetName: context.name,
          targetLevel: context.level,
          action: 'evolve_failed',
          reason: httpTransportState().lastError || 'Évolution HTTP non soumise',
        });
        return false;
      }

      markPokemonScanned(context.id, {
        phase: 'scanned',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'evolve_done',
        reason: `Évolution effectuée vers ${evolution.target || 'la forme suivante'} · priorité rendue aux expéditions`,
        lastEvolutionAt: now(),
      });
      return true;
    }

    const dialog = document.querySelector('#pokemon-evolution-dialog');

    if (!dialog?.open) {
      const opener = document.querySelector(
        '[data-open-dialog="pokemon-evolution-dialog"]'
      );
      if (opener && isVisible(opener)) {
        setPokemonProgression({
          phase: 'evolution_ready',
          targetId: context.id,
          targetName: context.name,
          targetLevel: context.level,
          action: 'evolve',
          reason: evolution.reason,
        });
        return clickElement(
          opener,
          `Progression Pokémon: préparer évolution de ${context.name}`
        );
      }
    }

    if (dialog?.open && evolution.submit && isVisible(evolution.submit)) {
      markPokemonScanned(context.id, {
        phase: 'evolving',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'evolve',
        reason: evolution.reason,
        lastEvolutionAt: now(),
      });
      return clickElement(
        evolution.submit,
        `Évolution: ${context.name} → ${evolution.target || 'évolution'}`
      );
    }
  }

  if (config.autoEvolvePokemon && evolutions.length > 1) {
    markPokemonScanned(context.id, {
      phase: 'manual',
      targetId: context.id,
      targetName: context.name,
      targetLevel: context.level,
      action: 'manual_evolution',
      reason: 'Plusieurs évolutions sont possibles · choix automatique refusé',
    });
    return false;
  }

  const level = pokemonLevelUpOption();
  const evolutionCandyGoal = evolutions.length === 1
    ? (() => {
        const evolution = evolutions[0];
        const candy = evolution.requirements.find(requirement =>
          normalizeText(requirement.label).includes('bonbon')
        );
        const otherMissing = evolution.requirements.some(requirement =>
          requirement.missing &&
          !normalizeText(requirement.label).includes('bonbon')
        );

        if (!candy || otherMissing || !candy.missing) return null;

        return {
          target: evolution.target,
          required: candy.required,
          available: candy.available,
        };
      })()
    : null;

  const levelConsumesCandy = Number(level.candy?.required || 0) > 0;
  const preserveCandyForEvolution =
    config.preserveEvolutionCandies &&
    evolutionCandyGoal &&
    levelConsumesCandy;

  if (config.autoLevelPokemon && level.available && !preserveCandyForEvolution) {
    if (config.directHttpActions) {
      setPokemonProgression({
        phase: 'leveling',
        targetId: context.id,
        targetName: context.name,
        targetLevel: level.targetLevel,
        action: 'level_up',
        reason: level.reason,
        lastUpgradeAt: now(),
      });

      const submitted = await submitObservedForm(
        level.form,
        `Renforcement HTTP: ${context.name} → niveau ${level.targetLevel}`,
        { expectedKind: 'pokemon_level_up' }
      );

      if (!submitted) {
        markPokemonScanned(context.id, {
          phase: 'blocked',
          targetId: context.id,
          targetName: context.name,
          targetLevel: context.level,
          action: 'level_up_failed',
          reason: httpTransportState().lastError || 'Renforcement HTTP non soumis',
        });
        return false;
      }

      markPokemonScanned(context.id, {
        phase: 'scanned',
        targetId: context.id,
        targetName: context.name,
        targetLevel: level.targetLevel,
        action: 'level_up_done',
        reason: `Renforcement vers le niveau ${level.targetLevel} effectué · priorité rendue aux expéditions`,
        lastUpgradeAt: now(),
      });
      return true;
    }

    const dialog = document.querySelector('#pokemon-level-dialog');

    if (!dialog?.open) {
      const opener = document.querySelector(
        '[data-open-dialog="pokemon-level-dialog"]'
      );
      if (opener && isVisible(opener)) {
        setPokemonProgression({
          phase: 'level_ready',
          targetId: context.id,
          targetName: context.name,
          targetLevel: level.targetLevel,
          action: 'level_up',
          reason: level.reason,
        });
        return clickElement(
          opener,
          `Progression Pokémon: préparer renforcement de ${context.name}`
        );
      }
    }

    if (dialog?.open && level.submit && isVisible(level.submit)) {
      markPokemonScanned(context.id, {
        phase: 'leveling',
        targetId: context.id,
        targetName: context.name,
        targetLevel: level.targetLevel,
        action: 'level_up',
        reason: level.reason,
        lastUpgradeAt: now(),
      });
      return clickElement(
        level.submit,
        `Renforcement: ${context.name} → niveau ${level.targetLevel}`
      );
    }
  }

  const evolutionReason = evolutions.length
    ? evolutions.map(option => option.reason).filter(Boolean).join(' · ')
    : 'Aucune évolution exploitable';

  markPokemonScanned(context.id, {
    phase: 'scanned',
    targetId: context.id,
    targetName: context.name,
    targetLevel: context.level,
    action: 'none',
    reason: [
      config.autoEvolvePokemon ? evolutionReason : 'Évolution auto désactivée',
      preserveCandyForEvolution
        ? `Bonbons réservés pour ${evolutionCandyGoal.target || 'l’évolution'} (${evolutionCandyGoal.available ?? '?'} / ${evolutionCandyGoal.required ?? '?'})`
        : config.autoLevelPokemon
          ? level.reason
          : 'Renforcement auto désactivé',
    ].filter(Boolean).join(' · '),
  });

  const back = collectionReturnLink();
  if (!back) return false;
  return config.directHttpActions
    ? navigateDirectly(back.href, `Progression Pokémon: ${context.name} analysé`)
    : clickElement(back, `Progression Pokémon: ${context.name} analysé`);
}

async function handlePokemonProgression({ allowExpeditionFallback = false } = {}) {
  if (!config.autoLevelPokemon && !config.autoEvolvePokemon) return false;

  if (
    !allowExpeditionFallback &&
    expeditionHasPriorityOverPokemonProgression()
  ) {
    setPokemonProgression({
      phase: 'waiting_expedition',
      action: 'wait',
      reason: expeditionCycle().phase === 'running'
        ? `Attente de la fin de ${expeditionCycle().title || 'l’expédition'} avant d’investir des ressources`
        : 'Priorité au cycle d’expédition avant tout investissement Pokémon',
    });
    return false;
  }

  if (isPokemonProfilePage()) {
    return handlePokemonProfileProgression();
  }

  if (isCollectionIndexPage()) {
    return openNextPokemonProgressionTarget();
  }

  return false;
}

// ---- src/features/expeditions/capture.js ----
function resultEncounterRoot() {
  const exact = document.querySelector(
    '.mission-encounter, section.mission-encounter, [data-capture-form]'
  );

  if (exact) {
    return exact.matches?.('[data-capture-form]')
      ? exact.closest('.mission-encounter, section, article, div') || exact
      : exact;
  }

  const selectors = [
    '[data-encounter-pokemon]',
    '[data-capture-encounter]',
    '[data-pokemon-encounter]',
    '.encounter-card',
    '[class*="encounter"]',
  ];

  const direct = document.querySelector(selectors.join(','));
  if (direct) return direct;

  const button = findClickable([
    'capturer',
    'lancer la ball',
    'lancer ball',
    'lancer pokeball',
    'lancer une pokeball',
    'throw ball',
    'throw pokeball',
    'fuir',
    'run away',
  ]);

  return button?.closest('article, section, .card, div') || null;
}

function captureForm(root = resultEncounterRoot()) {
  if (!root) return null;

  return root.matches?.('form[data-capture-form]')
    ? root
    : root.querySelector(
      'form[data-capture-form], form[action*="/expeditions/encounters/"][action$="/capture"], form[action*="/capture"]'
    );
}

function captureSubmitButton(root = resultEncounterRoot()) {
  const form = captureForm(root);
  if (!form) return null;

  const exact = form.querySelector(
    'button.primary-button[type="submit"], button[type="submit"], input[type="submit"]'
  );

  if (exact && isVisible(exact) && !exact.disabled) return exact;

  return findClickable([
    'lancer la ball',
    'lancer ball',
    'capturer',
    'capture',
    'lancer pokeball',
    'lancer une pokeball',
    'throw ball',
    'throw pokeball',
  ], form, {
    exclude: ['chance de capture', 'taux de capture'],
  });
}

function selectedBallInfo(root = resultEncounterRoot()) {
  const form = captureForm(root);
  if (!form) {
    return {
      code: null,
      name: null,
      reserve: null,
      multiplierBps: null,
    };
  }

  const checked = form.querySelector('input[name="ball_code"]:checked');
  const label = checked?.closest('label');
  const selected = form.querySelector(
    '[data-capture-select-value], .capture-select__value'
  );

  const name =
    label?.querySelector('span')?.textContent?.trim() ||
    selected?.querySelector('span')?.textContent?.trim() ||
    checked?.value ||
    null;

  const countText =
    label?.querySelector('strong')?.textContent ||
    selected?.querySelector('strong')?.textContent ||
    '';
  const countMatch = countText.match(/\d+/);

  return {
    code: checked?.value || null,
    name,
    reserve: countMatch ? Number(countMatch[0]) : null,
    multiplierBps: parseNumber(checked?.getAttribute('data-multiplier-bps')),
  };
}

function readBallReserve(root = resultEncounterRoot()) {
  const selectedBall = selectedBallInfo(root);
  if (selectedBall.reserve != null) return selectedBall.reserve;

  const explicit = [...document.querySelectorAll(
    '[data-ball-count], [data-item-code*="ball" i], [data-item-name*="ball" i]'
  )];

  for (const element of explicit) {
    const values = [
      element.getAttribute('data-ball-count'),
      element.getAttribute('data-quantity'),
      element.getAttribute('data-count'),
      element.textContent,
    ];

    for (const value of values) {
      const match = String(value || '').match(/\d+/);
      if (match) return Number(match[0]);
    }
  }

  const pageText = normalizeText(document.body?.innerText || '');
  const match = pageText.match(
    /(?:poke ?ball|super ?ball|hyper ?ball|ball)[^\d]{0,15}(\d+)/i
  );
  return match ? Number(match[1]) : null;
}

function parseCaptureChance(root) {
  const element = root?.querySelector('[data-capture-chance], .capture-chance');
  const text = normalizeText(element?.textContent || '');
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*%/);
  return match ? parseNumber(match[1]) : null;
}

function parseCaptureAttempts(root) {
  const text = normalizeText(
    root?.querySelector('.mission-encounter__attempts')?.textContent || ''
  );
  const match = text.match(/(\d+)\s*(?:tentative|tentatives|attempt|attempts)/i);
  return match ? Number(match[1]) : null;
}

function encounterOwnershipState(root, text = '') {
  if (!root) return null;

  const normalized = normalizeText(
    text || root.innerText || root.textContent || ''
  );

  let isNew =
    parseOptionalBoolean(root.getAttribute('data-new-species')) ??
    parseOptionalBoolean(root.getAttribute('data-new'));

  const owned =
    parseOptionalBoolean(root.getAttribute('data-owned')) ??
    parseOptionalBoolean(root.getAttribute('data-captured'));

  if (isNew == null && owned != null) isNew = !owned;

  if (
    isNew == null &&
    /absente? (?:du|au) pokedex|absent from pokedex|pas dans le pokedex|nouvelle espece|premiere capture|jamais capture|non capture|new species|first capture/.test(normalized)
  ) {
    isNew = true;
  }

  if (
    isNew == null &&
    /presente? (?:dans|au) (?:le )?pokedex|deja (?:dans|au) (?:le )?pokedex|deja capturee?|deja possedee?|already caught|already owned|already in (?:the )?pokedex/.test(normalized)
  ) {
    isNew = false;
  }

  return isNew;
}

function captureContext() {
  const root = resultEncounterRoot();
  if (!root) return null;

  const text = normalizeText(root.innerText || root.textContent || '');
  const captureButton = captureSubmitButton(root);
  const selectedBall = selectedBallInfo(root);

  const skipButton = findClickable([
    'fuir',
    'ignorer',
    'passer',
    'continuer sans capturer',
    'laisser partir',
    'run away',
    'skip',
    'leave',
  ], root) ||
    findClickable([
      'fuir',
      'continuer sans capturer',
      'laisser partir',
      'run away',
    ]);

  const species =
    root.getAttribute('data-pokemon-name') ||
    root.getAttribute('data-species-name') ||
    root.querySelector('[data-pokemon-name]')?.getAttribute('data-pokemon-name') ||
    root.querySelector('.mission-encounter__identity h3')?.textContent?.trim() ||
    root.querySelector('h3')?.textContent?.trim() ||
    'Pokémon rencontré';

  const isNew = encounterOwnershipState(root, text);

  const rarity =
    normalizeText(root.getAttribute('data-rarity') || '') ||
    (text.match(/\b(commun|peu commun|rare|epique|legendaire|mythique|common|uncommon|epic|legendary|mythic)\b/)?.[1] || '');

  const ivRaw =
    root.getAttribute('data-iv-total') ||
    root.getAttribute('data-iv-score') ||
    text.match(/(?:iv|ivs)[^\d]{0,12}(\d+(?:[.,]\d+)?)/i)?.[1];

  return {
    root,
    form: captureForm(root),
    captureButton,
    skipButton,
    species: String(species).trim(),
    isNew,
    rarity,
    ivScore: parseNumber(ivRaw),
    ballCode: selectedBall.code,
    ballName: selectedBall.name,
    ballReserve: selectedBall.reserve ?? readBallReserve(root),
    ballMultiplierBps: selectedBall.multiplierBps,
    captureChance: parseCaptureChance(root),
    attemptsRemaining: parseCaptureAttempts(root),
    text,
  };
}

function decideCapture(context) {
  if (!context?.captureButton && !context?.form) {
    return { action: 'none', reason: 'Aucune capture disponible' };
  }

  if (context.attemptsRemaining === 0) {
    return { action: 'none', reason: 'Aucune tentative restante' };
  }

  if (!config.autoCapture) {
    return { action: 'manual', reason: 'Capture auto désactivée' };
  }

  if (
    context.ballReserve != null &&
    context.ballReserve <= config.minBallReserve
  ) {
    return {
      action: context.skipButton ? 'skip' : 'ignore',
      reason: `Réserve protégée · ${context.ballReserve}/${config.minBallReserve}`,
    };
  }

  if (!config.smartCapture) {
    return {
      action: 'capture',
      reason: context.captureChance != null
        ? `Capture auto simple · ${context.captureChance}%`
        : 'Capture auto simple',
    };
  }

  if (
    context.isNew === false &&
    !config.captureOwnedDuplicates
  ) {
    return {
      action: context.skipButton ? 'skip' : 'ignore',
      reason: 'Déjà possédé · doublons bloqués',
    };
  }

  if (config.captureNewSpecies && context.isNew === true) {
    return {
      action: 'capture',
      reason: context.captureChance != null
        ? `Nouvelle espèce · ${context.captureChance}%`
        : 'Nouvelle espèce',
    };
  }

  if (
    config.captureRare &&
    /rare|epique|legendaire|mythique|epic|legendary|mythic/.test(context.rarity)
  ) {
    return {
      action: 'capture',
      reason: context.captureChance != null
        ? `${context.rarity} · ${context.captureChance}%`
        : `Rareté · ${context.rarity}`,
    };
  }

  if (
    context.ivScore != null &&
    context.ivScore >= config.minCaptureIvScore &&
    context.ivScore <= 100
  ) {
    return {
      action: 'capture',
      reason: `IV ${context.ivScore} ≥ ${config.minCaptureIvScore}`,
    };
  }

  if (config.captureUnknownEncounters && context.isNew == null) {
    return {
      action: 'capture',
      reason: context.captureChance != null
        ? `Rencontre inconnue · ${context.captureChance}%`
        : 'Rencontre inconnue autorisée',
    };
  }

  return {
    action: context.skipButton ? 'skip' : 'ignore',
    reason: context.isNew === false
      ? 'Déjà possédé · aucun critère doublon autorisé'
      : 'Aucun critère intelligent validé',
  };
}

function captureDecisionSnapshot(context, decision) {
  return {
    action: decision.action,
    reason: decision.reason,
    species: context?.species || null,
    isNew: context?.isNew ?? null,
    rarity: context?.rarity || null,
    ivScore: context?.ivScore ?? null,
    ballName: context?.ballName || null,
    ballCode: context?.ballCode || null,
    ballReserve: context?.ballReserve ?? null,
    captureChance: context?.captureChance ?? null,
    attemptsRemaining: context?.attemptsRemaining ?? null,
    updatedAt: now(),
  };
}

function resultPageHasPendingCapture() {
  const context = captureContext();
  return Boolean(context?.captureButton || context?.skipButton);
}

async function captureEncounter() {
  const context = captureContext();
  if (!context) return false;

  const decision = decideCapture(context);
  state.captureDecision = captureDecisionSnapshot(context, decision);

  if (decision.action === 'ignore' || decision.action === 'manual') {
    appendActionLog(
      decision.action === 'manual' ? 'warning' : 'info',
      'capture',
      `${decision.action === 'manual' ? 'Capture manuelle' : 'Capture ignorée'}: ${context.species}`,
      {
        reason: decision.reason,
        isNew: context.isNew,
        rarity: context.rarity,
        ivScore: context.ivScore,
      }
    );
  }

  saveState(state);
  updatePanel();

  if (decision.action === 'capture' && context.captureButton) {
    if (config.directHttpActions && context.form) {
      return submitObservedForm(
        context.form,
        `Capture HTTP: ${context.species} — ${decision.reason}`,
        { expectedKind: 'capture' }
      );
    }

    return clickElement(
      context.captureButton,
      `Capture: ${context.species} — ${decision.reason}`
    );
  }

  if (decision.action === 'skip' && context.skipButton) {
    return clickElement(
      context.skipButton,
      `Capture ignorée: ${context.species} — ${decision.reason}`
    );
  }

  if (decision.action === 'manual') {
    setExpeditionPhase('awaiting_capture');
    state.lastAction = `Capture manuelle: ${context.species} — ${decision.reason}`;
    saveState(state);
    updatePanel();
    return false;
  }

  if (decision.action === 'ignore') {
    state.lastAction = `Capture laissée: ${context.species} — ${decision.reason}`;
    saveState(state);
    updatePanel();
  }

  return false;
}

// ---- src/features/expeditions/cycle.js ----
async function claimExpedition() {
    if (!config.autoClaimExpeditions) return false;

    const form = document.querySelector(
      'form[method="POST"][action*="/expeditions/results/"][action$="/claim"]'
    );

    if (form && config.directHttpActions) {
      setExpeditionPhase('claiming');
      return submitObservedForm(
        form,
        'Récupération HTTP des récompenses',
        {
          expectedKind: 'expedition_claim',
          navigate: false,
          moduleId: 'expeditions',
        }
      );
    }

    const button = findClickable([
      'recuperer les recompenses',
      'recuperer récompenses',
      'recuperer',
      'reclamer',
      'claim rewards',
      'claim',
      'terminer expedition',
      'complete expedition',
      'valider les resultats',
      'valider resultats',
    ], document, { exclude: ['boutique', 'shop', 'acheter', 'buy'] });

    if (!button) return false;

    setExpeditionPhase('claiming');
    return clickElement(button, 'Récupération expédition');
  }

  function isExpeditionIndexPage() {
    return /^\/expeditions\/?$/.test(location.pathname);
  }

  function isExpeditionResultPage() {
    return /^\/expeditions\/results\//.test(location.pathname);
  }

  function isExpeditionPreparePage() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length === 3 && parts[0] === 'expeditions' && parts[2] === 'prepare';
  }

  function activeExpeditionSnapshot() {
    if (!isExpeditionIndexPage()) return null;

    const card = document.querySelector('.mission-slot-card--occupied');
    if (!card || !isVisible(card)) return null;

    const title = normalizeText(card.querySelector('h3')?.textContent || '') || 'expedition active';
    const timer = card.querySelector('time[data-countdown][data-countdown-format="expedition"]');
    const progress = card.querySelector('progress[data-mission-progress][data-progress-end]');
    const follow = card.querySelector('a[href*="/expeditions/results/"]');

    let dueAt = null;
    const timerEnd = timer?.getAttribute('datetime');
    if (timerEnd) {
      const parsed = Date.parse(timerEnd);
      if (!Number.isNaN(parsed)) dueAt = parsed;
    }

    if (!dueAt) {
      const progressEnd = progress?.getAttribute('data-progress-end');
      if (progressEnd) {
        const parsed = Date.parse(progressEnd);
        if (!Number.isNaN(parsed)) dueAt = parsed;
      }
    }

    return {
      card,
      title,
      dueAt,
      resultUrl: follow?.href || null,
      follow,
      status: normalizeText(card.querySelector('.status-badge')?.textContent || ''),
    };
  }

  function expeditionIndexLink() {
    return [...document.querySelectorAll('a[href]')]
      .filter(isVisible)
      .find(anchor => {
        try {
          const url = new URL(anchor.href, location.href);
          return url.origin === location.origin && /^\/expeditions\/?$/.test(url.pathname);
        } catch {
          return false;
        }
      }) || null;
  }

  function parseOptionalBoolean(value) {
    if (value == null || value === '') return null;
    const normalized = normalizeText(value);
    if (['1', 'true', 'yes', 'oui', 'new', 'owned', 'captured'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'non', 'unknown'].includes(normalized)) return false;
    return null;
  }

  function recordExpeditionOutcome() {
    if (!isExpeditionResultPage()) return;
    if (state.lastRecordedResultUrl === location.pathname) return;

    const text = normalizeText(document.body?.innerText || '');
    const failure = /echec|echouee|echoue|defaite|failed|failure|lost/.test(text);
    const success = /reussite|reussie|victoire|success|completed|terminee avec succes/.test(text);

    if (!failure && !success) return;

    const title = normalizeText(
      document.querySelector('.page-header h1, main h1, main h2')?.textContent ||
      expeditionCycle().title ||
      'expedition'
    );

    const previous = state.expeditionStats?.[title] || {
      attempts: 0,
      successes: 0,
      failures: 0,
      failureStreak: 0,
    };

    state.expeditionStats = {
      ...(state.expeditionStats || {}),
      [title]: {
        attempts: previous.attempts + 1,
        successes: previous.successes + (success && !failure ? 1 : 0),
        failures: previous.failures + (failure ? 1 : 0),
        failureStreak: failure ? previous.failureStreak + 1 : 0,
        lastOutcome: failure ? 'failure' : 'success',
        lastOutcomeAt: now(),
      },
    };
    state.lastRecordedResultUrl = location.pathname;
    saveState(state);
  }

  function resultPageLooksResolved() {
    const text = normalizeText(document.body?.innerText || '');
    return /recompenses recuperees|recompense recuperee|expedition recuperee|resultats valides|mission terminee|expedition terminee|recovered|claimed|completed/.test(text);
  }

  async function returnToExpeditions() {
    const link = expeditionIndexLink();
    if (!link) return false;
    setExpeditionPhase('ready_to_start', { resultUrl: null, dueAt: null });
    return clickElement(link, 'Retour aux expéditions');
  }

  async function handleExpeditionCycle() {
    if (!config.autoClaimExpeditions && !config.autoStartExpeditions) return false;

    const cycleState = expeditionCycle();

    if (isExpeditionIndexPage()) {
      const active = activeExpeditionSnapshot();

      if (active) {
        const dueAt = active.dueAt || cycleState.dueAt || null;
        const phase = dueAt && dueAt <= now() + 1500 ? 'due' : 'running';

        if (
          cycleState.phase !== phase ||
          cycleState.title !== active.title ||
          cycleState.resultUrl !== active.resultUrl ||
          cycleState.dueAt !== dueAt
        ) {
          setExpeditionPhase(phase, {
            title: active.title,
            resultUrl: active.resultUrl,
            dueAt,
          });
        }

        if (dueAt) {
          const previous = state.moduleStatus?.expeditions || {};
          state.moduleStatus = {
            ...(state.moduleStatus || {}),
            expeditions: {
              ...previous,
              lastVisitedAt: now(),
              nextDueAt: dueAt,
              timerSource: 'mission-slot-card',
              timerText: active.title,
            },
          };
          saveState(state);
        }

        if (phase === 'due' && active.follow) {
          setExpeditionPhase('opening_result');
          return clickElement(active.follow, 'Ouverture du résultat d’expédition');
        }

        return false;
      }

      state.selectedExpedition = null;
      state.selectedExpeditionScore = null;
      setExpeditionPhase('ready_to_start', {
        title: null,
        resultUrl: null,
        dueAt: null,
      });

      return startExpedition();
    }

    if (isExpeditionResultPage()) {
      recordExpeditionOutcome();

      if (!['claiming', 'awaiting_capture'].includes(cycleState.phase)) {
        setExpeditionPhase('result');
      }

      if (resultPageHasPendingCapture()) {
        const handledCapture = await captureEncounter();
        if (handledCapture) return true;

        if (expeditionCycle().phase === 'awaiting_capture') {
          return false;
        }
      }

      const claimed = await claimExpedition();
      if (claimed) return true;

      const currentCycle = expeditionCycle();
      const claimGracePassed = now() - (currentCycle.lastTransitionAt || 0) > 2500;
      if (
        claimGracePassed &&
        (currentCycle.phase === 'claiming' || resultPageLooksResolved())
      ) {
        return returnToExpeditions();
      }

      return false;
    }

    if (cycleState.phase === 'due' || cycleState.phase === 'ready_to_start') {
      const link = expeditionIndexLink();
      if (link) {
        return clickElement(
          link,
          cycleState.phase === 'due'
            ? 'Expédition terminée — ouverture des expéditions'
            : 'Retour aux expéditions pour relancer'
        );
      }
    }

    if (isExpeditionPreparePage()) {
      if (!['preparing', 'starting'].includes(cycleState.phase)) {
        setExpeditionPhase('preparing');
      }
      return handleExpeditionPreparation();
    }

    return false;
  }

// ---- src/features/activities.js ----
async function healTeam() {
    if (!config.autoHeal) return false;
    const button = findClickable([
      'tout soigner',
      'soigner equipe',
      'soigner l equipe',
      'heal all',
      'heal team',
      'soigner',
      'heal',
    ], document, { exclude: ['potion', 'objet', 'item', 'acheter', 'buy'] });
    return button ? clickElement(button, 'Soin équipe') : false;
  }

  async function harvestGreenhouse() {
    if (!config.autoHarvest) return false;
    const buttons = findAllClickables([
      'recolter',
      'harvest',
      'ramasser',
      'collect berries',
    ]);
    if (!buttons.length) return false;
    return clickElement(buttons[0], 'Récolte serre');
  }

  async function plantGreenhouse() {
    if (!config.autoPlant) return false;
    const button = findClickable(['planter', 'plant', 'semer', 'sow']);
    return button ? clickElement(button, 'Plantation serre') : false;
  }

  async function claimIncubator() {
    if (!config.autoIncubatorClaim) return false;
    const button = findClickable([
      'faire eclore',
      'eclore',
      'hatch',
      'recuperer oeuf',
      'collect egg',
      'extraire fossile',
      'restore fossil',
    ]);
    return button ? clickElement(button, 'Récupération incubateur') : false;
  }

  async function claimBreeding() {
    if (!config.autoBreedingClaim) return false;
    const button = findClickable([
      'recuperer l oeuf',
      'recuperer oeuf',
      'collect egg',
      'prendre l oeuf',
      'take egg',
    ]);
    return button ? clickElement(button, 'Récupération pension') : false;
  }

// ---- src/features/expeditions/catalog.js ----
function expeditionPrepareLink(card) {
    if (!card) return null;

    const direct = card.querySelector(
      'a[href*="/expeditions/"][href$="/prepare"], a.primary-button[href*="/prepare"], a[href*="/prepare"]'
    );

    if (direct && isVisible(direct) && !direct.hasAttribute('disabled')) return direct;

    return findClickable([
      'preparer l expedition', 'preparer expedition',
      'lancer expedition', 'lancer l expedition', 'partir', 'demarrer',
      'start expedition', 'start', 'depart', 'envoyer equipe', 'send team',
    ], card, {
      exclude: ['verrouille', 'locked', 'indisponible', 'unavailable'],
    });
  }

  function expeditionCards(root = document) {
    const requireVisibility = root === document;
    // Sélecteur natif PokéTaka : les missions lançables se trouvent dans le
    // catalogue "available" et possèdent un lien /prepare.
    const exact = [...root.querySelectorAll(
      '.mission-catalog[data-panel="available"] .mission-card, .mission-catalog__grid > .mission-card'
    )]
      .filter(card => !requireVisibility || isVisible(card))
      .filter(card => Boolean(expeditionPrepareLink(card)));

    if (exact.length) return exact;

    // Fallback pour rester compatible si le HTML du site évolue.
    const candidates = [...root.querySelectorAll(
      'article, section, li, .card, [class*="card"], [class*="expedition"], [data-expedition], [data-route]'
    )]
      .filter(el => !requireVisibility || isVisible(el))
      .filter(el => Boolean(expeditionPrepareLink(el)));

    const seen = new Set();
    return candidates.filter(el => {
      const text = elementText(el);
      if (!text || seen.has(text)) return false;
      seen.add(text);
      return true;
    });
  }

  function parseNumber(value) {
    if (value == null) return null;
    const normalized = String(value).replace(/\s/g, '').replace(',', '.');
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }

  function parseFirstMatch(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return parseNumber(match[1]);
    }
    return null;
  }

  function parseDurationMinutes(text) {
    let minutes = 0;
    const hours = text.match(/(\d+(?:[.,]\d+)?)\s*(?:h|heure|heures|hour|hours)\b/i);
    const mins = text.match(/(\d+(?:[.,]\d+)?)\s*(?:min|minute|minutes)\b/i);
    const secs = text.match(/(\d+(?:[.,]\d+)?)\s*(?:s|sec|seconde|secondes|second|seconds)\b/i);

    if (hours) minutes += (parseNumber(hours[1]) || 0) * 60;
    if (mins) minutes += parseNumber(mins[1]) || 0;
    if (secs) minutes += (parseNumber(secs[1]) || 0) / 60;

    return minutes > 0 ? minutes : null;
  }

  function parseChance(text) {
    const contextual = parseFirstMatch(text, [
      /(?:chance|succes|reussite|victoire|success|win chance)[^%\d]{0,20}(\d+(?:[.,]\d+)?)\s*%/i,
      /(\d+(?:[.,]\d+)?)\s*%[^a-z]{0,8}(?:chance|succes|reussite|victoire|success)/i,
    ]);
    if (contextual != null) return Math.max(0, Math.min(100, contextual));

    const percentages = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)]
      .map(match => parseNumber(match[1]))
      .filter(value => value != null && value >= 0 && value <= 100);

    return percentages.length === 1 ? percentages[0] : null;
  }

  function parseRequiredLevel(text) {
    return parseFirstMatch(text, [
      /(?:niveau|niv\.?|level|lvl\.?)\s*(?:requis|required|minimum|min|conseille|recommended)?\s*[:≥>=-]*\s*(\d+)/i,
      /(?:requis|required)\s*(?:niveau|level|lvl\.?)?\s*[:≥>=-]*\s*(\d+)/i,
    ]);
  }

  function parseTeamLevel(pageText) {
    return parseFirstMatch(pageText, [
      /(?:niveau moyen|niveau equipe|moyenne equipe|average level|team level)\s*[:=-]*\s*(\d+(?:[.,]\d+)?)/i,
      /(?:equipe|team)[^\n]{0,30}(?:niv\.?|lvl\.?|niveau|level)\s*[:=-]*\s*(\d+(?:[.,]\d+)?)/i,
    ]);
  }

  function parseRewardValue(text) {
    let score = 0;

    const moneyMatches = [...text.matchAll(
      /(\d[\d\s.,]*)\s*(?:₽|pok(?:e|é)dollars?|pokedollars?|coins?|pieces?)/gi
    )];
    for (const match of moneyMatches) {
      const amount = parseNumber(match[1]);
      if (amount) score += Math.log10(amount + 10) * 18;
    }

    const xpMatches = [...text.matchAll(
      /(\d[\d\s.,]*)\s*(?:xp|exp(?:erience)?)/gi
    )];
    for (const match of xpMatches) {
      const amount = parseNumber(match[1]);
      if (amount) score += Math.log10(amount + 10) * 16;
    }

    const quantityMatches = [...text.matchAll(/(?:x\s*)?(\d+)\s+(?:objet|item|baie|berry|ball|bonbon|candy)/gi)];
    for (const match of quantityMatches) score += Math.min(30, (parseNumber(match[1]) || 0) * 4);

    if (/rare|epique|epic|legendaire|legendary|fossile|fossil|oeuf|egg/i.test(text)) score += 20;
    return score;
  }

  function parseResourceCost(text) {
    return {
      energy: parseFirstMatch(text, [
        /(?:cout|cost|consomme|consume)[^\d]{0,12}(\d+(?:[.,]\d+)?)\s*(?:energie|energy|stamina)/i,
        /(\d+(?:[.,]\d+)?)\s*(?:energie|energy|stamina)\s*(?:requis|required|cout|cost)/i,
      ]),
    };
  }

  function parseAvailableResources(pageText) {
    return {
      energy: parseFirstMatch(pageText, [
        /(?:energie|energy|stamina)\s*[:=-]?\s*(\d+(?:[.,]\d+)?)(?:\s*\/\s*\d+)?/i,
      ]),
    };
  }

  function zoneRank(text, domIndex) {
    const numbered = parseFirstMatch(text, [
      /(?:route|zone|chemin|path|stage|etape)\s*#?\s*(\d+)/i,
      /(?:arene|gym|badge)\s*#?\s*(\d+)/i,
    ]);

    let rank = numbered != null ? numbered * 10 : domIndex;
    if (/ligue|league|elite\s*4|conseil\s*4/i.test(text)) rank += 500;
    if (/champion/i.test(text)) rank += 700;
    return rank;
  }

  function expeditionTitle(card, index) {
    const heading = card.querySelector('h1, h2, h3, h4, h5, strong, [class*="title"]');
    const title = normalizeText(heading?.textContent || '').trim();
    if (title) return title.slice(0, 80);

    const text = normalizeText(card.textContent || '');
    return text.slice(0, 80) || `expedition ${index + 1}`;
  }

  function isNewProgression(text) {
    return /nouveau|nouvelle|new|premiere fois|first clear|non termine|uncompleted|a decouvrir|undiscovered/i.test(text);
  }

  function isPreviouslyCompleted(text) {
    return /termine|complete|completed|deja termine|already cleared|maitrise|mastered/i.test(text);
  }

  function analyzeExpedition(card, index, pageContext, root = document) {
  const detailsTrigger = card.querySelector('[data-open-dialog]');
  const detailsId = detailsTrigger?.getAttribute('data-open-dialog');
  const details = detailsId ? root.getElementById(detailsId) : null;

  const text = normalizeText([
    card.innerText || card.textContent || '',
    details?.textContent || '',
  ].join(' '));

  const title = expeditionTitle(card, index);
  const chance = parseChance(text);
  const durationMinutes = parseDurationMinutes(text);
  const requiredLevel = parseRequiredLevel(text);
  const rewardScore = parseRewardValue(text);
  const costs = parseResourceCost(text);
  const progressionRank = zoneRank(text, index);
  const missionTypes = parseMissionTypes(text);
  const teamSize = parseRequiredTeamSize(text);
  const completed = pageContext.historyTitles?.has(title) || isPreviouslyCompleted(text);
  const newProgression = !completed || isNewProgression(text);
  const stats = state.expeditionStats?.[title] || {};
  const failureStreak = Number(stats.failureStreak || 0);
  const startButton = expeditionPrepareLink(card);
  const block = currentMissionBlock(title);

  const teamPlan = estimateTeamForMission({
    title,
    missionTypes,
    recommendedLevel: requiredLevel,
    teamSize,
    durationMinutes,
  });

  let score = progressionRank * 18;
  const reasons = [];

  if (newProgression) {
    score += 300;
    reasons.push('+300 nouvelle progression');
  }

  if (completed) {
    score -= 80;
    reasons.push('-80 déjà terminée');
  }

  if (block) {
    score -= 5000;
    reasons.push(`-5000 temporairement écartée: ${block.reason}`);
  }

  if (failureStreak > 0) {
    const failurePenalty = failureStreak >= 2
      ? 900 + (failureStreak - 2) * 250
      : 220;
    score -= failurePenalty;
    reasons.push(`-${failurePenalty} échecs consécutifs (${failureStreak})`);
  }

  if (teamPlan.known) {
    if (teamPlan.viable) {
      const teamBonus = Math.max(
        -120,
        Math.min(220, Math.round((teamPlan.teamScore || 0) * 0.35))
      );
      score += teamBonus;
      reasons.push(
        `${teamBonus >= 0 ? '+' : ''}${teamBonus} équipe ${teamPlan.team.map(p => p.name).join(', ')}`
      );

      if (requiredLevel != null && teamPlan.avgLevel != null) {
        const margin = teamPlan.avgLevel - requiredLevel;
        const levelBonus = margin >= 0
          ? Math.min(120, 35 + margin * 12)
          : Math.max(-300, margin * 90);
        score += levelBonus;
        reasons.push(
          `${levelBonus >= 0 ? '+' : ''}${Math.round(levelBonus)} niveau équipe vs conseillé`
        );
      }
    } else {
      score -= 1800;
      reasons.push(`-1800 aucune équipe viable (${teamPlan.reason})`);
    }
  } else {
    reasons.push('roster inconnu — validation sur la page de préparation');
  }

  if (chance != null) {
    const encounterBonus = chance * 0.25;
    score += encounterBonus;
    reasons.push(`+${Math.round(encounterBonus)} potentiel rencontre ${chance}%`);
  }

  score += rewardScore;
  if (rewardScore > 0) reasons.push(`+${Math.round(rewardScore)} récompenses`);

  if (durationMinutes != null) {
    const speedBonus = Math.max(-60, 35 - Math.log2(durationMinutes + 1) * 8);
    score += speedBonus;
    reasons.push(
      `${speedBonus >= 0 ? '+' : ''}${Math.round(speedBonus)} durée ${Math.round(durationMinutes)} min`
    );

    if (
      config.avoidLongLowValue &&
      durationMinutes >= 240 &&
      rewardScore < 35 &&
      !newProgression
    ) {
      score -= 120;
      reasons.push('-120 longue/faible valeur');
    }
  }

  if (
    costs.energy != null &&
    pageContext.resources.energy != null &&
    costs.energy > pageContext.resources.energy
  ) {
    score -= 1000;
    reasons.push('-1000 énergie insuffisante');
  }

  if (/verrouille|locked|indisponible|unavailable|equipe occupee|team busy/i.test(text)) {
    score -= 2000;
    reasons.push('-2000 indisponible');
  }

  return {
    card,
    button: startButton,
    index,
    title,
    chance,
    durationMinutes,
    requiredLevel,
    missionTypes,
    teamSize,
    teamPlan,
    rewardScore: Math.round(rewardScore),
    progressionRank,
    newProgression,
    completed,
    failureStreak,
    blocked: Boolean(block),
    block,
    energyCost: costs.energy,
    energyAvailable: pageContext.resources.energy,
    score: Math.round(score),
    reasons,
  };
}

function rankExpeditions(root = document) {
  const cards = expeditionCards(root);
  const pageText = normalizeText(root.body?.innerText || root.body?.textContent || '');
  const historyTitles = new Set(
    [...root.querySelectorAll('.mission-archives a strong')]
      .map(element => normalizeText(element.textContent || ''))
      .filter(Boolean)
  );

  const pageContext = {
    resources: parseAvailableResources(pageText),
    historyTitles,
  };

  const ranking = cards
    .map((card, index) => analyzeExpedition(card, index, pageContext, root))
    .filter(item => item.button)
    .sort((a, b) => b.score - a.score);

  if (config.debug && ranking.length) {
    console.table(ranking.map(item => ({
      expedition: item.title,
      score: item.score,
      progression: item.progressionRank,
      niveauConseille: item.requiredLevel ?? '?',
      equipe: item.teamPlan.known
        ? item.teamPlan.team.map(pokemon => pokemon.name).join(', ') || 'aucune'
        : 'à confirmer',
      equipeViable: item.teamPlan.viable ?? '?',
      scoreEquipe: item.teamPlan.teamScore ?? '?',
      types: item.missionTypes.join(', ') || '?',
      rencontre: item.chance != null ? item.chance + '%' : '?',
      dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
      echecs: item.failureStreak,
      bloquee: item.blocked,
    })));

    log('Classement expéditions intelligent', ranking.map(item => ({
      title: item.title,
      score: item.score,
      team: item.teamPlan.team.map(pokemon => pokemon.name),
      viable: item.teamPlan.viable,
      reasons: item.reasons,
    })));
  }

  return ranking;
}

function expeditionProgressionCandidates(ranking) {
  return ranking
    .filter(item => !item.blocked)
    .filter(item => item.failureStreak < 2)
    .filter(item => item.teamPlan.viable !== false)
    .sort((a, b) => {
      if (a.newProgression !== b.newProgression) {
        return Number(b.newProgression) - Number(a.newProgression);
      }
      if (a.progressionRank !== b.progressionRank) {
        return b.progressionRank - a.progressionRank;
      }

      const teamA = a.teamPlan.teamScore ?? -Infinity;
      const teamB = b.teamPlan.teamScore ?? -Infinity;
      if (teamA !== teamB) return teamB - teamA;

      return b.score - a.score;
    });
}

function selectExpeditionFromRanking(ranking) {
  if (!ranking?.length) return null;

  let selected = ranking.find(item => !item.blocked) || ranking[0];
  const goal = currentGoalPlan();
  const targetExpedition = goalTargetExpedition();

  if (targetExpedition) {
    const target = normalizeText(targetExpedition);
    const exact = ranking.find(item =>
      normalizeText(item.title) === target &&
      !item.blocked &&
      item.failureStreak < 2 &&
      item.teamPlan.viable !== false
    );
    if (exact) selected = exact;
  } else if (goal.step?.action === 'farm_captures') {
    const captureCandidates = ranking
      .filter(item => !item.blocked)
      .filter(item => item.failureStreak < 2)
      .filter(item => item.teamPlan.viable !== false)
      .sort((a, b) => {
        const chanceDelta = Number(b.chance || 0) - Number(a.chance || 0);
        if (chanceDelta) return chanceDelta;
        const durationA = a.durationMinutes ?? Infinity;
        const durationB = b.durationMinutes ?? Infinity;
        return durationA - durationB;
      });
    if (captureCandidates.length) selected = captureCandidates[0];
  } else if (config.strategy === 'progression') {
    const candidates = expeditionProgressionCandidates(ranking);
    if (candidates.length) selected = candidates[0];
  }

  return selected;
}

async function startExpedition() {
  if (!config.autoStartExpeditions) return false;

  const ranking = rankExpeditions();
  if (!ranking.length) {
    state.selectedExpedition = null;
    state.selectedExpeditionScore = null;
    saveState(state);
    updatePanel();
    return false;
  }

  const selected = selectExpeditionFromRanking(ranking);
  const goal = currentGoalPlan();
  const targetExpedition = goalTargetExpedition();

  state.selectedExpedition = selected.title;
  state.selectedExpeditionScore = selected.score;
  state.expeditionPlan = {
    title: selected.title,
    team: selected.teamPlan.team.map(pokemon => pokemon.name),
    teamIds: selected.teamPlan.team.map(pokemon => pokemon.id),
    teamScore: selected.teamPlan.teamScore,
    viability: selected.teamPlan.known
      ? (selected.teamPlan.viable ? 'viable' : 'blocked')
      : 'unknown',
    reason: targetExpedition
      ? `Objectif global: ${goal.step?.title} · ${selected.teamPlan.reason}`
      : selected.teamPlan.reason,
    updatedAt: now(),
  };
  saveState(state);
  updatePanel();

  setExpeditionPhase('preparing', {
    title: selected.title,
    resultUrl: null,
    dueAt: null,
  });

  return clickElement(
    selected.button,
    `Préparation intelligente: ${selected.title} (score ${selected.score})`
  );
}

async function autoProgression() {
    if (!config.autoProgression) return false;

    const button = findClickable([
      'continuer', 'continue',
      'debloquer', 'unlock',
      'prochaine zone', 'next area',
      'prochaine etape', 'next step',
      'avancer', 'progresser',
    ], document, {
      exclude: ['acheter', 'buy', 'cout', 'cost', 'payer', 'pay'],
    });

    return button ? clickElement(button, 'Progression') : false;
  }

// ---- src/core/background.js ----
function backgroundSweepDue() {
  if (!config.backgroundHttpMode) return false;

  const last = Number(backgroundHttpState().lastSweepAt || 0);
  const interval = Math.max(10, Number(config.backgroundRefreshSeconds || 30)) * 1000;

  if (
    ['due', 'ready_to_start', 'preparing', 'starting'].includes(
      expeditionCycle().phase
    )
  ) return true;
  if (leagueNeedsDailyCheck()) return true;
  if (pokemonProgressionScanDue()) return true;

  return now() - last >= interval;
}

function backgroundMarkSweep() {
  recordBackgroundHttp({
    lastSweepAt: now(),
  });
}

function detachedActiveExpeditionSnapshot(root) {
  const card = root.querySelector('.mission-slot-card--occupied');
  if (!card) return null;

  const title = card.querySelector('h3')?.textContent?.trim() || 'Expédition active';
  const timer = card.querySelector('time[data-countdown][data-countdown-format="expedition"]');
  const progress = card.querySelector('progress[data-mission-progress][data-progress-end]');
  const follow = card.querySelector('a[href*="/expeditions/results/"]');

  let dueAt = null;
  const timerEnd = timer?.getAttribute('datetime');
  if (timerEnd) {
    const parsed = Date.parse(timerEnd);
    if (!Number.isNaN(parsed)) dueAt = parsed;
  }

  if (!dueAt) {
    const progressEnd = progress?.getAttribute('data-progress-end');
    if (progressEnd) {
      const parsed = Date.parse(progressEnd);
      if (!Number.isNaN(parsed)) dueAt = parsed;
    }
  }

  return {
    title,
    dueAt,
    resultUrl: follow?.href || follow?.getAttribute('href') || null,
    status: normalizeText(card.querySelector('.status-badge')?.textContent || ''),
  };
}

function mergeBackgroundExpeditionAccount(root) {
  const previous = accountSnapshot();
  const progressRoot = root.querySelector('.mission-hub__progress');
  let trainerLevel = previous.trainer?.level ?? null;
  let capturedSpecies = previous.pokedex?.capturedSpecies ?? null;

  progressRoot?.querySelectorAll(':scope > div').forEach(row => {
    const label = normalizeText(row.querySelector('span')?.textContent || '');
    const value = parseNumber(row.querySelector('strong')?.textContent);

    if (value == null) return;
    if (label === 'niveau' || label.includes('niveau dresseur')) trainerLevel = value;
    if (label.includes('especes capturees')) capturedSpecies = value;
  });

  const completed = new Set(previous.expeditions?.completedTitles || []);
  root.querySelectorAll('.mission-archives a strong').forEach(node => {
    const title = normalizeText(node.textContent || '');
    if (title) completed.add(title);
  });

  const availableTitles = [
    ...root.querySelectorAll(
      '.mission-tabset__panel[data-panel="available"] article h3, [data-panel="available"] article h3'
    ),
  ].map(node => node.textContent?.trim()).filter(Boolean);

  const locked = [];
  let previousTitle = availableTitles[availableTitles.length - 1] || null;
  root.querySelectorAll('.mission-locked__grid article').forEach(card => {
    const title = card.querySelector('h3')?.textContent?.trim() || 'Destination verrouillée';
    const requirements = [...card.querySelectorAll('li')]
      .map(node => parseExpeditionLockRequirement(node.textContent || '', previousTitle))
      .filter(requirement => requirement.label);

    locked.push({
      title,
      normalizedTitle: normalizeText(title),
      difficulty: card.querySelector('.mission-difficulty')?.textContent?.trim() || null,
      requirements,
    });

    previousTitle = title;
  });

  state.accountSnapshot = {
    ...previous,
    observedAt: now(),
    trainer: {
      ...previous.trainer,
      level: trainerLevel,
    },
    pokedex: {
      ...previous.pokedex,
      known: capturedSpecies != null || previous.pokedex?.known || false,
      capturedSpecies,
    },
    expeditions: {
      ...previous.expeditions,
      completedTitles: [...completed],
      locked: locked.length ? locked : previous.expeditions?.locked || [],
    },
    sources: [...new Set([...(previous.sources || []), '/expeditions'])].slice(-20),
  };
  saveState(state);
}

function mergeBackgroundLeagueAccount(root, leagueInfo) {
  const previous = accountSnapshot();
  const lockedGyms = [...root.querySelectorAll('.gym-card--locked')].map((card, index) => {
    const identity = card.querySelector('.gym-card__identity');
    const requirements = [...card.querySelectorAll('.gym-requirements p')]
      .map(node => parseLeagueRequirement(node.textContent || ''))
      .filter(requirement => requirement.label);

    return {
      rank:
        parseNumber(card.querySelector('.gym-rank')?.textContent?.match(/\d+/)?.[0]) ||
        index + 1,
      arena:
        identity?.querySelector('h3')?.textContent?.trim() ||
        card.querySelector('h3')?.textContent?.trim() ||
        `Arène ${index + 1}`,
      champion:
        [...(identity?.querySelectorAll('p') || [])]
          .map(node => node.textContent?.trim() || '')
          .find(text => /^champion\s*:/i.test(text))
          ?.replace(/^champion\s*:\s*/i, '') ||
        null,
      badge:
        identity?.querySelector('.card-label')?.textContent?.trim() ||
        card.querySelector('.card-label')?.textContent?.trim() ||
        null,
      requirements,
    };
  });

  state.accountSnapshot = {
    ...previous,
    observedAt: now(),
    league: {
      ...previous.league,
      known: true,
      badges: leagueInfo.badges ?? previous.league?.badges ?? null,
      totalBadges: leagueInfo.totalBadges || previous.league?.totalBadges || 8,
      dailyBattleAvailable: leagueInfo.dailyAvailable,
      arena: leagueInfo.gym?.arena || null,
      champion: leagueInfo.gym?.champion || null,
      badge: leagueInfo.gym?.badge || null,
      phase: gymCycle().phase,
      needsHealing: gymCycle().needsHealing,
      lockedGyms: lockedGyms.length ? lockedGyms : previous.league?.lockedGyms || [],
    },
    sources: [...new Set([...(previous.sources || []), '/league'])].slice(-20),
  };
  saveState(state);
}

function detachedLeagueInfo(root) {
  const headerText = normalizeText(
    root.querySelector('.page-header__actions')?.textContent || ''
  );

  let dailyAvailable = null;
  if (/combat du jour disponible|daily battle available/.test(headerText)) {
    dailyAvailable = true;
  } else if (
    /combat du jour (?:deja )?(?:utilise|termine|indisponible)|daily battle (?:used|completed|unavailable)/.test(headerText)
  ) {
    dailyAvailable = false;
  }

  const progress = root.querySelector('.gym-progress');
  const progressText = normalizeText(
    progress?.getAttribute('aria-label') ||
    progress?.querySelector('strong')?.textContent ||
    progress?.textContent ||
    ''
  );
  const progressMatch = progressText.match(/(\d+)\s*\/\s*(\d+)/);

  const card = root.querySelector(
    '.gym-circuit--available .gym-card--available, .gym-card.gym-card--available'
  );
  const prepare = card?.querySelector(
    'a.primary-button[href*="/gyms/"][href$="/prepare"], a[href*="/gyms/"][href$="/prepare"]'
  );
  const facts = normalizeText(card?.textContent || '');
  const teamSizeMatch = facts.match(/equipe de\s*(\d+)\s*pokemon/i);

  return {
    dailyAvailable,
    badges: progressMatch ? Number(progressMatch[1]) : null,
    totalBadges: progressMatch ? Number(progressMatch[2]) : 8,
    gym: card && prepare
      ? {
          prepareUrl: prepare.href || prepare.getAttribute('href'),
          arena: card.querySelector('.gym-card__identity h3, h3')?.textContent?.trim() || 'Arène',
          champion:
            card.querySelector('.gym-card__identity p:last-child')?.textContent
              ?.replace(/^\s*Champion\s*:\s*/i, '')
              .trim() || null,
          badge: card.querySelector('.gym-card__identity .card-label, .card-label')?.textContent?.trim() || null,
          rank: parseNumber(card.querySelector('.gym-rank')?.textContent?.match(/\d+/)?.[0]),
          teamSize: teamSizeMatch ? Number(teamSizeMatch[1]) : null,
        }
      : null,
  };
}

function expeditionPendingResultCount(root) {
  const badge = [...root.querySelectorAll('a[href*="/expeditions"] .app-nav-item__badge, .app-nav-item[href*="/expeditions"] .app-nav-item__badge')]
    .find(node => /expedition terminee|expeditions terminees|resultat|a recuperer/.test(
      normalizeText(node.getAttribute('aria-label') || node.textContent || '')
    ));

  if (!badge) return 0;
  const value = parseNumber(
    badge.getAttribute('aria-label') || badge.textContent || ''
  );
  return Number(value || 0);
}

function detachedResultCandidates(root) {
  const seen = new Set();
  return [...root.querySelectorAll('a[href*="/expeditions/results/"]')]
    .map(anchor => {
      try {
        const url = new URL(anchor.getAttribute('href') || anchor.href, location.href);
        if (url.origin !== location.origin) return null;
        if (seen.has(url.href)) return null;
        seen.add(url.href);

        const container = anchor.closest(
          '.mission-slot-card, .mission-card, article, section, li'
        );
        return {
          resultUrl: url.href,
          title:
            container?.querySelector('h2, h3, strong')?.textContent?.trim() ||
            anchor.textContent?.trim() ||
            'Expédition terminée',
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function findPendingExpeditionResult(indexPage) {
  const previous = expeditionCycle();
  const candidates = detachedResultCandidates(indexPage.doc);

  if (isExpeditionResultPage()) {
    candidates.unshift({
      title:
        document.querySelector('.page-header h1, main h1')?.textContent?.trim() ||
        previous.title ||
        'Expédition terminée',
      resultUrl: location.href,
    });
  }

  if (
    previous.resultUrl &&
    ['due', 'opening_result', 'result', 'claiming', 'awaiting_capture'].includes(previous.phase)
  ) {
    candidates.unshift({
      resultUrl: previous.resultUrl,
      title: previous.title || 'Expédition terminée',
    });
  }

  const unique = [];
  const seen = new Set();
  for (const candidate of candidates) {
    if (!candidate?.resultUrl || seen.has(candidate.resultUrl)) continue;
    seen.add(candidate.resultUrl);
    unique.push(candidate);
  }

  for (const candidate of unique.slice(0, 4)) {
    const page = await fetchObservedPage(candidate.resultUrl, {
      cacheMs: 0,
      force: true,
    });
    if (!page) continue;

    const hasPendingCapture = Boolean(page.doc.querySelector('form[data-capture-form]'));
    const hasClaim = Boolean(expeditionRewardClaimForm(page.doc));
    const headerStatus = normalizeText(
      page.doc.querySelector('.page-header__actions .status-badge')?.textContent || ''
    );

    if (
      hasPendingCapture ||
      hasClaim ||
      /a recuperer|capture|decision requise/.test(headerStatus)
    ) {
      return {
        title:
          page.doc.querySelector('.page-header h1, main h1')?.textContent?.trim() ||
          candidate.title,
        resultUrl: page.url,
        dueAt: null,
        status: 'pending_result',
      };
    }
  }

  if (expeditionPendingResultCount(indexPage.doc) > 0) {
    return {
      title: previous.title || 'Expédition terminée',
      resultUrl: previous.resultUrl || null,
      dueAt: null,
      status: 'pending_result_unknown_url',
    };
  }

  return null;
}

async function backgroundObserveExpeditions({ force = false } = {}) {
  const page = await fetchObservedPage('/expeditions', {
    cacheMs: force ? 0 : 5000,
    force,
  });
  if (!page) return { acted: false, page: null, active: null };

  const root = page.doc;
  mergeBackgroundExpeditionAccount(root);

  const active = detachedActiveExpeditionSnapshot(root);
  if (active) {
    const dueAt = active.dueAt || expeditionCycle().dueAt || null;
    const phase = dueAt && dueAt <= now() + 1500 ? 'due' : 'running';

    setExpeditionPhase(phase, {
      title: active.title,
      resultUrl: active.resultUrl,
      dueAt,
    });

    const activeTitleChanged =
      normalizeText(state.selectedExpedition || '') !==
      normalizeText(active.title || '');

    if (activeTitleChanged) {
      state.selectedExpedition = active.title;
      state.selectedExpeditionScore = null;
    }

    if (
      normalizeText(state.expeditionPlan?.title || '') !==
      normalizeText(active.title || '')
    ) {
      state.expeditionPlan = {
        title: active.title,
        team: [],
        teamIds: [],
        teamScore: null,
        viability: 'active',
        reason: 'Expédition active observée en arrière-plan',
        updatedAt: now(),
      };
    }

    state.accountSnapshot = {
      ...accountSnapshot(),
      expeditions: {
        ...accountSnapshot().expeditions,
        phase,
        activeTitle: active.title,
        dueAt,
      },
    };
    saveState(state);

    return { acted: false, page, active };
  }

  const pendingResult = await findPendingExpeditionResult(page);

  if (pendingResult) {
    setExpeditionPhase('due', {
      title: pendingResult.title,
      resultUrl: pendingResult.resultUrl,
      dueAt: null,
    });

    appendActionLog(
      pendingResult.resultUrl ? 'info' : 'warning',
      'expedition',
      pendingResult.resultUrl
        ? `Résultat à récupérer détecté: ${pendingResult.title}`
        : 'Résultat terminé détecté mais URL de bilan introuvable',
      {
        resultUrl: pendingResult.resultUrl,
        status: pendingResult.status,
      }
    );

    return {
      acted: false,
      page,
      active: pendingResult,
      pendingResult: true,
    };
  }

  setExpeditionPhase('ready_to_start', {
    title: null,
    resultUrl: null,
    dueAt: null,
  });

  return { acted: false, page, active: null, pendingResult: false };
}

function detachedCaptureDecision(root) {
  const form = root.querySelector('form[data-capture-form]');
  if (!form) return null;

  const encounter = form.closest('.mission-encounter, section, article') || form;
  const text = normalizeText(encounter.textContent || '');
  const species =
    encounter.querySelector('.mission-encounter__identity h3, h3')?.textContent?.trim() ||
    'Pokémon rencontré';

  const isNew = encounterOwnershipState(encounter, text);
  const rarity =
    normalizeText(encounter.getAttribute('data-rarity') || '') ||
    (text.match(/\b(commun|peu commun|rare|epique|legendaire|mythique|common|uncommon|epic|legendary|mythic)\b/)?.[1] || '');

  const ivRaw =
    encounter.getAttribute('data-iv-total') ||
    encounter.getAttribute('data-iv-score') ||
    text.match(/(?:iv|ivs)[^\d]{0,12}(\d+(?:[.,]\d+)?)/i)?.[1];
  const ivScore = parseNumber(ivRaw);

  const checked = form.querySelector('input[name="ball_code"]:checked');
  const label = checked?.closest('label');
  const selected = form.querySelector('[data-capture-select-value], .capture-select__value');
  const countText =
    label?.querySelector('strong')?.textContent ||
    selected?.querySelector('strong')?.textContent ||
    '';
  const countMatch = countText.match(/\d+/);
  const ballReserve = countMatch ? Number(countMatch[0]) : null;

  const chanceText = form.querySelector('[data-capture-chance], .capture-chance')?.textContent || '';
  const chanceMatch = chanceText.match(/(\d+(?:[.,]\d+)?)\s*%/);
  const captureChance = chanceMatch ? parseNumber(chanceMatch[1]) : null;

  const attemptsText = encounter.querySelector('.mission-encounter__attempts')?.textContent || '';
  const attemptsMatch = attemptsText.match(/(\d+)\s*(?:tentative|tentatives|attempt|attempts)/i);
  const attemptsRemaining = attemptsMatch ? Number(attemptsMatch[1]) : null;

  const captureButton = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );

  const context = {
    root: encounter,
    form,
    captureButton,
    skipButton: null,
    species,
    isNew,
    rarity,
    ivScore,
    ballCode: checked?.value || null,
    ballName:
      label?.querySelector('span')?.textContent?.trim() ||
      selected?.querySelector('span')?.textContent?.trim() ||
      checked?.value ||
      null,
    ballReserve,
    ballMultiplierBps: parseNumber(checked?.getAttribute('data-multiplier-bps')),
    captureChance,
    attemptsRemaining,
    text,
  };

  const decision = decideCapture(context);

  return {
    ...context,
    action: decision.action,
    reason: decision.reason,
  };
}

function recordDetachedExpeditionOutcome(root, pathname) {
  if (!pathname || state.lastRecordedResultUrl === pathname) return;

  const text = normalizeText(root.body?.textContent || '');
  const failure = /echec|echouee|echoue|defaite|failed|failure|lost/.test(text);
  const success = /reussite|reussie|victoire|success|completed|terminee avec succes/.test(text);

  if (!failure && !success) return;

  const title = normalizeText(
    root.querySelector('.page-header h1, main h1, main h2')?.textContent ||
    expeditionCycle().title ||
    'expedition'
  );

  const previous = state.expeditionStats?.[title] || {
    attempts: 0,
    successes: 0,
    failures: 0,
    failureStreak: 0,
  };

  state.expeditionStats = {
    ...(state.expeditionStats || {}),
    [title]: {
      attempts: previous.attempts + 1,
      successes: previous.successes + (success && !failure ? 1 : 0),
      failures: previous.failures + (failure ? 1 : 0),
      failureStreak: failure ? previous.failureStreak + 1 : 0,
      lastOutcome: failure ? 'failure' : 'success',
      lastOutcomeAt: now(),
    },
  };
  state.lastRecordedResultUrl = pathname;
  saveState(state);
}

function expeditionRewardClaimForm(root) {
  return root.querySelector(
    'form[method="POST"][action*="/expeditions/results/"][action$="/claim"]'
  );
}

function expeditionRewardsRecovered(root) {
  const claimForm = expeditionRewardClaimForm(root);
  if (claimForm) return false;

  const metas = [...root.querySelectorAll('.mission-rewards .mission-reward__meta')]
    .map(node => normalizeText(node.textContent || ''))
    .filter(Boolean);

  if (!metas.length) {
    return Boolean(root.querySelector('.result-claimed'));
  }

  return metas.every(meta =>
    !/a recuperer|to claim|claimable|pending/.test(meta)
  );
}

async function verifyBackgroundExpeditionClaim(resultUrl) {
  const page = await fetchObservedPage(resultUrl, {
    cacheMs: 0,
    force: true,
  });
  if (!page) return false;

  const redirectedToIndex = /^\/expeditions\/?$/.test(page.pathname);
  const recovered = redirectedToIndex || expeditionRewardsRecovered(page.doc);

  if (recovered) {
    appendActionLog(
      'success',
      'expedition',
      'Récompenses d’expédition confirmées',
      {
        resultUrl: page.pathname,
        verification: redirectedToIndex ? 'redirected_to_index' : 'result_marked_recovered',
      }
    );
    return true;
  }

  appendActionLog(
    'warning',
    'expedition',
    'Récompenses toujours en attente après le POST',
    { resultUrl: page.pathname }
  );
  return false;
}

async function backgroundHandleExpeditionResult(active) {
  if (!active?.resultUrl) return false;

  const page = await fetchObservedPage(active.resultUrl, {
    cacheMs: 0,
    force: true,
  });
  if (!page) return false;

  recordDetachedExpeditionOutcome(page.doc, page.pathname);

  const capture = detachedCaptureDecision(page.doc);
  if (capture) {
    state.captureDecision = {
      action: capture.action,
      reason: capture.reason,
      species: capture.species,
      isNew: capture.isNew,
      rarity: capture.rarity,
      ivScore: capture.ivScore,
      ballName: capture.ballName || null,
      ballCode: capture.ballCode || capture.form.querySelector('input[name="ball_code"]:checked')?.value || null,
      ballReserve: capture.ballReserve,
      captureChance: capture.captureChance,
      attemptsRemaining: capture.attemptsRemaining,
      updatedAt: now(),
    };

    if (capture.action === 'ignore' || capture.action === 'manual') {
      appendActionLog(
        capture.action === 'manual' ? 'warning' : 'info',
        'capture',
        `${capture.action === 'manual' ? 'Capture manuelle' : 'Capture ignorée'}: ${capture.species}`,
        {
          reason: capture.reason,
          isNew: capture.isNew,
          rarity: capture.rarity,
          ivScore: capture.ivScore,
        }
      );
    }

    saveState(state);
    updatePanel();

    if (capture.action === 'manual') {
      setExpeditionPhase('due', {
        title: active.title,
        resultUrl: active.resultUrl,
        dueAt: active.dueAt,
      });
      return false;
    }

    if (capture.action === 'capture') {
      const submitted = await submitObservedForm(
        capture.form,
        `Capture arrière-plan: ${capture.species} — ${capture.reason}`,
        {
          expectedKind: 'capture',
          navigate: false,
          moduleId: 'expeditions',
        }
      );

      if (submitted) return true;

      setExpeditionPhase('due', {
        title: active.title,
        resultUrl: active.resultUrl,
        dueAt: active.dueAt,
      });
      return false;
    }
  }

  if (expeditionRewardsRecovered(page.doc)) {
    setExpeditionPhase('ready_to_start', {
      title: null,
      resultUrl: null,
      dueAt: null,
    });
    appendActionLog(
      'success',
      'expedition',
      `Résultat finalisé: ${active.title}`,
      'Toutes les récompenses sont déjà récupérées'
    );
    return false;
  }

  const claimForm = expeditionRewardClaimForm(page.doc);

  if (config.autoClaimExpeditions && claimForm) {
    setExpeditionPhase('claiming', {
      title: active.title,
      resultUrl: active.resultUrl,
      dueAt: active.dueAt,
    });

    appendActionLog(
      'info',
      'expedition',
      `Récupération des récompenses: ${active.title}`,
      { endpoint: claimForm.getAttribute('action') || claimForm.action }
    );

    const claimed = await submitObservedForm(
      claimForm,
      `Récompenses arrière-plan: ${active.title}`,
      {
        expectedKind: 'expedition_claim',
        navigate: false,
        moduleId: 'expeditions',
      }
    );

    if (!claimed) {
      setExpeditionPhase('due', {
        title: active.title,
        resultUrl: active.resultUrl,
        dueAt: active.dueAt,
      });
      return false;
    }

    const verified = await verifyBackgroundExpeditionClaim(active.resultUrl);
    if (verified) {
      setExpeditionPhase('ready_to_start', {
        title: null,
        resultUrl: null,
        dueAt: null,
      });
      return true;
    }

    setExpeditionPhase('claiming', {
      title: active.title,
      resultUrl: active.resultUrl,
      dueAt: active.dueAt,
    });
    return true;
  }

  // Tant que le formulaire de récupération existe, ne jamais considérer le
  // résultat comme terminé. Le fallback visible reste disponible si l'auto
  // claim est désactivé ou si le contrat change.
  setExpeditionPhase('due', {
    title: active.title,
    resultUrl: active.resultUrl,
    dueAt: active.dueAt,
  });
  return false;
}

async function verifyBackgroundExpeditionLaunch(expectedTitle) {
  const delays = [250, 700];

  for (const delay of delays) {
    if (delay) await sleep(delay);

    const page = await fetchObservedPage('/expeditions', {
      cacheMs: 0,
      force: true,
    });
    if (!page) continue;

    const active = detachedActiveExpeditionSnapshot(page.doc);
    if (!active) continue;

    mergeBackgroundExpeditionAccount(page.doc);

    const dueAt = active.dueAt || null;
    const phase = dueAt && dueAt <= now() + 1500 ? 'due' : 'running';

    state.selectedExpedition = active.title;
    state.selectedExpeditionScore = null;
    state.expeditionPlan = {
      ...state.expeditionPlan,
      title: active.title,
      viability: 'active',
      reason: 'Lancement confirmé par GET /expeditions',
      updatedAt: now(),
    };

    setExpeditionPhase(phase, {
      title: active.title,
      resultUrl: active.resultUrl,
      dueAt,
    });

    appendActionLog(
      'success',
      'expedition',
      `Lancement confirmé: ${active.title}`,
      {
        expected: expectedTitle,
        phase,
      }
    );
    saveState(state);
    return active;
  }

  appendActionLog(
    'warning',
    'expedition',
    `Lancement non confirmé: ${expectedTitle}`,
    'Aucune expédition active observée après le POST'
  );
  return null;
}

async function backgroundStartExpedition(expeditionPage) {
  if (!config.autoStartExpeditions || !expeditionPage?.doc) return false;

  const ranking = rankExpeditions(expeditionPage.doc);
  const selected = selectExpeditionFromRanking(ranking);
  if (!selected?.button) return false;

  const prepareUrl = selected.button.href || selected.button.getAttribute('href');
  if (!prepareUrl) return false;

  state.selectedExpedition = selected.title;
  state.selectedExpeditionScore = selected.score;
  saveState(state);

  const prepare = await fetchObservedPage(prepareUrl, {
    cacheMs: 0,
    force: true,
  });
  if (!prepare) return false;

  const requirement = expeditionTeamRequirement(prepare.doc);
  if (!requirement) return false;

  setExpeditionPhase('preparing', {
    title: selected.title,
    resultUrl: null,
    dueAt: null,
  });

  const assessment = preparationTeamPlan(requirement);

  state.expeditionPlan = {
    title: selected.title,
    team: assessment.plan.team.map(pokemon => pokemon.name),
    teamIds: assessment.plan.team.map(pokemon => pokemon.id),
    teamScore: assessment.plan.teamScore,
    viability: assessment.plan.known
      ? (assessment.plan.viable ? 'viable' : 'blocked')
      : 'unknown',
    reason: assessment.plan.reason,
    updatedAt: now(),
  };
  saveState(state);
  updatePanel();

  if (!assessment.plan.viable) {
    blockMissionTemporarily(selected.title, assessment.plan.reason);
    state.lastAction = `Mission écartée en arrière-plan: ${selected.title} — ${assessment.plan.reason}`;
    saveState(state);
    updatePanel();
    return false;
  }

  const plannedIds = assessment.plan.team.map(pokemon => pokemon.id);
  if (plannedIds.length < requirement.min) return false;

  setExpeditionPhase('starting', { title: selected.title });

  appendActionLog(
    'info',
    'expedition',
    `Tentative de lancement silencieux: ${selected.title}`,
    {
      team: assessment.plan.team.map(pokemon => pokemon.name),
      attempt: 1,
    }
  );

  const submitted = await submitObservedForm(
    requirement.form,
    `Lancement arrière-plan: ${selected.title}`,
    {
      expectedKind: 'expedition_launch',
      navigate: false,
      moduleId: 'expeditions',
      overrides: {
        selection_source: 'custom',
        'pokemon_public_ids[]': plannedIds,
      },
    }
  );

  if (submitted) {
    const active = await verifyBackgroundExpeditionLaunch(selected.title);
    if (active) return true;
  }

  appendActionLog(
    'warning',
    'expedition',
    `Nouvelle tentative silencieuse: ${selected.title}`,
    'Le premier POST n’a pas produit d’expédition active vérifiable'
  );

  const retryPrepare = await fetchObservedPage(prepareUrl, {
    cacheMs: 0,
    force: true,
  });

  if (retryPrepare) {
    const retryRequirement = expeditionTeamRequirement(retryPrepare.doc);

    if (retryRequirement) {
      const retryAssessment = preparationTeamPlan(retryRequirement);
      const retryIds = retryAssessment.plan.team.map(pokemon => pokemon.id);

      if (
        retryAssessment.plan.viable &&
        retryIds.length >= retryRequirement.min
      ) {
        appendActionLog(
          'info',
          'expedition',
          `Tentative de lancement silencieux: ${selected.title}`,
          {
            team: retryAssessment.plan.team.map(pokemon => pokemon.name),
            attempt: 2,
          }
        );

        const retried = await submitObservedForm(
          retryRequirement.form,
          `Relance arrière-plan: ${selected.title}`,
          {
            expectedKind: 'expedition_launch',
            navigate: false,
            moduleId: 'expeditions',
            overrides: {
              selection_source: 'custom',
              'pokemon_public_ids[]': retryIds,
            },
          }
        );

        if (retried) {
          const active = await verifyBackgroundExpeditionLaunch(selected.title);
          if (active) return true;
        }
      }
    }
  }

  appendActionLog(
    'error',
    'expedition',
    `Échec du lancement silencieux: ${selected.title}`,
    httpTransportState().lastError || 'Aucune expédition active après deux tentatives'
  );

  setExpeditionPhase('ready_to_start', {
    title: null,
    resultUrl: null,
    dueAt: null,
  });

  return false;
}

async function backgroundHandleLeague() {
  if (!config.autoGyms) return false;

  const page = await fetchObservedPage('/league', { cacheMs: 6000 });
  if (!page) return false;

  const info = detachedLeagueInfo(page.doc);
  mergeBackgroundLeagueAccount(page.doc, info);

  const today = localDayKey();
  const currentGym = gymCycle();

  if (
    currentGym.completedDay === today ||
    currentGym.challengeSubmittedDay === today
  ) {
    setGymCycle('done', {
      checkedDay: today,
      availableToday: false,
      badges: info.badges,
      totalBadges: info.totalBadges,
      completedDay: today,
      reason: 'Combat d’arène déjà tenté aujourd’hui',
    });
    return false;
  }

  if (info.dailyAvailable === false) {
    setGymCycle('done', {
      checkedDay: today,
      availableToday: false,
      badges: info.badges,
      totalBadges: info.totalBadges,
      reason: 'Combat du jour déjà utilisé ou indisponible',
    });
    return false;
  }

  if (!info.gym) {
    setGymCycle('blocked', {
      checkedDay: today,
      availableToday: info.dailyAvailable,
      badges: info.badges,
      totalBadges: info.totalBadges,
      reason: info.dailyAvailable === true
        ? 'Combat disponible, mais aucune arène débloquée'
        : 'Aucune arène disponible actuellement',
      blockedUntil: now() + config.gymRetryMinutes * 60 * 1000,
    });
    return false;
  }

  setGymCycle('available', {
    checkedDay: today,
    availableToday: true,
    badges: info.badges,
    totalBadges: info.totalBadges,
    arena: info.gym.arena,
    champion: info.gym.champion,
    badge: info.gym.badge,
    requiredTeamSize: info.gym.teamSize,
    reason: `${info.gym.badge || 'Badge'} · équipe de ${info.gym.teamSize || '?'}`,
    blockedUntil: 0,
  });

  const prepare = await fetchObservedPage(info.gym.prepareUrl, {
    cacheMs: 0,
    force: true,
  });
  if (!prepare) return false;

  const form = prepare.doc.querySelector(
    'form[data-team-builder][action*="/gyms/"][action$="/challenge"]'
  );
  const requirement = teamRequirementFromForm(form);
  if (!requirement) return false;

  const assessment = gymTeamPlan(requirement);
  if (!assessment.plan.viable) return false;

  const plannedIds = assessment.plan.team.map(pokemon => pokemon.id);
  if (plannedIds.length < requirement.min) return false;

  state.gymCycle = {
    ...gymCycle(),
    phase: 'challenging',
    selectedTeam: assessment.plan.team.map(pokemon => pokemon.name),
    teamScore: assessment.plan.teamScore,
    reason: `Défi arrière-plan avec ${assessment.plan.team.map(pokemon => pokemon.name).join(', ')}`,
    lastChallengeAt: now(),
    challengeSubmittedDay: today,
  };
  saveState(state);
  updatePanel();

  const submitted = await submitObservedForm(
    form,
    `Arène arrière-plan: défier ${assessment.context?.champion || assessment.context?.title || 'le Champion'}`,
    {
      expectedKind: 'gym_challenge',
      navigate: false,
      moduleId: 'progression',
      overrides: {
        selection_source: 'custom',
        'pokemon_public_ids[]': plannedIds,
      },
    }
  );

  if (!submitted) {
    state.gymCycle = {
      ...gymCycle(),
      phase: 'blocked',
      challengeSubmittedDay: null,
      reason: httpTransportState().lastError || 'Défi arrière-plan non soumis',
    };
    saveState(state);
    updatePanel();
  }

  return submitted;
}

function backgroundEvolutionCandyGoal(evolutions) {
  if (evolutions.length !== 1) return null;

  const evolution = evolutions[0];
  const candy = evolution.requirements.find(requirement =>
    normalizeText(requirement.label).includes('bonbon')
  );
  const otherMissing = evolution.requirements.some(requirement =>
    requirement.missing &&
    !normalizeText(requirement.label).includes('bonbon')
  );

  if (!candy || otherMissing || !candy.missing) return null;

  return {
    target: evolution.target,
    required: candy.required,
    available: candy.available,
  };
}

async function backgroundHandlePokemonProgression({ allowExpeditionFallback = false } = {}) {
  if (!config.autoLevelPokemon && !config.autoEvolvePokemon) return false;
  if (
    !allowExpeditionFallback &&
    expeditionHasPriorityOverPokemonProgression()
  ) {
    setPokemonProgression({
      phase: 'waiting_expedition',
      action: 'wait',
      reason: expeditionCycle().phase === 'running'
        ? `Attente de la fin de ${expeditionCycle().title || 'l’expédition'} avant d’investir des ressources`
        : 'Priorité au prochain cycle d’expédition avant tout investissement Pokémon',
    });
    return false;
  }

  const collection = await fetchObservedPage('/collection', { cacheMs: 12000 });
  if (!collection) return false;

  const records = collectionPokemonRecords(collection.doc, collection.url);
  if (!records.length) return false;

  const progress = pokemonProgressionState();
  const scanExpired =
    !progress.scanStartedAt ||
    now() - progress.scanStartedAt > config.pokemonProgressionScanMinutes * 60 * 1000;

  if (scanExpired) resetPokemonProgressionScan();

  const scanned = new Set(pokemonProgressionState().scannedIds || []);
  const candidates = pokemonProgressionPriorityRecords(records)
    .filter(record => !scanned.has(record.id))
    .slice(0, 3);

  if (!candidates.length) {
    setPokemonProgression({
      phase: 'idle',
      targetId: null,
      targetName: null,
      targetLevel: null,
      action: null,
      reason: 'Analyse arrière-plan terminée · aucun investissement sûr',
      scannedIds: [],
      lastScanAt: now(),
      blockedUntil: now() + config.pokemonProgressionScanMinutes * 60 * 1000,
    });
    return false;
  }

  for (const target of candidates) {
    setPokemonProgression({
      phase: 'opening_profile',
      targetId: target.id,
      targetName: target.name,
      targetLevel: target.level,
      action: 'inspect',
      reason: `Inspection arrière-plan de ${target.name}`,
    });

    const profile = await fetchObservedPage(target.href, {
      cacheMs: 0,
      force: true,
    });
    if (!profile) continue;

    const context = pokemonProfileContext(profile.doc, profile.url);
    if (!context) continue;

    if (context.inActivity) {
      markPokemonScanned(context.id, {
        phase: 'blocked',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'skip',
        reason: `${context.name} participe actuellement à une activité`,
      });
      continue;
    }

    const evolutions = pokemonEvolutionOptions(profile.doc);
    const affordable = evolutions.filter(option => option.available);

    if (
      config.autoEvolvePokemon &&
      evolutions.length === 1 &&
      affordable.length === 1
    ) {
      const evolution = affordable[0];
      setPokemonProgression({
        phase: 'evolving',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'evolve',
        reason: evolution.reason,
        lastEvolutionAt: now(),
      });

      const submitted = await submitObservedForm(
        evolution.form,
        `Évolution arrière-plan: ${context.name} → ${evolution.target || 'évolution'}`,
        {
          expectedKind: 'pokemon_evolve',
          navigate: false,
          moduleId: 'pokemon',
        }
      );

      if (submitted) {
        markPokemonScanned(context.id, {
          phase: 'scanned',
          targetId: context.id,
          targetName: context.name,
          targetLevel: context.level,
          action: 'evolve_done',
          reason: `Évolution effectuée vers ${evolution.target || 'la forme suivante'} · priorité rendue aux expéditions`,
          lastEvolutionAt: now(),
        });
        return true;
      }
      continue;
    }

    if (config.autoEvolvePokemon && evolutions.length > 1) {
      markPokemonScanned(context.id, {
        phase: 'manual',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'manual_evolution',
        reason: 'Plusieurs évolutions possibles · choix manuel conservé',
      });
      continue;
    }

    const level = pokemonLevelUpOption(profile.doc);
    const evolutionCandyGoal = backgroundEvolutionCandyGoal(evolutions);
    const preserveCandy =
      config.preserveEvolutionCandies &&
      evolutionCandyGoal &&
      Number(level.candy?.required || 0) > 0;

    if (config.autoLevelPokemon && level.available && !preserveCandy) {
      setPokemonProgression({
        phase: 'leveling',
        targetId: context.id,
        targetName: context.name,
        targetLevel: level.targetLevel,
        action: 'level_up',
        reason: level.reason,
        lastUpgradeAt: now(),
      });

      const submitted = await submitObservedForm(
        level.form,
        `Renforcement arrière-plan: ${context.name} → niveau ${level.targetLevel}`,
        {
          expectedKind: 'pokemon_level_up',
          navigate: false,
          moduleId: 'pokemon',
        }
      );

      if (submitted) {
        markPokemonScanned(context.id, {
          phase: 'scanned',
          targetId: context.id,
          targetName: context.name,
          targetLevel: level.targetLevel,
          action: 'level_up_done',
          reason: `Renforcement vers le niveau ${level.targetLevel} effectué · priorité rendue aux expéditions`,
          lastUpgradeAt: now(),
        });
        return true;
      }
      continue;
    }

    markPokemonScanned(context.id, {
      phase: 'scanned',
      targetId: context.id,
      targetName: context.name,
      targetLevel: context.level,
      action: 'none',
      reason: preserveCandy
        ? `Bonbons réservés pour ${evolutionCandyGoal.target || 'l’évolution'}`
        : level.reason || 'Aucune progression sûre disponible',
    });
  }

  return false;
}

async function runBackgroundAutomation() {
  if (!config.backgroundHttpMode) return false;
  if (!backgroundSweepDue()) return false;

  backgroundMarkSweep();

  let expeditionObservation = await backgroundObserveExpeditions();

  if (
    expeditionObservation.active &&
    expeditionCycle().phase === 'due'
  ) {
    const resultAction = await backgroundHandleExpeditionResult(
      expeditionObservation.active
    );
    if (resultAction) return true;

    if (expeditionCycle().phase === 'ready_to_start') {
      expeditionObservation = await backgroundObserveExpeditions({
        force: true,
      });
    }
  }

  const leaguePage = await fetchObservedPage('/league', { cacheMs: 6000 });
  if (leaguePage) {
    const info = detachedLeagueInfo(leaguePage.doc);
    mergeBackgroundLeagueAccount(leaguePage.doc, info);
  }

  // Recalculer le Goal Planner avec les informations fraîchement récupérées.
  const plan = refreshGoalPlan(accountSnapshot());

  if (plan.step?.module === 'progression') {
    const gymAction = await backgroundHandleLeague();
    if (gymAction) return true;

    const refreshedAfterGym = refreshGoalPlan(accountSnapshot());
    if (
      refreshedAfterGym.step?.module === 'healing' ||
      gymCycle().needsHealing
    ) {
      return false;
    }
  }

  if (
    plan.step?.module === 'expeditions' &&
    !expeditionObservation.active
  ) {
    const expeditionAction = await backgroundStartExpedition(expeditionObservation.page);
    if (expeditionAction) return true;
  }

  if (plan.step?.module === 'pokemon') {
    const pokemonAction = await backgroundHandlePokemonProgression();
    if (pokemonAction) return true;
  }

  // Entretien opportuniste, sans navigation visible.
  if (!expeditionObservation.active) {
    const expeditionAction = await backgroundStartExpedition(expeditionObservation.page);
    if (expeditionAction) return true;
  }

  if (leagueNeedsDailyCheck()) {
    const gymAction = await backgroundHandleLeague();
    if (gymAction) return true;
  }

  const expeditionNeedsTeamHelp =
    !expeditionObservation.active &&
    state.expeditionPlan?.viability === 'blocked';

  if (
    expeditionNeedsTeamHelp &&
    pokemonProgressionScanDue({ allowExpeditionFallback: true })
  ) {
    const pokemonAction = await backgroundHandlePokemonProgression({
      allowExpeditionFallback: true,
    });
    if (pokemonAction) return true;
  }

  return false;
}

// ---- src/core/navigation.js ----
function moduleEnabled(moduleId) {
    const rules = {
      expeditions: config.autoClaimExpeditions || config.autoStartExpeditions,
      healing: config.autoHeal,
      greenhouse: config.autoHarvest || config.autoPlant,
      incubator: config.autoIncubatorClaim,
      breeding: config.autoBreedingClaim,
      progression: config.autoProgression || config.autoGyms,
      pokemon: config.autoLevelPokemon || config.autoEvolvePokemon,
    };
    return Boolean(rules[moduleId]);
  }

  function moduleFromLocation() {
    const haystack = normalizeText(location.pathname + ' ' + location.search);
    return MODULES.find(module =>
      module.keywords.some(keyword => haystack.includes(normalizeText(keyword)))
    ) || null;
  }

  function parseCountdownMs(text) {
    const normalized = normalizeText(text);

    // Format de compte à rebours explicite : HH:MM:SS ou MM:SS.
    const clock = normalized.match(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/);
    if (clock) {
      const first = Number(clock[1]);
      const second = Number(clock[2]);
      const third = clock[3] == null ? null : Number(clock[3]);
      const seconds = third == null
        ? first * 60 + second
        : first * 3600 + second * 60 + third;
      if (seconds > 0) return seconds * 1000;
    }

    let seconds = 0;
    let found = false;
    const hours = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:h|heure|heures|hour|hours)\b/);
    const minutes = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:min|minute|minutes)\b/);
    const secs = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:s|sec|seconde|secondes|second|seconds)\b/);
    if (hours) { seconds += (parseNumber(hours[1]) || 0) * 3600; found = true; }
    if (minutes) { seconds += (parseNumber(minutes[1]) || 0) * 60; found = true; }
    if (secs) { seconds += parseNumber(secs[1]) || 0; found = true; }
    return found && seconds > 0 ? seconds * 1000 : null;
  }

  function parseAbsoluteEndClockMs(text) {
    const normalized = normalizeText(text);
    const match = normalized.match(/(?:termine|terminee|fin|retour|revient|ends?|returns?|ready|pret|prete)[^\d]{0,24}(?:a|at)\s*(\d{1,2}):(\d{2})(?::(\d{2}))?/i);
    if (!match) return null;

    const target = new Date();
    target.setHours(Number(match[1]), Number(match[2]), Number(match[3] || 0), 0);
    if (target.getTime() <= now()) target.setDate(target.getDate() + 1);

    const delta = target.getTime() - now();
    return delta > 0 && delta <= 48 * 60 * 60 * 1000 ? delta : null;
  }

  function parseTimestampValue(value) {
    if (value == null || value === '') return null;
    const raw = String(value).trim();

    if (/^\d{10,13}$/.test(raw)) {
      const numeric = Number(raw);
      const timestamp = raw.length === 10 ? numeric * 1000 : numeric;
      const delta = timestamp - now();
      return delta > 0 && delta <= 7 * 24 * 60 * 60 * 1000 ? delta : null;
    }

    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) {
      const delta = parsed - now();
      return delta > 0 && delta <= 7 * 24 * 60 * 60 * 1000 ? delta : null;
    }

    return null;
  }

  function timerDataAttributeMs(element) {
    const names = [
      'datetime',
      'data-end',
      'data-end-at',
      'data-end-time',
      'data-ends-at',
      'data-expires-at',
      'data-finish-at',
      'data-finished-at',
      'data-complete-at',
    ];

    for (const name of names) {
      const value = element.getAttribute?.(name);
      const delta = parseTimestampValue(value);
      if (delta) return { ms: delta, source: `${name}=${value}` };
    }

    return null;
  }

  function extractLabeledCountdownText(text) {
    const normalized = normalizeText(text);
    const labels = [
      'temps restant',
      'time remaining',
      'remaining',
      'retour dans',
      'revient dans',
      'returns in',
      'se termine dans',
      'termine dans',
      'fin dans',
      'ends in',
      'fini dans',
      'pret dans',
      'prete dans',
      'ready in',
      'recolte dans',
      'harvest in',
      'eclosion dans',
      'hatch in',
    ];

    for (const label of labels) {
      const index = normalized.indexOf(label);
      if (index === -1) continue;
      return normalized.slice(index, index + 120);
    }

    return null;
  }

  function activeTimerContext(text, moduleId) {
    const normalized = normalizeText(text);

    // Une durée de route comme "Durée 30 min" n'est PAS un compte à rebours.
    if (
      moduleId === 'expeditions' &&
      /(?:^|\s)(?:duree|duration)\s*[:\-]?\s*\d/.test(normalized) &&
      !/(?:en cours|in progress|temps restant|remaining|retour dans|returns in|se termine|ends in)/.test(normalized)
    ) {
      return false;
    }

    const common = /temps restant|time remaining|remaining|retour dans|revient dans|returns in|se termine dans|termine dans|fin dans|ends in|pret dans|prete dans|ready in/;
    if (common.test(normalized)) return true;

    if (moduleId === 'expeditions') {
      return /expedition en cours|exploration en cours|expedition active|in progress expedition|active expedition/.test(normalized);
    }

    if (moduleId === 'greenhouse') {
      return /recolte dans|harvest in|pousse|growing|culture en cours|plantation en cours/.test(normalized);
    }

    if (moduleId === 'incubator') {
      return /incubation en cours|eclosion dans|hatch in|fossile en cours|restauration en cours/.test(normalized);
    }

    if (moduleId === 'breeding') {
      return /pension en cours|elevage en cours|breeding|oeuf dans|egg in/.test(normalized);
    }

    return false;
  }

  function findModuleCountdown(module) {
    const root = document.querySelector('main, [role="main"], #content, .content') || document.body;
    if (!root) return null;

    // 1) Timers spécifiques au module. PokéTaka expose par exemple les expéditions
    // avec <time data-countdown data-countdown-format="expedition" datetime="...">.
    // On les traite avant tout timer générique pour ne jamais confondre avec
    // l'horloge "Heure en jeu".
    const prioritySelectors = {
      expeditions: [
        'time[data-countdown][data-countdown-format="expedition"]',
        '.mission-slot-card--occupied time[data-countdown]',
        '.mission-slot-card__progress time[data-countdown]',
        'progress[data-mission-progress][data-progress-end]',
      ],
      greenhouse: [
        'time[data-countdown][data-countdown-format*="greenhouse"]',
        '[data-greenhouse] time[data-countdown]',
        '[class*="greenhouse"] time[data-countdown]',
      ],
      incubator: [
        'time[data-countdown][data-countdown-format*="egg"]',
        'time[data-countdown][data-countdown-format*="incubat"]',
        '[class*="incubat"] time[data-countdown]',
      ],
      breeding: [
        'time[data-countdown][data-countdown-format*="breed"]',
        '[class*="breeding"] time[data-countdown]',
        '[class*="daycare"] time[data-countdown]',
      ],
    };

    const priority = [...root.querySelectorAll((prioritySelectors[module.id] || []).join(','))]
      .filter(isVisible)
      .filter(el => !el.closest('#pta-panel'));

    for (const element of priority) {
      // Pour la barre de progression d'expédition, la fin est exposée directement.
      const progressEnd = element.getAttribute?.('data-progress-end');
      const progressDelta = parseTimestampValue(progressEnd);
      if (progressDelta) {
        return {
          ms: progressDelta,
          source: 'data-progress-end',
          text: progressEnd,
        };
      }

      const fromAttribute = timerDataAttributeMs(element);
      if (fromAttribute) {
        return {
          ms: fromAttribute.ms,
          source: `timer ${module.id} structuré`,
          text: fromAttribute.source,
        };
      }

      const text = normalizeText(element.textContent || element.getAttribute('aria-label') || '');
      const countdown = parseCountdownMs(text);
      if (countdown) {
        return {
          ms: countdown,
          source: `timer ${module.id} visible`,
          text,
        };
      }
    }

    // 2) Sources structurées génériques, en excluant explicitement les horloges
    // décoratives / heure en jeu.
    const structured = [...root.querySelectorAll([
      'time[datetime]',
      '[data-countdown]',
      '[data-timer]',
      '[data-remaining]',
      '[data-end]',
      '[data-end-at]',
      '[data-end-time]',
      '[data-ends-at]',
      '[data-expires-at]',
      '[data-finish-at]',
      '[data-finished-at]',
      '[data-complete-at]',
      '[class*="countdown"]',
      '[class*="timer"]',
      '[id*="countdown"]',
      '[id*="timer"]',
    ].join(','))]
      .filter(isVisible)
      .filter(el => !el.closest('#pta-panel'))
      .filter(el => !el.matches('[data-day-night-time], [data-day-night-clock], .day-night-clock, .day-night-clock *'))
      .filter(el => !el.closest('[data-day-night-clock], .day-night-clock'));

    for (const element of structured) {
      const fromAttribute = timerDataAttributeMs(element);
      if (fromAttribute) {
        return {
          ms: fromAttribute.ms,
          source: 'attribut structuré générique',
          text: fromAttribute.source,
        };
      }

      const text = normalizeText(element.textContent || element.getAttribute('aria-label') || '');
      if (!text) continue;

      const absolute = parseAbsoluteEndClockMs(text);
      if (absolute) return { ms: absolute, source: 'timer structuré (heure de fin)', text };

      // Un simple HH:MM n'est accepté ici que dans un contexte de compte à rebours.
      if (!activeTimerContext(text, module.id)) continue;
      const countdown = parseCountdownMs(text);
      if (countdown) return { ms: countdown, source: 'timer structuré contextuel', text };
    }

    // 2) Texte contextuel : on ne considère un nombre comme timer que s'il est
    // relié explicitement à une action en cours.
    const candidates = [...root.querySelectorAll(
      'p, span, small, strong, li, div, article, section, [class*="status"], [class*="progress"]'
    )]
      .filter(isVisible)
      .filter(el => !el.closest('#pta-panel'))
      .map(el => ({
        element: el,
        text: normalizeText(el.innerText || el.textContent || ''),
      }))
      .filter(item => item.text && item.text.length <= 600)
      .filter(item => activeTimerContext(item.text, module.id))
      .sort((a, b) => a.text.length - b.text.length);

    for (const candidate of candidates) {
      const absolute = parseAbsoluteEndClockMs(candidate.text);
      if (absolute) {
        return {
          ms: absolute,
          source: 'texte contextuel (heure de fin)',
          text: candidate.text.slice(0, 160),
        };
      }

      const labeled = extractLabeledCountdownText(candidate.text);
      const countdown = parseCountdownMs(labeled || candidate.text);
      if (countdown) {
        return {
          ms: countdown,
          source: labeled ? 'texte avec libellé' : 'bloc actif',
          text: (labeled || candidate.text).slice(0, 160),
        };
      }
    }

    return null;
  }

  function modulePageText() {
    const main = document.querySelector('main, [role="main"], #content, .content');
    return normalizeText((main || document.body)?.innerText || '');
  }

  function recordCurrentModuleStatus() {
    const current = moduleFromLocation();
    if (!current) return;

    const timerInfo = findModuleCountdown(current);
    const previous = state.moduleStatus?.[current.id] || {};
    const previousDueAt = previous.nextDueAt || null;
    const nextDueAt = timerInfo ? now() + timerInfo.ms : null;

    state.moduleStatus = {
      ...(state.moduleStatus || {}),
      [current.id]: {
        ...previous,
        lastVisitedAt: now(),
        nextDueAt,
        timerSource: timerInfo?.source || null,
        timerText: timerInfo?.text || null,
        lastTimerSeenAt: timerInfo ? now() : previous.lastTimerSeenAt || null,
      },
    };
    saveState(state);

    if (config.debug) {
      if (timerInfo) {
        const changed = !previousDueAt || Math.abs(previousDueAt - nextDueAt) > 5000;
        if (changed) {
          log(`Timer ${current.id} détecté:`, {
            remaining: formatRemaining(nextDueAt),
            source: timerInfo.source,
            text: timerInfo.text,
          });
        }
      } else if (current.id === 'expeditions') {
        log('Timer expédition: aucun compte à rebours actif détecté (les durées statiques sont ignorées).');
      }
    }
  }

  function markModuleAction(moduleId) {
    if (!moduleId) return;
    const previous = state.moduleStatus?.[moduleId] || {};
    state.moduleStatus = {
      ...(state.moduleStatus || {}),
      [moduleId]: {
        ...previous,
        lastActionAt: now(),
      },
    };
    saveState(state);
  }

  function navLinkForModule(module) {
    return [...document.querySelectorAll('a[href]')]
      .filter(isVisible)
      .filter(a => {
        try {
          const url = new URL(a.href, location.href);
          if (url.origin !== location.origin || url.pathname === location.pathname) return false;
          const haystack = normalizeText(`${elementText(a)} ${url.pathname}`);
          return module.keywords.some(keyword => haystack.includes(normalizeText(keyword)));
        } catch {
          return false;
        }
      })[0] || null;
  }

  function linkHasReadySignal(anchor) {
    if (!anchor) return false;
    const text = elementText(anchor);
    if (/\b(pret|prete|ready|termine|terminee|finished|complete|recolter|harvest|reclamer|claim)\b/.test(text)) {
      return true;
    }

    const badges = [...anchor.querySelectorAll(
      '.badge, [class*="badge"], [class*="counter"], [class*="notification"], [aria-label*="notification"]'
    )].filter(isVisible);

    return badges.some(badge => {
      const value = normalizeText(badge.textContent || badge.getAttribute('aria-label') || '');
      const number = parseInt(value, 10);
      return value.includes('!') || (Number.isFinite(number) && number > 0);
    });
  }

  function pageIndicatesHealingNeeded() {
    const text = modulePageText();
    return /\bko\b|hors combat|fainted|0\s*\/\s*\d+\s*(?:pv|hp)/i.test(text);
  }

  function navigationCandidates() {
    const current = moduleFromLocation();
    const timestamp = now();

    return MODULES
      .filter(module => moduleEnabled(module.id))
      .filter(module => module.id !== current?.id)
      .filter(module => {
        if (!config.backgroundHttpMode) return true;

        if (
          module.id === 'progression' &&
          backgroundRouteFresh('/league')
        ) {
          return false;
        }

        if (
          module.id === 'pokemon' &&
          backgroundRouteFresh('/collection')
        ) {
          return false;
        }

        if (
          module.id === 'expeditions' &&
          expeditionCycle().phase !== 'due' &&
          backgroundRouteFresh('/expeditions')
        ) {
          return false;
        }

        return true;
      })
      .map(module => {
        const anchor = navLinkForModule(module);
        if (!anchor) return null;

        const status = state.moduleStatus?.[module.id] || {};
        let score = 0;
        const reasons = [];

        const goalBonus = goalModulePriorityBonus(module.id);
        if (goalBonus > 0) {
          score += goalBonus;
          reasons.push(`objectif global: ${currentGoalPlan().step?.title || currentGoalPlan().primary?.title || module.label}`);
        }

        if (linkHasReadySignal(anchor)) {
          score += 1000;
          reasons.push('indicateur prêt dans la navigation');
        }

        if (status.nextDueAt && timestamp >= status.nextDueAt) {
          const overdueMinutes = Math.floor((timestamp - status.nextDueAt) / 60000);
          score += 900 + Math.min(100, overdueMinutes);
          reasons.push('timer mémorisé arrivé à échéance');
        }

        if (module.id === 'healing' && pageIndicatesHealingNeeded()) {
          score += 950;
          reasons.push('équipe détectée KO/blessée');
        }

        if (
          module.id === 'healing' &&
          config.autoGyms &&
          gymCycle().needsHealing
        ) {
          score += 1250;
          reasons.push('soins nécessaires avant le combat d’arène');
        }

        if (module.id === 'progression' && config.autoGyms && leagueNeedsDailyCheck()) {
          const gymReason = leagueAttentionReason();
          const knownAvailable = gymCycle().availableToday === true;
          score += knownAvailable ? 1300 : 520;
          reasons.push(gymReason || 'vérification quotidienne des arènes');
        }

        if (module.id === 'pokemon' && pokemonProgressionScanDue()) {
          score += 760;
          reasons.push('analyse renforcement/évolution disponible');
        }

        const expeditionState = expeditionCycle();
        if (
          module.id === 'expeditions' &&
          ['due', 'ready_to_start'].includes(expeditionState.phase)
        ) {
          score += 1200;
          reasons.push(
            expeditionState.phase === 'due'
              ? 'résultat d’expédition à récupérer'
              : 'nouvelle expédition à lancer'
          );
        }

        return score > 0 ? { module, anchor, score, reasons } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  async function navigateWhenNeeded() {
    // Évite les rebonds de navigation après un changement de page.
    if (now() - (state.lastNavigationAt || 0) < 8000) return false;

    const candidates = navigationCandidates();
    if (!candidates.length) {
      log('Navigation: aucune autre page nécessaire.');
      return false;
    }

    const target = candidates[0];
    state.lastNavigationAt = now();
    saveState(state);
    log('Navigation nécessaire:', target.module.id, target.reasons);
    return clickElement(target.anchor, `Navigation nécessaire: ${target.module.label}`);
  }

  function orchestratorPlan() {
    const plan = [];
    const expeditionState = expeditionCycle();
    const navigation = navigationCandidates()[0] || null;

    if (config.backgroundHttpMode && backgroundSweepDue()) {
      plan.push({
        name: 'background-http',
        priority: 8850,
        reason: 'observation GET silencieuse et actions POST directes',
        run: runBackgroundAutomation,
      });
    }

    if (recentBotAction() && findClickable(
      ['confirmer', 'confirm', 'oui', 'yes', 'valider'],
      document,
      { exclude: ['annuler', 'cancel'] }
    )) {
      plan.push({
        name: 'confirmation',
        priority: 10000,
        reason: 'confirmation d’une action du bot',
        run: handleConfirmation,
      });
    }

    const pokemonFallbackNeeded =
      state.expeditionPlan?.viability === 'blocked';

    if (
      (config.autoLevelPokemon || config.autoEvolvePokemon) &&
      (isCollectionIndexPage() || isPokemonProfilePage()) &&
      (
        !expeditionHasPriorityOverPokemonProgression() ||
        pokemonFallbackNeeded
      ) &&
      (
        pokemonProgressionScanDue({
          allowExpeditionFallback: pokemonFallbackNeeded,
        }) ||
        (
          pokemonFallbackNeeded &&
          ['scanning', 'opening_profile', 'level_ready', 'evolution_ready', 'scanned', 'blocked', 'manual'].includes(
            pokemonProgressionState().phase
          )
        )
      )
    ) {
      plan.push({
        name: 'pokemon-progression',
        priority: 6750,
        reason: pokemonProgressionState().reason || 'progression Pokémon intelligente',
        run: () => handlePokemonProgression({
          allowExpeditionFallback: pokemonFallbackNeeded,
        }),
      });
    }

    if (
      config.autoGyms &&
      (isLeagueIndexPage() || isGymPreparePage() || isGymResultLikePage())
    ) {
      let priority = 8350;
      let reason = 'vérification du Circuit des Arènes';

      if (isGymPreparePage()) {
        priority = 9350;
        reason = 'composition et lancement du combat d’arène';
      } else if (isGymResultLikePage()) {
        priority = 9200;
        reason = 'résultat d’arène à clôturer';
      } else if (leagueDailyStatus() === true && availableGymContext()) {
        priority = 8500;
        reason = 'combat d’arène du jour disponible';
      }

      plan.push({
        name: 'gym',
        priority,
        reason,
        run: handleLeagueAutomation,
      });
    }

    const backgroundExpeditionOwnsCycle =
      config.backgroundHttpMode &&
      backgroundRouteFresh('/expeditions') &&
      !backgroundHttpState().lastError &&
      state.captureDecision?.action !== 'manual';

    if (
      !backgroundExpeditionOwnsCycle &&
      (
        isExpeditionResultPage() ||
        isExpeditionPreparePage() ||
        isExpeditionIndexPage() ||
        ['due', 'ready_to_start', 'preparing', 'starting'].includes(expeditionState.phase)
      )
    ) {
      let priority = 7200;
      let reason = 'cycle expédition';

      if (isExpeditionResultPage() || expeditionState.phase === 'due') {
        priority = 9600;
        reason = 'résultat ou récompense d’expédition prioritaire';
      } else if (isExpeditionPreparePage()) {
        priority = 9000;
        reason = 'composition/lancement d’équipe en cours';
      } else if (expeditionState.phase === 'ready_to_start') {
        priority = 8200;
        reason = 'emplacement libre à utiliser';
      }

      plan.push({
        name: 'expedition',
        priority,
        reason,
        run: handleExpeditionCycle,
      });
    }

    plan.push(
      {
        name: 'heal',
        priority: 7800,
        reason: 'soigner avant de poursuivre les activités',
        run: healTeam,
      },
      {
        name: 'incubator',
        priority: 7400,
        reason: 'récupération incubateur disponible',
        run: claimIncubator,
      },
      {
        name: 'breeding',
        priority: 7300,
        reason: 'récupération pension disponible',
        run: claimBreeding,
      },
      {
        name: 'greenhouse-harvest',
        priority: 7100,
        reason: 'récolte prête',
        run: harvestGreenhouse,
      },
      {
        name: 'progression',
        priority: 5600,
        reason: 'action explicite de progression disponible',
        run: autoProgression,
      },
      {
        name: 'greenhouse-plant',
        priority: 3500,
        reason: 'replantation optionnelle',
        run: plantGreenhouse,
      },
    );

    if (navigation) {
      plan.push({
        name: `navigation:${navigation.module.id}`,
        priority: 5000 + navigation.score,
        reason: navigation.reasons.join(', '),
        run: navigateWhenNeeded,
      });
    }

    return plan
      .map(candidate => {
        const goalBonus = candidate.name.startsWith('navigation:')
          ? 0
          : goalCandidatePriorityBonus(candidate.name);

        if (!goalBonus) return candidate;

        return {
          ...candidate,
          priority: candidate.priority + goalBonus,
          reason: `${candidate.reason}, objectif: ${currentGoalPlan().step?.title || currentGoalPlan().primary?.title}`,
        };
      })
      .sort((a, b) => b.priority - a.priority);
  }

  function recordOrchestratorDecision(candidate) {
    state.orchestrator = {
      lastDecision: candidate?.name || 'wait',
      lastReason: candidate?.reason || 'aucune action nécessaire',
      lastPriority: candidate?.priority || 0,
    };
    if (candidate) {
      appendActionLog(
        'success',
        'orchestrator',
        `Action exécutée: ${candidate.name}`,
        { priority: candidate.priority, reason: candidate.reason }
      );
    }
    saveState(state);
    updatePanel();
  }

  async function cycle(force = false) {
    if ((!config.enabled && !force) || running) return;
    running = true;

    try {
      if (location.pathname === '/' || location.pathname.includes('/login')) {
        log('Page publique/login détectée : aucune automatisation.');
        return;
      }

      recordCurrentModuleStatus();
      const snapshot = observeAccountSnapshot();
      const goal = refreshGoalPlan(snapshot);
      log('Goal Planner:', goal.primary?.title, '→', goal.step?.title);

      const plan = orchestratorPlan();

      for (const candidate of plan) {
        try {
          const acted = await candidate.run();
          if (acted) {
            recordOrchestratorDecision(candidate);
            log('Orchestrateur:', candidate.name, candidate.priority, candidate.reason);
            return;
          }
        } catch (error) {
          appendActionLog(
            'error',
            'orchestrator',
            `Erreur: ${candidate.name}`,
            error?.message || String(error)
          );
          console.error('[PokéTaka Auto] Erreur orchestrateur', candidate.name, error);
        }
      }

      recordOrchestratorDecision(null);
      state.lastAction = 'En attente — aucune action nécessaire';
      saveState(state);
      updatePanel();
    } finally {
      running = false;
      schedule();
    }
  }

  function schedule() {
    clearTimeout(timer);
    if (!config.enabled) return;
    const jitter = Math.floor(Math.random() * Math.max(0, config.jitterMs));
    timer = setTimeout(cycle, config.intervalMs + jitter);
  }

  function setEnabled(value) {
    config.enabled = Boolean(value);
    saveConfig(config);
    updatePanel();
    if (config.enabled) cycle();
    else clearTimeout(timer);
  }

  function toggleOption(key) {
    config[key] = !config[key];
    saveConfig(config);
    updatePanel();
  }

// ---- src/ui/panel.js ----
GM_addStyle(`
    #pta-panel {
      --pta-bg: rgba(8, 13, 24, .965);
      --pta-surface: rgba(255,255,255,.048);
      --pta-surface-strong: rgba(255,255,255,.075);
      --pta-border: rgba(255,255,255,.09);
      --pta-border-strong: rgba(255,255,255,.16);
      --pta-text: #f8fafc;
      --pta-muted: #94a3b8;
      --pta-faint: #64748b;
      --pta-green: #22c55e;
      --pta-green-soft: rgba(34,197,94,.12);
      --pta-amber: #f59e0b;
      --pta-amber-soft: rgba(245,158,11,.12);
      --pta-red: #ef4444;
      --pta-red-soft: rgba(239,68,68,.12);
      --pta-blue: #60a5fa;
      --pta-blue-soft: rgba(96,165,250,.12);
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      width: min(382px, calc(100vw - 24px));
      max-height: min(760px, calc(100vh - 36px));
      overflow: hidden;
      border-radius: 20px;
      background: var(--pta-bg);
      color: var(--pta-text);
      font: 13px/1.42 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 24px 80px rgba(0,0,0,.48), 0 0 0 1px rgba(255,255,255,.025) inset;
      border: 1px solid var(--pta-border-strong);
      backdrop-filter: blur(20px) saturate(1.15);
      -webkit-backdrop-filter: blur(20px) saturate(1.15);
    }
    #pta-panel * { box-sizing: border-box; }
    #pta-panel button, #pta-panel summary { font: inherit; }
    #pta-panel button { -webkit-tap-highlight-color: transparent; }
    #pta-panel button:focus-visible, #pta-panel summary:focus-visible {
      outline: 2px solid var(--pta-blue);
      outline-offset: 2px;
    }

    #pta-panel .pta-header {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 13px 14px 12px;
      border-bottom: 1px solid var(--pta-border);
      background: linear-gradient(180deg, rgba(255,255,255,.035), transparent);
    }
    #pta-panel .pta-brand { min-width: 0; flex: 1; }
    #pta-panel .pta-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    #pta-panel .pta-title {
      min-width: 0;
      font-size: 14px;
      font-weight: 790;
      letter-spacing: -.015em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-version {
      flex: 0 0 auto;
      padding: 2px 6px;
      border-radius: 999px;
      background: rgba(255,255,255,.06);
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 750;
      letter-spacing: .02em;
    }
    #pta-panel .pta-subtitle {
      margin-top: 3px;
      color: var(--pta-muted);
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-dot {
      width: 9px;
      height: 9px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: var(--pta-red);
      box-shadow: 0 0 0 4px var(--pta-red-soft);
    }
    #pta-panel .pta-dot[data-on="true"] {
      background: var(--pta-green);
      box-shadow: 0 0 0 4px var(--pta-green-soft);
    }
    #pta-panel .pta-icon-btn {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      background: rgba(255,255,255,.035);
      color: var(--pta-muted);
      cursor: pointer;
      transition: background .15s ease, color .15s ease, border-color .15s ease;
    }
    #pta-panel .pta-icon-btn:hover {
      background: rgba(255,255,255,.09);
      border-color: var(--pta-border-strong);
      color: var(--pta-text);
    }

    #pta-panel .pta-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 7px 10px;
      border-bottom: 1px solid var(--pta-border);
      background: rgba(255,255,255,.018);
    }
    #pta-panel .pta-tab-btn {
      border: 1px solid transparent;
      border-radius: 9px;
      padding: 7px 9px;
      background: transparent;
      color: var(--pta-muted);
      cursor: pointer;
      font-size: 10px;
      font-weight: 760;
    }
    #pta-panel .pta-tab-btn[data-active="true"] {
      border-color: rgba(96,165,250,.20);
      background: var(--pta-blue-soft);
      color: #dbeafe;
    }
    #pta-panel .pta-tab-count {
      margin-left: 4px;
      opacity: .75;
      font-size: 9px;
    }

    #pta-panel .pta-body {
      max-height: calc(min(760px, 100vh - 36px) - 104px);
      overflow: auto;
      padding: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(148,163,184,.35) transparent;
    }
    #pta-panel[data-collapsed="true"] .pta-body,
    #pta-panel[data-collapsed="true"] .pta-tabs { display: none; }
    #pta-panel[data-collapsed="true"] { width: min(292px, calc(100vw - 24px)); }

    #pta-panel .pta-status-hero {
      padding: 12px;
      border: 1px solid var(--pta-border);
      border-radius: 14px;
      background: linear-gradient(145deg, rgba(96,165,250,.09), rgba(255,255,255,.028));
    }
    #pta-panel .pta-status-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }
    #pta-panel .pta-eyebrow {
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .09em;
      text-transform: uppercase;
    }
    #pta-panel .pta-status-title {
      margin-top: 3px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -.018em;
    }
    #pta-panel .pta-status-copy {
      margin-top: 4px;
      color: var(--pta-muted);
      font-size: 11px;
      line-height: 1.45;
    }
    #pta-panel .pta-master {
      min-width: 74px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
      padding: 7px 8px 7px 10px;
      border: 1px solid rgba(239,68,68,.24);
      border-radius: 999px;
      background: var(--pta-red-soft);
      color: #fecaca;
      cursor: pointer;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .03em;
    }
    #pta-panel .pta-master[data-on="true"] {
      border-color: rgba(34,197,94,.28);
      background: var(--pta-green-soft);
      color: #bbf7d0;
    }
    #pta-panel .pta-master-knob {
      width: 18px;
      height: 18px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: rgba(255,255,255,.11);
      color: currentColor;
      font-size: 8px;
    }

    #pta-panel .pta-next {
      margin-top: 9px;
      padding: 10px 11px;
      border: 1px solid rgba(96,165,250,.20);
      border-radius: 11px;
      background: rgba(96,165,250,.07);
    }
    #pta-panel .pta-next[data-tone="ready"] {
      border-color: rgba(34,197,94,.22);
      background: rgba(34,197,94,.075);
    }
    #pta-panel .pta-next[data-tone="danger"] {
      border-color: rgba(239,68,68,.25);
      background: rgba(239,68,68,.075);
    }
    #pta-panel .pta-next[data-tone="wait"] {
      border-color: rgba(245,158,11,.22);
      background: rgba(245,158,11,.065);
    }
    #pta-panel .pta-next-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #pta-panel .pta-next-icon {
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 8px;
      background: var(--pta-blue-soft);
      color: #bfdbfe;
      font-size: 12px;
    }
    #pta-panel .pta-next-main { min-width: 0; flex: 1; }
    #pta-panel .pta-next-title {
      font-size: 11px;
      font-weight: 760;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-next-reason {
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #pta-panel .pta-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
      margin-top: 9px;
    }
    #pta-panel .pta-metric {
      min-width: 0;
      padding: 9px 9px 8px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      background: var(--pta-surface);
    }
    #pta-panel .pta-label {
      color: var(--pta-faint);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .055em;
      text-transform: uppercase;
    }
    #pta-panel .pta-value {
      margin-top: 3px;
      min-width: 0;
      font-size: 11px;
      font-weight: 720;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-value small {
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 650;
    }

    #pta-panel .pta-mission {
      margin-top: 9px;
      padding: 10px 11px;
      border: 1px solid var(--pta-border);
      border-radius: 12px;
      background: var(--pta-surface);
    }
    #pta-panel .pta-mission-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    #pta-panel .pta-mission-name {
      min-width: 0;
      font-size: 12px;
      font-weight: 780;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-badge {
      flex: 0 0 auto;
      padding: 3px 7px;
      border-radius: 999px;
      background: rgba(148,163,184,.11);
      color: #cbd5e1;
      font-size: 9px;
      font-weight: 800;
      white-space: nowrap;
    }
    #pta-panel .pta-badge.ready { background: var(--pta-green-soft); color: #bbf7d0; }
    #pta-panel .pta-badge.wait { background: var(--pta-amber-soft); color: #fde68a; }
    #pta-panel .pta-badge.current { background: var(--pta-blue-soft); color: #bfdbfe; }
    #pta-panel .pta-badge.danger { background: var(--pta-red-soft); color: #fecaca; }
    #pta-panel .pta-badge.neutral { background: rgba(148,163,184,.10); color: #cbd5e1; }

    #pta-panel .pta-goal-card {
      margin-top: 9px;
      padding: 12px;
      border: 1px solid rgba(96,165,250,.22);
      border-radius: 14px;
      background: linear-gradient(145deg, rgba(96,165,250,.10), rgba(255,255,255,.025));
    }
    #pta-panel .pta-goal-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 9px;
    }
    #pta-panel .pta-goal-title {
      margin-top: 3px;
      font-size: 13px;
      font-weight: 820;
      letter-spacing: -.012em;
    }
    #pta-panel .pta-goal-reason {
      margin-top: 4px;
      color: var(--pta-muted);
      font-size: 10px;
      line-height: 1.45;
    }
    #pta-panel .pta-goal-step {
      margin-top: 9px;
      padding: 9px 10px;
      border-radius: 10px;
      background: rgba(96,165,250,.075);
      border: 1px solid rgba(96,165,250,.14);
    }
    #pta-panel .pta-goal-step strong {
      display: block;
      font-size: 11px;
    }
    #pta-panel .pta-goal-step small {
      display: block;
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 9px;
      line-height: 1.4;
    }

    #pta-panel .pta-capture-card {
      margin-top: 9px;
      padding: 11px;
      border: 1px solid var(--pta-border);
      border-radius: 13px;
      background: linear-gradient(145deg, rgba(245,158,11,.055), rgba(255,255,255,.025));
    }
    #pta-panel .pta-capture-card[data-tone="ready"] {
      border-color: rgba(34,197,94,.24);
      background: linear-gradient(145deg, rgba(34,197,94,.08), rgba(255,255,255,.025));
    }
    #pta-panel .pta-capture-card[data-tone="danger"] {
      border-color: rgba(239,68,68,.24);
      background: linear-gradient(145deg, rgba(239,68,68,.08), rgba(255,255,255,.025));
    }
    #pta-panel .pta-capture-card[data-tone="wait"] {
      border-color: rgba(245,158,11,.24);
    }
    #pta-panel .pta-capture-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    #pta-panel .pta-capture-title {
      min-width: 0;
      font-size: 12px;
      font-weight: 790;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-capture-subtitle {
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 650;
    }
    #pta-panel .pta-capture-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      margin-top: 9px;
    }
    #pta-panel .pta-capture-stat {
      min-width: 0;
      padding: 7px 8px;
      border-radius: 9px;
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(255,255,255,.055);
    }
    #pta-panel .pta-capture-stat strong {
      display: block;
      margin-top: 2px;
      color: var(--pta-text);
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-capture-reason {
      margin-top: 8px;
      color: #cbd5e1;
      font-size: 10px;
      line-height: 1.4;
    }
    #pta-panel .pta-capture-progress {
      height: 5px;
      margin-top: 8px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,.07);
    }
    #pta-panel .pta-capture-progress > span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--pta-blue);
    }
    #pta-panel .pta-settings-note {
      grid-column: 1 / -1;
      color: var(--pta-muted);
      font-size: 9px;
      line-height: 1.45;
      padding: 1px 2px 4px;
    }
    #pta-panel .pta-stepper {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 6px;
      padding: 7px 8px;
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      background: rgba(255,255,255,.025);
    }
    #pta-panel .pta-stepper-label {
      min-width: 0;
      color: #cbd5e1;
      font-size: 10px;
      font-weight: 650;
    }
    #pta-panel .pta-stepper-label small {
      display: block;
      margin-top: 1px;
      color: var(--pta-muted);
      font-size: 8px;
      font-weight: 600;
    }
    #pta-panel .pta-stepper-value {
      min-width: 35px;
      text-align: center;
      font-size: 10px;
      font-weight: 800;
    }
    #pta-panel .pta-stepper-controls {
      display: flex;
      gap: 4px;
    }
    #pta-panel .pta-stepper-btn {
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      border: 1px solid var(--pta-border);
      border-radius: 8px;
      background: rgba(255,255,255,.045);
      color: var(--pta-text);
      cursor: pointer;
      font-weight: 800;
    }
    #pta-panel .pta-stepper-btn:hover { background: rgba(255,255,255,.09); }

    #pta-panel .pta-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    #pta-panel .pta-chip {
      max-width: 100%;
      padding: 4px 7px;
      border: 1px solid rgba(255,255,255,.075);
      border-radius: 999px;
      background: rgba(255,255,255,.035);
      color: #cbd5e1;
      font-size: 9px;
      font-weight: 680;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #pta-panel .pta-actions {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: 7px;
      margin-top: 9px;
    }
    #pta-panel .pta-action-btn {
      min-width: 0;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      padding: 9px 10px;
      background: rgba(255,255,255,.045);
      color: var(--pta-text);
      cursor: pointer;
      font-weight: 720;
      transition: transform .12s ease, background .15s ease, border-color .15s ease;
    }
    #pta-panel .pta-action-btn:hover {
      background: rgba(255,255,255,.09);
      border-color: var(--pta-border-strong);
    }
    #pta-panel .pta-action-btn:active { transform: translateY(1px); }
    #pta-panel .pta-action-btn.primary {
      border-color: rgba(96,165,250,.30);
      background: rgba(96,165,250,.12);
      color: #dbeafe;
    }

    #pta-panel .pta-section-title {
      margin: 12px 1px 6px;
      color: var(--pta-faint);
      font-size: 9px;
      font-weight: 850;
      letter-spacing: .075em;
      text-transform: uppercase;
    }
    #pta-panel details {
      margin-top: 7px;
      border: 1px solid var(--pta-border);
      border-radius: 12px;
      overflow: hidden;
      background: rgba(255,255,255,.022);
    }
    #pta-panel summary {
      display: flex;
      align-items: center;
      gap: 8px;
      list-style: none;
      padding: 9px 10px;
      cursor: pointer;
      color: #dbe2ea;
      font-weight: 720;
      user-select: none;
    }
    #pta-panel summary::-webkit-details-marker { display: none; }
    #pta-panel summary .pta-summary-main { min-width: 0; flex: 1; }
    #pta-panel summary .pta-summary-meta {
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 650;
    }
    #pta-panel summary::after {
      content: "⌄";
      color: var(--pta-muted);
      font-size: 13px;
      transition: transform .15s ease;
    }
    #pta-panel details[open] summary::after { transform: rotate(180deg); }

    #pta-panel .pta-settings {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 0 9px 9px;
    }
    #pta-panel .pta-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
      min-width: 0;
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      padding: 8px 9px;
      background: rgba(255,255,255,.03);
      color: #cbd5e1;
      cursor: pointer;
      text-align: left;
    }
    #pta-panel .pta-toggle:hover { background: rgba(255,255,255,.055); }
    #pta-panel .pta-toggle-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 10px;
      font-weight: 650;
    }
    #pta-panel .pta-switch {
      width: 27px;
      height: 16px;
      padding: 2px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: #475569;
    }
    #pta-panel .pta-switch::after {
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: white;
      transition: transform .16s ease;
    }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch { background: var(--pta-green); }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch::after { transform: translateX(11px); }

    #pta-panel .pta-modules { padding: 0 9px 9px; }
    #pta-panel .pta-module {
      display: grid;
      grid-template-columns: 8px minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 31px;
      padding: 6px 2px;
      color: #cbd5e1;
      border-top: 1px solid rgba(255,255,255,.05);
    }
    #pta-panel .pta-module:first-child { border-top: 0; }
    #pta-panel .pta-module-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 10px;
      font-weight: 670;
    }
    #pta-panel .pta-module-status {
      max-width: 170px;
      color: var(--pta-muted);
      font-size: 9px;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-mini-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #64748b;
    }
    #pta-panel .pta-mini-dot.ready { background: var(--pta-green); }
    #pta-panel .pta-mini-dot.wait { background: var(--pta-amber); }
    #pta-panel .pta-mini-dot.current { background: var(--pta-blue); }
    #pta-panel .pta-mini-dot.danger { background: var(--pta-red); }

    #pta-panel .pta-log-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 9px;
    }
    #pta-panel .pta-log-toolbar-copy {
      min-width: 0;
    }
    #pta-panel .pta-log-toolbar-copy strong {
      display: block;
      font-size: 12px;
    }
    #pta-panel .pta-log-toolbar-copy small {
      display: block;
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 9px;
    }
    #pta-panel .pta-log-clear {
      flex: 0 0 auto;
      border: 1px solid var(--pta-border);
      border-radius: 9px;
      padding: 6px 8px;
      background: rgba(255,255,255,.035);
      color: var(--pta-muted);
      cursor: pointer;
      font-size: 9px;
      font-weight: 760;
    }
    #pta-panel .pta-log-list {
      display: grid;
      gap: 7px;
    }
    #pta-panel .pta-log-entry {
      padding: 9px 10px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      background: var(--pta-surface);
    }
    #pta-panel .pta-log-entry[data-level="success"] {
      border-color: rgba(34,197,94,.20);
    }
    #pta-panel .pta-log-entry[data-level="warning"] {
      border-color: rgba(245,158,11,.22);
    }
    #pta-panel .pta-log-entry[data-level="error"] {
      border-color: rgba(239,68,68,.24);
    }
    #pta-panel .pta-log-entry-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    #pta-panel .pta-log-category {
      color: #cbd5e1;
      font-size: 9px;
      font-weight: 820;
      letter-spacing: .05em;
      text-transform: uppercase;
    }
    #pta-panel .pta-log-time {
      color: var(--pta-faint);
      font-size: 9px;
      white-space: nowrap;
    }
    #pta-panel .pta-log-message {
      margin-top: 4px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.4;
    }
    #pta-panel .pta-log-details {
      margin-top: 4px;
      color: var(--pta-muted);
      font-size: 9px;
      line-height: 1.45;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    #pta-panel .pta-log-empty {
      padding: 20px 12px;
      border: 1px dashed var(--pta-border);
      border-radius: 12px;
      color: var(--pta-muted);
      text-align: center;
      font-size: 10px;
    }

    #pta-panel .pta-footer {
      margin-top: 10px;
      color: #526174;
      text-align: center;
      font-size: 9px;
      line-height: 1.4;
    }

    @media (max-width: 520px) {
      #pta-panel {
        right: 8px;
        bottom: 8px;
        width: calc(100vw - 16px);
        max-height: calc(100vh - 16px);
        border-radius: 16px;
      }
      #pta-panel .pta-body { max-height: calc(100vh - 74px); }
      #pta-panel[data-collapsed="true"] { width: min(270px, calc(100vw - 16px)); }
      #pta-panel .pta-metrics { grid-template-columns: repeat(2, 1fr); }
      #pta-panel .pta-metric:last-child { grid-column: 1 / -1; }
    }
  `);

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Jamais';
    const seconds = Math.max(0, Math.floor((now() - timestamp) / 1000));
    if (seconds < 5) return 'À l’instant';
    if (seconds < 60) return `Il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Il y a ${hours} h`;
  }

  function formatRemaining(timestamp) {
    if (!timestamp) return null;
    const remaining = timestamp - now();
    if (remaining <= 0) return 'Prêt';
    const totalSeconds = Math.ceil(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    return `${seconds}s`;
  }

  function expeditionPhaseLabel(phase) {
    const labels = {
      unknown: 'À synchroniser',
      ready_to_start: 'Prête à lancer',
      preparing: 'Préparation',
      starting: 'Lancement',
      running: 'En cours',
      due: 'Résultat prêt',
      opening_result: 'Ouverture résultat',
      result: 'Résultats',
      awaiting_capture: 'Capture manuelle',
      claiming: 'Récupération',
    };
    return labels[phase] || phase || 'Inconnu';
  }

  function nextDueModule() {
    return MODULES
      .filter(module => moduleEnabled(module.id))
      .map(module => ({
        module,
        dueAt: state.moduleStatus?.[module.id]?.nextDueAt || null,
      }))
      .filter(item => item.dueAt)
      .sort((a, b) => a.dueAt - b.dueAt)[0] || null;
  }

  function moduleDisplayStatus(module) {
    const current = moduleFromLocation();
    const status = state.moduleStatus?.[module.id] || {};

    if (module.id === 'pokemon' && (config.autoLevelPokemon || config.autoEvolvePokemon)) {
      const progression = pokemonProgressionState();
      if (expeditionCycle().phase === 'running') {
        return { className: 'wait', label: 'Attend expédition' };
      }

      const labels = {
        scanning: 'Analyse',
        opening_profile: 'Inspection',
        level_ready: 'Renforcement',
        leveling: 'Renforcement',
        evolution_ready: 'Évolution',
        evolving: 'Évolution',
        manual: 'Choix manuel',
        blocked: 'Bloqué',
        scanned: 'Analysé',
        waiting_expedition: 'Attend expédition',
      };

      if (progression.phase && progression.phase !== 'idle') {
        return {
          className: ['level_ready', 'leveling', 'evolution_ready', 'evolving'].includes(progression.phase)
            ? 'ready'
            : progression.phase === 'manual'
              ? 'danger'
              : 'wait',
          label: progression.targetName
            ? `${labels[progression.phase] || progression.phase} · ${progression.targetName}`
            : (labels[progression.phase] || progression.phase),
        };
      }
    }

    if (module.id === 'progression' && config.autoGyms) {
      const gym = gymCycle();
      const badgeText = gym.badges != null
        ? `${gym.badges}/${gym.totalBadges || 8}`
        : null;

      if (gym.availableToday === true) {
        return {
          className: 'ready',
          label: badgeText ? `Arène dispo · ${badgeText}` : 'Arène disponible',
        };
      }

      if (gym.checkedDay === localDayKey() && gym.availableToday === false) {
        return {
          className: '',
          label: badgeText ? `Vérifié · ${badgeText}` : 'Vérifié aujourd’hui',
        };
      }
    }

    if (current?.id === module.id) {
      if (status.nextDueAt) {
        const remaining = formatRemaining(status.nextDueAt);
        if (remaining === 'Prêt') return { className: 'ready', label: 'Ici · Prêt' };
        return { className: 'current', label: `Ici · ${remaining}` };
      }
      return { className: 'current', label: 'Ici' };
    }

    if (status.nextDueAt) {
      const remaining = formatRemaining(status.nextDueAt);
      if (remaining === 'Prêt') return { className: 'ready', label: 'Prêt' };
      return { className: 'wait', label: remaining };
    }

    if (status.lastVisitedAt) {
      return { className: '', label: 'RAS' };
    }

    return { className: '', label: 'Non vérifié' };
  }

  function expeditionPhaseMeta(phase) {
    const phaseName = expeditionPhaseLabel(phase);
    if (phase === 'due' || phase === 'claiming') {
      return { tone: 'ready', label: phaseName };
    }
    if (phase === 'awaiting_capture') {
      return { tone: 'danger', label: phaseName };
    }
    if (['preparing', 'starting', 'opening_result', 'result'].includes(phase)) {
      return { tone: 'current', label: phaseName };
    }
    if (phase === 'running') {
      return { tone: 'wait', label: phaseName };
    }
    return { tone: '', label: phaseName };
  }

  function panelNextDecision() {
    const decision = state.orchestrator?.lastDecision;
    const reason = state.orchestrator?.lastReason;

    if (!config.enabled) {
      return {
        title: 'Automatisation en pause',
        reason: 'Active le bot ou exécute un cycle manuel pour reprendre.',
        tone: 'danger',
        icon: 'Ⅱ',
      };
    }

    let liveCapture = null;
    try {
      liveCapture = isExpeditionResultPage() ? captureContext() : null;
    } catch {
      liveCapture = null;
    }

    if (liveCapture) {
      const captureDecision = decideCapture(liveCapture);
      const meta = captureActionMeta(captureDecision.action);
      const title = captureDecision.action === 'capture'
        ? `Capturer ${liveCapture.species}`
        : captureDecision.action === 'manual'
          ? `Capture manuelle · ${liveCapture.species}`
          : captureDecision.action === 'skip' || captureDecision.action === 'ignore'
            ? `Ignorer ${liveCapture.species}`
            : `Rencontre · ${liveCapture.species}`;

      return {
        title,
        reason: captureDecision.reason,
        tone: meta.tone === 'neutral' ? '' : meta.tone,
        icon: captureDecision.action === 'capture' ? '◎' : captureDecision.action === 'manual' ? '!' : '→',
      };
    }

    if (expeditionCycle().phase === 'awaiting_capture') {
      return {
        title: 'Décision de capture requise',
        reason: state.captureDecision?.reason || 'Une rencontre attend une décision.',
        tone: 'danger',
        icon: '!',
      };
    }

    let preview = null;
    try {
      preview = orchestratorPlan()?.[0] || null;
    } catch {
      preview = null;
    }

    if (preview) {
      return {
        title: preview.name.replace(/^navigation:/, 'Navigation · '),
        reason: preview.reason || 'Action prioritaire sélectionnée par l’orchestrateur.',
        tone: preview.priority >= 9000 ? 'ready' : 'current',
        icon: '→',
      };
    }

    if (decision && decision !== 'wait') {
      return {
        title: decision.replace(/^navigation:/, 'Navigation · '),
        reason: reason || 'Dernière décision de l’orchestrateur.',
        tone: 'current',
        icon: '↺',
      };
    }

    const next = nextDueModule();
    if (next) {
      return {
        title: `${next.module.label} dans ${formatRemaining(next.dueAt)}`,
        reason: 'Aucune action immédiate, prochaine échéance connue.',
        tone: 'wait',
        icon: '◷',
      };
    }

    return {
      title: 'En attente',
      reason: 'Aucune action nécessaire pour le moment.',
      tone: '',
      icon: '·',
    };
  }

  function plannedTeamNames() {
    const planned = state.expeditionPlan?.team;
    if (Array.isArray(planned) && planned.length) return planned;
    const previous = state.smartTeam?.lastSelection;
    return Array.isArray(previous) ? previous.slice(-3) : [];
  }

  function chipHtml(label, title = '') {
    return `<span class="pta-chip" title="${escapeHtml(title || label)}">${escapeHtml(label)}</span>`;
  }

  function enabledOptionCount(keys) {
    return keys.filter(key => Boolean(config[key])).length;
  }

  function captureActionMeta(action) {
    const map = {
      capture: { label: 'Capturer', tone: 'ready' },
      skip: { label: 'Passer', tone: 'wait' },
      ignore: { label: 'Ignorer', tone: 'wait' },
      manual: { label: 'Manuel', tone: 'danger' },
      none: { label: 'Aucune action', tone: 'neutral' },
    };
    return map[action] || map.none;
  }

  function captureModeLabel() {
    if (!config.autoCapture) return 'Manuel';
    if (!config.smartCapture) return 'Auto simple';
    return config.captureOwnedDuplicates
      ? 'Intelligent · doublons autorisés'
      : 'Intelligent · sans doublons';
  }

  function liveCapturePanelState() {
    let context = null;
    if (isExpeditionResultPage()) {
      try {
        context = captureContext();
      } catch {
        context = null;
      }
    }

    if (context) {
      const decision = decideCapture(context);
      return {
        active: true,
        ...captureDecisionSnapshot(context, decision),
      };
    }

    return {
      active: false,
      ...(state.captureDecision || {}),
    };
  }

  function stepCaptureSetting(key, delta, min, max) {
    const current = Number(config[key] ?? min);
    config[key] = Math.max(min, Math.min(max, current + delta));
    saveConfig(config);
    updatePanel();
  }

  function ensurePanel() {
    if (document.getElementById('pta-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'pta-panel';
    document.body.appendChild(panel);
    panel.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;

      if (action === 'enabled') {
        setEnabled(!config.enabled);
        return;
      }

      if (action === 'run') {
        cycle(true);
        return;
      }

      if (action === 'collapse') {
        config.panelCollapsed = !config.panelCollapsed;
        saveConfig(config);
        updatePanel();
        return;
      }

      if (action === 'view-dashboard') {
        state.panelView = 'dashboard';
        saveState(state);
        updatePanel();
        return;
      }

      if (action === 'view-logs') {
        state.panelView = 'logs';
        saveState(state);
        updatePanel();
        return;
      }

      if (action === 'clear-logs') {
        clearActionLog();
        return;
      }

      if (action === 'capture-reserve-dec') {
        stepCaptureSetting('minBallReserve', -1, 0, 99);
        return;
      }

      if (action === 'capture-reserve-inc') {
        stepCaptureSetting('minBallReserve', 1, 0, 99);
        return;
      }

      if (action === 'capture-iv-dec') {
        stepCaptureSetting('minCaptureIvScore', -5, 0, 100);
        return;
      }

      if (action === 'capture-iv-inc') {
        stepCaptureSetting('minCaptureIvScore', 5, 0, 100);
        return;
      }

      if (action === 'gym-hp-dec') {
        stepCaptureSetting('minGymHpPercent', -5, 10, 100);
        return;
      }

      if (action === 'gym-hp-inc') {
        stepCaptureSetting('minGymHpPercent', 5, 10, 100);
        return;
      }

      if (action === 'stardust-reserve-dec') {
        stepCaptureSetting('minStardustReserve', -100, 0, 999999);
        return;
      }

      if (action === 'stardust-reserve-inc') {
        stepCaptureSetting('minStardustReserve', 100, 0, 999999);
        return;
      }

      if (action === 'background-refresh-dec') {
        stepCaptureSetting('backgroundRefreshSeconds', -10, 10, 300);
        return;
      }

      if (action === 'background-refresh-inc') {
        stepCaptureSetting('backgroundRefreshSeconds', 10, 10, 300);
        return;
      }

      if (action === 'ranking') {
        const ranking = rankExpeditions();
        if (!ranking.length) {
          state.lastAction = 'Aucune expédition lançable sur cette page';
          saveState(state);
          updatePanel();
          return;
        }
        console.table(ranking.map(item => ({
          expedition: item.title,
          score: item.score,
          progression: item.progressionRank,
          niveauConseille: item.requiredLevel ?? '?',
          equipe: item.teamPlan?.known
            ? item.teamPlan.team.map(pokemon => pokemon.name).join(', ') || 'aucune'
            : 'à confirmer',
          equipeViable: item.teamPlan?.viable ?? '?',
          scoreEquipe: item.teamPlan?.teamScore ?? '?',
          rencontre: item.chance != null ? item.chance + '%' : '?',
          dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
          echecs: item.failureStreak,
          raisons: item.reasons.join(' | '),
        })));
        state.lastAction = `Classement affiché (${ranking.length} expéditions)`;
        saveState(state);
        updatePanel();
        return;
      }

      toggleOption(action);
    });
    updatePanel();
  }

  function optionButton(key, label) {
    return `
      <button class="pta-toggle" data-action="${key}" data-on="${config[key]}" title="${config[key] ? 'Désactiver' : 'Activer'} ${escapeHtml(label)}">
        <span class="pta-toggle-label">${escapeHtml(label)}</span>
        <span class="pta-switch" aria-hidden="true"></span>
      </button>
    `;
  }

  function updatePanel() {
    const panel = document.getElementById('pta-panel');
    if (!panel) return;

    // updatePanel() reconstruit le contenu régulièrement. Sans conserver ces
    // valeurs, le navigateur remet le conteneur en haut à chaque rafraîchissement.
    const previousBody = panel.querySelector('.pta-body:not([hidden])');
    const previousScrollTop = previousBody?.scrollTop || 0;
    const hadRenderedBody = Boolean(previousBody);

    const detailsState = {};
    panel.querySelectorAll('details[data-section]').forEach(details => {
      detailsState[details.dataset.section] = details.open;
    });

    const intelligenceOpen = Object.prototype.hasOwnProperty.call(detailsState, 'intelligence')
      ? detailsState.intelligence
      : true;

    const current = moduleFromLocation();
    const next = nextDueModule();
    const panelView = state.panelView === 'logs' ? 'logs' : 'dashboard';
    const logEntries = actionLogEntries();
    const logsHtml = logEntries.length
      ? logEntries.map(entry => {
          const time = new Date(entry.at || 0).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return `
            <article class="pta-log-entry" data-level="${escapeHtml(entry.level || 'info')}">
              <div class="pta-log-entry-head">
                <span class="pta-log-category">${escapeHtml(entry.category || 'bot')}</span>
                <span class="pta-log-time">${escapeHtml(time)}</span>
              </div>
              <div class="pta-log-message">${escapeHtml(entry.message || '')}</div>
              ${entry.details ? `
                <div class="pta-log-details">${escapeHtml(entry.details)}</div>
              ` : ''}
            </article>
          `;
        }).join('')
      : '<div class="pta-log-empty">Aucune action enregistrée pour le moment.</div>';
    const cycleMeta = expeditionPhaseMeta(expeditionCycle().phase);
    const decision = panelNextDecision();
    const account = accountSnapshot();
    const goal = currentGoalPlan();
    const goalConfidenceLabel = {
      high: 'Confiance élevée',
      medium: 'Confiance moyenne',
      low: 'Confiance faible',
    }[goal.confidence] || 'Planner';
    const goalConfidenceTone = goal.confidence === 'high'
      ? 'ready'
      : goal.confidence === 'low'
        ? 'wait'
        : 'current';
    const goalAccountChips = [
      account.trainer?.level != null ? `Niv. dresseur · ${account.trainer.level}` : null,
      account.pokedex?.capturedSpecies != null ? `Espèces · ${account.pokedex.capturedSpecies}` : null,
      account.league?.badges != null ? `Badges · ${account.league.badges}/${account.league.totalBadges || 8}` : null,
    ].filter(Boolean);
    const team = plannedTeamNames();
    const activeModules = MODULES.filter(module => moduleEnabled(module.id));
    const rosterCount = state.rosterSnapshot?.pokemon?.length || 0;
    const rosterAge = state.rosterSnapshot?.capturedAt
      ? formatRelativeTime(state.rosterSnapshot.capturedAt)
      : 'Jamais';
    const cycle = expeditionCycle();
    const missionTitle = ['running', 'due', 'result', 'claiming', 'opening_result']
      .includes(cycle.phase)
      ? (cycle.title || state.expeditionPlan?.title || state.selectedExpedition || 'Aucune mission ciblée')
      : (state.expeditionPlan?.title || state.selectedExpedition || 'Aucune mission ciblée');
    const missionPlan = state.expeditionPlan || {};
    const missionScore =
      normalizeText(state.selectedExpedition || '') === normalizeText(missionTitle || '')
        ? state.selectedExpeditionScore
        : null;
    const missionReason = missionPlan.reason || state.orchestrator?.lastReason || '';
    const gym = gymCycle();
    const showGymCard =
      config.autoGyms &&
      (
        isLeagueIndexPage() ||
        isGymPreparePage() ||
        gym.availableToday === true ||
        gym.checkedDay === localDayKey()
      );
    const gymPhaseLabels = {
      unknown: 'Non vérifié',
      available: 'Disponible',
      opening_prepare: 'Ouverture',
      preparing: 'Préparation',
      challenging: 'Combat',
      result: 'Résultat',
      blocked: 'Bloqué',
      done: 'Terminé',
    };
    const gymTone = gym.phase === 'available'
      ? 'ready'
      : gym.phase === 'blocked'
        ? 'danger'
        : ['opening_prepare', 'preparing', 'challenging'].includes(gym.phase)
          ? 'current'
          : '';
    const gymTitle = gym.arena || 'Circuit des Arènes';
    const pokemonProgress = pokemonProgressionState();
    const showPokemonProgress =
      (config.autoLevelPokemon || config.autoEvolvePokemon) &&
      (
        pokemonProgress.phase !== 'idle' ||
        expeditionCycle().phase === 'running'
      );
    const pokemonProgressPhase = expeditionCycle().phase === 'running'
      ? 'Attente expédition'
      : ({
          scanning: 'Analyse',
          opening_profile: 'Inspection',
          level_ready: 'Renforcement prêt',
          leveling: 'Renforcement',
          evolution_ready: 'Évolution prête',
          evolving: 'Évolution',
          manual: 'Choix manuel',
          blocked: 'Bloqué',
          scanned: 'Analysé',
          waiting_expedition: 'Attente expédition',
        }[pokemonProgress.phase] || 'Progression');
    const pokemonProgressTone = pokemonProgress.phase === 'manual'
      ? 'danger'
      : ['level_ready', 'leveling', 'evolution_ready', 'evolving'].includes(pokemonProgress.phase)
        ? 'ready'
        : 'wait';
    const nextText = next
      ? `${next.module.label} · ${formatRemaining(next.dueAt)}`
      : 'Aucune';

    const activityKeys = [
      'autoClaimExpeditions',
      'autoStartExpeditions',
      'autoHeal',
      'autoHarvest',
      'autoIncubatorClaim',
      'autoBreedingClaim',
      'autoProgression',
      'autoGyms',
      'autoLevelPokemon',
      'autoEvolvePokemon',
      'autoPlant',
    ];
    const intelligenceKeys = ['smartTeam', 'directHttpActions', 'backgroundHttpMode'];
    const captureKeys = [
      'autoCapture',
      'smartCapture',
      'captureNewSpecies',
      'captureRare',
      'captureOwnedDuplicates',
      'captureUnknownEncounters',
    ];

    const modulesHtml = activeModules
      .map(module => {
        const display = moduleDisplayStatus(module);
        return `
          <div class="pta-module">
            <span class="pta-mini-dot ${display.className}"></span>
            <span class="pta-module-name">${escapeHtml(module.label)}</span>
            <span class="pta-module-status">${escapeHtml(display.label)}</span>
          </div>
        `;
      })
      .join('');

    const teamChips = team.length
      ? team.map(name => chipHtml(name)).join('')
      : chipHtml('Équipe à confirmer');

    const missionChips = [
      team.length ? `Équipe · ${team.length}` : 'Roster à confirmer',
      missionScore != null ? `Score · ${missionScore}` : null,
      missionPlan.teamScore != null ? `Équipe · ${missionPlan.teamScore}` : null,
    ]
      .filter(Boolean)
      .map(label => chipHtml(label))
      .join('');

    const transport = httpTransportState();
    const background = backgroundHttpState();
    const backgroundLabel = config.backgroundHttpMode
      ? background.lastUrl
        ? `GET · ${background.lastStatus ?? '?'}`
        : 'GET silencieux'
      : 'Navigation visible';
    const backgroundTone = background.lastError
      ? 'danger'
      : background.lastUrl
        ? 'ready'
        : '';
    const transportLabel = config.directHttpActions
      ? transport.lastEndpoint
        ? `HTTP · ${transport.lastStatus ?? '?'}`
        : 'HTTP direct'
      : 'Fallback DOM';
    const transportTone = transport.lastError
      ? 'danger'
      : transport.lastEndpoint
        ? 'ready'
        : '';
    const captureView = liveCapturePanelState();
    const captureMeta = captureActionMeta(captureView.action);
    const captureLabel = captureView.species
      ? `${captureView.species} · ${captureMeta.label}`
      : 'Aucune décision';
    const captureTone = captureMeta.tone === 'neutral' ? '' : captureMeta.tone;
    const captureSpeciesStatus = captureView.isNew === true
      ? 'Nouvelle espèce'
      : captureView.isNew === false
        ? 'Déjà au Pokédex'
        : 'Statut inconnu';
    const captureBallLabel = captureView.ballName
      ? `${captureView.ballName}${captureView.ballReserve != null ? ` ×${captureView.ballReserve}` : ''}`
      : captureView.ballReserve != null
        ? `Balls ×${captureView.ballReserve}`
        : '—';
    const captureChanceLabel = captureView.captureChance != null
      ? `${captureView.captureChance}%`
      : '—';
    const captureAttemptsLabel = captureView.attemptsRemaining != null
      ? String(captureView.attemptsRemaining)
      : '—';
    const captureProgress = captureView.captureChance != null
      ? Math.max(0, Math.min(100, captureView.captureChance))
      : 0;

    panel.dataset.collapsed = String(Boolean(config.panelCollapsed));
    panel.innerHTML = `
      <div class="pta-header">
        <span class="pta-dot" data-on="${config.enabled}"></span>
        <div class="pta-brand">
          <div class="pta-title-row">
            <div class="pta-title">PokéTaka Automation</div>
            <span class="pta-version" title="Runtime v${VERSION} · Loader v${escapeHtml(GM_info?.script?.version || VERSION)}">
              v${VERSION}
            </span>
          </div>
          <div class="pta-subtitle">
            ${escapeHtml(current?.label || 'Page PokéTaka')} · ${config.enabled ? 'Pilotage actif' : 'En pause'}
            · ${config.backgroundHttpMode ? 'GET silencieux' : 'Navigation'}
            · ${config.directHttpActions ? 'POST direct' : 'DOM'}
            ${GM_info?.script?.version && GM_info.script.version !== VERSION
              ? ` · Loader ${escapeHtml(GM_info.script.version)}`
              : ''}
          </div>
        </div>
        <button
          class="pta-icon-btn"
          data-action="collapse"
          title="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau"
          aria-label="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau"
        >${config.panelCollapsed ? '▣' : '—'}</button>
      </div>

      <div class="pta-tabs" role="tablist" aria-label="Navigation du panel">
        <button
          class="pta-tab-btn"
          data-action="view-dashboard"
          data-active="${panelView === 'dashboard'}"
          role="tab"
          aria-selected="${panelView === 'dashboard'}"
        >Pilotage</button>
        <button
          class="pta-tab-btn"
          data-action="view-logs"
          data-active="${panelView === 'logs'}"
          role="tab"
          aria-selected="${panelView === 'logs'}"
        >Logs <span class="pta-tab-count">${logEntries.length}</span></button>
      </div>

      <div class="pta-body" data-panel-page="dashboard" ${panelView === 'logs' ? 'hidden' : ''}>
        <section class="pta-status-hero" aria-label="État de l’automatisation">
          <div class="pta-status-top">
            <div>
              <div class="pta-eyebrow">État du bot</div>
              <div class="pta-status-title">
                ${config.enabled ? 'Automatisation active' : 'Automatisation en pause'}
              </div>
              <div class="pta-status-copy">
                Cycle expédition · ${escapeHtml(cycleMeta.label)}
              </div>
            </div>

            <button
              class="pta-master"
              data-action="enabled"
              data-on="${config.enabled}"
              aria-pressed="${config.enabled}"
              title="${config.enabled ? 'Mettre en pause' : 'Activer'} l’automatisation"
            >
              <span>${config.enabled ? 'ON' : 'OFF'}</span>
              <span class="pta-master-knob">${config.enabled ? '✓' : '×'}</span>
            </button>
          </div>

          <div class="pta-next" data-tone="${decision.tone}">
            <div class="pta-next-row">
              <div class="pta-next-icon">${escapeHtml(decision.icon)}</div>
              <div class="pta-next-main">
                <div class="pta-eyebrow">Prochaine décision</div>
                <div class="pta-next-title" title="${escapeHtml(decision.title)}">
                  ${escapeHtml(decision.title)}
                </div>
                <div class="pta-next-reason" title="${escapeHtml(decision.reason)}">
                  ${escapeHtml(decision.reason)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="pta-metrics">
          <div class="pta-metric">
            <div class="pta-label">Échéance</div>
            <div class="pta-value" title="${escapeHtml(nextText)}">${escapeHtml(nextText)}</div>
          </div>
          <div class="pta-metric">
            <div class="pta-label">Actions</div>
            <div class="pta-value">${state.actions} <small>· ${escapeHtml(formatRelativeTime(state.lastActionAt))}</small></div>
          </div>
          <div class="pta-metric">
            <div class="pta-label">Roster</div>
            <div class="pta-value">${rosterCount || '—'} <small>· ${escapeHtml(rosterAge)}</small></div>
          </div>
        </div>

        <section class="pta-goal-card" aria-label="Objectif global">
          <div class="pta-goal-head">
            <div>
              <div class="pta-eyebrow">Objectif global · ${escapeHtml(goal.strategy || 'progression')}</div>
              <div class="pta-goal-title" title="${escapeHtml(goal.primary?.title || '')}">
                ${escapeHtml(goal.primary?.title || 'Observer le compte')}
              </div>
            </div>
            <span class="pta-badge ${goalConfidenceTone}">
              ${escapeHtml(goalConfidenceLabel)}
            </span>
          </div>

          <div class="pta-goal-reason">
            ${escapeHtml(goal.primary?.reason || 'Le planner construit la prochaine stratégie.')}
          </div>

          <div class="pta-goal-step">
            <div class="pta-eyebrow">Étape suivante</div>
            <strong>${escapeHtml(goal.step?.title || 'Collecter l’état du compte')}</strong>
            <small>${escapeHtml(goal.step?.reason || '')}</small>
          </div>

          ${goalAccountChips.length ? `
            <div class="pta-chip-row">
              ${goalAccountChips.map(label => chipHtml(label)).join('')}
            </div>
          ` : ''}

          ${Array.isArray(goal.blockers) && goal.blockers.length ? `
            <div class="pta-chip-row">
              ${goal.blockers.map(blocker => chipHtml(`Blocage · ${blocker}`, blocker)).join('')}
            </div>
          ` : ''}
        </section>

        <section class="pta-mission" aria-label="Plan d’expédition">
          <div class="pta-mission-head">
            <div class="pta-mission-name" title="${escapeHtml(missionTitle)}">
              ${escapeHtml(missionTitle)}
            </div>
            <span class="pta-badge ${cycleMeta.tone}">${escapeHtml(cycleMeta.label)}</span>
          </div>

          <div class="pta-chip-row">${missionChips || chipHtml('Aucun plan actif')}</div>
          <div class="pta-chip-row">${teamChips}</div>

          ${missionReason ? `
            <div class="pta-status-copy" title="${escapeHtml(missionReason)}">
              ${escapeHtml(missionReason)}
            </div>
          ` : ''}
        </section>

        ${showGymCard ? `
          <section class="pta-mission" aria-label="Automatisation des arènes">
            <div class="pta-mission-head">
              <div class="pta-mission-name" title="${escapeHtml(gymTitle)}">
                ${escapeHtml(gymTitle)}
              </div>
              <span class="pta-badge ${gymTone}">
                ${escapeHtml(gymPhaseLabels[gym.phase] || gym.phase || 'Arènes')}
              </span>
            </div>

            <div class="pta-chip-row">
              ${gym.badges != null ? chipHtml(`Badges · ${gym.badges}/${gym.totalBadges || 8}`) : ''}
              ${gym.badge ? chipHtml(gym.badge) : ''}
              ${gym.champion ? chipHtml(`Champion · ${gym.champion}`) : ''}
              ${gym.requiredTeamSize ? chipHtml(`Équipe · ${gym.requiredTeamSize}`) : ''}
            </div>

            ${Array.isArray(gym.selectedTeam) && gym.selectedTeam.length ? `
              <div class="pta-chip-row">
                ${gym.selectedTeam.map(name => chipHtml(name)).join('')}
              </div>
            ` : ''}

            ${gym.reason ? `
              <div class="pta-status-copy" title="${escapeHtml(gym.reason)}">
                ${escapeHtml(gym.reason)}
              </div>
            ` : ''}
          </section>
        ` : ''}

        ${showPokemonProgress ? `
          <section class="pta-mission" aria-label="Progression Pokémon">
            <div class="pta-mission-head">
              <div class="pta-mission-name" title="${escapeHtml(pokemonProgress.targetName || 'Progression Pokémon')}">
                ${escapeHtml(pokemonProgress.targetName || 'Progression Pokémon')}
              </div>
              <span class="pta-badge ${pokemonProgressTone}">
                ${escapeHtml(pokemonProgressPhase)}
              </span>
            </div>

            <div class="pta-chip-row">
              ${pokemonProgress.targetLevel != null ? chipHtml(`Niveau · ${pokemonProgress.targetLevel}`) : ''}
              ${chipHtml(`Réserve poussière · ${config.minStardustReserve}`)}
              ${config.preserveEvolutionCandies ? chipHtml('Bonbons évolution protégés') : ''}
            </div>

            <div class="pta-status-copy">
              ${escapeHtml(
                expeditionCycle().phase === 'running'
                  ? `Attente de la fin de ${expeditionCycle().title || 'l’expédition'} avant toute dépense.`
                  : pokemonProgress.reason || 'Analyse de la progression disponible.'
              )}
            </div>
          </section>
        ` : ''}

        ${captureView.active ? `
          <section class="pta-capture-card" data-tone="${captureTone || 'neutral'}" aria-label="Décision de capture">
            <div class="pta-capture-head">
              <div>
                <div class="pta-eyebrow">Rencontre sauvage</div>
                <div class="pta-capture-title" title="${escapeHtml(captureView.species || '')}">
                  ${escapeHtml(captureView.species || 'Pokémon rencontré')}
                </div>
                <div class="pta-capture-subtitle">${escapeHtml(captureSpeciesStatus)}</div>
              </div>
              <span class="pta-badge ${captureMeta.tone}">${escapeHtml(captureMeta.label)}</span>
            </div>

            <div class="pta-capture-grid">
              <div class="pta-capture-stat">
                <div class="pta-label">Chance</div>
                <strong>${escapeHtml(captureChanceLabel)}</strong>
              </div>
              <div class="pta-capture-stat">
                <div class="pta-label">Ball</div>
                <strong title="${escapeHtml(captureBallLabel)}">${escapeHtml(captureBallLabel)}</strong>
              </div>
              <div class="pta-capture-stat">
                <div class="pta-label">Tentatives</div>
                <strong>${escapeHtml(captureAttemptsLabel)}</strong>
              </div>
            </div>

            ${captureView.captureChance != null ? `
              <div class="pta-capture-progress" title="Chance de capture ${escapeHtml(captureChanceLabel)}">
                <span style="width: ${captureProgress}%"></span>
              </div>
            ` : ''}

            <div class="pta-capture-reason">
              <strong>${escapeHtml(captureModeLabel())}</strong> ·
              ${escapeHtml(captureView.reason || 'Aucune raison disponible')}
            </div>

            <div class="pta-chip-row">
              ${captureView.rarity ? chipHtml(`Rareté · ${captureView.rarity}`) : ''}
              ${captureView.ivScore != null ? chipHtml(`IV · ${captureView.ivScore}`) : ''}
              ${captureView.ballReserve != null ? chipHtml(`Réserve min · ${config.minBallReserve}`) : ''}
            </div>
          </section>
        ` : ''}

        <div class="pta-actions">
          <button class="pta-action-btn primary" data-action="run">▶ Exécuter un cycle</button>
          <button class="pta-action-btn" data-action="ranking">☷ Classement</button>
        </div>

        <div class="pta-section-title">Surveillance</div>

        <details data-section="modules" ${detailsState.modules ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Modules</span>
            <span class="pta-summary-meta">${activeModules.length} actifs</span>
          </summary>
          <div class="pta-modules">
            ${modulesHtml || '<div class="pta-module"><span class="pta-module-name">Aucun module actif</span></div>'}
          </div>
        </details>

        <details data-section="intelligence" ${intelligenceOpen ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Décisions intelligentes</span>
            <span class="pta-summary-meta">${missionPlan.viability || '—'}</span>
          </summary>
          <div class="pta-modules">
            <div class="pta-module">
              <span class="pta-mini-dot ${goalConfidenceTone}"></span>
              <span class="pta-module-name">Goal Planner</span>
              <span class="pta-module-status" title="${escapeHtml(goal.step?.reason || '')}">
                ${escapeHtml(goal.step?.title || 'Observation')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${backgroundTone}"></span>
              <span class="pta-module-name">Observation</span>
              <span
                class="pta-module-status"
                title="${escapeHtml(
                  background.lastError ||
                  background.lastUrl ||
                  (config.backgroundHttpMode
                    ? 'GET same-origin parsés hors écran'
                    : 'Navigation visible utilisée pour collecter les informations')
                )}"
              >
                ${escapeHtml(backgroundLabel)} · ${background.gets || 0}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${transportTone}"></span>
              <span class="pta-module-name">Transport</span>
              <span
                class="pta-module-status"
                title="${escapeHtml(
                  transport.lastError ||
                  transport.lastEndpoint ||
                  (config.directHttpActions
                    ? 'POST same-origin depuis les formulaires observés'
                    : 'Interactions DOM classiques')
                )}"
              >
                ${escapeHtml(transportLabel)} · ${transport.requests || 0}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot current"></span>
              <span class="pta-module-name">Orchestrateur</span>
              <span class="pta-module-status" title="${escapeHtml(state.orchestrator?.lastReason || '')}">
                ${escapeHtml(state.orchestrator?.lastDecision || 'En attente')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${missionPlan.viability === 'blocked' ? 'danger' : missionPlan.viability === 'viable' ? 'ready' : ''}"></span>
              <span class="pta-module-name">Plan équipe</span>
              <span class="pta-module-status" title="${escapeHtml(team.join(', ') || 'À confirmer')}">
                ${escapeHtml(team.join(', ') || 'À confirmer')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${captureTone}"></span>
              <span class="pta-module-name">Capture</span>
              <span class="pta-module-status" title="${escapeHtml(captureView.reason || '')}">
                ${escapeHtml(captureLabel)}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot"></span>
              <span class="pta-module-name">Dernière action</span>
              <span class="pta-module-status" title="${escapeHtml(state.lastAction || '')}">
                ${escapeHtml(state.lastAction || 'Aucune')}
              </span>
            </div>
          </div>
        </details>

        <div class="pta-section-title">Réglages</div>

        <details data-section="automation" ${detailsState.automation ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Automatisation</span>
            <span class="pta-summary-meta">
              ${enabledOptionCount(activityKeys)}/${activityKeys.length}
            </span>
          </summary>
          <div class="pta-settings">
            ${optionButton('autoClaimExpeditions', 'Récompenses')}
            ${optionButton('autoStartExpeditions', 'Expéditions')}
            ${optionButton('autoHeal', 'Soins')}
            ${optionButton('autoHarvest', 'Serre')}
            ${optionButton('autoIncubatorClaim', 'Incubateur')}
            ${optionButton('autoBreedingClaim', 'Pension')}
            ${optionButton('autoProgression', 'Progression')}
            ${optionButton('autoGyms', 'Arènes auto')}
            ${optionButton('autoPlant', 'Replanter')}

            <div class="pta-stepper">
              <div class="pta-stepper-label">
                PV minimum Arènes
                <small>Le défi quotidien n’est lancé qu’avec une équipe suffisamment saine</small>
              </div>
              <div class="pta-stepper-value">${config.minGymHpPercent}%</div>
              <div class="pta-stepper-controls">
                <button class="pta-stepper-btn" data-action="gym-hp-dec" title="Réduire le seuil de PV">−</button>
                <button class="pta-stepper-btn" data-action="gym-hp-inc" title="Augmenter le seuil de PV">+</button>
              </div>
            </div>
          </div>
        </details>

        <details data-section="smart-settings" ${detailsState['smart-settings'] ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Intelligence</span>
            <span class="pta-summary-meta">
              ${enabledOptionCount(intelligenceKeys)}/${intelligenceKeys.length}
            </span>
          </summary>
          <div class="pta-settings">
            <div class="pta-settings-note">
              <strong>GET silencieux</strong> lit les pages en arrière-plan sans te déplacer.
              <strong>POST direct</strong> exécute ensuite les formulaires serveur observés.
            </div>
            ${optionButton('smartTeam', 'Équipe intelligente')}
            ${optionButton('backgroundHttpMode', 'GET silencieux en arrière-plan')}
            ${optionButton('directHttpActions', 'POST HTTP directs')}

            <div class="pta-stepper">
              <div class="pta-stepper-label">
                Rafraîchissement GET
                <small>Intervalle normal entre deux observations arrière-plan</small>
              </div>
              <div class="pta-stepper-value">${config.backgroundRefreshSeconds}s</div>
              <div class="pta-stepper-controls">
                <button class="pta-stepper-btn" data-action="background-refresh-dec" title="Rafraîchir plus souvent">−</button>
                <button class="pta-stepper-btn" data-action="background-refresh-inc" title="Rafraîchir moins souvent">+</button>
              </div>
            </div>
          </div>
        </details>

        <details data-section="pokemon-settings" ${detailsState['pokemon-settings'] ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Progression Pokémon</span>
            <span class="pta-summary-meta">
              ${config.autoLevelPokemon && config.autoEvolvePokemon
                ? 'Renfort + évolution'
                : config.autoLevelPokemon
                  ? 'Renfort'
                  : config.autoEvolvePokemon
                    ? 'Évolution'
                    : 'Manuel'}
            </span>
          </summary>
          <div class="pta-settings">
            <div class="pta-settings-note">
              Le bot attend la fin d’une expédition active et privilégie les Pokémon utiles au plan courant.
              Une évolution à plusieurs branches reste toujours manuelle.
            </div>
            ${optionButton('autoLevelPokemon', 'Renforcement auto')}
            ${optionButton('autoEvolvePokemon', 'Évolution auto')}
            ${optionButton('preserveEvolutionCandies', 'Réserver bonbons évolution')}

            <div class="pta-stepper">
              <div class="pta-stepper-label">
                Réserve Poussière
                <small>Le renforcement ne descend pas sous cette réserve</small>
              </div>
              <div class="pta-stepper-value">${config.minStardustReserve}</div>
              <div class="pta-stepper-controls">
                <button class="pta-stepper-btn" data-action="stardust-reserve-dec" title="Réduire la réserve">−</button>
                <button class="pta-stepper-btn" data-action="stardust-reserve-inc" title="Augmenter la réserve">+</button>
              </div>
            </div>
          </div>
        </details>

        <details data-section="capture-settings" ${detailsState['capture-settings'] ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Captures</span>
            <span class="pta-summary-meta">${escapeHtml(captureModeLabel())}</span>
          </summary>
          <div class="pta-settings">
            <div class="pta-settings-note">
              <strong>Capture auto</strong> autorise le bot à lancer une Ball.
              <strong>Capture intelligente</strong> applique ensuite les critères ci-dessous.
              Par défaut, un Pokémon explicitement déjà possédé est bloqué avant les critères Rare/IV.
            </div>
            ${optionButton('autoCapture', 'Capture auto')}
            ${optionButton('smartCapture', 'Capture intelligente')}
            ${optionButton('captureNewSpecies', 'Nouvelles espèces')}
            ${optionButton('captureRare', 'Rares')}
            ${optionButton('captureOwnedDuplicates', 'Autoriser doublons rares / IV')}
            ${optionButton('captureUnknownEncounters', 'Inconnues')}

            <div class="pta-stepper">
              <div class="pta-stepper-label">
                Réserve minimale
                <small>Ne pas consommer les dernières Balls</small>
              </div>
              <div class="pta-stepper-value">${config.minBallReserve}</div>
              <div class="pta-stepper-controls">
                <button class="pta-stepper-btn" data-action="capture-reserve-dec" title="Réduire la réserve">−</button>
                <button class="pta-stepper-btn" data-action="capture-reserve-inc" title="Augmenter la réserve">+</button>
              </div>
            </div>

            <div class="pta-stepper">
              <div class="pta-stepper-label">
                IV minimum
                <small>Critère utilisé si les IV sont visibles</small>
              </div>
              <div class="pta-stepper-value">${config.minCaptureIvScore}</div>
              <div class="pta-stepper-controls">
                <button class="pta-stepper-btn" data-action="capture-iv-dec" title="Réduire le seuil IV">−</button>
                <button class="pta-stepper-btn" data-action="capture-iv-inc" title="Augmenter le seuil IV">+</button>
              </div>
            </div>
          </div>
        </details>

        <div class="pta-footer">
          Goal Planner v0.9 · GitHub Raw · actions destructrices bloquées
        </div>
      </div>

      <div class="pta-body pta-log-page" data-panel-page="logs" ${panelView === 'dashboard' ? 'hidden' : ''}>
        <div class="pta-log-toolbar">
          <div class="pta-log-toolbar-copy">
            <strong>Journal d’actions</strong>
            <small>${logEntries.length} entrée${logEntries.length > 1 ? 's' : ''} · 120 maximum</small>
          </div>
          <button class="pta-log-clear" data-action="clear-logs">Vider</button>
        </div>
        <div class="pta-log-list">
          ${logsHtml}
        </div>
      </div>
    `;

    // Restaurer immédiatement la position de lecture après le remplacement du
    // DOM. Le premier rendu reste naturellement positionné en haut.
    if (hadRenderedBody) {
      const nextBody = panel.querySelector('.pta-body:not([hidden])');
      if (nextBody) {
        nextBody.scrollTop = Math.min(
          previousScrollTop,
          Math.max(0, nextBody.scrollHeight - nextBody.clientHeight)
        );
      }
    }
  }

// ---- src/main.js ----
GM_registerMenuCommand('Activer / désactiver PokéTaka Automation', () => setEnabled(!config.enabled));
  GM_registerMenuCommand('Exécuter un cycle maintenant', () => cycle(true));
  GM_registerMenuCommand('Diagnostiquer le timer de la page', () => {
    const current = moduleFromLocation();
    if (!current) {
      console.info('[PokéTaka Auto] Aucun module reconnu sur cette page.');
      return;
    }

    const timerInfo = findModuleCountdown(current);
    const status = state.moduleStatus?.[current.id] || {};
    console.group(`[PokéTaka Auto] Diagnostic timer — ${current.label}`);
    console.log('Module:', current);
    console.log('Timer détecté:', timerInfo || 'aucun');
    console.log('État mémorisé:', status);
    console.log('Échéance affichée:', status.nextDueAt ? formatRemaining(status.nextDueAt) : 'aucune');
    console.groupEnd();
  });

  GM_registerMenuCommand('Afficher le classement des expéditions', () => {
    const ranking = rankExpeditions();
    if (!ranking.length) {
      console.info('[PokéTaka Auto] Aucune expédition lançable détectée sur cette page.');
      return;
    }
    console.table(ranking.map(item => ({
      expedition: item.title,
      score: item.score,
      chance: item.chance ?? '?',
      niveauConseille: item.requiredLevel ?? '?',
      equipe: item.teamPlan?.known
        ? item.teamPlan.team.map(pokemon => pokemon.name).join(', ') || 'aucune'
        : 'à confirmer',
      equipeViable: item.teamPlan?.viable ?? '?',
      scoreEquipe: item.teamPlan?.teamScore ?? '?',
      dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
      recompenses: item.rewardScore,
      nouvelle: item.newProgression,
      raisons: item.reasons.join(' | '),
    })));
  });
  GM_registerMenuCommand('Réinitialiser la configuration', () => {
    config = { ...DEFAULT_CONFIG };
    saveConfig(config);
    updatePanel();
    schedule();
  });

  const observer = new MutationObserver(() => {
    ensurePanel();
    if (config.enabled && recentBotAction(3500)) {
      // Permet d'enchaîner rapidement une confirmation/modal sans spammer la page.
      clearTimeout(timer);
      timer = setTimeout(cycle, 900);
    }
  });

  ensurePanel();
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(() => {
    if (document.visibilityState === 'visible') updatePanel();
  }, 1000);
  if (config.enabled) cycle();

})();
