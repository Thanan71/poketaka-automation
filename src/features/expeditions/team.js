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

function parseMissionTypes(text = '') {
  const normalized = normalizeText(text);
  const aliases = [
    ['normal', ['normal']],
    ['feu', ['feu', 'fire']],
    ['eau', ['eau', 'water']],
    ['electrik', ['electrik', 'electric']],
    ['plante', ['plante', 'grass']],
    ['glace', ['glace', 'ice']],
    ['combat', ['combat', 'fighting']],
    ['poison', ['poison']],
    ['sol', ['sol', 'ground']],
    ['vol', ['vol', 'flying']],
    ['psy', ['psy', 'psychic']],
    ['insecte', ['insecte', 'bug']],
    ['roche', ['roche', 'rock']],
    ['spectre', ['spectre', 'ghost']],
    ['dragon', ['dragon']],
    ['tenebres', ['tenebres', 'dark']],
    ['acier', ['acier', 'steel']],
    ['fee', ['fee', 'fairy']],
  ];

  return aliases
    .filter(([, words]) => words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(normalized)))
    .map(([type]) => type);
}

function parseRequiredTeamSize(text = '') {
  return parseFirstMatch(normalizeText(text), [
    /(?:equipe|team)\s*[:=-]?\s*(\d+)\s*(?:pokemon|pokemons)?/i,
    /(?:pokemon|pokemons)\s*(?:requis|required)?\s*[:=-]?\s*(\d+)/i,
  ]) || 1;
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
  const missionTypes = parseMissionTypes(typeText);

  const recommendedLevel = parseNumber(
    (facts['niveau conseille'] || facts['niveau recommandé'] || '').match(/\d+(?:[.,]\d+)?/)?.[0]
  );

  return {
    title: normalizeText(root.querySelector('.page-header h1, h1')?.textContent || ''),
    missionTypes,
    recommendedLevel,
    durationMinutes: parseDurationMinutes(facts.duree || facts.duration || ''),
    teamSize: requirement?.min || parseRequiredTeamSize(facts.equipe || ''),
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

function serializablePokemon(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    level: pokemon.level,
    hp: pokemon.hp,
    hpMax: pokemon.hpMax,
    hpPercent: pokemon.hpPercent,
    types: pokemon.types,
    favorite: pokemon.favorite,
    heldItem: pokemon.heldItem,
  };
}

function scorePokemonForMission(pokemon, context) {
  let score = pokemon.level * 12;
  const reasons = [`niveau ${pokemon.level}`];

  score += pokemon.hpPercent * 0.55;
  reasons.push(`PV ${Math.round(pokemon.hpPercent)}%`);

  let viable = pokemon.hpPercent >= config.minTeamHpPercent;
  if (!viable) {
    score -= 1000;
    reasons.push(`PV sous ${config.minTeamHpPercent}%`);
  }

  if (context.recommendedLevel != null) {
    const delta = pokemon.level - context.recommendedLevel;

    if (delta >= 0) {
      const bonus = Math.min(90, 30 + delta * 9);
      score += bonus;
      reasons.push(`+${bonus} niveau adapté`);
    } else {
      const deficit = Math.abs(delta);
      const penalty = Math.min(700, deficit * 80);
      score -= penalty;
      reasons.push(`-${penalty} déficit niveau ${deficit}`);

      if (deficit > config.maxRecommendedLevelDeficit) {
        viable = false;
        reasons.push(`déficit > ${config.maxRecommendedLevelDeficit}`);
      }
    }
  }

  if (context.missionTypes?.length && pokemon.types?.length) {
    const offensive = context.missionTypes.reduce((sum, defender) => {
      const best = Math.max(
        ...pokemon.types.map(attacker => typeMultiplier(attacker, defender))
      );

      if (best >= 2) return sum + 50;
      if (best > 1) return sum + 20;
      if (best === 0) return sum - 90;
      if (best < 1) return sum - 30;
      return sum;
    }, 0);

    const defensive = context.missionTypes.reduce((sum, attacker) => {
      const received = pokemon.types.reduce(
        (multiplier, defender) => multiplier * typeMultiplier(attacker, defender),
        1
      );

      if (received === 0) return sum + 55;
      if (received <= 0.25) return sum + 40;
      if (received < 1) return sum + 25;
      if (received >= 4) return sum - 90;
      if (received > 1) return sum - 45;
      return sum;
    }, 0);

    score += offensive + defensive;
    if (offensive) reasons.push(`${offensive > 0 ? '+' : ''}${offensive} attaque/types`);
    if (defensive) reasons.push(`${defensive > 0 ? '+' : ''}${defensive} défense/types`);
  }

  if (pokemon.favorite) score += 5;
  if (pokemon.heldItem) score += 8;

  return {
    ...pokemon,
    score: Math.round(score),
    viable,
    reasons,
    missionTypes: context.missionTypes || [],
    recommendedLevel: context.recommendedLevel ?? null,
  };
}

function chooseTeamForMission(roster, context) {
  const teamSize = Math.max(1, Number(context.teamSize || 1));
  const ranked = roster
    .map(pokemon => scorePokemonForMission(pokemon, context))
    .sort((a, b) => b.score - a.score);

  const viable = ranked.filter(pokemon => pokemon.viable);
  const team = [];
  const usedTypes = new Set();

  while (team.length < teamSize) {
    const remaining = viable.filter(pokemon => !team.some(member => member.id === pokemon.id));
    if (!remaining.length) break;

    const next = remaining
      .map(pokemon => {
        const newTypes = pokemon.types.filter(type => !usedTypes.has(type)).length;
        const overlap = pokemon.types.filter(type => usedTypes.has(type)).length;
        return {
          pokemon,
          adjustedScore: pokemon.score + newTypes * 18 - overlap * 6,
        };
      })
      .sort((a, b) => b.adjustedScore - a.adjustedScore)[0]?.pokemon;

    if (!next) break;
    team.push(next);
    next.types.forEach(type => usedTypes.add(type));
  }

  const complete = team.length >= teamSize;
  const teamScore = team.length
    ? Math.round(team.reduce((sum, pokemon) => sum + pokemon.score, 0) / team.length)
    : null;

  const avgLevel = team.length
    ? team.reduce((sum, pokemon) => sum + pokemon.level, 0) / team.length
    : null;

  const minHpPercent = team.length
    ? Math.min(...team.map(pokemon => pokemon.hpPercent))
    : null;

  return {
    known: roster.length > 0,
    viable: complete,
    teamSize,
    team,
    ranked,
    teamScore,
    avgLevel,
    minHpPercent,
    reason: complete
      ? `équipe viable ${team.map(pokemon => pokemon.name).join(', ')}`
      : `seulement ${team.length}/${teamSize} Pokémon viable(s)`,
  };
}

function updateRosterSnapshot(requirement) {
  if (!requirement?.form) return [];

  const visibleRoster = [...requirement.form.querySelectorAll('[data-team-pokemon][data-pokemon-id]')]
    .map(pokemonFromCard)
    .filter(pokemon => pokemon.id);

  const previousById = new Map(
    (state.rosterSnapshot?.pokemon || []).map(pokemon => [pokemon.id, pokemon])
  );

  const mergedById = new Map();
  for (const pokemon of visibleRoster) mergedById.set(pokemon.id, pokemon);

  for (const selectedId of requirement.selectedIds || []) {
    if (!mergedById.has(selectedId) && previousById.has(selectedId)) {
      mergedById.set(selectedId, previousById.get(selectedId));
    }
  }

  const roster = [...mergedById.values()];
  state.rosterSnapshot = {
    capturedAt: now(),
    pokemon: roster.map(serializablePokemon),
  };
  saveState(state);
  return roster;
}

function cachedRoster() {
  const snapshot = state.rosterSnapshot;
  if (!snapshot?.capturedAt || !Array.isArray(snapshot.pokemon)) return [];

  const maxAgeMs = config.rosterCacheMinutes * 60 * 1000;
  if (now() - snapshot.capturedAt > maxAgeMs) return [];

  return snapshot.pokemon;
}

function estimateTeamForMission(context) {
  const roster = cachedRoster();
  if (!roster.length) {
    return {
      known: false,
      viable: null,
      teamSize: context.teamSize || 1,
      team: [],
      ranked: [],
      teamScore: null,
      avgLevel: null,
      minHpPercent: null,
      reason: 'roster inconnu',
    };
  }

  return chooseTeamForMission(roster, context);
}

function currentMissionBlock(title) {
  const block = state.expeditionBlocks?.[title];
  if (!block?.until) return null;
  if (block.until <= now()) {
    delete state.expeditionBlocks[title];
    saveState(state);
    return null;
  }
  return block;
}

function blockMissionTemporarily(title, reason) {
  const until = now() + config.missionBlockMinutes * 60 * 1000;
  state.expeditionBlocks = {
    ...(state.expeditionBlocks || {}),
    [title]: { until, reason, createdAt: now() },
  };
  saveState(state);
  return until;
}

function preparationTeamPlan(requirement) {
  const roster = updateRosterSnapshot(requirement);
  const context = expeditionPreparationContext(requirement);
  const plan = chooseTeamForMission(roster, context);

  state.expeditionPlan = {
    title: context.title,
    team: plan.team.map(pokemon => pokemon.name),
    teamIds: plan.team.map(pokemon => pokemon.id),
    teamScore: plan.teamScore,
    viability: plan.viable ? 'viable' : 'blocked',
    reason: plan.reason,
    updatedAt: now(),
  };

  state.smartTeam = {
    lastSelection: plan.team.map(pokemon => pokemon.name),
    lastMissionTypes: context.missionTypes,
    lastRecommendedLevel: context.recommendedLevel,
  };

  saveState(state);
  return { context, plan };
}

async function selectNextPlannedPokemon(requirement, assessment) {
  const selected = new Set(requirement.selectedIds || []);
  const next = assessment.plan.team.find(pokemon => !selected.has(pokemon.id));
  if (!next) return false;

  const select = [...requirement.form.querySelectorAll('select[data-team-select]')]
    .find(input =>
      !input.value &&
      [...input.options].some(option => option.value === next.id)
    );

  if (select) {
    select.value = next.id;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    state.lastAction = `Équipe intelligente: ${next.name} (score ${next.score})`;
    state.lastActionAt = now();
    state.lastBotClickAt = now();
    state.actions += 1;
    saveState(state);
    updatePanel();
    log('Équipe intelligente via select:', next);
    return true;
  }

  const card = assessment.plan.ranked.find(pokemon => pokemon.id === next.id)?.card;
  if (card && isVisible(card)) {
    return clickElement(
      card,
      `Équipe intelligente: ${next.name} (score ${next.score})`
    );
  }

  return false;
}

async function handleExpeditionPreparation() {
  if (!config.autoStartExpeditions) return false;

  const requirement = expeditionTeamRequirement();
  if (!requirement) return false;

  const assessment = preparationTeamPlan(requirement);
  const canonicalTitle = expeditionCycle().title || assessment.context.title || 'expedition';

  if (assessment.plan.viable && state.expeditionBlocks?.[canonicalTitle]) {
    delete state.expeditionBlocks[canonicalTitle];
    saveState(state);
  }

  if (config.smartTeam && !assessment.plan.viable) {
    const title = canonicalTitle;
    blockMissionTemporarily(title, assessment.plan.reason);

    state.lastAction = `Mission écartée: ${title} — ${assessment.plan.reason}`;
    saveState(state);
    updatePanel();

    const link = expeditionIndexLink();
    if (link) {
      setExpeditionPhase('ready_to_start', {
        title: null,
        resultUrl: null,
        dueAt: null,
      });
      return clickElement(link, 'Équipe insuffisante — retour aux expéditions');
    }

    return false;
  }

  if (requirement.selected < requirement.min) {
    if (config.smartTeam) {
      const selected = await selectNextPlannedPokemon(requirement, assessment);
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
