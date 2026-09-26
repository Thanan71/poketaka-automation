# Changelog

## 0.9.14 - 2026-09-26

- Correction de l'ordre de repli lorsqu'une mission ciblée par le Goal Planner échoue au contrôle réel de l'équipe.
- Si la mission cible est jugée non viable, le bot tente désormais d'abord une progression Pokémon sûre avant de lancer immédiatement une mission plus facile.
- Le farming opportuniste reste disponible si aucun renforcement sûr n'est possible.
- Les missions écartées journalisent maintenant le niveau conseillé, la taille d'équipe requise et les meilleurs candidats avec niveau, score et viabilité.
- Ajout de tests garantissant que le renforcement de la mission cible précède le repli vers une expédition facile.

## 0.9.13 - 2026-09-26

- Correction du classement des expéditions lorsqu'il est exécuté sur le DOM téléchargé par le mode GET silencieux.
- Les liens natifs `/expeditions/*/prepare` d'un document détaché ne sont plus rejetés par `isVisible()`.
- Un slot libre peut donc réellement enchaîner vers la préparation/lancement de la mission suivante en arrière-plan.
- Ajout d'un test LinkeDOM reproduisant un catalogue téléchargé avec un lien de préparation non rendu visuellement.
- Ajout d'un log explicite si un slot est libre mais qu'aucune mission lançable n'est détectée, avec le nombre de cartes et le nombre d'entrées classées.

## 0.9.12 - 2026-09-26

- Correction de la reprise du cycle après récupération réussie des récompenses d'expédition.
- Après un claim vérifié, le coordinateur ne quitte plus immédiatement : il force un nouveau GET `/expeditions` et peut relancer une mission dans le même cycle.
- Les actions de résultat encore incomplètes (capture/intervention manuelle) restent terminales et ne déclenchent pas de relance prématurée.
- Ajout d'un log explicite lorsque le slot est libéré et qu'une nouvelle expédition est recherchée.
- Le panneau Capture n'affiche plus une rencontre déjà résolue simplement parce que le bloc `.mission-encounter` reste présent dans le bilan.
- Ajout de tests de non-régression pour la continuité post-claim et le nettoyage de l'UI Capture.

## 0.9.11 - 2026-09-26

- Nouveau chantier de fiabilisation de l'état interne des expéditions.
- Centralisation de l'analyse d'un bilan d'expédition : rencontre active, formulaire de récupération et état réel des récompenses.
- Réinitialisation de `captureDecision` lorsqu'un bilan frais ne contient plus de rencontre et après confirmation de récupération des récompenses.
- Nettoyage de `selectedExpedition` et `expeditionPlan` uniquement après un état serveur confirmé comme finalisé ou libre.
- Invariant renforcé : la présence d'un formulaire `/claim` interdit `ready_to_start` et tout retour vers la liste des expéditions.
- Le claim visible suit maintenant la réponse serveur afin de ne pas conserver un DOM périmé après un POST réussi.
- Ajout de gardes anti-double-action pour les POST directs et les clics DOM répétés ; les POST idempotents sont distingués par leur `idempotency_key`.
- Les transitions d'expédition journalisent désormais explicitement l'état avant et après.
- Ajout de tests comportementaux à partir de fragments HTML de bilan PokéTaka avec LinkeDOM.
- La CI installe les dépendances de test avant `npm run check`.

## 0.9.10 - 2026-09-26

- Correction de la boucle `greenhouse-plant` provoquée par le bouton "Replanter" du panneau du bot.
- Les helpers DOM ignorent désormais tous les contrôles situés dans `#pta-panel`.
- `clickElement()` refuse également explicitement tout élément appartenant au panneau.
- Ajout d'un test de non-régression empêchant l'automatisation de cliquer sa propre interface.

## 0.9.9 - 2026-09-26

