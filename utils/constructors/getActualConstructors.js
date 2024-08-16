const fs = require('fs');
const path = require('path');

/**
 * @description Returns all constructors from the actual season
 * @async
 * @returns {Array}
 */
async function getActualConstructors() {
    try {
        const filePath = path.join(__dirname, '../../data/all_teams_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const constructors = JSON.parse(file);

        var actualTeams = []
        var actualSeasonConstructors = constructors.filter(item => item.currentSeasonTeam == true);
        actualSeasonConstructors.forEach(function (team) {
            const teamData = {
                constructorId: team.constructorId,
                name: team.name,
                fullName: team.fullName
            }
            actualTeams.push(teamData);
        })

        return actualTeams;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getActualConstructors;