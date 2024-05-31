const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
    * @function
    * @description Fonction permettant de récupérer le classement actuel des pilotes
    * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau de tableaux : 0, Nom et prénom du pilote; 1, id de l'écurie; 2, Position du pilote dans le classement; 3, Nombre de points; 4, Nombre de victoires, 5, id du pilote, 6, code du pilote, 7, numéro du pilote
    */
async function getDriversActualStandings() {
    const filePath = path.join(__dirname, '../cache/getDriversActualStandings.json'); // On définit le chemin du fichier JSON
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

    const driversActualStandings = await getFromErgast('current/driverStandings.json'); // On récupère les données du classement actuel des pilotes

    const driversStandings = driversActualStandings.MRData.StandingsTable.StandingsLists[0]; // On récupère le classement
    var position = 1;
    var classementDriversFront = []; // On créé un tableau pour stocker les pilotes du classement
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
        classementDriversFront.push(pilote); // On ajoute le sous tableau des informations du classement du pilote au tableau principal
        position++; // On incrémente la position
    });

    // Convertir les données en chaîne JSON
    const dataJSON = JSON.stringify(classementDriversFront, null, 2);
    // Écrire les données dans un fichier JSON
    fs.writeFile(filePath, dataJSON, (err) => {
        if (err) {
            console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
        } else {
            console.log('Les données ont été écrites avec succès dans le fichier JSON.');
        }
    });

    return classementDriversFront; // On retourne le tableau contenant les informations des pilotes
}

module.exports = getDriversActualStandings;