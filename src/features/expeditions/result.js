function expeditionRewardClaimForm(root = document) {
  return root.querySelector(
    'form[method="POST"][action*="/expeditions/results/"][action$="/claim"]'
  );
}

function expeditionRewardsRecovered(root = document) {
  const claimForm = expeditionRewardClaimForm(root);
  if (claimForm) return false;

  const metas = [...root.querySelectorAll('.mission-rewards .mission-reward__meta')]
    .map(node => normalizeText(node.textContent || ''))
    .filter(Boolean);

  if (!metas.length) {
    return Boolean(root.querySelector('.result-claimed'));
  }

  return metas.every(meta =>
    !/a recuperer|to claim|claimable|pending/.test(meta)
  );
}

function expeditionResultState(root = document) {
  const captureForm = root.querySelector('form[data-capture-form]');
  const claimForm = expeditionRewardClaimForm(root);

  return {
    hasCapture: Boolean(captureForm),
    hasClaim: Boolean(claimForm),
    rewardsRecovered: expeditionRewardsRecovered(root),
    captureForm,
    claimForm,
  };
}

function reconcileExpeditionResultState(root = document, source = 'result') {
  const snapshot = expeditionResultState(root);

  if (!snapshot.hasCapture) {
    resetCaptureDecision(`no_capture:${source}`);
  }

  if (snapshot.hasClaim && expeditionCycle().phase === 'ready_to_start') {
    appendActionLog(
      'warning',
      'state',
      'Invariant corrigé: récompenses encore à récupérer',
      {
        source,
        previousPhase: 'ready_to_start',
        nextPhase: 'due',
      }
    );
    setExpeditionPhase('due');
  }

  return snapshot;
}
