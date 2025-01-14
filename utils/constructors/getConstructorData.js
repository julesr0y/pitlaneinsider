const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific constructor
 * @async
 * @param {String} constructorId_param
 * @returns {Array}
 */
async function getConstructorData(constructorId_param) {
    try {
        const filePath = path.join(__dirname, '../../data/all_teams_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file);
        data = data.filter(item => item.constructorId === constructorId_param);
        data = data[0]
        const constructorData = {
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
            currentDrivers: data['currentDrivers'],
            currentCarName: data['currentCarName']
        }

        return constructorData;
    } catch (error) {
        console.error('getConstructorData, error during execution :', error);
        throw error;
    }
}

module.exports = getConstructorData;