- Correction de la récupération automatique des récompenses d'expédition.
- Ajout du endpoint direct `POST /expeditions/results/{id}/claim` à la whitelist HTTP.
- Le formulaire de claim observé réutilise son token CSRF réel ; aucune clé d'idempotence n'est inventée lorsqu'elle n'est pas fournie par PokéTaka.
- En mode GET silencieux, le bot traite désormais : capture éventuelle → récupération des récompenses → vérification serveur → relance.
- Le bot ne passe plus à `ready_to_start` tant qu'un formulaire de récupération est encore présent ou qu'une récompense reste marquée "À récupérer".
- Vérification forcée du bilan après le POST claim ; une redirection serveur vers `/expeditions` compte aussi comme confirmation.
- Détection renforcée des bilans terminés qui disparaissent du slot actif : liens de résultat, badge d'expédition terminée et URL du bilan courant sont utilisés pour retrouver le résultat pending.
- Si un résultat terminé est détecté sans URL exploitable, aucune nouvelle expédition n'est lancée afin de ne jamais sauter les récompenses.
- La récupération visible depuis la page de bilan utilise également le POST direct quand il est disponible.
- Journalisation de la tentative, du succès et des échecs de récupération dans l'onglet Logs.
- Ajout de tests CI pour la whitelist du claim, le POST direct et la vérification arrière-plan.


## 0.9.8 - 2026-09-26

- Correction de la capture intelligente qui pouvait encore capturer un Pokémon déjà possédé si celui-ci était rare ou dépassait le seuil d'IV.
- Le statut `isNew === false` devient désormais un veto prioritaire avant les règles Rare/IV.
- Ajout du réglage `captureOwnedDuplicates`, désactivé par défaut.
- Nouveau toggle panel : `Autoriser doublons rares / IV`.
- La capture simple reste volontairement exhaustive ; le veto doublon s'applique à la capture intelligente.
- Détection du statut Pokédex renforcée pour les libellés "Absente du Pokédex", "Présente dans le Pokédex", "Déjà au Pokédex", etc.
- La capture visible et la capture silencieuse utilisent désormais la même fonction de décision afin d'éviter toute divergence.
- Les doublons ignorés et décisions manuelles sont inscrits dans l'onglet Logs.
- Ajout de tests CI couvrant doublon rare, doublon IV élevé, nouvelle espèce, opt-in doublons et parsing du statut Pokédex.


## 0.9.7 - 2026-09-26

- Correction de la redirection visible vers la page Expéditions lors d'un relancement alors que le mode GET silencieux est actif.
- Le candidat d'expédition visible ne peut plus passer devant le coordinateur arrière-plan simplement à cause du bonus du Goal Planner.
- Les phases `ready_to_start`, `preparing` et `starting` déclenchent immédiatement le moteur arrière-plan sans attendre l'intervalle normal de rafraîchissement GET.
- Après résolution d'une expédition, un nouveau GET `/expeditions` est effectué dans le même cycle afin de réutiliser immédiatement l'emplacement libéré.
- Après chaque POST `/launch`, le bot vérifie silencieusement via GET que l'expédition est réellement active.
- Si le premier POST n'est pas confirmé, le formulaire de préparation est rechargé pour obtenir un état/tokens frais et une seule seconde tentative silencieuse est effectuée.
- En cas d'échec après deux tentatives, le bot revient à `ready_to_start` et journalise précisément la raison au lieu de rediriger immédiatement.
- Ajout d'une vue `Logs` dédiée dans le panel, à côté de `Pilotage`.
- Le journal persiste jusqu'à 120 entrées et affiche heure, catégorie, message et détails.
- Journalisation des POST HTTP, erreurs GET, navigations fallback, clics DOM, transitions d'expédition et décisions réellement exécutées par l'orchestrateur.
- Ajout d'un bouton `Vider` pour effacer le journal.
- Réduction du bruit : les cycles sans action et les transitions inchangées ne créent plus d'entrée de log.
- Ajout de tests CI pour la suppression de la redirection visible, la vérification/retry du lancement silencieux et la page Logs.


