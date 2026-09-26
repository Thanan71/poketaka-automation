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
