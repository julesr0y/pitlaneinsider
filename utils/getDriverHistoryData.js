const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
 * @function
 * @description Fonction permettant de récupérer les données historiques d'un pilote, y compris les noms des Grands Prix remportés et les années correspondantes
 * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau :
 *   0: totalVictoires,
 *   1: totalPodiums,
 *   2: totalPoints,
 *   3: totalCourses,
 *   4: totalPoles,
 *   5: totalAbandons,
 *   6: moyennePoints,
 *   7: moyenneFinish,
 *   8: moyenneQualif,
 *   9: totalVictoiresThisSeason,
 *   10: totalPodiumsThisSeason,
 *   11: totalPointsThisSeason,
 *   12: totalCoursesThisSeason,
 *   13: firstSeason,
 *   14: grandsPrixRemportes (tableau de sous-tableaux contenant le nom du Grand Prix remporté et les années correspondantes)
 */
async function getDriverHistoryData(driver_id) {
    var driverHistoryData = await getFromErgast(`drivers/${driver_id}/results.json?limit=1000&offset=0`);
    const data = driverHistoryData.MRData.RaceTable.Races;

    var totalVictoires = 0;
    var totalPodiums = 0;
    var totalPoints = 0;
    var totalCourses = 0;
    var totalPoles = 0;
    var totalAbandons = 0;
    var totalPositions = 0;
    var totalGrids = 0;
    const currentYear = new Date().getFullYear();
    var totalVictoiresThisSeason = 0;
    var totalPodiumsThisSeason = 0;
    var totalPointsThisSeason = 0;
    var totalCoursesThisSeason = 0;
    var grandsPrixRemportes = [];

    data.forEach(race => {
        const position = parseInt(race.Results[0].position);
        const points = parseInt(race.Results[0].points);
        const grid = parseInt(race.Results[0].grid);
        const isCurrentSeason = race.season === currentYear.toString();

        if (position === 1) totalVictoires++;
        if (position <= 3) totalPodiums++;
        if (!isNaN(points)) {
            totalPoints += points;
            totalCourses++;
            if (isCurrentSeason) {
                totalPointsThisSeason += points;
                totalCoursesThisSeason++;
            }
        }
        if (grid === 1) totalPoles++;
        if (race.Results[0].status !== 'Finished' && !race.Results[0].status.includes('Lap')) totalAbandons++;
        if (!isNaN(position)) totalPositions += position;
        if (!isNaN(grid)) totalGrids += grid;
        if (position === 1 && isCurrentSeason) totalVictoiresThisSeason++;
        if (position === 1) {
            const grandPrix = race.raceName;
            const locality = (race.Circuit.Location.country).toLowerCase();
            const year = race.season;
            const foundGP = grandsPrixRemportes.find(gp => gp[0] === grandPrix);
            if (foundGP) {
                foundGP[2].push(year);
            } else {
                grandsPrixRemportes.push([grandPrix, locality, [year]]);
            }
        }
        if (position <= 3 && isCurrentSeason) totalPodiumsThisSeason++;
    });

    var moyennePoints = Math.round(totalPoints / totalCourses);
    var moyenneFinish = Math.round(totalPositions / data.length);
    var moyenneQualif = Math.round(totalGrids / data.length);
    var firstSeason = data[0].season;

    return {
        totalVictoires,
        totalPodiums,
        totalPoints,
        totalCourses,
        totalPoles,
        totalAbandons,
        moyennePoints,
        moyenneFinish,
        moyenneQualif,
        totalVictoiresThisSeason,
        totalPodiumsThisSeason,
        totalPointsThisSeason,
        totalCoursesThisSeason,
        firstSeason,
        grandsPrixRemportes
    };
}

module.exports = getDriverHistoryData;