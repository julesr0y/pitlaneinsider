const express = require('express');
const router = express.Router();

// fonctions
const getActualConstructors = require("../utils/constructors/getActualConstructors"); // Fonction permettant de récupérer les équipes de la saison actuelle
const getConstructor = require("../utils/constructors/getConstructorData"); // Fonction permettant de récupérer une équipe

router.get("/constructors", async (req, res) => {
    var constructors = await getActualConstructors(false);
    res.render("constructors/constructors", { teamsFront: constructors });
});

router.get("/constructor/:ecurie_id", async (req, res) => {
    try {
        var constructor = await getConstructor(req.params.ecurie_id);
        res.render("constructors/constructor", { teamFront: constructor });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations de l\'écurie:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

module.exports = router;