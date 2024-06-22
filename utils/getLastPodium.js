const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer le podium de la dernière course
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau : 0, Pilote en P1; 1, Pilote en P2; 2, Pilote en P3; 3, Nom de la course
 */
async function getLastPodium(update) {
    const filePath = path.join(__dirname, '../cache/getLastPodium.json'); // Chemin du fichier JSON principal
    const filePathUpdate = path.join(__dirname, '../cache/updates/getLastPodium.json'); // Chemin du fichier JSON de mise à jour

    if (!update) {
        // Vérifier si le fichier principal existe
        if (fs.existsSync(filePath)) {
            // Lire le contenu du fichier principal
            const dataF = fs.readFileSync(filePath, 'utf8');

            // Vérifier si le fichier n'est pas vide
            if (dataF) {
                // Convertir les données en JSON et les retourner
                return JSON.parse(dataF);
            }
        }
    } else {
        try {
            // Récupérer les données de la dernière course depuis l'API Ergast
            const lastRaceResult = await getFromErgast('current/last/results.json');
            const podiumDrivers = lastRaceResult.MRData.RaceTable.Races[0].Results.slice(0, 3); // Récupérer les 3 premiers pilotes du podium

            // Créer un tableau pour stocker les détails des pilotes du podium
            const podiumDriversFront = podiumDrivers.map(driver => ({
                code: driver.Driver.code,
                id: driver.Driver.driverId
            }));

            // Récupérer le nom de la course
            const raceName = lastRaceResult.MRData.RaceTable.Races[0].raceName;

            // Ajouter le nom de la course au tableau des pilotes du podium
            podiumDriversFront.push({ raceName });

            // Convertir les données en chaîne JSON
            const dataJSON = JSON.stringify(podiumDriversFront, null, 2);

            // Écrire les données dans le fichier de mise à jour
            fs.writeFileSync(filePathUpdate, dataJSON);

            // Copier les données du fichier de mise à jour vers le fichier principal
            fs.copyFileSync(filePathUpdate, filePath);

            return podiumDriversFront; // Retourner le tableau des pilotes du podium avec le nom de la course
        } catch (error) {
            console.error('Une erreur est survenue lors de la récupération du dernier podium :', error);
            throw error; // Propager l'erreur pour que le code appelant puisse la gérer
        }
    }

    return;
}

module.exports = getLastPodium;
