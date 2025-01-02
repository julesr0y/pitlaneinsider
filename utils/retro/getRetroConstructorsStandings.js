const fs = require('fs');
const path = require('path');

/**
 * @description Returns standings of a specific season
 * @async
 * @param {String} season_id 
 * @returns {Array}
 */
async function getRetroConstructorsStandings(season_id) {
    try {
        const filePath = path.join(__dirname, '../../data/all_constructor_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);

        var sortedData = data.filter(item => item.year == season_id);

        let ranking = [];
        sortedData.forEach(function (element) {
            const constructorInfo = {
                constructorId: element.constructorId,
                constructorName: element.name,
                position: element.position,
                points: element.points
            };

            ranking.push(constructorInfo);
        })

        return ranking;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroConstructorsStandings;