const express = require('express');
const router = express.Router();

// functions
const getActualDrivers = require("../utils/drivers/getActualDrivers");
const getDriverData = require("../utils/drivers/getDriverData");

router.get("/drivers", async (req, res) => {
    try {
        var pilotes = await getActualDrivers();
        res.render("drivers/drivers", { pilotesFront: pilotes });
    } catch (error) {
        res.render('security/error', { textError: '/drivers route, error during execution', error: error });
    }
});

router.get("/driver/:driver_id", async (req, res) => {
    try {
        var driverData = await getDriverData(req.params.driver_id);
        res.render("drivers/driver", { dataDriver: driverData });
    } catch (error) {
        res.render('security/error', { textError: '/driver route, error during execution', error: error });
    }
});

module.exports = router;