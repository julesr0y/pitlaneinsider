const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les identifiants de toutes les écuries à partir de l'API Ergast.
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'identifiants d'écuries.
 */
async function getConstructorIds(update) {
    const filePath = path.join(__dirname, '../cache/getEcuries.json'); // Chemin du fichier JSON principal
    const filePathUpdate = path.join(__dirname, '../cache/updates/getEcuries.json'); // Chemin du fichier JSON de mise à jour

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
        try {
            const response = await getFromErgast('constructors.json?limit=212'); // Récupérer les données depuis l'API Ergast
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

            // Vérifier si les données récupérées depuis l'API ne sont pas vides
            if (constructorIds.length === 0) {
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
            console.error('Erreur lors de la récupération des identifiants des écuries:', error);
            throw error; // Propager l'erreur pour que le code appelant puisse la gérer
        }
    }

    // Lire les données finales depuis le fichier principal et les retourner
    const finalData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(finalData);
}

module.exports = getConstructorIds;
