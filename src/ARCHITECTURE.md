# Architecture

Le fichier `poketaka.user.js` installé dans Tampermonkey est volontairement un **loader minimal**.
La logique métier ne doit plus y être ajoutée.

## Source

- `src/core/config.js` — configuration, constantes et table des types.
- `src/core/state.js` — état persistant et primitives communes.
- `src/core/dom.js` — détection et clics DOM sûrs.
- `src/features/expeditions/team.js` — snapshot du roster, efficacité des types, viabilité et composition d'équipe.
- `src/features/expeditions/capture.js` — détection des rencontres, contexte de capture, décisions et exécution.
- `src/features/expeditions/cycle.js` — machine d'état expédition et résultats.
- `src/features/expeditions/catalog.js` — catalogue, scoring mission + équipe et stratégie de choix.
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

Le runtime est autonome une fois construit. Les modules peuvent donc partager les fonctions existantes sans dépendance externe.

## Distribution GitHub Raw

Le repository est public. La distribution ne dépend donc plus de GitHub Pages.

Tampermonkey utilise directement :

- loader : `https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/poketaka.user.js`
- runtime : `https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/dist/runtime.js`

Le loader conserve une copie locale du dernier runtime récupéré avec succès afin de pouvoir continuer à fonctionner si GitHub Raw est temporairement indisponible.

## Version Tampermonkey

Toutes les versions utilisent strictement le format `X.X.X`.

À chaque push humain sur `main`, le workflow de publication :

1. lit la version actuelle de `package.json` ;
2. conserve une version explicitement modifiée par le développeur, par exemple `0.8.0` ;
3. sinon incrémente uniquement le patch, par exemple `0.7.2 → 0.7.3` ;
4. reconstruit le runtime ;
5. remplace uniquement la version et les métadonnées générées du loader racine ;
6. commit les artefacts générés avec `[skip ci]` pour éviter une boucle.

Ainsi, les changements fonctionnels se font dans `src/`, tandis que `poketaka.user.js` reste presque immuable.


## Mise à jour immédiate du runtime

Tampermonkey contrôle lui-même la fréquence à laquelle il vérifie `@updateURL`. Le loader ne dépend donc plus de cette fréquence pour les fonctionnalités du bot.

À chaque chargement de PokéTaka, le loader :

1. récupère `dist/version.json` depuis GitHub Raw avec un cache-buster ;
2. récupère `dist/runtime.js` correspondant à la dernière version publiée ;
3. vérifie que le runtime contient une version valide `X.X.X` ;
4. met le runtime en cache local ;
5. l'exécute même si la version du userscript installée par Tampermonkey est encore plus ancienne.

Tampermonkey continuera à mettre à jour le loader via `@updateURL` selon ses propres réglages, mais ce délai ne bloque plus les mises à jour fonctionnelles.
