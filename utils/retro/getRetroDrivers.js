const fs = require('fs');
const path = require('path');

/**
 * @description Returns all drivers from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroDrivers() {
    try {
        const driversDataFilePath = path.join(__dirname, '../../data/all_drivers_stats.json');
        const driversData = JSON.parse(fs.readFileSync(driversDataFilePath, 'utf-8'));

        var driversFrontData = [];
        driversData.forEach(item => {
            const driverInfo = {
                firstName: item.firstName,
                lastName: item.lastName,
                dateOfBirth: item.dateOfBirth,
                nationality: item.nationality,
                driverId: item.driverId
            };

            driversFrontData.sort((a, b) => {
                const dateA = new Date(a.dateOfBirth);
                const dateB = new Date(b.dateOfBirth);
        
                return dateB - dateA;
            });

            driversFrontData.push(driverInfo);
        });

        return driversFrontData;
    } catch (error) {
        console.error('getRetroDrivers, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroDrivers;
