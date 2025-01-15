const express = require('express');
const router = express.Router();

// functions
const getChassisData = require("../utils/chassis/getChassisData");

router.get("/chassis/:chassis_id", async (req, res) => {
    try {
        var chassisData = await getChassisData(req.params.chassis_id);
        res.render("chassis/chassis", { chassisData: chassisData });
    } catch (error) {
        res.render('security/error', { textError: '/chassis route, error during execution', error: error });
    }
});

module.exports = router;