GM_registerMenuCommand('Activer / désactiver PokéTaka Automation', () => setEnabled(!config.enabled));
  GM_registerMenuCommand('Exécuter un cycle maintenant', () => cycle(true));
  GM_registerMenuCommand('Diagnostiquer le timer de la page', () => {
    const current = moduleFromLocation();
    if (!current) {
      console.info('[PokéTaka Auto] Aucun module reconnu sur cette page.');
      return;
    }

    const timerInfo = findModuleCountdown(current);
    const status = state.moduleStatus?.[current.id] || {};
    console.group(`[PokéTaka Auto] Diagnostic timer — ${current.label}`);
    console.log('Module:', current);
    console.log('Timer détecté:', timerInfo || 'aucun');
    console.log('État mémorisé:', status);
    console.log('Échéance affichée:', status.nextDueAt ? formatRemaining(status.nextDueAt) : 'aucune');
    console.groupEnd();
  });

  GM_registerMenuCommand('Afficher le classement des expéditions', () => {
    const ranking = rankExpeditions();
    if (!ranking.length) {
      console.info('[PokéTaka Auto] Aucune expédition lançable détectée sur cette page.');
      return;
    }
    console.table(ranking.map(item => ({
      expedition: item.title,
      score: item.score,
      chance: item.chance ?? '?',
      niveauConseille: item.requiredLevel ?? '?',
      equipe: item.teamPlan?.known
        ? item.teamPlan.team.map(pokemon => pokemon.name).join(', ') || 'aucune'
        : 'à confirmer',
      equipeViable: item.teamPlan?.viable ?? '?',
      scoreEquipe: item.teamPlan?.teamScore ?? '?',
      dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
      recompenses: item.rewardScore,
      nouvelle: item.newProgression,
      raisons: item.reasons.join(' | '),
    })));
  });
  GM_registerMenuCommand('Réinitialiser la configuration', () => {
    config = { ...DEFAULT_CONFIG };
    saveConfig(config);
    updatePanel();
    schedule();
  });

  const observer = new MutationObserver(() => {
    ensurePanel();
    if (config.enabled && recentBotAction(3500)) {
      // Permet d'enchaîner rapidement une confirmation/modal sans spammer la page.
      clearTimeout(timer);
      timer = setTimeout(cycle, 900);
    }
  });

  ensurePanel();
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(() => {
    if (document.visibilityState === 'visible') updatePanel();
  }, 1000);
  if (config.enabled) cycle();
