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

        var allTeams = []
        data.forEach(function (team) {
            const teamData = {
                constructorId: team.constructorId,
                name: team.name,
                fullName: team.fullName
            }
            allTeams.push(teamData);
        })

        return allTeams;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroConstructors;