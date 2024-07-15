const fs = require('fs');
const path = require('path');

/**
 * @description Returns constructor's championship standings from the actual season
 * @async
 * @returns {Array}
 */
async function getConstructorsActualStandings() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_constructor_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        var thisYearConstructorsStandings = data.filter(race => race.year == 2024);
        return thisYearConstructorsStandings;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getConstructorsActualStandings;
