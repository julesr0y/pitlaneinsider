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
        const filePath = path.join(__dirname, '../../python/dataPython/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file);
        data = data.filter(item => item.id === driver_id);
        var driverData = {
            id: data[0].id,
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
            teams: data[0].teams,
            currentSeasonDriver: data[0].currentSeasonDriver,
            numberOfRacesCurrentSeason: data[0].numberOfRacesCurrentSeason,
            numberOfWinsCurrentSeason: data[0].numberOfWinsCurrentSeason,
            numberOfPodiumsCurrentSeason: data[0].numberOfPodiumsCurrentSeason,
            numberOfPointsCurrentSeason: data[0].numberOfPointsCurrentSeason,
            actualTeam: data[0].actualTeam,
            allVictories: data[0].allVictories,
            victoryRatio: data[0].victoryRatio,
            podiumRatio: data[0].podiumRatio,
            poleRatio: data[0].poleRatio,
            allPointsData: data[0].allPointsData,
            allPositionsData: data[0].allPositionsData
        }

        return driverData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getDriverData;