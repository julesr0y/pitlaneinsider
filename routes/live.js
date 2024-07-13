const express = require('express');
const router = express.Router();
const cors = require("cors");

// fonctions
const verifySession = require("../utils/security/verifySession"); // Fonction permettant de vérifier si une session est bien existante

router.get("/live", cors(), async (req, res) => {
    if (verifySession(req)) {
        res.render("live/live");
    } else {
        res.render("account/needAccount");
    }
});

module.exports = router;