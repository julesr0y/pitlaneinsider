const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer la liste des pilotes actuels avec les détails de leur écurie
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau contenant les détails des pilotes et de leur écurie
 */
async function getActualPilotesWithConstructors(update) {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON
        var drivers = [];
        data.forEach(item => {
            if (item.currentSeasonDriver === true && item.testDriver == false) {
                const driver = {
                    id: item.id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    nationality: item.nationality,
                    permanentNumber: item.permanentNumber,
                    constructorId: item.actualTeam
                };

                drivers.push(driver); // Ajout du pilote au tableau
            }
        });

        return drivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getActualPilotesWithConstructors;
