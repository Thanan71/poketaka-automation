# PokéTaka Automation

Userscript Tampermonkey expérimental pour automatiser les tâches répétitives de **PokéTaka** (`https://poketaka.fr`).

> Projet communautaire non officiel, sans affiliation avec PokéTaka, PixelReveur, Nintendo, Game Freak, Creatures Inc. ou The Pokémon Company.

## Objectif

Le script fonctionne comme un **pilote de l'interface** : il cherche les actions réellement disponibles dans le DOM et clique sur les mêmes contrôles qu'un joueur.

Il ne cherche pas à :

- modifier les timers côté serveur ;
- générer des Pokédollars, objets ou Pokémon ;
- contourner une protection anti-bot ;
- appeler une API privée découverte par rétro-ingénierie ;
- acheter, vendre, libérer ou échanger automatiquement des Pokémon/objets.

## Fonctionnalités

- récupération automatique des expéditions terminées ;
- relance d'une expédition disponible avec stratégie `progression-first` ;
- soins automatiques si un bouton de soin gratuit/direct est disponible ;
- récolte automatique de la serre ;
- récupération des œufs/fossiles terminés ;
- récupération des œufs de pension ;
- navigation automatique entre les pages utiles ;
- progression sur les boutons `Continuer / Débloquer / Prochaine zone` ;
- panneau flottant pour activer/désactiver chaque module ;
- captures et replantation disponibles mais désactivées par défaut ;
- garde-fous empêchant les clics sur achat/vente/libération/échange.

## Interface

Le panneau intégré fonctionne désormais comme un petit tableau de bord :

- statut actif / pause immédiatement visible ;
- page actuellement détectée ;
- prochaine échéance connue avec compte à rebours ;
- dernière action et nombre total d'actions ;
- meilleure cible d'expédition et score ;
- modules surveillés avec leur état ;
- réglages repliables ;
- mode compact pour laisser davantage de place au jeu ;
- bouton de cycle manuel et accès au classement des expéditions.

## Installation

1. Installer Tampermonkey.
2. Ouvrir `poketaka.user.js` via l'URL Raw GitHub du dépôt.
3. Accepter l'installation.
4. Se connecter à PokéTaka.
5. Activer l'automatisation depuis le panneau en bas à droite.

Le script est volontairement **désactivé au premier lancement** afin de pouvoir vérifier les boutons détectés avant de le laisser tourner.

## Stratégie de progression

Le script ne connaît pas les modèles Laravel côté serveur et travaille uniquement sur l'interface rendue.

Pour les expéditions, chaque carte lançable reçoit désormais un score. Le calcul combine notamment :

- l'avancement de la zone (Route/Zone/Arène/Ligue) ;
- le caractère nouveau ou déjà terminé du contenu ;
- la chance de réussite affichée ;
- le niveau requis et le niveau d'équipe lorsqu'ils sont visibles ;
- la durée ;
- les récompenses visibles (Pokédollars, XP, objets) ;
- le coût en énergie et l'énergie disponible lorsqu'ils sont affichés.

Une nouvelle progression avec une chance raisonnable est préférée au farming. Une expédition sous le seuil de réussite configuré est fortement pénalisée, et une chance sous 30 % reçoit une pénalité critique.

Le cycle global reste :

1. confirmer une action initiée par le bot ;
2. récupérer une expédition terminée ;
3. récupérer incubateur / pension ;
4. récolter la serre ;
5. soigner ;
6. utiliser un bouton de progression ;
7. classer les expéditions et lancer la meilleure ;
8. naviguer vers une autre section et recommencer.

Cette méthode est moins fragile qu'un script dépendant d'URLs internes supposées et évite de reproduire des requêtes serveur privées.

## Réglages par défaut

| Module | Défaut |
|---|---:|
| Récompenses d'expédition | ON |
| Lancement d'expédition | ON |
| Soins | ON |
| Serre / récolte | ON |
| Incubateur | ON |
| Pension | ON |
| Progression | ON |
| Capture | OFF |
| Replantation | OFF |

Les captures sont désactivées car le choix d'une Ball/Baie peut consommer des ressources. La replantation est désactivée pour la même raison.

## Développement

```bash
npm run build
npm run check
```

La logique métier se trouve dans `src/`. Le fichier `poketaka.user.js` racine est un loader minimal généré pour Tampermonkey ; il ne doit pas recevoir directement les fonctionnalités du bot.

