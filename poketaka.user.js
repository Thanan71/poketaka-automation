// ==UserScript==
// @name         PokéTaka Automation
// @namespace    https://github.com/Thanan71/poketaka-automation
// @version      2026.9.26.0
// @description  Loader léger pour PokéTaka Automation. Le runtime est publié automatiquement depuis GitHub.
// @author       Thanan71
// @match        https://poketaka.fr/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @connect      thanan71.github.io
// @updateURL    https://thanan71.github.io/poketaka-automation/poketaka.user.js
// @downloadURL  https://thanan71.github.io/poketaka-automation/poketaka.user.js
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_VERSION = GM_info?.script?.version || '2026.9.26.0';
  const RUNTIME_URL = `https://thanan71.github.io/poketaka-automation/runtime.js?v=${encodeURIComponent(SCRIPT_VERSION)}`;
  const CACHE_KEY = 'poketaka-automation:runtime-cache';

  function executeRuntime(code, source = RUNTIME_URL) {
    const runner = new Function(
      'GM_getValue',
      'GM_setValue',
      'GM_addStyle',
      'GM_registerMenuCommand',
      'GM_xmlhttpRequest',
      'GM_info',
      `${code}\n//# sourceURL=${source}`
    );

    runner(
      GM_getValue,
      GM_setValue,
      GM_addStyle,
      GM_registerMenuCommand,
      GM_xmlhttpRequest,
      GM_info
    );
  }

  function runCachedRuntime(reason) {
    const cached = GM_getValue(CACHE_KEY, null);
    if (cached?.code) {
      console.warn('[PokéTaka Loader] Runtime distant indisponible, cache local utilisé.', reason);
      executeRuntime(cached.code, 'poketaka-runtime-cache.js');
      return;
    }

    console.error(
      '[PokéTaka Loader] Impossible de charger le runtime et aucun cache local n’est disponible.',
      reason
    );
  }

  GM_xmlhttpRequest({
    method: 'GET',
    url: RUNTIME_URL,
    timeout: 12000,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    onload(response) {
      if (response.status >= 200 && response.status < 300 && response.responseText) {
        GM_setValue(CACHE_KEY, {
          version: SCRIPT_VERSION,
          fetchedAt: Date.now(),
          code: response.responseText,
        });
        executeRuntime(response.responseText);
        return;
      }

      runCachedRuntime(`HTTP ${response.status}`);
    },
    onerror(error) {
      runCachedRuntime(error);
    },
    ontimeout() {
      runCachedRuntime('timeout');
    },
  });
})();
