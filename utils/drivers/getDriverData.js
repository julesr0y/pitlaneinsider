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
        const filePath = path.join(__dirname, '../../data/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file);
        data = data.filter(item => item.driverId === driver_id);
        var driverData = {
            id: data[0].driverId,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            dateOfBirth: data[0].dateOfBirth,
            dateOfDeath: data[0].dateOfDeath,
            age: data[0].age,
            nationality: data[0].nationality,
            permanentNumber: data[0].permanentNumber,
            firstYear: data[0].firstYear,
            numberOfSeasons: data[0].numberOfSeasons,
            totalRaceStarts: data[0].totalRaceStarts,
            totalRaceWins: data[0].totalRaceWins,
            totalPodiums: data[0].totalPodiums,
            totalPoints: data[0].totalPoints,
            totalPolePositions: data[0].totalPolePositions,
            totalFastestLaps: data[0].totalFastestLaps,
            totalDriverOfTheDay: data[0].totalDriverOfTheDay,
            bestStartingGridPosition: data[0].bestStartingGridPosition,
            bestRaceResult: data[0].bestRaceResult,
            bestChampionshipPosition: data[0].bestChampionshipPosition,
            totalChampionshipWins: data[0].totalChampionshipWins,
            teams: data[0].teamsOfDriver,
            currentSeasonDriver: data[0].isCurrentSeasonDriver,
            numberOfRacesCurrentSeason: data[0].racesThisSeason,
            numberOfWinsCurrentSeason: data[0].winsThisSeason,
            numberOfPodiumsCurrentSeason: data[0].podiumsThisSeason,
            numberOfPointsCurrentSeason: data[0].pointsThisSeason,
            actualTeam: data[0].currentTeamId,
            allVictories: data[0].victoriesByYear,
            victoryRatio: data[0].victoryRatio,
            podiumRatio: data[0].podiumRatio,
            poleRatio: data[0].poleRatio,
            allPointsData: data[0].pointsBySeason,
            allPositionsData: data[0].standingPositionBySeason
        }

        return driverData;
    } catch (error) {
        console.error('getDriverData, error during execution :', error);
        throw error;
    }
}

module.exports = getDriverData;