const express = require('express');
const router = express.Router();
const cors = require("cors");

// fonctions
const getWinners = require('../utils/getWinners');
const getSeasonRanking = require('../utils/getSeasonRanking');
const getSeasonList = require('../utils/getSeasonList');
const getGPDetail = require('../utils/getGPDetail');
const getRetroPilotes = require('../utils/getRetroPilotes');
const getEcuries = require('../utils/getEcuries');
const getCircuits = require('../utils/getCircuits');

router.get("/retro_accueil", cors(), async (req, res) => {
    var retroHome = await getWinners();
    res.render("retro_accueil", { retroHome: retroHome })
})

router.get("/retro_titre", cors(), async (req, res) => {
    var retro_titre = await getWinners();
    res.render("retro_titre", { retro_titre: retro_titre })
})

router.get("/retro_classement", cors(), (req, res) => {
    res.redirect("/retro_classement/2023");
});

router.get("/retro_classement/:season_id", cors(), async (req, res) => {
    try {
        const retro_classement = await getSeasonRanking(req.params.season_id);
        res.render("retro_classement", { retro_classement: retro_classement, selectedYear: req.params.season_id });
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de la saison :', error);
        res.status(500).send('Erreur lors de la récupération du classement de la saison');
    }
});

router.get("/retro_calendrier", cors(), (req, res) => {
    res.redirect("/retro_calendrier/2023");
});

router.get("/retro_calendrier/:season_id", cors(), async (req, res) => {
    try {
        const retro_calendrier = await getSeasonList(req.params.season_id);
        res.render("retro_calendrier", { retro_calendrier: retro_calendrier, selectedYear: req.params.season_id });
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de la saison :', error);
        res.status(500).send('Erreur lors de la récupération du classement de la saison ');
    }
});

router.get("/retro_gpdetail", cors(), (req, res) => {
    res.redirect("/retro_gp_detail/2023/1");
});

router.get("/retro_gpdetail/:season_id/:gp_id", cors(), async (req, res) => {
    try {
        var GP_detail = await getGPDetail(req.params.gp_id);
        res.render('retro_gpdetail', { gpDetails: GP_detail, selectedYear: req.params.season_id });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

router.get("/retro_pilotes", cors(), async (req, res) => {
    var retro_pilotes = await getRetroPilotes(false);
    res.render("retro_pilotes", { retro_pilotes: retro_pilotes })
});

router.get("/retro_ecuries", cors(), async (req, res) => {
    var retro_ecuries = await getEcuries(false);
    res.render("retro_ecuries", { retro_ecuries: retro_ecuries })
});

router.get("/retro_circuits", cors(), async (req, res) => {
    var retro_circuits = await getCircuits(false);
    res.render("retro_circuits", { retro_circuits: retro_circuits })
});

module.exports = router;