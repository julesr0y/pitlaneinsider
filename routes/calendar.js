const express = require('express');
const router = express.Router();

// functions
const getCalendrier = require("../utils/calendar/getCalendar"); // Fonction permettant de récupérer le calendrier de la saison actuelle

router.get("/calendar", async (req, res) => {
    try {
        const calendrier = await getCalendrier();

        res.render("calendar/calendar", { tracksFront: calendrier });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;