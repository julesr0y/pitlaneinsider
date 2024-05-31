const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les noms, prénoms et victoires des pilotes à partir de l'API Ergast.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque pilote avec son nom, prénom et nombre de victoires.
 */
async function getWinners() {
    var annee;
    try {
        const filePath = path.join(__dirname, '../cache/getWinners.json'); // On définit le chemin du fichier JSON
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

        const data = await getFromErgast('driverstandings/1.json?limit=500');
        const standingsLists = data.MRData.StandingsTable.StandingsLists;

        // Object pour stocker les données des pilotes avec le nombre de victoires
        let winners = {};

        standingsLists.forEach(standingList => {
            annee = standingList.season;
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
        // Écrire les données dans un fichier JSON
        fs.writeFile(filePath, dataJSON, (err) => {
            if (err) {
                console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
            } else {
                console.log('Les données ont été écrites avec succès dans le fichier JSON.');
            }
        });

        return winnersArray;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getWinners;
