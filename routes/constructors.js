const express = require('express');
const router = express.Router();

// functions
const getActualConstructors = require("../utils/constructors/getActualConstructors");
const getConstructor = require("../utils/constructors/getConstructorData");

router.get("/constructors", async (req, res) => {
    try {
        var constructors = await getActualConstructors(false);
        res.render("constructors/constructors", { teamsFront: constructors });
    } catch (error) {
        res.render('security/error', { textError: '/constructors route, error during processing', error: error });
    }
});

router.get("/constructor/:constructorId", async (req, res) => {
    try {
        var constructor = await getConstructor(req.params.constructorId);
        res.render("constructors/constructor", { teamFront: constructor });
    } catch (error) {
        res.render('security/error', { textError: '/constructor route, error during processing', error: error });
    }
});

module.exports = router;