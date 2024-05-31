const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const { getCode } = require('country-list');

/**
    * @function
    * @description Fonction permettant de récupérer l'écurie actuelle d'un pilote
    * @returns {Promise} - Promesse contenant la réponse de l'API.
    */
async function getActualTeam(driver_id) {
    var dataTeam = await getFromErgast(`current/drivers/${driver_id}/driverStandings.json`); // On récupère les données du calendrier actuel
    return await new Promise((resolve, reject) => { // On créé la promesse
        const standings = dataTeam.MRData.StandingsTable.StandingsLists[0];
        const driver = standings.DriverStandings[0];
        const equipe = driver.Constructors[0].name;
        const equipe_id = driver.Constructors[0].constructorId;

        var dataTeamFront = {
            equipe: equipe,
            equipe_id: equipe_id
        };

        resolve(dataTeamFront); // On résout la promesse
    })
}

module.exports = getActualTeam;