# Analyse technique initiale — PokéTaka

Date : 2026-09-26

## Sources publiques observées

Le développeur décrit PokéTaka comme un jeu web persistant construit avec :

- PHP 8.3 ;
- Laravel 13 ;
- MariaDB ;
- Blade ;
- TypeScript / JavaScript ;
- Vite.

La progression est stockée côté serveur et le jeu repose sur des expéditions asynchrones. Les systèmes publiquement décrits comprennent notamment :

- expéditions chronométrées ;
- combats automatiques ;
- 12 zones et chemins alternatifs endgame ;
- 8 arènes et Ligue ;
- soins ;
- serre ;
- œufs et fossiles ;
- pension / breeding ;
- captures ;
- gestion d'équipe et Pokémon ;
- génération II ajoutée le 25 septembre 2026.

## Dépôt GitHub

Recherche effectuée sur GitHub par :

- nom `poketaka` ;
- domaine `poketaka.fr` ;
- nom du projet `PokéTaka` ;
- compte public `PixelReveur`.

Aucun dépôt PokéTaka public n'est actuellement exposé. Le compte GitHub public de PixelReveur présente d'autres projets, mais pas celui-ci.

Conséquence : il n'est pas possible de prétendre analyser les contrôleurs Laravel, routes, vues Blade ou endpoints internes du projet sans source publique ou accès explicite au dépôt.

## Architecture retenue pour l'automatisation

Le userscript adopte une approche DOM-only :

- recherche de boutons par libellés FR/EN ;
- vérification de visibilité ;
- liste noire d'actions destructrices ou économiques ;
- clic sur l'interface normale ;
- confirmation uniquement après une action initiée récemment par le bot ;
- navigation same-origin à partir des liens réellement présents dans l'interface ;
- cadence lente avec jitter.

Cette architecture évite :

- la duplication de requêtes POST internes ;
- la manipulation de CSRF ;
- la découverte/attaque d'endpoints non documentés ;
- le contournement de délais serveur.

## Limites de v0.1

Sans session authentifiée ni dépôt source public, les sélecteurs exacts de l'espace joueur ne peuvent pas être certifiés avant test réel.

La première chose à faire après installation est donc d'activer le mode debug, lancer un cycle manuel et observer les boutons détectés. Les retours DOM permettront ensuite de remplacer progressivement les heuristiques textuelles par des sélecteurs précis et stables.
