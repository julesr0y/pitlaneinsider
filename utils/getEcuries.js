const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les identifiants de toutes les écuries à partir de l'API Ergast.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'identifiants d'écuries.
 */
async function getConstructorIds() {
    try {

        const filePath = path.join(__dirname, '../cache/getEcuries.json'); // On définit le chemin du fichier JSON
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

        const response = await getFromErgast('constructors.json?limit=212');
        const constructors = response.MRData.ConstructorTable.Constructors;

        // Array pour stocker les identifiants des écuries
        let constructorIds = [];

        constructors.forEach(constructor => {
            const name = constructor.name;
            const id = constructor.constructorId;
            const nationality = constructor.nationality;

            const Constructorsinfos = {
                name: name,
                id: id,
                nationality: nationality
            };
            constructorIds.push(Constructorsinfos);
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(constructorIds, null, 2);
        // Écrire les données dans un fichier JSON
        fs.writeFile(filePath, dataJSON, (err) => {
            if (err) {
                console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
            } else {
                console.log('Les données ont été écrites avec succès dans le fichier JSON.');
            }
        });

        return constructorIds;
    } catch (error) {
        console.error('Erreur lors de la récupération des identifiants des écuries:', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}
module.exports = getConstructorIds;
