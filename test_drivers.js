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
    const currentDriversDetailedData = fs.readFileSync(path.join(__dirname, './data/f1db-drivers.json'), 'utf8');
    const allRacesResults = fs.readFileSync(path.join(__dirname, './data/f1db-races-race-results.json'), 'utf-8');
    var victoriesLocalisationAndYear = JSON.parse(allRacesResults).filter(item => item.driverId === driverId && item.positionNumber === 1);
    var driverData = JSON.parse(currentDriversDetailedData).find(item => item.id === driverId);
    return {
        id: driverData.id || "Unknown",
        firstName: driverData.firstName || "Unknown",
        lastName: driverData.lastName || "Unknown",
        dateOfBirth: driverData.dateOfBirth || "Unknown",
        permanentNumber: driverData.permanentNumber || "Unknown",
        totalRaceStarts: driverData.totalRaceStarts || "Unknown",
        totalRaceWins: driverData.totalRaceWins || "Unknown",
        totalPodiums: driverData.totalPodiums || "Unknown",
        totalPoints: driverData.totalPoints || "Unknown",
        totalPolePositions: driverData.totalPolePositions || "Unknown",
        totalFastestLaps: driverData.totalFastestLaps || "Unknown",
        totalDriverOfTheDay: driverData.totalDriverOfTheDay || "Unknown",
        bestStartingGridPosition: driverData.bestStartingGridPosition || "Unknown",
        bestRaceResult: driverData.bestRaceResult || "Unknown",
        bestChampionshipPosition: driverData.bestChampionshipPosition || "Unknown",
        allVictories: victoriesLocalisationAndYear
    }
}

// getDrivers();
console.log(getDriversStats("lando-norris"));