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
//     const filePath = path.join(__dirname, 'liveData/standings.json');

//     // Lecture du fichier standings.json pour vérification
//     const dataF = await fs.readFile(filePath, 'utf8');

//     async function updatePositionData() {
//         const classement = {};

//         try {
//             const response = await fetch('https://api.openf1.org/v1/position?session_key=latest');
//             if (!response.ok) {
//                 throw new Error(`API response not ok: ${response.status} ${response.statusText}`);
//             }
//             const data = await response.json();

//             data.forEach(driver => {
//                 if (!classement[driver.driver_number]) {
//                     classement[driver.driver_number] = { driver_number: driver.driver_number, last_position: 0 };
//                 }
//                 classement[driver.driver_number].last_position = driver.position;
//             });

//             const classementArray = Object.values(classement).sort((a, b) => a.last_position - b.last_position);
//             var top20 = classementArray.slice(0, 20);
//             var top20 = dataF
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

    try {
        // Lire les données du fichier standings.json
        const dataF = await fs.readFile(filePath, 'utf8');

        // Envoyer les données en réponse
        res.send(dataF);
    } catch (error) {
        console.error('Error reading standings file:', error);
        res.status(500).send('Error reading standings');
    }
});

module.exports = router;