## 0.9.6 - 2026-09-26

- Correction de `selectedExpedition` qui pouvait rester sur une ancienne mission pendant qu'une autre expédition était réellement active.
- Lorsqu'un GET silencieux observe une expédition active différente, `selectedExpedition` est maintenant resynchronisé immédiatement et l'ancien score est invalidé.
- Le nom d'une expédition active conserve désormais sa casse d'affichage au lieu d'être stocké normalisé.
- La carte "Plan d'expédition" du panel donne priorité à `expeditionCycle.title` pour les phases actives/résultat.
- Le panel ne peut donc plus afficher "Sentier du Professeur" pendant que Route 1 est réellement en cours.
- Ajout de tests CI pour la synchronisation de la sélection active et la priorité d'affichage de la mission réelle.


## 0.9.5 - 2026-09-26

- Correction d'un état `expeditionPlan` périmé en mode GET silencieux.
- Le plan d'expédition est maintenant réécrit à chaque préparation d'expédition arrière-plan avec la mission, l'équipe, le score et la viabilité réellement calculés.
- Lorsqu'une expédition active observée ne correspond pas au plan mémorisé, le plan stale est remplacé par l'expédition réellement en cours.
- Le fallback "équipe bloquée → progression Pokémon" ne peut donc plus s'appuyer sur une ancienne mission ou une ancienne viabilité.
- Le panel ne doit plus afficher un ancien plan d'expédition pendant qu'une autre mission est réellement en cours.
- Ajout d'un test CI dédié à la synchronisation du plan d'expédition arrière-plan.


## 0.9.4 - 2026-09-26

- Correction d'un blocage où la progression Pokémon pouvait retarder le lancement de l'expédition suivante.
- Une expédition à résoudre, relancer ou préparer passe désormais toujours avant un scan de renforcement/évolution.
- La progression Pokémon ne devient prioritaire qu'en fallback lorsqu'une préparation d'expédition a réellement échoué faute d'équipe viable.
- Après un renforcement réussi, le Pokémon est marqué comme traité pour le scan courant afin d'empêcher des montées de niveau répétées à chaque cycle.
- Après une évolution réussie, le Pokémon est également marqué comme traité avant de rendre la priorité aux expéditions.
- Correction du parseur numérique des niveaux et ressources (Poussière/Bonbons), dont la regex avait perdu ses échappements.
- Ajout de tests CI couvrant la priorité de relance d'expédition, le parsing des nombres et la règle d'une seule amélioration par scan.


## 0.9.3 - 2026-09-26

- Ajout du mode GET silencieux en arrière-plan.
- Le bot peut maintenant lire /expeditions, /league et /collection sans changer la page visible.
- Parsing HTML hors écran via DOMParser avec session same-origin.
- Ajout d'une whitelist stricte pour les pages GET observables.
- Le classement des expéditions fonctionne maintenant sur un document téléchargé.
- Les pages de préparation d'expédition sont récupérées en arrière-plan puis soumises directement en POST.
- Les Arènes sont détectées et préparées depuis /league et /gyms/{slug}/prepare sans navigation visible.
- La collection et les profils Pokémon sont analysés en arrière-plan pour le renforcement et les évolutions.
- Les résultats d'expédition peuvent être récupérés en GET ; la capture automatique est ensuite soumise en POST sans ouvrir la page résultat.
- Les informations de compte (niveau dresseur, espèces capturées, zones verrouillées, badges et dépendances) sont mises à jour depuis les documents téléchargés.
- La navigation visible vers Ligue, Collection et Expéditions est supprimée lorsqu'une observation GET récente et valide existe.
- Fallback automatique vers la navigation classique si un GET échoue, expire ou si une action serveur n'est pas connue.
- Le panel affiche maintenant l'état GET silencieux, le nombre d'observations et la dernière route lue.
- Intervalle de rafraîchissement GET configurable (30 s par défaut).
- Ajout de tests CI dédiés au mode arrière-plan, au parsing détaché, au fallback et à l'absence de clic/navigation dans le coordinateur silencieux.


