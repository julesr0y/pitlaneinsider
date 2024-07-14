const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @description Returns all drivers from the actual season
 * @async
 * @returns {Array} 
 */
async function getActualDrivers() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_drivers_stats.json');
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

module.exports = getActualDrivers;