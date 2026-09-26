// ==UserScript==
// @name         PokéTaka Automation
// @namespace    https://github.com/Thanan71/poketaka-automation
// @version      0.2.1
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

  const VERSION = '0.2.1';
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
    autoCapture: false,
    autoPlant: false,
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

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const now = () => Date.now();

  function normalizeText(value = '') {
    return String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
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
      ...(GM_getValue(STATE_KEY, {}) || {}),
    };
  }

  function saveState(state) {
    GM_setValue(STATE_KEY, state);
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
      'recuperer',
      'reclamer',
      'claim rewards',
      'claim',
      'terminer expedition',
      'complete expedition',
      'voir les resultats',
      'see results',
    ], document, { exclude: ['boutique', 'shop'] });
    return button ? clickElement(button, 'Récupération expédition') : false;
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
    if (!config.autoCapture) return false;
    const button = findClickable([
      'capturer',
      'capture',
      'lancer pokeball',
      'throw pokeball',
    ], document, { exclude: ['fuir', 'run', 'berry', 'baie'] });
    return button ? clickElement(button, 'Tentative de capture') : false;
  }

  function expeditionCards() {
    const startPatterns = [
      'lancer expedition', 'lancer l expedition', 'partir', 'demarrer',
      'start expedition', 'start', 'depart', 'envoyer equipe', 'send team',
    ];

    const candidates = [...document.querySelectorAll(
      'article, section, li, .card, [class*="card"], [class*="expedition"], [data-expedition], [data-route]'
    )]
      .filter(isVisible)
      .filter(el => findClickable(startPatterns, el, {
        exclude: ['verrouille', 'locked', 'indisponible', 'unavailable'],
      }));

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
      /(?:niveau|niv\.?|level|lvl\.?)\s*(?:requis|required|minimum|min)?\s*[:≥>=-]*\s*(\d+)/i,
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
    const text = normalizeText(card.innerText || card.textContent || '');
    const chance = parseChance(text);
    const durationMinutes = parseDurationMinutes(text);
    const requiredLevel = parseRequiredLevel(text);
    const rewardScore = parseRewardValue(text);
    const costs = parseResourceCost(text);
    const progressionRank = zoneRank(text, index);
    const newProgression = isNewProgression(text);
    const completed = isPreviouslyCompleted(text);
    const startButton = findClickable([
      'lancer expedition', 'lancer l expedition', 'partir', 'demarrer',
      'start expedition', 'start', 'depart', 'envoyer equipe', 'send team',
    ], card, {
      exclude: ['verrouille', 'locked', 'indisponible', 'unavailable'],
    });

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

    if (chance != null) {
      score += chance * 1.6;
      reasons.push(`+${Math.round(chance * 1.6)} chance ${chance}%`);

      if (chance < config.minSuccessChance) {
        score -= (config.minSuccessChance - chance) * 7;
        reasons.push(`risque élevé (<${config.minSuccessChance}%)`);
      }

      if (chance < 30) {
        score -= 500;
        reasons.push('-500 chance critique');
      }
    } else {
      score += 60;
      reasons.push('+60 chance inconnue');
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
      title: expeditionTitle(card, index),
      chance,
      durationMinutes,
      requiredLevel,
      teamLevel: pageContext.teamLevel,
      rewardScore: Math.round(rewardScore),
      progressionRank,
      newProgression,
      completed,
      energyCost: costs.energy,
      energyAvailable: pageContext.resources.energy,
      score: Math.round(score),
      reasons,
    };
  }

  function rankExpeditions() {
    const cards = expeditionCards();
    const pageText = normalizeText(document.body?.innerText || '');
    const pageContext = {
      teamLevel: parseTeamLevel(pageText),
      resources: parseAvailableResources(pageText),
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

    // En mode progression, une nouvelle zone viable est toujours préférée
    // à du farming si elle reste dans une plage de risque raisonnable.
    if (config.strategy === 'progression') {
      const viableNewProgression = ranking.find(item =>
        item.newProgression &&
        (item.chance == null || item.chance >= config.minSuccessChance) &&
        (item.requiredLevel == null || item.teamLevel == null || item.teamLevel >= item.requiredLevel)
      );
      if (viableNewProgression) selected = viableNewProgression;
    }

    state.selectedExpedition = selected.title;
    state.selectedExpeditionScore = selected.score;
    saveState(state);
    updatePanel();

    return clickElement(
      selected.button,
      `Expédition optimale: ${selected.title} (score ${selected.score})`
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

  function modulePageText() {
    const main = document.querySelector('main, [role="main"], #content, .content');
    return normalizeText((main || document.body)?.innerText || '');
  }

  function recordCurrentModuleStatus() {
    const current = moduleFromLocation();
    if (!current) return;

    const text = modulePageText();
    const countdownMs = parseCountdownMs(text);
    const previous = state.moduleStatus?.[current.id] || {};

    state.moduleStatus = {
      ...(state.moduleStatus || {}),
      [current.id]: {
        ...previous,
        lastVisitedAt: now(),
        nextDueAt: countdownMs ? now() + countdownMs : null,
      },
    };
    saveState(state);
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

  async function cycle() {
    if (!config.enabled || running) return;
    running = true;

    try {
      if (location.pathname === '/' || location.pathname.includes('/login')) {
        log('Page publique/login détectée : aucune automatisation.');
        return;
      }

      recordCurrentModuleStatus();

      const actions = [
        handleConfirmation,
        claimExpedition,
        claimIncubator,
        claimBreeding,
        harvestGreenhouse,
        captureEncounter,
        healTeam,
        autoProgression,
        startExpedition,
        plantGreenhouse,
        navigateWhenNeeded,
      ];

      for (const action of actions) {
        try {
          if (await action()) return;
        } catch (error) {
          console.error('[PokéTaka Auto] Erreur action', action.name, error);
        }
      }

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
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
      width: 300px; padding: 12px; border-radius: 14px;
      background: rgba(15, 23, 42, .96); color: #f8fafc;
      font: 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 10px 35px rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.12);
    }
    #pta-panel * { box-sizing: border-box; }
    #pta-panel h3 { margin: 0 0 8px; font-size: 15px; }
    #pta-panel .pta-status { margin-bottom: 8px; opacity: .9; }
    #pta-panel .pta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    #pta-panel button {
      width: 100%; border: 0; border-radius: 8px; padding: 7px 8px;
      cursor: pointer; background: #334155; color: white; text-align: left;
    }
    #pta-panel button[data-on="true"] { background: #166534; }
    #pta-panel .pta-main { margin-bottom: 8px; text-align: center; font-weight: 700; }
    #pta-panel .pta-main[data-on="true"] { background: #15803d; }
    #pta-panel .pta-main[data-on="false"] { background: #b91c1c; }
    #pta-panel .pta-foot { margin-top: 8px; font-size: 11px; opacity: .7; }
  `);

  function ensurePanel() {
    if (document.getElementById('pta-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'pta-panel';
    document.body.appendChild(panel);
    panel.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'enabled') setEnabled(!config.enabled);
      else if (action === 'run') cycle();
      else toggleOption(action);
    });
    updatePanel();
  }

  function optionButton(key, label) {
    return `<button data-action="${key}" data-on="${config[key]}">${config[key] ? '✓' : '○'} ${label}</button>`;
  }

  function updatePanel() {
    const panel = document.getElementById('pta-panel');
    if (!panel) return;
    panel.innerHTML = `
      <h3>PokéTaka Automation v${VERSION}</h3>
      <button class="pta-main" data-action="enabled" data-on="${config.enabled}">
        ${config.enabled ? 'AUTOMATISATION ACTIVE' : 'AUTOMATISATION ARRÊTÉE'}
      </button>
      <div class="pta-status">
        Dernière action : <strong>${state.lastAction}</strong><br>
        Actions : ${state.actions}<br>
        Cible : <strong>${state.selectedExpedition || '—'}</strong>
        ${state.selectedExpeditionScore != null ? `(score ${state.selectedExpeditionScore})` : ''}
      </div>
      <div class="pta-grid">
        ${optionButton('autoClaimExpeditions', 'Récompenses')}
        ${optionButton('autoStartExpeditions', 'Expéditions')}
        ${optionButton('autoHeal', 'Soins')}
        ${optionButton('autoHarvest', 'Serre')}
        ${optionButton('autoIncubatorClaim', 'Incubateur')}
        ${optionButton('autoBreedingClaim', 'Pension')}
        ${optionButton('autoProgression', 'Progression')}
        ${optionButton('autoCapture', 'Captures')}
        ${optionButton('autoPlant', 'Replanter')}
        <button data-action="run">▶ Cycle manuel</button>
      </div>
      <div class="pta-foot">Aucun appel API caché · aucun contournement de timer · aucun achat automatique</div>
    `;
  }

  GM_registerMenuCommand('Activer / désactiver PokéTaka Automation', () => setEnabled(!config.enabled));
  GM_registerMenuCommand('Exécuter un cycle maintenant', () => cycle());
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
  if (config.enabled) cycle();
})();
