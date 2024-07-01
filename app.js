const http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const i18n = require('i18n');
var logger = require('morgan');
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const credits = require("./config/credits.json");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const dbPool = require('./config/database');

// On importe les fonctions crées par l'équipe
const getLastPodium = require("./utils/getLastPodium"); // Fonction permettant de récupérer le podium de la dernière course
const getDriversActualStandings = require("./utils/getDriversActualStanding"); // Fonction permettant de récupérer le classement actuel des pilotes
const getTeamsActualStandings = require("./utils/getTeamsActualStandings"); // Fonction permettant de récupérer le classement actuel des écuries
const getCalendrier = require("./utils/getCalendrier"); // Fonction permettant de récupérer le calendrier de la saison actuelle
const getActualPilotes = require("./utils/getActualPilotes"); // Fonction permettant de récupérer les pilotes actuels
const getDriverHistoryData = require("./utils/getDriverHistoryData"); // Fonction permettant de récupérer les données historiques d'un pilote
const getDriverData = require("./utils/getDriverData"); // Fonction permettant de récupérer les données d'un pilote
const getActualTeam = require("./utils/getActualTeam"); // Fonction permettant de récupérer l'équipe actuelle d'un pilote
const getActualTeams = require("./utils/getActualTeams"); // Fonction permettant de récupérer les équipes de la saison actuelle
const getTeam = require("./utils/getTeam"); // Fonction permettant de récupérer une équipe
const getTracks = require("./utils/getTracks"); // Fonction permettant de récupérer les circuits de la saison actuelle
const getTrack = require("./utils/getTrack"); // Fonction permettant de récupérer un circuit
const verifySession = require("./utils/verifySession"); // Fonction permettant de vérifier si une session est bien existante

// Configuration des middlewares
app.use(helmet()); // Helmet middleware, permet de sécuriser l'application en configurant des en-têtes HTTP de manière sécurisée
app.use(cookieParser()); // Cookie parser middleware, permet de gérer les cookies
app.use(
    session({
        secret: credits.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
    })
); // Session middleware, permet de gérer les sessions utilisateurs
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.openf1.org", "https://ergast.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://ajax.googleapis.com"],
        scriptSrcAttr: ["'unsafe-inline'"],
        mediaSrc: ["'self'", "https://api.openf1.org", "https://livetiming.formula1.com"]
    }
})); // Middleware permettant de configurer la Content Security Policy (CSP) avec Helmet
i18n.configure({
    locales: ['en', 'fr', 'de', 'es', 'it'], // Langues supportées
    directory: path.join(__dirname, 'locales'), // Répertoire des fichiers de langue
    defaultLocale: 'en', // Langue par défaut
    queryParameter: 'lang', // Paramètre de requête pour définir la langue (optionnel)
    autoReload: true, // Rechargement automatique des fichiers de langue lorsqu'ils sont modifiés (optionnel)
    syncFiles: true, // Synchronisation des fichiers de langue (optionnel)
    cookie: 'lang', // Nom du cookie pour stocker la langue sélectionnée par l'utilisateur (optionnel)
    objectNotation: true, // Utilisation de la notation d'objet pour accéder aux clés de traduction (optionnel)
});
app.use(i18n.init);

// Middleware pour gérer la langue de l'utilisateur
app.use(async (req, res, next) => {
    if (verifySession(req)) {
        try {
            const [rows] = await dbPool.query('SELECT language FROM users WHERE idUser = ?', [req.session.user.idUser]);
            if (rows.length > 0) {
                const userLanguage = rows[0].language;
                req.setLocale(userLanguage); // Définir la langue de l'utilisateur
            } else {
                req.setLocale(i18n.getLocale()); // Utiliser la langue par défaut de i18n
            }
        } catch (err) {
            console.error('Erreur lors de la récupération de la langue utilisateur:', err);
            req.setLocale(i18n.getLocale()); // En cas d'erreur, utiliser la langue par défaut de i18n
        }
    } else {
        req.setLocale(i18n.getLocale()); // Utiliser la langue par défaut de i18n pour les utilisateurs non authentifiés
    }

    // Affecter i18n à res.locals pour le rendre disponible dans les templates EJS
    res.locals.i18n = i18n;

    next();
});

// Middleware pour gérer le thème de l'utilisateur
app.use(async (req, res, next) => {
    if (verifySession(req)) {
        try {
            const [rows] = await dbPool.query('SELECT theme FROM users WHERE idUser = ?', [req.session.user.idUser]);
            if (rows.length > 0) {
                let userTheme = rows[0].theme;
                userTheme = userTheme === 0 ? "light" : "dark";
                req.session.theme = userTheme;
            } else {
                req.session.theme = "light";
            }
        } catch (err) {
            console.error('Erreur lors de la récupération du thème utilisateur:', err);
            req.session.theme = "light";
        }
    } else {
        req.session.theme = "light";
    }
    res.locals.theme = req.session.theme;
    next();
});

app.get("/", async (req, res) => {
    var podiumDriversFront = await getLastPodium(false); // Récupération du podium de la dernière course
    var actualDriversStanding = await getDriversActualStandings(false); // Récupération du classement actuel des pilotes
    var actualTeamsStanding = await getTeamsActualStandings(false); // Récupération du classement actuel des écuries
    res.render("accueil", { podiumDrivers: podiumDriversFront, actualDriversStanding: actualDriversStanding, actualTeamsStanding: actualTeamsStanding });
});