## 0.9.2 - 2026-09-26

- Ajout d'un transport HTTP same-origin dédié aux actions PokéTaka observées dans le DOM.
- Les POST directs réutilisent uniquement les formulaires réellement rendus par PokéTaka, leurs tokens CSRF et leurs clés d'idempotence.
- Whitelist stricte des routes automatisables ; les routes destructrices/économiques restent bloquées.
- Capture automatique migrée de clic DOM vers POST direct.
- Lancement d'expédition migré vers POST direct avec injection de l'équipe calculée via `pokemon_public_ids[]`.
- Défi d'Arène migré vers POST direct avec injection de l'équipe calculée via `pokemon_public_ids[]`.
- Renforcement Pokémon migré vers POST direct `/level-up`.
- Évolution Pokémon migrée vers POST direct `/evolve`.
- Les navigations simples vers les profils Pokémon et la préparation d'Arène utilisent désormais une navigation directe plutôt qu'un clic simulé.
- Fallback DOM conservé et désactivable via le réglage "Requêtes HTTP directes".
- Le panel affiche le mode de transport, le dernier statut HTTP, le dernier endpoint et le nombre de requêtes.
- Les erreurs de validation serveur sont détectées sans relancer automatiquement une action critique.
- Ajout de tests CI pour la whitelist, le same-origin, CSRF/idempotency, les endpoints sensibles bloqués et le câblage direct des actions.


## 0.9.1 - 2026-09-26

- Automatisation intelligente du renforcement des Pokémon.
- Automatisation des évolutions à chemin unique lorsque toutes les conditions affichées sont remplies.
- Les évolutions à plusieurs branches restent toujours manuelles.
- Le bot analyse la collection et privilégie les Pokémon présents dans les plans d'expédition ou d'Arène.
- Lorsqu'une expédition est en cours, toute dépense de progression Pokémon est suspendue jusqu'à son retour.
- Lorsqu'un plan d'équipe existe, aucun Pokémon secondaire hors plan ne reçoit automatiquement de ressources.
- Les Pokémon participant déjà à une activité sont ignorés.
- Les renforcements se font un niveau à la fois afin de recalculer la stratégie après chaque dépense.
- Réserve minimale de Poussière Étoile configurable (500 par défaut).
- Les Bonbons nécessaires à une évolution unique en attente sont protégés et ne sont pas consommés en renforcement.
- Nouvelle section "Progression Pokémon" dans le panel avec état, cible, raison et réglages.
- Intégration du module Pokémon dans la navigation et l'orchestrateur.
- Ajout de tests CI pour l'attente d'expédition, le ciblage des Pokémon utiles et les protections de ressources.


## 0.9.0 - 2026-09-26

- Ajout d'un snapshot global persistant du compte.
- Lecture directe du niveau dresseur et du nombre d'espèces capturées depuis la vue d'ensemble des expéditions.
- Mémorisation des expéditions terminées observées.
- Analyse des destinations verrouillées et de leurs conditions : niveau, espèces, badges et expédition précédente.
- Analyse des Arènes verrouillées et de leurs dépendances d'expédition/badge.
- Nouveau Goal Planner qui produit un objectif principal, une étape suivante, des blocages et un niveau de confiance.
- Le planner privilégie automatiquement les soins lorsqu'ils bloquent un combat d'Arène.
- Le planner peut cibler une expédition précise lorsqu'elle est requise pour la progression.
- Lorsque le niveau dresseur bloque une destination, les expéditions deviennent l'objectif de progression.
- Lorsque le nombre d'espèces bloque une destination, le bot privilégie les missions à forte chance de rencontre.
- Les priorités de navigation et de l'orchestrateur sont maintenant influencées par l'objectif global.
- Nouvelle carte "Objectif global" dans le panel avec étape suivante, métriques du compte et blocages.
- Ajout de tests CI couvrant les principaux scénarios du Goal Planner.
- Correction Arènes : après soumission d'un combat quotidien, aucune nouvelle tentative automatique n'est autorisée le même jour.
- Une page de résultat d'Arène marque immédiatement le combat quotidien comme consommé, même sans lien de retour vers le Circuit.