## État du reverse engineering

Au 26 septembre 2026, aucun dépôt GitHub public de PokéTaka n'a été trouvé. Le créateur public du projet est `PixelReveur`, mais ses dépôts GitHub publics visibles ne contiennent pas PokéTaka. L'analyse actuelle est donc basée sur le site public et les informations publiées par le développeur.

Voir [`docs/ANALYSIS.md`](docs/ANALYSIS.md).

## Avertissement

L'automatisation peut être contraire aux règles d'un service même lorsque le site ne publie pas de règle facilement accessible. Utilise ce projet à tes risques et respecte les demandes du développeur du jeu si celui-ci encadre ou interdit les bots.


## Diagnostic de la stratégie

Dans Tampermonkey, utilise la commande **Afficher le classement des expéditions** lorsque tu es sur la page correspondante.

La console affiche pour chaque choix détecté : score, zone, chance, niveau requis, niveau d'équipe, durée, récompenses et statut de progression. Le détail des bonus/pénalités est également journalisé lorsque le mode debug est actif.


## Cycle autonome des expéditions

À partir de la v0.4.0, le script maintient un état persistant pour les expéditions :

1. détecte un emplacement d'expédition occupé ;
2. mémorise l'heure de fin et l'URL de suivi ;
3. attend sans naviguer inutilement ;
4. ouvre automatiquement le résultat quand l'échéance est atteinte ;
5. récupère les récompenses via les contrôles visibles ;
6. s'arrête si une décision de capture est requise et que l'autocapture est désactivée ;
7. retourne aux expéditions ;
8. classe les destinations disponibles ;
9. prépare puis lance la meilleure destination détectée.

Le moteur n'appelle toujours aucune API privée et ne contourne aucun timer serveur.


## Progression intelligente v0.7

La v0.7 ajoute trois couches de décision au-dessus du cycle d'expédition.

### Équipe intelligente

Sur une page de préparation, le script lit les Pokémon réellement disponibles dans le constructeur d'équipe et leur niveau, PV, types, statut favori et objet tenu. Il compare ces données au niveau conseillé et aux types principaux de la mission, classe les candidats puis remplit le formulaire avec le meilleur candidat disponible.

Un Pokémon sous le seuil de PV configuré est fortement pénalisé. Le choix de types est un heuristique basé sur la table d'efficacité Pokémon standard ; il ne suppose pas que le script connaît les attaques exactes du Pokémon.

### Adaptation à la difficulté

Le script mémorise les résultats explicitement identifiables comme succès ou échec sur les pages de résultat. Une mission ayant échoué plusieurs fois de suite reçoit une forte pénalité afin que le mode progression puisse revenir vers une destination moins difficile au lieu de boucler indéfiniment.

Le pourcentage affiché dans les détails d'une mission est interprété comme une chance de rencontre, conformément au libellé PokéTaka, et non comme une probabilité de réussite.

### Captures intelligentes

Lorsque Captures auto est activé avec Capture intelligente, le script peut prioriser :

- une espèce explicitement indiquée comme nouvelle ;
- une rencontre explicitement rare, épique, légendaire ou mythique ;
- un score d'IV explicite au-dessus du seuil ;
- les rencontres inconnues seulement si l'option correspondante est activée.

Un Pokémon explicitement indiqué comme **déjà possédé** est bloqué avant les critères Rare/IV. Le réglage **Autoriser doublons rares / IV** permet de réactiver volontairement ces captures et reste désactivé par défaut.

Une réserve minimale de Balls est conservée lorsqu'un compteur exploitable est visible. Par défaut, les rencontres dont le statut est insuffisamment documenté ne consomment pas automatiquement de Ball.

### Orchestrateur global

À chaque cycle, le script construit un plan priorisé. Les confirmations et résultats d'expédition passent avant la préparation, les soins et récupérations, puis viennent les actions de progression et la navigation vers un module dont un timer ou indicateur signale qu'une action est nécessaire.

Le dashboard affiche la dernière décision de l'orchestrateur, l'équipe intelligente utilisée et la dernière décision de capture.

## Architecture modulaire et mises à jour

Le fichier racine `poketaka.user.js` est un loader minimal. La logique du bot se trouve dans `src/` et est répartie par responsabilité.

