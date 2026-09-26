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

function selectedBallInfo(root = resultEncounterRoot()) {
  const form = captureForm(root);
  if (!form) {
    return {
      code: null,
      name: null,
      reserve: null,
      multiplierBps: null,
    };
  }

  const checked = form.querySelector('input[name="ball_code"]:checked');
  const label = checked?.closest('label');
  const selected = form.querySelector(
    '[data-capture-select-value], .capture-select__value'
  );

  const name =
    label?.querySelector('span')?.textContent?.trim() ||
    selected?.querySelector('span')?.textContent?.trim() ||
    checked?.value ||
    null;

  const countText =
    label?.querySelector('strong')?.textContent ||
    selected?.querySelector('strong')?.textContent ||
    '';
  const countMatch = countText.match(/\d+/);

  return {
    code: checked?.value || null,
    name,
    reserve: countMatch ? Number(countMatch[0]) : null,
    multiplierBps: parseNumber(checked?.getAttribute('data-multiplier-bps')),
  };
}

function readBallReserve(root = resultEncounterRoot()) {
  const selectedBall = selectedBallInfo(root);
  if (selectedBall.reserve != null) return selectedBall.reserve;

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
  const match = pageText.match(
    /(?:poke ?ball|super ?ball|hyper ?ball|ball)[^\d]{0,15}(\d+)/i
  );
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

function encounterOwnershipState(root, text = '') {
  if (!root) return null;

  const normalized = normalizeText(
    text || root.innerText || root.textContent || ''
  );

  let isNew =
    parseOptionalBoolean(root.getAttribute('data-new-species')) ??
    parseOptionalBoolean(root.getAttribute('data-new'));

  const owned =
    parseOptionalBoolean(root.getAttribute('data-owned')) ??
    parseOptionalBoolean(root.getAttribute('data-captured'));

  if (isNew == null && owned != null) isNew = !owned;

  if (
    isNew == null &&
    /absente? (?:du|au) pokedex|absent from pokedex|pas dans le pokedex|nouvelle espece|premiere capture|jamais capture|non capture|new species|first capture/.test(normalized)
  ) {
    isNew = true;
  }

  if (
    isNew == null &&
    /presente? (?:dans|au) (?:le )?pokedex|deja (?:dans|au) (?:le )?pokedex|deja capturee?|deja possedee?|already caught|already owned|already in (?:the )?pokedex/.test(normalized)
  ) {
    isNew = false;
  }

  return isNew;
}

function captureContext() {
  const root = resultEncounterRoot();
  if (!root) return null;

  const text = normalizeText(root.innerText || root.textContent || '');
  const captureButton = captureSubmitButton(root);
  const selectedBall = selectedBallInfo(root);

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

  const isNew = encounterOwnershipState(root, text);

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
    ballCode: selectedBall.code,
    ballName: selectedBall.name,
    ballReserve: selectedBall.reserve ?? readBallReserve(root),
    ballMultiplierBps: selectedBall.multiplierBps,
    captureChance: parseCaptureChance(root),
    attemptsRemaining: parseCaptureAttempts(root),
    text,
  };
}

function decideCapture(context) {
  if (!context?.captureButton && !context?.form) {
    return { action: 'none', reason: 'Aucune capture disponible' };
  }

  if (context.attemptsRemaining === 0) {
    return { action: 'none', reason: 'Aucune tentative restante' };
  }

  if (!config.autoCapture) {
    return { action: 'manual', reason: 'Capture auto désactivée' };
  }

  if (
    context.ballReserve != null &&
    context.ballReserve <= config.minBallReserve
  ) {
    return {
      action: context.skipButton ? 'skip' : 'ignore',
      reason: `Réserve protégée · ${context.ballReserve}/${config.minBallReserve}`,
    };
  }

  if (!config.smartCapture) {
    return {
      action: 'capture',
      reason: context.captureChance != null
        ? `Capture auto simple · ${context.captureChance}%`
        : 'Capture auto simple',
    };
  }

  if (
    context.isNew === false &&
    !config.captureOwnedDuplicates
  ) {
    return {
      action: context.skipButton ? 'skip' : 'ignore',
      reason: 'Déjà possédé · doublons bloqués',
    };
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
    return {
      action: 'capture',
      reason: context.captureChance != null
        ? `${context.rarity} · ${context.captureChance}%`
        : `Rareté · ${context.rarity}`,
    };
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
        ? `Rencontre inconnue · ${context.captureChance}%`
        : 'Rencontre inconnue autorisée',
    };
  }

  return {
    action: context.skipButton ? 'skip' : 'ignore',
    reason: context.isNew === false
      ? 'Déjà possédé · aucun critère doublon autorisé'
      : 'Aucun critère intelligent validé',
  };
}

function captureDecisionSnapshot(context, decision) {
  return {
    action: decision.action,
    reason: decision.reason,
    species: context?.species || null,
    isNew: context?.isNew ?? null,
    rarity: context?.rarity || null,
    ivScore: context?.ivScore ?? null,
    ballName: context?.ballName || null,
    ballCode: context?.ballCode || null,
    ballReserve: context?.ballReserve ?? null,
    captureChance: context?.captureChance ?? null,
    attemptsRemaining: context?.attemptsRemaining ?? null,
    updatedAt: now(),
  };
}

function resultPageHasPendingCapture() {
  const context = captureContext();
  return Boolean(context?.captureButton || context?.skipButton);
}

async function captureEncounter() {
  const context = captureContext();
  if (!context) return false;

  const decision = decideCapture(context);
  state.captureDecision = captureDecisionSnapshot(context, decision);

  if (decision.action === 'ignore' || decision.action === 'manual') {
    appendActionLog(
      decision.action === 'manual' ? 'warning' : 'info',
      'capture',
      `${decision.action === 'manual' ? 'Capture manuelle' : 'Capture ignorée'}: ${context.species}`,
      {
        reason: decision.reason,
        isNew: context.isNew,
        rarity: context.rarity,
        ivScore: context.ivScore,
      }
    );
  }

  saveState(state);
  updatePanel();

  if (decision.action === 'capture' && context.captureButton) {
    if (config.directHttpActions && context.form) {
      return submitObservedForm(
        context.form,
        `Capture HTTP: ${context.species} — ${decision.reason}`,
        { expectedKind: 'capture' }
      );
    }

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
    return false;
  }

  if (decision.action === 'ignore') {
    state.lastAction = `Capture laissée: ${context.species} — ${decision.reason}`;
    saveState(state);
    updatePanel();
  }

  return false;
}
