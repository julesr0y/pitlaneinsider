const fs = require('fs');
const path = require('path');

/**
 * @description Returns constructors championship standings from actual season
 * @async
 * @returns {Array}
 */
async function getConstructorsActualStandings() {
    try {
        const constructorsActualStandingsDataFilePath = path.join(__dirname, '../../data/all_constructor_standings.json');
        const constructorsActualStandingsData = JSON.parse(fs.readFileSync(constructorsActualStandingsDataFilePath, 'utf-8'));
        const targetedSeasonData = constructorsActualStandingsData.filter(race => race.year == 2025);

        return targetedSeasonData;
    } catch (error) {
        console.error('getConstructorsActualStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getConstructorsActualStandings;
