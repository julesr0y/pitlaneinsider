const fs = require('fs');
const path = require('path');

/**
 * @description Returns all drivers from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroDrivers() {
    try {
        const filePath = path.join(__dirname, '../../data/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        var drivers = [];
        data.forEach(item => {
            const driver = {
                firstName: item.firstName,
                lastName: item.lastName,
                dateOfBirth: item.dateOfBirth,
                nationality: item.nationality,
                driverId: item.id
            };

            drivers.push(driver);
        });

        return drivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroDrivers;
