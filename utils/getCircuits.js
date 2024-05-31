const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les identifiants de tous les circuits à partir de l'API Ergast.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'identifiants de circuits.
 */
async function getCircuitIds() {
    try {

        const filePath = path.join(__dirname, '../cache/getRetroCircuits.json'); // On définit le chemin du fichier JSON
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

        const response = await getFromErgast('circuits.json?limit=77');
        const circuits = response.MRData.CircuitTable.Circuits;

        // Array pour stocker les identifiants des circuits
        let circuitIds = [];

        circuits.forEach(circuit => {
            const name = circuit.circuitName;
            const pays = circuit.Location.country;
            const id = circuit.circuitId;

            const circuitInfos = {
                name: name,
                pays: pays,
                id: id
            };
            circuitIds.push(circuitInfos);
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(circuitIds, null, 2);
        // Écrire les données dans un fichier JSON
        fs.writeFile(filePath, dataJSON, (err) => {
            if (err) {
                console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
            } else {
                console.log('Les données ont été écrites avec succès dans le fichier JSON.');
            }
        });

        return circuitIds;
    } catch (error) {
        console.error('Erreur lors de la récupération des identifiants des circuits:', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getCircuitIds;
