const express = require('express');
const router = express.Router();

// functions
const getActualSeasonCalendar = require("../utils/calendar/getActualSeasonCalendar");

router.get("/calendar", async (req, res) => {
    try {
        const calendrier = await getActualSeasonCalendar();
        res.render("calendar/calendar", { tracksFront: calendrier });
    } catch (error) {
        res.render('security/error', { textError: '/calendar route, error during execution', error: error });
    }
});

module.exports = router;