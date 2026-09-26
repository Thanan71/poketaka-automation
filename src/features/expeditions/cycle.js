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

  function readBallReserve(root = resultEncounterRoot()) {
    const form = captureForm(root);

    if (form) {
      const checked = form.querySelector('input[name="ball_code"]:checked');
      const checkedLabel = checked?.closest('label');
      const checkedCount = checkedLabel?.querySelector('strong')?.textContent || '';
      const checkedMatch = checkedCount.match(/\d+/);
      if (checkedMatch) return Number(checkedMatch[0]);

      const selectedCount = form.querySelector(
        '[data-capture-select-value] strong, .capture-select__value strong'
      )?.textContent || '';
      const selectedMatch = selectedCount.match(/\d+/);
      if (selectedMatch) return Number(selectedMatch[0]);
    }

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

  function captureContext() {
    const root = resultEncounterRoot();
    if (!root) return null;

    const text = normalizeText(root.innerText || root.textContent || '');
    const captureButton = captureSubmitButton(root);

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

    let isNew =
      parseOptionalBoolean(root.getAttribute('data-new-species')) ??
      parseOptionalBoolean(root.getAttribute('data-new'));

    const owned =
      parseOptionalBoolean(root.getAttribute('data-owned')) ??
      parseOptionalBoolean(root.getAttribute('data-captured'));

    if (isNew == null && owned != null) isNew = !owned;

    if (
      isNew == null &&
      /absente? du pokedex|absent from pokedex|nouvelle espece|premiere capture|jamais capture|non capture|new species|first capture/.test(text)
    ) {
      isNew = true;
    }

    if (
      isNew == null &&
      /presente? dans le pokedex|deja capture|deja possede|already caught|already owned/.test(text)
    ) {
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
      form: captureForm(root),
      captureButton,
      skipButton,
      species: String(species).trim(),
      isNew,
      rarity,
      ivScore: parseNumber(ivRaw),
      ballReserve: readBallReserve(root),
      captureChance: parseCaptureChance(root),
      attemptsRemaining: parseCaptureAttempts(root),
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
        action: context.skipButton ? 'skip' : 'manual',
        reason: `Réserve de Balls protégée (${context.ballReserve} ≤ ${config.minBallReserve})`,
      };
    }

    if (!config.smartCapture) {
      return { action: 'capture', reason: 'Mode capture simple' };
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
      return {
        action: 'capture',
        reason: context.captureChance != null
          ? `Rencontre inconnue autorisée · ${context.captureChance}%`
          : 'Rencontre inconnue autorisée',
      };
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
