const express = require('express');
const router = express.Router();

// fonctions
const getActualTeams = require("../utils/constructors/getActualConstructors"); // Fonction permettant de récupérer les équipes de la saison actuelle
const getTeam = require("../utils/constructors/getConstructorData"); // Fonction permettant de récupérer une équipe

router.get("/teams", async (req, res) => {
    var teams = await getActualTeams(false);
    res.render("teams/teams", { teamsFront: teams });
});

router.get("/team/:ecurie_id", async (req, res) => {
    try {
        var team = await getTeam(req.params.ecurie_id);
        res.render("teams/team", { teamFront: team });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations de l\'écurie:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

module.exports = router;