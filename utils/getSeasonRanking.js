const getFromErgast = require("./getFromErgast");

/**
    * @function
    * @description Fonction permettant de récupérer le classement d'une saison
    * @param {string} season_id
    * @returns {Promise<Array>}
    */
async function getSeasonRanking(season_id) {
    try {
        const dataSeasonRanking = await getFromErgast(`${season_id}/driverstandings.json?limit=500`);
        const standingsLists = dataSeasonRanking.MRData.StandingsTable.StandingsLists;

        let ranking = [];

        standingsLists.forEach(standingsList => {
            standingsList.DriverStandings.forEach(driverStanding => {
                const driver = driverStanding.Driver;
                const wins = driverStanding.wins;
                const points = driverStanding.points;

                const driverInfo = {
                    position: driverStanding.position,
                    firstname: driver.givenName,
                    lastname: driver.familyName,
                    wins: wins,
                    points: points
                };

                ranking.push(driverInfo);
            });
        });
        return ranking;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getSeasonRanking;
