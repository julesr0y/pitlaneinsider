# PitLane Insider

#### _Dev Team: La Remontée Formula 1 Team_

- [ROY Jules](https://julesr0y.xyz/)
- DUMAS Antonin
- HU Lucas
- HUBERT Matthieu
- DELRUE Cyprien
- BASSET Maxime
- BERGHE Nathan

#### Presentation:

**PitLane Insider** is an unofficial web application that provides access to a wide variety of data concerning the Formula 1 World Championship.

#### Technologies/Frameworks used:

![Node.js](https://a11ybadges.com/badge?logo=nodedotjs) ![Express](https://a11ybadges.com/badge?logo=express) ![Tailwind CSS](https://a11ybadges.com/badge?logo=tailwindcss) ![JSON](https://a11ybadges.com/badge?logo=json)

For data retrieval, we mainly used the [F1DB](https://github.com/f1db/f1db) repo that we coupled with a Javascript program system allowing us to reduce the size of the files. We also used [OpenF1 Api](https://openf1.org/) for live data.

#### Launching the web application:

To launch the web application based on Node.JS (v21 min required), you need to go to the root of the project, then follow these steps:

1. If this is the first time you want to use the application (otherwise go directly to step 2):

```bash
npm install
```

2. To launch the Node.JS server :

- To test in development mode :

```bash
npm run dev
```

- To test in production mode :

```bash
npm start
```

#### Documentation :

To access the documentation for this project, generated with [JSDoc](https://jsdoc.app/), go to the Documentation folder, and open the index.html file in a browser.

To generate documentation use : 

```bash 
npm run doc
```

#### Code format :

To format code before committing, please use :

```bash 
npm run format:views
```

#### Status :

The status of the platform as well as the list of known incidents can be accessed [here](https://pitlaneinsider.betteruptime.com/).

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
