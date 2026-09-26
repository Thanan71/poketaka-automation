# Changelog

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
