const fs = require('fs');
const path = require('path');

/**
 * @description Returns all drivers from the actual season
 * @async
 * @returns {Array}
 */
async function getActualDrivers() {
    try {
        const teamOrder = [
            'mclaren',
            'ferrari',
            'red-bull',
            'mercedes',
            'aston-martin',
            'alpine',
            'rb',
            'haas',
            'williams',
            'kick-sauber'
        ];
        const driversDataFilePath = path.join(__dirname, '../../data/all_drivers_stats.json');
        const driversData = JSON.parse(fs.readFileSync(driversDataFilePath, 'utf-8'));
        var driversDataFront = [];
        driversData.forEach((item) => {
            if (
                item.isCurrentSeasonDriver === true &&
                item.isTestDriver == false
            ) {
                const driverInformation = {
                    id: item.driverId,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    nationality: item.nationality,
                    permanentNumber: item.permanentNumber,
                    constructorId: item.currentTeamId,
                };

                driversDataFront.push(driverInformation);
            }
        });

        // sort drivers by their teams
        driversDataFront.sort((a, b) => {
            if (a.constructorId < b.constructorId) {
                return -1;
            }
            if (a.constructorId > b.constructorId) {
                return 1;
            }
            return 0;
        });

        // sort teams
        driversDataFront.sort((a, b) => {
            return (
                teamOrder.indexOf(a.constructorId) -
                teamOrder.indexOf(b.constructorId)
            );
        });

        return driversDataFront;
    } catch (error) {
        console.error('getActualDrivers, error during execution :', error);
        throw error;
    }
}

module.exports = getActualDrivers;
