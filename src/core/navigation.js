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
      (config.autoLevelPokemon || config.autoEvolvePokemon) &&
      (isCollectionIndexPage() || isPokemonProfilePage()) &&
      (
        pokemonProgressionScanDue() ||
        ['scanning', 'opening_profile', 'level_ready', 'evolution_ready', 'scanned', 'blocked', 'manual'].includes(
          pokemonProgressionState().phase
        )
      )
    ) {
      plan.push({
        name: 'pokemon-progression',
        priority: 6750,
        reason: pokemonProgressionState().reason || 'progression Pokémon intelligente',
        run: handlePokemonProgression,
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
