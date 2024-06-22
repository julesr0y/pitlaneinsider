const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les noms, prénoms et victoires des pilotes à partir de l'API Ergast.
 * @param {boolean} update - Détermine si les données doivent être mises à jour.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque pilote avec son nom, prénom et nombre de victoires.
 */
async function getWinners(update) {
    try {
        const filePath = path.join(__dirname, '../cache/getWinners.json'); // On définit le chemin du fichier JSON
        const filePathUpdate = path.join(__dirname, '../cache/updates/getWinners.json'); // Chemin du fichier JSON de mise à jour

        // Vérifier si le fichier principal existe et que l'option update est désactivée
        if (!update && fs.existsSync(filePath)) {
            // Lire le contenu du fichier principal
            const dataF = fs.readFileSync(filePath, 'utf8');

            // Vérifier si le fichier n'est pas vide
            if (dataF) {
                // Convertir les données en JSON et les retourner
                return JSON.parse(dataF);
            }
        }

        // Récupérer les données depuis l'API Ergast
        const data = await getFromErgast('driverstandings/1.json?limit=500');
        const standingsLists = data.MRData.StandingsTable.StandingsLists;

        // Object pour stocker les données des pilotes avec le nombre de victoires
        let winners = {};

        standingsLists.forEach(standingList => {
            const annee = standingList.season;
            const driverStanding = standingList.DriverStandings[0]; // Première position
            const driver = driverStanding.Driver;
            const driverId = driver.driverId;

            // Si le pilote est déjà dans l'objet winners, augmenter le compteur de victoires
            if (winners[driverId]) {
                winners[driverId].wins += 1;
                winners[driverId].year = annee;
            } else {
                // Sinon, initialiser le compteur de victoires à 1
                winners[driverId] = {
                    firstName: driver.givenName,
                    lastName: driver.familyName,
                    year: annee,
                    wins: 1
                };
            }
        });

        // Convertir l'objet winners en tableau
        const winnersArray = Object.values(winners);

        // Trier le tableau par nombre de victoires décroissant
        winnersArray.sort((a, b) => b.wins - a.wins);

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(winnersArray, null, 2);

        // Écrire les données dans le fichier JSON de mise à jour
        fs.writeFileSync(filePathUpdate, dataJSON);

        // Copier les données du fichier de mise à jour vers le fichier principal
        fs.copyFileSync(filePathUpdate, filePath);

        return;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getWinners;