## 0.8.7 - 2026-09-26

- Automatisation du Circuit des Arènes et du combat quotidien.
- Détection exacte de l'état "Combat du jour disponible" et de l'arène actuellement accessible.
- Ouverture automatique de "Préparer le combat".
- Composition automatique du nombre exact de Pokémon requis via les sélecteurs `data-team-select`.
- Sélection des Pokémon disponibles les plus solides, avec priorité aux PV, niveaux et diversité de types.
- Seuil de PV spécifique aux arènes (70 % par défaut) pour protéger l'unique combat quotidien.
- Refus de lancer le défi si l'équipe complète n'est pas viable ou si la sélection ne correspond pas au plan.
- Priorité automatique aux soins lorsqu'une équipe d'arène est trop blessée.
- Clic automatique sur le bouton exact de défi une fois l'équipe validée.
- Retour automatique au Circuit après résolution lorsqu'un lien de retour est présent.
- Vérification quotidienne de la Ligue depuis l'orchestrateur, même si l'utilisateur ne visite pas manuellement la page.
- Les arènes encore verrouillées sont recontrôlées plus tard sans boucle de navigation.
- Ajout du statut Arènes et du seuil de PV dans le panel.


## 0.8.6 - 2026-09-26

- Extraction de toute la logique de capture dans `src/features/expeditions/capture.js`.
- État de capture enrichi : espèce, statut Pokédex, rareté, IV, Ball, stock, chance et tentatives.
- Nouvelle carte Capture dans le panel pendant une rencontre active.
- La prochaine décision affiche directement Capturer / Ignorer / Manuel pour la rencontre courante.
- Regroupement de tous les réglages de capture dans une seule section.
- Réserve minimale de Balls ajustable depuis le panel.
- Seuil IV minimum ajustable depuis le panel.
- Les doublons non prioritaires sans bouton Fuir ne bloquent plus le cycle : ils sont ignorés proprement.
- Les captures manuelles ne bloquent le bot que lorsque Capture auto est réellement désactivée.


## 0.8.5 - 2026-09-26

- Le loader vérifie désormais `dist/version.json` à chaque chargement de PokéTaka.
- Le runtime le plus récent est chargé indépendamment du délai de mise à jour propre à Tampermonkey.
- Ajout d'un cache-buster sur `version.json` et `runtime.js` pour éviter les anciennes réponses GitHub Raw.
- Le panel peut afficher une différence entre la version du runtime et celle du loader Tampermonkey.
- Le cache local reste utilisé si GitHub Raw est temporairement indisponible.


## 0.8.3 - 2026-09-26

- Correction de la capture automatique sur la vraie page de résultat PokéTaka.
- Détection native de `.mission-encounter` et `form[data-capture-form]`.
- Support du bouton réel "Lancer la Ball".
- "Absente du Pokédex" est désormais reconnue comme une nouvelle espèce.
- Lecture exacte de la réserve depuis la Ball sélectionnée.
- Lecture de la chance de capture et du nombre de tentatives restantes.
- La protection de réserve de Balls reste appliquée avant tout lancer.


## 0.8.0 - 2026-09-26

- Ajout d'un moteur Smart Expedition qui couple le choix de mission et la composition d'équipe.
- Nouveau module `src/features/expeditions/team.js`.
- Mise en cache du roster réellement disponible depuis les pages de préparation.
- Évaluation de la viabilité d'une mission à partir du niveau conseillé, des PV et des types.
- Prise en compte des avantages offensifs et des résistances/faiblesses défensives.
- Diversification automatique des types lorsque plusieurs Pokémon sont requis.
- Validation du roster réel avant lancement d'une mission.
- Repli automatique vers une mission plus facile lorsqu'aucune équipe viable n'est disponible.
- Blocage temporaire des missions non viables afin d'éviter les boucles.
- La progression de zone est désormais prioritaire sur le simple rendement durée/rencontre.
- Le dashboard affiche l'équipe prévue par le planificateur.


