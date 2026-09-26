GM_addStyle(`
    #pta-panel {
      --pta-bg: rgba(8, 13, 24, .965);
      --pta-surface: rgba(255,255,255,.048);
      --pta-surface-strong: rgba(255,255,255,.075);
      --pta-border: rgba(255,255,255,.09);
      --pta-border-strong: rgba(255,255,255,.16);
      --pta-text: #f8fafc;
      --pta-muted: #94a3b8;
      --pta-faint: #64748b;
      --pta-green: #22c55e;
      --pta-green-soft: rgba(34,197,94,.12);
      --pta-amber: #f59e0b;
      --pta-amber-soft: rgba(245,158,11,.12);
      --pta-red: #ef4444;
      --pta-red-soft: rgba(239,68,68,.12);
      --pta-blue: #60a5fa;
      --pta-blue-soft: rgba(96,165,250,.12);
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      width: min(382px, calc(100vw - 24px));
      max-height: min(760px, calc(100vh - 36px));
      overflow: hidden;
      border-radius: 20px;
      background: var(--pta-bg);
      color: var(--pta-text);
      font: 13px/1.42 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 24px 80px rgba(0,0,0,.48), 0 0 0 1px rgba(255,255,255,.025) inset;
      border: 1px solid var(--pta-border-strong);
      backdrop-filter: blur(20px) saturate(1.15);
      -webkit-backdrop-filter: blur(20px) saturate(1.15);
    }
    #pta-panel * { box-sizing: border-box; }
    #pta-panel button, #pta-panel summary { font: inherit; }
    #pta-panel button { -webkit-tap-highlight-color: transparent; }
    #pta-panel button:focus-visible, #pta-panel summary:focus-visible {
      outline: 2px solid var(--pta-blue);
      outline-offset: 2px;
    }

    #pta-panel .pta-header {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 13px 14px 12px;
      border-bottom: 1px solid var(--pta-border);
      background: linear-gradient(180deg, rgba(255,255,255,.035), transparent);
    }
    #pta-panel .pta-brand { min-width: 0; flex: 1; }
    #pta-panel .pta-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    #pta-panel .pta-title {
      min-width: 0;
      font-size: 14px;
      font-weight: 790;
      letter-spacing: -.015em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-version {
      flex: 0 0 auto;
      padding: 2px 6px;
      border-radius: 999px;
      background: rgba(255,255,255,.06);
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 750;
      letter-spacing: .02em;
    }
    #pta-panel .pta-subtitle {
      margin-top: 3px;
      color: var(--pta-muted);
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-dot {
      width: 9px;
      height: 9px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: var(--pta-red);
      box-shadow: 0 0 0 4px var(--pta-red-soft);
    }
    #pta-panel .pta-dot[data-on="true"] {
      background: var(--pta-green);
      box-shadow: 0 0 0 4px var(--pta-green-soft);
    }
    #pta-panel .pta-icon-btn {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      background: rgba(255,255,255,.035);
      color: var(--pta-muted);
      cursor: pointer;
      transition: background .15s ease, color .15s ease, border-color .15s ease;
    }
    #pta-panel .pta-icon-btn:hover {
      background: rgba(255,255,255,.09);
      border-color: var(--pta-border-strong);
      color: var(--pta-text);
    }

    #pta-panel .pta-body {
      max-height: calc(min(760px, 100vh - 36px) - 62px);
      overflow: auto;
      padding: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(148,163,184,.35) transparent;
    }
    #pta-panel[data-collapsed="true"] .pta-body { display: none; }
    #pta-panel[data-collapsed="true"] { width: min(292px, calc(100vw - 24px)); }

    #pta-panel .pta-status-hero {
      padding: 12px;
      border: 1px solid var(--pta-border);
      border-radius: 14px;
      background: linear-gradient(145deg, rgba(96,165,250,.09), rgba(255,255,255,.028));
    }
    #pta-panel .pta-status-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }
    #pta-panel .pta-eyebrow {
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .09em;
      text-transform: uppercase;
    }
    #pta-panel .pta-status-title {
      margin-top: 3px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -.018em;
    }
    #pta-panel .pta-status-copy {
      margin-top: 4px;
      color: var(--pta-muted);
      font-size: 11px;
      line-height: 1.45;
    }
    #pta-panel .pta-master {
      min-width: 74px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
      padding: 7px 8px 7px 10px;
      border: 1px solid rgba(239,68,68,.24);
      border-radius: 999px;
      background: var(--pta-red-soft);
      color: #fecaca;
      cursor: pointer;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .03em;
    }
    #pta-panel .pta-master[data-on="true"] {
      border-color: rgba(34,197,94,.28);
      background: var(--pta-green-soft);
      color: #bbf7d0;
    }
    #pta-panel .pta-master-knob {
      width: 18px;
      height: 18px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: rgba(255,255,255,.11);
      color: currentColor;
      font-size: 8px;
    }

    #pta-panel .pta-next {
      margin-top: 9px;
      padding: 10px 11px;
      border: 1px solid rgba(96,165,250,.20);
      border-radius: 11px;
      background: rgba(96,165,250,.07);
    }
    #pta-panel .pta-next[data-tone="ready"] {
      border-color: rgba(34,197,94,.22);
      background: rgba(34,197,94,.075);
    }
    #pta-panel .pta-next[data-tone="danger"] {
      border-color: rgba(239,68,68,.25);
      background: rgba(239,68,68,.075);
    }
    #pta-panel .pta-next[data-tone="wait"] {
      border-color: rgba(245,158,11,.22);
      background: rgba(245,158,11,.065);
    }
    #pta-panel .pta-next-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #pta-panel .pta-next-icon {
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 8px;
      background: var(--pta-blue-soft);
      color: #bfdbfe;
      font-size: 12px;
    }
    #pta-panel .pta-next-main { min-width: 0; flex: 1; }
    #pta-panel .pta-next-title {
      font-size: 11px;
      font-weight: 760;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-next-reason {
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #pta-panel .pta-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
      margin-top: 9px;
    }
    #pta-panel .pta-metric {
      min-width: 0;
      padding: 9px 9px 8px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      background: var(--pta-surface);
    }
    #pta-panel .pta-label {
      color: var(--pta-faint);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .055em;
      text-transform: uppercase;
    }
    #pta-panel .pta-value {
      margin-top: 3px;
      min-width: 0;
      font-size: 11px;
      font-weight: 720;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-value small {
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 650;
    }

    #pta-panel .pta-mission {
      margin-top: 9px;
      padding: 10px 11px;
      border: 1px solid var(--pta-border);
      border-radius: 12px;
      background: var(--pta-surface);
    }
    #pta-panel .pta-mission-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    #pta-panel .pta-mission-name {
      min-width: 0;
      font-size: 12px;
      font-weight: 780;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-badge {
      flex: 0 0 auto;
      padding: 3px 7px;
      border-radius: 999px;
      background: rgba(148,163,184,.11);
      color: #cbd5e1;
      font-size: 9px;
      font-weight: 800;
      white-space: nowrap;
    }
    #pta-panel .pta-badge.ready { background: var(--pta-green-soft); color: #bbf7d0; }
    #pta-panel .pta-badge.wait { background: var(--pta-amber-soft); color: #fde68a; }
    #pta-panel .pta-badge.current { background: var(--pta-blue-soft); color: #bfdbfe; }
    #pta-panel .pta-badge.danger { background: var(--pta-red-soft); color: #fecaca; }

    #pta-panel .pta-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    #pta-panel .pta-chip {
      max-width: 100%;
      padding: 4px 7px;
      border: 1px solid rgba(255,255,255,.075);
      border-radius: 999px;
      background: rgba(255,255,255,.035);
      color: #cbd5e1;
      font-size: 9px;
      font-weight: 680;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #pta-panel .pta-actions {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: 7px;
      margin-top: 9px;
    }
    #pta-panel .pta-action-btn {
      min-width: 0;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      padding: 9px 10px;
      background: rgba(255,255,255,.045);
      color: var(--pta-text);
      cursor: pointer;
      font-weight: 720;
      transition: transform .12s ease, background .15s ease, border-color .15s ease;
    }
    #pta-panel .pta-action-btn:hover {
      background: rgba(255,255,255,.09);
      border-color: var(--pta-border-strong);
    }
    #pta-panel .pta-action-btn:active { transform: translateY(1px); }
    #pta-panel .pta-action-btn.primary {
      border-color: rgba(96,165,250,.30);
      background: rgba(96,165,250,.12);
      color: #dbeafe;
    }

    #pta-panel .pta-section-title {
      margin: 12px 1px 6px;
      color: var(--pta-faint);
      font-size: 9px;
      font-weight: 850;
      letter-spacing: .075em;
      text-transform: uppercase;
    }
    #pta-panel details {
      margin-top: 7px;
      border: 1px solid var(--pta-border);
      border-radius: 12px;
      overflow: hidden;
      background: rgba(255,255,255,.022);
    }
    #pta-panel summary {
      display: flex;
      align-items: center;
      gap: 8px;
      list-style: none;
      padding: 9px 10px;
      cursor: pointer;
      color: #dbe2ea;
      font-weight: 720;
      user-select: none;
    }
    #pta-panel summary::-webkit-details-marker { display: none; }
    #pta-panel summary .pta-summary-main { min-width: 0; flex: 1; }
    #pta-panel summary .pta-summary-meta {
      color: var(--pta-muted);
      font-size: 9px;
      font-weight: 650;
    }
    #pta-panel summary::after {
      content: "⌄";
      color: var(--pta-muted);
      font-size: 13px;
      transition: transform .15s ease;
    }
    #pta-panel details[open] summary::after { transform: rotate(180deg); }

    #pta-panel .pta-settings {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 0 9px 9px;
    }
    #pta-panel .pta-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
      min-width: 0;
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      padding: 8px 9px;
      background: rgba(255,255,255,.03);
      color: #cbd5e1;
      cursor: pointer;
      text-align: left;
    }
    #pta-panel .pta-toggle:hover { background: rgba(255,255,255,.055); }
    #pta-panel .pta-toggle-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 10px;
      font-weight: 650;
    }
    #pta-panel .pta-switch {
      width: 27px;
      height: 16px;
      padding: 2px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: #475569;
    }
    #pta-panel .pta-switch::after {
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: white;
      transition: transform .16s ease;
    }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch { background: var(--pta-green); }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch::after { transform: translateX(11px); }

    #pta-panel .pta-modules { padding: 0 9px 9px; }
    #pta-panel .pta-module {
      display: grid;
      grid-template-columns: 8px minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 31px;
      padding: 6px 2px;
      color: #cbd5e1;
      border-top: 1px solid rgba(255,255,255,.05);
    }
    #pta-panel .pta-module:first-child { border-top: 0; }
    #pta-panel .pta-module-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 10px;
      font-weight: 670;
    }
    #pta-panel .pta-module-status {
      max-width: 170px;
      color: var(--pta-muted);
      font-size: 9px;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-mini-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #64748b;
    }
    #pta-panel .pta-mini-dot.ready { background: var(--pta-green); }
    #pta-panel .pta-mini-dot.wait { background: var(--pta-amber); }
    #pta-panel .pta-mini-dot.current { background: var(--pta-blue); }
    #pta-panel .pta-mini-dot.danger { background: var(--pta-red); }

    #pta-panel .pta-footer {
      margin-top: 10px;
      color: #526174;
      text-align: center;
      font-size: 9px;
      line-height: 1.4;
    }

    @media (max-width: 520px) {
      #pta-panel {
        right: 8px;
        bottom: 8px;
        width: calc(100vw - 16px);
        max-height: calc(100vh - 16px);
        border-radius: 16px;
      }
      #pta-panel .pta-body { max-height: calc(100vh - 74px); }
      #pta-panel[data-collapsed="true"] { width: min(270px, calc(100vw - 16px)); }
      #pta-panel .pta-metrics { grid-template-columns: repeat(2, 1fr); }
      #pta-panel .pta-metric:last-child { grid-column: 1 / -1; }
    }
  `);

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Jamais';
    const seconds = Math.max(0, Math.floor((now() - timestamp) / 1000));
    if (seconds < 5) return 'À l’instant';
    if (seconds < 60) return `Il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Il y a ${hours} h`;
  }

  function formatRemaining(timestamp) {
    if (!timestamp) return null;
    const remaining = timestamp - now();
    if (remaining <= 0) return 'Prêt';
    const totalSeconds = Math.ceil(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    return `${seconds}s`;
  }

  function expeditionPhaseLabel(phase) {
    const labels = {
      unknown: 'À synchroniser',
      ready_to_start: 'Prête à lancer',
      preparing: 'Préparation',
      starting: 'Lancement',
      running: 'En cours',
      due: 'Résultat prêt',
      opening_result: 'Ouverture résultat',
      result: 'Résultats',
      awaiting_capture: 'Capture manuelle',
      claiming: 'Récupération',
    };
    return labels[phase] || phase || 'Inconnu';
  }

  function nextDueModule() {
    return MODULES
      .filter(module => moduleEnabled(module.id))
      .map(module => ({
        module,
        dueAt: state.moduleStatus?.[module.id]?.nextDueAt || null,
      }))
      .filter(item => item.dueAt)
      .sort((a, b) => a.dueAt - b.dueAt)[0] || null;
  }

  function moduleDisplayStatus(module) {
    const current = moduleFromLocation();
    const status = state.moduleStatus?.[module.id] || {};

    if (current?.id === module.id) {
      if (status.nextDueAt) {
        const remaining = formatRemaining(status.nextDueAt);
        if (remaining === 'Prêt') return { className: 'ready', label: 'Ici · Prêt' };
        return { className: 'current', label: `Ici · ${remaining}` };
      }
      return { className: 'current', label: 'Ici' };
    }

    if (status.nextDueAt) {
      const remaining = formatRemaining(status.nextDueAt);
      if (remaining === 'Prêt') return { className: 'ready', label: 'Prêt' };
      return { className: 'wait', label: remaining };
    }

    if (status.lastVisitedAt) {
      return { className: '', label: 'RAS' };
    }

    return { className: '', label: 'Non vérifié' };
  }

  function expeditionPhaseMeta(phase) {
    const phaseName = expeditionPhaseLabel(phase);
    if (phase === 'due' || phase === 'claiming') {
      return { tone: 'ready', label: phaseName };
    }
    if (phase === 'awaiting_capture') {
      return { tone: 'danger', label: phaseName };
    }
    if (['preparing', 'starting', 'opening_result', 'result'].includes(phase)) {
      return { tone: 'current', label: phaseName };
    }
    if (phase === 'running') {
      return { tone: 'wait', label: phaseName };
    }
    return { tone: '', label: phaseName };
  }

  function panelNextDecision() {
    const decision = state.orchestrator?.lastDecision;
    const reason = state.orchestrator?.lastReason;

    if (!config.enabled) {
      return {
        title: 'Automatisation en pause',
        reason: 'Active le bot ou exécute un cycle manuel pour reprendre.',
        tone: 'danger',
        icon: 'Ⅱ',
      };
    }

    if (expeditionCycle().phase === 'awaiting_capture') {
      return {
        title: 'Décision de capture requise',
        reason: state.captureDecision?.reason || 'Une rencontre attend une décision.',
        tone: 'danger',
        icon: '!',
      };
    }

    let preview = null;
    try {
      preview = orchestratorPlan()?.[0] || null;
    } catch {
      preview = null;
    }

    if (preview) {
      return {
        title: preview.name.replace(/^navigation:/, 'Navigation · '),
        reason: preview.reason || 'Action prioritaire sélectionnée par l’orchestrateur.',
        tone: preview.priority >= 9000 ? 'ready' : 'current',
        icon: '→',
      };
    }

    if (decision && decision !== 'wait') {
      return {
        title: decision.replace(/^navigation:/, 'Navigation · '),
        reason: reason || 'Dernière décision de l’orchestrateur.',
        tone: 'current',
        icon: '↺',
      };
    }

    const next = nextDueModule();
    if (next) {
      return {
        title: `${next.module.label} dans ${formatRemaining(next.dueAt)}`,
        reason: 'Aucune action immédiate, prochaine échéance connue.',
        tone: 'wait',
        icon: '◷',
      };
    }

    return {
      title: 'En attente',
      reason: 'Aucune action nécessaire pour le moment.',
      tone: '',
      icon: '·',
    };
  }

  function plannedTeamNames() {
    const planned = state.expeditionPlan?.team;
    if (Array.isArray(planned) && planned.length) return planned;
    const previous = state.smartTeam?.lastSelection;
    return Array.isArray(previous) ? previous.slice(-3) : [];
  }

  function chipHtml(label, title = '') {
    return `<span class="pta-chip" title="${escapeHtml(title || label)}">${escapeHtml(label)}</span>`;
  }

  function enabledOptionCount(keys) {
    return keys.filter(key => Boolean(config[key])).length;
  }

  function ensurePanel() {
    if (document.getElementById('pta-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'pta-panel';
    document.body.appendChild(panel);
    panel.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;

      if (action === 'enabled') {
        setEnabled(!config.enabled);
        return;
      }

      if (action === 'run') {
        cycle(true);
        return;
      }

      if (action === 'collapse') {
        config.panelCollapsed = !config.panelCollapsed;
        saveConfig(config);
        updatePanel();
        return;
      }

      if (action === 'ranking') {
        const ranking = rankExpeditions();
        if (!ranking.length) {
          state.lastAction = 'Aucune expédition lançable sur cette page';
          saveState(state);
          updatePanel();
          return;
        }
        console.table(ranking.map(item => ({
          expedition: item.title,
          score: item.score,
          progression: item.progressionRank,
          niveauConseille: item.requiredLevel ?? '?',
          equipe: item.teamPlan?.known
            ? item.teamPlan.team.map(pokemon => pokemon.name).join(', ') || 'aucune'
            : 'à confirmer',
          equipeViable: item.teamPlan?.viable ?? '?',
          scoreEquipe: item.teamPlan?.teamScore ?? '?',
          rencontre: item.chance != null ? item.chance + '%' : '?',
          dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
          echecs: item.failureStreak,
          raisons: item.reasons.join(' | '),
        })));
        state.lastAction = `Classement affiché (${ranking.length} expéditions)`;
        saveState(state);
        updatePanel();
        return;
      }

      toggleOption(action);
    });
    updatePanel();
  }

  function optionButton(key, label) {
    return `
      <button class="pta-toggle" data-action="${key}" data-on="${config[key]}" title="${config[key] ? 'Désactiver' : 'Activer'} ${escapeHtml(label)}">
        <span class="pta-toggle-label">${escapeHtml(label)}</span>
        <span class="pta-switch" aria-hidden="true"></span>
      </button>
    `;
  }

  function updatePanel() {
    const panel = document.getElementById('pta-panel');
    if (!panel) return;

    const detailsState = {};
    panel.querySelectorAll('details[data-section]').forEach(details => {
      detailsState[details.dataset.section] = details.open;
    });

    const current = moduleFromLocation();
    const next = nextDueModule();
    const cycleMeta = expeditionPhaseMeta(expeditionCycle().phase);
    const decision = panelNextDecision();
    const team = plannedTeamNames();
    const activeModules = MODULES.filter(module => moduleEnabled(module.id));
    const rosterCount = state.rosterSnapshot?.pokemon?.length || 0;
    const rosterAge = state.rosterSnapshot?.capturedAt
      ? formatRelativeTime(state.rosterSnapshot.capturedAt)
      : 'Jamais';
    const missionTitle = state.selectedExpedition || state.expeditionPlan?.title || 'Aucune mission ciblée';
    const missionPlan = state.expeditionPlan || {};
    const missionScore = state.selectedExpeditionScore;
    const missionReason = missionPlan.reason || state.orchestrator?.lastReason || '';
    const nextText = next
      ? `${next.module.label} · ${formatRemaining(next.dueAt)}`
      : 'Aucune';

    const activityKeys = [
      'autoClaimExpeditions',
      'autoStartExpeditions',
      'autoHeal',
      'autoHarvest',
      'autoIncubatorClaim',
      'autoBreedingClaim',
      'autoProgression',
      'autoPlant',
    ];
    const intelligenceKeys = ['smartTeam', 'smartCapture'];
    const captureKeys = [
      'autoCapture',
      'captureNewSpecies',
      'captureRare',
      'captureUnknownEncounters',
    ];

    const modulesHtml = activeModules
      .map(module => {
        const display = moduleDisplayStatus(module);
        return `
          <div class="pta-module">
            <span class="pta-mini-dot ${display.className}"></span>
            <span class="pta-module-name">${escapeHtml(module.label)}</span>
            <span class="pta-module-status">${escapeHtml(display.label)}</span>
          </div>
        `;
      })
      .join('');

    const teamChips = team.length
      ? team.map(name => chipHtml(name)).join('')
      : chipHtml('Équipe à confirmer');

    const missionChips = [
      team.length ? `Équipe · ${team.length}` : 'Roster à confirmer',
      missionScore != null ? `Score · ${missionScore}` : null,
      missionPlan.teamScore != null ? `Équipe · ${missionPlan.teamScore}` : null,
    ]
      .filter(Boolean)
      .map(label => chipHtml(label))
      .join('');

    const captureLabel = state.captureDecision?.species
      ? `${state.captureDecision.species} · ${state.captureDecision.action}`
      : 'Aucune décision';
    const captureTone = state.captureDecision?.action === 'capture'
      ? 'ready'
      : state.captureDecision?.action === 'manual'
        ? 'danger'
        : '';

    panel.dataset.collapsed = String(Boolean(config.panelCollapsed));
    panel.innerHTML = `
      <div class="pta-header">
        <span class="pta-dot" data-on="${config.enabled}"></span>
        <div class="pta-brand">
          <div class="pta-title-row">
            <div class="pta-title">PokéTaka Automation</div>
            <span class="pta-version">v${VERSION}</span>
          </div>
          <div class="pta-subtitle">
            ${escapeHtml(current?.label || 'Page PokéTaka')} · ${config.enabled ? 'Pilotage actif' : 'En pause'}
          </div>
        </div>
        <button
          class="pta-icon-btn"
          data-action="collapse"
          title="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau"
          aria-label="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau"
        >${config.panelCollapsed ? '▣' : '—'}</button>
      </div>

      <div class="pta-body">
        <section class="pta-status-hero" aria-label="État de l’automatisation">
          <div class="pta-status-top">
            <div>
              <div class="pta-eyebrow">État du bot</div>
              <div class="pta-status-title">
                ${config.enabled ? 'Automatisation active' : 'Automatisation en pause'}
              </div>
              <div class="pta-status-copy">
                Cycle expédition · ${escapeHtml(cycleMeta.label)}
              </div>
            </div>

            <button
              class="pta-master"
              data-action="enabled"
              data-on="${config.enabled}"
              aria-pressed="${config.enabled}"
              title="${config.enabled ? 'Mettre en pause' : 'Activer'} l’automatisation"
            >
              <span>${config.enabled ? 'ON' : 'OFF'}</span>
              <span class="pta-master-knob">${config.enabled ? '✓' : '×'}</span>
            </button>
          </div>

          <div class="pta-next" data-tone="${decision.tone}">
            <div class="pta-next-row">
              <div class="pta-next-icon">${escapeHtml(decision.icon)}</div>
              <div class="pta-next-main">
                <div class="pta-eyebrow">Prochaine décision</div>
                <div class="pta-next-title" title="${escapeHtml(decision.title)}">
                  ${escapeHtml(decision.title)}
                </div>
                <div class="pta-next-reason" title="${escapeHtml(decision.reason)}">
                  ${escapeHtml(decision.reason)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="pta-metrics">
          <div class="pta-metric">
            <div class="pta-label">Échéance</div>
            <div class="pta-value" title="${escapeHtml(nextText)}">${escapeHtml(nextText)}</div>
          </div>
          <div class="pta-metric">
            <div class="pta-label">Actions</div>
            <div class="pta-value">${state.actions} <small>· ${escapeHtml(formatRelativeTime(state.lastActionAt))}</small></div>
          </div>
          <div class="pta-metric">
            <div class="pta-label">Roster</div>
            <div class="pta-value">${rosterCount || '—'} <small>· ${escapeHtml(rosterAge)}</small></div>
          </div>
        </div>

        <section class="pta-mission" aria-label="Plan d’expédition">
          <div class="pta-mission-head">
            <div class="pta-mission-name" title="${escapeHtml(missionTitle)}">
              ${escapeHtml(missionTitle)}
            </div>
            <span class="pta-badge ${cycleMeta.tone}">${escapeHtml(cycleMeta.label)}</span>
          </div>

          <div class="pta-chip-row">${missionChips || chipHtml('Aucun plan actif')}</div>
          <div class="pta-chip-row">${teamChips}</div>

          ${missionReason ? `
            <div class="pta-status-copy" title="${escapeHtml(missionReason)}">
              ${escapeHtml(missionReason)}
            </div>
          ` : ''}
        </section>

        <div class="pta-actions">
          <button class="pta-action-btn primary" data-action="run">▶ Exécuter un cycle</button>
          <button class="pta-action-btn" data-action="ranking">☷ Classement</button>
        </div>

        <div class="pta-section-title">Surveillance</div>

        <details data-section="modules" ${detailsState.modules ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Modules</span>
            <span class="pta-summary-meta">${activeModules.length} actifs</span>
          </summary>
          <div class="pta-modules">
            ${modulesHtml || '<div class="pta-module"><span class="pta-module-name">Aucun module actif</span></div>'}
          </div>
        </details>

        <details data-section="intelligence" ${detailsState.intelligence !== false ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Décisions intelligentes</span>
            <span class="pta-summary-meta">${missionPlan.viability || '—'}</span>
          </summary>
          <div class="pta-modules">
            <div class="pta-module">
              <span class="pta-mini-dot current"></span>
              <span class="pta-module-name">Orchestrateur</span>
              <span class="pta-module-status" title="${escapeHtml(state.orchestrator?.lastReason || '')}">
                ${escapeHtml(state.orchestrator?.lastDecision || 'En attente')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${missionPlan.viability === 'blocked' ? 'danger' : missionPlan.viability === 'viable' ? 'ready' : ''}"></span>
              <span class="pta-module-name">Plan équipe</span>
              <span class="pta-module-status" title="${escapeHtml(team.join(', ') || 'À confirmer')}">
                ${escapeHtml(team.join(', ') || 'À confirmer')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${captureTone}"></span>
              <span class="pta-module-name">Capture</span>
              <span class="pta-module-status" title="${escapeHtml(state.captureDecision?.reason || '')}">
                ${escapeHtml(captureLabel)}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot"></span>
              <span class="pta-module-name">Dernière action</span>
              <span class="pta-module-status" title="${escapeHtml(state.lastAction || '')}">
                ${escapeHtml(state.lastAction || 'Aucune')}
              </span>
            </div>
          </div>
        </details>

        <div class="pta-section-title">Réglages</div>

        <details data-section="automation" ${detailsState.automation ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Automatisation</span>
            <span class="pta-summary-meta">
              ${enabledOptionCount(activityKeys)}/${activityKeys.length}
            </span>
          </summary>
          <div class="pta-settings">
            ${optionButton('autoClaimExpeditions', 'Récompenses')}
            ${optionButton('autoStartExpeditions', 'Expéditions')}
            ${optionButton('autoHeal', 'Soins')}
            ${optionButton('autoHarvest', 'Serre')}
            ${optionButton('autoIncubatorClaim', 'Incubateur')}
            ${optionButton('autoBreedingClaim', 'Pension')}
            ${optionButton('autoProgression', 'Progression')}
            ${optionButton('autoPlant', 'Replanter')}
          </div>
        </details>

        <details data-section="smart-settings" ${detailsState['smart-settings'] ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Intelligence</span>
            <span class="pta-summary-meta">
              ${enabledOptionCount(intelligenceKeys)}/${intelligenceKeys.length}
            </span>
          </summary>
          <div class="pta-settings">
            ${optionButton('smartTeam', 'Équipe intelligente')}
            ${optionButton('smartCapture', 'Capture intelligente')}
          </div>
        </details>

        <details data-section="capture-settings" ${detailsState['capture-settings'] ? 'open' : ''}>
          <summary>
            <span class="pta-summary-main">Captures</span>
            <span class="pta-summary-meta">
              ${enabledOptionCount(captureKeys)}/${captureKeys.length}
            </span>
          </summary>
          <div class="pta-settings">
            ${optionButton('autoCapture', 'Captures auto')}
            ${optionButton('captureNewSpecies', 'Nouvelles espèces')}
            ${optionButton('captureRare', 'Rares')}
            ${optionButton('captureUnknownEncounters', 'Captures inconnues')}
          </div>
        </details>

        <div class="pta-footer">
          Smart Expedition · GitHub Raw · actions destructrices bloquées
        </div>
      </div>
    `;
  }
