const fs = require('fs');
const path = require('path');

/**
 * @description Returns all drivers from the actual season
 * @async
 * @returns {Array} 
 */
async function getActualDrivers() {
    try {
        const teamOrder = ['red-bull', 'mclaren', 'ferrari', 'mercedes', 'aston-martin', 'rb', 'haas', 'kick-sauber', 'williams', 'alpine'];
        const filePath = path.join(__dirname, '../../data/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        var drivers = [];
        data.forEach(item => {
            if ((item.currentSeasonDriver === true && item.testDriver == false) || item.id == "franco-colapinto") {
                if (item.id != "logan-sargeant") {
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
            }
        });

        // sort drivers by their teams
        drivers.sort((a, b) => {
            if (a.constructorId < b.constructorId) {
                return -1;
            }
            if (a.constructorId > b.constructorId) {
                return 1;
            }
            return 0;
        });

        // sort teams
        drivers.sort((a, b) => {
            return teamOrder.indexOf(a.constructorId) - teamOrder.indexOf(b.constructorId);
        });

        return drivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getActualDrivers;