Le dépôt étant public, la distribution utilise directement **GitHub Raw**. À chaque push sur `main`, GitHub Actions :

1. calcule une nouvelle version strictement au format `X.X.X` ;
2. conserve une version explicitement choisie comme `0.8.0`, sinon incrémente le patch ;
3. assemble les modules dans `dist/runtime.js` ;
4. génère le loader Tampermonkey ;
5. vérifie la syntaxe ;
6. commit automatiquement les artefacts générés avec `[skip ci]`.

URLs utilisées :

- loader : `https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/poketaka.user.js`
- runtime : `https://raw.githubusercontent.com/Thanan71/poketaka-automation/main/dist/runtime.js`

Le détail des responsabilités des fichiers est dans `src/ARCHITECTURE.md`.


## Smart Expedition v0.8

Le choix d'une expédition et le choix de l'équipe sont désormais liés.

Le bot mémorise le roster réellement visible sur une page de préparation, puis utilise ce snapshot pour estimer les prochaines missions depuis le catalogue. L'évaluation prend en compte :

- le niveau conseillé de la mission ;
- les PV actuels des Pokémon ;
- les types principaux de la mission ;
- les avantages offensifs de types ;
- les résistances et faiblesses défensives ;
- le nombre de Pokémon requis ;
- la diversité des types lorsque plusieurs membres sont nécessaires ;
- l'historique d'échecs de la mission ;
- la progression de zone, qui reste prioritaire sur le simple rendement temporel.

Le snapshot n'est qu'une prévision. Avant le lancement, le bot relit toujours le roster réel de la page de préparation. Si aucune composition viable n'existe, la mission est temporairement écartée et le bot revient au catalogue pour choisir une destination plus adaptée.

Une mission temporairement écartée est réessayée plus tard afin d'éviter une boucle permanente sur une difficulté devenue accessible après un gain de niveau ou des soins.


## Arènes automatiques

Le bot peut vérifier quotidiennement le Circuit des Arènes et utiliser automatiquement le combat du jour lorsqu'une arène est accessible.

La boucle est :

`Ligue → arène disponible → préparation → équipe viable → défi → retour au Circuit`.

La composition utilise uniquement les Pokémon réellement proposés par PokéTaka. Le bot ne déduit pas les types ou niveaux adverses lorsqu'ils ne sont pas présents dans le DOM : il privilégie alors niveau, PV, disponibilité et diversité de types.

Comme un défi consomme l'unique combat d'arène du jour, le lancement est suspendu si :

- le nombre de Pokémon viables est inférieur au nombre demandé ;
- un membre prévu est sous le seuil de PV d'arène ;
- la sélection affichée ne correspond pas au plan calculé.

Le seuil de PV est configurable depuis le panel et vaut 70 % par défaut.


## Goal Planner v0.9

La v0.9 ajoute une couche de stratégie globale au-dessus des automatismes existants.

Le bot maintient maintenant un **snapshot du compte** à partir des informations réellement observées : niveau dresseur, espèces capturées, roster connu, badges, état quotidien des Arènes, expéditions terminées et destinations verrouillées.

À chaque cycle, le planner produit :

- un **objectif principal** ;
- une **étape suivante** ;
- les **blocages connus** ;
- le module à privilégier ;
- un niveau de confiance.

Exemples de plans :

`Débloquer Arène des Ramures → terminer Forêt Épines → niveau dresseur 3 requis → farmer les expéditions`

`Obtenir Badge Aube → équipe trop blessée → Centre Pokémon → retour automatique à l'Arène`

`Débloquer Mont Vertige → 6 espèces requises → privilégier les expéditions à forte chance de rencontre`

Le Goal Planner influence ensuite les priorités de l'orchestrateur. Les urgences déjà sûres, comme un résultat d'expédition à récupérer, conservent leur priorité, mais le bot évite désormais de naviguer ou farmer sans rapport avec son objectif principal.

### État du compte

Les données absentes ne sont jamais inventées. Le snapshot conserve `null` lorsqu'une information n'a pas encore été observée. Le bot peut donc afficher une confiance faible ou moyenne jusqu'à ce qu'il visite une page fournissant les informations nécessaires.

### Arènes quotidiennes

La v0.9 renforce aussi la protection du combat quotidien : dès qu'un défi a été soumis, aucune deuxième tentative automatique n'est autorisée le même jour. Une page de résultat confirme définitivement le combat comme consommé jusqu'au lendemain.


