const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific driver
 * @async
 * @param {String} driver_id 
 * @returns {Array}
 */
async function getDriverData(driver_id) {
    try {
        const driverDataFilePath = path.join(__dirname, '../../data/all_drivers_stats.json');
        const driverData = JSON.parse(fs.readFileSync(driverDataFilePath, 'utf-8'));
        const targetedDriverInformation = driverData.filter(item => item.driverId === driver_id)[0];
        const driverInformation = {
            id: targetedDriverInformation.driverId,
            firstName: targetedDriverInformation.firstName,
            lastName: targetedDriverInformation.lastName,
            dateOfBirth: targetedDriverInformation.dateOfBirth,
            dateOfDeath: targetedDriverInformation.dateOfDeath,
            age: targetedDriverInformation.age,
            nationality: targetedDriverInformation.nationality,
            permanentNumber: targetedDriverInformation.permanentNumber,
            firstYear: targetedDriverInformation.firstYear,
            numberOfSeasons: targetedDriverInformation.numberOfSeasons,
            totalRaceStarts: targetedDriverInformation.totalRaceStarts,
            totalRaceWins: targetedDriverInformation.totalRaceWins,
            totalPodiums: targetedDriverInformation.totalPodiums,
            totalPoints: targetedDriverInformation.totalPoints,
            totalPolePositions: targetedDriverInformation.totalPolePositions,
            totalFastestLaps: targetedDriverInformation.totalFastestLaps,
            totalDriverOfTheDay: targetedDriverInformation.totalDriverOfTheDay,
            bestStartingGridPosition: targetedDriverInformation.bestStartingGridPosition,
            bestRaceResult: targetedDriverInformation.bestRaceResult,
            bestChampionshipPosition: targetedDriverInformation.bestChampionshipPosition,
            totalChampionshipWins: targetedDriverInformation.totalChampionshipWins,
            teams: targetedDriverInformation.teamsOfDriver,
            currentSeasonDriver: targetedDriverInformation.isCurrentSeasonDriver,
            numberOfRacesCurrentSeason: targetedDriverInformation.racesThisSeason,
            numberOfWinsCurrentSeason: targetedDriverInformation.winsThisSeason,
            numberOfPodiumsCurrentSeason: targetedDriverInformation.podiumsThisSeason,
            numberOfPointsCurrentSeason: targetedDriverInformation.pointsThisSeason,
            actualTeam: targetedDriverInformation.currentTeamId,
            allVictories: targetedDriverInformation.victoriesByYear,
            victoryRatio: targetedDriverInformation.victoryRatio,
            podiumRatio: targetedDriverInformation.podiumRatio,
            poleRatio: targetedDriverInformation.poleRatio,
            allPointsData: targetedDriverInformation.pointsBySeason,
            allPositionsData: targetedDriverInformation.standingPositionBySeason
        }

        return driverInformation;
    } catch (error) {
        console.error('getDriverData, error during execution :', error);
        throw error;
    }
}

module.exports = getDriverData;