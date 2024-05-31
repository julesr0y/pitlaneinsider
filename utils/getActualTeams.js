const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
    * @function
    * @description Fonction permettant de récupérer les écuries de cette saison
    * @returns {Promise} - Promesse contenant la réponse de l'API.
    */
async function getActualTeams() {
    const filePath = path.join(__dirname, '../cache/getActualTeams.json'); // On définit le chemin du fichier JSON
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
    // Écrire les données dans un fichier JSON
    fs.writeFile(filePath, dataJSON, (err) => {
        if (err) {
            console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
        } else {
            console.log('Les données ont été écrites avec succès dans le fichier JSON.');
        }
    });

    return dataTeamFront;
}

module.exports = getActualTeams;