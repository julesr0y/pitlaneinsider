const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les identifiants de tous les circuits à partir de l'API Ergast.
 * @param {boolean} update - Détermine si les données doivent être mises à jour.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque circuit avec son nom, pays et identifiant.
 */
async function getCircuitIds(update) {
    try {
        const filePath = path.join(__dirname, '../cache/getRetroCircuits.json'); // On définit le chemin du fichier JSON
        const filePathUpdate = path.join(__dirname, '../cache/updates/getRetroCircuits.json'); // Chemin du fichier JSON de mise à jour

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
        const response = await getFromErgast('circuits.json?limit=77');
        const circuits = response.MRData.CircuitTable.Circuits;

        // Array pour stocker les informations des circuits
        let circuitInfos = [];

        circuits.forEach(circuit => {
            const name = circuit.circuitName;
            const pays = circuit.Location.country;
            const id = circuit.circuitId;

            const circuitInfo = {
                name: name,
                pays: pays,
                id: id
            };
            circuitInfos.push(circuitInfo);
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(circuitInfos, null, 2);

        // Écrire les données dans le fichier JSON de mise à jour
        fs.writeFileSync(filePathUpdate, dataJSON);

        // Copier les données du fichier de mise à jour vers le fichier principal
        fs.copyFileSync(filePathUpdate, filePath);

        return;
    } catch (error) {
        console.error('Erreur lors de la récupération des identifiants des circuits :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getCircuitIds;
