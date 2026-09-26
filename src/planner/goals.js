function emptyGoalPlan() {
  return {
    version: 1,
    generatedAt: 0,
    strategy: 'progression',
    primary: {
      id: 'idle',
      title: 'Observer le compte',
      reason: 'Pas encore assez de contexte pour choisir un objectif.',
      module: null,
      target: null,
    },
    step: {
      id: 'observe',
      title: 'Collecter l’état du compte',
      reason: 'Le planner attend davantage de données observées.',
      module: null,
      action: 'observe',
      target: null,
    },
    blockers: [],
    confidence: 'low',
  };
}

function currentGoalPlan() {
  if (!state.goalPlan || typeof state.goalPlan !== 'object') {
    state.goalPlan = emptyGoalPlan();
  }
  return state.goalPlan;
}

function hasCompletedExpedition(snapshot, title) {
  if (!title) return false;
  const target = normalizeText(title);
  return (snapshot.expeditions?.completedTitles || [])
    .some(completed => normalizeText(completed) === target);
}

function requirementSatisfied(snapshot, requirement) {
  if (!requirement) return false;

  if (requirement.type === 'trainer_level') {
    const level = snapshot.trainer?.level;
    return level != null && level >= Number(requirement.target || 0);
  }

  if (requirement.type === 'captured_species') {
    const count = snapshot.pokedex?.capturedSpecies;
    return count != null && count >= Number(requirement.target || 0);
  }

  if (requirement.type === 'badges') {
    const badges = snapshot.league?.badges;
    return badges != null && badges >= Number(requirement.target || 0);
  }

  if (requirement.type === 'previous_expedition') {
    return requirement.target
      ? hasCompletedExpedition(snapshot, requirement.target)
      : false;
  }

  if (requirement.type === 'expedition') {
    return hasCompletedExpedition(snapshot, requirement.target);
  }

  if (requirement.type === 'badge') {
    const badges = snapshot.league?.badges;
    return badges != null && badges > 0;
  }

  return false;
}

function lockedExpedition(snapshot, title) {
  const target = normalizeText(title || '');
  return (snapshot.expeditions?.locked || [])
    .find(entry => normalizeText(entry.title || entry.normalizedTitle) === target) || null;
}

function firstUnmetRequirement(snapshot, requirements = []) {
  return requirements.find(requirement => !requirementSatisfied(snapshot, requirement)) || null;
}

function expeditionDependencyStep(snapshot, targetTitle) {
  const locked = lockedExpedition(snapshot, targetTitle);

  if (!locked) {
    return {
      id: 'complete-expedition',
      title: `Terminer ${targetTitle}`,
      reason: 'Cette expédition est la prochaine dépendance de progression.',
      module: 'expeditions',
      action: 'complete_expedition',
      target: targetTitle,
    };
  }

  const unmet = firstUnmetRequirement(snapshot, locked.requirements);

  if (!unmet) {
    return {
      id: 'unlock-expedition',
      title: `Lancer ${locked.title}`,
      reason: 'Toutes les conditions observées sont satisfaites.',
      module: 'expeditions',
      action: 'complete_expedition',
      target: locked.title,
    };
  }

  if (unmet.type === 'trainer_level') {
    const current = snapshot.trainer?.level;
    return {
      id: 'raise-trainer-level',
      title: `Atteindre le niveau dresseur ${unmet.target}`,
      reason: current == null
        ? `${locked.title} exige le niveau ${unmet.target}.`
        : `${locked.title} exige le niveau ${unmet.target} · actuel ${current}.`,
      module: 'expeditions',
      action: 'farm_trainer_level',
      target: Number(unmet.target),
    };
  }

  if (unmet.type === 'captured_species') {
    const current = snapshot.pokedex?.capturedSpecies;
    return {
      id: 'capture-species',
      title: `Atteindre ${unmet.target} espèces capturées`,
      reason: current == null
        ? `${locked.title} demande ${unmet.target} espèces.`
        : `${locked.title} demande ${unmet.target} espèces · actuel ${current}.`,
      module: 'expeditions',
      action: 'farm_captures',
      target: Number(unmet.target),
    };
  }

  if (unmet.type === 'badges') {
    const current = snapshot.league?.badges;
    return {
      id: 'earn-badges',
      title: `Obtenir ${unmet.target} badges`,
      reason: current == null
        ? `${locked.title} demande ${unmet.target} badges.`
        : `${locked.title} demande ${unmet.target} badges · actuel ${current}.`,
      module: 'progression',
      action: 'earn_badges',
      target: Number(unmet.target),
    };
  }

  if (unmet.type === 'previous_expedition' && unmet.target) {
    return expeditionDependencyStep(snapshot, unmet.target);
  }

  return {
    id: 'inspect-expedition-lock',
    title: `Débloquer ${locked.title}`,
    reason: unmet.label || 'Une condition de déblocage reste à satisfaire.',
    module: 'expeditions',
    action: 'inspect_unlock',
    target: locked.title,
  };
}

