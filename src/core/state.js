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


  function emptyCaptureDecision() {
    return {
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
    };
  }

  function resetCaptureDecision(reason = null) {
    const previous = state.captureDecision || emptyCaptureDecision();
    const wasActive = previous.action !== 'none' || Boolean(previous.species);
    if (!wasActive) return false;

    state.captureDecision = {
      ...emptyCaptureDecision(),
      reason,
      updatedAt: now(),
    };

    saveState(state);

    if (wasActive) {
      appendActionLog(
        'info',
        'state',
        'État de capture réinitialisé',
        {
          previousAction: previous.action || 'none',
          previousSpecies: previous.species || null,
          reason,
        }
      );
    }

    return wasActive;
  }

  function clearExpeditionSelection(reason = null) {
    const previous = {
      selectedExpedition: state.selectedExpedition || null,
      selectedExpeditionScore: state.selectedExpeditionScore ?? null,
      planTitle: state.expeditionPlan?.title || null,
      planViability: state.expeditionPlan?.viability || null,
    };

    const hadSelection = Boolean(
      previous.selectedExpedition ||
      previous.planTitle ||
      previous.selectedExpeditionScore != null ||
      (previous.planViability && previous.planViability !== 'unknown')
    );
    if (!hadSelection) return false;

    state.selectedExpedition = null;
    state.selectedExpeditionScore = null;
    state.expeditionPlan = {
      title: null,
      team: [],
      teamIds: [],
      teamScore: null,
      viability: 'unknown',
      reason: reason || null,
      updatedAt: now(),
    };

    saveState(state);

    if (hadSelection) {
      appendActionLog(
        'info',
        'state',
        'Plan d’expédition périmé nettoyé',
        { ...previous, reason }
      );
    }

    return hadSelection;
  }

  function actionGuardEntries() {
    if (!state.actionGuards || typeof state.actionGuards !== 'object') {
      state.actionGuards = {};
    }
    return state.actionGuards;
  }

  function actionGuardRemaining(key, cooldownMs = 5000) {
    if (!key) return 0;
    const lastAt = Number(actionGuardEntries()[key] || 0);
    return Math.max(0, cooldownMs - (now() - lastAt));
  }

  function acquireActionGuard(key, cooldownMs = 5000) {
    if (!key) return true;

    const remaining = actionGuardRemaining(key, cooldownMs);
    if (remaining > 0) return false;

    const cutoff = now() - 60 * 60 * 1000;
    const entries = Object.entries(actionGuardEntries())
      .filter(([, at]) => Number(at) >= cutoff)
      .slice(-120);

    state.actionGuards = Object.fromEntries(entries);
    state.actionGuards[key] = now();
    saveState(state);
    return true;
  }

  function loadState() {
    return {
      lastActionAt: 0,
      lastAction: 'aucune',
      lastBotClickAt: 0,
      actionLog: [],
      actionGuards: {},
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
      captureDecision: emptyCaptureDecision(),
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
    const previous = { ...expeditionCycle() };
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
        `Cycle expédition: ${previous.phase || 'unknown'} → ${phase}`,
        {
          before: {
            phase: previous.phase || 'unknown',
            title: previous.title || null,
            resultUrl: previous.resultUrl || null,
            dueAt: previous.dueAt || null,
          },
          after: {
            phase: state.expeditionCycle.phase,
            title: state.expeditionCycle.title || null,
            resultUrl: state.expeditionCycle.resultUrl || null,
            dueAt: state.expeditionCycle.dueAt || null,
          },
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
