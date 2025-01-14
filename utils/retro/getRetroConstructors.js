const fs = require('fs');
const path = require('path');

/**
 * @description Returns all constructors from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroConstructors() {
    try {
        const filePath = path.join(__dirname, '../../data/all_teams_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);

        var allConstructors = []
        data.forEach(function (constructor) {
            const constructorData = {
                constructorId: constructor.constructorId,
                name: constructor.name,
                fullName: constructor.fullName
            }
            allConstructors.push(constructorData);
        })

        return allConstructors;
    } catch (error) {
        console.error('getRetroConstructors, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroConstructors;