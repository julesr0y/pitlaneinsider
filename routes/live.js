const express = require('express');
const router = express.Router();
const cors = require("cors");

// driver number to driver code mapping
const driverMapping = {
    1: "VER",
    20: "MAG",
    2: "SAR",
    3: "RIC",
    10: "GAS",
    30: "LAW",
    43: "COL",
    61: "DOO",
    44: "HAM",
    55: "SAI",
    16: "LEC",
    77: "BOT",
    63: "RUS",
    11: "PER",
    4: "NOR",
    18: "STR",
    14: "ALO",
    31: "OCO",
    23: "ALB",
    22: "TSU",
    81: "PIA",
    24: "ZHO",
    27: "HUL"
};


// routes
router.get("/live", cors(), async (req, res) => {
    try {
        res.render("live/live");
    } catch (error) {
        res.render('security/error', { textError: '/live route, error during processing', error: error });
    }
});

router.get("/live/racecontrol", cors(), async (req, res) => {
    try {
        res.render("live/racecontrol");
    } catch (error) {
        res.render('security/error', { textError: '/live/racecontrol route, error during processing', error: error });
    }
});

router.get("/live/radio", cors(), async (req, res) => {
    try {
        res.render("live/radio");
    } catch (error) {
        res.render('security/error', { textError: '/live/radio route, error during processing', error: error });
    }
});

router.get("/live/detailedstandings", cors(), async (req, res) => {
    try {
        res.render("live/detailedStandings");
    } catch (error) {
        res.render('security/error', { textError: '/live/detailedstandings route, error during processing', error: error });
    }
});


router.get("/live/getstandings", cors(), async (req, res) => {
    async function updatePositionData() {
        try {
            var classement = {};
            const response = await fetch('https://api.openf1.org/v1/position?session_key=latest');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            data.forEach(driver => {
                if (!classement[driver.driver_number]) {
                    classement[driver.driver_number] = { driver_number: driver.driver_number, last_position: driver.position };
                }
                classement[driver.driver_number].last_position = driver.position;
            });

            const classementArray = Object.values(classement).sort((a, b) => a.last_position - b.last_position);
            var top20 = classementArray.slice(0, 20).map(({ driver_number }) => ({
                driver_code: driverMapping[driver_number]
            }));
            return top20;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    const standings = await updatePositionData();
    res.json(standings);
});

router.get("/live/getstints", cors(), async (req, res) => {
    async function fetchStintData() {
        try {
            const response = await fetch('https://api.openf1.org/v1/stints?session_key=latest');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const lastCompounds = {};

            // Iterate over the stint data to get the last compound for each driver
            data.forEach(stint => {
                if (!lastCompounds[stint.driver_number] || lastCompounds[stint.driver_number].lap_end < stint.lap_end) {
                    lastCompounds[stint.driver_number] = stint.compound;
                }
            });

            // Convertir lastCompounds en tableau et mapper selon driverMapping
            var toReturn = Object.keys(lastCompounds).map(driver_number => ({
                driver_code: driverMapping[driver_number],
                compound: lastCompounds[driver_number]
            }));

            return toReturn;
        } catch (error) {
            console.error("Erreur lors de la récupération des stints :", error);
            throw error;
        }
    }

    const stints = await fetchStintData();
    res.json(stints);
});

router.get("/live/getintervals", cors(), async (req, res) => {
    const driverIntervals = {};

    async function updateIntervals() {
        try {
            const intervalsResponse = await fetch('https://api.openf1.org/v1/intervals?session_key=latest');
            const intervalsData = await intervalsResponse.json();

            intervalsData.forEach(({ driver_number, interval, gap_to_leader }) => {
                if (interval !== null) {
                    driverIntervals[driver_number] = interval;
                } else if (gap_to_leader !== null) {
                    driverIntervals[driver_number] = gap_to_leader;
                } else {
                    driverIntervals[driver_number] = "No data";
                }
            });

            var intervalsArray = Object.keys(driverIntervals).map(driver_number => ({
                driver_number,
                gap: driverIntervals[driver_number]
            }));

            var mappedIntervals = intervalsArray.map(({ driver_number, gap }) => ({
                driver_code: driverMapping[driver_number],
                gap
            }));

            var top20 = mappedIntervals.slice(0, 20);

            return top20;
        } catch (error) {
            console.error('Erreur lors de la récupération des intervalles:', error);
        }
    }

    const gaps = await updateIntervals();
    res.json(gaps);
});

module.exports = router;