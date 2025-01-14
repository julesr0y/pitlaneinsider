const fs = require('fs');
const path = require('path');

/**
 * @description Returns constructor's championship standings from the actual season
 * @async
 * @returns {Array}
 */
async function getConstructorsActualStandings() {
    try {
        const filePath = path.join(__dirname, '../../data/all_constructor_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        var thisYearConstructorsStandings = data.filter(race => race.year == 2024);
        return thisYearConstructorsStandings;
    } catch (error) {
        console.error('getConstructorsActualStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getConstructorsActualStandings;
