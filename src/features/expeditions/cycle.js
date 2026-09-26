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
      'lancer pokeball',
      'lancer une pokeball',
      'throw pokeball',
      'fuir',
      'run away',
    ]);

    return button?.closest('article, section, .card, div') || null;
  }

  function readBallReserve() {
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

  function captureContext() {
    const root = resultEncounterRoot();
    if (!root) return null;

    const text = normalizeText(root.innerText || root.textContent || '');
    const captureButton = findClickable([
      'capturer',
      'capture',
      'lancer pokeball',
      'lancer une pokeball',
      'throw pokeball',
    ], root, { exclude: ['chance de capture', 'taux de capture'] }) ||
      findClickable([
        'capturer',
        'lancer pokeball',
        'lancer une pokeball',
        'throw pokeball',
      ]);

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
      root.querySelector('h1, h2, h3, strong')?.textContent?.trim() ||
      'Pokémon rencontré';

    let isNew =
      parseOptionalBoolean(root.getAttribute('data-new-species')) ??
      parseOptionalBoolean(root.getAttribute('data-new'));

    const owned =
      parseOptionalBoolean(root.getAttribute('data-owned')) ??
      parseOptionalBoolean(root.getAttribute('data-captured'));

    if (isNew == null && owned != null) isNew = !owned;
    if (isNew == null && /nouvelle espece|premiere capture|jamais capture|non capture|new species|first capture/.test(text)) {
      isNew = true;
    }
    if (isNew == null && /deja capture|deja possede|already caught|already owned/.test(text)) {
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
      captureButton,
      skipButton,
      species: String(species).trim(),
      isNew,
      rarity,
      ivScore: parseNumber(ivRaw),
      ballReserve: readBallReserve(),
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
        action: 'skip',
        reason: `Réserve de Balls protégée (${context.ballReserve} ≤ ${config.minBallReserve})`,
      };
    }

    if (!config.smartCapture) {
      return { action: 'capture', reason: 'Mode capture simple' };
    }

    if (config.captureNewSpecies && context.isNew === true) {
      return { action: 'capture', reason: 'Nouvelle espèce' };
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
      return { action: 'capture', reason: 'Rencontre inconnue autorisée' };
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

  function expeditionTeamRequirement() {
    const form = document.querySelector('form.expedition-prep[data-team-builder]');
    if (!form) return null;

    const min = Number(form.getAttribute('data-team-min') || 1);
    const max = Number(form.getAttribute('data-team-max') || min);
    const selectedIds = [...form.querySelectorAll('[data-team-select]')]
      .map(select => select.value)
      .filter(Boolean);

    return { form, min, max, selected: selectedIds.length, selectedIds };
  }

  function canonicalType(value) {
    const type = normalizeText(value);
    const aliases = {
      fire: 'feu', water: 'eau', grass: 'plante', electric: 'electrik',
      ice: 'glace', fighting: 'combat', ground: 'sol', flying: 'vol',
      psychic: 'psy', bug: 'insecte', rock: 'roche', ghost: 'spectre',
      dark: 'tenebres', steel: 'acier', fairy: 'fee',
    };
    return aliases[type] || type;
  }

  function typeMultiplier(attacker, defender) {
    const atk = canonicalType(attacker);
    const def = canonicalType(defender);
    return TYPE_CHART[atk]?.[def] ?? 1;
  }

  function expeditionPreparationContext(requirement) {
    const root = requirement?.form?.closest('main') || document;
    const facts = {};

    root.querySelectorAll('.expedition-prep-facts > div').forEach(row => {
      const key = normalizeText(row.querySelector('dt')?.textContent || '');
      const value = normalizeText(row.querySelector('dd')?.textContent || '');
      if (key) facts[key] = value;
    });

    const typeText = facts['types principaux'] || facts.types || '';
    const missionTypes = typeText
      .split(/[,/]/)
      .map(canonicalType)
      .filter(Boolean);

    const recommendedLevel = parseNumber(
      (facts['niveau conseille'] || facts['niveau recommandé'] || '').match(/\d+(?:[.,]\d+)?/)?.[0]
    );

    return {
      title: normalizeText(root.querySelector('.page-header h1, h1')?.textContent || ''),
      missionTypes,
      recommendedLevel,
      durationMinutes: parseDurationMinutes(facts.duree || facts.duration || ''),
    };
  }

  function pokemonFromCard(card) {
    const hp = parseNumber(card.getAttribute('data-pokemon-hp')) || 0;
    const hpMax = parseNumber(card.getAttribute('data-pokemon-hp-max')) || hp || 1;
    return {
      card,
      id: card.getAttribute('data-pokemon-id') || '',
      name: card.getAttribute('data-pokemon-name') || normalizeText(card.textContent || ''),
      level: parseNumber(card.getAttribute('data-pokemon-level')) || 0,
      hp,
      hpMax,
      hpPercent: hpMax > 0 ? (hp / hpMax) * 100 : 0,
      types: (card.getAttribute('data-pokemon-types') || '')
        .split(/[\s,;/]+/)
        .map(canonicalType)
        .filter(Boolean),
      favorite: card.getAttribute('data-pokemon-favorite') === '1',
      heldItem: Boolean(card.getAttribute('data-pokemon-held-item')),
    };
  }

  function pokemonMatchupScore(pokemon, context) {
    if (!context.missionTypes.length || !pokemon.types.length) return 0;

    const multipliers = context.missionTypes.map(defender =>
      Math.max(...pokemon.types.map(attacker => typeMultiplier(attacker, defender)))
    );

    return multipliers.reduce((sum, value) => {
      if (value >= 2) return sum + 45;
      if (value > 1) return sum + 20;
      if (value === 0) return sum - 80;
      if (value < 1) return sum - 25;
      return sum;
    }, 0);
  }

  function rankAvailablePokemon(requirement) {
    if (!requirement?.form) return [];

    const context = expeditionPreparationContext(requirement);
    const selected = new Set(requirement.selectedIds || []);

    const ranking = [...requirement.form.querySelectorAll('[data-team-pokemon][data-pokemon-id]')]
      .map(pokemonFromCard)
      .filter(pokemon => pokemon.id && !selected.has(pokemon.id))
      .map(pokemon => {
        let score = pokemon.level * 12;
        const reasons = [`niveau ${pokemon.level}`];

        score += pokemon.hpPercent * 0.55;
        reasons.push(`PV ${Math.round(pokemon.hpPercent)}%`);

        if (pokemon.hpPercent < config.minTeamHpPercent) {
          score -= 1000;
          reasons.push(`PV sous ${config.minTeamHpPercent}%`);
        }

        if (context.recommendedLevel != null) {
          const delta = pokemon.level - context.recommendedLevel;
          if (delta >= 0) {
            const bonus = Math.min(80, 25 + delta * 8);
            score += bonus;
            reasons.push(`+${bonus} niveau adapté`);
          } else {
            const penalty = Math.min(500, Math.abs(delta) * 65);
            score -= penalty;
            reasons.push(`-${penalty} sous le niveau conseillé`);
          }
        }

        const matchup = pokemonMatchupScore(pokemon, context);
        score += matchup;
        if (matchup) reasons.push(`${matchup > 0 ? '+' : ''}${matchup} types`);

        if (pokemon.favorite) score += 5;
        if (pokemon.heldItem) score += 8;

        return {
          ...pokemon,
          score: Math.round(score),
          reasons,
          missionTypes: context.missionTypes,
          recommendedLevel: context.recommendedLevel,
        };
      })
      .sort((a, b) => b.score - a.score);

    if (config.debug && ranking.length) {
      console.table(ranking.map(item => ({
        pokemon: item.name,
        score: item.score,
        niveau: item.level,
        pv: Math.round(item.hpPercent) + '%',
        types: item.types.join(', '),
        mission: item.missionTypes.join(', '),
      })));
    }

    return ranking;
  }

  async function selectSmartPokemon(requirement) {
    const ranking = rankAvailablePokemon(requirement);
    const best = ranking.find(item => item.hpPercent >= config.minTeamHpPercent);
    if (!best) return false;

    state.smartTeam = {
      lastSelection: [...(state.smartTeam?.lastSelection || []), best.name],
      lastMissionTypes: best.missionTypes,
      lastRecommendedLevel: best.recommendedLevel,
    };
    saveState(state);

    const select = [...requirement.form.querySelectorAll('select[data-team-select]')]
      .find(input => !input.value && [...input.options].some(option => option.value === best.id));

    if (select) {
      select.value = best.id;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      state.lastAction = `Équipe intelligente: ${best.name} (score ${best.score})`;
      state.lastActionAt = now();
      state.lastBotClickAt = now();
      state.actions += 1;
      saveState(state);
      updatePanel();
      log('Équipe intelligente via select:', best);
      return true;
    }

    if (isVisible(best.card)) {
      return clickElement(
        best.card,
        `Équipe intelligente: ${best.name} (score ${best.score})`
      );
    }

    return false;
  }

  async function handleExpeditionPreparation() {
    if (!config.autoStartExpeditions) return false;

    const requirement = expeditionTeamRequirement();
    if (!requirement) return false;

    if (requirement.selected < requirement.min) {
      if (config.smartTeam) {
        const selected = await selectSmartPokemon(requirement);
        if (selected) {
          setExpeditionPhase('preparing');
          return true;
        }
      }

      const lastTeamButton = document.querySelector(
        'button[data-last-expedition-team][data-last-team-ids]'
      );

      if (lastTeamButton && isVisible(lastTeamButton)) {
        setExpeditionPhase('preparing');
        return clickElement(lastTeamButton, 'Application de la dernière équipe');
      }

      state.lastAction = `Préparation bloquée — équipe ${requirement.selected}/${requirement.min}`;
      saveState(state);
      updatePanel();
      return false;
    }

    const launchButton = findClickable([
      'lancer l expedition',
      'lancer expedition',
      'commencer l expedition',
      'commencer expedition',
      'confirmer le depart',
      'confirmer depart',
      'partir',
      'demarrer',
      'start expedition',
      'start',
    ], requirement.form, {
      exclude: ['annuler', 'cancel', 'acheter', 'buy'],
    });

    if (launchButton) {
      if (recentBotAction(1800)) return false;
      setExpeditionPhase('starting');
      return clickElement(launchButton, 'Lancement de l’expédition');
    }

    return false;
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
