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
        const constructorDataFilePath = path.join(__dirname, '../../data/all_teams_stats.json');
        const constructorData = JSON.parse(fs.readFileSync(constructorDataFilePath, 'utf-8'));
        const targetedConstructorInformation = constructorData.filter(item => item.constructorId === constructorId_param)[0];
        const constructorFrontData = {
            constructorId: targetedConstructorInformation['constructorId'],
            fullName: targetedConstructorInformation['fullName'],
            name: targetedConstructorInformation['name'],
            country: targetedConstructorInformation['countryId'],
            currentSeasonTeam: targetedConstructorInformation['currentSeasonTeam'],
            totalRaceStarts: targetedConstructorInformation['totalRaceStarts'],
            totalRaceWins: targetedConstructorInformation['totalRaceWins'],
            totalPodiumRaces: targetedConstructorInformation['totalPodiumRaces'],
            totalChampionshipPoints: targetedConstructorInformation['totalChampionshipPoints'],
            totalPolePositions: targetedConstructorInformation['totalPolePositions'],
            totalFastestLaps: targetedConstructorInformation['totalFastestLaps'],
            totalChampionshipWins: targetedConstructorInformation['totalChampionshipWins'],
            totalRaceLaps: targetedConstructorInformation['totalRaceLaps'],
            firstYear: targetedConstructorInformation['firstYear'],
            numberOfSeasons: targetedConstructorInformation['numberOfSeasons'],
            victoryRatio: targetedConstructorInformation['victoryRatio'],
            podiumRatio: targetedConstructorInformation['podiumRatio'],
            poleRatio: targetedConstructorInformation['poleRatio'],
            currentCarId: targetedConstructorInformation['currentCarId'],
            currentDrivers: targetedConstructorInformation['currentDrivers'],
            currentCarName: targetedConstructorInformation['currentCarName']
        }

        return constructorFrontData;
    } catch (error) {
        console.error('getConstructorData, error during execution :', error);
        throw error;
    }
}

module.exports = getConstructorData;