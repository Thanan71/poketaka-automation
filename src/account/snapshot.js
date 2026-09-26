function emptyAccountSnapshot() {
  return {
    version: 1,
    observedAt: 0,
    page: null,
    trainer: {
      level: null,
    },
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
  };
}

function accountSnapshot() {
  if (!state.accountSnapshot || typeof state.accountSnapshot !== 'object') {
    state.accountSnapshot = emptyAccountSnapshot();
  }
  return state.accountSnapshot;
}

function parseTrainerLevelFromDom() {
  const direct = document.querySelector(
    '[data-trainer-level], .trainer-level, .trainer-profile__level, .profile-level'
  );

  if (direct) {
    const raw =
      direct.getAttribute('data-trainer-level') ||
      direct.textContent ||
      '';
    const match = String(raw).match(/\d+/);
    if (match) return Number(match[0]);
  }

  const profile = document.querySelector('.trainer-file, [data-trainer-profile]');
  if (profile) {
    const text = normalizeText(profile.textContent || '');
    const match = text.match(/(?:niveau|niv|level|lvl)\s*[:.-]?\s*(\d+)/i);
    if (match) return Number(match[1]);
  }

  return null;
}

function parsePokedexProgressFromDom() {
  const root = document.querySelector(
    '[data-pokedex-progress], .pokedex-progress, .dex-progress'
  );
  if (!root) return null;

  const raw =
    root.getAttribute('data-pokedex-progress') ||
    root.getAttribute('aria-label') ||
    root.textContent ||
    '';

  const match = String(raw).match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return null;

  return {
    capturedSpecies: Number(match[1]),
    totalSpecies: Number(match[2]),
  };
}

function parseLeagueRequirement(text) {
  const raw = String(text || '').trim();
  const normalized = normalizeText(raw);

  let match = normalized.match(/terminer l expedition\s*:?\s*(.+)$/i);
  if (match) {
    return {
      type: 'expedition',
      target: match[1].trim(),
      label: raw,
    };
  }

  match = normalized.match(/obtenir\s*:?\s*(badge\s+.+)$/i);
  if (match) {
    return {
      type: 'badge',
      target: match[1].trim(),
      label: raw,
    };
  }

  match = normalized.match(/(?:niveau|niv|level)\s*(?:dresseur|trainer)?\s*:?\s*(\d+)/i);
  if (match) {
    return {
      type: 'trainer_level',
      target: Number(match[1]),
      label: raw,
    };
  }

  return {
    type: 'unknown',
    target: raw,
    label: raw,
  };
}

function parseLockedGymsFromDom() {
  if (!/^\/league\/?$/.test(location.pathname)) return null;

  return [...document.querySelectorAll('.gym-card--locked')].map((card, index) => {
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
}

function rosterSnapshotForAccount() {
  const roster = state.rosterSnapshot;
  if (!roster?.capturedAt || !Array.isArray(roster.pokemon)) {
    return {
      known: false,
      capturedAt: 0,
      count: 0,
      healthyCount: 0,
      averageLevel: null,
      pokemon: [],
    };
  }

  const pokemon = roster.pokemon.map(entry => ({
    id: entry.id,
    name: entry.name,
    level: entry.level,
    hpPercent: entry.hpPercent,
    types: Array.isArray(entry.types) ? entry.types : [],
  }));

  const healthy = pokemon.filter(entry =>
    Number(entry.hpPercent || 0) >= config.minTeamHpPercent
  );

  return {
    known: pokemon.length > 0,
    capturedAt: roster.capturedAt,
    count: pokemon.length,
    healthyCount: healthy.length,
    averageLevel: pokemon.length
      ? Math.round(
          pokemon.reduce((sum, entry) => sum + Number(entry.level || 0), 0) /
          pokemon.length
        )
      : null,
    pokemon,
  };
}

function expeditionSnapshotForAccount() {
  const cycle = expeditionCycle();
  const failureStreaks = {};

  for (const [title, stats] of Object.entries(state.expeditionStats || {})) {
    const streak = Number(stats?.failureStreak || 0);
    if (streak > 0) failureStreaks[title] = streak;
  }

  return {
    phase: cycle.phase || 'unknown',
    activeTitle: cycle.title || null,
    selectedTitle: state.selectedExpedition || null,
    dueAt: cycle.dueAt || null,
    failureStreaks,
  };
}

function leagueSnapshotForAccount(previous) {
  const gym = typeof gymCycle === 'function'
    ? gymCycle()
    : (state.gymCycle || {});

  const lockedGyms = parseLockedGymsFromDom();

  return {
    known:
      previous?.known ||
      gym.badges != null ||
      gym.availableToday != null ||
      /^\/league\/?$/.test(location.pathname),
    badges: gym.badges ?? previous?.badges ?? null,
    totalBadges: gym.totalBadges || previous?.totalBadges || 8,
    dailyBattleAvailable:
      gym.availableToday ?? previous?.dailyBattleAvailable ?? null,
    arena: gym.arena ?? previous?.arena ?? null,
    champion: gym.champion ?? previous?.champion ?? null,
    badge: gym.badge ?? previous?.badge ?? null,
    phase: gym.phase || previous?.phase || 'unknown',
    needsHealing: Boolean(gym.needsHealing),
    lockedGyms: lockedGyms ?? previous?.lockedGyms ?? [],
  };
}

function observeAccountSnapshot() {
  const previous = accountSnapshot();
  const trainerLevel = parseTrainerLevelFromDom();
  const pokedex = parsePokedexProgressFromDom();
  const capture = state.captureDecision || {};
  const sources = new Set(previous.sources || []);

  sources.add(location.pathname);

  const next = {
    ...previous,
    version: 1,
    observedAt: now(),
    page: location.pathname,
    trainer: {
      level: trainerLevel ?? previous.trainer?.level ?? null,
    },
    roster: rosterSnapshotForAccount(),
    league: leagueSnapshotForAccount(previous.league),
    expeditions: expeditionSnapshotForAccount(),
    pokedex: pokedex
      ? {
          known: true,
          capturedSpecies: pokedex.capturedSpecies,
          totalSpecies: pokedex.totalSpecies,
        }
      : (previous.pokedex || emptyAccountSnapshot().pokedex),
    resources: {
      known:
        capture.ballReserve != null ||
        previous.resources?.known ||
        false,
      balls:
        capture.ballReserve ??
        previous.resources?.balls ??
        null,
    },
    sources: [...sources].slice(-20),
  };

  state.accountSnapshot = next;
  saveState(state);
  return next;
}

function accountSnapshotAgeMs() {
  const snapshot = accountSnapshot();
  return snapshot.observedAt ? now() - snapshot.observedAt : Infinity;
}