## Progression Pokémon automatique

Le bot peut maintenant renforcer et faire évoluer les Pokémon de manière prudente.

- Une expédition active, terminée ou prête à être relancée est toujours prioritaire sur la progression Pokémon. Le bot n'investit des ressources qu'après avoir tenté la prochaine expédition, ou si la préparation échoue explicitement faute d'équipe viable.
- Si un plan d'équipe existe, seuls les Pokémon utiles à ce plan sont considérés.
- Un renforcement automatique ne gagne qu'un niveau par action.
- Une réserve de Poussière Étoile est conservée (500 par défaut).
- Les Bonbons sont réservés lorsqu'une évolution unique est en attente et qu'il ne manque que ces Bonbons.
- Une évolution n'est automatique que lorsqu'il existe un seul chemin d'évolution et que toutes les conditions visibles sont remplies.
- Les évolutions à plusieurs branches restent manuelles.
- Un Pokémon déjà engagé dans une activité est ignoré.

Les réglages sont accessibles dans la section **Progression Pokémon** du panel.


## Requêtes HTTP directes

PokéTaka Automation peut maintenant exécuter plusieurs actions sans simuler de clics.

Quand PokéTaka expose une action sous forme de formulaire, le bot peut soumettre directement ce formulaire en réutilisant :

- l'URL `action` réellement affichée ;
- le token CSRF `_token` ;
- la clé `idempotency_key` ;
- les champs déjà présents dans la page ;
- la session same-origin du navigateur.

Ce mode couvre actuellement la capture, le lancement d'expédition, les défis d'Arène, le renforcement et les évolutions.

Pour les équipes, le bot envoie directement les IDs de l'équipe calculée via `pokemon_public_ids[]`, sans remplir visuellement chaque slot.

Le mode est activé par défaut avec **Requêtes HTTP directes** dans le panel. S'il est désactivé, le bot revient au comportement DOM historique.

Le transport ne cherche pas d'API cachée et n'invente pas de routes : seules les routes observées dans les formulaires PokéTaka et explicitement autorisées sont utilisables.


## Mode GET silencieux

PokéTaka Automation peut maintenant collecter les informations nécessaires sans te faire naviguer de page en page.

Exemple :

`GET /expeditions → choix de mission → GET /prepare → calcul équipe → POST /launch`

La même logique s'applique à la Ligue et à la progression Pokémon.

Le mode lit les pages avec la session actuelle du navigateur, parse leur HTML hors écran, puis n'effectue un POST que lorsqu'un formulaire serveur observé est suffisamment explicite.

Le panel affiche séparément :

- **Observation** : GET silencieux et dernière route lue ;
- **Transport** : POST directs et dernier endpoint exécuté.

Si un GET échoue ou si le HTML ne contient pas assez d'informations, le bot ne devine rien : le fallback DOM/navigation redevient disponible automatiquement.

Les résultats d'expédition peuvent aussi être lus hors écran. Une capture automatique peut donc être effectuée sans ouvrir visuellement le bilan, tandis qu'une capture manuelle force encore le fallback visible.


## Journal d'actions

Le panel possède maintenant deux vues :

- **Pilotage** : état du bot, objectif global, mission, modules et réglages ;
- **Logs** : historique des actions réellement exécutées.

Le journal conserve jusqu'à 120 entrées et affiche notamment :

- les tentatives de lancement d'expédition ;
- les POST HTTP directs et leur statut ;
- les confirmations de lancement après relecture de `/expeditions` ;
- les erreurs GET/POST ;
- les navigations ou clics DOM utilisés en fallback ;
- les transitions importantes du cycle d'expédition ;
- les décisions exécutées par l'orchestrateur.

Le bouton **Vider** efface le journal.

### Lancement silencieux d'expédition

Quand **GET silencieux** et **POST HTTP directs** sont actifs, le bot ne doit plus ouvrir visuellement la page Expéditions pour relancer une mission.

Le flux est :

`GET /expeditions → GET /prepare → calcul équipe → POST /launch → GET /expeditions de vérification`

Si le premier POST ne crée pas d'expédition vérifiable, le bot recharge une fois le formulaire de préparation et effectue une seule deuxième tentative avec les nouveaux tokens serveur. Le fallback visible reste réservé aux situations réellement non automatisables, comme certaines décisions manuelles.
