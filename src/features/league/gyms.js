function localDayKey(timestamp = new Date()) {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function gymCycle() {
  if (!state.gymCycle || typeof state.gymCycle !== 'object') {
    state.gymCycle = {
      phase: 'unknown',
      checkedDay: null,
      availableToday: null,
      arena: null,
      champion: null,
      badge: null,
      badges: null,
      totalBadges: 8,
      requiredTeamSize: null,
      selectedTeam: [],
      teamScore: null,
      reason: null,
      lastCheckAt: 0,
      lastChallengeAt: 0,
    };
  }
  return state.gymCycle;
}

function setGymCycle(phase, patch = {}) {
  const previous = gymCycle();
  state.gymCycle = {
    ...previous,
    ...patch,
    phase,
    lastCheckAt: now(),
  };
  saveState(state);
  updatePanel();
  log('Cycle arène:', state.gymCycle);
}

function isLeagueIndexPage() {
  return /^\/league\/?$/.test(location.pathname);
}

function isGymPreparePage() {
  return /^\/gyms\/[^/]+\/prepare\/?$/.test(location.pathname);
}

function gymPreparationForm() {
  if (!isGymPreparePage()) return null;
  return document.querySelector(
    'form[data-team-builder][action*="/gyms/"][action$="/challenge"]'
  );
}

function parseGymProgress() {
  const progress = document.querySelector('.gym-progress');
  if (!progress) return { badges: null, totalBadges: 8 };

  const text = normalizeText(
    progress.getAttribute('aria-label') ||
    progress.querySelector('strong')?.textContent ||
    progress.textContent ||
    ''
  );
  const match = text.match(/(\d+)\s*\/\s*(\d+)/);
  return {
    badges: match ? Number(match[1]) : null,
    totalBadges: match ? Number(match[2]) : 8,
  };
}

function leagueDailyStatus() {
  if (!isLeagueIndexPage()) return null;

  const headerText = normalizeText(
    document.querySelector('.page-header__actions')?.textContent || ''
  );

  if (/combat du jour disponible|daily battle available/.test(headerText)) {
    return true;
  }

  if (
    /combat du jour (?:deja )?(?:utilise|termine|indisponible)|daily battle (?:used|completed|unavailable)/.test(headerText)
  ) {
    return false;
  }

  return null;
}

function availableGymContext() {
  if (!isLeagueIndexPage()) return null;

  const card = document.querySelector(
    '.gym-circuit--available .gym-card--available, .gym-card.gym-card--available'
  );
  if (!card || !isVisible(card)) return null;

  const prepare = card.querySelector(
    'a.primary-button[href*="/gyms/"][href$="/prepare"], a[href*="/gyms/"][href$="/prepare"]'
  );
  if (!prepare || !isVisible(prepare)) return null;

  const facts = normalizeText(card.textContent || '');
  const teamSizeMatch = facts.match(/equipe de\s*(\d+)\s*pokemon/i);

  return {
    card,
    prepare,
    arena: card.querySelector('.gym-card__identity h3, h3')?.textContent?.trim() || 'Arène',
    champion:
      card.querySelector('.gym-card__identity p:last-child')?.textContent
        ?.replace(/^\s*Champion\s*:\s*/i, '')
        .trim() || null,
    badge: card.querySelector('.gym-card__identity .card-label, .card-label')?.textContent?.trim() || null,
    rank: parseNumber(card.querySelector('.gym-rank')?.textContent?.match(/\d+/)?.[0]),
    teamSize: teamSizeMatch ? Number(teamSizeMatch[1]) : null,
  };
}

function gymPrepareContext(requirement) {
  const form = requirement?.form;
  if (!form) return null;

  const root = form.closest('main') || document;
  const title = root.querySelector('.page-header h1, h1')?.textContent?.trim() || 'Arène';
  const hero = root.querySelector('.gym-preparation-hero');
  const champion = hero?.querySelector('h2')?.textContent?.trim() || null;
  const badge = hero?.querySelector('.card-label')?.textContent?.trim() || null;

  return {
    title,
    champion,
    badge,
    missionTypes: [],
    recommendedLevel: null,
    teamSize: requirement.min,
  };
}

function gymTeamPlan(requirement) {
  const roster = updateRosterSnapshot(requirement);
  const context = gymPrepareContext(requirement);

  const healthyRoster = roster.filter(
    pokemon => pokemon.hpPercent >= config.minGymHpPercent
  );

  const plan = chooseTeamForMission(healthyRoster, {
    title: context?.title || 'Arène',
    missionTypes: [],
    recommendedLevel: null,
    teamSize: requirement.min,
  });

  const viable = plan.team.length >= requirement.min;

  state.gymCycle = {
    ...gymCycle(),
    phase: viable ? 'preparing' : 'blocked',
    checkedDay: localDayKey(),
    availableToday: true,
    arena: context?.title || gymCycle().arena,
    champion: context?.champion || gymCycle().champion,
    badge: context?.badge || gymCycle().badge,
    requiredTeamSize: requirement.min,
    selectedTeam: plan.team.map(pokemon => pokemon.name),
    teamScore: plan.teamScore,
    reason: viable
      ? `Équipe prête: ${plan.team.map(pokemon => pokemon.name).join(', ')}`
      : `Seulement ${plan.team.length}/${requirement.min} Pokémon avec au moins ${config.minGymHpPercent}% PV`,
    lastCheckAt: now(),
  };
  saveState(state);
  updatePanel();

  return {
    context,
    plan: {
      ...plan,
      viable,
    },
  };
}

async function selectNextGymPokemon(requirement, assessment) {
  const selected = new Set(requirement.selectedIds || []);
  const next = assessment.plan.team.find(pokemon => !selected.has(pokemon.id));
  if (!next) return false;

  const select = [...requirement.form.querySelectorAll('select[data-team-select]')]
    .find(input =>
      !input.value &&
      [...input.options].some(option => option.value === next.id)
    );

  if (!select) return false;

  select.value = next.id;
  select.dispatchEvent(new Event('input', { bubbles: true }));
  select.dispatchEvent(new Event('change', { bubbles: true }));

  state.lastAction = `Arène: sélection de ${next.name} (score ${next.score})`;
  state.lastActionAt = now();
  state.lastBotClickAt = now();
  state.actions += 1;
  state.gymCycle = {
    ...gymCycle(),
    phase: 'preparing',
    selectedTeam: assessment.plan.team.map(pokemon => pokemon.name),
    teamScore: assessment.plan.teamScore,
    reason: `Composition en cours ${requirement.selected + 1}/${requirement.min}`,
    lastCheckAt: now(),
  };
  saveState(state);
  updatePanel();
  log('Arène: sélection Pokémon', next);
  return true;
}

function leagueNeedsDailyCheck() {
  if (!config.autoGyms) return false;
  const gym = gymCycle();
  const today = localDayKey();

  if (gym.availableToday === true) return true;
  return gym.checkedDay !== today;
}

function leagueAttentionReason() {
  const gym = gymCycle();
  if (gym.availableToday === true) {
    return gym.arena
      ? `combat d’arène disponible: ${gym.arena}`
      : 'combat d’arène disponible';
  }
  if (gym.checkedDay !== localDayKey()) {
    return 'vérification quotidienne du Circuit des Arènes';
  }
  return null;
}

async function handleLeagueAutomation() {
  if (!config.autoGyms) return false;

  if (isLeagueIndexPage()) {
    const today = localDayKey();
    const dailyAvailable = leagueDailyStatus();
    const progress = parseGymProgress();
    const gym = availableGymContext();

    if (dailyAvailable === false || !gym) {
      setGymCycle('done', {
        checkedDay: today,
        availableToday: false,
        badges: progress.badges,
        totalBadges: progress.totalBadges,
        arena: null,
        champion: null,
        badge: null,
        requiredTeamSize: null,
        selectedTeam: [],
        teamScore: null,
        reason: dailyAvailable === false
          ? 'Combat du jour déjà utilisé ou indisponible'
          : 'Aucune arène disponible actuellement',
      });
      return false;
    }

    setGymCycle('available', {
      checkedDay: today,
      availableToday: dailyAvailable !== false,
      badges: progress.badges,
      totalBadges: progress.totalBadges,
      arena: gym.arena,
      champion: gym.champion,
      badge: gym.badge,
      requiredTeamSize: gym.teamSize,
      reason: `${gym.badge || 'Badge'} · équipe de ${gym.teamSize || '?'}`,
    });

    if (recentBotAction(1800)) return false;

    setGymCycle('opening_prepare', {
      arena: gym.arena,
      champion: gym.champion,
      badge: gym.badge,
    });
    return clickElement(
      gym.prepare,
      `Arène: préparer ${gym.arena}`
    );
  }

  if (isGymPreparePage()) {
    const form = gymPreparationForm();
    if (!form) return false;

    const requirement = expeditionTeamRequirement();
    if (!requirement || requirement.form !== form) return false;

    const assessment = gymTeamPlan(requirement);

    if (!assessment.plan.viable) {
      state.lastAction = `Arène bloquée — ${gymCycle().reason}`;
      saveState(state);
      updatePanel();
      return false;
    }

    if (requirement.selected < requirement.min) {
      return selectNextGymPokemon(requirement, assessment);
    }

    const chosenIds = new Set(requirement.selectedIds);
    const plannedIds = new Set(assessment.plan.team.map(pokemon => pokemon.id));
    const selectionMatchesPlan =
      chosenIds.size === plannedIds.size &&
      [...plannedIds].every(id => chosenIds.has(id));

    if (!selectionMatchesPlan) {
      state.gymCycle = {
        ...gymCycle(),
        phase: 'blocked',
        reason: 'La sélection actuelle ne correspond pas au plan intelligent',
      };
      state.lastAction = 'Arène: composition inattendue — lancement suspendu';
      saveState(state);
      updatePanel();
      return false;
    }

    const challenge = form.querySelector(
      'footer.expedition-prep-submit button.primary-button[type="submit"], button.primary-button[type="submit"]'
    );

    if (!challenge || !isVisible(challenge) || challenge.disabled) return false;
    if (recentBotAction(1800)) return false;

    state.gymCycle = {
      ...gymCycle(),
      phase: 'challenging',
      selectedTeam: assessment.plan.team.map(pokemon => pokemon.name),
      teamScore: assessment.plan.teamScore,
      reason: `Défi lancé avec ${assessment.plan.team.map(pokemon => pokemon.name).join(', ')}`,
      lastChallengeAt: now(),
    };
    saveState(state);
    updatePanel();

    return clickElement(
      challenge,
      `Arène: défier ${assessment.context?.champion || assessment.context?.title || 'le Champion'}`
    );
  }

  return false;
}
