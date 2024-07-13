const express = require('express');
const router = express.Router();

// functions
const getActualPilotes = require("../utils/drivers/getActualDrivers"); // Fonction permettant de récupérer les pilotes actuels
const getDriverData = require("../utils/drivers/getDriverData"); // Fonction permettant de récupérer les données d'un pilote

router.get("/drivers", async (req, res) => {
    var pilotes = await getActualPilotes(); // Récupération des pilotes actuels
    res.render("drivers/drivers", { pilotesFront: pilotes });
});

router.get("/driver/:driver_id", async (req, res) => {
    var driverData = await getDriverData(req.params.driver_id);
    res.render("drivers/driver", { dataDriver: driverData });
});

module.exports = router;