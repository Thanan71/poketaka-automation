// ==UserScript==
// @name         PokéTaka Automation
// @namespace    https://github.com/Thanan71/poketaka-automation
// @version      0.7.1
// @description  Assistant d'automatisation DOM pour PokéTaka : expéditions, récompenses, soins, serre et progression.
// @author       Thanan71
// @match        https://poketaka.fr/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const VERSION = '0.7.1';
  const STORAGE_KEY = 'poketaka-automation:config';
  const STATE_KEY = 'poketaka-automation:state';

  const DEFAULT_CONFIG = {
    enabled: false,
    intervalMs: 15000,
    jitterMs: 3500,
    autoClaimExpeditions: true,
    autoStartExpeditions: true,
    autoHeal: true,
    autoHarvest: true,
    autoIncubatorClaim: true,
    autoBreedingClaim: true,
    autoProgression: true,
    strategy: 'progression',
    minSuccessChance: 55,
    avoidLongLowValue: true,
    smartTeam: true,
    minTeamHpPercent: 45,
    autoCapture: false,
    smartCapture: true,
    captureNewSpecies: true,
    captureRare: true,
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
      captureDecision: {
        action: 'none',
        reason: null,
        species: null,
      },
      expeditionStats: {},
      lastRecordedResultUrl: null,
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
    saveState(state);
    updatePanel();
    log('Cycle expédition:', state.expeditionCycle);
  }

  let config = loadConfig();
  let state = loadState();
  let running = false;
  let timer = null;

  function log(...args) {
    if (config.debug) console.log('[PokéTaka Auto]', ...args);
  }

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

  function clickableElements(root = document) {
    return [...root.querySelectorAll('button, a[href], input[type="submit"], input[type="button"], [role="button"]')]
      .filter(isVisible)
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
    if (!el || !isVisible(el) || isUnsafe(el)) return false;

    state.lastActionAt = now();
    state.lastBotClickAt = now();
    state.lastAction = actionName;
    state.actions += 1;
    markModuleAction(moduleFromLocation()?.id);
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

  async function claimExpedition() {
    if (!config.autoClaimExpeditions) return false;
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

  function resultEncounterRoot() {
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
      'lancer pokeball',
      'lancer une pokeball',
      'throw pokeball',
      'fuir',
      'run away',
    ]);

    return button?.closest('article, section, .card, div') || null;
  }

  function readBallReserve() {
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
    const match = pageText.match(/(?:poke ?ball|super ?ball|hyper ?ball|ball)[^\d]{0,15}(\d+)/i);
    return match ? Number(match[1]) : null;
  }

  function captureContext() {
    const root = resultEncounterRoot();
    if (!root) return null;

    const text = normalizeText(root.innerText || root.textContent || '');
    const captureButton = findClickable([
      'capturer',
      'capture',
      'lancer pokeball',
      'lancer une pokeball',
      'throw pokeball',
    ], root, { exclude: ['chance de capture', 'taux de capture'] }) ||
      findClickable([
        'capturer',
        'lancer pokeball',
        'lancer une pokeball',
        'throw pokeball',
      ]);

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
      root.querySelector('h1, h2, h3, strong')?.textContent?.trim() ||
      'Pokémon rencontré';

    let isNew =
      parseOptionalBoolean(root.getAttribute('data-new-species')) ??
      parseOptionalBoolean(root.getAttribute('data-new'));

    const owned =
      parseOptionalBoolean(root.getAttribute('data-owned')) ??
      parseOptionalBoolean(root.getAttribute('data-captured'));

    if (isNew == null && owned != null) isNew = !owned;
    if (isNew == null && /nouvelle espece|premiere capture|jamais capture|non capture|new species|first capture/.test(text)) {
      isNew = true;
    }
    if (isNew == null && /deja capture|deja possede|already caught|already owned/.test(text)) {
      isNew = false;
    }

    const rarity =
      normalizeText(root.getAttribute('data-rarity') || '') ||
      (text.match(/\b(commun|peu commun|rare|epique|legendaire|mythique|common|uncommon|epic|legendary|mythic)\b/)?.[1] || '');

    const ivRaw =
      root.getAttribute('data-iv-total') ||
      root.getAttribute('data-iv-score') ||
      text.match(/(?:iv|ivs)[^\d]{0,12}(\d+(?:[.,]\d+)?)/i)?.[1];

    return {
      root,
      captureButton,
      skipButton,
      species: String(species).trim(),
      isNew,
      rarity,
      ivScore: parseNumber(ivRaw),
      ballReserve: readBallReserve(),
      text,
    };
  }

  function decideCapture(context) {
    if (!context?.captureButton) {
      return { action: 'none', reason: 'Aucun bouton de capture visible' };
    }

    if (!config.autoCapture) {
      return { action: 'manual', reason: 'Captures automatiques désactivées' };
    }

    if (
      context.ballReserve != null &&
      context.ballReserve <= config.minBallReserve
    ) {
      return {
        action: 'skip',
        reason: `Réserve de Balls protégée (${context.ballReserve} ≤ ${config.minBallReserve})`,
      };
    }

    if (!config.smartCapture) {
      return { action: 'capture', reason: 'Mode capture simple' };
    }

    if (config.captureNewSpecies && context.isNew === true) {
      return { action: 'capture', reason: 'Nouvelle espèce' };
    }

    if (
      config.captureRare &&
      /rare|epique|legendaire|mythique|epic|legendary|mythic/.test(context.rarity)
    ) {
      return { action: 'capture', reason: `Rareté: ${context.rarity}` };
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
      return { action: 'capture', reason: 'Rencontre inconnue autorisée' };
    }

    return {
      action: context.skipButton ? 'skip' : 'manual',
      reason: context.isNew === false
        ? 'Doublon sans critère prioritaire'
        : 'Informations insuffisantes pour consommer une Ball',
    };
  }

  function resultPageHasPendingCapture() {
    const context = captureContext();
    return Boolean(context?.captureButton || context?.skipButton);
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

  function expeditionTeamRequirement() {
    const form = document.querySelector('form.expedition-prep[data-team-builder]');
    if (!form) return null;

    const min = Number(form.getAttribute('data-team-min') || 1);
    const max = Number(form.getAttribute('data-team-max') || min);
    const selectedIds = [...form.querySelectorAll('[data-team-select]')]
      .map(select => select.value)
      .filter(Boolean);

    return { form, min, max, selected: selectedIds.length, selectedIds };
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

  function expeditionPreparationContext(requirement) {
    const root = requirement?.form?.closest('main') || document;
    const facts = {};

    root.querySelectorAll('.expedition-prep-facts > div').forEach(row => {
      const key = normalizeText(row.querySelector('dt')?.textContent || '');
      const value = normalizeText(row.querySelector('dd')?.textContent || '');
      if (key) facts[key] = value;
    });

    const typeText = facts['types principaux'] || facts.types || '';
    const missionTypes = typeText
      .split(/[,/]/)
      .map(canonicalType)
      .filter(Boolean);

    const recommendedLevel = parseNumber(
      (facts['niveau conseille'] || facts['niveau recommandé'] || '').match(/\d+(?:[.,]\d+)?/)?.[0]
    );

    return {
      title: normalizeText(root.querySelector('.page-header h1, h1')?.textContent || ''),
      missionTypes,
      recommendedLevel,
      durationMinutes: parseDurationMinutes(facts.duree || facts.duration || ''),
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

  function pokemonMatchupScore(pokemon, context) {
    if (!context.missionTypes.length || !pokemon.types.length) return 0;

    const multipliers = context.missionTypes.map(defender =>
      Math.max(...pokemon.types.map(attacker => typeMultiplier(attacker, defender)))
    );

    return multipliers.reduce((sum, value) => {
      if (value >= 2) return sum + 45;
      if (value > 1) return sum + 20;
      if (value === 0) return sum - 80;
      if (value < 1) return sum - 25;
      return sum;
    }, 0);
  }

  function rankAvailablePokemon(requirement) {
    if (!requirement?.form) return [];

    const context = expeditionPreparationContext(requirement);
    const selected = new Set(requirement.selectedIds || []);

    const ranking = [...requirement.form.querySelectorAll('[data-team-pokemon][data-pokemon-id]')]
      .map(pokemonFromCard)
      .filter(pokemon => pokemon.id && !selected.has(pokemon.id))
      .map(pokemon => {
        let score = pokemon.level * 12;
        const reasons = [`niveau ${pokemon.level}`];

        score += pokemon.hpPercent * 0.55;
        reasons.push(`PV ${Math.round(pokemon.hpPercent)}%`);

        if (pokemon.hpPercent < config.minTeamHpPercent) {
          score -= 1000;
          reasons.push(`PV sous ${config.minTeamHpPercent}%`);
        }

        if (context.recommendedLevel != null) {
          const delta = pokemon.level - context.recommendedLevel;
          if (delta >= 0) {
            const bonus = Math.min(80, 25 + delta * 8);
            score += bonus;
            reasons.push(`+${bonus} niveau adapté`);
          } else {
            const penalty = Math.min(500, Math.abs(delta) * 65);
            score -= penalty;
            reasons.push(`-${penalty} sous le niveau conseillé`);
          }
        }

        const matchup = pokemonMatchupScore(pokemon, context);
        score += matchup;
        if (matchup) reasons.push(`${matchup > 0 ? '+' : ''}${matchup} types`);

        if (pokemon.favorite) score += 5;
        if (pokemon.heldItem) score += 8;

        return {
          ...pokemon,
          score: Math.round(score),
          reasons,
          missionTypes: context.missionTypes,
          recommendedLevel: context.recommendedLevel,
        };
      })
      .sort((a, b) => b.score - a.score);

    if (config.debug && ranking.length) {
      console.table(ranking.map(item => ({
        pokemon: item.name,
        score: item.score,
        niveau: item.level,
        pv: Math.round(item.hpPercent) + '%',
        types: item.types.join(', '),
        mission: item.missionTypes.join(', '),
      })));
    }

    return ranking;
  }

  async function selectSmartPokemon(requirement) {
    const ranking = rankAvailablePokemon(requirement);
    const best = ranking.find(item => item.hpPercent >= config.minTeamHpPercent);
    if (!best) return false;

    state.smartTeam = {
      lastSelection: [...(state.smartTeam?.lastSelection || []), best.name],
      lastMissionTypes: best.missionTypes,
      lastRecommendedLevel: best.recommendedLevel,
    };
    saveState(state);

    const select = [...requirement.form.querySelectorAll('select[data-team-select]')]
      .find(input => !input.value && [...input.options].some(option => option.value === best.id));

    if (select) {
      select.value = best.id;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      state.lastAction = `Équipe intelligente: ${best.name} (score ${best.score})`;
      state.lastActionAt = now();
      state.lastBotClickAt = now();
      state.actions += 1;
      saveState(state);
      updatePanel();
      log('Équipe intelligente via select:', best);
      return true;
    }

    if (isVisible(best.card)) {
      return clickElement(
        best.card,
        `Équipe intelligente: ${best.name} (score ${best.score})`
      );
    }

    return false;
  }

  async function handleExpeditionPreparation() {
    if (!config.autoStartExpeditions) return false;

    const requirement = expeditionTeamRequirement();
    if (!requirement) return false;

    if (requirement.selected < requirement.min) {
      if (config.smartTeam) {
        const selected = await selectSmartPokemon(requirement);
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
      if (recentBotAction(1800)) return false;
      setExpeditionPhase('starting');
      return clickElement(launchButton, 'Lancement de l’expédition');
    }

    return false;
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

  async function captureEncounter() {
    const context = captureContext();
    if (!context) return false;

    const decision = decideCapture(context);
    state.captureDecision = {
      action: decision.action,
      reason: decision.reason,
      species: context.species,
    };
    saveState(state);
    updatePanel();

    if (decision.action === 'capture' && context.captureButton) {
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
    }

    return false;
  }

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

  function expeditionCards() {
    // Sélecteur natif PokéTaka : les missions lançables se trouvent dans le
    // catalogue "available" et possèdent un lien /prepare.
    const exact = [...document.querySelectorAll(
      '.mission-catalog[data-panel="available"] .mission-card, .mission-catalog__grid > .mission-card'
    )]
      .filter(isVisible)
      .filter(card => Boolean(expeditionPrepareLink(card)));

    if (exact.length) return exact;

    // Fallback pour rester compatible si le HTML du site évolue.
    const candidates = [...document.querySelectorAll(
      'article, section, li, .card, [class*="card"], [class*="expedition"], [data-expedition], [data-route]'
    )]
      .filter(isVisible)
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

  function analyzeExpedition(card, index, pageContext) {
    const detailsTrigger = card.querySelector('[data-open-dialog]');
    const detailsId = detailsTrigger?.getAttribute('data-open-dialog');
    const details = detailsId ? document.getElementById(detailsId) : null;

    // PokéTaka place les informations de chance/niveau dans un dialog adjacent
    // qui n'est pas visible tant que l'utilisateur ne l'ouvre pas.
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
    const completed = pageContext.historyTitles?.has(title) || isPreviouslyCompleted(text);
    const newProgression = !completed || isNewProgression(text);
    const stats = state.expeditionStats?.[title] || {};
    const failureStreak = Number(stats.failureStreak || 0);
    const startButton = expeditionPrepareLink(card);

    let score = progressionRank * 6;
    const reasons = [];

    if (newProgression) {
      score += 180;
      reasons.push('+180 nouvelle progression');
    }

    if (completed) {
      score -= 45;
      reasons.push('-45 déjà terminée');
    }

    if (failureStreak > 0) {
      const failurePenalty = failureStreak >= 2
        ? 650 + (failureStreak - 2) * 180
        : 180;
      score -= failurePenalty;
      reasons.push(`-${failurePenalty} échecs consécutifs (${failureStreak})`);
    }

    if (chance != null) {
      const encounterBonus = chance * 0.45;
      score += encounterBonus;
      reasons.push(`+${Math.round(encounterBonus)} potentiel rencontre ${chance}%`);
    }

    if (requiredLevel != null && pageContext.teamLevel != null) {
      const delta = pageContext.teamLevel - requiredLevel;
      if (delta >= 0) {
        score += Math.min(80, delta * 8 + 20);
        reasons.push(`niveau OK +${Math.round(delta)}`);
      } else {
        score -= Math.min(350, Math.abs(delta) * 45);
        reasons.push(`niveau insuffisant ${Math.round(delta)}`);
      }
    }

    score += rewardScore;
    if (rewardScore > 0) reasons.push(`+${Math.round(rewardScore)} récompenses`);

    if (durationMinutes != null) {
      const speedBonus = Math.max(-100, 90 - Math.log2(durationMinutes + 1) * 18);
      score += speedBonus;
      reasons.push(`${speedBonus >= 0 ? '+' : ''}${Math.round(speedBonus)} durée ${Math.round(durationMinutes)} min`);

      if (config.avoidLongLowValue && durationMinutes >= 240 && rewardScore < 35 && !newProgression) {
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
      teamLevel: pageContext.teamLevel,
      rewardScore: Math.round(rewardScore),
      progressionRank,
      newProgression,
      completed,
      failureStreak,
      energyCost: costs.energy,
      energyAvailable: pageContext.resources.energy,
      score: Math.round(score),
      reasons,
    };
  }

  function rankExpeditions() {
    const cards = expeditionCards();
    const pageText = normalizeText(document.body?.innerText || '');
    const historyTitles = new Set(
      [...document.querySelectorAll('.mission-archives a strong')]
        .map(element => normalizeText(element.textContent || ''))
        .filter(Boolean)
    );

    const pageContext = {
      // Le catalogue n'expose pas le niveau réel de l'équipe disponible.
      // Ne jamais le déduire du texte des missions : "Niveau conseillé"
      // appartient à la destination, pas à l'équipe du joueur.
      teamLevel: null,
      resources: parseAvailableResources(pageText),
      historyTitles,
    };

    const ranking = cards
      .map((card, index) => analyzeExpedition(card, index, pageContext))
      .filter(item => item.button)
      .sort((a, b) => b.score - a.score);

    if (config.debug && ranking.length) {
      console.table(ranking.map(item => ({
        expedition: item.title,
        score: item.score,
        zone: item.progressionRank,
        chance: item.chance ?? '?',
        niveauRequis: item.requiredLevel ?? '?',
        niveauEquipe: item.teamLevel ?? '?',
        dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
        recompenses: item.rewardScore,
        energie: item.energyCost ?? '?',
        nouvelle: item.newProgression,
        terminee: item.completed,
      })));
      log('Classement expéditions', ranking.map(item => ({
        title: item.title,
        score: item.score,
        reasons: item.reasons,
      })));
    }

    return ranking;
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

    let selected = ranking[0];

    // En mode progression, privilégie la destination la plus avancée
    // parmi celles qui restent dans le seuil de réussite configuré.
    if (config.strategy === 'progression') {
      const viableProgression = ranking
        .filter(item => item.failureStreak < 2)
        .sort((a, b) => {
          if (a.index !== b.index) return b.index - a.index;
          if (a.progressionRank !== b.progressionRank) return b.progressionRank - a.progressionRank;
          return b.score - a.score;
        });

      if (viableProgression.length) selected = viableProgression[0];
    }

    state.selectedExpedition = selected.title;
    state.selectedExpeditionScore = selected.score;
    saveState(state);
    updatePanel();

    setExpeditionPhase('preparing', {
      title: selected.title,
      resultUrl: null,
      dueAt: null,
    });

    return clickElement(
      selected.button,
      `Préparation optimale: ${selected.title} (score ${selected.score})`
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

  function moduleEnabled(moduleId) {
    const rules = {
      expeditions: config.autoClaimExpeditions || config.autoStartExpeditions,
      healing: config.autoHeal,
      greenhouse: config.autoHarvest || config.autoPlant,
      incubator: config.autoIncubatorClaim,
      breeding: config.autoBreedingClaim,
      progression: config.autoProgression,
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
      .map(module => {
        const anchor = navLinkForModule(module);
        if (!anchor) return null;

        const status = state.moduleStatus?.[module.id] || {};
        let score = 0;
        const reasons = [];

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

    if (
      isExpeditionResultPage() ||
      isExpeditionPreparePage() ||
      isExpeditionIndexPage() ||
      ['due', 'ready_to_start', 'preparing', 'starting'].includes(expeditionState.phase)
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

    return plan.sort((a, b) => b.priority - a.priority);
  }

  function recordOrchestratorDecision(candidate) {
    state.orchestrator = {
      lastDecision: candidate?.name || 'wait',
      lastReason: candidate?.reason || 'aucune action nécessaire',
      lastPriority: candidate?.priority || 0,
    };
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

  GM_addStyle(`
    #pta-panel {
      --pta-bg: rgba(10, 16, 28, .96);
      --pta-card: rgba(255,255,255,.055);
      --pta-border: rgba(255,255,255,.10);
      --pta-text: #f8fafc;
      --pta-muted: #94a3b8;
      --pta-green: #22c55e;
      --pta-amber: #f59e0b;
      --pta-red: #ef4444;
      --pta-blue: #60a5fa;
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      width: min(356px, calc(100vw - 24px));
      overflow: hidden;
      border-radius: 18px;
      background: var(--pta-bg);
      color: var(--pta-text);
      font: 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 18px 60px rgba(0,0,0,.42);
      border: 1px solid var(--pta-border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    #pta-panel * { box-sizing: border-box; }
    #pta-panel button, #pta-panel summary { font: inherit; }
    #pta-panel button { -webkit-tap-highlight-color: transparent; }
    #pta-panel .pta-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 13px;
      border-bottom: 1px solid var(--pta-border);
    }
    #pta-panel .pta-brand {
      min-width: 0;
      flex: 1;
    }
    #pta-panel .pta-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 14px;
      font-weight: 760;
      letter-spacing: -.01em;
    }
    #pta-panel .pta-version {
      color: var(--pta-muted);
      font-size: 10px;
      font-weight: 600;
    }
    #pta-panel .pta-subtitle {
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-dot {
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: var(--pta-red);
      box-shadow: 0 0 0 3px rgba(239,68,68,.12);
    }
    #pta-panel .pta-dot[data-on="true"] {
      background: var(--pta-green);
      box-shadow: 0 0 0 3px rgba(34,197,94,.12);
    }
    #pta-panel .pta-icon-btn {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border: 1px solid var(--pta-border);
      border-radius: 9px;
      background: rgba(255,255,255,.04);
      color: var(--pta-muted);
      cursor: pointer;
    }
    #pta-panel .pta-icon-btn:hover { background: rgba(255,255,255,.09); color: var(--pta-text); }
    #pta-panel .pta-body { padding: 12px; }
    #pta-panel[data-collapsed="true"] .pta-body { display: none; }
    #pta-panel[data-collapsed="true"] { width: 270px; }
    #pta-panel .pta-master {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 12px;
      border: 1px solid rgba(239,68,68,.26);
      border-radius: 12px;
      background: rgba(239,68,68,.09);
      color: var(--pta-text);
      cursor: pointer;
      text-align: left;
      font-weight: 700;
    }
    #pta-panel .pta-master[data-on="true"] {
      border-color: rgba(34,197,94,.28);
      background: rgba(34,197,94,.10);
    }
    #pta-panel .pta-master-state { color: var(--pta-muted); font-size: 11px; font-weight: 600; }
    #pta-panel .pta-master[data-on="true"] .pta-master-state { color: #86efac; }
    #pta-panel .pta-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 9px;
    }
    #pta-panel .pta-card {
      min-width: 0;
      padding: 9px 10px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      background: var(--pta-card);
    }
    #pta-panel .pta-card-wide { grid-column: 1 / -1; }
    #pta-panel .pta-label {
      color: var(--pta-muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .045em;
      text-transform: uppercase;
    }
    #pta-panel .pta-value {
      margin-top: 3px;
      min-width: 0;
      font-size: 12px;
      font-weight: 650;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-value small { color: var(--pta-muted); font-size: 10px; font-weight: 600; }
    #pta-panel .pta-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      margin-top: 9px;
    }
    #pta-panel .pta-action-btn {
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      padding: 8px 9px;
      background: rgba(255,255,255,.055);
      color: var(--pta-text);
      cursor: pointer;
      font-weight: 650;
    }
    #pta-panel .pta-action-btn:hover { background: rgba(255,255,255,.10); }
    #pta-panel .pta-action-btn.primary {
      border-color: rgba(96,165,250,.28);
      background: rgba(96,165,250,.10);
    }
    #pta-panel details {
      margin-top: 9px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      overflow: hidden;
      background: rgba(255,255,255,.025);
    }
    #pta-panel summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      list-style: none;
      padding: 9px 10px;
      cursor: pointer;
      color: #cbd5e1;
      font-weight: 700;
      user-select: none;
    }
    #pta-panel summary::-webkit-details-marker { display: none; }
    #pta-panel summary::after { content: "▾"; color: var(--pta-muted); }
    #pta-panel details[open] summary::after { content: "▴"; }
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
      gap: 8px;
      min-width: 0;
      border: 1px solid var(--pta-border);
      border-radius: 9px;
      padding: 8px 9px;
      background: rgba(255,255,255,.035);
      color: #cbd5e1;
      cursor: pointer;
      text-align: left;
    }
    #pta-panel .pta-toggle-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #pta-panel .pta-switch {
      width: 26px;
      height: 15px;
      padding: 2px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: #475569;
    }
    #pta-panel .pta-switch::after {
      content: "";
      display: block;
      width: 11px;
      height: 11px;
      border-radius: 999px;
      background: white;
      transition: transform .16s ease;
    }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch { background: var(--pta-green); }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch::after { transform: translateX(11px); }
    #pta-panel .pta-modules { padding: 0 9px 9px; }
    #pta-panel .pta-module {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 1px;
      color: #cbd5e1;
      border-top: 1px solid rgba(255,255,255,.055);
    }
    #pta-panel .pta-module:first-child { border-top: 0; }
    #pta-panel .pta-module-name { flex: 1; }
    #pta-panel .pta-module-status { color: var(--pta-muted); font-size: 11px; text-align: right; }
    #pta-panel .pta-mini-dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: #64748b;
    }
    #pta-panel .pta-mini-dot.ready { background: var(--pta-green); }
    #pta-panel .pta-mini-dot.wait { background: var(--pta-amber); }
    #pta-panel .pta-mini-dot.current { background: var(--pta-blue); }
    #pta-panel .pta-footer {
      margin-top: 9px;
      color: #64748b;
      text-align: center;
      font-size: 10px;
    }
    @media (max-width: 520px) {
      #pta-panel { right: 8px; bottom: 8px; width: calc(100vw - 16px); }
      #pta-panel[data-collapsed="true"] { width: 240px; }
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
          chance: item.chance ?? '?',
          niveauRequis: item.requiredLevel ?? '?',
          niveauEquipe: item.teamLevel ?? '?',
          dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
          recompenses: item.rewardScore,
          nouvelle: item.newProgression,
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

    const detailsState = {};
    panel.querySelectorAll('details[data-section]').forEach(details => {
      detailsState[details.dataset.section] = details.open;
    });

    const current = moduleFromLocation();
    const next = nextDueModule();
    const nextText = next
      ? `${next.module.label} · ${formatRemaining(next.dueAt)}`
      : 'Aucune échéance connue';

    const modulesHtml = MODULES
      .filter(module => moduleEnabled(module.id))
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

    panel.dataset.collapsed = String(Boolean(config.panelCollapsed));
    panel.innerHTML = `
      <div class="pta-header">
        <span class="pta-dot" data-on="${config.enabled}"></span>
        <div class="pta-brand">
          <div class="pta-title">PokéTaka Automation <span class="pta-version">v${VERSION}</span></div>
          <div class="pta-subtitle">${config.enabled ? 'Pilotage actif' : 'En pause'} · ${escapeHtml(current?.label || 'Page PokéTaka')}</div>
        </div>
        <button class="pta-icon-btn" data-action="collapse" title="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau" aria-label="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau">
          ${config.panelCollapsed ? '▣' : '—'}
        </button>
      </div>

      <div class="pta-body">
        <button class="pta-master" data-action="enabled" data-on="${config.enabled}">
          <span>${config.enabled ? 'Automatisation active' : 'Automatisation en pause'}</span>
          <span class="pta-master-state">${config.enabled ? 'ON' : 'OFF'}</span>
        </button>

        <div class="pta-overview">
          <div class="pta-card">
            <div class="pta-label">Prochaine échéance</div>
            <div class="pta-value">${escapeHtml(nextText)}</div>
          </div>
          <div class="pta-card">
            <div class="pta-label">Actions</div>
            <div class="pta-value">${state.actions} <small>· ${escapeHtml(formatRelativeTime(state.lastActionAt))}</small></div>
          </div>
          <div class="pta-card pta-card-wide">
            <div class="pta-label">Dernière action</div>
            <div class="pta-value" title="${escapeHtml(state.lastAction)}">${escapeHtml(state.lastAction || 'Aucune')}</div>
          </div>
          <div class="pta-card">
            <div class="pta-label">Cycle expédition</div>
            <div class="pta-value">${escapeHtml(expeditionPhaseLabel(expeditionCycle().phase))}</div>
          </div>
          <div class="pta-card">
            <div class="pta-label">Cible</div>
            <div class="pta-value" title="${escapeHtml(state.selectedExpedition || '')}">
              ${escapeHtml(state.selectedExpedition || 'Aucune')}
              ${state.selectedExpeditionScore != null ? `<small> · ${state.selectedExpeditionScore}</small>` : ''}
            </div>
          </div>
        </div>

        <div class="pta-actions">
          <button class="pta-action-btn primary" data-action="run">▶ Exécuter maintenant</button>
          <button class="pta-action-btn" data-action="ranking">☷ Voir le classement</button>
        </div>

        <details data-section="modules" ${detailsState.modules ? 'open' : ''}>
          <summary>Modules surveillés</summary>
          <div class="pta-modules">
            ${modulesHtml || '<div class="pta-module"><span class="pta-module-name">Aucun module actif</span></div>'}
          </div>
        </details>

        <details data-section="intelligence" ${detailsState.intelligence ? 'open' : ''}>
          <summary>Décisions intelligentes</summary>
          <div class="pta-modules">
            <div class="pta-module">
              <span class="pta-mini-dot current"></span>
              <span class="pta-module-name">Orchestrateur</span>
              <span class="pta-module-status" title="${escapeHtml(state.orchestrator?.lastReason || '')}">
                ${escapeHtml(state.orchestrator?.lastDecision || 'En attente')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot"></span>
              <span class="pta-module-name">Équipe</span>
              <span class="pta-module-status">
                ${escapeHtml((state.smartTeam?.lastSelection || []).slice(-3).join(', ') || '—')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${state.captureDecision?.action === 'capture' ? 'ready' : ''}"></span>
              <span class="pta-module-name">Capture</span>
              <span class="pta-module-status" title="${escapeHtml(state.captureDecision?.reason || '')}">
                ${escapeHtml(
                  state.captureDecision?.species
                    ? `${state.captureDecision.species}: ${state.captureDecision.action}`
                    : '—'
                )}
              </span>
            </div>
          </div>
        </details>

        <details data-section="settings" ${detailsState.settings ? 'open' : ''}>
          <summary>Réglages automatiques</summary>
          <div class="pta-settings">
            ${optionButton('autoClaimExpeditions', 'Récompenses')}
            ${optionButton('autoStartExpeditions', 'Expéditions')}
            ${optionButton('autoHeal', 'Soins')}
            ${optionButton('autoHarvest', 'Serre')}
            ${optionButton('autoIncubatorClaim', 'Incubateur')}
            ${optionButton('autoBreedingClaim', 'Pension')}
            ${optionButton('autoProgression', 'Progression')}
            ${optionButton('smartTeam', 'Équipe intelligente')}
            ${optionButton('autoCapture', 'Captures auto')}
            ${optionButton('smartCapture', 'Capture intelligente')}
            ${optionButton('captureNewSpecies', 'Nouvelles espèces')}
            ${optionButton('captureRare', 'Rares')}
            ${optionButton('captureUnknownEncounters', 'Captures inconnues')}
            ${optionButton('autoPlant', 'Replanter')}
          </div>
        </details>

        <div class="pta-footer">Orchestrateur v0.7 · équipe intelligente · captures prudentes · actions destructrices bloquées</div>
      </div>
    `;
  }

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
      niveauRequis: item.requiredLevel ?? '?',
      niveauEquipe: item.teamLevel ?? '?',
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
