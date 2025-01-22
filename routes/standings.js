const express = require('express');
const router = express.Router();

// functions
const getDriversActualStandings = require("../utils/standings/getDriversActualStanding");
const getTeamsActualStandings = require("../utils/standings/getConstructorsActualStandings");

router.get("/driverstandings", async (req, res) => {
    try {
        var actualDriversStanding = await getDriversActualStandings();
        res.render("standings/driversStandings", { actualDriversStanding: actualDriversStanding });
    } catch (error) {
        res.render('security/error', { textError: '/driverstandings route, error during execution', error: error });
    }
});

router.get("/constructorstandings", async (req, res) => {
    try {
        var actualTeamsStanding = await getTeamsActualStandings();
        res.render("standings/constructorsStandings", { actualTeamsStanding: actualTeamsStanding });
    } catch (error) {
        res.render('security/error', { textError: '/constructorstandings route, error during execution', error: error });
    }
});

module.exports = router;