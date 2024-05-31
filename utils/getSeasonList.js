const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
    * @function
    * @description Fonction permettant de récupérer la liste des saisons
    * @param {string} season_id
    * @returns {Promise<Array>}
    */
async function getSeasonList(season_id) {
    try {
        const dataSeasonList = await getFromErgast(`${season_id}/results.json?limit=500`);
        const races = dataSeasonList.MRData.RaceTable.Races;

        // array pour stocker le classement des saisons
        let seasons = [];

        races.forEach(race => {
            const year = race.season;
            const round = race.round;
            const name = race.raceName;
            const date = race.date;
            const loc = race.Circuit.Location.country;
            const win = race.Results[0];

            // Création d'un objet contenant les informations de la saison
            const seasonInfo = {
                year: year,
                round: round,
                name: name,
                date: date,
                country: loc,
                winfname: win.Driver.givenName,
                winlname: win.Driver.familyName
            };
            seasons.push(seasonInfo); // Ajout des informations au tableau
        });
        return seasons;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getSeasonList;
