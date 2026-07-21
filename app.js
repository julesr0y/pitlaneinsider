var express = require('express');
var path = require('path');
const i18n = require('i18n');
const helmet = require("helmet");
const compression = require('compression');
const config = require('./config.json');

const app = express();
const logger = require('morgan');
app.use(logger('dev')); // 'dev' format is colorized and concise

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('view options', {
//     compileDebug: true,
//     debug: true // Force the display of compiled code in the console
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// middlewares configuration
app.use(helmet()); // helmet security configuration
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: [
                "'self'",
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
);

// i18n configuration (language)
i18n.configure({
    locales: ['en'], // supported languages
    directory: path.join(__dirname, 'locales'), // language files directory
    defaultLocale: 'en', // default language
    queryParameter: 'lang', // language query parameter
    autoReload: true, // auto reload language files
    syncFiles: true, // sync language files
    cookie: 'lang', // cookie to store the selected language
    objectNotation: true, // object notation for language keys
});
app.use(i18n.init);

// Middleware for user language management
app.use(async (req, res, next) => {

    req.setLocale(i18n.getLocale()); // set default language to i18n
    res.locals.i18n = i18n; // set i18n to res.locals
    res.locals.currentYear = config.currentYear; // set current year to res.locals

    next();
});

// Middleware for user theme management
app.use(async (req, res, next) => {
    res.locals.theme = "dark"; // set theme to dark
    next();
});

// Rate Limiter: placed AFTER static files AND AFTER i18n/theme so error.ejs can render properly
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // 120 requests per IP per minute
    handler: (req, res, next, options) => {
        res.status(options.statusCode).render('security/error', {
            textError: "Trop de requêtes détectées",
            error: "Vous avez dépassé la limite de requêtes autorisées par minute. Pour protéger le serveur, votre accès est temporairement suspendu. Veuillez patienter une minute avant de rafraîchir."
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/live', limiter);

const getHomeData = require("./utils/home/getHomeData"); // call getHomeData function from utils/home/getHomeData.js
const getNewsHomePage = require("./utils/news/getNewsHomePage"); // call getNewsHomePage function from utils/news/getNewsHomePage.js

app.get("/", async (req, res) => { // home page
    try {
        var homeData = await getHomeData();
        var newsHomePage = await getNewsHomePage();
        res.render("home/home", { homeData: homeData.homeData, newsFront: newsHomePage });
    } catch (error) {
        res.render('security/error', { textError: 'base route, error during processing', error: error });
    }
});

const constructorsRoutes = require('./routes/constructors'); // call constructorsRoutes function from routes/constructors.js
app.use('/', constructorsRoutes);

const driversRoutes = require('./routes/drivers'); // call driversRoutes function from routes/drivers.js
app.use('/', driversRoutes);

const chassisRoutes = require('./routes/chassis'); // call chassisRoutes function from routes/chassis.js
app.use('/', chassisRoutes);

const calendarRoutes = require('./routes/calendar'); // call calendarRoutes function from routes/calendar.js
app.use('/', calendarRoutes);

const standingsRoutes = require('./routes/standings'); // call standingsRoutes function from routes/standings.js
app.use('/', standingsRoutes);

const retroReglementations = require('./routes/reglementations'); // call retroReglementations function from routes/reglementations.js
app.use('/', retroReglementations);

const retroRoutes = require('./routes/retro'); // call retroRoutes function from routes/retro.js
app.use('/', retroRoutes);

const liveRoutes = require('./routes/live'); // call liveRoutes function from routes/live.js
app.use('/', liveRoutes);

const newsRoutes = require('./routes/news'); // call newsRoutes function from routes/news.js
app.use('/', newsRoutes);

const aboutRoutes = require('./routes/about'); // call aboutRoutes function from routes/about.js
app.use('/', aboutRoutes);

// Middleware for handling non-existent routes
app.use((req, res, next) => {
    res.status(404).render('security/notFound');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
});

module.exports = app;