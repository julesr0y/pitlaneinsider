const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
 * @function
 * @description Fonction permettant de récupérer les infos des gp passés
 * @param {string} season_id
 * @param {string} gp_id
 * @returns {Promise<Array>}
 */
async function getGPDetail(season_id, gp_id) {
    try {
        console.log(`Fetching data for season ${season_id}, GP ${gp_id}`);
        const dataGP = await getFromErgast(`${season_id}/${gp_id}/results.json?limit=500`);

        if (!dataGP || !dataGP.MRData || !dataGP.MRData.RaceTable || !dataGP.MRData.RaceTable.Races) {
            throw new Error('Invalid data structure from Ergast API');
        }

        const GPs = dataGP.MRData.RaceTable.Races;

        // array pour stocker le classement des GP
        let gpDetails = [];

        GPs.forEach(GP => {
            GP.Results.forEach(result => {
                const position = result.position;
                const driver = result.Driver;
                const grid = result.grid;
                let time;

                if (result.Time) {
                    time = result.Time.time;
                } else if (result.status.includes("Finished")) {
                    time = "";
                } else if (!result.status.includes("Lap")) {
                    time = "DNF";
                } else {
                    time = result.status;
                }

                // Création d'un objet contenant les informations de la course
                const gpInfo = {
                    position: position,
                    fname: driver.givenName,
                    lname: driver.familyName,
                    grid: grid,
                    time: time
                };
                gpDetails.push(gpInfo); // Ajout des informations au tableau
            });
        });

        console.log(`Fetched ${gpDetails.length} entries for season ${season_id}, GP ${gp_id}`);
        return gpDetails;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getGPDetail;