app.get("/ecuries", async (req, res) => {
    var teams = await getActualTeams(false);
    res.render("ecuries", { teamsFront: teams });
});

app.get("/ecurie/:ecurie_id", async (req, res) => {
    try {
        var team = await getTeam(req.params.ecurie_id);
        const [rows] = await dbPool.query('SELECT * FROM teams WHERE nom = ?', [req.params.ecurie_id]);
        const dataTeam = rows[0];
        res.render("ecurie", { teamFront: team, dataTeam: dataTeam });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations de l\'écurie:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

app.get("/pilotes", async (req, res) => {
    var pilotes = await getActualPilotes(false); // Récupération des pilotes actuels
    res.render("pilotes", { pilotesFront: pilotes });
});

app.get("/pilote/:driver_id", async (req, res) => {
    var pilote = await getDriverHistoryData(req.params.driver_id);
    var pilote2 = await getDriverData(req.params.driver_id);
    var teamInfo = await getActualTeam(req.params.driver_id);
    res.render("pilote", { piloteFront: pilote, id: req.params.driver_id, piloteFront2: pilote2, teamInfo: teamInfo });
});

app.get("/calendrier", async (req, res) => {
    try {
        const tracks = await getTracks();
        const calendrier = await getCalendrier(false);

        // Mapping des noms des Grands Prix aux identifiants des circuits
        const grandPrixToTrackId = {
            'Bahrain Grand Prix': 'bahrain',
            'Saudi Arabian Grand Prix': 'jeddah',
            'Australian Grand Prix': 'albert_park',
            'Japanese Grand Prix': 'suzuka',
            'Chinese Grand Prix': 'shanghai',
            'Miami Grand Prix': 'miami',
            'Emilia Romagna Grand Prix': 'imola',
            'Monaco Grand Prix': 'monaco',
            'Canadian Grand Prix': 'villeneuve',
            'Spanish Grand Prix': 'catalunya',
            'Austrian Grand Prix': 'red_bull_ring',
            'British Grand Prix': 'silverstone',
            'Hungarian Grand Prix': 'hungaroring',
            'Belgian Grand Prix': 'spa',
            'Dutch Grand Prix': 'zandvoort',
            'Italian Grand Prix': 'monza',
            'Azerbaijan Grand Prix': 'baku',
            'Singapore Grand Prix': 'marina_bay',
            'United States Grand Prix': 'americas',
            'Mexico City Grand Prix': 'rodriguez',
            'São Paulo Grand Prix': 'interlagos',
            'Las Vegas Grand Prix': 'vegas',
            'Qatar Grand Prix': 'losail',
            'Abu Dhabi Grand Prix': 'yas_marina'
        };

        // Fonction pour convertir une date et une heure au format "DD/MM" et "HHhMM" en objet Date
        const convertToFullDate = (dateString, timeString) => {
            const [day, month] = dateString.split('/');
            const [hour, minute] = timeString.includes('h') ? timeString.split('h') : [timeString, '00'];
            const year = new Date().getFullYear();
            return new Date(year, month - 1, day, hour, minute);
        };

        let calendrierArray = [];

        for (let round in calendrier) {
            let race = calendrier[round];
            race.fullDate = convertToFullDate(race.sessions.Race.date, race.sessions.Race.time);
            calendrierArray.push(race);
        }

        const sortedTracks = calendrierArray.map((round, index) => {
            const trackId = grandPrixToTrackId[round.raceName];
            const track = tracks.find(track => track.trackId === trackId);
            if (track) {
                track.roundDetails = round; // Ajouter les détails du round au track
                track.fullDate = round.fullDate;
            }
            return track;
        }).filter(track => track); // Filtrer les valeurs nulles

        // Déterminer le prochain Grand Prix
        const now = new Date();
        const nextRace = sortedTracks.find(track => track.fullDate > now);
        if (nextRace) {
            nextRace.isNextRace = true;
        }

        res.render("circuits", { tracksFront: sortedTracks });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/circuit/:circuit_id", async (req, res) => {
    try {
        var track = await getTrack(req.params.circuit_id);
        const [rows] = await dbPool.query('SELECT * FROM circuits WHERE id_circuit = ?', [req.params.circuit_id]);
        const dataCircuit = rows[0];
        res.render("circuit", { trackFront: track, dataCircuit: dataCircuit });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations du circuit:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

app.get("/classement", async (req, res) => {
    var actualDriversStanding = await getDriversActualStandings(false); // Récupération du classement actuel des pilotes
    var actualTeamsStanding = await getTeamsActualStandings(false); // Récupération du classement actuel des écuries
    res.render("classement", { actualDriversStanding: actualDriversStanding, actualTeamsStanding: actualTeamsStanding });
});

app.get("/reglement", async (req, res) => {
    res.render("reglement");
});

const retroRoutes = require('./routes/retro'); // Importation des routes de la partie rétro
app.use('/', retroRoutes);

app.get("/live", cors(), async (req, res) => {
    if (verifySession(req)) {
        res.render("live");
    } else {
        res.render("needAccount");
    }
});

const authRoutes = require('./routes/auth'); // Importation des routes d'authentification
app.use('/', authRoutes);

const profilRoutes = require('./routes/profil'); // Importation des routes de profil
app.use('/', profilRoutes);

const adminRoutes = require('./routes/admin'); // Importation des routes d'administration
app.use('/', adminRoutes);

app.get("/a_propos", async (req, res) => {
    res.render("a_propos");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = 3000;
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;