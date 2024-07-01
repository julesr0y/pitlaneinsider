const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
    * @function
    * @description Fonction permettant de récupérer les données d'un pilote
    * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un objet JSON : name, surname, birthDate, age, permanentNumber, nationality
    */
async function getDriverData(driver_id) {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file); // On définit le chemin du fichier JSON
        data = data.filter(item => item.id === driver_id);
        var driverData = {
            id: data[0].id,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            dateOfBirth: data[0].dateOfBirth,
            nationality: data[0].nationality,
            permanentNumber: data[0].permanentNumber,
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
            currentSeasonDriver: data[0].currentSeasonDriver,
            numberOfRacesCurrentSeason: data[0].numberOfRacesCurrentSeason,
            numberOfWinsCurrentSeason: data[0].numberOfWinsCurrentSeason,
            numberOfPodiumsCurrentSeason: data[0].numberOfPodiumsCurrentSeason,
            numberOfPointsCurrentSeason: data[0].numberOfPointsCurrentSeason,
            actualTeam: data[0].actualTeam,
            allVictories: data[0].allVictories
        }

        return driverData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getDriverData;