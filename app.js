var express = require('express');
var path = require('path');
const i18n = require('i18n');
const helmet = require("helmet");
const compression = require('compression');

const app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('view options', {
//     compileDebug: true,
//     debug: true // <--- Force l'affichage du code compilé dans la console
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration des middlewares
app.use(helmet()); // Helmet middleware, permet de sécuriser l'application en configurant des en-têtes HTTP de manière sécurisée
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: [
                "'self'",
                "https://api.openf1.org",
                "https://www.motorsport.com/rss/f1/news/",
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
            ],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://ajax.googleapis.com",
                "https://cdn.jsdelivr.net/npm/apexcharts",
                "https://cdn.jsdelivr.net/npm/luxon/build/global",
            ],
            scriptSrcElem: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net/npm/luxon/build/global/luxon.min.js",
            ],
            scriptSrcAttr: ["'unsafe-inline'"],
            mediaSrc: [
                "'self'",
                "https://api.openf1.org",
                "https://livetiming.formula1.com",
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https://ik.imagekit.io",
                "https://pitlaneinsider-data.alwaysdata.net",
                "https://cdn-1.motorsport.com/",
                "https://cdn-2.motorsport.com/",
                "https://cdn-3.motorsport.com/",
                "https://cdn-4.motorsport.com/",
                "https://cdn-5.motorsport.com/",
                "https://cdn-6.motorsport.com/",
                "https://cdn-7.motorsport.com/",
                "https://cdn-8.motorsport.com/",
                "https://cdn-9.motorsport.com/",
            ],
        },
    })
); // Middleware permettant de configurer la Content Security Policy (CSP) avec Helmet
i18n.configure({
    locales: ['en'], // Langues supportées
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

    req.setLocale(i18n.getLocale()); // Utiliser la langue par défaut de i18n pour les utilisateurs non authentifiés
    res.locals.i18n = i18n; // Affecter i18n à res.locals pour le rendre disponible dans les templates EJS

    next();
});

// Middleware pour gérer le thème de l'utilisateur
app.use(async (req, res, next) => {
    res.locals.theme = "dark";
    next();
});

const getHomeData = require("./utils/home/getHomeData"); // Fonction permettant de récupérer les données de la page d'accueil
const getNewsHomePage = require("./utils/news/getNewsHomePage");

app.get("/", async (req, res) => { // home page
    try {
        var homeData = await getHomeData();
        var newsHomePage = await getNewsHomePage();
        res.render("home/home", { homeData: homeData.homeData, homeOTDData: homeData.homeOTDData, newsFront: newsHomePage });
    } catch (error) {
        res.render('security/error', { textError: 'base route, error during processing', error: error });
    }
});

const constructorsRoutes = require('./routes/constructors'); // Importation des routes concernant les écuries
app.use('/', constructorsRoutes);

const driversRoutes = require('./routes/drivers'); // Importation des routes concernant les pilotes
app.use('/', driversRoutes);

const chassisRoutes = require('./routes/chassis'); // Importation des routes concernant les voitures
app.use('/', chassisRoutes);

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

const newsRoutes = require('./routes/news'); // Importation des routes concernant les news
app.use('/', newsRoutes);

const aboutRoutes = require('./routes/about'); // Importation des routes de la partie  a propos
app.use('/', aboutRoutes);

// Middleware pour gérer les routes inexistantes
app.use((req, res, next) => {
    res.status(404).render('security/notFound');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
});

module.exports = app;