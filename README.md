# PitLane Insider

##### *Groupe 03 - La Remontée ISEN Formula 1 Team*

### Projet CIR2 - ROY Jules, DUMAS Antonin, HU Lucas, HUBERT Matthieu, DELRUE Cyprien, BASSET Maxime, BERGHE Nathan

#### Présentation :

**PitLane Insider** est une application web non officielle permettant d'accéder à une grande variété de données concernant le championnat du monde de Formule 1.

#### Capsule Vidéo :

Notre vidéo présentant rapidement le site est disponible dans le dossier Vidéo, au format mp4.

#### Technologies/Frameworks utilisés :

![Node.js](https://a11ybadges.com/badge?logo=nodedotjs) ![Nodemon](https://a11ybadges.com/badge?logo=nodemon) ![Express](https://a11ybadges.com/badge?logo=express) ![Tailwind CSS](https://a11ybadges.com/badge?logo=tailwindcss) ![MySQL](https://a11ybadges.com/badge?logo=mysql)

Pour la récupération des données, nous avons majoritairement utilisé l'API gratuite [Ergast Developer API](https://ergast.com/mrd/), ainsi que [OpenF1 Api](https://openf1.org/) pour les données en direct.

Pour la documentation, nous avons utilisé [JSDoc](https://jsdoc.app/) (Fonctionnement similaire à Doxygen).

#### Lancement de l'application web :

Pour lancer l'application web reposant sur Node.JS, il convient de se placer à la racine du projet, puis de suivre les étapes suivantes :

- Si c'est la première fois que l'on souhaite utiliser l'application :

```bash
npm install
npm install -g postcss-cli
npm run dev
```

PostCSS-CLI est nécessaire pour la compilation de TailwindCSS

- Sinon :

```bash
npm run dev
```

#### Documentation :

Pour accéder à la documentation de ce projet, générée avec [JSDoc](https://jsdoc.app/), il faut se rendre dans le dossier Documentation, et ouvrir le fichier index.html dans un navigateur.

#### Hébergement :

Cette projet est hébergé gratuitement sur la console Google Cloud, et accessible avec [ce lien](https://pitlaneinsider.fr/).

#### Points à améliorer :

- rendre le renouvellement des caches automatique
- amélioration du temps de chargement des images
