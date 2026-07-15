const fs = require('fs');
const path = require('path');

// Load f1db data in memory
const driversData = require('../../data/f1db/f1db-drivers.json');
const entrantsDriversData = require('../../data/f1db/f1db-seasons-entrants-drivers.json');

/**
 * @description Returns all drivers from the actual season using native f1db fields
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
            'racing-bulls',
            'haas',
            'williams',
            'audi',
            'cadillac'
        ];

        const currentYear = 2026;

        // Get all entrants for drivers in 2026, excluding test drivers
        const currentSeasonEntrants = entrantsDriversData.filter(item => item.year === currentYear && item.testDriver === false);

        const driversDataFront = [];

        currentSeasonEntrants.forEach((entrant) => {
            const driverObj = driversData.find(d => d.id === entrant.driverId);
            if (driverObj) {
                // Ensure we don't duplicate a driver if they drove for two teams in the same year.
                // We'll take the first one or just add them. Usually in the current season they have 1 entry, or 2 if they moved.
                // If they moved, we might want to just keep the most recent? Let's just push for now.
                if (!driversDataFront.find(d => d.driver.id === driverObj.id)) {
                    driversDataFront.push({
                        driver: driverObj,
                        currentSeason: {
                            constructorId: entrant.constructorId
                        }
                    });
                }
            }
        });

        // sort drivers by their teams
        driversDataFront.sort((a, b) => {
            if (a.currentSeason.constructorId < b.currentSeason.constructorId) {
                return -1;
            }
            if (a.currentSeason.constructorId > b.currentSeason.constructorId) {
                return 1;
            }
            return 0;
        });

        // sort teams
        driversDataFront.sort((a, b) => {
            return (
                teamOrder.indexOf(a.currentSeason.constructorId) -
                teamOrder.indexOf(b.currentSeason.constructorId)
            );
        });

        return driversDataFront;
    } catch (error) {
        console.error('getActualDrivers, error during execution :', error);
        throw error;
    }
}

module.exports = getActualDrivers;