function nextLockedGym(snapshot) {
  const gyms = [...(snapshot.league?.lockedGyms || [])]
    .sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0));

  if (!gyms.length) return null;

  const badges = Number(snapshot.league?.badges || 0);
  return gyms.find(gym => Number(gym.rank || 0) > badges) || gyms[0];
}

function gymProgressionGoal(snapshot) {
  const league = snapshot.league || {};
  const gymState = typeof gymCycle === 'function' ? gymCycle() : (state.gymCycle || {});
  const today = typeof localDayKey === 'function' ? localDayKey() : null;

  if (
    league.dailyBattleAvailable === true &&
    (!today || gymState.completedDay !== today)
  ) {
    const arena = league.arena || 'l’arène disponible';
    const badge = league.badge || 'le prochain badge';

    if (league.needsHealing || gymState.needsHealing) {
      return {
        primary: {
          id: 'win-current-gym',
          title: `Obtenir ${badge}`,
          reason: `${arena} est disponible aujourd’hui.`,
          module: 'progression',
          target: arena,
        },
        step: {
          id: 'heal-for-gym',
          title: 'Soigner l’équipe d’arène',
          reason: 'Le combat quotidien ne doit pas être consommé avec une équipe trop blessée.',
          module: 'healing',
          action: 'heal',
          target: arena,
        },
        blockers: ['PV insuffisants pour l’équipe d’arène'],
        confidence: 'high',
      };
    }

    return {
      primary: {
        id: 'win-current-gym',
        title: `Obtenir ${badge}`,
        reason: `${arena} est disponible et le combat quotidien n’est pas consommé.`,
        module: 'progression',
        target: arena,
      },
      step: {
        id: 'challenge-gym',
        title: `Défier ${league.champion || 'le Champion'}`,
        reason: 'Le combat d’arène est l’action de progression prioritaire disponible aujourd’hui.',
        module: 'progression',
        action: 'challenge_gym',
        target: arena,
      },
      blockers: [],
      confidence: 'high',
    };
  }

  const locked = nextLockedGym(snapshot);
  if (!locked) return null;

  const expectedPreviousBadges = Math.max(0, Number(locked.rank || 1) - 1);
  const unmet = (locked.requirements || []).find(requirement => {
    if (
      requirement.type === 'badge' &&
      Number(snapshot.league?.badges || 0) >= expectedPreviousBadges
    ) {
      return false;
    }
    return !requirementSatisfied(snapshot, requirement);
  }) || null;

  if (!unmet) {
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: `${locked.badge || 'Le prochain badge'} est le prochain jalon de Ligue.`,
        module: 'progression',
        target: locked.arena,
      },
      step: {
        id: 'refresh-league',
        title: 'Actualiser le Circuit des Arènes',
        reason: 'Les conditions connues semblent satisfaites ; il faut revalider le déblocage.',
        module: 'progression',
        action: 'refresh_league',
        target: locked.arena,
      },
      blockers: [],
      confidence: 'medium',
    };
  }

  if (unmet.type === 'expedition') {
    const step = expeditionDependencyStep(snapshot, unmet.target);
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: `${locked.arena} exige l’expédition ${unmet.target}.`,
        module: 'progression',
        target: locked.arena,
      },
      step,
      blockers: [unmet.label],
      confidence: 'high',
    };
  }

  if (unmet.type === 'trainer_level') {
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: unmet.label,
        module: 'progression',
        target: locked.arena,
      },
      step: {
        id: 'raise-trainer-level',
        title: `Atteindre le niveau dresseur ${unmet.target}`,
        reason: unmet.label,
        module: 'expeditions',
        action: 'farm_trainer_level',
        target: Number(unmet.target),
      },
      blockers: [unmet.label],
      confidence: 'high',
    };
  }

  if (unmet.type === 'badge') {
    return {
      primary: {
        id: 'unlock-next-gym',
        title: `Débloquer ${locked.arena}`,
        reason: unmet.label,
        module: 'progression',
        target: locked.arena,
      },
      step: {
        id: 'earn-required-badge',
        title: `Obtenir le badge requis`,
        reason: unmet.label,
        module: 'progression',
        action: 'earn_badge',
        target: unmet.target,
      },
      blockers: [unmet.label],
      confidence: 'medium',
    };
  }

  return {
    primary: {
      id: 'unlock-next-gym',
      title: `Débloquer ${locked.arena}`,
      reason: 'Une condition du prochain badge reste à remplir.',
      module: 'progression',
      target: locked.arena,
    },
    step: {
      id: 'inspect-gym-requirement',
      title: 'Compléter la condition de Ligue',
      reason: unmet.label,
      module: 'progression',
      action: 'inspect_requirement',
      target: unmet.target,
    },
    blockers: [unmet.label],
    confidence: 'medium',
  };
}

