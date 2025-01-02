const express = require('express');
const router = express.Router();
const cors = require("cors");

// functions
const getWinners = require('../utils/retro/getDriverWinners');
const getWinnersConstructors = require('../utils/retro/getConstructorWinners');
const getSeasonRanking = require('../utils/retro/getRetroStandings');
const getSeasonList = require('../utils/retro/getRetroCalendar');
const getGPDetail = require('../utils/retro/getGPDetail');
const getRetroPilotes = require('../utils/retro/getRetroDrivers');
const getTeams = require('../utils/retro/getRetroConstructors');
const getRetroTracks = require('../utils/retro/getRetroTracks');
const getRetroCars = require('../utils/retro/getRetroCars');
const getTrackData = require('../utils/retro/getRetroTrackData');

router.get("/retrohome", cors(), async (req, res) => {
    var retroHome = await getWinners();
    var constructorWinners = await getWinnersConstructors();
    res.render("retro/retroHome", { retroHome: retroHome, constructorWinners: constructorWinners });
});

router.get("/retrodriverwinners", cors(), async (req, res) => {
    var retro_titre = await getWinners();
    res.render("retro/retroDriverWinners", { retro_titre: retro_titre });
});

router.get("/retroconstructorwinners", cors(), async (req, res) => {
    var constructorWinners = await getWinnersConstructors();
    res.render("retro/retroConstructorWinners", { constructorWinners: constructorWinners });
});

router.get("/retrostandings", cors(), (req, res) => {
    res.redirect("retrostandings/2024");
});

router.get("/retrostandings/:season_id", cors(), async (req, res) => {
    try {
        const retro_classement = await getSeasonRanking(req.params.season_id);
        res.render("retro/retroStandings", { retro_classement: retro_classement, selectedYear: req.params.season_id });
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de la saison :', error);
        res.status(500).send('Erreur lors de la récupération du classement de la saison');
    }
});

router.get("/retrocalendar", cors(), (req, res) => {
    res.redirect("/retroCalendar/2024");
});

router.get("/retrocalendar/:season_id", cors(), async (req, res) => {
    try {
        const retro_calendrier = await getSeasonList(req.params.season_id);
        res.render("retro/retroCalendar", { retro_calendrier: retro_calendrier, selectedYear: req.params.season_id });
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de la saison :', error);
        res.status(500).send('Erreur lors de la récupération du classement de la saison ');
    }
});

router.get("/retrogpdetails/:season_id/:gp_id", cors(), async (req, res) => {
    try {
        var GP_detail = await getGPDetail(req.params.gp_id);
        if (Object.keys(GP_detail.gpInfo).length === 0 && GP_detail.raceData.length === 0) {
            res.render('security/gpNotHappenedYet');
        } else {
            res.render('retro/retroGpDetails', { gpDetails: GP_detail, selectedYear: req.params.season_id });
        }
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

router.get("/retrodrivers", cors(), async (req, res) => {
    var retro_pilotes = await getRetroPilotes();
    res.render("retro/retroDrivers", { retro_pilotes: retro_pilotes });
});

router.get("/retroconstructors", cors(), async (req, res) => {
    var retro_ecuries = await getTeams();
    res.render("retro/retroConstructors", { retro_ecuries: retro_ecuries });
});

router.get("/retrotracks", cors(), async (req, res) => {
    var retro_circuits = await getRetroTracks();
    res.render("retro/retroTracks", { retro_circuits: retro_circuits });
});

router.get("/retrocars", cors(), async (req, res) => {
    var retro_cars = await getRetroCars();
    res.render("retro/retroCars", { retro_cars: retro_cars });
});

router.get("/track/:track_id", cors(), async (req, res) => {
    var trackData = await getTrackData(req.params.track_id);
    res.render("tracks/track", { trackData: trackData });
});

module.exports = router;