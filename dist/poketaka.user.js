// ==UserScript==
// @name         PokéTaka Automation
// @namespace    https://github.com/Thanan71/poketaka-automation
// @version      0.8.1
// @description  Loader léger pour PokéTaka Automation. Le runtime est chargé depuis GitHub Raw.
// @author       Thanan71
// @match        https://poketaka.fr/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/poketaka.user.js
// @downloadURL  https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/poketaka.user.js
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_VERSION = GM_info?.script?.version || '0.8.1';
  const RUNTIME_URL = `https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/dist/runtime.js?v=${encodeURIComponent(SCRIPT_VERSION)}`;
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
      console.warn('[PokéTaka Loader] Runtime GitHub indisponible, cache local utilisé.', reason);
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
