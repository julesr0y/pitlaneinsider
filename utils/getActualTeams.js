const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les écuries de cette saison
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise} - Promesse contenant la réponse de l'API.
 */
async function getActualTeams(update) {
    const filePath = path.join(__dirname, '../cache/getActualTeams.json'); // On définit le chemin du fichier JSON
    const filePathUpdate = path.join(__dirname, '../cache/updates/getActualTeams.json');

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
        const dataTeam = await getFromErgast(`current/constructors.json`); // On récupère les données du calendrier actuel
        var dataTeamFront = []; // On créé un tableau vide
        var data = dataTeam.MRData.ConstructorTable.Constructors;
        data.forEach(element => { // Pour chaque élément du tableau
            dataTeamFront.push({ // On ajoute les données suivantes au tableau
                equipe: element.name,
                equipe_id: element.constructorId,
                equipe_nationalite: element.nationality
            });
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(dataTeamFront, null, 2);

        // Vérifier si les données récupérées depuis l'API ne sont pas vides
        if (dataTeamFront.length === 0) {
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

module.exports = getActualTeams;
