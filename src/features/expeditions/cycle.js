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
          navigate: true,
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
    const resultState = expeditionResultState(document);
    if (resultState.hasClaim) {
      appendActionLog(
        'warning',
        'state',
        'Retour expéditions refusé: récompenses encore à récupérer',
        { pathname: location.pathname }
      );
      setExpeditionPhase('due');
      return false;
    }

    const link = expeditionIndexLink();
    if (!link) return false;

    resetCaptureDecision('leaving_resolved_result');
    clearExpeditionSelection('leaving_resolved_result');
    setExpeditionPhase('ready_to_start', {
      title: null,
      resultUrl: null,
      dueAt: null,
    });
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

      resetCaptureDecision('visible_expedition_index_without_active');
      clearExpeditionSelection('visible_expedition_index_without_active');
      setExpeditionPhase('ready_to_start', {
        title: null,
        resultUrl: null,
        dueAt: null,
      });

      return startExpedition();
    }

    if (isExpeditionResultPage()) {
      recordExpeditionOutcome();
      const resultState = reconcileExpeditionResultState(document, 'visible_result');

      if (!['claiming', 'awaiting_capture'].includes(cycleState.phase)) {
        setExpeditionPhase('result');
      }

      if (resultState.hasCapture && resultPageHasPendingCapture()) {
        const handledCapture = await captureEncounter();
        if (handledCapture) return true;

        if (expeditionCycle().phase === 'awaiting_capture') {
          return false;
        }
      }

      if (resultState.hasClaim) {
        const claimed = await claimExpedition();
        if (claimed) return true;

        // Invariant: a visible /claim form always wins over any stale local
        // phase such as ready_to_start or claiming.
        setExpeditionPhase('due');
        return false;
      }

      const currentCycle = expeditionCycle();
      const claimGracePassed = now() - (currentCycle.lastTransitionAt || 0) > 2500;
      if (
        claimGracePassed &&
        (
          resultState.rewardsRecovered ||
          currentCycle.phase === 'claiming' ||
          resultPageLooksResolved()
        )
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
