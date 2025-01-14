const express = require('express');
const router = express.Router();

// functions
const getCalendrier = require("../utils/calendar/getCalendar");

router.get("/calendar", async (req, res) => {
    try {
        const calendrier = await getCalendrier();
        res.render("calendar/calendar", { tracksFront: calendrier });
    } catch (error) {
        res.render('security/error', { textError: '/calendar route, error during processing', error: error });
    }
});

module.exports = router;