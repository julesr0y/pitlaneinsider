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

### _La Remontée Formula 1 Team_

#### Presentation:

[PitLane Insider](https://pitlaneinsider.alwaysdata.net/) is an unofficial web application that provides access to a wide variety of data concerning the Formula 1 World Championship.

#### Lead developer:
- [ROY Jules](https://julesr0y.xyz/)

#### Development team:

- DUMAS Antonin
- HU Lucas
- HUBERT Matthieu
- DELRUE Cyprien
- BASSET Maxime
- BERGHE Nathan

#### Technologies/Frameworks used:

- Node.js
- Express
- EJS
- Tailwind CSS
- JSON
- WebSockets
- SignalR Core

#### Data sources:

For data retrieval, we used the [F1DB](https://github.com/f1db/f1db) repo. We also used SignalR Core and WebSockets via SignalR for live data.  
`data/f1db` folder contains splitted .json files from the latest version of the f1db repo.

For circuits layouts, we used [F1 Circuits SVG](https://github.com/julesr0y/f1-circuits-svg).

#### Launching the web application:

To launch the web application based on Node.JS (v24 min required), you need to go to the root of the project, then follow these steps:

1. If this is the first time you want to use the application (otherwise go directly to step 2):

```bash
npm install
```

2. To launch the Node.JS server :

- To test in development mode :

```bash
npm run dev
```

### Development rules and guidelines:

For more information about architecture, development rules and guidelines, please refer to the [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) files and [CONTRIBUTING.md](CONTRIBUTING.md).

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