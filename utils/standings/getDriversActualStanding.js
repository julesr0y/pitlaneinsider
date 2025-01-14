const fs = require('fs');
const path = require('path');

/**
 * @description Returns driver's championship standings from the actual season
 * @async
 * @returns {Array}
 */
async function getDriversActualStandings() {
    try {
        const filePath = path.join(__dirname, '../../data/all_driver_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        var thisYearDriversStandings = data.filter(race => race.year == 2024);
        return thisYearDriversStandings;
    } catch (error) {
        console.error('getDriversActualStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getDriversActualStandings;
