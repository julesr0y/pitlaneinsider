const express = require('express');
const router = express.Router();
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

// fonctions
const verifySession = require("../utils/security/verifySession"); // Fonction permettant de vérifier si une session est bien existante

router.get("/live", cors(), async (req, res) => {
    if (verifySession(req)) {
        res.render("live/live");
    } else {
        res.render("account/needAccount");
    }
});

router.get("/live/racecontrol", cors(), async (req, res) => {
    if (verifySession(req)) {
        res.render("live/racecontrol");
    } else {
        res.render("account/needAccount");
    }
});

router.get("/live/radio", cors(), async (req, res) => {
    if (verifySession(req)) {
        res.render("live/radio");
    } else {
        res.render("account/needAccount");
    }
});

router.get("/live/detailedstandings", cors(), async (req, res) => {
    if (verifySession(req)) {
        res.render("live/detailedStandings");
    } else {
        res.render("account/needAccount");
    }
});


// router.get("/live/getstandings", cors(), async (req, res) => {
//     // const filePath = path.join(__dirname, 'liveData/standings.json');
//     // const dataF = await fs.readFile(filePath, 'utf8');

//     const driverMapping = {
//         1: "VER",
//         20: "MAG",
//         2: "SAR",
//         3: "RIC",
//         10: "GAS",
//         44: "HAM",
//         55: "SAI",
//         16: "LEC",
//         77: "BOT",
//         63: "RUS",
//         11: "PER",
//         4: "NOR",
//         18: "STR",
//         14: "ALO",
//         31: "OCO",
//         23: "ALB",
//         22: "TSU",
//         81: "PIA",
//         24: "ZHO",
//         27: "HUL"
//     };

//     async function updatePositionData() {
//         try {
//             var classement = {};
//             const response = await fetch('https://api.openf1.org/v1/position?session_key=latest');
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             data.forEach(driver => {
//                 if (!classement[driver.driver_number]) {
//                     classement[driver.driver_number] = { driver_number: driver.driver_number, last_position: driver.position };
//                 }
//                 classement[driver.driver_number].last_position = driver.position;
//             });

//             const classementArray = Object.values(classement).sort((a, b) => a.last_position - b.last_position);
//             var top20 = classementArray.slice(0, 20).map(({ driver_number }) => ({
//                 driver_code: driverMapping[driver_number]
//             }));
//             return top20;
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             throw error;
//         }
//     }

//     if (verifySession(req)) {
//         try {
//             const standings = await updatePositionData();
//             // await fs.writeFile(filePath, JSON.stringify(standings, null, 2), 'utf8');
//             res.json(standings);
//         } catch (error) {
//             console.error('Error updating standings:', error);
//             res.status(500).send('Error fetching standings');
//         }
//     } else {
//         res.render("account/needAccount");
//     }
// });

router.get("/live/getstandings", cors(), async (req, res) => {
    const filePath = path.join(__dirname, 'liveData/standings.json');

    const driverMapping = {
        1: "VER",
        20: "MAG",
        2: "SAR",
        3: "RIC",
        10: "GAS",
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

    try {
        // Lire les données du fichier standings.json
        const dataF = await fs.readFile(filePath, 'utf8');

        // Parser les données en JSON
        const data = JSON.parse(dataF);
        var top20 = data.slice(0, 20).map(({ driver_number }) => ({
            driver_code: driverMapping[driver_number]
        }));
        // Envoyer les données en réponse
        res.json(top20);
    } catch (error) {
        console.error('Error reading standings file:', error);
        res.status(500).send('Error reading standings');
    }
});

router.get("/live/getstints", cors(), async (req, res) => {
    const driverMapping = {
        1: "VER",
        20: "MAG",
        2: "SAR",
        3: "RIC",
        10: "GAS",
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

    if (verifySession(req)) {
        try {
            const stints = await fetchStintData();
            res.json(stints);
        } catch (error) {
            console.error('Error updating stints:', error);
            res.status(500).send('Error fetching stints');
        }
    } else {
        res.render("account/needAccount");
    }
});

module.exports = router;