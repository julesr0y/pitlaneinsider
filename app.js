const http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const i18n = require('i18n');
const helmet = require("helmet");
const session = require("express-session");
const credits = require("./config/credits.json");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const dbPool = require('./config/database');

// On importe les fonctions crées par l'équipe
const getHomeData = require("./utils/getHomeData"); // Fonction permettant de récupérer les données de la page d'accueil
const verifySession = require("./utils/security/verifySession"); // Fonction permettant de vérifier si une session est bien existante

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

app.get("/", async (req, res) => { // home page
    var homeData = await getHomeData();
    res.render("home", { homeData: homeData });
});

const teamsRoutes = require('./routes/teams'); // Importation des routes concernant les écuries
app.use('/', teamsRoutes);

const driversRoutes = require('./routes/drivers'); // Importation des routes concernant les pilotes
app.use('/', driversRoutes);

const calendarRoutes = require('./routes/calendar'); // Importation des routes concernant le calendrier
app.use('/', calendarRoutes);

const standingsRoutes = require('./routes/standings'); // Importation des routes concernant les écuries
app.use('/', standingsRoutes);

const retroReglementations = require('./routes/reglementations'); // Importation des routes de la partie reglementations
app.use('/', retroReglementations);

const retroRoutes = require('./routes/retro'); // Importation des routes de la partie rétro
app.use('/', retroRoutes);

const liveRoutes = require('./routes/live'); // Importation des routes concernant le live
app.use('/', liveRoutes);

const profilRoutes = require('./routes/profil'); // Importation des routes de profil
app.use('/', profilRoutes);

const aboutRoutes = require('./routes/about'); // Importation des routes de la partie  a propos
app.use('/', aboutRoutes);

const authRoutes = require('./routes/auth'); // Importation des routes d'authentification
app.use('/', authRoutes);

// app.get("/circuit/:circuit_id", async (req, res) => {
//     try {
//         var track = await getTrack(req.params.circuit_id);
//         const [rows] = await dbPool.query('SELECT * FROM circuits WHERE id_circuit = ?', [req.params.circuit_id]);
//         const dataCircuit = rows[0];
//         res.render("circuit", { trackFront: track, dataCircuit: dataCircuit });
//     } catch (err) {
//         console.error('Erreur lors de la récupération des informations du circuit:', err);
//         res.status(500).send('Erreur interne du serveur');
//     }
// });

// Middleware pour gérer les routes inexistantes
app.use((req, res, next) => {
    res.status(404).render('notFound');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
});

const port = 3000;
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    // useless but fun
    const asciiArt = `
         ________  ___  _________  ___       ________  ________   _______           ___  ________   ________  ___  ________  _______   ________     
        |\\   __  \\|\\  \\|\\___   ___\\\\  \\     |\\   __  \\|\\   ___  \\|\\  ___ \\         |\\  \\|\\   ___  \\|\\   ____\\|\\  \\|\\   ___ \\|\\  ___ \\ |\\   __  \\    
        \\ \\  \\|\\  \\ \\  \\|___ \\  \\_\\ \\  \\    \\ \\  \\|\\  \\ \\  \\\\ \\  \\ \\   __/|        \\ \\  \\ \\  \\\\ \\  \\ \\  \\___|\\ \\  \\ \\  \\_|\\ \\ \\   __/|\\ \\  \\|\\  \\   
         \\ \\   ____\\ \\  \\   \\ \\  \\ \\ \\  \\    \\ \\   __  \\ \\  \\\\ \\  \\ \\  \\_|/__       \\ \\  \\ \\  \\\\ \\  \\ \\_____  \\ \\  \\ \\  \\ \\\\ \\ \\  \\_|/_\\ \\   _  _\\  
          \\ \\  \\___|\\ \\  \\   \\ \\  \\ \\ \\  \\____\\ \\  \\ \\  \\ \\  \\\\ \\  \\ \\  \\_|\\ \\       \\ \\  \\ \\  \\\\ \\  \\|____|\\  \\ \\  \\ \\  \\_\\\\ \\ \\  \\_|\\ \\ \\  \\\\  \\| 
           \\ \\__\\    \\ \\__\\   \\ \\__\\ \\ \\_______\\ \\__\\ \\__\\ \\__\\\\ \\__\\ \\_______\\       \\ \\__\\ \\__\\\\ \\__\\____\\_\\  \\ \\__\\ \\_______\\ \\_______\\ \\__\\\\ _\\ 
            \\|__|     \\|__|    \\|__|  \\|_______|\\|__|\\|__|\\|__| \\|__|\\|_______|        \\|__|\\|__| \\|__|\\_________\\|__|\\|_______|\\|_______|\\|__|\\|__|
                                                                                                      \\|_________|`;

    console.log(asciiArt);
});


module.exports = app;