# Architecture

Le fichier `poketaka.user.js` installé dans Tampermonkey est volontairement un **loader minimal**.
La logique métier ne doit plus y être ajoutée.

## Source

- `src/core/config.js` — configuration, constantes et table des types.
- `src/core/state.js` — état persistant et primitives communes.
- `src/core/dom.js` — détection et clics DOM sûrs.
- `src/core/http.js` — GET/POST same-origin des routes PokéTaka observées, avec whitelist, cache et télémétrie.
- `src/core/background.js` — observation hors écran, parsing HTML détaché et orchestration sans navigation visible.
- `src/account/snapshot.js` — état global observé du compte : niveau, roster, Pokédex, Ligue et progression d'expéditions.
- `src/planner/goals.js` — objectifs globaux, dépendances de progression et bonus de priorité pour l'orchestrateur.
- `src/features/pokemon/progression.js` — scan de la collection, renforcement sûr, évolution unique et protection des ressources.
- `src/features/expeditions/team.js` — snapshot du roster, efficacité des types, viabilité et composition d'équipe.
- `src/features/expeditions/capture.js` — détection des rencontres, contexte de capture, décisions et exécution.
- `src/features/expeditions/cycle.js` — machine d'état expédition et résultats.
- `src/features/league/gyms.js` — vérification quotidienne de la Ligue, arène disponible, composition d'équipe et défi automatique.
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


## Goal Planner v0.9

L'orchestrateur ne choisit plus uniquement la meilleure action locale. À chaque cycle :

1. `account/snapshot.js` consolide les informations réellement observées dans le DOM et l'état persistant ;
2. `planner/goals.js` choisit un objectif principal et une étape suivante ;
3. le module correspondant reçoit un bonus de priorité ;
4. Smart Expedition peut recevoir une expédition cible précise lorsque celle-ci est une dépendance ;
5. après chaque navigation ou résultat, le snapshot et le plan sont recalculés.

Le planner n'invente pas les données absentes. Une information inconnue reste `null` et réduit la confiance du plan.

Les dépendances actuellement comprises incluent :

- niveau dresseur requis ;
- nombre d'espèces capturées requis ;
- nombre de badges requis ;
- expédition précédente ;
- expédition explicitement exigée par une Arène ;
- soins nécessaires avant un combat d'Arène ;
- combat d'Arène quotidien déjà consommé.


## Progression Pokémon

Le module Pokémon fonctionne entre les activités prioritaires. Il n'investit jamais de ressources pendant une expédition active.

Ordre de décision :

1. attendre la fin d'une expédition en cours ;
2. privilégier les Pokémon appartenant au plan d'équipe d'expédition ou d'Arène ;
3. inspecter la fiche du Pokémon ;
4. refuser toute action si le Pokémon participe à une activité ;
5. effectuer une évolution si elle est unique, abordable et non ambiguë ;
6. sinon effectuer au maximum un niveau de renforcement ;
7. protéger la réserve minimale de Poussière Étoile ;
8. protéger les Bonbons lorsqu'ils sont le seul prérequis manquant d'une évolution unique ;
9. recalculer le plan après chaque action.

Les évolutions à embranchement restent manuelles, car elles représentent un choix irréversible.


## Transport HTTP direct

Le bot privilégie maintenant les requêtes serveur réelles lorsque PokéTaka expose un formulaire exploitable dans le DOM.

Le transport :

1. refuse toute URL hors de `https://poketaka.fr` ;
2. n'autorise qu'une whitelist de routes observées ;
3. lit directement `_token`, `idempotency_key` et les autres champs du formulaire ;
4. n'invente jamais de token ou d'endpoint ;
5. soumet le même payload qu'un formulaire HTML standard ;
6. suit la redirection serveur et recharge/navigue vers l'URL finale ;
7. conserve un fallback DOM si le mode HTTP direct est désactivé.

Routes actuellement autorisées :

- `/expeditions/encounters/{id}/capture`
- `/expeditions/{slug}/launch`
- `/gyms/{slug}/challenge`
- `/collection/{id}/level-up`
- `/collection/{id}/evolve`
- `/collection/{id}/items/{item}`

Les routes de transfert, achat, vente, échange, suppression ou abandon ne sont pas autorisées.

Pour les équipes d'expédition et d'Arène, le planner injecte directement les IDs choisis dans `pokemon_public_ids[]`, ce qui évite les clics et changements de sélection intermédiaires.


## Observation hors écran v0.9.3

Le Goal Planner peut désormais collecter ses informations sans déplacer l'utilisateur.

Flux général :

`GET page index → DOMParser → analyse → GET page de détail/préparation → calcul → POST formulaire`

Les pages actuellement observables en arrière-plan sont :

- `/expeditions`
- `/expeditions/{slug}/prepare`
- `/expeditions/results/{id}`
- `/league`
- `/gyms/{slug}/prepare`
- `/collection`
- `/collection/{id}`

Le document HTML est parsé dans un document détaché avec un `<base>` correspondant à l'URL finale afin que les liens et formulaires restent résolvables.

Une route visible n'est masquée dans la navigation que lorsqu'une observation réussie de cette route est encore fraîche. En cas d'échec, d'expiration ou d'absence de contrat serveur exploitable, le comportement DOM/navigation historique redevient automatiquement disponible.

Les résultats d'expédition sont également inspectés hors écran. Lorsque les récompenses sont déjà récupérées et qu'une capture est disponible, la décision de capture peut être exécutée directement. Une capture manuelle ou un POST échoué conserve le fallback visible.
