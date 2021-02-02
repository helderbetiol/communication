# Compte Rendu - Stage Helder 

Compte rendu sur les réunions et le progrès du stage de Helder BETIOL pendant les mois de janvier et février 2021.

## Tâches disponibles
1. Ressource Admin : permettre le suivre du progrès des élèves et obtenir des statistiques sur le jeu.
2. Plusieurs écoles simultanément connectées sur Heroku : actuellement, les élèves des différentes écoles pourront être connectées sur le même réseau.
3. Modification de la taille du réseau : créer une option configurable de la taille du réseau (actuellement, 15).
4. Guide d'utilisateur
5. Les variants du jeu
6. Bibliothèque intermédiaire, abstraction du code et DSL.

## Semaine 1 (04/01) 
Prise en main du projet :
- Lecture du code.
- Lecture du guide.
- Création de l'environnement local et compilation.
- Mise à jour des paquets.
- Correction des bugs de compilation.
- Proposition de possible colaboration avec l'université au Brésil -> *(à suivre)*

## Semaine 2 (11/01)
La tâche 2 a été choisie pour cette semaine.
- Création d'une application Heroku de test.
- Ajoute du plugin HTML Webpack pour création des fichiers HTML pendant le build.
- Création d'une page d'accueil (chemin : /)
    - Page initiale demande un code d'accès.
    - Deuxième page présente les options des jeux .
    
## Semaine 3 (18/01)
Continuation et corrections de la tâche 2 :
- Codes d'accès : fichier .env ou variable d'environnement (config var dans Heroku).
- Code d'accès comme paramètre obligatoire dans le chemin pour accéder aux serveurs.

Tâche 3 :
- Modification des initialisations des jeux.
- Nombre d'utilisateurs du jeu distribution intégré au code d'accès.
    - Proposition d'utiliser des clés privées, chiffrement et fichiers de configurations.

## Semaine 4 (25/01)
Extension tâche 3 :
- Creation d'un fichier avec les configurations du jeu selon le code d'accès. La somme des codes ASCII de chaque character du code d'accès donne l'identifiant de la configuration à utiliser.
- Ajout d'une autre option de chiffrement (RSA) pour les code d'accès (securite.ts).

## Semaine 5 (01/02)
La tâche 1 a été choisie pour cette semaine.