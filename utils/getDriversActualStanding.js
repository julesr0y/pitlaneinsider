const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer le classement actuel des pilotes
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau de tableaux : 0, Nom et prénom du pilote; 1, id de l'écurie; 2, Position du pilote dans le classement; 3, Nombre de points; 4, Nombre de victoires, 5, id du pilote, 6, code du pilote, 7, numéro du pilote
 */
async function getDriversActualStandings(update) {
    const filePath = path.join(__dirname, '../cache/getDriversActualStandings.json'); // Chemin du fichier JSON principal
    const filePathUpdate = path.join(__dirname, '../cache/updates/getDriversActualStandings.json'); // Chemin du fichier JSON de mise à jour

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
        const driversActualStandings = await getFromErgast('current/driverStandings.json'); // Récupérer les données du classement actuel des pilotes

        const driversStandings = driversActualStandings.MRData.StandingsTable.StandingsLists[0]; // Récupérer le classement
        var position = 1;
        var classementDriversFront = []; // Tableau pour stocker les pilotes du classement

        driversStandings.DriverStandings.forEach(driver => { // Pour chaque pilote du classement
            const pilote = {
                nom: driver.Driver.familyName,
                prenom: driver.Driver.givenName,
                equipe: driver.Constructors[0].name,
                equipe_id: driver.Constructors[0].constructorId,
                position: position,
                points: driver.points,
                victoires: driver.wins,
                pilote_id: driver.Driver.driverId,
                code: driver.Driver.code,
                numero: driver.Driver.permanentNumber
            };
            classementDriversFront.push(pilote); // Ajouter les informations du pilote au tableau principal
            position++; // Incrémenter la position
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(classementDriversFront, null, 2);

        // Vérifier si les données récupérées depuis l'API ne sont pas vides
        if (classementDriversFront.length === 0) {
            // Si les données de l'API sont vides, copier les données de filePath dans filePathUpdate
            if (fs.existsSync(filePath)) {
                const originalData = fs.readFileSync(filePath, 'utf8');
                if (originalData) {
                    fs.writeFileSync(filePathUpdate, originalData);
                }
            }
        } else {
            // Vider et écrire les données dans le fichier de mise à jour
            fs.writeFileSync(filePathUpdate, dataJSON);
            // Vider et écrire les données dans le fichier principal
            fs.writeFileSync(filePath, dataJSON);
        }
    }

    return;
}

module.exports = getDriversActualStandings;
