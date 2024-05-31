const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
    * @function
    * @description Fonction permettant de récupérer le podium de la dernière course
    * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau : 0, Pilote en P1; 1, Pilote en P2; 2, Pilote en P3; 3, Nom de la course
    */
async function getLastPodium() {

    const filePath = path.join(__dirname, '../cache/getLastPodium.json'); // On définit le chemin du fichier JSON
    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
        // Lire le contenu du fichier
        const dataF = fs.readFileSync(filePath, 'utf8');

        // Vérifier si le fichier n'est pas vide
        if (dataF) {
            // Convertir les données en JSON et les retourner
            return JSON.parse(dataF);
        }
    }

    var lastRaceResult = await getFromErgast('current/last/results.json'); // On récupère les données de la dernière course
    const podiumDrivers = lastRaceResult.MRData.RaceTable.Races[0].Results.slice(0, 3); // On récupère les 3 premiers pilotes
    var podiumDriversFront = []; // On créé un tableau pour stocker les pilotes du podium
    podiumDrivers.forEach(driver => { // Pour chaque pilote du podium
        const driverCode = driver.Driver.code; // On récupère le code name du pilote
        const driverId = driver.Driver.driverId; // On récupère l'id du pilote

        const driverF = {
            code: driverCode,
            id: driverId
        };

        podiumDriversFront.push(driverF); // On ajoute le pilote au tableau
    });

    const race = {
        raceName: lastRaceResult.MRData.RaceTable.Races[0].Circuit.Location.locality // On récupère le nom de la course
    };

    podiumDriversFront.push(race); // On ajoute le nom de la course au tableau

    // Convertir les données en chaîne JSON
    const dataJSON = JSON.stringify(podiumDriversFront, null, 2);
    // Écrire les données dans un fichier JSON
    fs.writeFile(filePath, dataJSON, (err) => {
        if (err) {
            console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
        } else {
            console.log('Les données ont été écrites avec succès dans le fichier JSON.');
        }
    });

    return podiumDriversFront; // On retourne le tableau
}

module.exports = getLastPodium;