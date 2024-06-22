const express = require('express');
const router = express.Router();
const dbPool = require('../config/database'); // Importer le pool de connexions
const requireSession = require('../utils/requireSession'); // Importer le middleware de session
const requireAdmin = require('../utils/requireAdmin'); // Importer le middleware des admin
const getLastPodium = require("../utils/getLastPodium"); // Fonction permettant de récupérer le podium de la dernière course
const getDriversActualStandings = require("../utils/getDriversActualStanding"); // Fonction permettant de récupérer le classement actuel des pilotes
const getTeamsActualStandings = require("../utils/getTeamsActualStandings"); // Fonction permettant de récupérer le classement actuel des écuries
const getCalendrier = require("../utils/getCalendrier"); // Fonction permettant de récupérer le calendrier de la saison actuelle
const getActualPilotes = require("../utils/getActualPilotes"); // Fonction permettant de récupérer les pilotes actuels
const getDriverHistoryData = require("../utils/getDriverHistoryData"); // Fonction permettant de récupérer les données historiques d'un pilote
const getDriverData = require("../utils/getDriverData"); // Fonction permettant de récupérer les données d'un pilote
const getActualTeam = require("../utils/getActualTeam"); // Fonction permettant de récupérer l'équipe actuelle d'un pilote
const getActualTeams = require("../utils/getActualTeams"); // Fonction permettant de récupérer les équipes de la saison actuelle
const getTeam = require("../utils/getTeam"); // Fonction permettant de récupérer une équipe
const getTracks = require("../utils/getTracks"); // Fonction permettant de récupérer les circuits de la saison actuelle
const getTrack = require("../utils/getTrack"); // Fonction permettant de récupérer un circuit

router.get("/administration/panel", requireSession, requireAdmin, async (req, res) => {
    res.render("admin_panel");
});

router.get("/administration/updateCaches", requireSession, requireAdmin, async (req, res) => {
    await getActualPilotes(true);
    await getCalendrier(true);

    res.send("Caches mis à jour");
});

module.exports = router;