function elementText(el) {
    return normalizeText([
      el?.innerText,
      el?.textContent,
      el?.getAttribute?.('aria-label'),
      el?.getAttribute?.('title'),
      el?.getAttribute?.('value'),
    ].filter(Boolean).join(' '));
  }

  function isVisible(el) {
    if (!el || !el.isConnected || el.disabled) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity) !== 0 &&
      rect.width > 0 && rect.height > 0;
  }

  function isUnsafe(el) {
    const text = elementText(el);
    return UNSAFE_WORDS.some(word => text.includes(word));
  }

  function clickableElements(root = document) {
    return [...root.querySelectorAll('button, a[href], input[type="submit"], input[type="button"], [role="button"]')]
      .filter(isVisible)
      .filter(el => !isUnsafe(el));
  }

  function findClickable(patterns, root = document, { exclude = [] } = {}) {
    const wanted = patterns.map(normalizeText);
    const blocked = exclude.map(normalizeText);
    return clickableElements(root).find(el => {
      const text = elementText(el);
      return wanted.some(pattern => text.includes(pattern)) &&
        !blocked.some(pattern => text.includes(pattern));
    }) || null;
  }

  function findAllClickables(patterns, root = document, { exclude = [] } = {}) {
    const wanted = patterns.map(normalizeText);
    const blocked = exclude.map(normalizeText);
    return clickableElements(root).filter(el => {
      const text = elementText(el);
      return wanted.some(pattern => text.includes(pattern)) &&
        !blocked.some(pattern => text.includes(pattern));
    });
  }

  async function clickElement(el, actionName) {
    if (!el || !isVisible(el) || isUnsafe(el)) return false;

    state.lastActionAt = now();
    state.lastBotClickAt = now();
    state.lastAction = actionName;
    state.actions += 1;
    markModuleAction(moduleFromLocation()?.id);
    appendActionLog(
      'info',
      'dom',
      actionName,
      {
        tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      }
    );
    saveState(state);
    updatePanel();

    log('Action:', actionName, el);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(300 + Math.floor(Math.random() * 600));
    el.click();
    return true;
  }

  function recentBotAction(maxAgeMs = 6000) {
    return now() - state.lastBotClickAt <= maxAgeMs;
  }

  async function handleConfirmation() {
    if (!recentBotAction()) return false;
    const confirm = findClickable(
      ['confirmer', 'confirm', 'oui', 'yes', 'valider'],
      document,
      { exclude: ['annuler', 'cancel'] },
    );
    if (!confirm) return false;
    return clickElement(confirm, 'Confirmation');
  }
