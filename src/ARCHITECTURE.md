# Architecture

Le fichier `poketaka.user.js` installé dans Tampermonkey est volontairement un **loader minimal**.
La logique métier ne doit plus y être ajoutée.

## Source

- `src/core/config.js` — configuration, constantes et table des types.
- `src/core/state.js` — état persistant et primitives communes.
- `src/core/dom.js` — détection et clics DOM sûrs.
- `src/features/expeditions/cycle.js` — machine d'état expédition, résultats, équipes et captures.
- `src/features/expeditions/catalog.js` — catalogue, scoring et stratégie de choix.
- `src/features/activities.js` — soins, serre, incubateur et pension.
- `src/core/navigation.js` — timers, navigation intelligente, orchestrateur et scheduler.
- `src/ui/panel.js` — dashboard Tampermonkey.
- `src/main.js` — commandes Tampermonkey et initialisation.
- `src/loader.user.js` — template du loader ; à modifier uniquement si le mécanisme de chargement change.

## Build

`scripts/build.mjs` concatène les modules dans un même scope et génère :

- `dist/runtime.js`
- `dist/poketaka.user.js`
- `dist/version.json`
- `dist/index.html`

Le runtime est autonome une fois construit. Les modules peuvent donc partager les fonctions existantes sans dépendance externe.

## Version Tampermonkey

Sur chaque push vers `main`, le workflow GitHub Pages calcule une version de la forme :

`YYYY.M.D.<github.run_number>`

Cette version est injectée dans le loader **et** dans le runtime publiés. Ainsi, modifier n'importe quel fichier du repo déclenche une nouvelle version Tampermonkey sans modification manuelle de `poketaka.user.js`.

## Distribution

La distribution est publiée uniquement via GitHub Pages :

- loader : `https://thanan71.github.io/poketaka-automation/poketaka.user.js`
- runtime : `https://thanan71.github.io/poketaka-automation/runtime.js`

Le repository peut rester privé si le compte GitHub autorise Pages pour les repositories privés.
