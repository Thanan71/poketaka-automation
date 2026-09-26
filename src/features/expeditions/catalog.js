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

    // PokéTaka place les informations de chance/niveau dans un dialog adjacent
    // qui n'est pas visible tant que l'utilisateur ne l'ouvre pas.
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
    const completed = pageContext.historyTitles?.has(title) || isPreviouslyCompleted(text);
    const newProgression = !completed || isNewProgression(text);
    const stats = state.expeditionStats?.[title] || {};
    const failureStreak = Number(stats.failureStreak || 0);
    const startButton = expeditionPrepareLink(card);

    let score = progressionRank * 6;
    const reasons = [];

    if (newProgression) {
      score += 180;
      reasons.push('+180 nouvelle progression');
    }

    if (completed) {
      score -= 45;
      reasons.push('-45 déjà terminée');
    }

    if (failureStreak > 0) {
      const failurePenalty = failureStreak >= 2
        ? 650 + (failureStreak - 2) * 180
        : 180;
      score -= failurePenalty;
      reasons.push(`-${failurePenalty} échecs consécutifs (${failureStreak})`);
    }

    if (chance != null) {
      const encounterBonus = chance * 0.45;
      score += encounterBonus;
      reasons.push(`+${Math.round(encounterBonus)} potentiel rencontre ${chance}%`);
    }

    if (requiredLevel != null && pageContext.teamLevel != null) {
      const delta = pageContext.teamLevel - requiredLevel;
      if (delta >= 0) {
        score += Math.min(80, delta * 8 + 20);
        reasons.push(`niveau OK +${Math.round(delta)}`);
      } else {
        score -= Math.min(350, Math.abs(delta) * 45);
        reasons.push(`niveau insuffisant ${Math.round(delta)}`);
      }
    }

    score += rewardScore;
    if (rewardScore > 0) reasons.push(`+${Math.round(rewardScore)} récompenses`);

    if (durationMinutes != null) {
      const speedBonus = Math.max(-100, 90 - Math.log2(durationMinutes + 1) * 18);
      score += speedBonus;
      reasons.push(`${speedBonus >= 0 ? '+' : ''}${Math.round(speedBonus)} durée ${Math.round(durationMinutes)} min`);

      if (config.avoidLongLowValue && durationMinutes >= 240 && rewardScore < 35 && !newProgression) {
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
      teamLevel: pageContext.teamLevel,
      rewardScore: Math.round(rewardScore),
      progressionRank,
      newProgression,
      completed,
      failureStreak,
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
      // Le catalogue n'expose pas le niveau réel de l'équipe disponible.
      // Ne jamais le déduire du texte des missions : "Niveau conseillé"
      // appartient à la destination, pas à l'équipe du joueur.
      teamLevel: null,
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
        zone: item.progressionRank,
        chance: item.chance ?? '?',
        niveauRequis: item.requiredLevel ?? '?',
        niveauEquipe: item.teamLevel ?? '?',
        dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
        recompenses: item.rewardScore,
        energie: item.energyCost ?? '?',
        nouvelle: item.newProgression,
        terminee: item.completed,
      })));
      log('Classement expéditions', ranking.map(item => ({
        title: item.title,
        score: item.score,
        reasons: item.reasons,
      })));
    }

    return ranking;
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

    let selected = ranking[0];

    // En mode progression, privilégie la destination la plus avancée
    // parmi celles qui restent dans le seuil de réussite configuré.
    if (config.strategy === 'progression') {
      const viableProgression = ranking
        .filter(item => item.failureStreak < 2)
        .sort((a, b) => {
          if (a.index !== b.index) return b.index - a.index;
          if (a.progressionRank !== b.progressionRank) return b.progressionRank - a.progressionRank;
          return b.score - a.score;
        });

      if (viableProgression.length) selected = viableProgression[0];
    }

    state.selectedExpedition = selected.title;
    state.selectedExpeditionScore = selected.score;
    saveState(state);
    updatePanel();

    setExpeditionPhase('preparing', {
      title: selected.title,
      resultUrl: null,
      dueAt: null,
    });

    return clickElement(
      selected.button,
      `Préparation optimale: ${selected.title} (score ${selected.score})`
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