## 0.7.1 - 2026-09-26

- Correction du faux niveau d'équipe détecté sur le catalogue des expéditions.
- Le texte "Niveau conseillé" d'une destination n'est plus interprété comme le niveau réel de l'équipe.
- Le catalogue ne filtre plus une destination à partir d'un niveau d'équipe supposé.
- Le niveau réel est évalué uniquement sur la page de préparation à partir des Pokémon effectivement disponibles.
- En mode progression, la destination disponible la plus avancée reste prioritaire tant qu'elle n'a pas une série d'échecs bloquante.


## 0.7.0 - 2026-09-26

- Ajout d'un orchestrateur global qui priorise les actions utiles à chaque cycle.
- Le cycle manuel fonctionne même lorsque l'automatisation globale est en pause.
- Ajout d'une sélection intelligente de l'équipe d'expédition.
- Le choix d'équipe tient compte du niveau, des PV, des types, du niveau conseillé, des favoris et de l'objet tenu.
- Le formulaire d'expédition est rempli directement avant le lancement.
- La chance affichée sur une mission est traitée comme chance de rencontre et non comme chance de réussite.
- Ajout d'une mémoire des succès, échecs et séries d'échecs par expédition.
- Les missions ayant plusieurs échecs consécutifs sont fortement pénalisées pour favoriser une difficulté inférieure.
- Ajout d'une logique de capture intelligente : nouvelle espèce, rareté, IV et réserve minimale de Balls.
- Ajout d'un mode prudent : les rencontres inconnues ne consomment pas de Ball par défaut.
- Le dashboard expose la dernière décision de l'orchestrateur, l'équipe choisie et la dernière décision de capture.
- Ajout de réglages pour équipe intelligente et captures intelligentes.


## 0.4.2 - 2026-09-26

- Correction du lancement d'expédition : le bot compose désormais l'équipe avant de soumettre le formulaire.
- Utilisation prioritaire du bouton "Dernière équipe utilisée" quand il est disponible.
- Fallback sur les sélecteurs `data-team-select` et les cartes `data-team-pokemon`.
- Vérification du minimum d'équipe via `data-team-min` avant lancement.
- En mode progression, priorité à la destination disponible la plus avancée qui respecte le seuil de réussite.
- Avec Sentier du Professeur + Route 1 disponibles, Route 1 est désormais préférée si elle reste viable.


## 0.4.1 - 2026-09-26

- Correction de la détection des expéditions lançables.
- Détection native des cartes `.mission-card` dans le panneau `available`.
- Utilisation directe des liens `/expeditions/.../prepare`.
- Normalisation des apostrophes typographiques pour les libellés comme "Préparer l’expédition".
- Lecture des détails de mission depuis le dialog lié afin de récupérer chance, durée et niveau conseillé.
- Support explicite de "Niveau conseillé" dans le scoring.


## 0.4.0 - 2026-09-26

- Ajout d'une machine d'état persistante pour le cycle complet des expéditions.
- Détection de l'expédition active via `.mission-slot-card--occupied`.
- Mémorisation du titre, de l'URL de résultat et de l'heure de fin.
- Ouverture automatique de "Suivre l'expédition" lorsque le timer arrive à échéance.
- Gestion dédiée des pages `/expeditions/results/*`.
- Récupération automatique des récompenses lorsqu'un bouton sûr est disponible.
- Blocage volontaire sur une capture en attente si l'autocapture est désactivée.
- Retour automatique vers la page Expéditions après récupération.
- Relance automatique d'une nouvelle expédition lorsque le slot est libre.
- Prise en charge du vrai bouton "Préparer l'expédition".
- Sélection basique d'une équipe disponible si un sélecteur explicite est présent.
- Affichage de l'état du cycle dans le dashboard.


