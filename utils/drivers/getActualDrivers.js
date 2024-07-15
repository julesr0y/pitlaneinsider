const fs = require('fs');
const path = require('path');

/**
 * @description Returns all drivers from the actual season
 * @async
 * @returns {Array} 
 */
async function getActualDrivers() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
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

                drivers.push(driver);
            }
        });

        return drivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getActualDrivers;