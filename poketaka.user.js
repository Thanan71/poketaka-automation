// ==UserScript==
// @name         PokéTaka Automation
// @namespace    https://github.com/Thanan71/poketaka-automation
// @version      0.1.0
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

  const VERSION = '0.1.0';
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
    autoCapture: false,
    autoPlant: false,
    debug: true,
  };

  const NAV_TARGETS = [
    ['expedition', 'expeditions', 'exploration'],
    ['centre pokemon', 'pokemon center', 'soins', 'heal'],
    ['serre', 'greenhouse'],
    ['incubateur', 'incubator', 'oeufs', 'eggs', 'fossiles', 'fossils'],
    ['pension', 'daycare', 'elevage', 'breeding'],
    ['arene', 'gym', 'ligue', 'league'],
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
    const candidates = [...document.querySelectorAll('article, section, li, .card, [class*="card"], [class*="expedition"]')]
      .filter(isVisible)
      .filter(el => {
        const text = elementText(el);
        return text.includes('expedition') || text.includes('route') || text.includes('chemin') || text.includes('path');
      });

    const seen = new Set();
    return candidates.filter(el => {
      const key = el.textContent?.slice(0, 150);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async function startExpedition() {
    if (!config.autoStartExpeditions) return false;

    const cards = expeditionCards();
    const startPatterns = [
      'lancer expedition', 'lancer l expedition', 'partir', 'demarrer',
      'start expedition', 'start', 'depart', 'envoyer equipe', 'send team',
    ];

    // Progression-first: prend le dernier contenu disponible dans le DOM.
    for (const card of [...cards].reverse()) {
      const button = findClickable(startPatterns, card, {
        exclude: ['verrouille', 'locked', 'indisponible', 'unavailable'],
      });
      if (button) return clickElement(button, 'Lancement expédition');
    }

    const fallback = findAllClickables(startPatterns, document, {
      exclude: ['verrouille', 'locked', 'indisponible', 'unavailable'],
    });
    if (!fallback.length) return false;
    return clickElement(fallback[fallback.length - 1], 'Lancement expédition');
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

  async function navigateToNextModule() {
    const anchors = [...document.querySelectorAll('a[href]')]
      .filter(isVisible)
      .filter(a => {
        try {
          const url = new URL(a.href, location.href);
          return url.origin === location.origin && url.pathname !== location.pathname;
        } catch {
          return false;
        }
      });

    for (let offset = 0; offset < NAV_TARGETS.length; offset += 1) {
      const index = (state.navIndex + offset) % NAV_TARGETS.length;
      const keywords = NAV_TARGETS[index].map(normalizeText);
      const anchor = anchors.find(a => {
        const text = elementText(a);
        const href = normalizeText(a.getAttribute('href') || '');
        return keywords.some(k => text.includes(k) || href.includes(k));
      });

      if (anchor) {
        state.navIndex = (index + 1) % NAV_TARGETS.length;
        saveState(state);
        return clickElement(anchor, `Navigation: ${NAV_TARGETS[index][0]}`);
      }
    }

    return false;
  }

  async function cycle() {
    if (!config.enabled || running) return;
    running = true;

    try {
      if (location.pathname === '/' || location.pathname.includes('/login')) {
        log('Page publique/login détectée : aucune automatisation.');
        return;
      }

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
        navigateToNextModule,
      ];

      for (const action of actions) {
        try {
          if (await action()) return;
        } catch (error) {
          console.error('[PokéTaka Auto] Erreur action', action.name, error);
        }
      }

      state.lastAction = 'Aucune action disponible';
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
      <div class="pta-status">Dernière action : <strong>${state.lastAction}</strong><br>Actions : ${state.actions}</div>
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
