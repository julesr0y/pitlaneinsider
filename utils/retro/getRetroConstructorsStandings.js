const fs = require('fs');
const path = require('path');

/**
 * @description Returns constructors standings of a specific season
 * @async
 * @param {String} season_id 
 * @returns {Array}
 */
async function getRetroConstructorsStandings(season_id) {
    try {
        const constructorsStandingsDataFilePath = path.join(__dirname, '../../data/all_constructor_standings.json');
        const constructorsStandingsData = JSON.parse(fs.readFileSync(constructorsStandingsDataFilePath, 'utf-8'));
        const targetedSeasonData = constructorsStandingsData.filter(item => item.year == season_id);

        var constructorsStandingsFrontData = [];
        targetedSeasonData.forEach(function (element) {
            const constructorInfo = {
                constructorId: element.constructorId,
                constructorName: element.name,
                position: element.position,
                points: element.points
            };

            constructorsStandingsFrontData.push(constructorInfo);
        });

        return constructorsStandingsFrontData;
    } catch (error) {
        console.error('getRetroConstructorsStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroConstructorsStandings;