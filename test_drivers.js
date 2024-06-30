const fs = require('fs');
const path = require('path');

function getDrivers() {
    var currentDrivers = fs.readFileSync(path.join(__dirname, './data/f1db-seasons-entrants-drivers.json'), 'utf8');
    currentDrivers = JSON.parse(currentDrivers).filter(item => item.year === 2024 && item.testDriver === false);
    const currentDriversDetailedData = fs.readFileSync(path.join(__dirname, './data/f1db-drivers.json'), 'utf8');
    return currentDrivers.map(driver => {
        var driverData = JSON.parse(currentDriversDetailedData).find(item => item.id === driver.driverId);
        return {
            id: driverData.id || "Unknown",
            firstName: driverData.firstName || "Unknown",
            lastName: driverData.lastName || "Unknown",
            permanentNumber: driverData.permanentNumber || "Unknown"
        }
    });
}

function getDriversStats(driverId) {
    const currentDriversDetailedData = fs.readFileSync(path.join(__dirname, './python/dataPython/all_drivers_stats.json'), 'utf8');
    var driverData = JSON.parse(currentDriversDetailedData).find(item => item.id === driverId);

    return {
        id: driverData.id,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        dateOfBirth: driverData.dateOfBirth,
        nationality: driverData.nationality,
        permanentNumber: driverData.permanentNumber,
        totalRaceStarts: driverData.totalRaceStarts,
        totalRaceWins: driverData.totalRaceWins,
        totalPodiums: driverData.totalPodiums,
        totalPoints: driverData.totalPoints,
        totalPolePositions: driverData.totalPolePositions,
        totalFastestLaps: driverData.totalFastestLaps,
        totalDriverOfTheDay: driverData.totalDriverOfTheDay,
        bestStartingGridPosition: driverData.bestStartingGridPosition,
        bestRaceResult: driverData.bestRaceResult,
        bestChampionshipPosition: driverData.bestChampionshipPosition,
        currentSeasonDriver: driverData.currentSeasonDriver,
        numberOfRacesCurrentSeason: driverData.numberOfRacesCurrentSeason,
        numberOfWinsCurrentSeason: driverData.numberOfWinsCurrentSeason,
        numberOfPodiumsCurrentSeason: driverData.numberOfPodiumsCurrentSeason,
        numberOfPointsCurrentSeason: driverData.numberOfPointsCurrentSeason,
        actualTeam: driverData.actualTeam,
        allVictories: driverData.allVictories
    }
}

// getDrivers();
console.log(getDriversStats("charles-leclerc"));