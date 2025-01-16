const fs = require('fs');
const path = require('path');

/**
 * Fonction pour ouvrir et lire un fichier JSON
 * @param {string} filePath - Chemin vers le fichier JSON
 * @returns {Promise<Object>} - Promesse qui résout les données JSON sous forme d'objet
 */
function openJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(filePath);

        fs.readFile(absolutePath, 'utf8', (err, data) => {
            if (err) {
                reject(new Error(`Erreur lors de la lecture du fichier: ${err.message}`));
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (parseError) {
                reject(new Error(`Erreur lors de l'analyse JSON: ${parseError.message}`));
            }
        });
    });
}

module.exports = openJsonFile;