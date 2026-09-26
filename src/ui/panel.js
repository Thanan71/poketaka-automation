GM_addStyle(`
    #pta-panel {
      --pta-bg: rgba(10, 16, 28, .96);
      --pta-card: rgba(255,255,255,.055);
      --pta-border: rgba(255,255,255,.10);
      --pta-text: #f8fafc;
      --pta-muted: #94a3b8;
      --pta-green: #22c55e;
      --pta-amber: #f59e0b;
      --pta-red: #ef4444;
      --pta-blue: #60a5fa;
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      width: min(356px, calc(100vw - 24px));
      overflow: hidden;
      border-radius: 18px;
      background: var(--pta-bg);
      color: var(--pta-text);
      font: 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 18px 60px rgba(0,0,0,.42);
      border: 1px solid var(--pta-border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    #pta-panel * { box-sizing: border-box; }
    #pta-panel button, #pta-panel summary { font: inherit; }
    #pta-panel button { -webkit-tap-highlight-color: transparent; }
    #pta-panel .pta-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 13px;
      border-bottom: 1px solid var(--pta-border);
    }
    #pta-panel .pta-brand {
      min-width: 0;
      flex: 1;
    }
    #pta-panel .pta-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 14px;
      font-weight: 760;
      letter-spacing: -.01em;
    }
    #pta-panel .pta-version {
      color: var(--pta-muted);
      font-size: 10px;
      font-weight: 600;
    }
    #pta-panel .pta-subtitle {
      margin-top: 2px;
      color: var(--pta-muted);
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-dot {
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: var(--pta-red);
      box-shadow: 0 0 0 3px rgba(239,68,68,.12);
    }
    #pta-panel .pta-dot[data-on="true"] {
      background: var(--pta-green);
      box-shadow: 0 0 0 3px rgba(34,197,94,.12);
    }
    #pta-panel .pta-icon-btn {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border: 1px solid var(--pta-border);
      border-radius: 9px;
      background: rgba(255,255,255,.04);
      color: var(--pta-muted);
      cursor: pointer;
    }
    #pta-panel .pta-icon-btn:hover { background: rgba(255,255,255,.09); color: var(--pta-text); }
    #pta-panel .pta-body { padding: 12px; }
    #pta-panel[data-collapsed="true"] .pta-body { display: none; }
    #pta-panel[data-collapsed="true"] { width: 270px; }
    #pta-panel .pta-master {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 12px;
      border: 1px solid rgba(239,68,68,.26);
      border-radius: 12px;
      background: rgba(239,68,68,.09);
      color: var(--pta-text);
      cursor: pointer;
      text-align: left;
      font-weight: 700;
    }
    #pta-panel .pta-master[data-on="true"] {
      border-color: rgba(34,197,94,.28);
      background: rgba(34,197,94,.10);
    }
    #pta-panel .pta-master-state { color: var(--pta-muted); font-size: 11px; font-weight: 600; }
    #pta-panel .pta-master[data-on="true"] .pta-master-state { color: #86efac; }
    #pta-panel .pta-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 9px;
    }
    #pta-panel .pta-card {
      min-width: 0;
      padding: 9px 10px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      background: var(--pta-card);
    }
    #pta-panel .pta-card-wide { grid-column: 1 / -1; }
    #pta-panel .pta-label {
      color: var(--pta-muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .045em;
      text-transform: uppercase;
    }
    #pta-panel .pta-value {
      margin-top: 3px;
      min-width: 0;
      font-size: 12px;
      font-weight: 650;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #pta-panel .pta-value small { color: var(--pta-muted); font-size: 10px; font-weight: 600; }
    #pta-panel .pta-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      margin-top: 9px;
    }
    #pta-panel .pta-action-btn {
      border: 1px solid var(--pta-border);
      border-radius: 10px;
      padding: 8px 9px;
      background: rgba(255,255,255,.055);
      color: var(--pta-text);
      cursor: pointer;
      font-weight: 650;
    }
    #pta-panel .pta-action-btn:hover { background: rgba(255,255,255,.10); }
    #pta-panel .pta-action-btn.primary {
      border-color: rgba(96,165,250,.28);
      background: rgba(96,165,250,.10);
    }
    #pta-panel details {
      margin-top: 9px;
      border: 1px solid var(--pta-border);
      border-radius: 11px;
      overflow: hidden;
      background: rgba(255,255,255,.025);
    }
    #pta-panel summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      list-style: none;
      padding: 9px 10px;
      cursor: pointer;
      color: #cbd5e1;
      font-weight: 700;
      user-select: none;
    }
    #pta-panel summary::-webkit-details-marker { display: none; }
    #pta-panel summary::after { content: "▾"; color: var(--pta-muted); }
    #pta-panel details[open] summary::after { content: "▴"; }
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
      gap: 8px;
      min-width: 0;
      border: 1px solid var(--pta-border);
      border-radius: 9px;
      padding: 8px 9px;
      background: rgba(255,255,255,.035);
      color: #cbd5e1;
      cursor: pointer;
      text-align: left;
    }
    #pta-panel .pta-toggle-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #pta-panel .pta-switch {
      width: 26px;
      height: 15px;
      padding: 2px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: #475569;
    }
    #pta-panel .pta-switch::after {
      content: "";
      display: block;
      width: 11px;
      height: 11px;
      border-radius: 999px;
      background: white;
      transition: transform .16s ease;
    }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch { background: var(--pta-green); }
    #pta-panel .pta-toggle[data-on="true"] .pta-switch::after { transform: translateX(11px); }
    #pta-panel .pta-modules { padding: 0 9px 9px; }
    #pta-panel .pta-module {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 1px;
      color: #cbd5e1;
      border-top: 1px solid rgba(255,255,255,.055);
    }
    #pta-panel .pta-module:first-child { border-top: 0; }
    #pta-panel .pta-module-name { flex: 1; }
    #pta-panel .pta-module-status { color: var(--pta-muted); font-size: 11px; text-align: right; }
    #pta-panel .pta-mini-dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: #64748b;
    }
    #pta-panel .pta-mini-dot.ready { background: var(--pta-green); }
    #pta-panel .pta-mini-dot.wait { background: var(--pta-amber); }
    #pta-panel .pta-mini-dot.current { background: var(--pta-blue); }
    #pta-panel .pta-footer {
      margin-top: 9px;
      color: #64748b;
      text-align: center;
      font-size: 10px;
    }
    @media (max-width: 520px) {
      #pta-panel { right: 8px; bottom: 8px; width: calc(100vw - 16px); }
      #pta-panel[data-collapsed="true"] { width: 240px; }
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
          chance: item.chance ?? '?',
          niveauRequis: item.requiredLevel ?? '?',
          niveauEquipe: item.teamLevel ?? '?',
          dureeMin: item.durationMinutes != null ? Math.round(item.durationMinutes) : '?',
          recompenses: item.rewardScore,
          nouvelle: item.newProgression,
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
    const nextText = next
      ? `${next.module.label} · ${formatRemaining(next.dueAt)}`
      : 'Aucune échéance connue';

    const modulesHtml = MODULES
      .filter(module => moduleEnabled(module.id))
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

    panel.dataset.collapsed = String(Boolean(config.panelCollapsed));
    panel.innerHTML = `
      <div class="pta-header">
        <span class="pta-dot" data-on="${config.enabled}"></span>
        <div class="pta-brand">
          <div class="pta-title">PokéTaka Automation <span class="pta-version">v${VERSION}</span></div>
          <div class="pta-subtitle">${config.enabled ? 'Pilotage actif' : 'En pause'} · ${escapeHtml(current?.label || 'Page PokéTaka')}</div>
        </div>
        <button class="pta-icon-btn" data-action="collapse" title="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau" aria-label="${config.panelCollapsed ? 'Développer' : 'Réduire'} le panneau">
          ${config.panelCollapsed ? '▣' : '—'}
        </button>
      </div>

      <div class="pta-body">
        <button class="pta-master" data-action="enabled" data-on="${config.enabled}">
          <span>${config.enabled ? 'Automatisation active' : 'Automatisation en pause'}</span>
          <span class="pta-master-state">${config.enabled ? 'ON' : 'OFF'}</span>
        </button>

        <div class="pta-overview">
          <div class="pta-card">
            <div class="pta-label">Prochaine échéance</div>
            <div class="pta-value">${escapeHtml(nextText)}</div>
          </div>
          <div class="pta-card">
            <div class="pta-label">Actions</div>
            <div class="pta-value">${state.actions} <small>· ${escapeHtml(formatRelativeTime(state.lastActionAt))}</small></div>
          </div>
          <div class="pta-card pta-card-wide">
            <div class="pta-label">Dernière action</div>
            <div class="pta-value" title="${escapeHtml(state.lastAction)}">${escapeHtml(state.lastAction || 'Aucune')}</div>
          </div>
          <div class="pta-card">
            <div class="pta-label">Cycle expédition</div>
            <div class="pta-value">${escapeHtml(expeditionPhaseLabel(expeditionCycle().phase))}</div>
          </div>
          <div class="pta-card">
            <div class="pta-label">Cible</div>
            <div class="pta-value" title="${escapeHtml(state.selectedExpedition || '')}">
              ${escapeHtml(state.selectedExpedition || 'Aucune')}
              ${state.selectedExpeditionScore != null ? `<small> · ${state.selectedExpeditionScore}</small>` : ''}
            </div>
          </div>
        </div>

        <div class="pta-actions">
          <button class="pta-action-btn primary" data-action="run">▶ Exécuter maintenant</button>
          <button class="pta-action-btn" data-action="ranking">☷ Voir le classement</button>
        </div>

        <details data-section="modules" ${detailsState.modules ? 'open' : ''}>
          <summary>Modules surveillés</summary>
          <div class="pta-modules">
            ${modulesHtml || '<div class="pta-module"><span class="pta-module-name">Aucun module actif</span></div>'}
          </div>
        </details>

        <details data-section="intelligence" ${detailsState.intelligence ? 'open' : ''}>
          <summary>Décisions intelligentes</summary>
          <div class="pta-modules">
            <div class="pta-module">
              <span class="pta-mini-dot current"></span>
              <span class="pta-module-name">Orchestrateur</span>
              <span class="pta-module-status" title="${escapeHtml(state.orchestrator?.lastReason || '')}">
                ${escapeHtml(state.orchestrator?.lastDecision || 'En attente')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot"></span>
              <span class="pta-module-name">Équipe prévue</span>
              <span class="pta-module-status">
                ${escapeHtml((state.expeditionPlan?.team || state.smartTeam?.lastSelection || []).slice(-3).join(', ') || '—')}
              </span>
            </div>
            <div class="pta-module">
              <span class="pta-mini-dot ${state.captureDecision?.action === 'capture' ? 'ready' : ''}"></span>
              <span class="pta-module-name">Capture</span>
              <span class="pta-module-status" title="${escapeHtml(state.captureDecision?.reason || '')}">
                ${escapeHtml(
                  state.captureDecision?.species
                    ? `${state.captureDecision.species}: ${state.captureDecision.action}`
                    : '—'
                )}
              </span>
            </div>
          </div>
        </details>

        <details data-section="settings" ${detailsState.settings ? 'open' : ''}>
          <summary>Réglages automatiques</summary>
          <div class="pta-settings">
            ${optionButton('autoClaimExpeditions', 'Récompenses')}
            ${optionButton('autoStartExpeditions', 'Expéditions')}
            ${optionButton('autoHeal', 'Soins')}
            ${optionButton('autoHarvest', 'Serre')}
            ${optionButton('autoIncubatorClaim', 'Incubateur')}
            ${optionButton('autoBreedingClaim', 'Pension')}
            ${optionButton('autoProgression', 'Progression')}
            ${optionButton('smartTeam', 'Équipe intelligente')}
            ${optionButton('autoCapture', 'Captures auto')}
            ${optionButton('smartCapture', 'Capture intelligente')}
            ${optionButton('captureNewSpecies', 'Nouvelles espèces')}
            ${optionButton('captureRare', 'Rares')}
            ${optionButton('captureUnknownEncounters', 'Captures inconnues')}
            ${optionButton('autoPlant', 'Replanter')}
          </div>
        </details>

        <div class="pta-footer">Smart Expedition v0.8 · mission + équipe · captures prudentes · actions destructrices bloquées</div>
      </div>
    `;
  }
