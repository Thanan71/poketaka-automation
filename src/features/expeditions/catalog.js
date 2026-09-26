function expeditionPrepareLink(card) {
    if (!card) return null;

    const direct = card.querySelector(
      'a[href*="/expeditions/"][href$="/prepare"], a.primary-button[href*="/prepare"], a[href*="/prepare"]'
    );

    if (direct && isVisible(direct) && !direct.hasAttribute('disabled')) return direct;

    return findClickable([
      'preparer l expedition', 'preparer expedition',
      'lancer expedition', 'lancer l expedition', 'partir', 'demarrer',
      'start expedition', 'start', 'depart', 'envoyer equipe', 'send team',
    ], card, {
      exclude: ['verrouille', 'locked', 'indisponible', 'unavailable'],
    });
  }

  function expeditionCards() {
    // Sélecteur natif PokéTaka : les missions lançables se trouvent dans le
    // catalogue "available" et possèdent un lien /prepare.
    const exact = [...document.querySelectorAll(
      '.mission-catalog[data-panel="available"] .mission-card, .mission-catalog__grid > .mission-card'
    )]
      .filter(isVisible)
      .filter(card => Boolean(expeditionPrepareLink(card)));

    if (exact.length) return exact;

    // Fallback pour rester compatible si le HTML du site évolue.
    const candidates = [...document.querySelectorAll(
      'article, section, li, .card, [class*="card"], [class*="expedition"], [data-expedition], [data-route]'
    )]
      .filter(isVisible)
      .filter(el => Boolean(expeditionPrepareLink(el)));

    const seen = new Set();
    return candidates.filter(el => {
      const text = elementText(el);
      if (!text || seen.has(text)) return false;
      seen.add(text);
      return true;
    });
  }

  function parseNumber(value) {
    if (value == null) return null;
    const normalized = String(value).replace(/\s/g, '').replace(',', '.');
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }

  function parseFirstMatch(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return parseNumber(match[1]);
    }
    return null;
  }

  function parseDurationMinutes(text) {
    let minutes = 0;
    const hours = text.match(/(\d+(?:[.,]\d+)?)\s*(?:h|heure|heures|hour|hours)\b/i);
    const mins = text.match(/(\d+(?:[.,]\d+)?)\s*(?:min|minute|minutes)\b/i);
    const secs = text.match(/(\d+(?:[.,]\d+)?)\s*(?:s|sec|seconde|secondes|second|seconds)\b/i);

    if (hours) minutes += (parseNumber(hours[1]) || 0) * 60;
    if (mins) minutes += parseNumber(mins[1]) || 0;
    if (secs) minutes += (parseNumber(secs[1]) || 0) / 60;

    return minutes > 0 ? minutes : null;
  }

  function parseChance(text) {
    const contextual = parseFirstMatch(text, [
      /(?:chance|succes|reussite|victoire|success|win chance)[^%\d]{0,20}(\d+(?:[.,]\d+)?)\s*%/i,
      /(\d+(?:[.,]\d+)?)\s*%[^a-z]{0,8}(?:chance|succes|reussite|victoire|success)/i,
    ]);
    if (contextual != null) return Math.max(0, Math.min(100, contextual));

    const percentages = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)]
      .map(match => parseNumber(match[1]))
      .filter(value => value != null && value >= 0 && value <= 100);

    return percentages.length === 1 ? percentages[0] : null;
  }

  function parseRequiredLevel(text) {
    return parseFirstMatch(text, [
      /(?:niveau|niv\.?|level|lvl\.?)\s*(?:requis|required|minimum|min|conseille|recommended)?\s*[:≥>=-]*\s*(\d+)/i,
      /(?:requis|required)\s*(?:niveau|level|lvl\.?)?\s*[:≥>=-]*\s*(\d+)/i,
    ]);
  }

  function parseTeamLevel(pageText) {
    return parseFirstMatch(pageText, [
      /(?:niveau moyen|niveau equipe|moyenne equipe|average level|team level)\s*[:=-]*\s*(\d+(?:[.,]\d+)?)/i,
      /(?:equipe|team)[^\n]{0,30}(?:niv\.?|lvl\.?|niveau|level)\s*[:=-]*\s*(\d+(?:[.,]\d+)?)/i,
    ]);
  }

  function parseRewardValue(text) {
    let score = 0;

    const moneyMatches = [...text.matchAll(
      /(\d[\d\s.,]*)\s*(?:₽|pok(?:e|é)dollars?|pokedollars?|coins?|pieces?)/gi
    )];
    for (const match of moneyMatches) {
      const amount = parseNumber(match[1]);
      if (amount) score += Math.log10(amount + 10) * 18;
    }

    const xpMatches = [...text.matchAll(
      /(\d[\d\s.,]*)\s*(?:xp|exp(?:erience)?)/gi
    )];
    for (const match of xpMatches) {
      const amount = parseNumber(match[1]);
      if (amount) score += Math.log10(amount + 10) * 16;
    }

    const quantityMatches = [...text.matchAll(/(?:x\s*)?(\d+)\s+(?:objet|item|baie|berry|ball|bonbon|candy)/gi)];
    for (const match of quantityMatches) score += Math.min(30, (parseNumber(match[1]) || 0) * 4);

    if (/rare|epique|epic|legendaire|legendary|fossile|fossil|oeuf|egg/i.test(text)) score += 20;
    return score;
  }

  function parseResourceCost(text) {
    return {
      energy: parseFirstMatch(text, [
        /(?:cout|cost|consomme|consume)[^\d]{0,12}(\d+(?:[.,]\d+)?)\s*(?:energie|energy|stamina)/i,
        /(\d+(?:[.,]\d+)?)\s*(?:energie|energy|stamina)\s*(?:requis|required|cout|cost)/i,
      ]),
    };
  }

  function parseAvailableResources(pageText) {
    return {
      energy: parseFirstMatch(pageText, [
        /(?:energie|energy|stamina)\s*[:=-]?\s*(\d+(?:[.,]\d+)?)(?:\s*\/\s*\d+)?/i,
      ]),
    };
  }

  function zoneRank(text, domIndex) {
    const numbered = parseFirstMatch(text, [
      /(?:route|zone|chemin|path|stage|etape)\s*#?\s*(\d+)/i,
      /(?:arene|gym|badge)\s*#?\s*(\d+)/i,
    ]);

    let rank = numbered != null ? numbered * 10 : domIndex;
    if (/ligue|league|elite\s*4|conseil\s*4/i.test(text)) rank += 500;
    if (/champion/i.test(text)) rank += 700;
    return rank;
  }

  function expeditionTitle(card, index) {
    const heading = card.querySelector('h1, h2, h3, h4, h5, strong, [class*="title"]');
    const title = normalizeText(heading?.textContent || '').trim();
    if (title) return title.slice(0, 80);

    const text = normalizeText(card.textContent || '');
    return text.slice(0, 80) || `expedition ${index + 1}`;
  }

  function isNewProgression(text) {
    return /nouveau|nouvelle|new|premiere fois|first clear|non termine|uncompleted|a decouvrir|undiscovered/i.test(text);
  }

  function isPreviouslyCompleted(text) {
    return /termine|complete|completed|deja termine|already cleared|maitrise|mastered/i.test(text);
  }

  function analyzeExpedition(card, index, pageContext) {
  const detailsTrigger = card.querySelector('[data-open-dialog]');
  const detailsId = detailsTrigger?.getAttribute('data-open-dialog');
  const details = detailsId ? document.getElementById(detailsId) : null;

  const text = normalizeText([
    card.innerText || card.textContent || '',
    details?.textContent || '',
  ].join(' '));

  const title = expeditionTitle(card, index);
  const chance = parseChance(text);
  const durationMinutes = parseDurationMinutes(text);
  const requiredLevel = parseRequiredLevel(text);
  const rewardScore = parseRewardValue(text);
  const costs = parseResourceCost(text);
  const progressionRank = zoneRank(text, index);
  const missionTypes = parseMissionTypes(text);
  const teamSize = parseRequiredTeamSize(text);
  const completed = pageContext.historyTitles?.has(title) || isPreviouslyCompleted(text);
  const newProgression = !completed || isNewProgression(text);
  const stats = state.expeditionStats?.[title] || {};
  const failureStreak = Number(stats.failureStreak || 0);
  const startButton = expeditionPrepareLink(card);
  const block = currentMissionBlock(title);

  const teamPlan = estimateTeamForMission({
    title,
    missionTypes,
    recommendedLevel: requiredLevel,
    teamSize,
    durationMinutes,
  });

  let score = progressionRank * 18;
  const reasons = [];

  if (newProgression) {
    score += 300;
    reasons.push('+300 nouvelle progression');
  }

  if (completed) {
    score -= 80;
    reasons.push('-80 déjà terminée');
  }

  if (block) {
    score -= 5000;
    reasons.push(`-5000 temporairement écartée: ${block.reason}`);
  }

  if (failureStreak > 0) {
    const failurePenalty = failureStreak >= 2
      ? 900 + (failureStreak - 2) * 250
      : 220;
    score -= failurePenalty;
    reasons.push(`-${failurePenalty} échecs consécutifs (${failureStreak})`);
  }

  if (teamPlan.known) {
    if (teamPlan.viable) {
      const teamBonus = Math.max(
        -120,
        Math.min(220, Math.round((teamPlan.teamScore || 0) * 0.35))
      );
      score += teamBonus;
      reasons.push(
        `${teamBonus >= 0 ? '+' : ''}${teamBonus} équipe ${teamPlan.team.map(p => p.name).join(', ')}`
      );

      if (requiredLevel != null && teamPlan.avgLevel != null) {
        const margin = teamPlan.avgLevel - requiredLevel;
        const levelBonus = margin >= 0
          ? Math.min(120, 35 + margin * 12)
          : Math.max(-300, margin * 90);
        score += levelBonus;
        reasons.push(
          `${levelBonus >= 0 ? '+' : ''}${Math.round(levelBonus)} niveau équipe vs conseillé`
        );
      }
    } else {
      score -= 1800;
      reasons.push(`-1800 aucune équipe viable (${teamPlan.reason})`);
    }
  } else {
    reasons.push('roster inconnu — validation sur la page de préparation');
  }

  if (chance != null) {
    const encounterBonus = chance * 0.25;
    score += encounterBonus;
    reasons.push(`+${Math.round(encounterBonus)} potentiel rencontre ${chance}%`);
  }

  score += rewardScore;
  if (rewardScore > 0) reasons.push(`+${Math.round(rewardScore)} récompenses`);

  if (durationMinutes != null) {
    const speedBonus = Math.max(-60, 35 - Math.log2(durationMinutes + 1) * 8);
    score += speedBonus;
    reasons.push(
      `${speedBonus >= 0 ? '+' : ''}${Math.round(speedBonus)} durée ${Math.round(durationMinutes)} min`
    );

    if (
      config.avoidLongLowValue &&
      durationMinutes >= 240 &&
      rewardScore < 35 &&
      !newProgression
    ) {
      score -= 120;
      reasons.push('-120 longue/faible valeur');
    }
  }

  if (
    costs.energy != null &&
    pageContext.resources.energy != null &&
    costs.energy > pageContext.resources.energy
  ) {
    score -= 1000;
    reasons.push('-1000 énergie insuffisante');
  }

  if (/verrouille|locked|indisponible|unavailable|equipe occupee|team busy/i.test(text)) {
    score -= 2000;
    reasons.push('-2000 indisponible');
  }

  return {
    card,
    button: startButton,
    index,
    title,
    chance,
    durationMinutes,
    requiredLevel,
    missionTypes,
    teamSize,
    teamPlan,
    rewardScore: Math.round(rewardScore),
    progressionRank,
    newProgression,
    completed,
    failureStreak,
    blocked: Boolean(block),
    block,
    energyCost: costs.energy,
    energyAvailable: pageContext.resources.energy,
    score: Math.round(score),
    reasons,
  };
}

