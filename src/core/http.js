let directRequestInFlight = false;

function httpTransportState() {
  if (!state.httpTransport || typeof state.httpTransport !== 'object') {
    state.httpTransport = {
      requests: 0,
      lastAt: 0,
      lastEndpoint: null,
      lastKind: null,
      lastStatus: null,
      lastError: null,
    };
  }
  return state.httpTransport;
}

function directActionKind(urlLike) {
  let url;
  try {
    url = new URL(urlLike, location.href);
  } catch {
    return null;
  }

  if (url.origin !== location.origin) return null;

  const path = url.pathname;
  const routes = [
    ['capture', /^\/expeditions\/encounters\/[^/]+\/capture\/?$/],
    ['expedition_launch', /^\/expeditions\/[^/]+\/launch\/?$/],
    ['gym_challenge', /^\/gyms\/[^/]+\/challenge\/?$/],
    ['pokemon_level_up', /^\/collection\/[^/]+\/level-up\/?$/],
    ['pokemon_evolve', /^\/collection\/[^/]+\/evolve\/?$/],
    ['pokemon_item', /^\/collection\/[^/]+\/items\/[a-z0-9_-]+\/?$/i],
  ];

  return routes.find(([, pattern]) => pattern.test(path))?.[0] || null;
}

function formMethod(form) {
  return String(form?.getAttribute('method') || form?.method || 'GET').toUpperCase();
}

function formDataWithOverrides(form, overrides = {}) {
  const data = new FormData(form);

  for (const [key, value] of Object.entries(overrides || {})) {
    data.delete(key);

    if (Array.isArray(value)) {
      value.forEach(entry => {
        if (entry != null) data.append(key, String(entry));
      });
      continue;
    }

    if (value != null) data.set(key, String(value));
  }

  return data;
}

function requestBodyFromForm(form, overrides = {}) {
  const data = formDataWithOverrides(form, overrides);
  const enctype = String(form.enctype || '').toLowerCase();

  if (enctype.includes('multipart/form-data')) {
    return { body: data, headers: {} };
  }

  const params = new URLSearchParams();
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string') params.append(key, value);
  }

  return {
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };
}

function directRequestErrorFromHtml(html) {
  if (!html || typeof DOMParser === 'undefined') return null;

  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const error = doc.querySelector(
      '.error-summary, [role="alert"].context-alert, .field-error[role="alert"]'
    );
    const text = error?.textContent?.replace(/\s+/g, ' ').trim();
    return text || null;
  } catch {
    return null;
  }
}

function recordHttpTransport(patch = {}) {
  state.httpTransport = {
    ...httpTransportState(),
    ...patch,
  };
  saveState(state);
  updatePanel();
}

function recordDirectAction(actionName, kind, endpoint) {
  state.lastActionAt = now();
  state.lastAction = actionName;
  state.actions += 1;
  markModuleAction(moduleFromLocation()?.id);

  recordHttpTransport({
    requests: Number(httpTransportState().requests || 0) + 1,
    lastAt: now(),
    lastEndpoint: endpoint,
    lastKind: kind,
    lastStatus: 'pending',
    lastError: null,
  });
}

function finalizeDirectNavigation(response) {
  let finalUrl = null;

  try {
    finalUrl = new URL(response.url || location.href, location.href);
  } catch {
    finalUrl = new URL(location.href);
  }

  if (finalUrl.origin !== location.origin) {
    throw new Error('Redirection cross-origin refusée');
  }

  if (/^\/login\/?$/.test(finalUrl.pathname)) {
    throw new Error('Session PokéTaka expirée');
  }

  const current = new URL(location.href);

  if (
    finalUrl.pathname === current.pathname &&
    finalUrl.search === current.search
  ) {
    location.reload();
    return;
  }

  location.assign(finalUrl.href);
}

async function submitObservedForm(
  form,
  actionName,
  {
    overrides = {},
    expectedKind = null,
    navigate = true,
  } = {}
) {
  if (!config.directHttpActions) return false;
  if (!form || directRequestInFlight) return false;
  if (formMethod(form) !== 'POST') return false;

  const action = form.getAttribute('action') || form.action;
  const kind = directActionKind(action);
  if (!kind) {
    log('HTTP direct refusé: endpoint non autorisé', action);
    return false;
  }

  if (expectedKind && kind !== expectedKind) {
    log('HTTP direct refusé: type inattendu', { expectedKind, kind, action });
    return false;
  }

  const url = new URL(action, location.href);
  const { body, headers } = requestBodyFromForm(form, overrides);

  const csrf = body instanceof URLSearchParams
    ? body.get('_token')
    : body.get('_token');
  const idempotency = body instanceof URLSearchParams
    ? body.get('idempotency_key')
    : body.get('idempotency_key');

  if (!csrf) {
    log('HTTP direct refusé: token CSRF absent', kind);
    return false;
  }

  // Les actions critiques observées utilisent une clé d'idempotence. On la
  // conserve telle quelle et on refuse d'en inventer une.
  if (
    ['capture', 'expedition_launch', 'gym_challenge', 'pokemon_level_up', 'pokemon_evolve', 'pokemon_item']
      .includes(kind) &&
    !idempotency
  ) {
    log('HTTP direct refusé: clé idempotency absente', kind);
    return false;
  }

  directRequestInFlight = true;
  recordDirectAction(actionName, kind, url.pathname);

  try {
    const response = await fetch(url.href, {
      method: 'POST',
      body,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        ...headers,
      },
      credentials: 'same-origin',
      redirect: 'follow',
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const html = contentType.includes('text/html')
      ? await response.text()
      : '';

    const errorText = directRequestErrorFromHtml(html);

    if (!response.ok || errorText) {
      const message = errorText || `HTTP ${response.status}`;
      recordHttpTransport({
        lastStatus: response.status,
        lastError: message,
      });
      state.lastAction = `${actionName} — échec: ${message}`;
      saveState(state);
      updatePanel();
      log('HTTP direct en échec', {
        kind,
        endpoint: url.pathname,
        status: response.status,
        message,
      });
      return false;
    }

    recordHttpTransport({
      lastStatus: response.status,
      lastError: null,
    });

    log('HTTP direct réussi', {
      kind,
      endpoint: url.pathname,
      status: response.status,
      finalUrl: response.url,
    });

    if (navigate) finalizeDirectNavigation(response);
    return true;
  } catch (error) {
    const message = error?.message || String(error);
    recordHttpTransport({
      lastStatus: 'error',
      lastError: message,
    });
    state.lastAction = `${actionName} — erreur HTTP: ${message}`;
    saveState(state);
    updatePanel();
    console.error('[PokéTaka Auto] HTTP direct', kind, error);
    return false;
  } finally {
    directRequestInFlight = false;
  }
}

function recentDirectRequest(maxAgeMs = 6000) {
  return now() - Number(httpTransportState().lastAt || 0) <= maxAgeMs;
}

function navigateDirectly(urlLike, actionName) {
  let url;

  try {
    url = new URL(urlLike, location.href);
  } catch {
    return false;
  }

  if (url.origin !== location.origin) return false;

  state.lastActionAt = now();
  state.lastAction = actionName;
  state.lastNavigationAt = now();
  state.actions += 1;
  saveState(state);
  updatePanel();

  location.assign(url.href);
  return true;
}
