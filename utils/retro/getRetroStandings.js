const fs = require('fs');
const path = require('path');

/**
 * @description Returns standings of a specific season
 * @async
 * @param {String} season_id 
 * @returns {Array}
 */
async function getRetroStandings(season_id) {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_driver_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);

        var sortedData = data.filter(item => item.year == season_id);

        let ranking = [];
        sortedData.forEach(function (element) {
            const driverInfo = {
                position: element.position,
                firstName: element.firstName,
                lastName: element.lastName,
                points: element.points
            };

            ranking.push(driverInfo);
        })

        return ranking;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroStandings;