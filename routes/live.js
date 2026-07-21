const express = require('express');
const router = express.Router();
const cors = require("cors");

// routes
router.get("/live", cors(), async (req, res) => {
    try {
        res.render("live/live");
    } catch (error) {
        res.render('security/error', { textError: '/live route, error during execution', error: error });
    }
});

router.get("/live/racecontrol", cors(), async (req, res) => {
    try {
        res.render("live/racecontrol");
    } catch (error) {
        res.render('security/error', { textError: '/live/racecontrol route, error during execution', error: error });
    }
});

router.get("/live/radio", cors(), async (req, res) => {
    try {
        res.render("live/radio");
    } catch (error) {
        res.render('security/error', { textError: '/live/radio route, error during execution', error: error });
    }
});

router.get("/live/detailedstandings", cors(), async (req, res) => {
    try {
        res.render("live/detailedStandings");
    } catch (error) {
        res.render('security/error', { textError: '/live/detailedstandings route, error during execution', error: error });
    }
});

module.exports = router;