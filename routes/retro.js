const express = require('express');
const router = express.Router();
const cors = require("cors");

// functions
const getWinners = require('../utils/retro/getDriverWinners');
const getWinnersConstructors = require('../utils/retro/getConstructorWinners');
const getRetroDriversStandings = require('../utils/retro/getRetroDiversStandings');
const getRetroConstructorsStandings = require('../utils/retro/getRetroConstructorsStandings');
const getSeasonList = require('../utils/retro/getRetroCalendar');
const getGPDetail = require('../utils/retro/getGPDetail');
const getRetroPilotes = require('../utils/retro/getRetroDrivers');
const getTeams = require('../utils/retro/getRetroConstructors');
const getRetroTracks = require('../utils/retro/getRetroTracks');
const getRetroCars = require('../utils/retro/getRetroCars');
const getTrackData = require('../utils/retro/getRetroTrackData');

router.get("/retrohome", cors(), async (req, res) => {
    try {
        var retroHome = await getWinners();
        var constructorWinners = await getWinnersConstructors();
        res.render("retro/retroHome", { retroHome: retroHome, constructorWinners: constructorWinners });
    } catch (error) {
        res.render('security/error', { textError: '/retrohome route, error during processing', error: error });
    }
});

router.get("/retrodriverwinners", cors(), async (req, res) => {
    try {
        var retro_titre = await getWinners();
        res.render("retro/retroDriverWinners", { retro_titre: retro_titre });
    } catch (error) {
        res.render('security/error', { textError: '/retrodriverwinners route, error during processing', error: error });
    }
});

router.get("/retroconstructorwinners", cors(), async (req, res) => {
    try {
        var constructorWinners = await getWinnersConstructors();
        res.render("retro/retroConstructorWinners", { constructorWinners: constructorWinners });
    } catch (error) {
        res.render('security/error', { textError: '/retroconstructorwinners route, error during processing', error: error });
    }
});

router.get("/retrostandings", cors(), (req, res) => {
    try {
        res.redirect("retrostandings/2024");
    } catch (error) {
        res.render('security/error', { textError: '/retrostandings route, error during processing', error: error });
    }
});

router.get("/retrostandings/:season_id", cors(), async (req, res) => {
    try {
        const retroDriversStandings = await getRetroDriversStandings(req.params.season_id);
        const retroConstructorsStandings = await getRetroConstructorsStandings(req.params.season_id);
        res.render("retro/retroStandings", { retroDriversStandings: retroDriversStandings, retroConstructorsStandings: retroConstructorsStandings, selectedYear: req.params.season_id });
    } catch (error) {
        res.render('security/error', { textError: '/retrostandings route, error during processing', error: error });
    }
});

router.get("/retrocalendar", cors(), (req, res) => {
    try {
        res.redirect("/retroCalendar/2024");
    } catch (error) {
        res.render('security/error', { textError: '/retrocalendar route, error during processing', error: error });
    }
});

router.get("/retrocalendar/:season_id", cors(), async (req, res) => {
    try {
        const retro_calendrier = await getSeasonList(req.params.season_id);
        res.render("retro/retroCalendar", { retro_calendrier: retro_calendrier, selectedYear: req.params.season_id });
    } catch (error) {
        res.render('security/error', { textError: '/retrocalendar route, error during processing', error: error });
    }
});

router.get("/retrogpdetails/:season_id/:gp_id", cors(), async (req, res) => {
    try {
        var GP_detail = await getGPDetail(req.params.season_id, req.params.gp_id);
        if (Object.keys(GP_detail.gpInfos).length === 0 && GP_detail.raceData.length === 0) {
            res.render('security/gpNotHappenedYet');
        } else {
            res.render('retro/retroGpDetails', { gpDetails: GP_detail, selectedYear: req.params.season_id });
        }
    } catch (error) {
        res.render('security/error', { textError: '/retrogpdetails route, error during processing', error: error });
    }
});

router.get("/retrodrivers", cors(), async (req, res) => {
    try {
        var retro_pilotes = await getRetroPilotes();
        res.render("retro/retroDrivers", { retro_pilotes: retro_pilotes });
    } catch (error) {
        res.render('security/error', { textError: '/retrodrivers route, error during processing', error: error });
    }
});

router.get("/retroconstructors", cors(), async (req, res) => {
    try {
        var retro_ecuries = await getTeams();
        res.render("retro/retroConstructors", { retro_ecuries: retro_ecuries });
    } catch (error) {
        res.render('security/error', { textError: '/retroconstructors route, error during processing', error: error });
    }
});

router.get("/retrotracks", cors(), async (req, res) => {
    try {
        var retro_circuits = await getRetroTracks();
        res.render("retro/retroTracks", { retro_circuits: retro_circuits });
    } catch (error) {
        res.render('security/error', { textError: '/retrotracks route, error during processing', error: error });
    }
});

router.get("/retrocars", cors(), async (req, res) => {
    try {
        var retro_cars = await getRetroCars();
        res.render("retro/retroCars", { retro_cars: retro_cars });
    } catch (error) {
        res.render('security/error', { textError: '/retrocars route, error during processing', error: error });
    }
});

router.get("/track/:track_id", cors(), async (req, res) => {
    try {
        var trackData = await getTrackData(req.params.track_id);
        res.render("tracks/track", { trackData: trackData });
    } catch (error) {
        res.render('security/error', { textError: '/track route, error during processing', error: error });
    }
});

module.exports = router;