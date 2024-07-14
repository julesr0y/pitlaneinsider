const express = require('express');
const router = express.Router();

// fonctions
const getDriversActualStandings = require("../utils/standings/getDriversActualStanding"); // Fonction permettant de récupérer le classement actuel des pilotes
const getTeamsActualStandings = require("../utils/standings/getConstructorsActualStandings"); // Fonction permettant de récupérer le classement actuel des écuries

router.get("/standings", async (req, res) => {
    var actualDriversStanding = await getDriversActualStandings(); // Récupération du classement actuel des pilotes
    var actualTeamsStanding = await getTeamsActualStandings(); // Récupération du classement actuel des écuries
    res.render("standings/standings", { actualDriversStanding: actualDriversStanding, actualTeamsStanding: actualTeamsStanding });
});

module.exports = router;