function rankExpeditions() {
  const cards = expeditionCards();
  const pageText = normalizeText(document.body?.innerText || '');
  const historyTitles = new Set(
    [...document.querySelectorAll('.mission-archives a strong')]
      .map(element => normalizeText(element.textContent || ''))
      .filter(Boolean)
  );

  const pageContext = {
    resources: parseAvailableResources(pageText),
    historyTitles,
  };

  const ranking = cards
    .map((card, index) => analyzeExpedition(card, index, pageContext))
    .filter(item => item.button)
    .sort((a, b) => b.score - a.score);

  if (config.debug && ranking.length) {
    console.table(ranking.map(item => ({
      expedition: item.title,
      score: item.score,
      progression: item.progressionRank,
      niveauConseille: item.requiredLevel ?? '?',
      equipe: item.teamPlan.known
        ? item.teamPlan.team.map(pokemon => pokemon.name).join(', ') || 'aucune'
        : 'à confirmer',
      equipeViable: item.teamPlan.viable ?? '?',
      scoreEquipe: item.teamPlan.teamScore ?? '?',
      types: item.missionTypes.join(', ') || '?',
      rencontre: item.chance != null ? item.chance + '%' : '?',
      dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
      echecs: item.failureStreak,
      bloquee: item.blocked,
    })));

    log('Classement expéditions intelligent', ranking.map(item => ({
      title: item.title,
      score: item.score,
      team: item.teamPlan.team.map(pokemon => pokemon.name),
      viable: item.teamPlan.viable,
      reasons: item.reasons,
    })));
  }

  return ranking;
}

