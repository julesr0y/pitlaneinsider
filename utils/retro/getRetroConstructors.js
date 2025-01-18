const fs = require('fs');
const path = require('path');

/**
 * @description Returns all constructors from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroConstructors() {
    try {
        const constructorsDataFilePathfilePath = path.join(__dirname, '../../data/all_teams_stats.json');
        const constructorsData = JSON.parse(fs.readFileSync(constructorsDataFilePathfilePath, 'utf-8'));

        var constructorsFrontData = []
        constructorsData.forEach(function (constructor) {
            const constructorInfo = {
                constructorId: constructor.constructorId,
                name: constructor.name,
                fullName: constructor.fullName
            }
            constructorsFrontData.push(constructorInfo);
        })

        return constructorsFrontData;
    } catch (error) {
        console.error('getRetroConstructors, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroConstructors;