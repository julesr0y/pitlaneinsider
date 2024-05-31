const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
    * @function
    * @description Fonction permettant de récupérer le classement actuel des écuries
    * @returns {Promise}
    */
async function getTeamsActualStandings() {
    const filePath = path.join(__dirname, '../cache/getTeamsActualStandings.json'); // On définit le chemin du fichier JSON
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

    const teamsActualStandings = await getFromErgast('current/constructorStandings.json'); // On récupère les données du classement actuel des écuries

    const teamsStandings = teamsActualStandings.MRData.StandingsTable.StandingsLists[0]; // On récupère le classement
    var position = 1;
    var classementTeamsFront = []; // On créé un tableau pour stocker les pilotes du classement
    teamsStandings.ConstructorStandings.forEach(team => { // Pour chaque pilote du classement
        const equipe = {
            nom: team.Constructor.name,
            equipe_id: team.Constructor.constructorId,
            position: position,
            points: team.points
        };
        classementTeamsFront.push(equipe); // On ajoute le sous tableau des informations du classement du pilote au tableau principal
        position++; // On incrémente la position
    });

    // Convertir les données en chaîne JSON
    const dataJSON = JSON.stringify(classementTeamsFront, null, 2);
    // Écrire les données dans un fichier JSON
    fs.writeFile(filePath, dataJSON, (err) => {
        if (err) {
            console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
        } else {
            console.log('Les données ont été écrites avec succès dans le fichier JSON.');
        }
    });

    return classementTeamsFront; // On retourne le tableau contenant les informations des pilotes
}

module.exports = getTeamsActualStandings;