function expeditionProgressionCandidates(ranking) {
  return ranking
    .filter(item => !item.blocked)
    .filter(item => item.failureStreak < 2)
    .filter(item => item.teamPlan.viable !== false)
    .sort((a, b) => {
      if (a.newProgression !== b.newProgression) {
        return Number(b.newProgression) - Number(a.newProgression);
      }
      if (a.progressionRank !== b.progressionRank) {
        return b.progressionRank - a.progressionRank;
      }

      const teamA = a.teamPlan.teamScore ?? -Infinity;
      const teamB = b.teamPlan.teamScore ?? -Infinity;
      if (teamA !== teamB) return teamB - teamA;

      return b.score - a.score;
    });
}

async function startExpedition() {
  if (!config.autoStartExpeditions) return false;

  const ranking = rankExpeditions();
  if (!ranking.length) {
    state.selectedExpedition = null;
    state.selectedExpeditionScore = null;
    saveState(state);
    updatePanel();
    return false;
  }

  let selected = ranking.find(item => !item.blocked) || ranking[0];

  if (config.strategy === 'progression') {
    const candidates = expeditionProgressionCandidates(ranking);
    if (candidates.length) selected = candidates[0];
  }

  state.selectedExpedition = selected.title;
  state.selectedExpeditionScore = selected.score;
  state.expeditionPlan = {
    title: selected.title,
    team: selected.teamPlan.team.map(pokemon => pokemon.name),
    teamIds: selected.teamPlan.team.map(pokemon => pokemon.id),
    teamScore: selected.teamPlan.teamScore,
    viability: selected.teamPlan.known
      ? (selected.teamPlan.viable ? 'viable' : 'blocked')
      : 'unknown',
    reason: selected.teamPlan.reason,
    updatedAt: now(),
  };
  saveState(state);
  updatePanel();

  setExpeditionPhase('preparing', {
    title: selected.title,
    resultUrl: null,
    dueAt: null,
  });

  return clickElement(
    selected.button,
    `Préparation intelligente: ${selected.title} (score ${selected.score})`
  );
}

async function autoProgression() {
    if (!config.autoProgression) return false;

    const button = findClickable([
      'continuer', 'continue',
      'debloquer', 'unlock',
      'prochaine zone', 'next area',
      'prochaine etape', 'next step',
      'avancer', 'progresser',
    ], document, {
      exclude: ['acheter', 'buy', 'cout', 'cost', 'payer', 'pay'],
    });

    return button ? clickElement(button, 'Progression') : false;
  }
