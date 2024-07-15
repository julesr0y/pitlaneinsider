const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific constructor
 * @async
 * @param {String} teamId 
 * @returns {Array}
 */
async function getConstructorData(teamId) {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_teams_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file);
        data = data.filter(item => item.constructorId === teamId);
        data = data[0]
        var teamData = {
            constructorId: data['constructorId'],
            fullName: data['fullName'],
            name: data['name'],
            country: data['countryId'],
            currentSeasonTeam: data['currentSeasonTeam'],
            totalRaceStarts: data['totalRaceStarts'],
            totalRaceWins: data['totalRaceWins'],
            totalPodiumRaces: data['totalPodiumRaces'],
            totalChampionshipPoints: data['totalChampionshipPoints'],
            totalPolePositions: data['totalPolePositions'],
            totalFastestLaps: data['totalFastestLaps'],
            totalChampionshipWins: data['totalChampionshipWins'],
            totalRaceLaps: data['totalRaceLaps'],
            firstYear: data['firstYear'],
            numberOfSeasons: data['numberOfSeasons'],
            victoryRatio: data['victoryRatio'],
            podiumRatio: data['podiumRatio'],
            poleRatio: data['poleRatio'],
            currentCarId: data['currentCarId'],
            currentCarName: data['currentCarName']
        }

        return teamData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getConstructorData;