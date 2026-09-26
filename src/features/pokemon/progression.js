function pokemonProgressionState() {
  if (!state.pokemonProgression || typeof state.pokemonProgression !== 'object') {
    state.pokemonProgression = {
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
    };
  }
  return state.pokemonProgression;
}

function setPokemonProgression(patch = {}) {
  state.pokemonProgression = {
    ...pokemonProgressionState(),
    ...patch,
  };
  saveState(state);
  updatePanel();
}

function pokemonNumber(value) {
  if (value == null) return null;
  const match = String(value).replace(/ /g, ' ').match(/-?d[ds]*(?:[.,]d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(/s/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function isCollectionIndexPage() {
  return /^/collection/?$/.test(location.pathname);
}

function isPokemonProfilePage() {
  return Boolean(
    /^/collection/[^/]+/?$/.test(location.pathname) &&
    document.querySelector('#pokemon-profile-section')
  );
}

function pokemonProfileId() {
  if (!isPokemonProfilePage()) return null;
  return location.pathname.split('/').filter(Boolean)[1] || null;
}

function collectionPokemonRecords() {
  if (!isCollectionIndexPage()) return [];

  return [...document.querySelectorAll('a.pokemon-record[href*="/collection/"]')]
    .filter(isVisible)
    .map(card => {
      let id = null;
      try {
        const url = new URL(card.href, location.href);
        id = url.pathname.split('/').filter(Boolean)[1] || null;
      } catch {}

      return {
        id,
        name: card.querySelector('.pokemon-record__name-row h2, h2')?.textContent?.trim() || 'Pokémon',
        level: pokemonNumber(card.querySelector('.pokemon-record__level')?.textContent) || 0,
        types: [...card.querySelectorAll('.type-icon img[alt]')]
          .map(img => canonicalType(img.alt))
          .filter(Boolean),
        favorite: Boolean(card.querySelector('[aria-label="Favori"]')),
        href: card.href,
        card,
      };
    })
    .filter(record => record.id);
}

function pokemonProfileContext() {
  if (!isPokemonProfilePage()) return null;

  const root = document.querySelector('#pokemon-profile-section');
  const resourceStrip = document.querySelector('.pokemon-resource-strip');
  const name = root?.querySelector('#pokemon-profile-title')?.textContent?.trim() || 'Pokémon';
  const level = pokemonNumber(root?.querySelector('.pokemon-profile__level-badge strong')?.textContent);
  const hpProgress = root?.querySelector('progress.pokemon-health');
  const badges = normalizeText(
    [...(root?.querySelectorAll('.pokemon-profile__badges .status-badge') || [])]
      .map(node => node.textContent || '')
      .join(' ')
  );

  let stardust = null;
  let candies = null;
  let candyName = null;

  resourceStrip?.querySelectorAll(':scope > div').forEach(row => {
    const label = row.querySelector('span')?.textContent?.trim() || '';
    const value = pokemonNumber(row.querySelector('strong')?.textContent);
    const normalized = normalizeText(label);

    if (normalized.includes('poussiere etoile')) stardust = value;
    if (normalized.includes('bonbons')) {
      candies = value;
      candyName = label;
    }
  });

  return {
    id: pokemonProfileId(),
    name,
    level,
    hpPercent: hpProgress ? Number(hpProgress.value || 0) : null,
    inActivity:
      badges.includes('en expedition') ||
      Boolean(document.querySelector(
        '#pokemon-level-dialog .form-help, #pokemon-evolution-dialog .form-help'
      ) && /participe actuellement a une activite/.test(normalizeText(
        document.querySelector(
          '#pokemon-level-dialog .form-help, #pokemon-evolution-dialog .form-help'
        )?.textContent || ''
      ))),
    stardust,
    candies,
    candyName,
  };
}

function gameplayRequirementInfo(node) {
  if (!node) return null;
  return {
    label: node.querySelector('strong')?.textContent?.trim() || 'Ressource',
    required: pokemonNumber(node.querySelector('.gameplay-requirement__required')?.textContent),
    available: pokemonNumber(node.querySelector('.gameplay-requirement__available')?.textContent),
    missing: node.classList.contains('gameplay-requirement--missing'),
  };
}

function pokemonLevelUpOption() {
  const dialog = document.querySelector('#pokemon-level-dialog');
  const form = dialog?.querySelector('form[action*="/level-up"]');
  if (!dialog || !form) {
    return {
      available: false,
      reason: dialog?.querySelector('.form-help')?.textContent?.trim() || 'Renforcement indisponible',
    };
  }

  const submit = form.querySelector('button[data-level-up-submit][type="submit"], button.primary-button[type="submit"]');
  const targetLevel = pokemonNumber(form.querySelector('input[name="target_level"]')?.value);
  const currentLevel = pokemonNumber(
    form.querySelector('[data-level-up-level-change] dd span')?.textContent
  );
  const requirements = [...form.querySelectorAll('.gameplay-requirement')]
    .map(gameplayRequirementInfo)
    .filter(Boolean);
  const stardust = requirements.find(requirement =>
    normalizeText(requirement.label).includes('poussiere')
  );
  const candy = requirements.find(requirement =>
    normalizeText(requirement.label).includes('bonbon')
  );
  const hasMissing = requirements.some(requirement => requirement.missing);

  const reserveSafe =
    stardust?.required == null ||
    stardust?.available == null ||
    stardust.available - stardust.required >= config.minStardustReserve;

  return {
    available: Boolean(submit && !submit.disabled && !hasMissing && reserveSafe),
    dialog,
    form,
    submit,
    currentLevel,
    targetLevel,
    requirements,
    stardust,
    candy,
    reserveSafe,
    reason: hasMissing
      ? 'Ressources insuffisantes'
      : !reserveSafe
        ? `Réserve de Poussière protégée (${config.minStardustReserve})`
        : targetLevel
          ? `Renforcement vers le niveau ${targetLevel}`
          : 'Renforcement disponible',
  };
}

function pokemonEvolutionOptions() {
  const dialog = document.querySelector('#pokemon-evolution-dialog');
  if (!dialog) return [];

  return [...dialog.querySelectorAll('form[action*="/evolve"]')].map(form => {
    const panel = form.closest('[data-evolution-panel]') || form;
    const submit = form.querySelector('button.primary-button[type="submit"]');
    const current = panel.querySelector(
      '.evolution-comparison__pokemon:not(.evolution-comparison__pokemon--target) strong'
    )?.textContent?.trim() || null;
    const target = panel.querySelector(
      '.evolution-comparison__pokemon--target strong'
    )?.textContent?.trim() || null;
    const requirements = [...form.querySelectorAll('.gameplay-requirement')]
      .map(gameplayRequirementInfo)
      .filter(Boolean);
    const missing = requirements.some(requirement => requirement.missing);

    return {
      form,
      panel,
      submit,
      current,
      target,
      requirements,
      available: Boolean(submit && !submit.disabled && !missing),
      reason: missing
        ? requirements
            .filter(requirement => requirement.missing)
            .map(requirement => `${requirement.label} ${requirement.available ?? '?'} / ${requirement.required ?? '?'}`)
            .join(', ')
        : target
          ? `Évolution vers ${target}`
          : 'Évolution disponible',
    };
  });
}

function pokemonProgressionPriorityRecords(records) {
  const expeditionIds = new Set(state.expeditionPlan?.teamIds || []);
  const expeditionNames = new Set(
    (state.expeditionPlan?.team || []).map(normalizeText)
  );
  const gymNames = new Set(
    (gymCycle().selectedTeam || []).map(normalizeText)
  );
  const recommendedLevel = Number(state.smartTeam?.lastRecommendedLevel || 0);

  return records
    .map(record => {
      let priority = 0;
      const normalizedName = normalizeText(record.name);

      if (expeditionIds.has(record.id)) priority += 1200;
      if (expeditionNames.has(normalizedName)) priority += 900;
      if (gymNames.has(normalizedName)) priority += 850;
      if (record.favorite) priority += 220;

      if (recommendedLevel > 0 && record.level < recommendedLevel) {
        priority += 400 + (recommendedLevel - record.level) * 45;
      }

      priority += Math.min(250, record.level * 12);

      return { ...record, priority };
    })
    .sort((a, b) => b.priority - a.priority || b.level - a.level);
}

function resetPokemonProgressionScan() {
  setPokemonProgression({
    phase: 'scanning',
    targetId: null,
    targetName: null,
    targetLevel: null,
    action: null,
    reason: 'Recherche d’un renforcement ou d’une évolution utile',
    scannedIds: [],
    scanStartedAt: now(),
    blockedUntil: 0,
  });
}

function pokemonProgressionScanDue() {
  if (!config.autoLevelPokemon && !config.autoEvolvePokemon) return false;

  const progress = pokemonProgressionState();
  if (progress.blockedUntil && progress.blockedUntil > now()) return false;

  const goal = currentGoalPlan();
  const teamBlocked =
    state.expeditionPlan?.viability === 'blocked' ||
    gymCycle().phase === 'blocked';

  if (goal.step?.module === 'pokemon' || teamBlocked) return true;

  const age = now() - Number(progress.lastScanAt || 0);
  return age >= config.pokemonProgressionScanMinutes * 60 * 1000;
}

function markPokemonScanned(id, patch = {}) {
  const progress = pokemonProgressionState();
  const scanned = new Set(progress.scannedIds || []);
  if (id) scanned.add(id);

  setPokemonProgression({
    ...patch,
    scannedIds: [...scanned],
  });
}

function collectionReturnLink() {
  return [...document.querySelectorAll('a[href]')]
    .find(anchor => {
      try {
        const url = new URL(anchor.href, location.href);
        return url.origin === location.origin && /^/collection/?$/.test(url.pathname);
      } catch {
        return false;
      }
    }) || null;
}

async function openNextPokemonProgressionTarget() {
  const records = collectionPokemonRecords();
  if (!records.length) return false;

  const progress = pokemonProgressionState();
  const scanExpired =
    !progress.scanStartedAt ||
    now() - progress.scanStartedAt > config.pokemonProgressionScanMinutes * 60 * 1000;

  if (scanExpired) resetPokemonProgressionScan();

  const scanned = new Set(pokemonProgressionState().scannedIds || []);
  const candidates = pokemonProgressionPriorityRecords(records)
    .filter(record => !scanned.has(record.id));

  if (!candidates.length) {
    setPokemonProgression({
      phase: 'idle',
      targetId: null,
      targetName: null,
      targetLevel: null,
      action: null,
      reason: 'Analyse terminée · aucun renforcement sûr disponible',
      scannedIds: [],
      lastScanAt: now(),
      blockedUntil: now() + config.pokemonProgressionScanMinutes * 60 * 1000,
    });
    return false;
  }

  const target = candidates[0];
  setPokemonProgression({
    phase: 'opening_profile',
    targetId: target.id,
    targetName: target.name,
    targetLevel: target.level,
    action: 'inspect',
    reason: `Inspection de ${target.name} niveau ${target.level}`,
  });

  return clickElement(target.card, `Progression Pokémon: inspecter ${target.name}`);
}

async function handlePokemonProfileProgression() {
  const context = pokemonProfileContext();
  if (!context) return false;

  const progress = pokemonProgressionState();
  const alreadyScanned = (progress.scannedIds || []).includes(context.id);

  if (alreadyScanned) {
    const back = collectionReturnLink();
    return back
      ? clickElement(back, 'Progression Pokémon: retour à la collection')
      : false;
  }

  if (context.inActivity) {
    markPokemonScanned(context.id, {
      phase: 'blocked',
      targetId: context.id,
      targetName: context.name,
      targetLevel: context.level,
      action: 'skip',
      reason: `${context.name} participe actuellement à une activité`,
    });

    const back = collectionReturnLink();
    return back
      ? clickElement(back, `Progression Pokémon: ${context.name} occupé`)
      : false;
  }

  const evolutions = pokemonEvolutionOptions();
  const affordableEvolutions = evolutions.filter(option => option.available);

  if (config.autoEvolvePokemon && affordableEvolutions.length === 1) {
    const evolution = affordableEvolutions[0];
    const dialog = document.querySelector('#pokemon-evolution-dialog');

    if (!dialog?.open) {
      const opener = document.querySelector(
        '[data-open-dialog="pokemon-evolution-dialog"]'
      );
      if (opener && isVisible(opener)) {
        setPokemonProgression({
          phase: 'evolution_ready',
          targetId: context.id,
          targetName: context.name,
          targetLevel: context.level,
          action: 'evolve',
          reason: evolution.reason,
        });
        return clickElement(
          opener,
          `Progression Pokémon: préparer évolution de ${context.name}`
        );
      }
    }

    if (dialog?.open && evolution.submit && isVisible(evolution.submit)) {
      markPokemonScanned(context.id, {
        phase: 'evolving',
        targetId: context.id,
        targetName: context.name,
        targetLevel: context.level,
        action: 'evolve',
        reason: evolution.reason,
        lastEvolutionAt: now(),
      });
      return clickElement(
        evolution.submit,
        `Évolution: ${context.name} → ${evolution.target || 'évolution'}`
      );
    }
  }

  if (config.autoEvolvePokemon && affordableEvolutions.length > 1) {
    markPokemonScanned(context.id, {
      phase: 'manual',
      targetId: context.id,
      targetName: context.name,
      targetLevel: context.level,
      action: 'manual_evolution',
      reason: 'Plusieurs évolutions sont possibles · choix automatique refusé',
    });
    return false;
  }

  const level = pokemonLevelUpOption();

  if (config.autoLevelPokemon && level.available) {
    const dialog = document.querySelector('#pokemon-level-dialog');

    if (!dialog?.open) {
      const opener = document.querySelector(
        '[data-open-dialog="pokemon-level-dialog"]'
      );
      if (opener && isVisible(opener)) {
        setPokemonProgression({
          phase: 'level_ready',
          targetId: context.id,
          targetName: context.name,
          targetLevel: level.targetLevel,
          action: 'level_up',
          reason: level.reason,
        });
        return clickElement(
          opener,
          `Progression Pokémon: préparer renforcement de ${context.name}`
        );
      }
    }

    if (dialog?.open && level.submit && isVisible(level.submit)) {
      markPokemonScanned(context.id, {
        phase: 'leveling',
        targetId: context.id,
        targetName: context.name,
        targetLevel: level.targetLevel,
        action: 'level_up',
        reason: level.reason,
        lastUpgradeAt: now(),
      });
      return clickElement(
        level.submit,
        `Renforcement: ${context.name} → niveau ${level.targetLevel}`
      );
    }
  }

  const evolutionReason = evolutions.length
    ? evolutions.map(option => option.reason).filter(Boolean).join(' · ')
    : 'Aucune évolution exploitable';

  markPokemonScanned(context.id, {
    phase: 'scanned',
    targetId: context.id,
    targetName: context.name,
    targetLevel: context.level,
    action: 'none',
    reason: [
      config.autoEvolvePokemon ? evolutionReason : 'Évolution auto désactivée',
      config.autoLevelPokemon ? level.reason : 'Renforcement auto désactivé',
    ].filter(Boolean).join(' · '),
  });

  const back = collectionReturnLink();
  return back
    ? clickElement(back, `Progression Pokémon: ${context.name} analysé`)
    : false;
}

async function handlePokemonProgression() {
  if (!config.autoLevelPokemon && !config.autoEvolvePokemon) return false;

  if (isPokemonProfilePage()) {
    return handlePokemonProfileProgression();
  }

  if (isCollectionIndexPage()) {
    return openNextPokemonProgressionTarget();
  }

  return false;
}
