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
npm run check
```

Aucun build n'est nécessaire : `poketaka.user.js` est directement installable dans Tampermonkey.

## État du reverse engineering

Au 26 septembre 2026, aucun dépôt GitHub public de PokéTaka n'a été trouvé. Le créateur public du projet est `PixelReveur`, mais ses dépôts GitHub publics visibles ne contiennent pas PokéTaka. L'analyse actuelle est donc basée sur le site public et les informations publiées par le développeur.

Voir [`docs/ANALYSIS.md`](docs/ANALYSIS.md).

## Avertissement

L'automatisation peut être contraire aux règles d'un service même lorsque le site ne publie pas de règle facilement accessible. Utilise ce projet à tes risques et respecte les demandes du développeur du jeu si celui-ci encadre ou interdit les bots.


## Diagnostic de la stratégie

Dans Tampermonkey, utilise la commande **Afficher le classement des expéditions** lorsque tu es sur la page correspondante.

La console affiche pour chaque choix détecté : score, zone, chance, niveau requis, niveau d'équipe, durée, récompenses et statut de progression. Le détail des bonus/pénalités est également journalisé lorsque le mode debug est actif.
