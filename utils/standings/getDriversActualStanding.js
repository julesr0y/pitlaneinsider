const fs = require('fs');
const path = require('path');

/**
 * @description Returns drivers championship standings from actual season
 * @async
 * @returns {Array}
 */
async function getDriversActualStandings() {
    try {
        const driversActualStandingsDataFilePath = path.join(__dirname, '../../data/all_driver_standings.json');
        const driversActualStandingsData = JSON.parse(fs.readFileSync(driversActualStandingsDataFilePath, 'utf-8'));
        const targetedSeasonData = driversActualStandingsData.filter(race => race.year == 2026);

        return targetedSeasonData;
    } catch (error) {
        console.error('getDriversActualStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getDriversActualStandings;
