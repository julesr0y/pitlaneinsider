const fs = require('fs');
const path = require('path');

/**
 * @description Returns all constructors from the actual season
 * @async
 * @returns {Array}
 */
async function getActualConstructors() {
    try {
        const constructorDataFilePath = path.join(__dirname, '../../data/all_teams_stats.json');
        const constructorData = JSON.parse(fs.readFileSync(constructorDataFilePath, 'utf-8'));

        var constructorsFrontData = [];
        var actualSeasonConstructors = constructorData.filter(item => item.currentSeasonTeam == true);
        actualSeasonConstructors.forEach(function (constructor) {
            const constructorInfomation = {
                constructorId: constructor.constructorId,
                name: constructor.name,
                fullName: constructor.fullName
            };
            constructorsFrontData.push(constructorInfomation);
        })

        return constructorsFrontData;
    } catch (error) {
        console.error('getActualConstructors, error during execution :', error);
        throw error;
    }
}

module.exports = getActualConstructors;