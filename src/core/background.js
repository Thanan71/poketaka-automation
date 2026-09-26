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
  if (isExpeditionResultPage()) {
    return {
      title:
        document.querySelector('.page-header h1, main h1')?.textContent?.trim() ||
        expeditionCycle().title ||
        'Expédition terminée',
      resultUrl: location.href,
      dueAt: null,
      status: 'pending_result',
    };
  }

  const previous = expeditionCycle();
  const candidates = detachedResultCandidates(indexPage.doc);

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
