const fs = require('fs');
const path = require('path');

/**
 * @description Returns drivers championship standings from actual season
 * @async
 * @returns {Array}
 */
async function getDriversActualStandings() {
    try {
        const { currentYear } = require('../../config.json');
        
        // F1DB Files
        const races = require('../../data/f1db/f1db-races.json').filter(r => r.year === currentYear);
        const results = require('../../data/f1db/f1db-races-race-results.json');
        const driverStandings = require('../../data/f1db/f1db-seasons-driver-standings.json').filter(s => s.year === currentYear);
        const drivers = require('../../data/f1db/f1db-drivers.json');
        
        const getDriver = (id) => drivers.find(d => d.id === id) || {};

        let formattedDriverStandings = driverStandings.sort((a, b) => a.positionNumber - b.positionNumber).map(s => {
            const d = getDriver(s.driverId);
            return {
                ...s,
                driver: d,
                position: s.positionNumber,
                firstName: d.firstName,
                lastName: d.lastName,
                constructorId: results.find(r => r.driverId === s.driverId && r.raceId >= races[0]?.id)?.constructorId || 'default'
            };
        });

        return formattedDriverStandings;
    } catch (error) {
        console.error('getDriversActualStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getDriversActualStandings;