## 0.3.3 - 2026-09-26

- Adaptation du timer d'expédition au HTML réel de PokéTaka.
- Priorité à `time[data-countdown][data-countdown-format="expedition"]` dans l'emplacement occupé.
- Utilisation du `datetime` serveur comme heure de fin exacte.
- Fallback sur `data-progress-end` de la barre de progression.
- Exclusion explicite de l'horloge "Heure en jeu".
- Le module Expéditions affiche désormais "Ici · <temps restant>".
- La prochaine échéance ignore les modules désactivés.


## 0.3.2 - 2026-09-26

- Correction de la détection des timers d'expédition.
- Les durées statiques des routes (ex. "Durée 30 min") ne sont plus interprétées comme des comptes à rebours.
- Détection prioritaire des timers structurés (time, data-end, countdown/timer).
- Détection contextuelle via "temps restant", "retour dans", "se termine dans", "remaining", etc.
- Support des heures de fin absolues du type "se termine à 14:32".
- Ajout d'une commande Tampermonkey "Diagnostiquer le timer de la page".
- Journalisation de la source exacte du timer détecté en mode debug.


## 0.3.1 - 2026-09-26

- Correction des sections repliables qui se refermaient à chaque rafraîchissement du dashboard.
- L'état ouvert/fermé de "Modules surveillés" et "Réglages automatiques" est maintenant conservé pendant les mises à jour temps réel.


## 0.3.0 - 2026-09-26

- Refonte complète du panneau Tampermonkey en tableau de bord compact.
- Mode réduit mémorisé pour ne pas masquer le jeu.
- Statut global beaucoup plus lisible (actif / pause + page courante).
- Affichage de la prochaine échéance connue avec compte à rebours en temps réel.
- Affichage de la dernière action, de son ancienneté et du nombre total d'actions.
- Carte dédiée à la cible d'expédition et à son score.
- Bouton d'exécution manuelle et accès direct au classement des expéditions.
- Liste repliable des modules surveillés avec états Ici / Prêt / timer / RAS / Non vérifié.
- Réglages automatiques déplacés dans une section repliable avec vrais interrupteurs visuels.
- Interface responsive mobile et meilleure lisibilité générale.
- Échappement HTML des textes issus du DOM avant affichage dans le panneau.


## 0.2.1 - 2026-09-26

- Suppression de la navigation cyclique permanente entre les modules.
- Navigation vers une autre page uniquement lorsqu'un indicateur prêt/terminé est visible, qu'un timer mémorisé arrive à échéance ou que l'équipe semble avoir besoin de soins.
- Mémorisation des échéances détectées dans les pages à partir des compteurs visibles.
- Anti-rebond de navigation pendant 8 secondes.
- Nettoyage des anciens timers dès qu'une page est inspectée sans compte à rebours actif.


## 0.2.0 - 2026-09-26

- Remplacement du choix "dernier bouton disponible" par un moteur de classement.
- Score basé sur progression de zone, chance de réussite, niveau requis, durée et récompenses visibles.
- Prise en compte de l'énergie visible lorsqu'un coût est affiché.
- Bonus aux nouvelles zones et pénalité au farming déjà terminé.
- Seuil de risque configurable avec pénalité forte sous 30 % de réussite.
- Affichage de la cible et du score dans le panneau.
- Commande Tampermonkey "Afficher le classement des expéditions" pour diagnostiquer les décisions.


## 0.1.0 - 2026-09-26

- Première version du userscript.
- Automatisation DOM des expéditions, soins, serre, incubateur et pension.
- Navigation automatique et progression-first.
- Panneau de contrôle Tampermonkey.
- Garde-fous contre achats, ventes, échanges et libérations.
