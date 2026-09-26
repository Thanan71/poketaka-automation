// ==UserScript==
// @name         PokéTaka Automation
// @namespace    https://github.com/Thanan71/poketaka-automation
// @version      0.9.4
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

  const SCRIPT_VERSION = GM_info?.script?.version || '0.9.4';
  const RAW_BASE = 'https://raw.githubusercontent.com/Thanan71/poketaka-automation/main';
  const VERSION_URL = `${RAW_BASE}/dist/version.json`;
  const RUNTIME_URL = `${RAW_BASE}/dist/runtime.js`;
  const CACHE_KEY = 'poketaka-automation:runtime-cache';
  const SEMVER = /^\d+\.\d+\.\d+$/;

  function requestText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: 12000,
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
        onload(response) {
          if (response.status >= 200 && response.status < 300 && response.responseText) {
            resolve(response.responseText);
            return;
          }
          reject(new Error(`HTTP ${response.status}`));
        },
        onerror(error) {
          reject(error instanceof Error ? error : new Error('network error'));
        },
        ontimeout() {
          reject(new Error('timeout'));
        },
      });
    });
  }

  function runtimeVersionFromCode(code) {
    return code.match(/const VERSION = ["'](\d+\.\d+\.\d+)["']/)?.[1] || null;
  }

  function executeRuntime(code, source) {
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
      console.warn(
        '[PokéTaka Loader] Runtime GitHub indisponible, cache local utilisé.',
        reason
      );
      executeRuntime(cached.code, 'poketaka-runtime-cache.js');
      return true;
    }

    console.error(
      '[PokéTaka Loader] Impossible de charger le runtime et aucun cache local n’est disponible.',
      reason
    );
    return false;
  }

  async function latestPublishedVersion() {
    try {
      const cacheBust = Date.now();
      const text = await requestText(`${VERSION_URL}?t=${cacheBust}`);
      const version = String(JSON.parse(text)?.version || '').trim();
      return SEMVER.test(version) ? version : SCRIPT_VERSION;
    } catch (error) {
      console.warn(
        '[PokéTaka Loader] Version distante indisponible, version du loader utilisée.',
        error
      );
      return SCRIPT_VERSION;
    }
  }

  async function boot() {
    const targetVersion = await latestPublishedVersion();

    try {
      const cacheBust = Date.now();
      const source = `${RUNTIME_URL}?v=${encodeURIComponent(targetVersion)}&t=${cacheBust}`;
      const code = await requestText(source);
      const actualVersion = runtimeVersionFromCode(code);

      if (!actualVersion || !SEMVER.test(actualVersion)) {
        throw new Error('Runtime sans version X.X.X valide');
      }

      GM_setValue(CACHE_KEY, {
        version: actualVersion,
        fetchedAt: Date.now(),
        code,
      });

      if (actualVersion !== SCRIPT_VERSION) {
        console.info(
          `[PokéTaka Loader] Loader ${SCRIPT_VERSION} · runtime ${actualVersion}`
        );
      }

      executeRuntime(code, source);
    } catch (error) {
      runCachedRuntime(error);
    }
  }

  boot();
})();
