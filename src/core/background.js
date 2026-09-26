function backgroundSweepDue() {
  if (!config.backgroundHttpMode) return false;

  const last = Number(backgroundHttpState().lastSweepAt || 0);
  const interval = Math.max(10, Number(config.backgroundRefreshSeconds || 30)) * 1000;

  if (expeditionCycle().phase === 'due') return true;
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

async function backgroundObserveExpeditions() {
  const page = await fetchObservedPage('/expeditions', { cacheMs: 5000 });
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

  setExpeditionPhase('ready_to_start', {
    title: null,
    resultUrl: null,
    dueAt: null,
  });

  return { acted: false, page, active: null };
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

  if (!submitted) {
    setExpeditionPhase('ready_to_start', {
      title: null,
      resultUrl: null,
      dueAt: null,
    });
  }

  return submitted;
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

async function backgroundHandlePokemonProgression() {
  if (!config.autoLevelPokemon && !config.autoEvolvePokemon) return false;
  if (expeditionCycle().phase === 'running') {
    setPokemonProgression({
      phase: 'waiting_expedition',
      action: 'wait',
      reason: `Attente de la fin de ${expeditionCycle().title || 'l’expédition'} avant d’investir des ressources`,
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

      if (submitted) return true;
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

      if (submitted) return true;
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

  const expeditionObservation = await backgroundObserveExpeditions();
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

  if (pokemonProgressionScanDue()) {
    const pokemonAction = await backgroundHandlePokemonProgression();
    if (pokemonAction) return true;
  }

  return false;
}
