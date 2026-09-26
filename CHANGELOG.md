# Changelog

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