function defaultExpeditionGoal(snapshot) {
  const expedition = snapshot.expeditions || {};

  if (['due', 'result', 'claiming'].includes(expedition.phase)) {
    return {
      primary: {
        id: 'progress-account',
        title: 'Faire progresser le compte',
        reason: 'Une expédition terminée doit être résolue avant de recalculer la suite.',
        module: 'expeditions',
        target: expedition.activeTitle,
      },
      step: {
        id: 'resolve-expedition',
        title: `Résoudre ${expedition.activeTitle || 'l’expédition'}`,
        reason: 'Le résultat est disponible.',
        module: 'expeditions',
        action: 'resolve_expedition',
        target: expedition.activeTitle,
      },
      blockers: [],
      confidence: 'high',
    };
  }

  if (expedition.phase === 'running') {
    return {
      primary: {
        id: 'progress-account',
        title: 'Faire progresser le compte',
        reason: 'Une expédition est déjà en cours.',
        module: 'expeditions',
        target: expedition.activeTitle,
      },
      step: {
        id: 'wait-expedition',
        title: `Attendre ${expedition.activeTitle || 'l’expédition'}`,
        reason: expedition.dueAt
          ? `Retour prévu dans ${formatRemaining(expedition.dueAt)}.`
          : 'Le bot reprendra à la résolution.',
        module: null,
        action: 'wait',
        target: expedition.activeTitle,
      },
      blockers: [],
      confidence: 'high',
    };
  }

  const firstLocked = (expedition.locked || [])[0];
  if (firstLocked) {
    const step = expeditionDependencyStep(snapshot, firstLocked.title);
    return {
      primary: {
        id: 'unlock-expedition',
        title: `Débloquer ${firstLocked.title}`,
        reason: 'C’est la prochaine destination verrouillée observée.',
        module: 'expeditions',
        target: firstLocked.title,
      },
      step,
      blockers: firstUnmetRequirement(snapshot, firstLocked.requirements)
        ? [firstUnmetRequirement(snapshot, firstLocked.requirements).label]
        : [],
      confidence: 'high',
    };
  }

  return {
    primary: {
      id: 'progress-expeditions',
      title: 'Avancer dans les expéditions',
      reason: 'Aucun autre jalon bloquant n’est actuellement connu.',
      module: 'expeditions',
      target: null,
    },
    step: {
      id: 'best-expedition',
      title: 'Lancer la meilleure expédition disponible',
      reason: 'Le moteur Smart Expedition choisira mission + équipe.',
      module: 'expeditions',
      action: 'best_expedition',
      target: null,
    },
    blockers: [],
    confidence: 'medium',
  };
}

function buildGoalPlan(snapshot = accountSnapshot()) {
  const base = {
    version: 1,
    generatedAt: now(),
    strategy: config.strategy || 'progression',
  };

  if (config.strategy === 'progression') {
    const gymGoal = gymProgressionGoal(snapshot);
    if (gymGoal) return { ...base, ...gymGoal };
    return { ...base, ...defaultExpeditionGoal(snapshot) };
  }

  return { ...base, ...defaultExpeditionGoal(snapshot) };
}

function refreshGoalPlan(snapshot = observeAccountSnapshot()) {
  const plan = buildGoalPlan(snapshot);
  state.goalPlan = plan;
  saveState(state);
  return plan;
}

function goalModulePriorityBonus(moduleId) {
  const plan = currentGoalPlan();
  if (!moduleId) return 0;
  if (plan.step?.module === moduleId) return config.goalPriorityBonus;
  if (plan.primary?.module === moduleId) return Math.round(config.goalPriorityBonus * 0.45);
  return 0;
}

function goalCandidatePriorityBonus(candidateName) {
  const map = {
    expedition: 'expeditions',
    heal: 'healing',
    gym: 'progression',
    progression: 'progression',
    incubator: 'incubator',
    breeding: 'breeding',
    'greenhouse-harvest': 'greenhouse',
    'greenhouse-plant': 'greenhouse',
  };

  const moduleId = candidateName?.startsWith('navigation:')
    ? candidateName.slice('navigation:'.length)
    : map[candidateName];

  return goalModulePriorityBonus(moduleId);
}

function goalTargetExpedition() {
  const plan = currentGoalPlan();
  if (plan.step?.module !== 'expeditions') return null;
  if (!['complete_expedition', 'unlock_expedition'].includes(plan.step?.action)) return null;
  return plan.step.target || null;
}
