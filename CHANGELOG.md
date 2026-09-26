# Changelog

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
