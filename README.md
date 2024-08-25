# PitLane Insider

#### *Dev Team: La Remontée Formula 1 Team*

- [ROY Jules](https://julesr0y.xyz/)
- DUMAS Antonin
- HU Lucas
- HUBERT Matthieu
- DELRUE Cyprien
- BASSET Maxime
- BERGHE Nathan

#### Présentation :

**PitLane Insider** est une application web non officielle permettant d'accéder à une grande variété de données concernant le championnat du monde de Formule 1.

#### Technologies/Frameworks utilisés :

![Node.js](https://a11ybadges.com/badge?logo=nodedotjs) ![Nodemon](https://a11ybadges.com/badge?logo=nodemon) ![Express](https://a11ybadges.com/badge?logo=express) ![Tailwind CSS](https://a11ybadges.com/badge?logo=tailwindcss) ![MySQL](https://a11ybadges.com/badge?logo=mysql) ![Python](https://a11ybadges.com/badge?logo=python) ![JSON](https://a11ybadges.com/badge?logo=json)

Pour la récupération des données, nous avons majoritairement utilisé le repo [F1DB](https://github.com/f1db/f1db) que nous avons couplé à un système de scripts en Python nous permettant de réduire la taille des fichiers. Nous avons aussi utilisé [OpenF1 Api](https://openf1.org/) pour les données en direct.

#### Lancement de l'application web :

Pour lancer l'application web reposant sur Node.JS, il convient de se placer à la racine du projet, puis de suivre les étapes suivantes :

1. Si c'est la première fois que l'on souhaite utiliser l'application (sinon passer directement à l'étape 2) :
    ```bash
    npm install
    ```

2. Pour lancer le serveur Node.JS :
    - Pour tester en mode développement :
    ```bash
    npm run dev
    ```

    - Pour tester en mode production :
    ```bash
    npm start
    ```

#### Documentation :

Pour accéder à la documentation de ce projet, générée avec [JSDoc](https://jsdoc.app/), il faut se rendre dans le dossier Documentation, et ouvrir le fichier index.html dans un navigateur.

```
 ________  ___  _________  ___       ________  ________   _______           ___  ________   ________  ___  ________  _______   ________   
|\   __  \|\  \|\___   ___\\  \     |\   __  \|\   ___  \|\  ___ \         |\  \|\   ___  \|\   ____\|\  \|\   ___ \|\  ___ \ |\   __  \  
\ \  \|\  \ \  \|___ \  \_\ \  \    \ \  \|\  \ \  \\ \  \ \   __/|        \ \  \ \  \\ \  \ \  \___|\ \  \ \  \_|\ \ \   __/|\ \  \|\  \   
 \ \   ____\ \  \   \ \  \ \ \  \    \ \   __  \ \  \\ \  \ \  \_|/__       \ \  \ \  \\ \  \ \_____  \ \  \ \  \ \\ \ \  \_|/_\ \   _  _\  
  \ \  \___|\ \  \   \ \  \ \ \  \____\ \  \ \  \ \  \\ \  \ \  \_|\ \       \ \  \ \  \\ \  \|____|\  \ \  \ \  \_\\ \ \  \_|\ \ \  \\  \| 
   \ \__\    \ \__\   \ \__\ \ \_______\ \__\ \__\ \__\\ \__\ \_______\       \ \__\ \__\\ \__\____\_\  \ \__\ \_______\ \_______\ \__\\ _\ 
    \|__|     \|__|    \|__|  \|_______|\|__|\|__|\|__| \|__|\|_______|        \|__|\|__| \|__|\_________\|__|\|_______|\|_______|\|__|\|__|
                                                                                              \|_________|                        
```
