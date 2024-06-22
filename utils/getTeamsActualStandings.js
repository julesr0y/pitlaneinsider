const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer le classement actuel des écuries de Formule 1
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque équipe avec son nom, identifiant, position et points.
 */
async function getTeamsActualStandings(update) {
    const filePath = path.join(__dirname, '../cache/getTeamsActualStandings.json'); // Chemin du fichier JSON de cache
    const filePathUpdate = path.join(__dirname, '../cache/updates/getTeamsActualStandings.json');

    if (!update) {
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
    } else {
        try {
            const teamsActualStandings = await getFromErgast('current/constructorStandings.json');
            const teamsStandings = teamsActualStandings.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

            // Traitement des données pour extraire les informations nécessaires
            const classementTeamsFront = teamsStandings.map((team, index) => ({
                nom: team.Constructor.name,
                equipe_id: team.Constructor.constructorId,
                position: index + 1,
                points: team.points
            }));

            // Convertir les données en chaîne JSON
            const dataJSON = JSON.stringify(classementTeamsFront, null, 2);

            // Vérifier si les données récupérées depuis l'API ne sont pas vides
            if (classementTeamsFront.length === 0) {
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

            return;
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
            throw error; // Propager l'erreur pour que le code appelant puisse la gérer
        }
    }
}

module.exports = getTeamsActualStandings;
